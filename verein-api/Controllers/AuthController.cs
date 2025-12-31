using Microsoft.AspNetCore.Mvc;
using VereinsApi.Services;
using VereinsApi.Services.Interfaces;
using VereinsApi.DTOs.Auth;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.Verein;
using VereinsApi.DTOs.Organization;

namespace VereinsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IUserRoleService _userRoleService;
    private readonly IMitgliedService _mitgliedService;
    private readonly IVereinService _vereinService;
    private readonly IOrganizationService _organizationService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserService userService,
        IUserRoleService userRoleService,
        IMitgliedService mitgliedService,
        IVereinService vereinService,
        IOrganizationService organizationService,
        IJwtService jwtService,
        ILogger<AuthController> logger)
    {
        _userService = userService;
        _userRoleService = userRoleService;
        _mitgliedService = mitgliedService;
        _vereinService = vereinService;
        _organizationService = organizationService;
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
                    await _userService.LockAccountAsync(user.Id, DateTime.UtcNow.AddMinutes(15));
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

            // Find user by email
            var user = await _userService.GetByEmailAsync(email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Get user's active roles
            var roles = await _userRoleService.GetActiveRolesByUserIdAsync(user.Id);

            if (!roles.Any())
            {
                return NotFound(new { message = "No active roles found for this user" });
            }

            // Get primary role (highest priority)
            var primaryRole = roles.OrderByDescending(r => GetRolePriority(r.RoleType)).First();

            // Generate permissions based on role
            var permissions = GetPermissionsForRole(primaryRole.RoleType);

            return Ok(new LoginResponseDto
            {
                UserType = primaryRole.RoleType,
                FirstName = user.Vorname,
                LastName = user.Nachname,
                Email = user.Email,
                VereinId = primaryRole.VereinId,
                MitgliedId = primaryRole.MitgliedId,
                Permissions = permissions
            });
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

            // Create UserRole record (mitglied role without MitgliedId - user is NOT a member yet)
            // Admin will assign user to a Verein and create Mitglied record later
            var userRole = new Domain.Entities.UserRole
            {
                UserId = user.Id,
                RoleType = "mitglied",
                MitgliedId = null, // No Mitglied record yet
                VereinId = null, // No Verein assigned yet
                GueltigVon = DateTime.Now,
                IsActive = true,
                Created = DateTime.UtcNow
            };
            await _userRoleService.CreateAsync(userRole);

            _logger.LogInformation("✅ New user registered: {Email}, UserId: {UserId} (Mitglied record will be created by admin)",
                request.Email, user.Id);

            return CreatedAtAction(nameof(GetUser), new { email = request.Email }, new RegisterResponseDto
            {
                Success = true,
                Message = "Kayıt başarılı! Giriş yapabilirsiniz.",
                MitgliedId = null,
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

            var organization = await _organizationService.CreateAsync(new OrganizationCreateDto
            {
                Name = request.Name,
                OrgType = "Verein",
                Aktiv = true
            });

            createVereinDto.OrganizationId = organization.Id;

            var verein = await _vereinService.CreateAsync(createVereinDto);

            // Create chairman user (NOT as Mitglied - chairman is manager, not member)
            string? loginEmail = request.Email; // Default to verein email

            if (!string.IsNullOrEmpty(request.Vorstandsvorsitzender) && !string.IsNullOrEmpty(request.VorstandsvorsitzenderEmail))
            {
                var nameParts = request.Vorstandsvorsitzender.Split(' ', 2);
                var vorname = nameParts.Length > 0 ? nameParts[0] : request.Vorstandsvorsitzender;
                var nachname = nameParts.Length > 1 ? nameParts[1] : "";

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

                // Create Dernek role (chairman is manager, NOT member)
                var dernekRole = new Domain.Entities.UserRole
                {
                    UserId = chairmanUser.Id,
                    RoleType = "dernek",
                    MitgliedId = null, // Chairman is NOT a member
                    VereinId = verein.Id,
                    GueltigVon = DateTime.Now,
                    IsActive = true,
                    Bemerkung = "Vorstandsvorsitzender",
                    Created = DateTime.UtcNow
                };
                await _userRoleService.CreateAsync(dernekRole);

                _logger.LogInformation("✅ Chairman user created: {Email}, UserId: {UserId} (NOT a member)",
                    request.VorstandsvorsitzenderEmail, chairmanUser.Id);
            }

            _logger.LogInformation("✅ New verein registered: {Name}, VereinId: {Id}, LoginEmail: {LoginEmail}",
                request.Name, verein.Id, loginEmail);

            return CreatedAtAction(nameof(GetUser), new { email = loginEmail }, new RegisterResponseDto
            {
                Success = true,
                Message = $"Dernek kaydı başarılı! Başkan email adresi ({loginEmail}) ile giriş yapabilirsiniz.",
                VereinId = verein.Id,
                MitgliedId = null, // Chairman is NOT a member
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
