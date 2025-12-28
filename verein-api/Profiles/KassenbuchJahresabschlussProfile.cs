using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.KassenbuchJahresabschluss;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for KassenbuchJahresabschluss entity mappings
/// </summary>
public class KassenbuchJahresabschlussProfile : Profile
{
    public KassenbuchJahresabschlussProfile()
    {
        // Entity -> DTO
        CreateMap<KassenbuchJahresabschluss, KassenbuchJahresabschlussDto>();

        // CreateDTO -> Entity
        CreateMap<CreateKassenbuchJahresabschlussDto, KassenbuchJahresabschluss>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Geprueft, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.GeprueftVon, opt => opt.Ignore())
            .ForMember(dest => dest.GeprueftAm, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateKassenbuchJahresabschlussDto, KassenbuchJahresabschluss>()
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.Jahr, opt => opt.Ignore())
            .ForMember(dest => dest.KasseAnfangsbestand, opt => opt.Ignore())
            .ForMember(dest => dest.BankAnfangsbestand, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore());
    }
}

