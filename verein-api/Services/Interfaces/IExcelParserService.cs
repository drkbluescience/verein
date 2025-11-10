using VereinsApi.DTOs.Finanz;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service for parsing Excel files containing bank transactions
/// </summary>
public interface IExcelParserService
{
    /// <summary>
    /// Parse bank transaction Excel file
    /// </summary>
    /// <param name="file">Excel file stream</param>
    /// <returns>List of parsed transaction rows</returns>
    Task<List<ExcelTransactionRow>> ParseBankTransactionsAsync(Stream file);
}

