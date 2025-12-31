using VereinsApi.DTOs.Organization;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Organization hierarchy operations
/// </summary>
public interface IOrganizationService
{
    Task<IEnumerable<OrganizationDto>> GetAllAsync(
        string? orgType = null,
        string? federationCode = null,
        int? parentId = null,
        bool includeDeleted = false,
        CancellationToken cancellationToken = default);

    Task<OrganizationDto?> GetByIdAsync(
        int id,
        bool includeDeleted = false,
        CancellationToken cancellationToken = default);

    Task<OrganizationDto> CreateAsync(
        OrganizationCreateDto createDto,
        CancellationToken cancellationToken = default);

    Task<OrganizationDto> UpdateAsync(
        int id,
        OrganizationUpdateDto updateDto,
        CancellationToken cancellationToken = default);

    Task<bool> SoftDeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> RestoreAsync(int id, CancellationToken cancellationToken = default);

    Task<OrganizationTreeNodeDto> GetTreeAsync(
        int rootId,
        bool includeDeleted = false,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<OrganizationPathNodeDto>> GetPathAsync(
        int id,
        CancellationToken cancellationToken = default);
}
