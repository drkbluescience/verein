using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Organization;

/// <summary>
/// DTO for a path node from root to a target
/// </summary>
public class OrganizationPathNodeDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("orgType")]
    public string OrgType { get; set; } = string.Empty;
}
