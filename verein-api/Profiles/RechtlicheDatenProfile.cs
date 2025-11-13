using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.RechtlicheDaten;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for RechtlicheDaten entity mappings
/// </summary>
public class RechtlicheDatenProfile : Profile
{
    public RechtlicheDatenProfile()
    {
        // Entity -> DTO
        CreateMap<RechtlicheDaten, RechtlicheDatenDto>();

        // CreateDTO -> Entity
        CreateMap<CreateRechtlicheDatenDto, RechtlicheDaten>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Verein, opt => opt.Ignore()); // Navigation property

        // UpdateDTO -> Entity
        // Note: Manual property mapping is done in RechtlicheDatenService.UpdateAsync
        // to preserve existing data when partial updates are sent
        CreateMap<UpdateRechtlicheDatenDto, RechtlicheDaten>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore()); // Navigation property
    }
}

