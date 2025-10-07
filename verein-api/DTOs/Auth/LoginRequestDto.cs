using System.ComponentModel.DataAnnotations;

namespace VereinsApi.DTOs.Auth;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    // Password is optional - email-only authentication
    public string? Password { get; set; }
}
