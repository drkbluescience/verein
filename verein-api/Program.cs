using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Serilog;
using VereinsApi;
using VereinsApi.Data;
// using VereinsApi.Data.Repositories;
using VereinsApi.Domain.Interfaces;
using VereinsApi.Services;
using VereinsApi.Middleware;
// using VereinsApi.Services.Interfaces;
// using VereinsApi.Mapping;
// using VereinsApi.Validators;
using VereinsApi.DTOs.Verein;
using VereinsApi.Common.Extensions;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/verein-api-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Database Configuration - Using Docker SQL Server (Azure connection available as fallback)
var defaultConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
var azureConnectionString = builder.Configuration.GetConnectionString("AzureConnection");
var dockerConnectionString = builder.Configuration.GetConnectionString("DockerConnection")
    ?? throw new InvalidOperationException("Connection string 'DockerConnection' not found.");

// Use DefaultConnection (currently set to Docker)
string activeConnectionString = defaultConnectionString;

// Determine which database server is being used
string databaseServer = activeConnectionString.Contains("localhost")
    ? "Docker SQL Server (localhost:1433)"
    : "Azure SQL Database (Verein08112025.database.windows.net)";

Log.Information("Using connection: {Server}", databaseServer);

// Store connection strings for reference
builder.Services.AddSingleton(new ConnectionStringProvider
{
    AzureConnection = azureConnectionString ?? string.Empty,
    DockerConnection = dockerConnectionString,
    DatabaseServer = databaseServer
});

// Verify connection
try
{
    var testOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
    testOptionsBuilder.UseSqlServer(activeConnectionString);

    using (var testContext = new ApplicationDbContext(testOptionsBuilder.Options))
    {
        await testContext.Database.CanConnectAsync();
        Log.Information("Database connection test successful");
    }
}
catch (Exception ex)
{
    Log.Fatal(ex, "Cannot connect to database. Make sure Docker is running: docker-compose up -d mssql");
    throw new InvalidOperationException("Database connection failed", ex);
}

// Configure DbContext with the active connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(activeConnectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
        sqlOptions.CommandTimeout(120);
    });
});

// Memory Cache Configuration
builder.Services.AddMemoryCache();

// AutoMapper Configuration
builder.Services.AddAutoMapper(
    typeof(VereinsApi.Profiles.AdresseProfile),
    typeof(VereinsApi.Profiles.BankkontoProfile),
    typeof(VereinsApi.Profiles.VeranstaltungProfile),
    typeof(VereinsApi.Profiles.VeranstaltungAnmeldungProfile),
    typeof(VereinsApi.Profiles.VeranstaltungBildProfile),
    typeof(VereinsApi.Profiles.VereinProfile),
    typeof(VereinsApi.Profiles.MitgliedProfile),
    typeof(VereinsApi.Profiles.MitgliedAdresseProfile),
    typeof(VereinsApi.Profiles.MitgliedFamilieProfile),
    // Finanz Profiles
    typeof(VereinsApi.Profiles.BankBuchungProfile),
    typeof(VereinsApi.Profiles.MitgliedForderungProfile),
    typeof(VereinsApi.Profiles.MitgliedZahlungProfile),
    typeof(VereinsApi.Profiles.MitgliedForderungZahlungProfile),
    typeof(VereinsApi.Profiles.MitgliedVorauszahlungProfile),
    typeof(VereinsApi.Profiles.VeranstaltungZahlungProfile),
    // Keytable Profile
    typeof(VereinsApi.Profiles.KeytableProfile));

// FluentValidation Configuration - TEMPORARILY DISABLED FOR MIGRATION
// builder.Services.AddFluentValidationAutoValidation();
// builder.Services.AddFluentValidationClientsideAdapters();
// builder.Services.AddValidatorsFromAssemblyContaining<CreateVereinDtoValidator>();

// Repository Registration
builder.Services.AddScoped(typeof(IRepository<>), typeof(VereinsApi.Data.Repositories.Repository<>));

// Mitglied Repositories
builder.Services.AddScoped<IMitgliedRepository, VereinsApi.Data.Repositories.MitgliedRepository>();
builder.Services.AddScoped<IMitgliedAdresseRepository, VereinsApi.Data.Repositories.MitgliedAdresseRepository>();
builder.Services.AddScoped<IMitgliedFamilieRepository, VereinsApi.Data.Repositories.MitgliedFamilieRepository>();

// Other Repositories
builder.Services.AddScoped<IVereinRepository, VereinsApi.Data.Repositories.VereinRepository>();
builder.Services.AddScoped<IAdresseRepository, VereinsApi.Data.Repositories.AdresseRepository>();
builder.Services.AddScoped<IBankkontoRepository, VereinsApi.Data.Repositories.BankkontoRepository>();
builder.Services.AddScoped<IVeranstaltungRepository, VereinsApi.Data.Repositories.VeranstaltungRepository>();
builder.Services.AddScoped<IVeranstaltungAnmeldungRepository, VereinsApi.Data.Repositories.VeranstaltungAnmeldungRepository>();
builder.Services.AddScoped<IVeranstaltungBildRepository, VereinsApi.Data.Repositories.VeranstaltungBildRepository>();

// Finanz Repositories
builder.Services.AddScoped<IBankBuchungRepository, VereinsApi.Data.Repositories.BankBuchungRepository>();
builder.Services.AddScoped<IMitgliedForderungRepository, VereinsApi.Data.Repositories.MitgliedForderungRepository>();
builder.Services.AddScoped<IMitgliedZahlungRepository, VereinsApi.Data.Repositories.MitgliedZahlungRepository>();
builder.Services.AddScoped<IVeranstaltungZahlungRepository, VereinsApi.Data.Repositories.VeranstaltungZahlungRepository>();

// Service Registration
// Mitglied Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedService, VereinsApi.Services.MitgliedService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedAdresseService, VereinsApi.Services.MitgliedAdresseService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedFamilieService, VereinsApi.Services.MitgliedFamilieService>();

// Other Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVereinService, VereinsApi.Services.VereinService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IRechtlicheDatenService, VereinsApi.Services.RechtlicheDatenService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IAdresseService, VereinsApi.Services.AdresseService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IBankkontoService, VereinsApi.Services.BankkontoService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungService, VereinsApi.Services.VeranstaltungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungAnmeldungService, VereinsApi.Services.VeranstaltungAnmeldungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungBildService, VereinsApi.Services.VeranstaltungBildService>();

// Finanz Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IBankBuchungService, VereinsApi.Services.BankBuchungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedForderungService, VereinsApi.Services.MitgliedForderungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedZahlungService, VereinsApi.Services.MitgliedZahlungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungZahlungService, VereinsApi.Services.VeranstaltungZahlungService>();

// Excel Upload Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IExcelParserService, VereinsApi.Services.ExcelParserService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IBankUploadService, VereinsApi.Services.BankUploadService>();

// Keytable Service
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IKeytableService, VereinsApi.Services.KeytableService>();

// PageNote Service
builder.Services.AddScoped<VereinsApi.Domain.Interfaces.IPageNoteRepository, VereinsApi.Data.Repositories.PageNoteRepository>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IPageNoteService, VereinsApi.Services.PageNoteService>();

// User & Authentication Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IUserService, VereinsApi.Services.UserService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IUserRoleService, VereinsApi.Services.UserRoleService>();

// JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// JWT Authentication Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Verein API",
        Version = "v1",
        Description = "API for managing associations (Vereine) and related entities",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Verein API Team",
            Email = "support@verein-api.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// CORS Configuration
var corsSettings = builder.Configuration.GetSection("CorsSettings");
var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
var allowCredentials = corsSettings.GetValue<bool>("AllowCredentials");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();

            if (allowCredentials)
            {
                policy.AllowCredentials();
            }
        }
        else
        {
            // Fallback for development
            policy.WithOrigins(
                    "http://localhost:3000", "https://localhost:3000",
                    "http://localhost:3001", "https://localhost:3001",
                    "http://localhost:3002", "https://localhost:3002")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline
var enableSwagger = builder.Configuration.GetValue<bool>("ApiSettings:EnableSwagger");
if (app.Environment.IsDevelopment() || enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Verein API v1");
        c.RoutePrefix = "swagger"; // Set Swagger UI at /swagger
    });
}

app.UseHttpsRedirection();
app.UseResponseCompression();

// Static Files (for uploaded images)
app.UseStaticFiles();

// Global Exception Handling
app.UseGlobalExceptionHandling();

// CORS
app.UseCors("AllowSpecificOrigins");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Custom Verein Authorization Middleware
app.UseVereinAuthorization();

// Request logging
app.UseSerilogRequestLogging();

// Controllers
app.MapControllers();

// Health Checks
app.MapHealthChecks("/health");

// Database Connection Health Check
// Note: Database schema is managed via SQL scripts (database/APPLICATION_H_101_AZURE.sql)
// Database Initialization
using (var scope = app.Services.CreateScope())
{
    try
    {
        // Create a new DbContext with the active connection string to avoid connection pool issues
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(activeConnectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
            sqlOptions.CommandTimeout(30);
        });

        using var context = new ApplicationDbContext(optionsBuilder.Options);

        Log.Information("Verifying database connection...");
        await context.Database.CanConnectAsync();
        Log.Information("Database connection verified successfully");

        // Development only: Ensure database is created
        if (app.Environment.IsDevelopment())
        {
            // Check if database exists
            var canConnect = await context.Database.CanConnectAsync();
            if (canConnect)
            {
                Log.Information("Database exists. Run database/APPLICATION_H_101_AZURE.sql to create schema if needed.");
            }
            else
            {
                Log.Warning("Cannot connect to database. Please create the database manually.");
            }
        }
        else
        {
            // Production: Just verify connection, do NOT run migrations
            // Database schema is managed via SQL scripts
            Log.Information("Production mode: Database schema managed via SQL scripts");
        }
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Database initialization failed");
        throw; // Fail fast if database is not accessible
    }
}

try
{
    Log.Information("Starting Verein API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
