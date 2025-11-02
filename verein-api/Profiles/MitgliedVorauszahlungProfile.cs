using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.MitgliedVorauszahlung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for MitgliedVorauszahlung entity mappings
/// </summary>
public class MitgliedVorauszahlungProfile : Profile
{
    public MitgliedVorauszahlungProfile()
    {
        // Entity -> DTO
        CreateMap<MitgliedVorauszahlung, MitgliedVorauszahlungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedVorauszahlungDto, MitgliedVorauszahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.Zahlung, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateMitgliedVorauszahlungDto, MitgliedVorauszahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.MitgliedId, opt => opt.Ignore())
            .ForMember(dest => dest.ZahlungId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Zahlung, opt => opt.Ignore())
            // Handle nullable properties - only update if provided
            .ForMember(dest => dest.Betrag, opt => opt.Condition(src => src.Betrag != null));
    }
}

