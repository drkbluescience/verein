using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.VeranstaltungZahlung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for VeranstaltungZahlung entity mappings
/// </summary>
public class VeranstaltungZahlungProfile : Profile
{
    public VeranstaltungZahlungProfile()
    {
        // Entity -> DTO
        CreateMap<VeranstaltungZahlung, VeranstaltungZahlungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateVeranstaltungZahlungDto, VeranstaltungZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore())
            .ForMember(dest => dest.Anmeldung, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateVeranstaltungZahlungDto, VeranstaltungZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungId, opt => opt.Ignore())
            .ForMember(dest => dest.AnmeldungId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore())
            .ForMember(dest => dest.Anmeldung, opt => opt.Ignore())
            // Handle nullable properties - only update if provided
            .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))
            .ForMember(dest => dest.Email, opt => opt.Condition(src => src.Email != null))
            .ForMember(dest => dest.Betrag, opt => opt.Condition(src => src.Betrag != null))
            .ForMember(dest => dest.WaehrungId, opt => opt.Condition(src => src.WaehrungId != null))
            .ForMember(dest => dest.Zahlungsdatum, opt => opt.Condition(src => src.Zahlungsdatum != null))
            .ForMember(dest => dest.Zahlungsweg, opt => opt.Condition(src => src.Zahlungsweg != null))
            .ForMember(dest => dest.Referenz, opt => opt.Condition(src => src.Referenz != null))
            .ForMember(dest => dest.StatusId, opt => opt.Condition(src => src.StatusId != null));
    }
}

