#!/bin/bash

# MSSQL Setup Script for Fly.io
# Initializes database and runs migration scripts

set -e

echo "🗄️ Setting up MSSQL on Fly.io..."

# Wait for MSSQL to start
echo "⏳ Waiting for MSSQL to start..."
sleep 10

# Check if MSSQL is running
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    if /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
        echo "✅ MSSQL is running!"
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

# Create database if it doesn't exist
echo "🔍 Checking if VEREIN database exists..."
DB_EXISTS=$(/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT COUNT(*) FROM sys.databases WHERE name = 'VEREIN'" -h -1 | tr -d '[:space:]')

if [ "$DB_EXISTS" = "0" ]; then
    echo "📝 Creating VEREIN database..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "CREATE DATABASE VEREIN"
    echo "✅ Database created successfully!"
else
    echo "✅ VEREIN database already exists"
fi

# Run initialization scripts if they exist
if [ -d "/app/database" ]; then
    echo "🔄 Running database initialization scripts..."
    
    # Run main database script
    if [ -f "/app/database/APPLICATION_H_101_AZURE.sql" ]; then
        echo "📄 Running APPLICATION_H_101_AZURE.sql..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -i "/app/database/APPLICATION_H_101_AZURE.sql"
        echo "✅ Main database script completed"
    fi
    
    # Run demo data script if exists
    if [ -f "/app/database/COMPLETE_DEMO_DATA.sql" ]; then
        echo "📄 Running COMPLETE_DEMO_DATA.sql..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -i "/app/database/COMPLETE_DEMO_DATA.sql"
        echo "✅ Demo data script completed"
    fi
else
    echo "⚠️ No database scripts found in /app/database/"
fi

# Verify database setup
echo "🔍 Verifying database setup..."
TABLE_COUNT=$(/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'" -h -1 | tr -d '[:space:]')

echo "✅ Database setup completed!"
echo "📊 Tables created: $TABLE_COUNT"

# Show some basic stats
echo "📈 Database statistics:"
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -Q "
SELECT 
    'Verein' as TableName, COUNT(*) as RecordCount FROM Verein.Verein WHERE DeletedFlag = 0
UNION ALL
SELECT 
    'Mitglied' as TableName, COUNT(*) as RecordCount FROM Mitglied.Mitglied WHERE DeletedFlag = 0
UNION ALL
SELECT 
    'Veranstaltung' as TableName, COUNT(*) as RecordCount FROM Verein.Veranstaltung WHERE DeletedFlag = 0
"

echo "🎉 MSSQL setup completed successfully!"