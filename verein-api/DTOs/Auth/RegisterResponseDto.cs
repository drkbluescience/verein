using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Auth;

/// <summary>
/// Data Transfer Object for registration response
/// </summary>
public class RegisterResponseDto
{
    /// <summary>
    /// Indicates if registration was successful
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    /// <summary>
    /// Response message
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Created Mitglied ID (if applicable)
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Created Verein ID (if applicable)
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int? VereinId { get; set; }

    /// <summary>
    /// Registered email address
    /// </summary>
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
}

