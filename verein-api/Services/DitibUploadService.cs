using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service for processing DITIB payment Excel uploads
/// </summary>
public class DitibUploadService : IDitibUploadService
{
    private readonly ApplicationDbContext _context;
    private readonly IExcelParserService _excelParser;
    private readonly ILogger<DitibUploadService> _logger;

    public DitibUploadService(
        ApplicationDbContext context,
        IExcelParserService excelParser,
        ILogger<DitibUploadService> logger)
    {
        _context = context;
        _excelParser = excelParser;
        _logger = logger;
    }

    /// <summary>
    /// Process uploaded DITIB payment Excel file
    /// </summary>
    public async Task<DitibUploadResponseDto> ProcessDitibUploadAsync(DitibUploadRequestDto request)
    {
        var response = new DitibUploadResponseDto();

        try
        {
            // Validate request
            if (request.File == null || request.File.Length == 0)
            {
                response.Message = "No file uploaded";
                response.Errors.Add("File is required");
                return response;
            }

            // Validate Verein exists
            var vereinExists = await _context.Vereine.AnyAsync(v => v.Id == request.VereinId);
            if (!vereinExists)
            {
                response.Message = "Verein not found";
                response.Errors.Add($"Verein with ID {request.VereinId} does not exist");
                return response;
            }

            // Validate BankKonto exists
            var bankKontoExists = await _context.Bankkonten.AnyAsync(b => b.Id == request.BankKontoId);
            if (!bankKontoExists)
            {
                response.Message = "BankKonto not found";
                response.Errors.Add($"BankKonto with ID {request.BankKontoId} does not exist");
                return response;
            }

            _logger.LogInformation("Processing DITIB upload for Verein {VereinId}, BankKonto {BankKontoId}",
                request.VereinId, request.BankKontoId);

            // Parse Excel file
            List<ExcelTransactionRow> transactions;
            using (var stream = request.File.OpenReadStream())
            {
                transactions = await _excelParser.ParseBankTransactionsAsync(stream);
            }

            if (!transactions.Any())
            {
                response.Message = "No valid transactions found in Excel file";
                response.Errors.Add("Excel file contains no valid transaction data");
                return response;
            }

            response.TotalRows = transactions.Count;
            _logger.LogInformation("Parsed {Count} transactions from Excel", transactions.Count);

            // Process each transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var excelRow in transactions)
                {
                    var detail = await ProcessDitibPaymentAsync(
                        excelRow,
                        request.VereinId,
                        request.BankKontoId);

                    response.Details.Add(detail);

                    if (detail.Status == "Success")
                        response.SuccessCount++;
                    else if (detail.Status == "Skipped")
                        response.SkippedCount++;
                    else
                        response.FailedCount++;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                response.Success = true;
                response.Message = $"Processed {response.SuccessCount} DITIB payments successfully, " +
                                 $"{response.FailedCount} failed, {response.SkippedCount} skipped";

                _logger.LogInformation("DITIB upload completed: {SuccessCount} success, {FailedCount} failed, {SkippedCount} skipped",
                    response.SuccessCount, response.FailedCount, response.SkippedCount);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error processing DITIB upload, transaction rolled back");
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ProcessDitibUploadAsync");
            response.Success = false;
            response.Message = "An error occurred during upload processing";
            response.Errors.Add(ex.Message);
        }

        return response;
    }

    /// <summary>
    /// Process a single DITIB payment row
    /// </summary>
    private async Task<DitibUploadDetailDto> ProcessDitibPaymentAsync(
        ExcelTransactionRow excelRow,
        int vereinId,
        int bankKontoId)
    {
        var detail = new DitibUploadDetailDto
        {
            RowNumber = excelRow.RowNumber,
            Zahlungsdatum = excelRow.Buchungsdatum,
            Betrag = excelRow.Betrag,
            Referenz = excelRow.Referenz
        };

        try
        {
            // Validate required fields
            if (!excelRow.Buchungsdatum.HasValue || !excelRow.Betrag.HasValue)
            {
                detail.Status = "Failed";
                detail.Message = "Missing required fields (Zahlungsdatum or Betrag)";
                return detail;
            }

            // Check for duplicate (same date, amount, and verein)
            var duplicate = await _context.VereinDitibZahlungen
                .AnyAsync(z =>
                    z.VereinId == vereinId &&
                    z.Zahlungsdatum == excelRow.Buchungsdatum.Value.Date &&
                    z.Betrag == excelRow.Betrag.Value);

            if (duplicate)
            {
                detail.Status = "Skipped";
                detail.Message = "Duplicate payment (same date and amount already exists)";
                return detail;
            }

            // Determine payment period from date (YYYY-MM format)
            var zahlungsperiode = excelRow.Buchungsdatum.Value.ToString("yyyy-MM");
            detail.Zahlungsperiode = zahlungsperiode;

            // Create BankBuchung
            var bankBuchung = new BankBuchung
            {
                VereinId = vereinId,
                BankKontoId = bankKontoId,
                Buchungsdatum = excelRow.Buchungsdatum.Value,
                Betrag = -Math.Abs(excelRow.Betrag.Value), // Negative for expense
                WaehrungId = 1, // EUR (default)
                Empfaenger = "DITIB",
                Verwendungszweck = $"DITIB Zahlung {zahlungsperiode}",
                Referenz = excelRow.Referenz?.Substring(0, Math.Min(100, excelRow.Referenz.Length)),
                StatusId = 1, // Active
                AngelegtAm = DateTime.UtcNow
            };

            _context.BankBuchungen.Add(bankBuchung);
            await _context.SaveChangesAsync(); // Save to get ID

            detail.BankBuchungId = bankBuchung.Id;

            // Create VereinDitibZahlung
            var ditibZahlung = new VereinDitibZahlung
            {
                VereinId = vereinId,
                Betrag = Math.Abs(excelRow.Betrag.Value), // Positive amount
                WaehrungId = 1, // EUR
                Zahlungsdatum = excelRow.Buchungsdatum.Value,
                Zahlungsperiode = zahlungsperiode,
                Zahlungsweg = "Banküberweisung",
                BankkontoId = bankKontoId,
                Referenz = excelRow.Referenz?.Substring(0, Math.Min(100, excelRow.Referenz.Length)),
                Bemerkung = "Importiert aus Excel",
                StatusId = 1, // BEZAHLT (Paid)
                BankBuchungId = bankBuchung.Id
            };

            _context.VereinDitibZahlungen.Add(ditibZahlung);
            await _context.SaveChangesAsync();

            detail.VereinDitibZahlungId = ditibZahlung.Id;
            detail.Status = "Success";
            detail.Message = $"DITIB payment created for period {zahlungsperiode}";

            _logger.LogDebug("Created DITIB payment {Id} for Verein {VereinId}, period {Period}",
                ditibZahlung.Id, vereinId, zahlungsperiode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing DITIB payment row {RowNumber}", excelRow.RowNumber);
            detail.Status = "Failed";
            detail.Message = $"Error: {ex.Message}";
        }

        return detail;
    }
}
