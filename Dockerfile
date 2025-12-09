# Render Dockerfile for Verein API
# .NET API with external MSSQL database

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["verein-api/VereinsApi.csproj", "verein-api/"]
RUN dotnet restore "verein-api/VereinsApi.csproj"

# Copy source code and publish
COPY . .
WORKDIR "/src/verein-api"
RUN dotnet publish "VereinsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published API
COPY --from=build /app/publish .

# Create health check endpoint
RUN echo '#!/bin/bash\ncurl -f http://localhost:8080/api/health || exit 1' > /app/health-check.sh && \
    chmod +x /app/health-check.sh

# Create logs directory
RUN mkdir -p /app/logs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD /app/health-check.sh

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Start the API
ENTRYPOINT ["dotnet", "VereinsApi.dll"]

