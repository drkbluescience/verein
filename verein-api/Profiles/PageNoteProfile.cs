using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.PageNote;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for PageNote entity mappings
/// </summary>
public class PageNoteProfile : Profile
{
    public PageNoteProfile()
    {
        // Entity -> DTO
        CreateMap<PageNote, PageNoteDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreatePageNoteDto, PageNote>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserEmail, opt => opt.Ignore()) // Will be set from current user
            .ForMember(dest => dest.UserName, opt => opt.Ignore()) // Will be set from current user
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Domain.Enums.PageNoteStatus.Pending))
            .ForMember(dest => dest.CompletedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.AdminNotes, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true));
            
        // UpdateDTO -> Entity (for partial updates)
        CreateMap<UpdatePageNoteDto, PageNote>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PageUrl, opt => opt.Ignore())
            .ForMember(dest => dest.PageTitle, opt => opt.Ignore())
            .ForMember(dest => dest.EntityType, opt => opt.Ignore())
            .ForMember(dest => dest.EntityId, opt => opt.Ignore())
            .ForMember(dest => dest.UserEmail, opt => opt.Ignore())
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.AdminNotes, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}

