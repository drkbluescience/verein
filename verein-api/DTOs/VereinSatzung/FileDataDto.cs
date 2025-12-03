namespace VereinsApi.DTOs.VereinSatzung;

/// <summary>
/// DTO for file download data
/// </summary>
public class FileDataDto
{
    public byte[] Content { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
}