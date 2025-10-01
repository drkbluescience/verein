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
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<VeranstaltungAnmeldung, VeranstaltungAnmeldungDto>();
        
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
