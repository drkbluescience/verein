# Railway Deployment Dockerfile for Verein API
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY verein-api/VereinsApi.csproj ./verein-api/
WORKDIR /src/verein-api
RUN dotnet restore "VereinsApi.csproj"

# Copy everything else and build
WORKDIR /src
COPY verein-api/ ./verein-api/
WORKDIR /src/verein-api

# Build and publish in one step (skip separate build to avoid cache issues)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src
COPY verein-api/ ./verein-api/
WORKDIR /src/verein-api
RUN dotnet restore "VereinsApi.csproj"
RUN dotnet publish "VereinsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Railway uses PORT environment variable
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port (Railway will override this)
EXPOSE 8080

ENTRYPOINT ["dotnet", "VereinsApi.dll"]

