using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Organization;

/// <summary>
/// DTO for creating a new organization node
/// </summary>
public class OrganizationCreateDto
{
    /// <summary>
    /// Display name
    /// </summary>
    [Required(ErrorMessage = "Organization name is required")]
    [MaxLength(200, ErrorMessage = "Organization name cannot exceed 200 characters")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Organization type (Dachverband, Landesverband, Region, Verein)
    /// </summary>
    [Required(ErrorMessage = "OrgType is required")]
    [MaxLength(20, ErrorMessage = "OrgType cannot exceed 20 characters")]
    [JsonPropertyName("orgType")]
    public string OrgType { get; set; } = string.Empty;

    /// <summary>
    /// Parent organization identifier
    /// </summary>
    [JsonPropertyName("parentOrganizationId")]
    public int? ParentOrganizationId { get; set; }

    /// <summary>
    /// Federation code (DITIB, Independent, Other)
    /// </summary>
    [MaxLength(20, ErrorMessage = "FederationCode cannot exceed 20 characters")]
    [JsonPropertyName("federationCode")]
    public string? FederationCode { get; set; }

    /// <summary>
    /// Active flag
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}
