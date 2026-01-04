using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Organization;

/// <summary>
/// DTO for updating an organization node
/// </summary>
public class OrganizationUpdateDto
{
    /// <summary>
    /// Display name
    /// </summary>
    [MaxLength(200, ErrorMessage = "Organization name cannot exceed 200 characters")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Organization type (Landesverband, Region, Verein)
    /// </summary>
    [MaxLength(20, ErrorMessage = "OrgType cannot exceed 20 characters")]
    [JsonPropertyName("orgType")]
    public string? OrgType { get; set; }

    /// <summary>
    /// Parent organization identifier
    /// </summary>
    [JsonPropertyName("parentOrganizationId")]
    public int? ParentOrganizationId { get; set; }

    /// <summary>
    /// Federation code (DITIB)
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
