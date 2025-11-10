#!/bin/bash
set -e

# Railway sets PORT environment variable
PORT=${PORT:-8080}

# Remove any existing ASPNETCORE_URLS that might have $PORT literal
unset ASPNETCORE_URLS
unset ASPNETCORE_HTTP_PORTS
unset ASPNETCORE_HTTPS_PORTS

# Set the correct URL with expanded PORT value
export ASPNETCORE_URLS="http://0.0.0.0:${PORT}"

echo "Starting Verein API on port ${PORT}"
echo "ASPNETCORE_URLS=${ASPNETCORE_URLS}"

# Start the application
exec dotnet VereinsApi.dll

