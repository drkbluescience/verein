using AutoMapper;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Enums;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.PageNote;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for PageNote business operations
/// </summary>
public class PageNoteService : IPageNoteService
{
    private readonly IPageNoteRepository _repository;
    private readonly IMapper _mapper;

    public PageNoteService(IPageNoteRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    #region CRUD Operations

    public async Task<PageNoteDto> CreateAsync(CreatePageNoteDto createDto, string userEmail, string? userName, CancellationToken cancellationToken = default)
    {
        var pageNote = _mapper.Map<PageNote>(createDto);
        pageNote.UserEmail = userEmail;
        pageNote.UserName = userName;
        pageNote.Status = PageNoteStatus.Pending;
        pageNote.Created = DateTime.UtcNow;
        pageNote.CreatedBy = userEmail;
        pageNote.DeletedFlag = false;
        pageNote.Aktiv = true;

        var created = await _repository.AddAsync(pageNote, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PageNoteDto>(created);
    }

    public async Task<PageNoteDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var pageNote = await _repository.GetByIdAsync(id, false, cancellationToken);
        return pageNote == null ? null : _mapper.Map<PageNoteDto>(pageNote);
    }

    public async Task<IEnumerable<PageNoteDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<PageNoteDto> UpdateAsync(int id, UpdatePageNoteDto updateDto, CancellationToken cancellationToken = default)
    {
        var existingNote = await _repository.GetByIdAsync(id, false, cancellationToken);
        if (existingNote == null)
        {
            throw new KeyNotFoundException($"PageNote with ID {id} not found");
        }

        // Only update fields that are provided
        if (!string.IsNullOrEmpty(updateDto.Title))
        {
            existingNote.Title = updateDto.Title;
        }

        if (!string.IsNullOrEmpty(updateDto.Content))
        {
            existingNote.Content = updateDto.Content;
        }

        if (updateDto.Category.HasValue)
        {
            existingNote.Category = updateDto.Category.Value;
        }

        if (updateDto.Priority.HasValue)
        {
            existingNote.Priority = updateDto.Priority.Value;
        }

        existingNote.Modified = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(existingNote, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PageNoteDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await _repository.DeleteAsync(id, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<PageNoteDto>> GetByUserEmailAsync(string userEmail, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByUserEmailAsync(userEmail, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<IEnumerable<PageNoteDto>> GetByPageUrlAsync(string pageUrl, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByPageUrlAsync(pageUrl, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<IEnumerable<PageNoteDto>> GetByEntityAsync(string entityType, int entityId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByEntityAsync(entityType, entityId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<IEnumerable<PageNoteDto>> GetByStatusAsync(PageNoteStatus status, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByStatusAsync(status, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<IEnumerable<PageNoteDto>> GetByCategoryAsync(PageNoteCategory category, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByCategoryAsync(category, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    public async Task<IEnumerable<PageNoteDto>> GetByPriorityAsync(PageNotePriority priority, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var pageNotes = await _repository.GetByPriorityAsync(priority, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<PageNoteDto>>(pageNotes);
    }

    #endregion

    #region Admin Operations

    public async Task<PageNoteDto> CompleteNoteAsync(int id, CompletePageNoteDto completeDto, string adminEmail, CancellationToken cancellationToken = default)
    {
        var existingNote = await _repository.GetByIdAsync(id, false, cancellationToken);
        if (existingNote == null)
        {
            throw new KeyNotFoundException($"PageNote with ID {id} not found");
        }

        existingNote.Status = completeDto.Status;
        existingNote.AdminNotes = completeDto.AdminNotes;
        existingNote.CompletedBy = adminEmail;
        existingNote.CompletedAt = DateTime.UtcNow;
        existingNote.Modified = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(existingNote, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PageNoteDto>(updated);
    }

    public async Task<PageNoteStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        return await _repository.GetStatisticsAsync(cancellationToken);
    }

    #endregion
}
