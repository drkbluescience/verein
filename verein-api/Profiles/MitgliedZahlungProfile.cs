using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.MitgliedZahlung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for MitgliedZahlung entity mappings
/// </summary>
public class MitgliedZahlungProfile : Profile
{
    public MitgliedZahlungProfile()
    {
        // Entity -> DTO
        CreateMap<MitgliedZahlung, MitgliedZahlungDto>()
            .ForMember(dest => dest.Bankkonto, opt => opt.MapFrom(src => src.Bankkonto));
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedZahlungDto, MitgliedZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.Forderung, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore())
            .ForMember(dest => dest.ForderungZahlungen, opt => opt.Ignore())
            .ForMember(dest => dest.Vorauszahlungen, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateMitgliedZahlungDto, MitgliedZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            .ForMember(dest => dest.Forderung, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore())
            .ForMember(dest => dest.ForderungZahlungen, opt => opt.Ignore())
            .ForMember(dest => dest.Vorauszahlungen, opt => opt.Ignore())
            // Handle nullable properties - only update if provided
            .ForMember(dest => dest.ForderungId, opt => opt.Condition(src => src.ForderungId != null))
            .ForMember(dest => dest.ZahlungTypId, opt => opt.Condition(src => src.ZahlungTypId != null))
            .ForMember(dest => dest.Betrag, opt => opt.Condition(src => src.Betrag != null))
            .ForMember(dest => dest.WaehrungId, opt => opt.Condition(src => src.WaehrungId != null))
            .ForMember(dest => dest.Zahlungsdatum, opt => opt.Condition(src => src.Zahlungsdatum != null))
            .ForMember(dest => dest.Zahlungsweg, opt => opt.Condition(src => src.Zahlungsweg != null))
            .ForMember(dest => dest.BankkontoId, opt => opt.Condition(src => src.BankkontoId != null))
            .ForMember(dest => dest.Referenz, opt => opt.Condition(src => src.Referenz != null))
            .ForMember(dest => dest.Bemerkung, opt => opt.Condition(src => src.Bemerkung != null))
            .ForMember(dest => dest.StatusId, opt => opt.Condition(src => src.StatusId != null))
            .ForMember(dest => dest.BankBuchungId, opt => opt.Condition(src => src.BankBuchungId != null));
    }
}

