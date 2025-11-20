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

// Database Configuration - Try Azure first, fallback to Docker
var azureConnectionString = builder.Configuration.GetConnectionString("AzureConnection");
var dockerConnectionString = builder.Configuration.GetConnectionString("DockerConnection")
    ?? throw new InvalidOperationException("Connection string 'DockerConnection' not found.");

string activeConnectionString = string.Empty;
string databaseServer = string.Empty;
bool isAzureConnection = false;

// Try Azure connection first
if (!string.IsNullOrEmpty(azureConnectionString))
{
    Log.Information("Azure bağlantısı deneniyor...");
    try
    {
        var testOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        testOptionsBuilder.UseSqlServer(azureConnectionString);

        using (var testContext = new ApplicationDbContext(testOptionsBuilder.Options))
        {
            // Test both connection and actual query execution
            await testContext.Database.CanConnectAsync();
            Log.Information("Azure bağlantısı kuruldu, sorgu testi yapılıyor...");

            // Try to execute a simple query to verify database is actually usable
            // This will catch issues like quota exceeded, database paused, etc.
            await testContext.Database.ExecuteSqlRawAsync("SELECT 1");

            activeConnectionString = azureConnectionString;
            databaseServer = "Azure SQL Database (Verein08112025.database.windows.net)";
            isAzureConnection = true;
            Log.Information("Azure veritabanı tamamen çalışır durumda");
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Azure kullanılamıyor (bağlantı hatası veya kota aşımı), Docker'a geçiliyor...");
    }
}
else
{
    Log.Information("Azure connection string bulunamadı, Docker kullanılacak");
}

// Fallback to Docker if Azure failed or not available
if (string.IsNullOrEmpty(activeConnectionString))
{
    Log.Information("Docker SQL Server bağlantısı deneniyor...");
    try
    {
        var testOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        testOptionsBuilder.UseSqlServer(dockerConnectionString);

        using (var testContext = new ApplicationDbContext(testOptionsBuilder.Options))
        {
            await testContext.Database.CanConnectAsync();
            Log.Information("Docker bağlantısı kuruldu, sorgu testi yapılıyor...");

            // Test actual query execution
            await testContext.Database.ExecuteSqlRawAsync("SELECT 1");

            activeConnectionString = dockerConnectionString;
            databaseServer = "Docker SQL Server (localhost:1433)";
            isAzureConnection = false;
            Log.Information("Docker veritabanı tamamen çalışır durumda");
        }
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Docker bağlantısı da başarısız. Docker'ın çalıştığından emin olun: docker-compose up -d mssql");
        throw new InvalidOperationException("Hiçbir veritabanına bağlanılamadı", ex);
    }
}

Log.Information("Aktif bağlantı: {Server}", databaseServer);

// Store connection strings for reference
builder.Services.AddSingleton(new ConnectionStringProvider
{
    AzureConnection = azureConnectionString ?? string.Empty,
    DockerConnection = dockerConnectionString,
    DatabaseServer = databaseServer
});

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
    typeof(VereinsApi.Profiles.VereinDitibZahlungProfile),
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
builder.Services.AddScoped<IVereinDitibZahlungRepository, VereinsApi.Data.Repositories.VereinDitibZahlungRepository>();

// Service Registration
// Mitglied Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedService, VereinsApi.Services.MitgliedService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedAdresseService, VereinsApi.Services.MitgliedAdresseService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedFamilieService, VereinsApi.Services.MitgliedFamilieService>();

// Other Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVereinService, VereinsApi.Services.VereinService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IRechtlicheDatenService, VereinsApi.Services.RechtlicheDatenService>();
builder.Services.AddScoped<VereinsApi.Services.IVereinSatzungService, VereinsApi.Services.VereinSatzungService>();
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
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVereinDitibZahlungService, VereinsApi.Services.VereinDitibZahlungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IFinanzDashboardService, VereinsApi.Services.FinanzDashboardService>();

// Excel Upload Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IExcelParserService, VereinsApi.Services.ExcelParserService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IBankUploadService, VereinsApi.Services.BankUploadService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IDitibUploadService, VereinsApi.Services.DitibUploadService>();

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
        Log.Error(ex, "Database initialization failed - Application will start but database operations may fail");
        // Don't throw - allow app to start so we can see logs and healthcheck can pass
        // Database issues will be visible in logs and API calls will fail gracefully
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
