using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.FiBuKonto;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for FiBuKonto entity mappings
/// </summary>
public class FiBuKontoProfile : Profile
{
    public FiBuKontoProfile()
    {
        // Entity -> DTO
        CreateMap<FiBuKonto, FiBuKontoDto>();

        // CreateDTO -> Entity
        CreateMap<CreateFiBuKontoDto, FiBuKonto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.ZahlungTyp, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuchungen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePosten, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateFiBuKontoDto, FiBuKonto>()
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.ZahlungTyp, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuchungen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePosten, opt => opt.Ignore());
    }
}

