using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Bankkonto;

namespace VereinsApi.Profiles;

/// <summary>
/// AutoMapper profile for Bankkonto entity mappings
/// </summary>
public class BankkontoProfile : Profile
{
    public BankkontoProfile()
    {
        // Entity -> DTO (simple mapping, all properties match)
        CreateMap<Bankkonto, BankkontoDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateBankkontoDto, Bankkonto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.Modified, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedFlag, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Aktiv, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.VereineAsMainBankAccount, opt => opt.Ignore());
            
        // UpdateDTO -> Entity (for updating existing entity)
        CreateMap<UpdateBankkontoDto, Bankkonto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore()) // Will be set by GetCurrentUserId()
            .ForMember(dest => dest.DeletedFlag, opt => opt.Ignore())
            .ForMember(dest => dest.Verein, opt => opt.Ignore())
            .ForMember(dest => dest.VereineAsMainBankAccount, opt => opt.Ignore());
    }
}
