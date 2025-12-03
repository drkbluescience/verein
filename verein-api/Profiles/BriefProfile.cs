using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Brief;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Brief-related entity mappings
/// </summary>
public class BriefProfile : Profile
{
    public BriefProfile()
    {
        // BriefVorlage mappings
        CreateMap<BriefVorlage, BriefVorlageDto>();

        CreateMap<CreateBriefVorlageDto, BriefVorlage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IstSystemvorlage, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Briefe, opt => opt.Ignore());

        CreateMap<UpdateBriefVorlageDto, BriefVorlage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.IstSystemvorlage, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Briefe, opt => opt.Ignore());

        // Brief mappings
        CreateMap<Brief, BriefDto>()
            .ForMember(dest => dest.VorlageName, opt => opt.MapFrom(src => src.Vorlage != null ? src.Vorlage.Name : null))
            .ForMember(dest => dest.NachrichtenCount, opt => opt.MapFrom(src => src.Nachrichten != null ? src.Nachrichten.Count : 0));

        CreateMap<CreateBriefDto, Brief>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Entwurf"))
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Vorlage, opt => opt.Ignore())
            .ForMember(dest => dest.Nachrichten, opt => opt.Ignore());

        CreateMap<UpdateBriefDto, Brief>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Vorlage, opt => opt.Ignore())
            .ForMember(dest => dest.Nachrichten, opt => opt.Ignore());

        // Nachricht mappings
        CreateMap<Nachricht, NachrichtDto>()
            .ForMember(dest => dest.VereinName, opt => opt.MapFrom(src => src.Verein != null ? src.Verein.Name : null))
            .ForMember(dest => dest.AbsenderName, opt => opt.MapFrom(src => src.Verein != null ? src.Verein.Name : null))
            .ForMember(dest => dest.MitgliedVorname, opt => opt.MapFrom(src => src.Mitglied != null ? src.Mitglied.Vorname : null))
            .ForMember(dest => dest.MitgliedNachname, opt => opt.MapFrom(src => src.Mitglied != null ? src.Mitglied.Nachname : null))
            .ForMember(dest => dest.MitgliedEmail, opt => opt.MapFrom(src => src.Mitglied != null ? src.Mitglied.Email : null))
            .ForMember(dest => dest.BriefTitel, opt => opt.MapFrom(src => src.Brief != null ? src.Brief.Titel : null));
    }
}

