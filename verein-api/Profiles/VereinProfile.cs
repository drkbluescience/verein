using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Verein;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Verein entity mappings
/// </summary>
public class VereinProfile : Profile
{
    public VereinProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<Verein, VereinDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateVereinDto, Verein>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.HauptAdresse, opt => opt.Ignore())
            .ForMember(dest => dest.HauptBankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonten, opt => opt.Ignore())
            .ForMember(dest => dest.Veranstaltungen, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglieder, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedFamilien, opt => opt.Ignore())
            .ForMember(dest => dest.RechtlicheDaten, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateVereinDto, Verein>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.HauptAdresse, opt => opt.Ignore())
            .ForMember(dest => dest.HauptBankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonten, opt => opt.Ignore())
            .ForMember(dest => dest.Veranstaltungen, opt => opt.Ignore())
            .ForMember(dest => dest.Mitglieder, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedFamilien, opt => opt.Ignore())
            .ForMember(dest => dest.RechtlicheDaten, opt => opt.Ignore())
            // Handle nullable properties from UpdateDto - only update if provided
            .ForMember(dest => dest.Name, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Name)))
            .ForMember(dest => dest.Kurzname, opt => opt.Condition(src => src.Kurzname != null))
            .ForMember(dest => dest.Vereinsnummer, opt => opt.Condition(src => src.Vereinsnummer != null))
            .ForMember(dest => dest.Steuernummer, opt => opt.Condition(src => src.Steuernummer != null))
            .ForMember(dest => dest.RechtsformId, opt => opt.Condition(src => src.RechtsformId != null))
            .ForMember(dest => dest.OrganizationId, opt => opt.Condition(src => src.OrganizationId != null))
            .ForMember(dest => dest.Gruendungsdatum, opt => opt.Condition(src => src.Gruendungsdatum != null))
            .ForMember(dest => dest.Zweck, opt => opt.Condition(src => src.Zweck != null))
            .ForMember(dest => dest.AdresseId, opt => opt.Condition(src => src.AdresseId != null))
            .ForMember(dest => dest.HauptBankkontoId, opt => opt.Condition(src => src.HauptBankkontoId != null))
            .ForMember(dest => dest.Telefon, opt => opt.Condition(src => src.Telefon != null))
            .ForMember(dest => dest.Fax, opt => opt.Condition(src => src.Fax != null))
            .ForMember(dest => dest.Email, opt => opt.Condition(src => src.Email != null))
            .ForMember(dest => dest.Webseite, opt => opt.Condition(src => src.Webseite != null))
            .ForMember(dest => dest.SocialMediaLinks, opt => opt.Condition(src => src.SocialMediaLinks != null))
            .ForMember(dest => dest.Vorstandsvorsitzender, opt => opt.Condition(src => src.Vorstandsvorsitzender != null))
            .ForMember(dest => dest.Geschaeftsfuehrer, opt => opt.Condition(src => src.Geschaeftsfuehrer != null))
            .ForMember(dest => dest.VertreterEmail, opt => opt.Condition(src => src.VertreterEmail != null))
            .ForMember(dest => dest.Kontaktperson, opt => opt.Condition(src => src.Kontaktperson != null))
            .ForMember(dest => dest.Mitgliederzahl, opt => opt.Condition(src => src.Mitgliederzahl != null))
            .ForMember(dest => dest.SatzungPfad, opt => opt.Condition(src => src.SatzungPfad != null))
            .ForMember(dest => dest.LogoPfad, opt => opt.Condition(src => src.LogoPfad != null))
            .ForMember(dest => dest.ExterneReferenzId, opt => opt.Condition(src => src.ExterneReferenzId != null))
            .ForMember(dest => dest.Mandantencode, opt => opt.Condition(src => src.Mandantencode != null))
            .ForMember(dest => dest.EPostEmpfangAdresse, opt => opt.Condition(src => src.EPostEmpfangAdresse != null))
            .ForMember(dest => dest.SEPA_GlaeubigerID, opt => opt.Condition(src => src.SEPA_GlaeubigerID != null))
            .ForMember(dest => dest.UstIdNr, opt => opt.Condition(src => src.UstIdNr != null))
            .ForMember(dest => dest.ElektronischeSignaturKey, opt => opt.Condition(src => src.ElektronischeSignaturKey != null))
            .ForMember(dest => dest.Aktiv, opt => opt.Condition(src => src.Aktiv != null));
    }
}
