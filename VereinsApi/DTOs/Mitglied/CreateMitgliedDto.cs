using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Mitglied;

/// <summary>
/// Data Transfer Object for creating a new Mitglied
/// </summary>
public class CreateMitgliedDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Unique member number
    /// </summary>
    [Required(ErrorMessage = "Mitgliedsnummer ist erforderlich")]
    [MaxLength(30, ErrorMessage = "Mitgliedsnummer darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("mitgliedsnummer")]
    public string Mitgliedsnummer { get; set; } = string.Empty;

    /// <summary>
    /// Member status identifier
    /// </summary>
    [Required(ErrorMessage = "MitgliedStatusId ist erforderlich")]
    [JsonPropertyName("mitgliedStatusId")]
    public int MitgliedStatusId { get; set; }

    /// <summary>
    /// Member type identifier
    /// </summary>
    [Required(ErrorMessage = "MitgliedTypId ist erforderlich")]
    [JsonPropertyName("mitgliedTypId")]
    public int MitgliedTypId { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    [Required(ErrorMessage = "Vorname ist erforderlich")]
    [MaxLength(100, ErrorMessage = "Vorname darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("vorname")]
    public string Vorname { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    [Required(ErrorMessage = "Nachname ist erforderlich")]
    [MaxLength(100, ErrorMessage = "Nachname darf maximal 100 Zeichen lang sein")]
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
    [MaxLength(100, ErrorMessage = "Geburtsort darf maximal 100 Zeichen lang sein")]
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
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    [MaxLength(30, ErrorMessage = "Telefon darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Mobile phone number
    /// </summary>
    [MaxLength(30, ErrorMessage = "Mobiltelefon darf maximal 30 Zeichen lang sein")]
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
    [MaxLength(250, ErrorMessage = "Bemerkung darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Membership fee amount
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "BeitragBetrag muss positiv sein")]
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
    [MaxLength(20, ErrorMessage = "BeitragPeriodeCode darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("beitragPeriodeCode")]
    public string? BeitragPeriodeCode { get; set; }

    /// <summary>
    /// Payment day of the period
    /// </summary>
    [Range(1, 31, ErrorMessage = "BeitragZahlungsTag muss zwischen 1 und 31 liegen")]
    [JsonPropertyName("beitragZahlungsTag")]
    public int? BeitragZahlungsTag { get; set; }

    /// <summary>
    /// Payment day type code
    /// </summary>
    [MaxLength(20, ErrorMessage = "BeitragZahlungstagTypCode darf maximal 20 Zeichen lang sein")]
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
    public bool? Aktiv { get; set; } = true;
}
