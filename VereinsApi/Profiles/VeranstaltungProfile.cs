using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Veranstaltung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Veranstaltung entity mappings
/// </summary>
public class VeranstaltungProfile : Profile
{
    public VeranstaltungProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<Veranstaltung, VeranstaltungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateVeranstaltungDto, Veranstaltung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungAnmeldungen, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungBilder, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        // Note: CreateVeranstaltungDto is used for both create and update operations
        CreateMap<CreateVeranstaltungDto, Veranstaltung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungAnmeldungen, opt => opt.Ignore())
            .ForMember(dest => dest.VeranstaltungBilder, opt => opt.Ignore());
    }
}
