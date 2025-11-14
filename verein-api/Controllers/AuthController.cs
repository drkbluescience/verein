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
    private readonly IUserService _userService;
    private readonly IUserRoleService _userRoleService;
    private readonly IMitgliedService _mitgliedService;
    private readonly IVereinService _vereinService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserService userService,
        IUserRoleService userRoleService,
        IMitgliedService mitgliedService,
        IVereinService vereinService,
        IJwtService jwtService,
        ILogger<AuthController> logger)
    {
        _userService = userService;
        _userRoleService = userRoleService;
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
    /// Login with email and password (using new User table)
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
            // Validate email
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email is required");
            }

            // Find user by email
            var user = await _userService.GetByEmailAsync(request.Email);

            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found - {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Check if user is active
            if (!user.IsActive)
            {
                _logger.LogWarning("Login failed: User is inactive - {Email}", request.Email);
                return Unauthorized(new { message = "Account is inactive" });
            }

            // Check if account is locked
            if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow)
            {
                _logger.LogWarning("Login failed: Account is locked - {Email}", request.Email);
                return Unauthorized(new { message = "Account is locked. Please try again later." });
            }

            // Verify password
            if (string.IsNullOrEmpty(request.Password))
            {
                _logger.LogWarning("Login failed: Password is required - {Email}", request.Email);
                return Unauthorized(new { message = "Password is required" });
            }

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                _logger.LogWarning("Login failed: User has no password set - {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                await _userService.IncrementFailedLoginAttemptsAsync(user.Id);
                _logger.LogWarning("Login failed: Invalid password - {Email}, Attempts: {Attempts}",
                    request.Email, user.FailedLoginAttempts + 1);

                // Lock account after 5 failed attempts
                if (user.FailedLoginAttempts >= 4) // Will be 5 after increment
                {
                    await _userService.LockAccountAsync(user.Id, TimeSpan.FromMinutes(15));
                    return Unauthorized(new { message = "Account locked due to multiple failed login attempts. Try again in 15 minutes." });
                }

                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Get user's active roles
            var roles = await _userRoleService.GetActiveRolesByUserIdAsync(user.Id);

            if (!roles.Any())
            {
                _logger.LogWarning("Login failed: User has no active roles - {Email}", request.Email);
                return Unauthorized(new { message = "No active roles found for this user" });
            }

            // Get primary role (highest priority)
            var primaryRole = roles.OrderByDescending(r => GetRolePriority(r.RoleType)).First();

            _logger.LogInformation("✅ Login successful - Email: {Email}, Role: {RoleType}",
                user.Email, primaryRole.RoleType);

            // Update last login
            await _userService.UpdateLastLoginAsync(user.Id);
            await _userService.ResetFailedLoginAttemptsAsync(user.Id);

            // Generate permissions based on role
            var permissions = GetPermissionsForRole(primaryRole.RoleType);

            // Generate JWT token
            var token = _jwtService.GenerateToken(
                userId: user.Id,
                userType: primaryRole.RoleType,
                email: user.Email,
                firstName: user.Vorname,
                lastName: user.Nachname,
                vereinId: primaryRole.VereinId,
                mitgliedId: primaryRole.MitgliedId,
                permissions: permissions
            );

            return Ok(new LoginResponseDto
            {
                UserType = primaryRole.RoleType,
                FirstName = user.Vorname,
                LastName = user.Nachname,
                Email = user.Email,
                VereinId = primaryRole.VereinId,
                MitgliedId = primaryRole.MitgliedId,
                Permissions = permissions,
                Token = token
                    });
                }
            }

            // If not found in Mitglied, try to find in Verein table
            var vereine = await _vereinService.GetAllAsync();
            _logger.LogInformation("🔍 DEBUG: Total vereine count: {Count}", vereine.Count());

            var vereinByEmail = vereine.FirstOrDefault(v => v.Email != null && v.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));

            if (vereinByEmail != null)
            {
                _logger.LogInformation("🔍 DEBUG: Found verein - Id: {Id}, Email: {Email}, Name: {Name}",
                    vereinByEmail.Id, vereinByEmail.Email, vereinByEmail.Name);

                var dernekPermissions = new[] { "verein.read", "verein.update", "mitglied.all", "veranstaltung.all", "adresse.manage" };
                var dernekToken = _jwtService.GenerateToken(
                    userId: vereinByEmail.Id,
                    userType: "dernek",
                    email: vereinByEmail.Email ?? "",
                    firstName: vereinByEmail.Name,
                    lastName: "",
                    vereinId: vereinByEmail.Id,
                    mitgliedId: null,
                    permissions: dernekPermissions
                );

                return Ok(new LoginResponseDto
                {
                    UserType = "dernek",
                    FirstName = vereinByEmail.Name,
                    LastName = "",
                    Email = vereinByEmail.Email,
                    VereinId = vereinByEmail.Id,
                    MitgliedId = null,
                    Permissions = dernekPermissions,
                    Token = dernekToken
                });
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

            // Check if email already exists in User table
            var existingUser = await _userService.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest(new RegisterResponseDto
                {
                    Success = false,
                    Message = "Bu e-mail adresi zaten kayıtlı.",
                    Email = request.Email
                });
            }

            // Generate unique member number
            var existingMitglieder = await _mitgliedService.GetAllAsync();
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

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create User record
            var user = new Domain.Entities.User
            {
                Email = request.Email,
                Vorname = request.Vorname,
                Nachname = request.Nachname,
                PasswordHash = passwordHash,
                IsActive = true,
                EmailConfirmed = false,
                Created = DateTime.UtcNow
            };
            await _userService.CreateAsync(user);

            // Create UserRole record (mitglied role)
            var userRole = new Domain.Entities.UserRole
            {
                UserId = user.Id,
                RoleType = "mitglied",
                MitgliedId = mitglied.Id,
                VereinId = mitglied.VereinId,
                GueltigVon = DateTime.Now,
                IsActive = true,
                Created = DateTime.UtcNow
            };
            await _userRoleService.CreateAsync(userRole);

            _logger.LogInformation("✅ New member registered: {Email}, MitgliedId: {MitgliedId}, UserId: {UserId}",
                request.Email, mitglied.Id, user.Id);

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

            // Check if verein email already exists in User table
            var existingVereinUser = await _userService.GetByEmailAsync(request.Email);
            if (existingVereinUser != null)
            {
                return BadRequest(new RegisterResponseDto
                {
                    Success = false,
                    Message = "Bu dernek e-mail adresi zaten kayıtlı.",
                    Email = request.Email
                });
            }

            // Check if chairman's email already exists in User table (if provided)
            if (!string.IsNullOrEmpty(request.VorstandsvorsitzenderEmail))
            {
                var existingChairmanUser = await _userService.GetByEmailAsync(request.VorstandsvorsitzenderEmail);
                if (existingChairmanUser != null)
                {
                    return BadRequest(new RegisterResponseDto
                    {
                        Success = false,
                        Message = "Bu başkan e-mail adresi zaten kayıtlı.",
                        Email = request.VorstandsvorsitzenderEmail
                    });
                }
            }

            var existingMitglieder = await _mitgliedService.GetAllAsync();

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
            string? loginEmail = request.Email; // Default to verein email

            if (!string.IsNullOrEmpty(request.Vorstandsvorsitzender) && !string.IsNullOrEmpty(request.VorstandsvorsitzenderEmail))
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
                    Email = request.VorstandsvorsitzenderEmail, // Use chairman's personal email
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
                loginEmail = request.VorstandsvorsitzenderEmail; // Use chairman's email for login

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create User record for chairman
                var chairmanUser = new Domain.Entities.User
                {
                    Email = request.VorstandsvorsitzenderEmail,
                    Vorname = vorname,
                    Nachname = nachname,
                    PasswordHash = passwordHash,
                    IsActive = true,
                    EmailConfirmed = false,
                    Created = DateTime.UtcNow
                };
                await _userService.CreateAsync(chairmanUser);

                // Create UserRole records for chairman (both mitglied and dernek roles)
                // 1. Mitglied role
                var mitgliedRole = new Domain.Entities.UserRole
                {
                    UserId = chairmanUser.Id,
                    RoleType = "mitglied",
                    MitgliedId = mitglied.Id,
                    VereinId = verein.Id,
                    GueltigVon = DateTime.Now,
                    IsActive = true,
                    Created = DateTime.UtcNow
                };
                await _userRoleService.CreateAsync(mitgliedRole);

                // 2. Dernek role (chairman)
                var dernekRole = new Domain.Entities.UserRole
                {
                    UserId = chairmanUser.Id,
                    RoleType = "dernek",
                    MitgliedId = mitglied.Id,
                    VereinId = verein.Id,
                    GueltigVon = DateTime.Now,
                    IsActive = true,
                    Bemerkung = "Vorstandsvorsitzender",
                    Created = DateTime.UtcNow
                };
                await _userRoleService.CreateAsync(dernekRole);

                _logger.LogInformation("✅ Chairman user created: {Email}, UserId: {UserId}, MitgliedId: {MitgliedId}",
                    request.VorstandsvorsitzenderEmail, chairmanUser.Id, mitglied.Id);
            }

            _logger.LogInformation("✅ New verein registered: {Name}, VereinId: {Id}, LoginEmail: {LoginEmail}",
                request.Name, verein.Id, loginEmail);

            return CreatedAtAction(nameof(GetUser), new { email = loginEmail }, new RegisterResponseDto
            {
                Success = true,
                Message = mitgliedId.HasValue
                    ? $"Dernek kaydı başarılı! Başkan email adresi ({loginEmail}) ile giriş yapabilirsiniz."
                    : $"Dernek kaydı başarılı! Dernek email adresi ({loginEmail}) ile giriş yapabilirsiniz.",
                VereinId = verein.Id,
                MitgliedId = mitgliedId,
                Email = loginEmail
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

    #region Helper Methods

    /// <summary>
    /// Get role priority for sorting (admin > dernek > mitglied)
    /// </summary>
    private static int GetRolePriority(string roleType)
    {
        return roleType.ToLower() switch
        {
            "admin" => 3,
            "dernek" => 2,
            "mitglied" => 1,
            _ => 0
        };
    }

    /// <summary>
    /// Get permissions array based on role type
    /// </summary>
    private static string[] GetPermissionsForRole(string roleType)
    {
        return roleType.ToLower() switch
        {
            "admin" => new[] { "admin.all", "verein.all", "mitglied.all", "veranstaltung.all", "adresse.all" },
            "dernek" => new[] { "verein.read", "verein.update", "mitglied.all", "veranstaltung.all", "adresse.manage" },
            "mitglied" => new[] { "mitglied.read", "mitglied.update", "veranstaltung.read", "adresse.read" },
            _ => Array.Empty<string>()
        };
    }

    #endregion
}
