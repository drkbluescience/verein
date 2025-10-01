using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedFamilie;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for MitgliedFamilie business operations
/// </summary>
public class MitgliedFamilieService : IMitgliedFamilieService
{
    private readonly IMitgliedFamilieRepository _mitgliedFamilieRepository;
    private readonly IMitgliedRepository _mitgliedRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedFamilieService> _logger;

    public MitgliedFamilieService(
        IMitgliedFamilieRepository mitgliedFamilieRepository,
        IMitgliedRepository mitgliedRepository,
        IMapper mapper,
        ILogger<MitgliedFamilieService> logger)
    {
        _mitgliedFamilieRepository = mitgliedFamilieRepository;
        _mitgliedRepository = mitgliedRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<MitgliedFamilieDto> CreateAsync(CreateMitgliedFamilieDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new family relationship between mitglied {MitgliedId} and parent {ParentMitgliedId}", 
            createDto.MitgliedId, createDto.ParentMitgliedId);

        // Validate business rules
        var validationResult = await ValidateCreateAsync(createDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var familienbeziehung = _mapper.Map<MitgliedFamilie>(createDto);
            familienbeziehung.Created = DateTime.UtcNow;
            familienbeziehung.CreatedBy = 1; // TODO: Get from current user context

            var createdFamilienbeziehung = await _mitgliedFamilieRepository.AddAsync(familienbeziehung, cancellationToken);
            
            _logger.LogInformation("Successfully created family relationship with ID {FamilienbeziehungId}", createdFamilienbeziehung.Id);
            
            return _mapper.Map<MitgliedFamilieDto>(createdFamilienbeziehung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating family relationship between mitglied {MitgliedId} and parent {ParentMitgliedId}", 
                createDto.MitgliedId, createDto.ParentMitgliedId);
            throw;
        }
    }

    public async Task<MitgliedFamilieDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationship by ID {FamilienbeziehungId}", id);

        var familienbeziehung = await _mitgliedFamilieRepository.GetByIdAsync(id, false, cancellationToken);
        return familienbeziehung != null ? _mapper.Map<MitgliedFamilieDto>(familienbeziehung) : null;
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all family relationships, includeDeleted: {IncludeDeleted}", includeDeleted);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<MitgliedFamilieDto> UpdateAsync(int id, UpdateMitgliedFamilieDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating family relationship with ID {FamilienbeziehungId}", id);

        // Validate business rules
        var validationResult = await ValidateUpdateAsync(id, updateDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var existingFamilienbeziehung = await _mitgliedFamilieRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingFamilienbeziehung == null)
            {
                throw new ArgumentException($"Family relationship with ID {id} not found");
            }

            _mapper.Map(updateDto, existingFamilienbeziehung);
            existingFamilienbeziehung.Modified = DateTime.UtcNow;
            existingFamilienbeziehung.ModifiedBy = 1; // TODO: Get from current user context

            var updatedFamilienbeziehung = await _mitgliedFamilieRepository.UpdateAsync(existingFamilienbeziehung, cancellationToken);
            
            _logger.LogInformation("Successfully updated family relationship with ID {FamilienbeziehungId}", id);
            
            return _mapper.Map<MitgliedFamilieDto>(updatedFamilienbeziehung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating family relationship with ID {FamilienbeziehungId}", id);
            throw;
        }
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting family relationship with ID {FamilienbeziehungId}", id);

        try
        {
            await _mitgliedFamilieRepository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted family relationship with ID {FamilienbeziehungId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting family relationship with ID {FamilienbeziehungId}", id);
            throw;
        }
    }

    public async Task<PagedResult<MitgliedFamilieDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged family relationships, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _mitgliedFamilieRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<MitgliedFamilieDto>
        {
            Items = _mapper.Map<IEnumerable<MitgliedFamilieDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Business Operations

    public async Task<MitgliedFamilieDto> CreateWithValidationAsync(CreateMitgliedFamilieDto createDto, bool validateCircularReference = true, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating family relationship with validation between mitglied {MitgliedId} and parent {ParentMitgliedId}", 
            createDto.MitgliedId, createDto.ParentMitgliedId);

        // Additional circular reference validation if requested
        if (validateCircularReference)
        {
            var wouldCreateCircular = await WouldCreateCircularReferenceAsync(createDto.MitgliedId, createDto.ParentMitgliedId, cancellationToken);
            if (wouldCreateCircular)
            {
                throw new ArgumentException("Creating this relationship would create a circular reference");
            }
        }

        return await CreateAsync(createDto, cancellationToken);
    }

    public async Task<MitgliedFamilieDto> UpdateValidityPeriodAsync(int relationshipId, DateTime? gueltigVon, DateTime? gueltigBis, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating validity period for family relationship {RelationshipId}", relationshipId);

        if (!ValidateValidityPeriod(gueltigVon, gueltigBis))
        {
            throw new ArgumentException("Invalid validity period: start date must be before end date");
        }

        try
        {
            var relationship = await _mitgliedFamilieRepository.GetByIdAsync(relationshipId, false, cancellationToken);
            if (relationship == null)
            {
                throw new ArgumentException($"Family relationship with ID {relationshipId} not found");
            }

            relationship.GueltigVon = gueltigVon;
            relationship.GueltigBis = gueltigBis;
            relationship.Modified = DateTime.UtcNow;
            relationship.ModifiedBy = 1; // TODO: Get from current user context

            var updatedRelationship = await _mitgliedFamilieRepository.UpdateAsync(relationship, cancellationToken);
            
            _logger.LogInformation("Successfully updated validity period for family relationship {RelationshipId}", relationshipId);
            
            return _mapper.Map<MitgliedFamilieDto>(updatedRelationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating validity period for family relationship {RelationshipId}", relationshipId);
            throw;
        }
    }

    public async Task<MitgliedFamilieDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting active status for family relationship {RelationshipId} to {IsActive}", id, isActive);

        try
        {
            var relationship = await _mitgliedFamilieRepository.GetByIdAsync(id, false, cancellationToken);
            if (relationship == null)
            {
                throw new ArgumentException($"Family relationship with ID {id} not found");
            }

            relationship.Aktiv = isActive;
            relationship.Modified = DateTime.UtcNow;
            relationship.ModifiedBy = 1; // TODO: Get from current user context

            var updatedRelationship = await _mitgliedFamilieRepository.UpdateAsync(relationship, cancellationToken);

            _logger.LogInformation("Successfully set active status for family relationship {RelationshipId} to {IsActive}", id, isActive);

            return _mapper.Map<MitgliedFamilieDto>(updatedRelationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting active status for family relationship {RelationshipId}", id);
            throw;
        }
    }

    public async Task<MitgliedFamilieDto> EndRelationshipAsync(int relationshipId, DateTime endDate, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Ending family relationship {RelationshipId} on {EndDate}", relationshipId, endDate);

        try
        {
            var relationship = await _mitgliedFamilieRepository.GetByIdAsync(relationshipId, false, cancellationToken);
            if (relationship == null)
            {
                throw new ArgumentException($"Family relationship with ID {relationshipId} not found");
            }

            relationship.GueltigBis = endDate;
            relationship.Aktiv = false;
            relationship.Modified = DateTime.UtcNow;
            relationship.ModifiedBy = 1; // TODO: Get from current user context

            var updatedRelationship = await _mitgliedFamilieRepository.UpdateAsync(relationship, cancellationToken);

            _logger.LogInformation("Successfully ended family relationship {RelationshipId}", relationshipId);

            return _mapper.Map<MitgliedFamilieDto>(updatedRelationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ending family relationship {RelationshipId}", relationshipId);
            throw;
        }
    }

    #endregion

    #region Search and Filter Operations

    public async Task<IEnumerable<MitgliedFamilieDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships by mitglied ID {MitgliedId}", mitgliedId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetByParentMitgliedIdAsync(int parentMitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships by parent mitglied ID {ParentMitgliedId}", parentMitgliedId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetByParentMitgliedIdAsync(parentMitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetAllRelationshipsAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all family relationships for mitglied ID {MitgliedId}", mitgliedId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetAllRelationshipsAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships by verein ID {VereinId}", vereinId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetByRelationshipTypeAsync(int familienbeziehungTypId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships by type {FamilienbeziehungTypId}", familienbeziehungTypId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetByRelationshipTypeAsync(familienbeziehungTypId, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships by status {StatusId}", statusId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetByStatusAsync(statusId, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family relationships valid at date {Date}", date);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetValidAtDateAsync(date, mitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    public async Task<IEnumerable<MitgliedFamilieDto>> GetActiveRelationshipsAsync(int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active family relationships for mitglied {MitgliedId}", mitgliedId);

        var familienbeziehungen = await _mitgliedFamilieRepository.GetActiveRelationshipsAsync(mitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedFamilieDto>>(familienbeziehungen);
    }

    #endregion

    #region Family Tree Operations

    public async Task<IEnumerable<MitgliedDto>> GetChildrenAsync(int parentMitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting children for parent mitglied {ParentMitgliedId}", parentMitgliedId);

        var children = await _mitgliedFamilieRepository.GetChildrenAsync(parentMitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(children);
    }

    public async Task<IEnumerable<MitgliedDto>> GetParentsAsync(int childMitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting parents for child mitglied {ChildMitgliedId}", childMitgliedId);

        var parents = await _mitgliedFamilieRepository.GetParentsAsync(childMitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(parents);
    }

    public async Task<IEnumerable<MitgliedDto>> GetSiblingsAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting siblings for mitglied {MitgliedId}", mitgliedId);

        try
        {
            // Get parents of the mitglied
            var parents = await _mitgliedFamilieRepository.GetParentsAsync(mitgliedId, cancellationToken);
            var siblings = new List<Mitglied>();

            // For each parent, get all children (excluding the original mitglied)
            foreach (var parent in parents)
            {
                var parentChildren = await _mitgliedFamilieRepository.GetChildrenAsync(parent.Id, cancellationToken);
                siblings.AddRange(parentChildren.Where(c => c.Id != mitgliedId));
            }

            // Remove duplicates (in case of shared parents)
            var uniqueSiblings = siblings.GroupBy(s => s.Id).Select(g => g.First());

            return _mapper.Map<IEnumerable<MitgliedDto>>(uniqueSiblings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting siblings for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    public async Task<FamilyTree> GetFamilyTreeAsync(int mitgliedId, int maxDepth = 3, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family tree for mitglied {MitgliedId} with max depth {MaxDepth}", mitgliedId, maxDepth);

        try
        {
            var rootMember = await _mitgliedRepository.GetByIdAsync(mitgliedId, false, cancellationToken);
            if (rootMember == null)
            {
                throw new ArgumentException($"Mitglied with ID {mitgliedId} not found");
            }

            var familyTree = new FamilyTree
            {
                RootMember = _mapper.Map<MitgliedDto>(rootMember)
            };

            // Get parents
            var parents = await _mitgliedFamilieRepository.GetParentsAsync(mitgliedId, cancellationToken);
            familyTree.Parents = await BuildFamilyTreeNodes(parents, "Parent", 1, maxDepth, cancellationToken);

            // Get children
            var children = await _mitgliedFamilieRepository.GetChildrenAsync(mitgliedId, cancellationToken);
            familyTree.Children = await BuildFamilyTreeNodes(children, "Child", 1, maxDepth, cancellationToken);

            // Get siblings
            var siblings = await GetSiblingsAsync(mitgliedId, cancellationToken);
            familyTree.Siblings = siblings.Select(s => new FamilyTreeNode
            {
                Member = s,
                RelationshipType = "Sibling",
                IsActive = true,
                Depth = 1
            }).ToList();

            familyTree.TotalRelatives = familyTree.Parents.Count + familyTree.Children.Count + familyTree.Siblings.Count;
            familyTree.MaxDepthReached = Math.Min(maxDepth, GetMaxDepthFromNodes(familyTree.Parents.Concat(familyTree.Children)));

            return familyTree;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family tree for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    public async Task<IEnumerable<MitgliedDto>> GetAllRelativesAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all relatives for mitglied {MitgliedId}", mitgliedId);

        try
        {
            var relatives = new List<Mitglied>();

            // Get parents
            var parents = await _mitgliedFamilieRepository.GetParentsAsync(mitgliedId, cancellationToken);
            relatives.AddRange(parents);

            // Get children
            var children = await _mitgliedFamilieRepository.GetChildrenAsync(mitgliedId, cancellationToken);
            relatives.AddRange(children);

            // Get siblings
            var siblings = await GetSiblingsAsync(mitgliedId, cancellationToken);
            relatives.AddRange(_mapper.Map<IEnumerable<Mitglied>>(siblings));

            // Remove duplicates
            var uniqueRelatives = relatives.GroupBy(r => r.Id).Select(g => g.First());

            return _mapper.Map<IEnumerable<MitgliedDto>>(uniqueRelatives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all relatives for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    private async Task<List<FamilyTreeNode>> BuildFamilyTreeNodes(IEnumerable<Mitglied> members, string relationshipType, int currentDepth, int maxDepth, CancellationToken cancellationToken)
    {
        var nodes = new List<FamilyTreeNode>();

        foreach (var member in members)
        {
            var node = new FamilyTreeNode
            {
                Member = _mapper.Map<MitgliedDto>(member),
                RelationshipType = relationshipType,
                IsActive = true,
                Depth = currentDepth
            };

            // Recursively build children if we haven't reached max depth
            if (currentDepth < maxDepth)
            {
                var memberChildren = await _mitgliedFamilieRepository.GetChildrenAsync(member.Id, cancellationToken);
                node.Children = await BuildFamilyTreeNodes(memberChildren, "Child", currentDepth + 1, maxDepth, cancellationToken);
            }

            nodes.Add(node);
        }

        return nodes;
    }

    private static int GetMaxDepthFromNodes(IEnumerable<FamilyTreeNode> nodes)
    {
        if (!nodes.Any())
            return 0;

        return nodes.Max(n => Math.Max(n.Depth, n.Children.Any() ? GetMaxDepthFromNodes(n.Children) : n.Depth));
    }

    #endregion

    #region Validation Operations

    public async Task<bool> RelationshipExistsAsync(int mitgliedId, int parentMitgliedId, int familienbeziehungTypId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if relationship exists between mitglied {MitgliedId} and parent {ParentMitgliedId}", mitgliedId, parentMitgliedId);

        return await _mitgliedFamilieRepository.RelationshipExistsAsync(mitgliedId, parentMitgliedId, familienbeziehungTypId, excludeId, cancellationToken);
    }

    public async Task<bool> WouldCreateCircularReferenceAsync(int mitgliedId, int parentMitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking for circular reference between mitglied {MitgliedId} and parent {ParentMitgliedId}", mitgliedId, parentMitgliedId);

        return await _mitgliedFamilieRepository.WouldCreateCircularReferenceAsync(mitgliedId, parentMitgliedId, cancellationToken);
    }

    public async Task<ValidationResult> ValidateCreateAsync(CreateMitgliedFamilieDto createDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check required fields
        if (createDto.MitgliedId <= 0)
        {
            result.Errors.Add("MitgliedId ist erforderlich");
        }

        if (createDto.ParentMitgliedId <= 0)
        {
            result.Errors.Add("ParentMitgliedId ist erforderlich");
        }

        if (createDto.FamilienbeziehungTypId <= 0)
        {
            result.Errors.Add("FamilienbeziehungTypId ist erforderlich");
        }

        if (createDto.VereinId <= 0)
        {
            result.Errors.Add("VereinId ist erforderlich");
        }

        // Check self-reference
        if (createDto.MitgliedId == createDto.ParentMitgliedId)
        {
            result.Errors.Add("Ein Mitglied kann nicht sein eigener Elternteil sein");
        }

        // Check if relationship already exists
        if (createDto.MitgliedId > 0 && createDto.ParentMitgliedId > 0 && createDto.FamilienbeziehungTypId > 0)
        {
            var relationshipExists = await RelationshipExistsAsync(createDto.MitgliedId, createDto.ParentMitgliedId, createDto.FamilienbeziehungTypId, null, cancellationToken);
            if (relationshipExists)
            {
                result.Errors.Add("Diese Familienbeziehung existiert bereits");
            }
        }

        // Check for circular reference
        if (createDto.MitgliedId > 0 && createDto.ParentMitgliedId > 0)
        {
            var wouldCreateCircular = await WouldCreateCircularReferenceAsync(createDto.MitgliedId, createDto.ParentMitgliedId, cancellationToken);
            if (wouldCreateCircular)
            {
                result.Errors.Add("Diese Beziehung würde eine zirkuläre Referenz erstellen");
            }
        }

        // Validate validity period
        if (!ValidateValidityPeriod(createDto.GueltigVon, createDto.GueltigBis))
        {
            result.Errors.Add("Gültigkeitszeitraum ist ungültig: Startdatum muss vor Enddatum liegen");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public async Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedFamilieDto updateDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check if relationship exists
        var existingRelationship = await _mitgliedFamilieRepository.GetByIdAsync(id, false, cancellationToken);
        if (existingRelationship == null)
        {
            result.Errors.Add($"Familienbeziehung mit ID {id} nicht gefunden");
            result.IsValid = false;
            return result;
        }

        // Validate validity period
        var gueltigVon = updateDto.GueltigVon ?? existingRelationship.GueltigVon;
        var gueltigBis = updateDto.GueltigBis ?? existingRelationship.GueltigBis;

        if (!ValidateValidityPeriod(gueltigVon, gueltigBis))
        {
            result.Errors.Add("Gültigkeitszeitraum ist ungültig: Startdatum muss vor Enddatum liegen");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public bool ValidateValidityPeriod(DateTime? gueltigVon, DateTime? gueltigBis)
    {
        if (!gueltigVon.HasValue || !gueltigBis.HasValue)
        {
            return true; // Null values are valid (open-ended periods)
        }

        return gueltigVon.Value <= gueltigBis.Value;
    }

    #endregion

    #region Statistics Operations

    public async Task<int> GetCountByMitgliedAsync(int mitgliedId, bool asChild = true, bool asParent = true, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting count of family relationships for mitglied {MitgliedId}", mitgliedId);

        return await _mitgliedFamilieRepository.GetCountByMitgliedAsync(mitgliedId, asChild, asParent, activeOnly, cancellationToken);
    }

    public async Task<FamilyStatistics> GetFamilyStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting family statistics for mitglied {MitgliedId}", mitgliedId);

        try
        {
            var allRelationships = await _mitgliedFamilieRepository.GetAllRelationshipsAsync(mitgliedId, true, cancellationToken);
            var activeRelationships = allRelationships.Where(r => r.Aktiv == true);
            var inactiveRelationships = allRelationships.Where(r => r.Aktiv != true);

            var asChildRelationships = allRelationships.Where(r => r.MitgliedId == mitgliedId);
            var asParentRelationships = allRelationships.Where(r => r.ParentMitgliedId == mitgliedId);

            var totalChildren = await _mitgliedFamilieRepository.GetChildrenAsync(mitgliedId, cancellationToken);
            var totalParents = await _mitgliedFamilieRepository.GetParentsAsync(mitgliedId, cancellationToken);
            var totalSiblings = await GetSiblingsAsync(mitgliedId, cancellationToken);

            var relationshipsByType = allRelationships
                .GroupBy(r => r.FamilienbeziehungTypId)
                .ToDictionary(g => g.Key, g => g.Count());

            var relationshipsByStatus = allRelationships
                .GroupBy(r => r.MitgliedFamilieStatusId)
                .ToDictionary(g => g.Key, g => g.Count());

            return new FamilyStatistics
            {
                TotalRelationships = allRelationships.Count(),
                ActiveRelationships = activeRelationships.Count(),
                InactiveRelationships = inactiveRelationships.Count(),
                AsChildRelationships = asChildRelationships.Count(),
                AsParentRelationships = asParentRelationships.Count(),
                TotalChildren = totalChildren.Count(),
                TotalParents = totalParents.Count(),
                TotalSiblings = totalSiblings.Count(),
                RelationshipsByType = relationshipsByType,
                RelationshipsByStatus = relationshipsByStatus
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family statistics for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    #endregion
}
