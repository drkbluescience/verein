using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.FiBuKonto;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for FiBuKonto entity mappings
/// </summary>
public class FiBuKontoProfile : Profile
{
    public FiBuKontoProfile()
    {
        // Entity -> DTO
        CreateMap<FiBuKonto, FiBuKontoDto>()
            .ForMember(dest => dest.Sortierung, opt => opt.MapFrom(src => src.Reihenfolge))
            .ForMember(dest => dest.Kategorie, opt => opt.MapFrom(src => ResolveKategorie(src)))
            .ForMember(dest => dest.KontoTyp, opt => opt.MapFrom(src => src.Bereich))
            .ForMember(dest => dest.IstEinnahme, opt => opt.MapFrom(src => IsEinnahme(src.Typ)))
            .ForMember(dest => dest.IstAusgabe, opt => opt.MapFrom(src => IsAusgabe(src.Typ)))
            .ForMember(dest => dest.IstDurchlaufend, opt => opt.MapFrom(src => IsDurchlaufend(src)))
            .ForMember(dest => dest.Beschreibung, opt => opt.MapFrom(src => src.BezeichnungTR))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.IsAktiv));

        // CreateDTO -> Entity
        CreateMap<CreateFiBuKontoDto, FiBuKonto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Reihenfolge, opt => opt.MapFrom(src => src.Sortierung))
            .ForMember(dest => dest.Hauptbereich, opt => opt.MapFrom(src => ResolveHauptbereich(src)))
            .ForMember(dest => dest.HauptbereichName, opt => opt.MapFrom(src => ResolveHauptbereichName(src)))
            .ForMember(dest => dest.Bereich, opt => opt.MapFrom(src => ResolveBereich(src)))
            .ForMember(dest => dest.Typ, opt => opt.MapFrom(src => ResolveTyp(src)))
            .ForMember(dest => dest.BezeichnungTR, opt => opt.MapFrom(src => ResolveBeschreibung(src)))
            .ForMember(dest => dest.IsAktiv, opt => opt.MapFrom(src => ResolveIsAktiv(src)))
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.ZahlungTyp, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuchungen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePosten, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateFiBuKontoDto, FiBuKonto>()
            .ForMember(dest => dest.Reihenfolge, opt => opt.MapFrom(src => src.Sortierung))
            .ForMember(dest => dest.Hauptbereich, opt => opt.MapFrom(src => ResolveHauptbereich(src)))
            .ForMember(dest => dest.HauptbereichName, opt => opt.MapFrom(src => ResolveHauptbereichName(src)))
            .ForMember(dest => dest.Bereich, opt => opt.MapFrom(src => ResolveBereich(src)))
            .ForMember(dest => dest.Typ, opt => opt.MapFrom(src => ResolveTyp(src)))
            .ForMember(dest => dest.BezeichnungTR, opt => opt.MapFrom(src => ResolveBeschreibung(src)))
            .ForMember(dest => dest.IsAktiv, opt =>
            {
                opt.PreCondition(src => src.Aktiv.HasValue || src.IsAktiv.HasValue);
                opt.MapFrom(src => ResolveIsAktiv(src));
            })
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.ZahlungTyp, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuchungen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePosten, opt => opt.Ignore());
    }

    private static string? ResolveKategorie(FiBuKonto src)
    {
        if (!string.IsNullOrWhiteSpace(src.HauptbereichName))
        {
            return src.HauptbereichName;
        }

        return src.Hauptbereich switch
        {
            "A" => "Ideeller Bereich",
            "B" => "Vermoegensverwaltung",
            "C" => "Zweckbetrieb",
            "D" => "Wirtschaftlicher Geschaeftsbetrieb",
            _ => null
        };
    }

    private static string? ResolveHauptbereichName(CreateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Kategorie))
        {
            return src.Kategorie;
        }

        return src.Hauptbereich switch
        {
            "A" => "Ideeller Bereich",
            "B" => "Vermoegensverwaltung",
            "C" => "Zweckbetrieb",
            "D" => "Wirtschaftlicher Geschaeftsbetrieb",
            _ => null
        };
    }

    private static string? ResolveHauptbereichName(UpdateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Kategorie))
        {
            return src.Kategorie;
        }

        return src.Hauptbereich switch
        {
            "A" => "Ideeller Bereich",
            "B" => "Vermoegensverwaltung",
            "C" => "Zweckbetrieb",
            "D" => "Wirtschaftlicher Geschaeftsbetrieb",
            _ => null
        };
    }

    private static string? ResolveHauptbereich(CreateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Hauptbereich))
        {
            return src.Hauptbereich;
        }

        return MapHauptbereichCode(src.Kategorie);
    }

    private static string? ResolveHauptbereich(UpdateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Hauptbereich))
        {
            return src.Hauptbereich;
        }

        return MapHauptbereichCode(src.Kategorie);
    }

    private static string? MapHauptbereichCode(string? kategorie)
    {
        if (string.IsNullOrWhiteSpace(kategorie))
        {
            return null;
        }

        var normalized = kategorie.ToLowerInvariant();

        if (normalized.Contains("ideell"))
        {
            return "A";
        }
        if (normalized.Contains("verm"))
        {
            return "B";
        }
        if (normalized.Contains("zweck"))
        {
            return "C";
        }
        if (normalized.Contains("wirtschaft"))
        {
            return "D";
        }
        if (normalized.Contains("durchlauf"))
        {
            return null;
        }

        return null;
    }

    private static string ResolveBereich(CreateFiBuKontoDto src)
    {
        return NormalizeBereich(src.Bereich, src.KontoTyp);
    }

    private static string ResolveBereich(UpdateFiBuKontoDto src)
    {
        return NormalizeBereich(src.Bereich, src.KontoTyp);
    }

    private static string NormalizeBereich(string? bereich, string? kontoTyp)
    {
        var value = !string.IsNullOrWhiteSpace(bereich) ? bereich : kontoTyp;
        if (string.IsNullOrWhiteSpace(value))
        {
            return "KASSE_BANK";
        }

        var normalized = value.Trim().ToLowerInvariant();
        var hasKasse = normalized.Contains("kasse") || normalized.Contains("kasa");
        var hasBank = normalized.Contains("bank") || normalized.Contains("banka");

        if (hasKasse && hasBank)
        {
            return "KASSE_BANK";
        }
        if (hasKasse)
        {
            return "KASSE";
        }
        if (hasBank)
        {
            return "BANK";
        }

        return value.ToUpperInvariant();
    }

    private static string ResolveTyp(CreateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Typ))
        {
            return src.Typ;
        }

        return ResolveTypFromFlags(src.IstEinnahme, src.IstAusgabe, src.IstDurchlaufend);
    }

    private static string ResolveTyp(UpdateFiBuKontoDto src)
    {
        if (!string.IsNullOrWhiteSpace(src.Typ))
        {
            return src.Typ;
        }

        return ResolveTypFromFlags(src.IstEinnahme, src.IstAusgabe, src.IstDurchlaufend);
    }

    private static string ResolveTypFromFlags(bool? istEinnahme, bool? istAusgabe, bool? istDurchlaufend)
    {
        if (istDurchlaufend == true)
        {
            return "EIN_AUSG";
        }

        var income = istEinnahme == true;
        var expense = istAusgabe == true;

        if (income && expense)
        {
            return "EIN_AUSG";
        }
        if (income)
        {
            return "EINNAHMEN";
        }
        if (expense)
        {
            return "AUSGABEN";
        }

        return "EIN_AUSG";
    }

    private static string? ResolveBeschreibung(CreateFiBuKontoDto src)
    {
        return string.IsNullOrWhiteSpace(src.Beschreibung) ? null : src.Beschreibung;
    }

    private static string? ResolveBeschreibung(UpdateFiBuKontoDto src)
    {
        return string.IsNullOrWhiteSpace(src.Beschreibung) ? null : src.Beschreibung;
    }

    private static bool ResolveIsAktiv(CreateFiBuKontoDto src)
    {
        return src.Aktiv ?? src.IsAktiv ?? true;
    }

    private static bool ResolveIsAktiv(UpdateFiBuKontoDto src)
    {
        return src.Aktiv ?? src.IsAktiv ?? true;
    }

    private static bool IsEinnahme(string? typ)
    {
        return string.Equals(typ, "EINNAHMEN", StringComparison.OrdinalIgnoreCase)
               || string.Equals(typ, "EIN_AUSG", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsAusgabe(string? typ)
    {
        return string.Equals(typ, "AUSGABEN", StringComparison.OrdinalIgnoreCase)
               || string.Equals(typ, "EIN_AUSG", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsDurchlaufend(FiBuKonto src)
    {
        if (!string.IsNullOrWhiteSpace(src.HauptbereichName))
        {
            return src.HauptbereichName.ToLowerInvariant().Contains("durchlauf");
        }

        return string.IsNullOrWhiteSpace(src.Hauptbereich);
    }
}
