# Verein API Dockerfile
# Multi-stage build for production optimization

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["VereinsApi.csproj", "./"]
RUN dotnet restore "./VereinsApi.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "VereinsApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "VereinsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install healthcheck tools
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system app && adduser --system --group app

# Copy published app
COPY --from=publish /app/publish .

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R app:app /app/uploads

# Set permissions
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "VereinsApi.dll"]
