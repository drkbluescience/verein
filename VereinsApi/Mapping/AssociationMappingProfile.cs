using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Association;

namespace VereinsApi.Mapping;

/// <summary>
/// AutoMapper profile for Association entity mappings
/// </summary>
public class AssociationMappingProfile : Profile
{
    public AssociationMappingProfile()
    {
        CreateMap<Association, AssociationDto>()
            .ReverseMap();

        CreateMap<CreateAssociationDto, Association>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<UpdateAssociationDto, Association>()
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

        CreateMap<Association, CreateAssociationDto>();
        CreateMap<Association, UpdateAssociationDto>();
    }
}
