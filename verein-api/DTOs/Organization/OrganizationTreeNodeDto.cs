using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Organization;

/// <summary>
/// DTO for hierarchical tree nodes
/// </summary>
public class OrganizationTreeNodeDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("orgType")]
    public string OrgType { get; set; } = string.Empty;

    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }

    [JsonPropertyName("children")]
    public List<OrganizationTreeNodeDto> Children { get; set; } = new();
}
