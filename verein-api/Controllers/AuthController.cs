using Microsoft.AspNetCore.Mvc;
using VereinsApi.Services;
using VereinsApi.Services.Interfaces;
using VereinsApi.DTOs.Auth;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.Verein;

namespace VereinsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMitgliedService _mitgliedService;
    private readonly IVereinService _vereinService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IMitgliedService mitgliedService,
        IVereinService vereinService,
        IJwtService jwtService,
        ILogger<AuthController> logger)
    {
        _mitgliedService = mitgliedService;
        _vereinService = vereinService;
        _jwtService = jwtService;
        _logger = logger;
    }

    /// <summary>
    /// Test endpoint to verify AuthController is working
    /// </summary>
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "AuthController is working!", timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Login with email and password (simplified for demo)
    /// </summary>
    /// <param name="request">Login request</param>
    /// <returns>User information</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            // Simplified authentication - in real app, verify password hash
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email is required");
            }

            // Check if it's an admin login
            if (request.Email.Contains("admin"))
            {
                var adminPermissions = new[] { "admin.all", "verein.all", "mitglied.all", "veranstaltung.all", "adresse.all" };
                var adminToken = _jwtService.GenerateToken(
                    userId: 0, // Admin has no specific ID
                    userType: "admin",
                    email: request.Email,
                    firstName: "System",
                    lastName: "Admin",
                    vereinId: null,
                    mitgliedId: null,
                    permissions: adminPermissions
                );

                return Ok(new LoginResponseDto
                {
                    UserType = "admin",
                    FirstName = "System",
                    LastName = "Admin",
                    Email = request.Email,
                    VereinId = null,
                    MitgliedId = null,
                    Permissions = adminPermissions,
                    Token = adminToken
                });
            }

            // Try to find member by email
            var mitglieder = await _mitgliedService.GetAllAsync();
            _logger.LogInformation("🔍 DEBUG: Total mitglieder count: {Count}", mitglieder.Count());

            var mitglied = mitglieder.FirstOrDefault(m => m.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));

            if (mitglied != null)
            {
                _logger.LogInformation("🔍 DEBUG: Found mitglied - Id: {Id}, Email: {Email}, Vorname: {Vorname}, Nachname: {Nachname}",
                    mitglied.Id, mitglied.Email, mitglied.Vorname, mitglied.Nachname);

                // Check if this member is a Verein admin (simplified check)
                var verein = await _vereinService.GetByIdAsync(mitglied.VereinId);
                bool isVereinAdmin = verein?.Vorstandsvorsitzender?.Contains(mitglied.Vorname + " " + mitglied.Nachname) == true;

                if (isVereinAdmin)
                {
                    var dernekPermissions = new[] { "verein.read", "verein.update", "mitglied.all", "veranstaltung.all", "adresse.manage" };
                    var dernekToken = _jwtService.GenerateToken(
                        userId: mitglied.Id,
                        userType: "dernek",
                        email: mitglied.Email ?? "",
                        firstName: mitglied.Vorname,
                        lastName: mitglied.Nachname,
                        vereinId: mitglied.VereinId,
                        mitgliedId: mitglied.Id,
                        permissions: dernekPermissions
                    );

                    return Ok(new LoginResponseDto
                    {
                        UserType = "dernek",
                        FirstName = mitglied.Vorname,
                        LastName = mitglied.Nachname,
                        Email = mitglied.Email,
                        VereinId = mitglied.VereinId,
                        MitgliedId = mitglied.Id,
                        Permissions = dernekPermissions,
                        Token = dernekToken
                    });
                }
                else
                {
                    var mitgliedPermissions = new[] { "mitglied.read", "mitglied.update", "veranstaltung.read", "adresse.read" };
                    var mitgliedToken = _jwtService.GenerateToken(
                        userId: mitglied.Id,
                        userType: "mitglied",
                        email: mitglied.Email ?? "",
                        firstName: mitglied.Vorname,
                        lastName: mitglied.Nachname,
                        vereinId: mitglied.VereinId,
                        mitgliedId: mitglied.Id,
                        permissions: mitgliedPermissions
                    );

                    return Ok(new LoginResponseDto
                    {
                        UserType = "mitglied",
                        FirstName = mitglied.Vorname,
                        LastName = mitglied.Nachname,
                        Email = mitglied.Email,
                        VereinId = mitglied.VereinId,
                        MitgliedId = mitglied.Id,
                        Permissions = mitgliedPermissions,
                        Token = mitgliedToken
                    });
                }
            }

            return Unauthorized("Invalid credentials");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during login");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>User information</returns>
    [HttpGet("user")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LoginResponseDto>> GetUser([FromQuery] string email)
    {
        try
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            // Check if it's an admin
            if (email.Contains("admin"))
            {
                return Ok(new LoginResponseDto
                {
                    UserType = "admin",
                    FirstName = "System",
                    LastName = "Admin",
                    Email = email,
                    VereinId = null,
                    MitgliedId = null,
                    Permissions = new[] { "admin.all", "verein.all", "mitglied.all", "veranstaltung.all" }
                });
            }

            // Try to find member by email
            var mitglieder = await _mitgliedService.GetAllAsync();
            var mitglied = mitglieder.FirstOrDefault(m => m.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

            if (mitglied != null)
            {
                // Check if this member is a Verein admin
                var verein = await _vereinService.GetByIdAsync(mitglied.VereinId);
                bool isVereinAdmin = verein?.Vorstandsvorsitzender?.Contains(mitglied.Vorname + " " + mitglied.Nachname) == true;

                if (isVereinAdmin)
                {
                    return Ok(new LoginResponseDto
                    {
                        UserType = "dernek",
                        FirstName = mitglied.Vorname,
                        LastName = mitglied.Nachname,
                        Email = mitglied.Email,
                        VereinId = mitglied.VereinId,
                        MitgliedId = mitglied.Id,
                        Permissions = new[] { "verein.read", "verein.update", "mitglied.all", "veranstaltung.all" }
                    });
                }
                else
                {
                    return Ok(new LoginResponseDto
                    {
                        UserType = "mitglied",
                        FirstName = mitglied.Vorname,
                        LastName = mitglied.Nachname,
                        Email = mitglied.Email,
                        VereinId = mitglied.VereinId,
                        MitgliedId = mitglied.Id,
                        Permissions = new[] { "mitglied.read", "mitglied.update", "veranstaltung.read" }
                    });
                }
            }

            return NotFound("User not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting user information");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Register a new member (Mitglied)
    /// </summary>
    /// <param name="request">Member registration data</param>
    /// <returns>Registration response</returns>
    [HttpPost("register-mitglied")]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RegisterResponseDto>> RegisterMitglied([FromBody] RegisterMitgliedDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            var existingMitglieder = await _mitgliedService.GetAllAsync();
            if (existingMitglieder.Any(m => m.Email != null && m.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new RegisterResponseDto
                {
                    Success = false,
                    Message = "Bu e-mail adresi zaten kayıtlı.",
                    Email = request.Email
                });
            }

            // Generate unique member number
            var memberCount = existingMitglieder.Count();
            var mitgliedsnummer = $"M{DateTime.UtcNow.Year}{(memberCount + 1):D4}";

            // Create Mitglied DTO with auto-generated values
            var createDto = new CreateMitgliedDto
            {
                Vorname = request.Vorname,
                Nachname = request.Nachname,
                Email = request.Email,
                Telefon = request.Telefon,
                Mobiltelefon = request.Mobiltelefon,
                Geburtsdatum = request.Geburtsdatum,
                Geburtsort = request.Geburtsort,
                Mitgliedsnummer = mitgliedsnummer,
                MitgliedStatusId = 1, // Default: Active
                MitgliedTypId = 1, // Default: Normal member
                VereinId = 1, // Default verein - can be changed later
                Eintrittsdatum = DateTime.UtcNow,
                Aktiv = true
            };

            var mitglied = await _mitgliedService.CreateAsync(createDto);

            _logger.LogInformation("New member registered: {Email}, ID: {Id}", request.Email, mitglied.Id);

            return CreatedAtAction(nameof(GetUser), new { email = request.Email }, new RegisterResponseDto
            {
                Success = true,
                Message = "Kayıt başarılı! Giriş yapabilirsiniz.",
                MitgliedId = mitglied.Id,
                Email = request.Email
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during member registration");
            return StatusCode(500, new RegisterResponseDto
            {
                Success = false,
                Message = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                Email = request.Email
            });
        }
    }

    /// <summary>
    /// Register a new verein (association)
    /// </summary>
    /// <param name="request">Verein registration data</param>
    /// <returns>Registration response</returns>
    [HttpPost("register-verein")]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RegisterResponseDto>> RegisterVerein([FromBody] RegisterVereinDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists in Verein
            var existingVereine = await _vereinService.GetAllAsync();
            if (existingVereine.Any(v => v.Email != null && v.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new RegisterResponseDto
                {
                    Success = false,
                    Message = "Bu e-mail adresi zaten kayıtlı.",
                    Email = request.Email
                });
            }

            // Check if email already exists in Mitglied
            var existingMitglieder = await _mitgliedService.GetAllAsync();
            if (existingMitglieder.Any(m => m.Email != null && m.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new RegisterResponseDto
                {
                    Success = false,
                    Message = "Bu e-mail adresi zaten kayıtlı.",
                    Email = request.Email
                });
            }

            // Create Verein DTO
            var createVereinDto = new CreateVereinDto
            {
                Name = request.Name,
                Kurzname = request.Kurzname,
                Email = request.Email,
                Telefon = request.Telefon,
                Vorstandsvorsitzender = request.Vorstandsvorsitzender,
                Kontaktperson = request.Kontaktperson,
                Webseite = request.Webseite,
                Gruendungsdatum = request.Gruendungsdatum,
                Zweck = request.Zweck
            };

            var verein = await _vereinService.CreateAsync(createVereinDto);

            // Create chairman as first member if Vorstandsvorsitzender is provided
            int? mitgliedId = null;
            if (!string.IsNullOrEmpty(request.Vorstandsvorsitzender))
            {
                var nameParts = request.Vorstandsvorsitzender.Split(' ', 2);
                var vorname = nameParts.Length > 0 ? nameParts[0] : request.Vorstandsvorsitzender;
                var nachname = nameParts.Length > 1 ? nameParts[1] : "";

                var memberCount = existingMitglieder.Count();
                var mitgliedsnummer = $"M{DateTime.UtcNow.Year}{(memberCount + 1):D4}";

                var createMitgliedDto = new CreateMitgliedDto
                {
                    Vorname = vorname,
                    Nachname = nachname,
                    Email = request.Email,
                    Telefon = request.Telefon,
                    Mitgliedsnummer = mitgliedsnummer,
                    MitgliedStatusId = 1, // Active
                    MitgliedTypId = 1, // Normal member
                    VereinId = verein.Id,
                    Eintrittsdatum = DateTime.UtcNow,
                    Aktiv = true
                };

                var mitglied = await _mitgliedService.CreateAsync(createMitgliedDto);
                mitgliedId = mitglied.Id;
            }

            _logger.LogInformation("New verein registered: {Name}, ID: {Id}", request.Name, verein.Id);

            return CreatedAtAction(nameof(GetUser), new { email = request.Email }, new RegisterResponseDto
            {
                Success = true,
                Message = "Dernek kaydı başarılı! Giriş yapabilirsiniz.",
                VereinId = verein.Id,
                MitgliedId = mitgliedId,
                Email = request.Email
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during verein registration");
            return StatusCode(500, new RegisterResponseDto
            {
                Success = false,
                Message = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                Email = request.Email
            });
        }
    }

    /// <summary>
    /// Logout user
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Logout()
    {
        // In a real app, invalidate JWT token or session
        return Ok(new { message = "Logged out successfully" });
    }
}
