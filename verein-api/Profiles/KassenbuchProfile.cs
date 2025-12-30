using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Kassenbuch;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Kassenbuch entity mappings
/// </summary>
public class KassenbuchProfile : Profile
{
    public KassenbuchProfile()
    {
        // Entity -> DTO
        CreateMap<Kassenbuch, KassenbuchDto>()
            .ForMember(dest => dest.FiBuKontoBezeichnung, opt => opt.MapFrom(src => src.FiBuKonto != null ? src.FiBuKonto.Bezeichnung : null))
            .ForMember(dest => dest.MitgliedName, opt => opt.MapFrom(src => src.Mitglied != null ? $"{src.Mitglied.Vorname} {src.Mitglied.Nachname}" : null));

        // CreateDTO -> Entity
        CreateMap<CreateKassenbuchDto, Kassenbuch>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.BelegNr, opt => opt.Ignore()) // Auto-generated
            .ForMember(dest => dest.Jahr, opt => opt.MapFrom(src => src.Jahr ?? src.BelegDatum.Year))
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.FiBuKonto, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedZahlung, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore())
            .ForMember(dest => dest.SpendenProtokolle, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePostenEinnahmen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePostenAusgaben, opt => opt.Ignore());

        // UpdateDTO -> Entity
        CreateMap<UpdateKassenbuchDto, Kassenbuch>()
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.BelegNr, opt => opt.Ignore())
            .ForMember(dest => dest.Jahr, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.FiBuKonto, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedZahlung, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore())
            .ForMember(dest => dest.SpendenProtokolle, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePostenEinnahmen, opt => opt.Ignore())
            .ForMember(dest => dest.DurchlaufendePostenAusgaben, opt => opt.Ignore());
    }
}
