namespace VereinsApi.Domain.Enums;

/// <summary>
/// Represents the status of an entity
/// </summary>
public enum EntityStatus
{
    /// <summary>
    /// Entity is inactive
    /// </summary>
    Inactive = 0,

    /// <summary>
    /// Entity is active
    /// </summary>
    Active = 1,

    /// <summary>
    /// Entity is suspended
    /// </summary>
    Suspended = 2,

    /// <summary>
    /// Entity is archived
    /// </summary>
    Archived = 3
}
