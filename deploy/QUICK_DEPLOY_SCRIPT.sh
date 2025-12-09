#!/bin/bash

# 🚀 Fly.io Quick Deploy Script for Verein API
# Usage: ./deploy/QUICK_DEPLOY_SCRIPT.sh

set -e

echo "🚀 Verein API Fly.io Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if flyctl is installed
check_flyctl() {
    print_step "Checking Fly CLI installation..."
    if ! command -v flyctl &> /dev/null; then
        print_error "flyctl is not installed. Please install it first:"
        echo "curl -L https://fly.io/install.sh | sh"
        exit 1
    fi
    print_status "✅ Fly CLI is installed"
}

# Check if user is logged in
check_login() {
    print_step "Checking Fly.io authentication..."
    if ! flyctl auth whoami &> /dev/null; then
        print_warning "You are not logged in to Fly.io"
        echo "Please run: flyctl auth login"
        exit 1
    fi
    print_status "✅ Logged in to Fly.io"
}

# Generate secure passwords
generate_secrets() {
    print_step "Generating secure secrets..."
    
    MSSQL_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    JWT_SECRET=$(openssl rand -base64 32)
    
    print_status "Generated secrets:"
    echo "MSSQL_SA_PASSWORD: $MSSQL_PASSWORD"
    echo "JWT_SECRET: $JWT_SECRET"
    
    # Save to file for reference
    echo "MSSQL_SA_PASSWORD=$MSSQL_PASSWORD" > .fly_secrets
    echo "JWT_SECRET=$JWT_SECRET" >> .fly_secrets
    print_status "Secrets saved to .fly_secrets file"
}

# Create Fly.io app
create_app() {
    print_step "Creating Fly.io app..."
    
    if flyctl status --app verein-api &> /dev/null; then
        print_warning "App 'verein-api' already exists"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            flyctl apps destroy verein-api -y
        else
            print_status "Using existing app"
            return
        fi
    fi
    
    flyctl launch --name verein-api --region fra --no-deploy --copy-config
    print_status "✅ App created successfully"
}

# Create volume for database
create_volume() {
    print_step "Creating volume for database..."
    
    if flyctl volumes list --app verein-api | grep -q "verein-db"; then
        print_warning "Volume 'verein-db' already exists"
    else
        flyctl volumes create verein-db --size 3 --region fra --app verein-api
        print_status "✅ Volume created successfully"
    fi
}

# Set secrets
set_secrets() {
    print_step "Setting secrets..."
    
    if [ -f .fly_secrets ]; then
        source .fly_secrets
    else
        print_error "Secrets file not found. Please run generate_secrets first."
        exit 1
    fi
    
    flyctl secrets set MSSQL_SA_PASSWORD="$MSSQL_PASSWORD" --app verein-api
    flyctl secrets set JWT_SECRET="$JWT_SECRET" --app verein-api
    flyctl secrets set ASPNETCORE_ENVIRONMENT="Production" --app verein-api
    
    print_status "✅ Secrets set successfully"
}

# Prepare Dockerfile
prepare_dockerfile() {
    print_step "Preparing Dockerfile..."
    
    if [ -f "Dockerfile.flyio" ]; then
        cp Dockerfile.flyio Dockerfile
        print_status "✅ Using Fly.io Dockerfile"
    else
        print_warning "Dockerfile.flyio not found, using existing Dockerfile"
    fi
}

# Deploy application
deploy_app() {
    print_step "Deploying application..."
    
    flyctl deploy --app verein-api
    print_status "✅ Deployment completed"
}

# Wait for deployment to be ready
wait_for_deployment() {
    print_step "Waiting for deployment to be ready..."
    
    local retries=30
    local wait_time=10
    
    while [ $retries -gt 0 ]; do
        if curl -f https://verein-api.fly.dev/health &> /dev/null; then
            print_status "✅ Deployment is ready!"
            break
        fi
        
        echo "Waiting for deployment... ($retries attempts left)"
        sleep $wait_time
        retries=$((retries-1))
    done
    
    if [ $retries -eq 0 ]; then
        print_error "Deployment failed to become ready"
        exit 1
    fi
}

# Run database initialization
init_database() {
    print_step "Initializing database..."
    
    # This would be handled automatically by the startup script
    print_status "✅ Database initialization will run automatically"
}

# Final verification
verify_deployment() {
    print_step "Verifying deployment..."
    
    # Check health endpoint
    if curl -f https://verein-api.fly.dev/health &> /dev/null; then
        print_status "✅ Health endpoint is working"
    else
        print_error "❌ Health endpoint is not working"
        return 1
    fi
    
    # Check API endpoint
    if curl -f https://verein-api.fly.dev/api/vereine &> /dev/null; then
        print_status "✅ API endpoint is working"
    else
        print_warning "⚠️ API endpoint returned an error (might be normal if no data)"
    fi
    
    print_status "✅ Deployment verification completed"
}

# Print next steps
print_next_steps() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Test your API at: https://verein-api.fly.dev"
    echo "2. Update your frontend API URL to: https://verein-api.fly.dev"
    echo "3. Deploy your frontend to Vercel/Netlify"
    echo "4. Set up custom domain (optional)"
    echo "5. Configure monitoring and backups"
    echo ""
    echo "📊 Useful Commands:"
    echo "- View logs: flyctl logs --app verein-api"
    echo "- SSH into app: flyctl ssh console --app verein-api"
    echo "- Check status: flyctl status --app verein-api"
    echo "- View metrics: flyctl metrics --app verein-api"
    echo ""
    echo "🔧 Secrets are saved in .fly_secrets file"
    echo "📖 Full migration guide: deploy/FLYIO_MIGRATION_GUIDE.md"
}

# Main execution
main() {
    echo ""
    print_status "Starting Verein API deployment to Fly.io..."
    echo ""
    
    check_flyctl
    check_login
    
    echo ""
    read -p "Do you want to generate new secrets? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        generate_secrets
    elif [ ! -f .fly_secrets ]; then
        print_warning "No secrets file found. Generating new secrets..."
        generate_secrets
    else
        print_status "Using existing secrets from .fly_secrets"
    fi
    
    create_app
    create_volume
    set_secrets
    prepare_dockerfile
    deploy_app
    wait_for_deployment
    init_database
    verify_deployment
    print_next_steps
    
    echo ""
    print_status "🚀 Verein API is now live on Fly.io!"
}

# Run main function
main "$@"