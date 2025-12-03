using System.Text.Json;
using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Brief;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Brief-related entity mappings
/// </summary>
public class BriefProfile : Profile
{
    private static readonly JsonSerializerOptions JsonOptions = new();

    private static List<int>? DeserializeIds(string? json)
    {
        if (string.IsNullOrEmpty(json)) return null;
        try { return JsonSerializer.Deserialize<List<int>>(json, JsonOptions); }
        catch { return null; }
    }

    private static string? SerializeIds(List<int>? ids)
    {
        if (ids == null || ids.Count == 0) return null;
        return JsonSerializer.Serialize(ids, JsonOptions);
    }

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
            .ForMember(dest => dest.NachrichtenCount, opt => opt.MapFrom(src => src.Nachrichten != null ? src.Nachrichten.Count(n => !n.DeletedFlag) : 0))
            .ForMember(dest => dest.SelectedMitgliedIds, opt => opt.MapFrom(src => DeserializeIds(src.SelectedMitgliedIds)))
            .ForMember(dest => dest.Recipients, opt => opt.MapFrom(src =>
                src.Nachrichten != null && src.Nachrichten.Any(n => !n.DeletedFlag)
                    ? src.Nachrichten.Where(n => !n.DeletedFlag).Select(n => new BriefRecipientDto
                    {
                        Id = n.Id,
                        MitgliedId = n.MitgliedId,
                        Vorname = n.Mitglied != null ? n.Mitglied.Vorname : "",
                        Nachname = n.Mitglied != null ? n.Mitglied.Nachname : "",
                        Email = n.Mitglied != null ? n.Mitglied.Email : null,
                        IstGelesen = n.IstGelesen,
                        GelesenDatum = n.GelesenDatum,
                        GesendetDatum = n.GesendetDatum
                    }).ToList()
                    : null));

        CreateMap<CreateBriefDto, Brief>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Entwurf"))
            .ForMember(dest => dest.SelectedMitgliedIds, opt => opt.MapFrom(src => SerializeIds(src.SelectedMitgliedIds)))
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
            .ForMember(dest => dest.SelectedMitgliedIds, opt => opt.MapFrom(src => SerializeIds(src.SelectedMitgliedIds)))
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

