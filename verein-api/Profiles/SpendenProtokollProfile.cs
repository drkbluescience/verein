using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.SpendenProtokoll;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for SpendenProtokoll entity mappings
/// </summary>
public class SpendenProtokollProfile : Profile
{
    public SpendenProtokollProfile()
    {
        // Entity -> DTO
        CreateMap<SpendenProtokoll, SpendenProtokollDto>();
        CreateMap<SpendenProtokollDetail, SpendenProtokollDetailDto>();

        // CreateDTO -> Entity
        CreateMap<CreateSpendenProtokollDto, SpendenProtokoll>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Betrag, opt => opt.Ignore()) // Calculated from details
            .ForMember(dest => dest.Zeuge1Unterschrift, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Zeuge2Unterschrift, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Zeuge3Unterschrift, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.KassenbuchId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuch, opt => opt.Ignore())
            .ForMember(dest => dest.Details, opt => opt.Ignore()); // Handled manually

        CreateMap<CreateSpendenProtokollDetailDto, SpendenProtokollDetail>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.SpendenProtokollId, opt => opt.Ignore())
            .ForMember(dest => dest.Summe, opt => opt.MapFrom(src => src.Wert * src.Anzahl))
            .ForMember(dest => dest.SpendenProtokoll, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateSpendenProtokollDto, SpendenProtokoll>()
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.Datum, opt => opt.Ignore())
            .ForMember(dest => dest.Betrag, opt => opt.Ignore())
            .ForMember(dest => dest.Protokollant, opt => opt.Ignore())
            .ForMember(dest => dest.Zeuge1Name, opt => opt.Ignore())
            .ForMember(dest => dest.Zeuge2Name, opt => opt.Ignore())
            .ForMember(dest => dest.Zeuge3Name, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Kassenbuch, opt => opt.Ignore())
            .ForMember(dest => dest.Details, opt => opt.Ignore());
    }
}

