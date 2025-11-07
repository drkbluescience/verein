# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["verein-api/VereinsApi.csproj", "./verein-api/"]
RUN dotnet restore "verein-api/VereinsApi.csproj"

# Copy everything else and build
COPY verein-api/ ./verein-api/
WORKDIR /src/verein-api
RUN dotnet build "VereinsApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
WORKDIR /src/verein-api
RUN dotnet publish "VereinsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Expose port
EXPOSE 8080

ENTRYPOINT ["dotnet", "VereinsApi.dll"]

