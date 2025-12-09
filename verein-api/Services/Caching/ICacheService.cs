namespace VereinsApi.Services.Caching;

/// <summary>
/// Interface for caching service
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Gets cached item by key
    /// </summary>
    /// <typeparam name="T">Type of cached item</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Cached item or null if not found/expired</returns>
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets cached item with expiration
    /// </summary>
    /// <typeparam name="T">Type of item to cache</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Item to cache</param>
    /// <param name="expiration">Expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes cached item by key
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task RemoveAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes cached items by key pattern
    /// </summary>
    /// <param name="keyPattern">Key pattern (supports * wildcard)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task RemoveByPatternAsync(string keyPattern, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if cached item exists
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if item exists and not expired</returns>
    Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets cached item or creates it if not exists
    /// </summary>
    /// <typeparam name="T">Type of item</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="factory">Factory function to create item if not cached</param>
    /// <param name="expiration">Expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Cached item or newly created item</returns>
    Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default);
}