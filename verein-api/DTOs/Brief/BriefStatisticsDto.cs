using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Statistics DTO for Brief/Nachricht overview
/// </summary>
public class BriefStatisticsDto
{
    [JsonPropertyName("totalVorlagen")]
    public int TotalVorlagen { get; set; }

    [JsonPropertyName("totalEntwuerfe")]
    public int TotalEntwuerfe { get; set; }

    [JsonPropertyName("totalGesendet")]
    public int TotalGesendet { get; set; }

    [JsonPropertyName("totalNachrichten")]
    public int TotalNachrichten { get; set; }

    [JsonPropertyName("ungeleseneNachrichten")]
    public int UngeleseneNachrichten { get; set; }

    [JsonPropertyName("geleseneNachrichten")]
    public int GeleseneNachrichten { get; set; }
}

/// <summary>
/// Unread count for member inbox badge
/// </summary>
public class UnreadCountDto
{
    [JsonPropertyName("count")]
    public int Count { get; set; }
}

