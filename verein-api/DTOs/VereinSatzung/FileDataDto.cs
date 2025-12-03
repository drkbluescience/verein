namespace VereinsApi.DTOs.VereinSatzung;

/// <summary>
/// DTO for file download data
/// </summary>
public class FileDataDto
{
    public required byte[] Content { get; set; }
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
}