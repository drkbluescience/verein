using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace VereinsApi.Services.Caching;

/// <summary>
/// In-memory cache service implementation using IMemoryCache
/// </summary>
public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<MemoryCacheService> _logger;
    private static readonly TimeSpan _defaultExpiration = TimeSpan.FromMinutes(5);

    public MemoryCacheService(IMemoryCache cache, ILogger<MemoryCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Getting cached item with key: {CacheKey}", key);
            
            if (_cache.TryGetValue(key, out T? value))
            {
                _logger.LogDebug("Cache hit for key: {CacheKey}", key);
                return value;
            }

            _logger.LogDebug("Cache miss for key: {CacheKey}", key);
            return default(T);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cached item with key: {CacheKey}", key);
            return default(T);
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var expirationTime = expiration ?? _defaultExpiration;
            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expirationTime,
                SlidingExpiration = expirationTime,
                Size = 1 // Optional: track cache size
            };

            _logger.LogDebug("Setting cached item with key: {CacheKey}, expiration: {Expiration}", key, expirationTime);
            
            _cache.Set(key, value, cacheEntryOptions);
            
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cached item with key: {CacheKey}", key);
            throw;
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Removing cached item with key: {CacheKey}", key);
            
            _cache.Remove(key);
            
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cached item with key: {CacheKey}", key);
            throw;
        }
    }

    public async Task RemoveByPatternAsync(string keyPattern, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Removing cached items with pattern: {KeyPattern}", keyPattern);
            
            // IMemoryCache doesn't support pattern matching directly
            // This is a limitation of in-memory cache
            // For production, consider using Redis or distributed cache
            _logger.LogWarning("Pattern-based cache removal is not supported with IMemoryCache. Key: {KeyPattern}", keyPattern);
            
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cached items with pattern: {KeyPattern}", keyPattern);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            var exists = _cache.TryGetValue(key, out _);
            _logger.LogDebug("Checking cache existence for key: {CacheKey}, exists: {Exists}", key, exists);
            
            return exists;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking cache existence for key: {CacheKey}", key);
            return false;
        }
    }

    public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Getting or creating cached item with key: {CacheKey}", key);
            
            if (_cache.TryGetValue(key, out T? cachedValue))
            {
                _logger.LogDebug("Cache hit for key: {CacheKey}", key);
                return cachedValue!;
            }

            _logger.LogDebug("Cache miss for key: {CacheKey}, creating new item", key);
            
            var value = await factory();
            
            var expirationTime = expiration ?? _defaultExpiration;
            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expirationTime,
                SlidingExpiration = expirationTime,
                Size = 1
            };

            _cache.Set(key, value, cacheEntryOptions);
            
            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting or creating cached item with key: {CacheKey}", key);
            throw;
        }
    }
}