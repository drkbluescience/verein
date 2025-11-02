using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.BankBuchung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for BankBuchung entity mappings
/// </summary>
public class BankBuchungProfile : Profile
{
    public BankBuchungProfile()
    {
        // Entity -> DTO
        CreateMap<BankBuchung, BankBuchungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateBankBuchungDto, BankBuchung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.BankKonto, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedZahlungen, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateBankBuchungDto, BankBuchung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.BankKontoId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.AngelegtAm, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.BankKonto, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedZahlungen, opt => opt.Ignore())
            // Handle nullable properties - only update if provided
            .ForMember(dest => dest.Buchungsdatum, opt => opt.Condition(src => src.Buchungsdatum != null))
            .ForMember(dest => dest.Betrag, opt => opt.Condition(src => src.Betrag != null))
            .ForMember(dest => dest.WaehrungId, opt => opt.Condition(src => src.WaehrungId != null))
            .ForMember(dest => dest.Empfaenger, opt => opt.Condition(src => src.Empfaenger != null))
            .ForMember(dest => dest.Verwendungszweck, opt => opt.Condition(src => src.Verwendungszweck != null))
            .ForMember(dest => dest.Referenz, opt => opt.Condition(src => src.Referenz != null))
            .ForMember(dest => dest.StatusId, opt => opt.Condition(src => src.StatusId != null));
    }
}

