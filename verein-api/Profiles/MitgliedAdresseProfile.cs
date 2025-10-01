using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.MitgliedAdresse;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for MitgliedAdresse entity mappings
/// </summary>
public class MitgliedAdresseProfile : Profile
{
    public MitgliedAdresseProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        // Note: Entity uses double for GPS coordinates, DTO uses float
        CreateMap<MitgliedAdresse, MitgliedAdresseDto>()
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude.HasValue ? (float?)src.Latitude.Value : null))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude.HasValue ? (float?)src.Longitude.Value : null));
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedAdresseDto, MitgliedAdresse>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => src.Aktiv ?? true))
            .ForMember(dest => dest.IstStandard, opt => opt.MapFrom(src => src.IstStandard ?? false))
            // Convert float to double for GPS coordinates
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude.HasValue ? (double?)src.Latitude.Value : null))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude.HasValue ? (double?)src.Longitude.Value : null))
            // Navigation properties
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateMitgliedAdresseDto, MitgliedAdresse>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            // Convert float to double for GPS coordinates
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude.HasValue ? (double?)src.Latitude.Value : null))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude.HasValue ? (double?)src.Longitude.Value : null))
            // Navigation properties
            .ForMember(dest => dest.Mitglied, opt => opt.Ignore())
            // Handle nullable properties from UpdateDto - only update if provided
            .ForMember(dest => dest.MitgliedId, opt => opt.Condition(src => src.MitgliedId > 0))
            .ForMember(dest => dest.AdresseTypId, opt => opt.Condition(src => src.AdresseTypId > 0))
            .ForMember(dest => dest.Strasse, opt => opt.Condition(src => src.Strasse != null))
            .ForMember(dest => dest.Hausnummer, opt => opt.Condition(src => src.Hausnummer != null))
            .ForMember(dest => dest.Adresszusatz, opt => opt.Condition(src => src.Adresszusatz != null))
            .ForMember(dest => dest.PLZ, opt => opt.Condition(src => src.PLZ != null))
            .ForMember(dest => dest.Ort, opt => opt.Condition(src => src.Ort != null))
            .ForMember(dest => dest.Stadtteil, opt => opt.Condition(src => src.Stadtteil != null))
            .ForMember(dest => dest.Bundesland, opt => opt.Condition(src => src.Bundesland != null))
            .ForMember(dest => dest.Land, opt => opt.Condition(src => src.Land != null))
            .ForMember(dest => dest.Postfach, opt => opt.Condition(src => src.Postfach != null))
            .ForMember(dest => dest.Telefonnummer, opt => opt.Condition(src => src.Telefonnummer != null))
            .ForMember(dest => dest.EMail, opt => opt.Condition(src => src.EMail != null))
            .ForMember(dest => dest.Hinweis, opt => opt.Condition(src => src.Hinweis != null))
            .ForMember(dest => dest.GueltigVon, opt => opt.Condition(src => src.GueltigVon != null))
            .ForMember(dest => dest.GueltigBis, opt => opt.Condition(src => src.GueltigBis != null))
            .ForMember(dest => dest.IstStandard, opt => opt.Condition(src => src.IstStandard != null))
            .ForMember(dest => dest.Aktiv, opt => opt.Condition(src => src.Aktiv != null));
    }
}
