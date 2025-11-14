namespace VereinsApi;

/// <summary>
/// Provides connection strings for database fallback mechanism
/// </summary>
public class ConnectionStringProvider
{
    /// <summary>
    /// Azure SQL Database connection string (primary)
    /// </summary>
    public string AzureConnection { get; set; } = string.Empty;

    /// <summary>
    /// Docker SQL Server connection string (fallback)
    /// </summary>
    public string DockerConnection { get; set; } = string.Empty;

    /// <summary>
    /// Active database server name (e.g., "Azure SQL Database" or "Docker SQL Server")
    /// </summary>
    public string DatabaseServer { get; set; } = string.Empty;
}

