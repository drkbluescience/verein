using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.DurchlaufendePosten;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for DurchlaufendePosten entity mappings
/// </summary>
public class DurchlaufendePostenProfile : Profile
{
    public DurchlaufendePostenProfile()
    {
        // Entity -> DTO
        CreateMap<DurchlaufendePosten, DurchlaufendePostenDto>()
            .ForMember(dest => dest.FiBuKontoBezeichnung, opt => opt.MapFrom(src => src.FiBuKonto != null ? src.FiBuKonto.Bezeichnung : null));

        // CreateDTO -> Entity
        CreateMap<CreateDurchlaufendePostenDto, DurchlaufendePosten>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AusgabenDatum, opt => opt.Ignore())
            .ForMember(dest => dest.AusgabenBetrag, opt => opt.Ignore())
            .ForMember(dest => dest.Referenz, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "OFFEN"))
            .ForMember(dest => dest.KassenbuchEinnahmeId, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchAusgabeId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.FiBuKonto, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchEinnahme, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchAusgabe, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateDurchlaufendePostenDto, DurchlaufendePosten>()
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.FiBuNummer, opt => opt.Ignore())
            .ForMember(dest => dest.EinnahmenDatum, opt => opt.Ignore())
            .ForMember(dest => dest.EinnahmenBetrag, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchEinnahmeId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.FiBuKonto, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchEinnahme, opt => opt.Ignore())
            .ForMember(dest => dest.KassenbuchAusgabe, opt => opt.Ignore());
    }
}

