using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.MitgliedForderung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for MitgliedForderung entity mappings
/// </summary>
public class MitgliedForderungProfile : Profile
{
    public MitgliedForderungProfile()
    {
        // Entity -> DTO
        CreateMap<MitgliedForderung, MitgliedForderungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateMitgliedForderungDto, MitgliedForderung>()
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
            .ForMember(dest => dest.MitgliedZahlungen, opt => opt.Ignore())
            .ForMember(dest => dest.ForderungZahlungen, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateMitgliedForderungDto, MitgliedForderung>()
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
            .ForMember(dest => dest.MitgliedZahlungen, opt => opt.Ignore())
            .ForMember(dest => dest.ForderungZahlungen, opt => opt.Ignore())
            // Handle nullable properties - only update if provided
            .ForMember(dest => dest.ZahlungTypId, opt => opt.Condition(src => src.ZahlungTypId != null))
            .ForMember(dest => dest.Forderungsnummer, opt => opt.Condition(src => src.Forderungsnummer != null))
            .ForMember(dest => dest.Betrag, opt => opt.Condition(src => src.Betrag != null))
            .ForMember(dest => dest.WaehrungId, opt => opt.Condition(src => src.WaehrungId != null))
            .ForMember(dest => dest.Jahr, opt => opt.Condition(src => src.Jahr != null))
            .ForMember(dest => dest.Quartal, opt => opt.Condition(src => src.Quartal != null))
            .ForMember(dest => dest.Monat, opt => opt.Condition(src => src.Monat != null))
            .ForMember(dest => dest.Faelligkeit, opt => opt.Condition(src => src.Faelligkeit != null))
            .ForMember(dest => dest.Beschreibung, opt => opt.Condition(src => src.Beschreibung != null))
            .ForMember(dest => dest.StatusId, opt => opt.Condition(src => src.StatusId != null))
            .ForMember(dest => dest.BezahltAm, opt => opt.Condition(src => src.BezahltAm != null));
    }
}

