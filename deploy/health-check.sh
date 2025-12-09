#!/bin/bash

# Health Check Script for Fly.io
# Checks both MSSQL and API

# Check API health
check_api() {
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ API is healthy"
        return 0
    else
        echo "❌ API is not responding"
        return 1
    fi
}

# Check MSSQL health
check_mssql() {
    if /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
        echo "✅ MSSQL is healthy"
        return 0
    else
        echo "❌ MSSQL is not responding"
        return 1
    fi
}

# Run checks
API_HEALTH=$(check_api)
MSSQL_HEALTH=$(check_mssql)

if [ $? -eq 0 ]; then
    echo "🟢 All services are healthy"
    exit 0
else
    echo "🔴 Some services are unhealthy"
    exit 1
fi