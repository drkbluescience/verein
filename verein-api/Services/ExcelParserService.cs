using OfficeOpenXml;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service for parsing Excel files containing bank transactions
/// </summary>
public class ExcelParserService : IExcelParserService
{
    private readonly ILogger<ExcelParserService> _logger;

    public ExcelParserService(ILogger<ExcelParserService> logger)
    {
        _logger = logger;
        
        // Set EPPlus license context (NonCommercial or Commercial)
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }

    /// <summary>
    /// Parse bank transaction Excel file
    /// Supports German, English, and Turkish bank export formats
    /// Expected columns (German/English/Turkish):
    /// - Buchungsdatum/Date/Tarih
    /// - Betrag/Amount/Tutar
    /// - Empfänger/Recipient/Alıcı
    /// - Verwendungszweck/Purpose/Açıklama
    /// - Referenz/Reference/Referans
    /// - IBAN/Account/Hesap
    /// </summary>
    public async Task<List<ExcelTransactionRow>> ParseBankTransactionsAsync(Stream fileStream)
    {
        var transactions = new List<ExcelTransactionRow>();

        try
        {
            using var package = new ExcelPackage(fileStream);
            var worksheet = package.Workbook.Worksheets.FirstOrDefault();

            if (worksheet == null)
            {
                _logger.LogWarning("Excel file contains no worksheets");
                return transactions;
            }

            _logger.LogInformation("Parsing Excel worksheet: {WorksheetName}, Rows: {RowCount}", 
                worksheet.Name, worksheet.Dimension?.Rows ?? 0);

            // Find header row and column indices
            var headerRow = FindHeaderRow(worksheet);
            if (headerRow == 0)
            {
                _logger.LogWarning("Could not find header row in Excel file");
                return transactions;
            }

            var columnMap = MapColumns(worksheet, headerRow);
            if (!columnMap.Any())
            {
                _logger.LogWarning("Could not map any columns in Excel file");
                return transactions;
            }

            // Parse data rows
            var rowCount = worksheet.Dimension?.Rows ?? 0;
            for (int row = headerRow + 1; row <= rowCount; row++)
            {
                try
                {
                    var transaction = ParseRow(worksheet, row, columnMap);
                    if (transaction != null)
                    {
                        transactions.Add(transaction);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error parsing row {RowNumber}", row);
                }
            }

            _logger.LogInformation("Successfully parsed {Count} transactions from Excel", transactions.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing Excel file");
            throw new InvalidOperationException("Failed to parse Excel file", ex);
        }

        return transactions;
    }

    /// <summary>
    /// Find the header row in the worksheet
    /// Supports German, English, and Turkish headers
    /// </summary>
    private int FindHeaderRow(ExcelWorksheet worksheet)
    {
        var maxRowsToCheck = Math.Min(10, worksheet.Dimension?.Rows ?? 0);

        for (int row = 1; row <= maxRowsToCheck; row++)
        {
            var cellValue = worksheet.Cells[row, 1].Text?.Trim().ToLowerInvariant();

            // Check if this row contains typical header keywords (German, English, Turkish)
            if (cellValue != null && (
                cellValue.Contains("buchung") ||
                cellValue.Contains("datum") ||
                cellValue.Contains("date") ||
                cellValue.Contains("valuta") ||
                cellValue.Contains("tarih") ||
                cellValue.Contains("tutar") ||
                cellValue.Contains("betrag")))
            {
                return row;
            }
        }

        // Default to row 1 if no header found
        return 1;
    }

    /// <summary>
    /// Map column names to indices
    /// Supports German, English, and Turkish column names
    /// </summary>
    private Dictionary<string, int> MapColumns(ExcelWorksheet worksheet, int headerRow)
    {
        var columnMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var colCount = worksheet.Dimension?.Columns ?? 0;

        for (int col = 1; col <= colCount; col++)
        {
            var headerText = worksheet.Cells[headerRow, col].Text?.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(headerText)) continue;

            // Map common German, English, and Turkish bank column names
            // Date column (Tarih / Datum / Date)
            if (headerText.Contains("buchung") ||
                headerText.Contains("datum") ||
                headerText.Contains("date") ||
                headerText.Contains("valuta") ||
                headerText.Contains("tarih"))
            {
                columnMap["Buchungsdatum"] = col;
            }
            // Amount column (Tutar / Betrag / Amount)
            else if (headerText.Contains("betrag") ||
                     headerText.Contains("amount") ||
                     headerText.Contains("wert") ||
                     headerText.Contains("tutar") ||
                     headerText.Contains("miktar"))
            {
                columnMap["Betrag"] = col;
            }
            // Recipient/Sender column (Alıcı/Gönderen / Empfänger/Auftraggeber / Recipient)
            else if (headerText.Contains("empfänger") ||
                     headerText.Contains("empfaenger") ||
                     headerText.Contains("auftraggeber") ||
                     headerText.Contains("name") ||
                     headerText.Contains("recipient") ||
                     headerText.Contains("alıcı") ||
                     headerText.Contains("alici") ||
                     headerText.Contains("gönderen") ||
                     headerText.Contains("gonderen"))
            {
                columnMap["Empfaenger"] = col;
            }
            // Description/Purpose column (Açıklama / Verwendungszweck / Purpose)
            else if (headerText.Contains("verwendung") ||
                     headerText.Contains("zweck") ||
                     headerText.Contains("purpose") ||
                     headerText.Contains("beschreibung") ||
                     headerText.Contains("açıklama") ||
                     headerText.Contains("aciklama") ||
                     headerText.Contains("açiklama"))
            {
                columnMap["Verwendungszweck"] = col;
            }
            // Reference column (Referans / Referenz / Reference)
            else if (headerText.Contains("referenz") ||
                     headerText.Contains("reference") ||
                     headerText.Contains("ref") ||
                     headerText.Contains("referans"))
            {
                columnMap["Referenz"] = col;
            }
            // IBAN/Account column (Hesap / IBAN / Konto)
            else if (headerText.Contains("iban") ||
                     headerText.Contains("konto") ||
                     headerText.Contains("hesap") ||
                     headerText.Contains("account"))
            {
                columnMap["IBAN"] = col;
            }
        }

        return columnMap;
    }

    /// <summary>
    /// Parse a single row into ExcelTransactionRow
    /// </summary>
    private ExcelTransactionRow? ParseRow(ExcelWorksheet worksheet, int rowNumber, Dictionary<string, int> columnMap)
    {
        // Skip empty rows
        var firstCellValue = worksheet.Cells[rowNumber, 1].Text?.Trim();
        if (string.IsNullOrWhiteSpace(firstCellValue))
        {
            return null;
        }

        var transaction = new ExcelTransactionRow
        {
            RowNumber = rowNumber
        };

        // Parse Buchungsdatum
        if (columnMap.TryGetValue("Buchungsdatum", out int dateCol))
        {
            var dateValue = worksheet.Cells[rowNumber, dateCol].Value;
            if (dateValue is DateTime dt)
            {
                transaction.Buchungsdatum = dt;
            }
            else if (dateValue != null && DateTime.TryParse(dateValue.ToString(), out DateTime parsedDate))
            {
                transaction.Buchungsdatum = parsedDate;
            }
        }

        // Parse Betrag
        if (columnMap.TryGetValue("Betrag", out int betragCol))
        {
            var betragValue = worksheet.Cells[rowNumber, betragCol].Value;
            if (betragValue is double dbl)
            {
                transaction.Betrag = (decimal)dbl;
            }
            else if (betragValue != null)
            {
                var betragText = betragValue.ToString()?.Replace(".", "").Replace(",", ".");
                if (decimal.TryParse(betragText, System.Globalization.NumberStyles.Any, 
                    System.Globalization.CultureInfo.InvariantCulture, out decimal parsedBetrag))
                {
                    transaction.Betrag = parsedBetrag;
                }
            }
        }

        // Parse Empfaenger
        if (columnMap.TryGetValue("Empfaenger", out int empfaengerCol))
        {
            transaction.Empfaenger = worksheet.Cells[rowNumber, empfaengerCol].Text?.Trim();
        }

        // Parse Verwendungszweck
        if (columnMap.TryGetValue("Verwendungszweck", out int verwendungCol))
        {
            transaction.Verwendungszweck = worksheet.Cells[rowNumber, verwendungCol].Text?.Trim();
        }

        // Parse Referenz
        if (columnMap.TryGetValue("Referenz", out int referenzCol))
        {
            transaction.Referenz = worksheet.Cells[rowNumber, referenzCol].Text?.Trim();
        }

        // Parse IBAN
        if (columnMap.TryGetValue("IBAN", out int ibanCol))
        {
            transaction.IBAN = worksheet.Cells[rowNumber, ibanCol].Text?.Trim()?.Replace(" ", "");
        }

        // Validate required fields
        if (!transaction.Buchungsdatum.HasValue || !transaction.Betrag.HasValue)
        {
            _logger.LogWarning("Row {RowNumber} missing required fields (Buchungsdatum or Betrag)", rowNumber);
            return null;
        }

        return transaction;
    }
}

