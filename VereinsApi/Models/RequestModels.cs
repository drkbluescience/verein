using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedAdresse;

namespace VereinsApi.Models;

/// <summary>
/// Request model for creating Mitglied with address
/// </summary>
public class CreateMitgliedWithAddressRequest
{
    public CreateMitgliedDto Mitglied { get; set; } = null!;
    public CreateMitgliedAdresseDto Adresse { get; set; } = null!;
}

/// <summary>
/// Request model for transferring Mitglied to another Verein
/// </summary>
public class TransferMitgliedRequest
{
    public int NewVereinId { get; set; }
    public DateTime TransferDate { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Request model for setting active status
/// </summary>
public class SetActiveStatusRequest
{
    public bool IsActive { get; set; }
}

/// <summary>
/// Request model for geographic area search
/// </summary>
public class GeographicAreaRequest
{
    public double MinLatitude { get; set; }
    public double MaxLatitude { get; set; }
    public double MinLongitude { get; set; }
    public double MaxLongitude { get; set; }
}

/// <summary>
/// Request model for updating validity period
/// </summary>
public class UpdateValidityPeriodRequest
{
    public DateTime? GueltigVon { get; set; }
    public DateTime? GueltigBis { get; set; }
}

/// <summary>
/// Request model for ending relationship
/// </summary>
public class EndRelationshipRequest
{
    public DateTime? EndDate { get; set; }
}

/// <summary>
/// Request model for validating GPS coordinates
/// </summary>
public class ValidateGpsRequest
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
