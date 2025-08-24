using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Association business logic
/// </summary>
public class AssociationService : IAssociationService
{
    private readonly IAssociationRepository _associationRepository;
    private readonly ILogger<AssociationService> _logger;

    public AssociationService(
        IAssociationRepository associationRepository,
        ILogger<AssociationService> logger)
    {
        _associationRepository = associationRepository ?? throw new ArgumentNullException(nameof(associationRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<Association>> GetAllAssociationsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting all associations. IncludeDeleted: {IncludeDeleted}", includeDeleted);
        
        try
        {
            return await _associationRepository.GetAllAsync(includeDeleted, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all associations");
            throw;
        }
    }

    public async Task<Association?> GetAssociationByIdAsync(int id, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting association by ID: {Id}. IncludeDeleted: {IncludeDeleted}", id, includeDeleted);
        
        if (id <= 0)
        {
            _logger.LogWarning("Invalid association ID: {Id}", id);
            return null;
        }

        try
        {
            return await _associationRepository.GetByIdAsync(id, includeDeleted, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by ID: {Id}", id);
            throw;
        }
    }

    public async Task<Association?> GetAssociationByNumberAsync(string associationNumber, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting association by number: {AssociationNumber}", associationNumber);
        
        if (string.IsNullOrWhiteSpace(associationNumber))
        {
            _logger.LogWarning("Association number is null or empty");
            return null;
        }

        try
        {
            return await _associationRepository.GetByAssociationNumberAsync(associationNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by number: {AssociationNumber}", associationNumber);
            throw;
        }
    }

    public async Task<Association?> GetAssociationByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting association by client code: {ClientCode}", clientCode);
        
        if (string.IsNullOrWhiteSpace(clientCode))
        {
            _logger.LogWarning("Client code is null or empty");
            return null;
        }

        try
        {
            return await _associationRepository.GetByClientCodeAsync(clientCode, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by client code: {ClientCode}", clientCode);
            throw;
        }
    }

    public async Task<IEnumerable<Association>> SearchAssociationsAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Searching associations with term: {SearchTerm}", searchTerm);
        
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            _logger.LogWarning("Search term is null or empty");
            return Enumerable.Empty<Association>();
        }

        try
        {
            return await _associationRepository.SearchByNameAsync(searchTerm, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching associations with term: {SearchTerm}", searchTerm);
            throw;
        }
    }

    public async Task<IEnumerable<Association>> GetActiveAssociationsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting active associations");
        
        try
        {
            return await _associationRepository.GetActiveAssociationsAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting active associations");
            throw;
        }
    }

    public async Task<(IEnumerable<Association> Associations, int TotalCount)> GetPaginatedAssociationsAsync(
        int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting paginated associations. Page: {Page}, PageSize: {PageSize}, SearchTerm: {SearchTerm}, IncludeDeleted: {IncludeDeleted}", 
            page, pageSize, searchTerm, includeDeleted);
        
        if (page <= 0)
        {
            _logger.LogWarning("Invalid page number: {Page}. Setting to 1", page);
            page = 1;
        }

        if (pageSize <= 0 || pageSize > 100)
        {
            _logger.LogWarning("Invalid page size: {PageSize}. Setting to 10", pageSize);
            pageSize = 10;
        }

        try
        {
            var associations = await _associationRepository.GetPaginatedAsync(page, pageSize, searchTerm, includeDeleted, cancellationToken);
            var totalCount = await _associationRepository.GetTotalCountAsync(searchTerm, includeDeleted, cancellationToken);
            
            return (associations, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paginated associations");
            throw;
        }
    }

    public async Task<Association> CreateAssociationAsync(Association association, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new association: {Name}", association?.Name);
        
        if (association == null)
            throw new ArgumentNullException(nameof(association));

        try
        {
            // Validate association
            var (isValid, errors) = await ValidateAssociationAsync(association, false, cancellationToken);
            if (!isValid)
            {
                var errorMessage = string.Join(", ", errors);
                _logger.LogWarning("Association validation failed: {Errors}", errorMessage);
                throw new ArgumentException($"Association validation failed: {errorMessage}");
            }

            var createdAssociation = await _associationRepository.AddAsync(association, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);
            
            _logger.LogInformation("Association created successfully with ID: {Id}", createdAssociation.Id);
            return createdAssociation;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating association: {Name}", association?.Name);
            throw;
        }
    }

    public async Task<Association> UpdateAssociationAsync(Association association, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating association: {Id} - {Name}", association?.Id, association?.Name);

        if (association == null)
            throw new ArgumentNullException(nameof(association));

        try
        {
            // Check if association exists
            var existingAssociation = await _associationRepository.GetByIdAsync(association.Id, false, cancellationToken);
            if (existingAssociation == null)
            {
                _logger.LogWarning("Association not found for update: {Id}", association.Id);
                throw new ArgumentException($"Association with ID {association.Id} not found");
            }

            // Validate association
            var (isValid, errors) = await ValidateAssociationAsync(association, true, cancellationToken);
            if (!isValid)
            {
                var errorMessage = string.Join(", ", errors);
                _logger.LogWarning("Association validation failed: {Errors}", errorMessage);
                throw new ArgumentException($"Association validation failed: {errorMessage}");
            }

            var updatedAssociation = await _associationRepository.UpdateAsync(association, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Association updated successfully: {Id}", association.Id);
            return updatedAssociation;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating association: {Id}", association?.Id);
            throw;
        }
    }

    public async Task DeleteAssociationAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting association: {Id}", id);

        if (id <= 0)
            throw new ArgumentException("Invalid association ID", nameof(id));

        try
        {
            var association = await _associationRepository.GetByIdAsync(id, false, cancellationToken);
            if (association == null)
            {
                _logger.LogWarning("Association not found for deletion: {Id}", id);
                throw new ArgumentException($"Association with ID {id} not found");
            }

            await _associationRepository.DeleteAsync(id, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Association soft deleted successfully: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while soft deleting association: {Id}", id);
            throw;
        }
    }

    public async Task HardDeleteAssociationAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Hard deleting association: {Id}", id);

        if (id <= 0)
            throw new ArgumentException("Invalid association ID", nameof(id));

        try
        {
            await _associationRepository.HardDeleteAsync(id, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Association hard deleted successfully: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while hard deleting association: {Id}", id);
            throw;
        }
    }

    public async Task ActivateAssociationAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Activating association: {Id}", id);

        if (id <= 0)
            throw new ArgumentException("Invalid association ID", nameof(id));

        try
        {
            var association = await _associationRepository.GetByIdAsync(id, true, cancellationToken);
            if (association == null)
            {
                _logger.LogWarning("Association not found for activation: {Id}", id);
                throw new ArgumentException($"Association with ID {id} not found");
            }

            association.IsActive = true;
            association.Modified = DateTime.UtcNow;

            await _associationRepository.UpdateAsync(association, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Association activated successfully: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while activating association: {Id}", id);
            throw;
        }
    }

    public async Task DeactivateAssociationAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deactivating association: {Id}", id);

        if (id <= 0)
            throw new ArgumentException("Invalid association ID", nameof(id));

        try
        {
            var association = await _associationRepository.GetByIdAsync(id, false, cancellationToken);
            if (association == null)
            {
                _logger.LogWarning("Association not found for deactivation: {Id}", id);
                throw new ArgumentException($"Association with ID {id} not found");
            }

            association.IsActive = false;
            association.Modified = DateTime.UtcNow;

            await _associationRepository.UpdateAsync(association, cancellationToken);
            await _associationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Association deactivated successfully: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deactivating association: {Id}", id);
            throw;
        }
    }

    public async Task<(bool IsValid, List<string> Errors)> ValidateAssociationAsync(Association association, bool isUpdate = false, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        // Required field validations
        if (string.IsNullOrWhiteSpace(association.Name))
        {
            errors.Add("Association name is required");
        }
        else if (association.Name.Length > 200)
        {
            errors.Add("Association name cannot exceed 200 characters");
        }

        // Optional field length validations
        if (!string.IsNullOrEmpty(association.ShortName) && association.ShortName.Length > 50)
        {
            errors.Add("Short name cannot exceed 50 characters");
        }

        if (!string.IsNullOrEmpty(association.AssociationNumber) && association.AssociationNumber.Length > 30)
        {
            errors.Add("Association number cannot exceed 30 characters");
        }

        if (!string.IsNullOrEmpty(association.TaxNumber) && association.TaxNumber.Length > 30)
        {
            errors.Add("Tax number cannot exceed 30 characters");
        }

        if (!string.IsNullOrEmpty(association.Purpose) && association.Purpose.Length > 500)
        {
            errors.Add("Purpose cannot exceed 500 characters");
        }

        if (!string.IsNullOrEmpty(association.Phone) && association.Phone.Length > 30)
        {
            errors.Add("Phone number cannot exceed 30 characters");
        }

        if (!string.IsNullOrEmpty(association.Email) && association.Email.Length > 100)
        {
            errors.Add("Email cannot exceed 100 characters");
        }

        if (!string.IsNullOrEmpty(association.Website) && association.Website.Length > 200)
        {
            errors.Add("Website URL cannot exceed 200 characters");
        }

        // Email format validation
        if (!string.IsNullOrEmpty(association.Email) && !IsValidEmail(association.Email))
        {
            errors.Add("Invalid email format");
        }

        if (!string.IsNullOrEmpty(association.RepresentativeEmail) && !IsValidEmail(association.RepresentativeEmail))
        {
            errors.Add("Invalid representative email format");
        }

        // URL format validation
        if (!string.IsNullOrEmpty(association.Website) && !IsValidUrl(association.Website))
        {
            errors.Add("Invalid website URL format");
        }

        // Business rule validations
        if (association.MemberCount.HasValue && association.MemberCount.Value < 0)
        {
            errors.Add("Member count cannot be negative");
        }

        if (association.FoundingDate.HasValue && association.FoundingDate.Value > DateTime.Today)
        {
            errors.Add("Founding date cannot be in the future");
        }

        // Uniqueness validations
        if (!string.IsNullOrEmpty(association.AssociationNumber))
        {
            var isUnique = await IsAssociationNumberUniqueAsync(association.AssociationNumber,
                isUpdate ? association.Id : null, cancellationToken);
            if (!isUnique)
            {
                errors.Add("Association number must be unique");
            }
        }

        if (!string.IsNullOrEmpty(association.ClientCode))
        {
            var isUnique = await IsClientCodeUniqueAsync(association.ClientCode,
                isUpdate ? association.Id : null, cancellationToken);
            if (!isUnique)
            {
                errors.Add("Client code must be unique");
            }
        }

        return (errors.Count == 0, errors);
    }

    public async Task<bool> IsAssociationNumberUniqueAsync(string associationNumber, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(associationNumber))
            return true;

        try
        {
            return await _associationRepository.IsAssociationNumberUniqueAsync(associationNumber, excludeId, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking association number uniqueness: {AssociationNumber}", associationNumber);
            throw;
        }
    }

    public async Task<bool> IsClientCodeUniqueAsync(string clientCode, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(clientCode))
            return true;

        try
        {
            return await _associationRepository.IsClientCodeUniqueAsync(clientCode, excludeId, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking client code uniqueness: {ClientCode}", clientCode);
            throw;
        }
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static bool IsValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
               (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}
