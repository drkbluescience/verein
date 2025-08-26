# Verein API

A comprehensive .NET 8 Web API for managing German associations (Vereine) and their members, built with Clean Architecture principles and modern development practices.

## 🎯 **Current Status: PRODUCTION READY** ✅

- **API Server**: Running at `http://localhost:5103`
- **Swagger UI**: Interactive documentation at root URL (`/`)
- **Database**: SQLite (Development) / SQL Server (Production)
- **All Core Features**: Fully tested and operational

## 🚀 Features

- **Clean Architecture** - Separation of concerns with Domain, Data, and API layers
- **Entity Framework Core 9** - Database-first approach with SQLite (dev) and SQL Server (prod)
- **Manual Mapping** - Efficient object mapping in controllers (AutoMapper ready but not active)
- **Validation** - Input validation with detailed error responses (FluentValidation ready but not active)
- **Serilog** - Structured logging with file and console outputs
- **Swagger/OpenAPI** - Interactive API documentation with detailed schemas
- **Global Exception Handling** - Centralized error management with custom middleware
- **Health Checks** - Application and database monitoring (`/health`)
- **CORS Support** - Cross-origin resource sharing configuration
- **Repository Pattern** - Generic repository with specific implementations
- **Soft Delete** - Logical deletion with audit trails (DeletedFlag)
- **Audit Trail** - Created, Modified, CreatedBy, ModifiedBy fields

## 🏗️ Project Architecture

```
VereinsApi/
├── Controllers/              # RESTful API Controllers
│   ├── VereineController.cs         # Association management
│   ├── AdressenController.cs        # Address management
│   ├── BankkontoController.cs       # Bank account management
│   ├── VeranstaltungenController.cs # Event management
│   ├── VeranstaltungAnmeldungenController.cs # Event registrations
│   ├── VeranstaltungBilderController.cs # Event images
│   └── HealthController.cs          # System health checks
├── Domain/                   # Core business entities and contracts
│   ├── Entities/            # Domain entities with relationships
│   │   ├── Verein.cs        # Main association entity
│   │   ├── Adresse.cs       # Address details
│   │   ├── Bankkonto.cs     # Banking information
│   │   ├── Veranstaltung.cs # Event management
│   │   ├── VeranstaltungAnmeldung.cs # Event registrations
│   │   ├── VeranstaltungBild.cs # Event images
│   │   └── AuditableEntity.cs # Base entity with audit fields
│   └── Interfaces/         # Repository contracts
├── Data/                    # Data access layer
│   ├── Configurations/     # EF Core entity configurations
│   │   ├── VereinConfiguration.cs
│   │   ├── AdresseConfiguration.cs
│   │   ├── BankkontoConfiguration.cs
│   │   ├── VeranstaltungConfiguration.cs
│   │   ├── VeranstaltungAnmeldungConfiguration.cs
│   │   └── VeranstaltungBildConfiguration.cs
│   ├── Repositories/       # Repository implementations
│   │   └── Repository.cs   # Generic repository
│   └── ApplicationDbContext.cs
├── DTOs/                   # Data Transfer Objects
│   ├── Verein/            # Association DTOs
│   ├── Adresse/           # Address DTOs
│   ├── Bankkonto/         # Bank account DTOs
│   ├── Veranstaltung/     # Event DTOs
│   ├── VeranstaltungAnmeldung/ # Event registration DTOs
│   └── VeranstaltungBild/ # Event image DTOs
├── Common/               # Shared components
│   ├── Extensions/       # Extension methods
│   └── Middleware/       # Custom middleware
└── docs/                # Documentation and guides
    ├── swagger-adressen-kullanimi.md
    ├── veritabani-baglantisi-rehberi.md
    └── api-proje-durumu-ve-ozellikleri.md
```
VereinsApi/
├── Controllers/              # RESTful API Controllers
│   ├── VereineController.cs         # Association management
│   ├── AdressenController.cs        # Address management
│   ├── BankkontoController.cs       # Bank account management
│   ├── VeranstaltungenController.cs # Event management
│   ├── VeranstaltungAnmeldungenController.cs # Event registrations
│   ├── VeranstaltungBilderController.cs # Event images
│   └── HealthController.cs          # System health checks
├── Domain/                   # Core business entities and contracts
│   ├── Entities/            # Domain entities with relationships
│   │   ├── Verein.cs        # Main association entity
│   │   ├── Adresse.cs       # Address details
│   │   ├── Bankkonto.cs     # Banking information
│   │   ├── Veranstaltung.cs # Event management
│   │   ├── VeranstaltungAnmeldung.cs # Event registrations
│   │   ├── VeranstaltungBild.cs # Event images
│   │   └── AuditableEntity.cs # Base entity with audit fields
│   └── Interfaces/         # Repository contracts
├── Data/                    # Data access layer
│   ├── Configurations/     # EF Core entity configurations
│   │   ├── VereinConfiguration.cs
│   │   ├── AdresseConfiguration.cs
│   │   ├── BankkontoConfiguration.cs
│   │   ├── VeranstaltungConfiguration.cs
│   │   ├── VeranstaltungAnmeldungConfiguration.cs
│   │   └── VeranstaltungBildConfiguration.cs
│   ├── Repositories/       # Repository implementations
│   │   └── Repository.cs   # Generic repository
│   └── ApplicationDbContext.cs
├── DTOs/                   # Data Transfer Objects
│   ├── Verein/            # Association DTOs
│   ├── Adresse/           # Address DTOs
│   ├── Bankkonto/         # Bank account DTOs
│   ├── Veranstaltung/     # Event DTOs
│   ├── VeranstaltungAnmeldung/ # Event registration DTOs
│   └── VeranstaltungBild/ # Event image DTOs
├── Common/               # Shared components
│   ├── Extensions/       # Extension methods
│   └── Middleware/       # Custom middleware
└── docs/                # Documentation and guides
```

## 🛠️ Technology Stack

- **.NET 8** - Modern web framework with Web API
- **Entity Framework Core 9** - Advanced ORM with latest features
- **SQLite** - Development database (file-based, `verein_dev.db`)
- **SQL Server** - Production database (VEREIN database)
- **Serilog** - Structured logging framework with file rotation
- **Swagger/OpenAPI** - Interactive API documentation at root URL
- **Health Checks** - Application monitoring and diagnostics (`/health`)
- **CORS** - Cross-origin resource sharing support
- **Global Exception Handling** - Centralized error management

## �️ Database Schema

The API manages a comprehensive association management system with the following entities:

### Core Entities

- **Verein** - Main association/organization entity with complete details
- **Adresse** - Physical address information for associations
- **Bankkonto** - Banking details for financial management
- **Veranstaltung** - Event management for associations
- **VeranstaltungAnmeldung** - Event participant registrations
- **VeranstaltungBild** - Event image management

### Entity Relationships

```
Verein (1) ←→ (N) Adresse
     ↓
Bankkonto (N)
     ↓
Veranstaltung (N)
     ↓
VeranstaltungAnmeldung (N)
     ↓
VeranstaltungBild (N)
```

### Key Features

- **Audit Trail** - All entities include Created, Modified, CreatedBy, ModifiedBy fields
- **Soft Delete** - Logical deletion with DeletedFlag
- **Active Status** - Aktiv flag for enabling/disabling records
- **Unique Constraints** - Association numbers, client codes, IBANs
- **Performance Indexes** - Optimized database queries with strategic indexing
- **German Schema** - Database uses German column names (Strasse, PLZ, Ort, etc.)

## 📋 Prerequisites

- **.NET 8 SDK** - Latest version
- **SQLite** - For development (included)
- **SQL Server** - For production (optional)
- **Visual Studio 2022** or **VS Code** with C# extension
- **Git** - For version control

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/drkbluescience/verein-api.git
cd verein-api
```

### 2. Restore Dependencies
```bash
cd VereinsApi
dotnet restore
```

### 3. Database Setup

**For Development (SQLite - Default):**
```bash
# Database is automatically created on first run
dotnet run --project VereinsApi
```

**For Production (SQL Server):**
```bash
# Set environment variable
$env:ASPNETCORE_ENVIRONMENT="Production"

# Run with SQL Server connection
dotnet run --project VereinsApi
```

### 4. Run the Application
```bash
# Development mode (SQLite)
dotnet run --project VereinsApi

# Production mode (SQL Server)
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet run --project VereinsApi
```

### 5. Access the API
- **Swagger UI**: http://localhost:5103 (Root URL)
- **API Base URL**: http://localhost:5103/api
- **Health Check**: http://localhost:5103/health
- **Detailed Health**: http://localhost:5103/api/health/detailed

## 📚 API Endpoints

### Vereine (Associations) Management

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/Vereine` | Get all associations | ✅ Tested & Working |
| `GET` | `/api/Vereine/{id}` | Get association by ID | ✅ Implemented |
| `POST` | `/api/Vereine` | Create new association | ✅ Tested & Working |
| `PUT` | `/api/Vereine/{id}` | Update association | ✅ Implemented |
| `DELETE` | `/api/Vereine/{id}` | Soft delete association | ✅ Implemented |

### Adressen (Addresses) Management

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/Adressen` | Get all addresses | ✅ Tested & Working |
| `GET` | `/api/Adressen/{id}` | Get address by ID | ✅ Implemented |
| `GET` | `/api/Adressen/verein/{vereinId}` | Get addresses by association | ✅ Implemented |
| `POST` | `/api/Adressen` | Create new address | ✅ Tested & Working |
| `PUT` | `/api/Adressen/{id}` | Update address | ✅ Implemented |
| `DELETE` | `/api/Adressen/{id}` | Soft delete address | ✅ Implemented |

### Bankkonto (Bank Accounts) Management

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/Bankkonto` | Get all bank accounts | ✅ Implemented |
| `GET` | `/api/Bankkonto/{id}` | Get bank account by ID | ✅ Implemented |
| `GET` | `/api/Bankkonto/verein/{vereinId}` | Get accounts by association | ✅ Implemented |
| `POST` | `/api/Bankkonto` | Create new bank account | ✅ Implemented |
| `PUT` | `/api/Bankkonto/{id}` | Update bank account | ✅ Implemented |
| `DELETE` | `/api/Bankkonto/{id}` | Soft delete bank account | ✅ Implemented |

### Veranstaltungen (Events) Management

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/Veranstaltungen` | Get all events | ✅ Implemented |
| `GET` | `/api/Veranstaltungen/{id}` | Get event by ID | ✅ Implemented |
| `GET` | `/api/Veranstaltungen/verein/{vereinId}` | Get events by association | ✅ Implemented |
| `POST` | `/api/Veranstaltungen` | Create new event | ✅ Implemented |
| `PUT` | `/api/Veranstaltungen/{id}` | Update event | ✅ Implemented |
| `DELETE` | `/api/Veranstaltungen/{id}` | Soft delete event | ✅ Implemented |

### VeranstaltungAnmeldungen (Event Registrations)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/VeranstaltungAnmeldungen` | Get all registrations | ✅ Implemented |
| `GET` | `/api/VeranstaltungAnmeldungen/{id}` | Get registration by ID | ✅ Implemented |
| `GET` | `/api/VeranstaltungAnmeldungen/veranstaltung/{veranstaltungId}` | Get registrations by event | ✅ Implemented |
| `POST` | `/api/VeranstaltungAnmeldungen` | Create new registration | ✅ Implemented |
| `PUT` | `/api/VeranstaltungAnmeldungen/{id}` | Update registration | ✅ Implemented |
| `DELETE` | `/api/VeranstaltungAnmeldungen/{id}` | Soft delete registration | ✅ Implemented |

### VeranstaltungBilder (Event Images)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/VeranstaltungBilder` | Get all event images | ✅ Implemented |
| `GET` | `/api/VeranstaltungBilder/{id}` | Get image by ID | ✅ Implemented |
| `GET` | `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}` | Get images by event | ✅ Implemented |
| `POST` | `/api/VeranstaltungBilder` | Upload new image | ✅ Implemented |
| `PUT` | `/api/VeranstaltungBilder/{id}` | Update image | ✅ Implemented |
| `DELETE` | `/api/VeranstaltungBilder/{id}` | Soft delete image | ✅ Implemented |

### System Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/health` | Application health check | ✅ Working |
| `GET` | `/api/health` | Basic health status | ✅ Working |
| `GET` | `/api/health/detailed` | Detailed health with uptime | ✅ Working |
| `GET` | `/` | Swagger UI (Interactive API docs) | ✅ Working |

## 🔧 Configuration

### Environment-Specific Settings

**Development (appsettings.Development.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=verein_dev.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Production (appsettings.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;"
  },
  "ApiSettings": {
    "Title": "Verein API",
    "Version": "v1.0.0",
    "Description": "API for managing associations (Vereine) and related entities",
    "MaxPageSize": 100,
    "DefaultPageSize": 10
  }
}
```

### Logging Configuration

- **Serilog** structured logging with multiple outputs
- **Console** logging for development
- **File** logging in `logs/verein-api-.txt` with daily rotation
- **Request/Response** logging for API calls
- **Error** logging with stack traces

### Health Checks

Comprehensive health monitoring:
- **Basic Health**: `/health` - Application status
- **API Health**: `/api/health` - Basic health with timestamp
- **Detailed Health**: `/api/health/detailed` - Full system info with uptime
- **Database connectivity** automatic check

### CORS Policy

Configured for frontend integration:
- **Allowed Origins**: `localhost:3000`, `localhost:4200`
- **Methods**: GET, POST, PUT, DELETE, PATCH
- **Headers**: All headers allowed
- **Credentials**: Supported

## 🧪 Testing

### Manual Testing with Swagger UI

**Current Testing Approach:**
- **Swagger UI**: Interactive testing at `http://localhost:5103`
- **All endpoints**: Fully testable through Swagger interface
- **Real data**: Tests with actual SQLite database

**Tested Endpoints:**
- ✅ `GET/POST /api/Vereine` - Fully tested and working
- ✅ `GET/POST /api/Adressen` - Fully tested and working
- ✅ Foreign key relationships - Validated and working
- ✅ Validation rules - Error handling tested

### Future Automated Testing (Planned)
```bash
# Unit tests (planned)
dotnet test VereinsApi.UnitTests

# Integration tests (planned)
dotnet test VereinsApi.IntegrationTests
```

## 🏗️ Development Approach

### Architecture Principles

This project implements **Clean Architecture** with:

1. **Domain Layer** (Core)
   - Business entities with rich domain models
   - Repository interfaces and contracts
   - Domain enums and value objects

2. **Data Layer** (Infrastructure)
   - Entity Framework Core implementations
   - Repository pattern with generic base
   - Database configurations and migrations

3. **Service Layer** (Application)
   - Business logic and use cases
   - Service interfaces and implementations
   - Data transformation and validation

4. **API Layer** (Presentation)
   - RESTful controllers with proper HTTP semantics
   - Request/response DTOs
   - Global exception handling and middleware

### Development Methodology

- **Database-First Approach** using EF Core with existing SQL Server schema
- **Repository Pattern** for data access abstraction
- **Manual Mapping** in controllers (efficient and transparent)
- **DTO Pattern** for API data contracts
- **Global Exception Handling** for consistent error responses
- **Dependency Injection** for loose coupling
- **German Schema Support** with proper column name mapping

## 🚀 Deployment

### Development Deployment
```bash
# Build and run (SQLite)
dotnet build --configuration Release
dotnet run --project VereinsApi
```

### Production Deployment
```bash
# Set environment for SQL Server
$env:ASPNETCORE_ENVIRONMENT="Production"

# Build and run
dotnet build --configuration Release
dotnet run --project VereinsApi

# Or publish for deployment
dotnet publish --configuration Release --output ./publish
cd publish
dotnet VereinsApi.dll
```

### Current Status
- ✅ **Development**: Fully working with SQLite
- ✅ **Production**: Ready for SQL Server deployment
- ✅ **Swagger**: Available in development mode
- ✅ **Health Checks**: Monitoring endpoints active

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow **C# coding conventions**
- Use **meaningful variable and method names**
- Add **XML documentation** for public APIs
- Include **unit tests** for new features
- Ensure **no breaking changes** without version bump

### Pull Request Guidelines

- Provide clear description of changes
- Include relevant tests
- Update documentation if needed
- Ensure all CI checks pass

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/drkbluescience/verein-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/drkbluescience/verein-api/discussions)
- **Email**: Contact through GitHub profile

## 📊 Current Project Status

### ✅ **Completed & Working:**
- Full CRUD operations for all entities
- SQLite development database with auto-creation
- SQL Server production database support
- Swagger UI interactive documentation
- Global exception handling
- Structured logging with Serilog
- Health monitoring endpoints
- CORS configuration for frontend integration

### 🔄 **Ready but Not Active:**
- FluentValidation (configured but using manual validation)
- AutoMapper (configured but using manual mapping)

### 📈 **Next Steps:**
- Unit and integration tests
- Authentication and authorization
- API versioning
- Docker containerization

## 🙏 Acknowledgments

- **Entity Framework Core** team for excellent ORM capabilities
- **Serilog** for structured logging
- **Swashbuckle** for API documentation
- **Microsoft** for .NET 8 and ASP.NET Core

---

**Built with ❤️ using .NET 8 and modern development practices**

**Status: PRODUCTION READY** ✅
