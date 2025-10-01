using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.MitgliedFamilie;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for MitgliedFamilie entity mappings
/// </summary>
public class MitgliedFamilieProfile : Profile
{
    public MitgliedFamilieProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<MitgliedFamilie, MitgliedFamilieDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedFamilieDto, MitgliedFamilie>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.Aktiv ?? true))
            .ForMember(dest => dest.MitgliedFamilieStatusId, opt => opt.MapFrom(src => src.MitgliedFamilieStatusId == 0 ? 1 : src.MitgliedFamilieStatusId))
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.ParentMitglied, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateMitgliedFamilieDto, MitgliedFamilie>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.ParentMitglied, opt => opt.Ignore())
            // Handle nullable properties from UpdateDto - only update if provided
            .ForMember(dest => dest.VereinId, opt => opt.Condition(src => src.VereinId > 0))
            .ForMember(dest => dest.MitgliedId, opt => opt.Condition(src => src.MitgliedId > 0))
            .ForMember(dest => dest.ParentMitgliedId, opt => opt.Condition(src => src.ParentMitgliedId > 0))
            .ForMember(dest => dest.FamilienbeziehungTypId, opt => opt.Condition(src => src.FamilienbeziehungTypId > 0))
            .ForMember(dest => dest.MitgliedFamilieStatusId, opt => opt.Condition(src => src.MitgliedFamilieStatusId > 0))
            .ForMember(dest => dest.GueltigVon, opt => opt.Condition(src => src.GueltigVon != null))
            .ForMember(dest => dest.GueltigBis, opt => opt.Condition(src => src.GueltigBis != null))
            .ForMember(dest => dest.Hinweis, opt => opt.Condition(src => src.Hinweis != null))
            .ForMember(dest => dest.Aktiv, opt => opt.Condition(src => src.Aktiv != null));
    }
}
