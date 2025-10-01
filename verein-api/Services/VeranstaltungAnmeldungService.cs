using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.VeranstaltungAnmeldung;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for VeranstaltungAnmeldung business operations
/// </summary>
public class VeranstaltungAnmeldungService : IVeranstaltungAnmeldungService
{
    private readonly IRepository<VeranstaltungAnmeldung> _anmeldungRepository;
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly IRepository<Mitglied> _mitgliedRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VeranstaltungAnmeldungService> _logger;

    public VeranstaltungAnmeldungService(
        IRepository<VeranstaltungAnmeldung> anmeldungRepository,
        IRepository<Veranstaltung> veranstaltungRepository,
        IRepository<Mitglied> mitgliedRepository,
        IMapper mapper,
        ILogger<VeranstaltungAnmeldungService> logger)
    {
        _anmeldungRepository = anmeldungRepository;
        _veranstaltungRepository = veranstaltungRepository;
        _mitgliedRepository = mitgliedRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VeranstaltungAnmeldungDto> CreateAsync(CreateVeranstaltungAnmeldungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new veranstaltung anmeldung for Mitglied {MitgliedId} and Veranstaltung {VeranstaltungId}", 
            createDto.MitgliedId, createDto.VeranstaltungId);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var anmeldung = _mapper.Map<VeranstaltungAnmeldung>(createDto);
            // Anmeldedatum is handled by Created field in AuditableEntity
            
            var createdAnmeldung = await _anmeldungRepository.AddAsync(anmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created veranstaltung anmeldung with ID {AnmeldungId}", createdAnmeldung.Id);
            return _mapper.Map<VeranstaltungAnmeldungDto>(createdAnmeldung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating veranstaltung anmeldung for Mitglied {MitgliedId}", createDto.MitgliedId);
            throw;
        }
    }

    public async Task<VeranstaltungAnmeldungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltung anmeldung by ID {AnmeldungId}", id);

        var anmeldung = await _anmeldungRepository.GetByIdAsync(id, false, cancellationToken);
        return anmeldung != null ? _mapper.Map<VeranstaltungAnmeldungDto>(anmeldung) : null;
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all veranstaltung anmeldungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var anmeldungen = await _anmeldungRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<VeranstaltungAnmeldungDto> UpdateAsync(int id, UpdateVeranstaltungAnmeldungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating veranstaltung anmeldung {AnmeldungId}", id);

        try
        {
            var existingAnmeldung = await _anmeldungRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingAnmeldung == null)
            {
                throw new ArgumentException($"VeranstaltungAnmeldung with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingAnmeldung);
            
            var updatedAnmeldung = await _anmeldungRepository.UpdateAsync(existingAnmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated veranstaltung anmeldung {AnmeldungId}", id);
            return _mapper.Map<VeranstaltungAnmeldungDto>(updatedAnmeldung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating veranstaltung anmeldung {AnmeldungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting veranstaltung anmeldung {AnmeldungId}", id);

        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(id, false, cancellationToken);
            if (anmeldung == null)
            {
                _logger.LogWarning("VeranstaltungAnmeldung {AnmeldungId} not found for deletion", id);
                return false;
            }

            await _anmeldungRepository.DeleteAsync(anmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted veranstaltung anmeldung {AnmeldungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting veranstaltung anmeldung {AnmeldungId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting veranstaltung anmeldung {AnmeldungId}", id);

        try
        {
            await _anmeldungRepository.HardDeleteAsync(id, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted veranstaltung anmeldung {AnmeldungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting veranstaltung anmeldung {AnmeldungId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting anmeldungen for Veranstaltung {VeranstaltungId}", veranstaltungId);

        var anmeldungen = await _anmeldungRepository.GetAsync(a => a.VeranstaltungId == veranstaltungId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting anmeldungen for Mitglied {MitgliedId}", mitgliedId);

        var anmeldungen = await _anmeldungRepository.GetAsync(a => a.MitgliedId == mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByStatusAsync(int statusId, int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting anmeldungen by status {StatusId}", statusId);

        // Convert statusId to status string for compatibility
        var statusString = statusId switch
        {
            1 => "Confirmed",
            2 => "Pending",
            3 => "Cancelled",
            _ => "Pending"
        };

        var anmeldungen = await _anmeldungRepository.GetAsync(a =>
            a.Status == statusString &&
            (veranstaltungId == null || a.VeranstaltungId == veranstaltungId),
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting anmeldungen by date range {StartDate} - {EndDate}", startDate, endDate);

        var anmeldungen = await _anmeldungRepository.GetAsync(a =>
            a.Created >= startDate && a.Created <= endDate &&
            (veranstaltungId == null || a.VeranstaltungId == veranstaltungId),
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetActiveAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active anmeldungen");

        var anmeldungen = await _anmeldungRepository.GetAsync(a => 
            a.Aktiv == true &&
            (veranstaltungId == null || a.VeranstaltungId == veranstaltungId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(anmeldungen);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetConfirmedAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting confirmed anmeldungen");

        // Assuming status ID 1 = Confirmed (would need to be configured properly)
        return await GetByStatusAsync(1, veranstaltungId, cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldungDto>> GetWaitlistedAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting waitlisted anmeldungen");

        // Assuming status ID 2 = Waitlisted (would need to be configured properly)
        return await GetByStatusAsync(2, veranstaltungId, cancellationToken);
    }

    #endregion

    #region Business Operations

    public async Task<VeranstaltungAnmeldungDto> RegisterAsync(int veranstaltungId, int mitgliedId, string? bemerkung = null, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Registering Mitglied {MitgliedId} for Veranstaltung {VeranstaltungId}", mitgliedId, veranstaltungId);

        try
        {
            // Check if already registered
            if (await IsAlreadyRegisteredAsync(veranstaltungId, mitgliedId, cancellationToken))
            {
                throw new InvalidOperationException("Mitglied is already registered for this veranstaltung");
            }

            // Check if registration is possible
            if (!await CanRegisterAsync(veranstaltungId, cancellationToken))
            {
                throw new InvalidOperationException("Registration is not possible for this veranstaltung");
            }

            // Determine if should be confirmed or waitlisted
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
            var currentRegistrations = await GetRegistrationCountAsync(veranstaltungId, true, cancellationToken);
            
            var statusId = 1; // Default to confirmed
            if (veranstaltung?.MaxTeilnehmer.HasValue == true && currentRegistrations >= veranstaltung.MaxTeilnehmer.Value)
            {
                statusId = 2; // Waitlisted
            }

            var createDto = new CreateVeranstaltungAnmeldungDto
            {
                VeranstaltungId = veranstaltungId,
                MitgliedId = mitgliedId,
                Status = statusId switch
                {
                    1 => "Confirmed",
                    2 => "Pending",
                    3 => "Cancelled",
                    _ => "Pending"
                },
                Bemerkung = bemerkung
            };

            return await CreateAsync(createDto, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering Mitglied {MitgliedId} for Veranstaltung {VeranstaltungId}", mitgliedId, veranstaltungId);
            throw;
        }
    }

    public async Task<bool> CancelRegistrationAsync(int anmeldungId, string? reason = null, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Cancelling registration {AnmeldungId} with reason: {Reason}", anmeldungId, reason);

        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(anmeldungId, false, cancellationToken);
            if (anmeldung == null)
            {
                return false;
            }

            anmeldung.Aktiv = false;
            // Note: Would need to add cancellation fields to entity if needed
            await _anmeldungRepository.UpdateAsync(anmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully cancelled registration {AnmeldungId}", anmeldungId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling registration {AnmeldungId}", anmeldungId);
            throw;
        }
    }

    public async Task<bool> ConfirmRegistrationAsync(int anmeldungId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Confirming registration {AnmeldungId}", anmeldungId);

        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(anmeldungId, false, cancellationToken);
            if (anmeldung == null)
            {
                return false;
            }

            anmeldung.Status = "Confirmed";
            await _anmeldungRepository.UpdateAsync(anmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully confirmed registration {AnmeldungId}", anmeldungId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming registration {AnmeldungId}", anmeldungId);
            throw;
        }
    }

    public async Task<bool> MoveFromWaitlistAsync(int anmeldungId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Moving registration {AnmeldungId} from waitlist", anmeldungId);

        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(anmeldungId, false, cancellationToken);
            if (anmeldung == null || anmeldung.Status != "Pending") // Not waitlisted
            {
                return false;
            }

            // Check if there's capacity
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(anmeldung.VeranstaltungId, false, cancellationToken);
            var currentConfirmed = await _anmeldungRepository.CountAsync(a =>
                a.VeranstaltungId == anmeldung.VeranstaltungId &&
                a.Status == "Confirmed" &&
                (a.Aktiv == true || a.Aktiv == null),
                false, cancellationToken);

            if (veranstaltung?.MaxTeilnehmer.HasValue == true && currentConfirmed >= veranstaltung.MaxTeilnehmer.Value)
            {
                return false; // No capacity available
            }

            anmeldung.Status = "Confirmed";
            await _anmeldungRepository.UpdateAsync(anmeldung, cancellationToken);
            await _anmeldungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully moved registration {AnmeldungId} from waitlist", anmeldungId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error moving registration {AnmeldungId} from waitlist", anmeldungId);
            throw;
        }
    }

    #endregion

    #region Private Methods

    private async Task ValidateCreateAsync(CreateVeranstaltungAnmeldungDto createDto, CancellationToken cancellationToken)
    {
        // Validate that veranstaltung exists
        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(createDto.VeranstaltungId, false, cancellationToken);
        if (veranstaltung == null)
        {
            throw new ArgumentException($"Veranstaltung with ID {createDto.VeranstaltungId} not found");
        }

        // Validate that mitglied exists (only if MitgliedId is provided)
        if (createDto.MitgliedId.HasValue)
        {
            var mitglied = await _mitgliedRepository.GetByIdAsync(createDto.MitgliedId.Value, false, cancellationToken);
            if (mitglied == null)
            {
                throw new ArgumentException($"Mitglied with ID {createDto.MitgliedId} not found");
            }
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateVeranstaltungAnmeldungDto updateDto, CancellationToken cancellationToken)
    {
        // Add validation logic as needed
        await Task.CompletedTask;
    }

    public async Task<bool> IsAlreadyRegisteredAsync(int veranstaltungId, int mitgliedId, CancellationToken cancellationToken = default)
    {
        return await _anmeldungRepository.ExistsAsync(a => 
            a.VeranstaltungId == veranstaltungId && 
            a.MitgliedId == mitgliedId && 
            a.Aktiv == true, 
            false, cancellationToken);
    }

    public async Task<bool> CanRegisterAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
        if (veranstaltung == null || veranstaltung.AnmeldeErforderlich != true || (veranstaltung.Aktiv != true && veranstaltung.Aktiv != null))
        {
            return false;
        }

        var now = DateTime.Now;
        return veranstaltung.Startdatum > now;
    }

    public async Task<int> GetRegistrationCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        return await _anmeldungRepository.CountAsync(a => 
            a.VeranstaltungId == veranstaltungId && 
            (!activeOnly || a.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<int> GetWaitlistCountAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        return await _anmeldungRepository.CountAsync(a =>
            a.VeranstaltungId == veranstaltungId &&
            a.Status == "Pending" &&
            (a.Aktiv == true || a.Aktiv == null),
            false, cancellationToken);
    }

    public async Task<object> GetRegistrationStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        var totalRegistrations = await GetRegistrationCountAsync(veranstaltungId, true, cancellationToken);
        var confirmedRegistrations = await _anmeldungRepository.CountAsync(a =>
            a.VeranstaltungId == veranstaltungId &&
            a.Status == "Confirmed" &&
            (a.Aktiv == true || a.Aktiv == null),
            false, cancellationToken);
        var waitlistCount = await GetWaitlistCountAsync(veranstaltungId, cancellationToken);

        return new
        {
            VeranstaltungId = veranstaltungId,
            TotalRegistrations = totalRegistrations,
            ConfirmedRegistrations = confirmedRegistrations,
            WaitlistCount = waitlistCount,
            GeneratedAt = DateTime.UtcNow
        };
    }

    public async Task<object> GetMitgliedRegistrationStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        var totalRegistrations = await _anmeldungRepository.CountAsync(a => a.MitgliedId == mitgliedId, false, cancellationToken);
        var activeRegistrations = await _anmeldungRepository.CountAsync(a => a.MitgliedId == mitgliedId && a.Aktiv == true, false, cancellationToken);

        return new
        {
            MitgliedId = mitgliedId,
            TotalRegistrations = totalRegistrations,
            ActiveRegistrations = activeRegistrations,
            GeneratedAt = DateTime.UtcNow
        };
    }

    public async Task<PagedResult<VeranstaltungAnmeldungDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged veranstaltung anmeldungen, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _anmeldungRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<VeranstaltungAnmeldungDto>
        {
            Items = _mapper.Map<IEnumerable<VeranstaltungAnmeldungDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion
}
