namespace VereinsApi.Models;

/// <summary>
/// Address statistics model
/// </summary>
public class AddressStatistics
{
    public int TotalAddresses { get; set; }
    public int ActiveAddresses { get; set; }
    public int InactiveAddresses { get; set; }
    public bool HasStandardAddress { get; set; }
    public int AddressesWithGpsCoordinates { get; set; }
    public DateTime? OldestAddressDate { get; set; }
    public DateTime? NewestAddressDate { get; set; }
    public Dictionary<int, int> AddressesByType { get; set; } = new();
}
