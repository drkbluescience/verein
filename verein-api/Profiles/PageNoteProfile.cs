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
        // Entity -> DTO (explicit mapping to avoid issues with inherited properties)
        CreateMap<PageNote, PageNoteDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PageUrl, opt => opt.MapFrom(src => src.PageUrl))
            .ForMember(dest => dest.PageTitle, opt => opt.MapFrom(src => src.PageTitle))
            .ForMember(dest => dest.EntityType, opt => opt.MapFrom(src => src.EntityType))
            .ForMember(dest => dest.EntityId, opt => opt.MapFrom(src => src.EntityId))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority))
            .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.UserEmail))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.CompletedBy, opt => opt.MapFrom(src => src.CompletedBy))
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt))
            .ForMember(dest => dest.AdminNotes, opt => opt.MapFrom(src => src.AdminNotes))
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
            .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => src.Modified))
            .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.ModifiedBy))
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => src.DeletedFlag))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.Aktiv));
        
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

