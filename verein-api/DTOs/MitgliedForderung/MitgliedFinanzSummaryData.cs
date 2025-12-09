using VereinsApi.Domain.Entities;

namespace VereinsApi.DTOs.MitgliedForderung;

/// <summary>
/// Data container for member financial summary information
/// </summary>
public class MitgliedFinanzSummaryData
{
    public VereinsApi.Domain.Entities.Mitglied? Mitglied { get; set; }
    public List<VereinsApi.Domain.Entities.MitgliedForderung> Forderungen { get; set; } = new();
    public List<VereinsApi.Domain.Entities.MitgliedZahlung> MitgliedZahlungen { get; set; } = new();
    public List<VereinsApi.Domain.Entities.VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; } = new();
    public List<VereinsApi.Domain.Entities.MitgliedForderungZahlung> ForderungZahlungen { get; set; } = new();
    public List<VereinsApi.Domain.Entities.VeranstaltungZahlung> VeranstaltungZahlungen { get; set; } = new();
    public List<VereinsApi.Domain.Entities.MitgliedVorauszahlung> Vorauszahlungen { get; set; } = new();
}