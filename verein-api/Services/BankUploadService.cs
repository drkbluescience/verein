using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Helper class for member matching
/// </summary>
internal class MemberMatchInfo
{
    public int Id { get; set; }
    public string Vorname { get; set; } = string.Empty;
    public string Nachname { get; set; } = string.Empty;
    public string Mitgliedsnummer { get; set; } = string.Empty;
}

/// <summary>
/// Service for processing bank transaction uploads
/// Handles Excel parsing, member matching, and database updates
/// </summary>
public class BankUploadService : IBankUploadService
{
    private readonly ApplicationDbContext _context;
    private readonly IExcelParserService _excelParser;
    private readonly ILogger<BankUploadService> _logger;

    public BankUploadService(
        ApplicationDbContext context,
        IExcelParserService excelParser,
        ILogger<BankUploadService> logger)
    {
        _context = context;
        _excelParser = excelParser;
        _logger = logger;
    }

    /// <summary>
    /// Process uploaded bank transaction Excel file
    /// </summary>
    public async Task<BankUploadResponseDto> ProcessBankUploadAsync(BankUploadRequestDto request)
    {
        var response = new BankUploadResponseDto
        {
            Success = false,
            Message = "Processing bank upload..."
        };

        try
        {
            // Validate request
            if (request.File == null || request.File.Length == 0)
            {
                response.Message = "No file uploaded";
                response.Errors.Add("File is required");
                return response;
            }

            // Validate file size (max 10MB)
            if (request.File.Length > 10 * 1024 * 1024)
            {
                response.Message = "File too large";
                response.Errors.Add("File size must be less than 10MB");
                return response;
            }

            // Validate file extension
            var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
            if (extension != ".xlsx" && extension != ".xls")
            {
                response.Message = "Invalid file format";
                response.Errors.Add("Only Excel files (.xlsx, .xls) are supported");
                return response;
            }

            // Verify Verein and BankKonto exist
            var vereinExists = await _context.Vereine.AnyAsync(v => v.Id == request.VereinId);
            if (!vereinExists)
            {
                response.Message = "Verein not found";
                response.Errors.Add($"Verein with ID {request.VereinId} does not exist");
                return response;
            }

            var bankKontoExists = await _context.Bankkonten
                .AnyAsync(b => b.Id == request.BankKontoId && b.VereinId == request.VereinId);
            if (!bankKontoExists)
            {
                response.Message = "Bank account not found";
                response.Errors.Add($"Bank account with ID {request.BankKontoId} does not exist for this Verein");
                return response;
            }

            _logger.LogInformation("Processing bank upload for Verein {VereinId}, BankKonto {BankKontoId}", 
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

            // Load all members for this Verein (for matching)
            var members = await _context.Mitglieder
                .Where(m => m.VereinId == request.VereinId && m.MitgliedStatusId == 1) // Active members only
                .Select(m => new MemberMatchInfo
                {
                    Id = m.Id,
                    Vorname = m.Vorname,
                    Nachname = m.Nachname,
                    Mitgliedsnummer = m.Mitgliedsnummer
                })
                .ToListAsync();

            _logger.LogInformation("Loaded {Count} active members for matching", members.Count);

            // Process each transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var excelRow in transactions)
                {
                    var detail = await ProcessTransactionAsync(
                        excelRow,
                        request.VereinId,
                        request.BankKontoId,
                        members);

                    response.Details.Add(detail);

                    if (detail.Status == "Success")
                        response.SuccessCount++;
                    else if (detail.Status == "Skipped")
                        response.SkippedCount++;
                    else if (detail.Status == "Unmatched")
                    {
                        response.UnmatchedCount++;
                        response.UnmatchedTransactions.Add(detail);
                    }
                    else
                        response.FailedCount++;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                response.Success = true;
                response.Message = $"Processed {response.SuccessCount} transactions successfully, " +
                                 $"{response.UnmatchedCount} unmatched, " +
                                 $"{response.FailedCount} failed, {response.SkippedCount} skipped";

                _logger.LogInformation("Bank upload completed: {SuccessCount} success, {UnmatchedCount} unmatched, {FailedCount} failed, {SkippedCount} skipped",
                    response.SuccessCount, response.UnmatchedCount, response.FailedCount, response.SkippedCount);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error processing transactions, rolling back");
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing bank upload");
            response.Success = false;
            response.Message = "Error processing bank upload";
            response.Errors.Add(ex.Message);
        }

        return response;
    }

    /// <summary>
    /// Process a single transaction row
    /// </summary>
    private async Task<BankUploadDetailDto> ProcessTransactionAsync(
        ExcelTransactionRow excelRow,
        int vereinId,
        int bankKontoId,
        List<MemberMatchInfo> members)
    {
        var detail = new BankUploadDetailDto
        {
            RowNumber = excelRow.RowNumber,
            Buchungsdatum = excelRow.Buchungsdatum,
            Betrag = excelRow.Betrag,
            Empfaenger = excelRow.Empfaenger,
            Verwendungszweck = excelRow.Verwendungszweck,
            Referenz = excelRow.Referenz
        };

        try
        {
            // Check for duplicate (same date, amount, reference)
            var isDuplicate = await _context.BankBuchungen
                .AnyAsync(b => 
                    b.VereinId == vereinId &&
                    b.BankKontoId == bankKontoId &&
                    b.Buchungsdatum == excelRow.Buchungsdatum &&
                    b.Betrag == excelRow.Betrag &&
                    b.Referenz == excelRow.Referenz);

            if (isDuplicate)
            {
                detail.Status = "Skipped";
                detail.Message = "Duplicate transaction (already exists)";
                return detail;
            }

            // Create BankBuchung
            var bankBuchung = new BankBuchung
            {
                VereinId = vereinId,
                BankKontoId = bankKontoId,
                Buchungsdatum = excelRow.Buchungsdatum!.Value,
                Betrag = excelRow.Betrag!.Value,
                WaehrungId = 1, // EUR (default)
                Empfaenger = excelRow.Empfaenger?.Substring(0, Math.Min(100, excelRow.Empfaenger.Length)),
                Verwendungszweck = excelRow.Verwendungszweck?.Substring(0, Math.Min(250, excelRow.Verwendungszweck.Length)),
                Referenz = excelRow.Referenz?.Substring(0, Math.Min(100, excelRow.Referenz.Length)),
                StatusId = 1, // Active
                AngelegtAm = DateTime.UtcNow
            };

            _context.BankBuchungen.Add(bankBuchung);
            await _context.SaveChangesAsync(); // Save to get ID

            detail.BankBuchungId = bankBuchung.Id;

            // Try to match member
            var matchedMember = MatchMember(excelRow, members);
            
            if (matchedMember != null)
            {
                detail.MitgliedId = matchedMember.Id;
                detail.MitgliedName = $"{matchedMember.Vorname} {matchedMember.Nachname}";

                // Create MitgliedZahlung
                var mitgliedZahlung = await CreateMitgliedZahlungAsync(
                    vereinId,
                    matchedMember.Id,
                    bankBuchung);

                detail.MitgliedZahlungId = mitgliedZahlung.Id;

                // Try to match and update Forderungen
                await MatchAndUpdateForderungenAsync(mitgliedZahlung);

                detail.Status = "Success";
                detail.Message = $"Transaction processed and matched to member {detail.MitgliedName}";
            }
            else
            {
                detail.Status = "Unmatched";
                detail.Message = "Transaction processed but no member match found - manual matching required";
                _logger.LogWarning("No member match found for transaction row {RowNumber}, BankBuchung {BankBuchungId}",
                    excelRow.RowNumber, bankBuchung.Id);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing transaction row {RowNumber}", excelRow.RowNumber);
            detail.Status = "Failed";
            detail.Message = $"Error: {ex.Message}";
        }

        return detail;
    }

    /// <summary>
    /// Match transaction to a member using member number or name
    /// </summary>
    private MemberMatchInfo? MatchMember(ExcelTransactionRow excelRow, List<MemberMatchInfo> members)
    {
        // Priority 1: Match by member number in reference or Verwendungszweck
        var referenceText = $"{excelRow.Referenz} {excelRow.Verwendungszweck}".ToLowerInvariant();
        foreach (var member in members)
        {
            if (!string.IsNullOrWhiteSpace(member.Mitgliedsnummer) && 
                referenceText.Contains(member.Mitgliedsnummer.ToLowerInvariant()))
            {
                _logger.LogDebug("Matched member by Mitgliedsnummer: {MemberId}", member.Id);
                return member;
            }
        }

        // Priority 2: Match by name (fuzzy matching)
        if (!string.IsNullOrWhiteSpace(excelRow.Empfaenger))
        {
            var empfaengerLower = excelRow.Empfaenger.ToLowerInvariant();
            var nameMatch = members.FirstOrDefault(m =>
                empfaengerLower.Contains(m.Nachname.ToLowerInvariant()) &&
                empfaengerLower.Contains(m.Vorname.ToLowerInvariant()));

            if (nameMatch != null)
            {
                _logger.LogDebug("Matched member by name: {MemberId}", nameMatch.Id);
                return nameMatch;
            }
        }

        _logger.LogDebug("No member match found for row {RowNumber}", excelRow.RowNumber);
        return null;
    }

    /// <summary>
    /// Create MitgliedZahlung from BankBuchung
    /// </summary>
    private async Task<MitgliedZahlung> CreateMitgliedZahlungAsync(
        int vereinId,
        int mitgliedId,
        BankBuchung bankBuchung)
    {
        var mitgliedZahlung = new MitgliedZahlung
        {
            VereinId = vereinId,
            MitgliedId = mitgliedId,
            ZahlungTypId = 1, // Default payment type (Aidat/Membership fee)
            Betrag = bankBuchung.Betrag,
            WaehrungId = bankBuchung.WaehrungId,
            Zahlungsdatum = bankBuchung.Buchungsdatum,
            Zahlungsweg = "Banküberweisung",
            BankkontoId = bankBuchung.BankKontoId,
            Referenz = bankBuchung.Referenz,
            Bemerkung = $"Imported from bank statement: {bankBuchung.Verwendungszweck}",
            StatusId = 1, // Active
            BankBuchungId = bankBuchung.Id
        };

        _context.MitgliedZahlungen.Add(mitgliedZahlung);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created MitgliedZahlung {ZahlungId} for Member {MitgliedId}, Amount: {Betrag}",
            mitgliedZahlung.Id, mitgliedId, mitgliedZahlung.Betrag);

        return mitgliedZahlung;
    }

    /// <summary>
    /// Match payment to open Forderungen and update their status
    /// </summary>
    private async Task MatchAndUpdateForderungenAsync(MitgliedZahlung zahlung)
    {
        // Get open Forderungen for this member, ordered by due date (oldest first)
        var openForderungen = await _context.MitgliedForderungen
            .Where(f =>
                f.MitgliedId == zahlung.MitgliedId &&
                f.StatusId == 2) // Unbezahlt (Unpaid)
            .OrderBy(f => f.Faelligkeit)
            .ToListAsync();

        if (!openForderungen.Any())
        {
            _logger.LogInformation("No open Forderungen found for Member {MitgliedId}", zahlung.MitgliedId);
            return;
        }

        var remainingAmount = zahlung.Betrag;

        foreach (var forderung in openForderungen)
        {
            if (remainingAmount <= 0) break;

            var allocationAmount = Math.Min(remainingAmount, forderung.Betrag);

            // Create MitgliedForderungZahlung (junction table)
            var forderungZahlung = new MitgliedForderungZahlung
            {
                ForderungId = forderung.Id,
                ZahlungId = zahlung.Id,
                Betrag = allocationAmount
            };

            _context.MitgliedForderungZahlungen.Add(forderungZahlung);

            // Update Forderung status if fully paid
            if (allocationAmount >= forderung.Betrag)
            {
                forderung.StatusId = 1; // Bezahlt (Paid)
                forderung.BezahltAm = zahlung.Zahlungsdatum;
                _context.MitgliedForderungen.Update(forderung);

                _logger.LogInformation("Forderung {ForderungId} marked as paid", forderung.Id);
            }

            remainingAmount -= allocationAmount;
        }

        await _context.SaveChangesAsync();

        if (remainingAmount > 0)
        {
            _logger.LogInformation("Payment has remaining amount {RemainingAmount} after allocating to Forderungen",
                remainingAmount);

            // Could create Vorauszahlung (advance payment) here if needed
        }
    }

    /// <summary>
    /// Get unmatched BankBuchungen (transactions without member match)
    /// </summary>
    public async Task<IEnumerable<UnmatchedBankBuchungDto>> GetUnmatchedBankBuchungenAsync(
        int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.BankBuchungen
            .Where(b => b.DeletedFlag != true)
            .Where(b => !_context.MitgliedZahlungen.Any(z => z.BankBuchungId == b.Id));

        if (vereinId.HasValue)
        {
            query = query.Where(b => b.VereinId == vereinId.Value);
        }

        var unmatchedBuchungen = await query
            .Include(b => b.Verein)
            .OrderByDescending(b => b.Buchungsdatum)
            .Select(b => new UnmatchedBankBuchungDto
            {
                Id = b.Id,
                VereinId = b.VereinId,
                VereinName = b.Verein != null ? b.Verein.Name : null,
                Buchungsdatum = b.Buchungsdatum,
                Betrag = b.Betrag,
                Empfaenger = b.Empfaenger,
                Verwendungszweck = b.Verwendungszweck,
                Referenz = b.Referenz,
                BankKontoId = b.BankKontoId,
                Created = b.Created
            })
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Found {Count} unmatched BankBuchungen", unmatchedBuchungen.Count);

        return unmatchedBuchungen;
    }

    /// <summary>
    /// Manually match a BankBuchung to a member
    /// </summary>
    public async Task<ManualMatchResponseDto> ManualMatchBankBuchungAsync(
        ManualMatchRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = new ManualMatchResponseDto
        {
            Success = false,
            Message = "Processing manual match..."
        };

        // Validate BankBuchung exists
        var bankBuchung = await _context.BankBuchungen
            .FirstOrDefaultAsync(b => b.Id == request.BankBuchungId && b.DeletedFlag != true, cancellationToken);

        if (bankBuchung == null)
        {
            throw new KeyNotFoundException($"BankBuchung with ID {request.BankBuchungId} not found");
        }

        // Check if already matched
        var existingZahlung = await _context.MitgliedZahlungen
            .FirstOrDefaultAsync(z => z.BankBuchungId == request.BankBuchungId, cancellationToken);

        if (existingZahlung != null)
        {
            response.Message = "BankBuchung is already matched to a member";
            return response;
        }

        // Validate Member exists
        var mitglied = await _context.Mitglieder
            .FirstOrDefaultAsync(m => m.Id == request.MitgliedId && m.DeletedFlag != true, cancellationToken);

        if (mitglied == null)
        {
            throw new KeyNotFoundException($"Mitglied with ID {request.MitgliedId} not found");
        }

        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Create MitgliedZahlung
            var mitgliedZahlung = new MitgliedZahlung
            {
                VereinId = bankBuchung.VereinId,
                MitgliedId = request.MitgliedId,
                ZahlungTypId = 1, // Default payment type (Aidat/Membership fee)
                Betrag = bankBuchung.Betrag,
                WaehrungId = bankBuchung.WaehrungId,
                Zahlungsdatum = bankBuchung.Buchungsdatum,
                Zahlungsweg = "Banküberweisung",
                BankkontoId = bankBuchung.BankKontoId,
                Referenz = bankBuchung.Referenz,
                Bemerkung = $"Manually matched from BankBuchung {bankBuchung.Id}: {bankBuchung.Verwendungszweck}",
                StatusId = 1, // Active
                BankBuchungId = bankBuchung.Id,
                Created = DateTime.UtcNow,
                CreatedBy = 1 // TODO: Get from current user context
            };

            _context.MitgliedZahlungen.Add(mitgliedZahlung);
            await _context.SaveChangesAsync(cancellationToken);

            response.MitgliedZahlungId = mitgliedZahlung.Id;

            // Match to Forderungen
            if (request.ForderungIds.Any())
            {
                // Manual allocation to specific Forderungen
                await AllocateToSpecificForderungenAsync(
                    mitgliedZahlung,
                    request.ForderungIds,
                    request.AllocationAmounts,
                    response,
                    cancellationToken);
            }
            else
            {
                // Auto-match to open Forderungen
                await MatchAndUpdateForderungenAsync(mitgliedZahlung);

                // Count matched Forderungen
                var matchedForderungen = await _context.MitgliedForderungZahlungen
                    .Where(fz => fz.ZahlungId == mitgliedZahlung.Id)
                    .ToListAsync(cancellationToken);

                response.MatchedForderungenCount = matchedForderungen.Count;
                response.AllocatedAmount = matchedForderungen.Sum(fz => fz.Betrag);
                response.MatchedForderungIds = matchedForderungen.Select(fz => fz.ForderungId).ToList();
            }

            response.RemainingAmount = mitgliedZahlung.Betrag - response.AllocatedAmount;

            await transaction.CommitAsync(cancellationToken);

            response.Success = true;
            response.Message = $"Successfully matched BankBuchung to member {mitglied.Vorname} {mitglied.Nachname}. " +
                             $"Allocated {response.AllocatedAmount:C} to {response.MatchedForderungenCount} Forderungen.";

            _logger.LogInformation("Manually matched BankBuchung {BankBuchungId} to Member {MitgliedId}",
                request.BankBuchungId, request.MitgliedId);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error manually matching BankBuchung {BankBuchungId}", request.BankBuchungId);
            throw;
        }

        return response;
    }

    /// <summary>
    /// Allocate payment to specific Forderungen with custom amounts
    /// </summary>
    private async Task AllocateToSpecificForderungenAsync(
        MitgliedZahlung zahlung,
        List<int> forderungIds,
        List<decimal> allocationAmounts,
        ManualMatchResponseDto response,
        CancellationToken cancellationToken)
    {
        if (allocationAmounts.Any() && allocationAmounts.Count != forderungIds.Count)
        {
            throw new ArgumentException("AllocationAmounts count must match ForderungIds count");
        }

        var forderungen = await _context.MitgliedForderungen
            .Where(f => forderungIds.Contains(f.Id) && f.MitgliedId == zahlung.MitgliedId)
            .ToListAsync(cancellationToken);

        if (forderungen.Count != forderungIds.Count)
        {
            throw new KeyNotFoundException("One or more Forderungen not found or do not belong to the member");
        }

        decimal totalAllocated = 0;

        for (int i = 0; i < forderungen.Count; i++)
        {
            var forderung = forderungen[i];
            var allocationAmount = allocationAmounts.Any()
                ? allocationAmounts[i]
                : Math.Min(zahlung.Betrag - totalAllocated, forderung.Betrag);

            if (allocationAmount <= 0) continue;

            // Create MitgliedForderungZahlung
            var forderungZahlung = new MitgliedForderungZahlung
            {
                ForderungId = forderung.Id,
                ZahlungId = zahlung.Id,
                Betrag = allocationAmount,
                Created = DateTime.UtcNow,
                CreatedBy = 1
            };

            _context.MitgliedForderungZahlungen.Add(forderungZahlung);

            // Update Forderung status if fully paid
            if (allocationAmount >= forderung.Betrag)
            {
                forderung.StatusId = 1; // Bezahlt (Paid)
                forderung.BezahltAm = zahlung.Zahlungsdatum;
                _context.MitgliedForderungen.Update(forderung);
            }

            totalAllocated += allocationAmount;
            response.MatchedForderungIds.Add(forderung.Id);
        }

        await _context.SaveChangesAsync(cancellationToken);

        response.MatchedForderungenCount = forderungen.Count;
        response.AllocatedAmount = totalAllocated;
    }
}

