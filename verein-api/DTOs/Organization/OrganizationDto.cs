using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Organization;

/// <summary>
/// DTO for organization node
/// </summary>
public class OrganizationDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("orgType")]
    public string OrgType { get; set; } = string.Empty;

    [JsonPropertyName("parentOrganizationId")]
    public int? ParentOrganizationId { get; set; }

    [JsonPropertyName("federationCode")]
    public string? FederationCode { get; set; }

    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }

    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}
