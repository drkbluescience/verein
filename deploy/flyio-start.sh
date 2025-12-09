#!/bin/bash

# Fly.io Startup Script for Verein API + MSSQL
set -e

echo "🚀 Starting Verein API on Fly.io..."

# Function to check if MSSQL is ready
check_mssql() {
    echo "🔍 Checking MSSQL status..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1
    return $?
}

# Start MSSQL in background
echo "🗄️ Starting MSSQL Server..."
/opt/mssql/bin/sqlservr &
MSSQL_PID=$!

# Wait for MSSQL to be ready
echo "⏳ Waiting for MSSQL to be ready..."
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    if check_mssql; then
        echo "✅ MSSQL is ready!"
        break
    fi
    echo "⏱️ Waiting for MSSQL... ($RETRIES attempts left)"
    sleep 2
    RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "❌ MSSQL failed to start!"
    exit 1
fi

# Check if database exists, create if not
echo "🔍 Checking if VEREIN database exists..."
DB_EXISTS=$(/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT COUNT(*) FROM sys.databases WHERE name = 'VEREIN'" -h -1 | tr -d '[:space:]')

if [ "$DB_EXISTS" = "0" ]; then
    echo "📝 Creating VEREIN database..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "CREATE DATABASE VEREIN"
    
    # Run initialization script if exists
    if [ -f "/app/database/APPLICATION_H_101_AZURE.sql" ]; then
        echo "🔄 Running database initialization script..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -i "/app/database/APPLICATION_H_101_AZURE.sql"
    fi
else
    echo "✅ VEREIN database already exists"
fi

# Set environment variables for API
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS=http://+:8080
export ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=VEREIN;User Id=sa;Password=$MSSQL_SA_PASSWORD;TrustServerCertificate=true;MultipleActiveResultSets=true;"

# Start the API
echo "🌐 Starting .NET API..."
cd /app/api
dotnet VereinsApi.dll &
API_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down..."
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
    fi
    if [ ! -z "$MSSQL_PID" ]; then
        kill $MSSQL_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

# Wait for processes
echo "✅ All services started successfully!"
echo "📊 API: http://localhost:8080"
echo "🗄️ MSSQL: localhost:1433"
echo "💚 Health: http://localhost:8080/health"

wait