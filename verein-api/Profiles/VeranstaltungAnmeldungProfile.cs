using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.VeranstaltungAnmeldung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for VeranstaltungAnmeldung entity mappings
/// </summary>
public class VeranstaltungAnmeldungProfile : Profile
{
    public VeranstaltungAnmeldungProfile()
    {
        // Entity -> DTO (ignore Aktiv property as it's NotMapped in entity)
        CreateMap<VeranstaltungAnmeldung, VeranstaltungAnmeldungDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.VeranstaltungId, opt => opt.MapFrom(src => src.VeranstaltungId))
            .ForMember(dest => dest.MitgliedId, opt => opt.MapFrom(src => src.MitgliedId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Telefon, opt => opt.MapFrom(src => src.Telefon))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.Bemerkung, opt => opt.MapFrom(src => src.Bemerkung))
            .ForMember(dest => dest.Preis, opt => opt.MapFrom(src => src.Preis))
            .ForMember(dest => dest.WaehrungId, opt => opt.MapFrom(src => src.WaehrungId))
            .ForMember(dest => dest.ZahlungStatusId, opt => opt.MapFrom(src => src.ZahlungStatusId))
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
            .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => src.Modified))
            .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.ModifiedBy))
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => src.DeletedFlag))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.Aktiv));
        
        // CreateDTO -> Entity
        CreateMap<CreateVeranstaltungAnmeldungDto, VeranstaltungAnmeldung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.Status, opt => opt.Ignore()) // Will be set in controller
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateVeranstaltungAnmeldungDto, VeranstaltungAnmeldung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungId, opt => opt.Ignore()) // Cannot change event
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore());
    }
}
