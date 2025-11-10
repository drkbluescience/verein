#!/bin/bash
set -e

# Railway sets PORT environment variable
# Default to 8080 if not set
export ASPNETCORE_HTTP_PORTS="${PORT:-8080}"

echo "Starting Verein API on port ${ASPNETCORE_HTTP_PORTS}"

# Start the application
exec dotnet VereinsApi.dll

