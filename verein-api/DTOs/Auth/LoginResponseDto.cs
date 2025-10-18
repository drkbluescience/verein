namespace VereinsApi.DTOs.Auth;

public class LoginResponseDto
{
    public string UserType { get; set; } = string.Empty; // "admin", "dernek", "mitglied"
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? VereinId { get; set; }
    public int? MitgliedId { get; set; }
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public string Token { get; set; } = string.Empty; // JWT token
}
