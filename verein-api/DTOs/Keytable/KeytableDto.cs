using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Keytable;

// MitgliedTyp
public class MitgliedTypDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// FamilienbeziehungTyp
public class FamilienbeziehungTypDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// ZahlungTyp
public class ZahlungTypDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// ZahlungStatus
public class ZahlungStatusDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Forderungsart
public class ForderungsartDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Forderungsstatus
public class ForderungsstatusDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Waehrung
public class WaehrungDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Rechtsform
public class RechtsformDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// AdresseTyp
public class AdresseTypDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Kontotyp
public class KontotypDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// MitgliedFamilieStatus
public class MitgliedFamilieStatusDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Staatsangehoerigkeit
public class StaatsangehoerigkeitDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("iso2")]
    public string Iso2 { get; set; } = string.Empty;
    [JsonPropertyName("iso3")]
    public string Iso3 { get; set; } = string.Empty;
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// BeitragPeriode
public class BeitragPeriodeDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("sort")]
    public int Sort { get; set; }
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// BeitragZahlungstagTyp
public class BeitragZahlungstagTypDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("sort")]
    public int Sort { get; set; }
    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<KeytableUebersetzungDto> Uebersetzungen { get; set; } = new List<KeytableUebersetzungDto>();
}

// Generic translation DTO
public class KeytableUebersetzungDto
{
    [JsonPropertyName("sprache")]
    public string Sprache { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

