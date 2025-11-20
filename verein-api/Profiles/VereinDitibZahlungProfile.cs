using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.VereinDitibZahlung;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for VereinDitibZahlung entity and DTOs
/// </summary>
public class VereinDitibZahlungProfile : Profile
{
    public VereinDitibZahlungProfile()
    {
        // Entity -> DTO
        CreateMap<VereinDitibZahlung, VereinDitibZahlungDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateVereinDitibZahlungDto, VereinDitibZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore());
            
        // UpdateDTO -> Entity
        CreateMap<UpdateVereinDitibZahlungDto, VereinDitibZahlung>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.VereinId, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Aktiv, opt => opt.Ignore())
            // Navigation properties
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.Bankkonto, opt => opt.Ignore())
            .ForMember(dest => dest.BankBuchung, opt => opt.Ignore())
            // Only update non-null values
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}

