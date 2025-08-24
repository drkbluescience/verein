# Verein API

A comprehensive .NET 8 Web API for managing associations (Vereine) and related entities.

## 🚀 Features

- **Clean Architecture** - Separation of concerns with Domain, Data, Services, and API layers
- **Entity Framework Core** - Code-first approach with SQL Server
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Comprehensive input validation
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - Interactive API documentation
- **Global Exception Handling** - Centralized error management
- **Health Checks** - Application monitoring
- **CORS Support** - Cross-origin resource sharing

## 🏗️ Architecture

```
VereinsApi/
├── Controllers/           # API Controllers
├── Domain/
│   ├── Entities/         # Entity models
│   ├── Enums/           # Enumerations
│   └── Interfaces/      # Repository interfaces
├── Data/
│   ├── Configurations/  # EF Core configurations
│   └── Repositories/    # Repository implementations
├── Services/            # Business logic layer
├── DTOs/               # Data Transfer Objects
├── Validators/         # FluentValidation validators
├── Mapping/           # AutoMapper profiles
└── Common/
    ├── Exceptions/    # Global exception handling
    ├── Extensions/    # Extension methods
    └── Helpers/      # Helper classes
```

## 🛠️ Technologies

- **.NET 8** - Web API framework
- **Entity Framework Core 8** - ORM
- **SQL Server** - Database
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Serilog** - Logging
- **Swagger** - API documentation

## 📋 Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/drkbluescience/verein-api.git
   cd verein-api
   ```

2. **Update connection string**
   
   Update the connection string in `appsettings.json` and `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true;TrustServerCertificate=true;"
     }
   }
   ```

3. **Run database migrations**
   ```bash
   cd VereinsApi
   dotnet ef database update
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

5. **Access Swagger UI**
   
   Open your browser and navigate to: `http://localhost:5103`

## 📚 API Endpoints

### Associations

- `GET /api/associations` - Get all associations
- `GET /api/associations/paginated` - Get paginated associations
- `GET /api/associations/{id}` - Get association by ID
- `GET /api/associations/by-number/{associationNumber}` - Get by association number
- `GET /api/associations/by-client-code/{clientCode}` - Get by client code
- `GET /api/associations/search` - Search associations
- `GET /api/associations/active` - Get active associations
- `POST /api/associations` - Create new association
- `PUT /api/associations/{id}` - Update association
- `DELETE /api/associations/{id}` - Soft delete association
- `DELETE /api/associations/{id}/hard` - Hard delete association
- `PATCH /api/associations/{id}/activate` - Activate association
- `PATCH /api/associations/{id}/deactivate` - Deactivate association

## 🗄️ Database Schema

The API is designed to work with a comprehensive database schema including:

- **Association** - Main association/organization entity
- **Member** - Association members
- **Address** - Address information
- **BankAccount** - Banking details
- **LegalForm** - Legal form types
- And 40+ additional related tables

## 🔧 Configuration

### Logging

Serilog is configured to log to both console and file. Log files are stored in the `logs/` directory.

### Health Checks

Health checks are available at `/health` endpoint.

### CORS

CORS is configured to allow requests from common development origins. Update `CorsSettings` in `appsettings.json` for production.

## 🧪 Testing

Run tests using:
```bash
dotnet test
```

## 📝 Development Notes

This project follows Clean Architecture principles with:

- **Domain Layer** - Core business entities and interfaces
- **Data Layer** - Data access and repository implementations
- **Service Layer** - Business logic and application services
- **API Layer** - Controllers and API-specific concerns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
