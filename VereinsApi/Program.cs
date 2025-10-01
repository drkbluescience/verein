using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using Serilog;
using VereinsApi.Data;
// using VereinsApi.Data.Repositories;
using VereinsApi.Domain.Interfaces;
// using VereinsApi.Services;
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
builder.Services.AddControllers();

// Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
            sqlOptions.CommandTimeout(120);
        });
    }
});



// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(VereinsApi.Profiles.AdresseProfile), typeof(VereinsApi.Profiles.BankkontoProfile), typeof(VereinsApi.Profiles.VeranstaltungProfile), typeof(VereinsApi.Profiles.VeranstaltungAnmeldungProfile), typeof(VereinsApi.Profiles.VeranstaltungBildProfile), typeof(VereinsApi.Profiles.VereinProfile), typeof(VereinsApi.Profiles.MitgliedProfile), typeof(VereinsApi.Profiles.MitgliedAdresseProfile), typeof(VereinsApi.Profiles.MitgliedFamilieProfile));

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

// Service Registration
// Mitglied Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedService, VereinsApi.Services.MitgliedService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedAdresseService, VereinsApi.Services.MitgliedAdresseService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IMitgliedFamilieService, VereinsApi.Services.MitgliedFamilieService>();

// Other Services
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVereinService, VereinsApi.Services.VereinService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IAdresseService, VereinsApi.Services.AdresseService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IBankkontoService, VereinsApi.Services.BankkontoService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungService, VereinsApi.Services.VeranstaltungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungAnmeldungService, VereinsApi.Services.VeranstaltungAnmeldungService>();
builder.Services.AddScoped<VereinsApi.Services.Interfaces.IVeranstaltungBildService, VereinsApi.Services.VeranstaltungBildService>();

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
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001") // Add your frontend URLs
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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
if (app.Environment.IsDevelopment())
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

// Global Exception Handling
app.UseGlobalExceptionHandling();

// CORS
app.UseCors("AllowSpecificOrigins");

// Authentication & Authorization (if needed in the future)
// app.UseAuthentication();
// app.UseAuthorization();

// Request logging
app.UseSerilogRequestLogging();

// Controllers
app.MapControllers();

// Health Checks
app.MapHealthChecks("/health");

// Database Migration and Seeding (in Development)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        Log.Information("Database initialized successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while initializing the database");
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
