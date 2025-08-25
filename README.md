# Verein API

A comprehensive .NET 8 Web API for managing German associations (Vereine) and their members, built with Clean Architecture principles and modern development practices.

## 🚀 Features

- **Clean Architecture** - Separation of concerns with Domain, Data, Services, and API layers
- **Entity Framework Core 9** - Database-first approach with SQLite (dev) and SQL Server (prod)
- **Scaffold-Generated Entities** - Rapid development using EF Core scaffolding
- **AutoMapper** - Object-to-object mapping with comprehensive profiles
- **FluentValidation** - Comprehensive input validation with custom rules
- **Serilog** - Structured logging with file and console outputs
- **Swagger/OpenAPI** - Interactive API documentation with detailed schemas
- **Global Exception Handling** - Centralized error management with custom middleware
- **Health Checks** - Application and database monitoring
- **CORS Support** - Cross-origin resource sharing configuration
- **Repository Pattern** - Generic repository with specific implementations
- **Soft Delete** - Logical deletion with audit trails
- **Pagination** - Efficient data retrieval with pagination support

## 🏗️ Project Architecture

```
VereinsApi/
├── Controllers/              # RESTful API Controllers
│   └── AssociationsController.cs
├── Domain/                   # Core business entities and contracts
│   ├── Entities/            # Domain entities with relationships
│   │   ├── Association.cs   # Main association entity
│   │   ├── Member.cs        # Member information
│   │   ├── Address.cs       # Address details
│   │   ├── BankAccount.cs   # Banking information
│   │   ├── LegalForm.cs     # Legal entity types
│   │   ├── AssociationMember.cs # Many-to-many relationship
│   │   └── BaseEntity.cs    # Base entity with audit fields
│   ├── Enums/              # Domain enumerations
│   └── Interfaces/         # Repository contracts
├── Data/                    # Data access layer
│   ├── Configurations/     # EF Core entity configurations
│   │   ├── AssociationConfiguration.cs
│   │   ├── MemberConfiguration.cs
│   │   ├── AddressConfiguration.cs
│   │   ├── BankAccountConfiguration.cs
│   │   ├── LegalFormConfiguration.cs
│   │   └── AssociationMemberConfiguration.cs
│   ├── Repositories/       # Repository implementations
│   │   ├── Repository.cs   # Generic repository
│   │   └── AssociationRepository.cs
│   └── ApplicationDbContext.cs
├── Services/               # Business logic layer
│   ├── IAssociationService.cs
│   └── AssociationService.cs
├── DTOs/                   # Data Transfer Objects
│   └── Association/        # Association-specific DTOs
├── Validators/             # FluentValidation validators
├── Mapping/               # AutoMapper profiles
├── Models/Generated/      # Scaffold-generated models
├── Migrations/           # EF Core migrations
├── Common/               # Shared components
│   ├── Exceptions/       # Global exception handling
│   ├── Extensions/       # Extension methods
│   └── Helpers/         # Helper classes
└── docs/                # Documentation and SQL scripts
```

## 🛠️ Technology Stack

- **.NET 8** - Modern web framework with minimal APIs
- **Entity Framework Core 9** - Advanced ORM with latest features
- **SQLite** - Development database (file-based)
- **SQL Server** - Production database (configurable)
- **AutoMapper 12** - Object-to-object mapping
- **FluentValidation 11** - Declarative validation rules
- **Serilog 9** - Structured logging framework
- **Swagger/OpenAPI** - API documentation and testing
- **Health Checks** - Application monitoring and diagnostics

## �️ Database Schema

The API manages a comprehensive association management system with the following entities:

### Core Entities

- **Association** - Main association/organization entity with complete details
- **Member** - Individual members with personal information
- **Address** - Physical address information for members and associations
- **BankAccount** - Banking details for financial management
- **LegalForm** - Legal entity types (e.V., gGmbH, Stiftung, etc.)
- **AssociationMember** - Many-to-many relationship between associations and members

### Entity Relationships

```
Association (1) ←→ (N) AssociationMember (N) ←→ (1) Member
     ↓                                                ↓
LegalForm (1)                                   Address (1)
     ↓
BankAccount (1)
```

### Key Features

- **Audit Trail** - All entities include Created, Modified, CreatedBy, ModifiedBy fields
- **Soft Delete** - Logical deletion with IsDeleted flag
- **Active Status** - IsActive flag for enabling/disabling records
- **Unique Constraints** - Association numbers, client codes, member numbers, IBANs
- **Performance Indexes** - Optimized database queries with strategic indexing

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
dotnet ef database update --context ApplicationDbContext
```

**For Production (SQL Server):**
```bash
# Update connection string in appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}

# Run migrations
dotnet ef database update --context ApplicationDbContext
```

### 4. Run the Application
```bash
dotnet run
```

### 5. Access the API
- **Swagger UI**: http://localhost:5103
- **API Base URL**: http://localhost:5103/api
- **Health Check**: http://localhost:5103/health

## 📚 API Endpoints

### Associations Management

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/associations` | Get all associations | ✅ Implemented |
| `GET` | `/api/associations/paginated` | Get paginated associations | ✅ Implemented |
| `GET` | `/api/associations/{id}` | Get association by ID | ✅ Implemented |
| `GET` | `/api/associations/by-number/{associationNumber}` | Get by association number | ✅ Implemented |
| `GET` | `/api/associations/by-client-code/{clientCode}` | Get by client code | ✅ Implemented |
| `GET` | `/api/associations/search` | Search associations | ✅ Implemented |
| `GET` | `/api/associations/active` | Get active associations | ✅ Implemented |
| `POST` | `/api/associations` | Create new association | ✅ Implemented |
| `PUT` | `/api/associations/{id}` | Update association | ✅ Implemented |
| `DELETE` | `/api/associations/{id}` | Soft delete association | ✅ Implemented |
| `DELETE` | `/api/associations/{id}/hard` | Hard delete association | ✅ Implemented |
| `PATCH` | `/api/associations/{id}/activate` | Activate association | ✅ Implemented |
| `PATCH` | `/api/associations/{id}/deactivate` | Deactivate association | ✅ Implemented |
| `GET` | `/api/associations/check-association-number/{number}` | Check number uniqueness | ✅ Implemented |
| `GET` | `/api/associations/check-client-code/{code}` | Check client code uniqueness | ✅ Implemented |

### Future Endpoints (Planned)

| Entity | Endpoints | Status |
|--------|-----------|---------|
| **Members** | Full CRUD operations | 🔄 Planned |
| **Addresses** | Full CRUD operations | 🔄 Planned |
| **Bank Accounts** | Full CRUD operations | 🔄 Planned |
| **Legal Forms** | Full CRUD operations | 🔄 Planned |
| **Association Members** | Relationship management | 🔄 Planned |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Application health check |
| `GET` | `/swagger` | API documentation |

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
    "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### Logging Configuration

- **Serilog** structured logging with multiple outputs
- **Console** logging for development
- **File** logging in `logs/` directory with daily rotation
- **Structured** JSON format for production analysis

### Health Checks

Comprehensive health monitoring:
- **Database connectivity** check
- **Application status** verification
- **Endpoint**: `/health`

### CORS Policy

Configured for development and production:
- **Development**: Allows all origins for testing
- **Production**: Configurable allowed origins
- **Methods**: GET, POST, PUT, DELETE, PATCH
- **Headers**: Content-Type, Authorization

## 🧪 Testing

### Running Tests
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test VereinsApi.Tests
```

### Test Structure (Planned)
```
Tests/
├── VereinsApi.UnitTests/     # Unit tests
├── VereinsApi.IntegrationTests/  # Integration tests
└── VereinsApi.ApiTests/      # API endpoint tests
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

- **Database-First Approach** using EF Core scaffolding
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic separation
- **DTO Pattern** for API data contracts
- **AutoMapper** for object-to-object mapping
- **FluentValidation** for input validation
- **Dependency Injection** for loose coupling

## 🚀 Deployment

### Development Deployment
```bash
# Build the application
dotnet build --configuration Release

# Run with production settings
dotnet run --environment Production
```

### Production Deployment
```bash
# Publish the application
dotnet publish --configuration Release --output ./publish

# Run the published application
cd publish
dotnet VereinsApi.dll
```

### Docker Support (Future)
```dockerfile
# Planned Docker configuration
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY publish/ App/
WORKDIR /App
ENTRYPOINT ["dotnet", "VereinsApi.dll"]
```

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

## 🙏 Acknowledgments

- **Entity Framework Core** team for excellent ORM capabilities
- **AutoMapper** for seamless object mapping
- **Serilog** for structured logging
- **FluentValidation** for declarative validation
- **Swashbuckle** for API documentation

---

**Built with ❤️ using .NET 8 and modern development practices**
