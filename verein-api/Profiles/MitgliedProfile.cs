using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Mitglied;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Mitglied entity mappings
/// </summary>
public class MitgliedProfile : Profile
{
    public MitgliedProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<Mitglied, MitgliedDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedDto, Mitglied>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.Aktiv ?? true))
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedAdressen, opt => opt.Ignore())
            .ForMember(dest => dest.FamilienbeziehungenAlsKind, opt => opt.Ignore())
            .ForMember(dest => dest.FamilienbeziehungenAlsElternteil, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungAnmeldungen, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateMitgliedDto, Mitglied>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedAdressen, opt => opt.Ignore())
            .ForMember(dest => dest.FamilienbeziehungenAlsKind, opt => opt.Ignore())
            .ForMember(dest => dest.FamilienbeziehungenAlsElternteil, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungAnmeldungen, opt => opt.Ignore())
            // Handle nullable properties from UpdateDto - only update if provided
            .ForMember(dest => dest.VereinId, opt => opt.Condition(src => src.VereinId > 0))
            .ForMember(dest => dest.Mitgliedsnummer, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Mitgliedsnummer)))
            .ForMember(dest => dest.MitgliedStatusId, opt => opt.Condition(src => src.MitgliedStatusId > 0))
            .ForMember(dest => dest.MitgliedTypId, opt => opt.Condition(src => src.MitgliedTypId > 0))
            .ForMember(dest => dest.Vorname, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Vorname)))
            .ForMember(dest => dest.Nachname, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Nachname)))
            .ForMember(dest => dest.GeschlechtId, opt => opt.Condition(src => src.GeschlechtId != null))
            .ForMember(dest => dest.Geburtsdatum, opt => opt.Condition(src => src.Geburtsdatum != null))
            .ForMember(dest => dest.Geburtsort, opt => opt.Condition(src => src.Geburtsort != null))
            .ForMember(dest => dest.StaatsangehoerigkeitId, opt => opt.Condition(src => src.StaatsangehoerigkeitId != null))
            .ForMember(dest => dest.Email, opt => opt.Condition(src => src.Email != null))
            .ForMember(dest => dest.Telefon, opt => opt.Condition(src => src.Telefon != null))
            .ForMember(dest => dest.Mobiltelefon, opt => opt.Condition(src => src.Mobiltelefon != null))
            .ForMember(dest => dest.Eintrittsdatum, opt => opt.Condition(src => src.Eintrittsdatum != null))
            .ForMember(dest => dest.Austrittsdatum, opt => opt.Condition(src => src.Austrittsdatum != null))
            .ForMember(dest => dest.Bemerkung, opt => opt.Condition(src => src.Bemerkung != null))
            .ForMember(dest => dest.BeitragBetrag, opt => opt.Condition(src => src.BeitragBetrag != null))
            .ForMember(dest => dest.BeitragWaehrungId, opt => opt.Condition(src => src.BeitragWaehrungId != null))
            .ForMember(dest => dest.BeitragPeriodeCode, opt => opt.Condition(src => src.BeitragPeriodeCode != null))
            .ForMember(dest => dest.BeitragZahlungsTag, opt => opt.Condition(src => src.BeitragZahlungsTag != null))
            .ForMember(dest => dest.BeitragZahlungstagTypCode, opt => opt.Condition(src => src.BeitragZahlungstagTypCode != null))
            .ForMember(dest => dest.BeitragIstPflicht, opt => opt.Condition(src => src.BeitragIstPflicht != null))
            .ForMember(dest => dest.Aktiv, opt => opt.Condition(src => src.Aktiv != null));
    }
}
