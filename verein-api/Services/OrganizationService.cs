using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Organization;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Organization hierarchy operations
/// </summary>
public class OrganizationService : IOrganizationService
{
    private static readonly string[] AllowedOrgTypes = { "Dachverband", "Landesverband", "Region", "Verein" };
    private static readonly string[] AllowedFederationCodes = { "DITIB", "Independent", "Other" };

    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrganizationService> _logger;

    public OrganizationService(ApplicationDbContext context, ILogger<OrganizationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<OrganizationDto>> GetAllAsync(
        string? orgType = null,
        string? federationCode = null,
        int? parentId = null,
        bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Organization> query = includeDeleted
            ? _context.Organizations.IgnoreQueryFilters()
            : _context.Organizations;

        if (!string.IsNullOrWhiteSpace(orgType))
        {
            var normalizedOrgType = orgType.Trim().ToLower();
            query = query.Where(o => o.OrgType.ToLower() == normalizedOrgType);
        }

        if (!string.IsNullOrWhiteSpace(federationCode))
        {
            var normalizedFederation = federationCode.Trim().ToLower();
            query = query.Where(o => o.FederationCode != null && o.FederationCode.ToLower() == normalizedFederation);
        }

        if (parentId.HasValue)
        {
            query = query.Where(o => o.ParentOrganizationId == parentId.Value);
        }

        var organizations = await query
            .AsNoTracking()
            .OrderBy(o => o.Name)
            .ToListAsync(cancellationToken);

        return organizations.Select(MapToDto);
    }

    public async Task<OrganizationDto?> GetByIdAsync(int id, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Organization> query = includeDeleted
            ? _context.Organizations.IgnoreQueryFilters()
            : _context.Organizations;

        var organization = await query
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        return organization == null ? null : MapToDto(organization);
    }

    public async Task<OrganizationDto> CreateAsync(OrganizationCreateDto createDto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            throw new ArgumentException("Organization name is required");
        }

        var normalizedOrgType = NormalizeOrgType(createDto.OrgType);
        var normalizedFederationCode = NormalizeFederationCode(createDto.FederationCode);

        if (createDto.ParentOrganizationId.HasValue)
        {
            await ValidateParentAsync(null, createDto.ParentOrganizationId.Value, cancellationToken);
        }

        var organization = new Organization
        {
            Name = createDto.Name.Trim(),
            OrgType = normalizedOrgType,
            ParentOrganizationId = createDto.ParentOrganizationId,
            FederationCode = normalizedFederationCode,
            Aktiv = createDto.Aktiv
        };

        _context.Organizations.Add(organization);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(organization);
    }

    public async Task<OrganizationDto> UpdateAsync(int id, OrganizationUpdateDto updateDto, CancellationToken cancellationToken = default)
    {
        var organization = await _context.Organizations
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (organization == null)
        {
            throw new KeyNotFoundException($"Organization with ID {id} not found");
        }

        if (organization.DeletedFlag == true)
        {
            throw new InvalidOperationException("Organization is deleted. Restore it before updating.");
        }

        if (updateDto.Name != null)
        {
            if (string.IsNullOrWhiteSpace(updateDto.Name))
            {
                throw new ArgumentException("Organization name cannot be empty");
            }

            organization.Name = updateDto.Name.Trim();
        }

        if (updateDto.OrgType != null)
        {
            organization.OrgType = NormalizeOrgType(updateDto.OrgType);
        }

        if (updateDto.ParentOrganizationId.HasValue && updateDto.ParentOrganizationId != organization.ParentOrganizationId)
        {
            await ValidateParentAsync(id, updateDto.ParentOrganizationId.Value, cancellationToken);
            await EnsureNoCycleAsync(id, updateDto.ParentOrganizationId.Value, cancellationToken);
            organization.ParentOrganizationId = updateDto.ParentOrganizationId;
        }

        if (updateDto.FederationCode != null)
        {
            organization.FederationCode = NormalizeFederationCode(updateDto.FederationCode);
        }

        if (updateDto.Aktiv.HasValue)
        {
            organization.Aktiv = updateDto.Aktiv;
        }

        organization.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(organization);
    }

    public async Task<bool> SoftDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var organization = await _context.Organizations
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (organization == null)
        {
            return false;
        }

        var hasActiveChildren = await _context.Organizations
            .IgnoreQueryFilters()
            .AnyAsync(o => o.ParentOrganizationId == id && o.DeletedFlag == false, cancellationToken);

        if (hasActiveChildren)
        {
            throw new InvalidOperationException("Organization has active child organizations. Move or delete them first.");
        }

        organization.DeletedFlag = true;
        organization.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> RestoreAsync(int id, CancellationToken cancellationToken = default)
    {
        var organization = await _context.Organizations
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (organization == null)
        {
            return false;
        }

        if (organization.ParentOrganizationId.HasValue)
        {
            var parent = await _context.Organizations
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(o => o.Id == organization.ParentOrganizationId.Value, cancellationToken);

            if (parent == null)
            {
                throw new InvalidOperationException("Parent organization not found for restore.");
            }

            if (parent.DeletedFlag == true)
            {
                throw new InvalidOperationException("Parent organization is deleted. Restore parent first.");
            }
        }

        organization.DeletedFlag = false;
        organization.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<OrganizationTreeNodeDto> GetTreeAsync(int rootId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Organization> query = includeDeleted
            ? _context.Organizations.IgnoreQueryFilters()
            : _context.Organizations;

        var organizations = await query
            .AsNoTracking()
            .Select(o => new
            {
                o.Id,
                o.Name,
                o.OrgType,
                o.ParentOrganizationId,
                o.DeletedFlag
            })
            .ToListAsync(cancellationToken);

        var nodes = organizations.ToDictionary(
            o => o.Id,
            o => new OrganizationTreeNodeDto
            {
                Id = o.Id,
                Name = o.Name,
                OrgType = o.OrgType,
                DeletedFlag = o.DeletedFlag,
                Children = new List<OrganizationTreeNodeDto>()
            });

        foreach (var org in organizations)
        {
            if (org.ParentOrganizationId.HasValue && nodes.TryGetValue(org.ParentOrganizationId.Value, out var parent))
            {
                parent.Children.Add(nodes[org.Id]);
            }
        }

        if (!nodes.TryGetValue(rootId, out var root))
        {
            throw new KeyNotFoundException($"Organization with ID {rootId} not found");
        }

        return root;
    }

    public async Task<IEnumerable<OrganizationPathNodeDto>> GetPathAsync(int id, CancellationToken cancellationToken = default)
    {
        var organizations = await _context.Organizations
            .AsNoTracking()
            .Select(o => new
            {
                o.Id,
                o.Name,
                o.OrgType,
                o.ParentOrganizationId
            })
            .ToListAsync(cancellationToken);

        var lookup = organizations.ToDictionary(o => o.Id);

        if (!lookup.TryGetValue(id, out var current))
        {
            throw new KeyNotFoundException($"Organization with ID {id} not found");
        }

        var path = new List<OrganizationPathNodeDto>();
        var visited = new HashSet<int>();

        while (current != null)
        {
            if (!visited.Add(current.Id))
            {
                throw new InvalidOperationException("Organization path contains a cycle.");
            }

            path.Add(new OrganizationPathNodeDto
            {
                Id = current.Id,
                Name = current.Name,
                OrgType = current.OrgType
            });

            if (!current.ParentOrganizationId.HasValue)
            {
                break;
            }

            if (!lookup.TryGetValue(current.ParentOrganizationId.Value, out var parent))
            {
                break;
            }

            current = parent;
        }

        path.Reverse();
        return path;
    }

    private static OrganizationDto MapToDto(Organization organization)
    {
        return new OrganizationDto
        {
            Id = organization.Id,
            Name = organization.Name,
            OrgType = organization.OrgType,
            ParentOrganizationId = organization.ParentOrganizationId,
            FederationCode = organization.FederationCode,
            Aktiv = organization.Aktiv,
            DeletedFlag = organization.DeletedFlag
        };
    }

    private static string NormalizeOrgType(string orgType)
    {
        if (string.IsNullOrWhiteSpace(orgType))
        {
            throw new ArgumentException("OrgType is required");
        }

        var match = AllowedOrgTypes.FirstOrDefault(o => string.Equals(o, orgType.Trim(), StringComparison.OrdinalIgnoreCase));
        if (match == null)
        {
            throw new ArgumentException($"OrgType must be one of: {string.Join(", ", AllowedOrgTypes)}");
        }

        return match;
    }

    private static string? NormalizeFederationCode(string? federationCode)
    {
        if (federationCode == null)
        {
            return null;
        }

        var trimmed = federationCode.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            return null;
        }

        var match = AllowedFederationCodes.FirstOrDefault(code => string.Equals(code, trimmed, StringComparison.OrdinalIgnoreCase));
        if (match == null)
        {
            throw new ArgumentException($"FederationCode must be one of: {string.Join(", ", AllowedFederationCodes)}");
        }

        return match;
    }

    private async Task ValidateParentAsync(int? organizationId, int parentId, CancellationToken cancellationToken)
    {
        if (parentId <= 0)
        {
            throw new ArgumentException("ParentOrganizationId is invalid");
        }

        if (organizationId.HasValue && parentId == organizationId.Value)
        {
            throw new InvalidOperationException("Organization cannot be its own parent.");
        }

        var parent = await _context.Organizations
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == parentId, cancellationToken);

        if (parent == null)
        {
            throw new ArgumentException($"Parent organization with ID {parentId} not found");
        }

        if (parent.DeletedFlag == true)
        {
            throw new InvalidOperationException("Parent organization is deleted.");
        }
    }

    private async Task EnsureNoCycleAsync(int organizationId, int parentId, CancellationToken cancellationToken)
    {
        var nodes = await _context.Organizations
            .IgnoreQueryFilters()
            .Select(o => new { o.Id, o.ParentOrganizationId })
            .ToListAsync(cancellationToken);

        var childrenLookup = nodes
            .GroupBy(n => n.ParentOrganizationId)
            .ToDictionary(g => g.Key, g => g.Select(n => n.Id).ToList());

        var stack = new Stack<int>();
        var visited = new HashSet<int>();
        stack.Push(organizationId);

        while (stack.Count > 0)
        {
            var current = stack.Pop();
            if (!childrenLookup.TryGetValue(current, out var children))
            {
                continue;
            }

            foreach (var child in children)
            {
                if (!visited.Add(child))
                {
                    continue;
                }

                if (child == parentId)
                {
                    throw new InvalidOperationException("Parent organization cannot be a descendant of the node.");
                }

                stack.Push(child);
            }
        }
    }
}
