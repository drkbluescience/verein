using AutoMapper;
using VereinsApi.Domain.Entities.Keytable;
using VereinsApi.DTOs.Keytable;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Keytable (lookup) entity mappings
/// </summary>
public class KeytableProfile : Profile
{
    public KeytableProfile()
    {
        // Geschlecht
        CreateMap<Geschlecht, GeschlechtDto>();
        CreateMap<GeschlechtUebersetzung, GeschlechtUebersetzungDto>();

        // MitgliedStatus
        CreateMap<MitgliedStatus, MitgliedStatusDto>();
        CreateMap<MitgliedStatusUebersetzung, MitgliedStatusUebersetzungDto>();

        // MitgliedTyp
        CreateMap<MitgliedTyp, MitgliedTypDto>();
        CreateMap<MitgliedTypUebersetzung, KeytableUebersetzungDto>();

        // FamilienbeziehungTyp
        CreateMap<FamilienbeziehungTyp, FamilienbeziehungTypDto>();
        CreateMap<FamilienbeziehungTypUebersetzung, KeytableUebersetzungDto>();

        // ZahlungTyp
        CreateMap<ZahlungTyp, ZahlungTypDto>();
        CreateMap<ZahlungTypUebersetzung, KeytableUebersetzungDto>();

        // ZahlungStatus
        CreateMap<ZahlungStatus, ZahlungStatusDto>();
        CreateMap<ZahlungStatusUebersetzung, KeytableUebersetzungDto>();

        // Forderungsart
        CreateMap<Forderungsart, ForderungsartDto>();
        CreateMap<ForderungsartUebersetzung, KeytableUebersetzungDto>();

        // Forderungsstatus
        CreateMap<Forderungsstatus, ForderungsstatusDto>();
        CreateMap<ForderungsstatusUebersetzung, KeytableUebersetzungDto>();

        // Waehrung
        CreateMap<Waehrung, WaehrungDto>();
        CreateMap<WaehrungUebersetzung, KeytableUebersetzungDto>();

        // Rechtsform
        CreateMap<Rechtsform, RechtsformDto>();
        CreateMap<RechtsformUebersetzung, KeytableUebersetzungDto>();

        // AdresseTyp
        CreateMap<AdresseTyp, AdresseTypDto>();
        CreateMap<AdresseTypUebersetzung, KeytableUebersetzungDto>();

        // Kontotyp
        CreateMap<Kontotyp, KontotypDto>();
        CreateMap<KontotypUebersetzung, KeytableUebersetzungDto>();

        // MitgliedFamilieStatus
        CreateMap<MitgliedFamilieStatus, MitgliedFamilieStatusDto>();
        CreateMap<MitgliedFamilieStatusUebersetzung, KeytableUebersetzungDto>();

        // Staatsangehoerigkeit
        CreateMap<Staatsangehoerigkeit, StaatsangehoerigkeitDto>();
        CreateMap<StaatsangehoerigkeitUebersetzung, KeytableUebersetzungDto>();

        // BeitragPeriode
        CreateMap<BeitragPeriode, BeitragPeriodeDto>();
        CreateMap<BeitragPeriodeUebersetzung, KeytableUebersetzungDto>();

        // BeitragZahlungstagTyp
        CreateMap<BeitragZahlungstagTyp, BeitragZahlungstagTypDto>();
        CreateMap<BeitragZahlungstagTypUebersetzung, KeytableUebersetzungDto>();
    }
}

