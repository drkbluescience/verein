using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.VeranstaltungBild;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for VeranstaltungBild entity mappings
/// </summary>
public class VeranstaltungBildProfile : Profile
{
    public VeranstaltungBildProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<VeranstaltungBild, VeranstaltungBildDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateVeranstaltungBildDto, VeranstaltungBild>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateVeranstaltungBildDto, VeranstaltungBild>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungId, opt => opt.Ignore()) // Cannot change event
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Veranstaltung, opt => opt.Ignore())
            // Handle nullable properties from UpdateDto
            .ForMember(dest => dest.BildPfad, opt => opt.Condition(src => src.BildPfad != null))
            .ForMember(dest => dest.Reihenfolge, opt => opt.Condition(src => src.Reihenfolge != null))
            .ForMember(dest => dest.Titel, opt => opt.Condition(src => src.Titel != null));
    }
}
