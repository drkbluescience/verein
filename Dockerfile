# Railway Deployment Dockerfile for Verein API
# Azure SQL Server + verein.qubbe.ba
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY verein-api/VereinsApi.csproj ./verein-api/
WORKDIR /src/verein-api
RUN dotnet restore "VereinsApi.csproj"

# Copy source code and publish
WORKDIR /src
COPY verein-api/ ./verein-api/
WORKDIR /src/verein-api
RUN dotnet publish "VereinsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Create logs directory
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production

# Railway will set PORT environment variable at runtime
# We'll use it in the ENTRYPOINT
EXPOSE 8080

# Use shell form to allow environment variable expansion
CMD dotnet VereinsApi.dll --urls "http://0.0.0.0:${PORT:-8080}"

