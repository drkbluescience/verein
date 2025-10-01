using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Mitglied;

/// <summary>
/// Data Transfer Object for Mitglied entity
/// </summary>
public class MitgliedDto
{
    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Unique member number
    /// </summary>
    [JsonPropertyName("mitgliedsnummer")]
    public string Mitgliedsnummer { get; set; } = string.Empty;

    /// <summary>
    /// Member status identifier
    /// </summary>
    [JsonPropertyName("mitgliedStatusId")]
    public int MitgliedStatusId { get; set; }

    /// <summary>
    /// Member type identifier
    /// </summary>
    [JsonPropertyName("mitgliedTypId")]
    public int MitgliedTypId { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    [JsonPropertyName("vorname")]
    public string Vorname { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    [JsonPropertyName("nachname")]
    public string Nachname { get; set; } = string.Empty;

    /// <summary>
    /// Gender identifier
    /// </summary>
    [JsonPropertyName("geschlechtId")]
    public int? GeschlechtId { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    [JsonPropertyName("geburtsdatum")]
    public DateTime? Geburtsdatum { get; set; }

    /// <summary>
    /// Place of birth
    /// </summary>
    [JsonPropertyName("geburtsort")]
    public string? Geburtsort { get; set; }

    /// <summary>
    /// Nationality identifier
    /// </summary>
    [JsonPropertyName("staatsangehoerigkeitId")]
    public int? StaatsangehoerigkeitId { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Mobile phone number
    /// </summary>
    [JsonPropertyName("mobiltelefon")]
    public string? Mobiltelefon { get; set; }

    /// <summary>
    /// Date of joining the verein
    /// </summary>
    [JsonPropertyName("eintrittsdatum")]
    public DateTime? Eintrittsdatum { get; set; }

    /// <summary>
    /// Date of leaving the verein
    /// </summary>
    [JsonPropertyName("austrittsdatum")]
    public DateTime? Austrittsdatum { get; set; }

    /// <summary>
    /// Additional remarks
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Membership fee amount
    /// </summary>
    [JsonPropertyName("beitragBetrag")]
    public decimal? BeitragBetrag { get; set; }

    /// <summary>
    /// Currency identifier for membership fee
    /// </summary>
    [JsonPropertyName("beitragWaehrungId")]
    public int? BeitragWaehrungId { get; set; }

    /// <summary>
    /// Payment period code (monthly, yearly, etc.)
    /// </summary>
    [JsonPropertyName("beitragPeriodeCode")]
    public string? BeitragPeriodeCode { get; set; }

    /// <summary>
    /// Payment day of the period
    /// </summary>
    [JsonPropertyName("beitragZahlungsTag")]
    public int? BeitragZahlungsTag { get; set; }

    /// <summary>
    /// Payment day type code
    /// </summary>
    [JsonPropertyName("beitragZahlungstagTypCode")]
    public string? BeitragZahlungstagTypCode { get; set; }

    /// <summary>
    /// Is membership fee mandatory
    /// </summary>
    [JsonPropertyName("beitragIstPflicht")]
    public bool? BeitragIstPflicht { get; set; }

    /// <summary>
    /// Is the member currently active
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}
