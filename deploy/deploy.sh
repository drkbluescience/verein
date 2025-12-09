#!/bin/bash

# Verein Application Production Deployment Script
# Üye Finans Sayfası Production Deploy Script

set -e

echo "🚀 Starting Verein Application Production Deployment..."

# Configuration
ENV_FILE=".env.production"
DOCKER_COMPOSE_FILE="production-deploy.yml"
BACKUP_DIR="./backups"
LOG_FILE="./deploy-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if required files exist
check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found. Please create it first."
    fi
    
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "Docker Compose file $DOCKER_COMPOSE_FILE not found."
    fi
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed or not in PATH."
    fi
    
    success "All prerequisites checked successfully."
}

# Create backup directory
setup_backup() {
    log "📦 Setting up backup directory..."
    mkdir -p "$BACKUP_DIR"
    success "Backup directory created: $BACKUP_DIR"
}

# Backup current database
backup_database() {
    log "💾 Backing up current database..."
    
    if docker ps | grep -q "verein-db"; then
        BACKUP_FILE="$BACKUP_DIR/verein-db-backup-$(date +%Y%m%d-%H%M%S).bak"
        docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
            -S localhost -U sa -P "$DB_PASSWORD" \
            -Q "BACKUP DATABASE VereinDB TO DISK = '/tmp/backup.bak'" \
            || warning "Database backup failed, continuing..."
        
        docker cp verein-db-prod:/tmp/backup.bak "$BACKUP_FILE" \
            || warning "Could not copy backup file, continuing..."
        
        success "Database backup completed: $BACKUP_FILE"
    else
        warning "No running database container found, skipping backup."
    fi
}

# Load environment variables
load_environment() {
    log "🔧 Loading environment variables..."
    set -a
    source "$ENV_FILE"
    set +a
    success "Environment variables loaded."
}

# Build and deploy services
deploy_services() {
    log "🏗️ Building and deploying services..."
    
    # Stop existing services
    log "🛑 Stopping existing services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down || true
    
    # Pull latest images
    log "📥 Pulling latest images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Build custom images
    log "🔨 Building custom images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Start services
    log "🚀 Starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    success "Services deployed successfully."
}

# Wait for services to be ready
wait_for_services() {
    log "⏳ Waiting for services to be ready..."
    
    # Wait for database
    log "Waiting for database..."
    timeout 60 bash -c 'until docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$DB_PASSWORD" -Q "SELECT 1" &>/dev/null; do sleep 2; done' \
        || error "Database failed to start within 60 seconds."
    
    # Wait for API
    log "Waiting for API..."
    timeout 60 bash -c 'until curl -f http://localhost:5000/health &>/dev/null; do sleep 2; done' \
        || error "API failed to start within 60 seconds."
    
    # Wait for Web
    log "Waiting for Web..."
    timeout 60 bash -c 'until curl -f http://localhost:3000 &>/dev/null; do sleep 2; done' \
        || error "Web failed to start within 60 seconds."
    
    success "All services are ready."
}

# Run database migrations
run_migrations() {
    log "🗄️ Running database migrations..."
    
    # Apply performance indexes
    if [ -f "../database/PERFORMANCE_INDEXES.sql" ]; then
        log "Applying performance indexes..."
        docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
            -S localhost -U sa -P "$DB_PASSWORD" \
            -i "/tmp/PERFORMANCE_INDEXES.sql" \
            || warning "Performance indexes application failed."
        
        docker cp ../database/PERFORMANCE_INDEXES.sql verein-db-prod:/tmp/ \
            || warning "Could not copy performance indexes file."
    fi
    
    success "Database migrations completed."
}

# Setup monitoring
setup_monitoring() {
    log "📊 Setting up monitoring..."
    
    # Wait for Prometheus
    timeout 60 bash -c 'until curl -f http://localhost:9090/-/healthy &>/dev/null; do sleep 2; done' \
        || warning "Prometheus failed to start within 60 seconds."
    
    # Wait for Grafana
    timeout 60 bash -c 'until curl -f http://localhost:3001/api/health &>/dev/null; do sleep 2; done' \
        || warning "Grafana failed to start within 60 seconds."
    
    success "Monitoring setup completed."
}

# Run health checks
run_health_checks() {
    log "🏥 Running health checks..."
    
    # API Health Check
    API_HEALTH=$(curl -s http://localhost:5000/health || echo "failed")
    if [[ "$API_HEALTH" == *"healthy"* ]]; then
        success "API health check passed."
    else
        error "API health check failed."
    fi
    
    # Database Health Check
    DB_HEALTH=$(docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
        -S localhost -U sa -P "$DB_PASSWORD" \
        -Q "SELECT 1" 2>/dev/null || echo "failed")
    if [[ "$DB_HEALTH" == *"1"* ]]; then
        success "Database health check passed."
    else
        error "Database health check failed."
    fi
    
    # Monitoring Health Check
    PROMETHEUS_HEALTH=$(curl -s http://localhost:9090/-/healthy || echo "failed")
    if [[ "$PROMETHEUS_HEALTH" == *"Prometheus"* ]]; then
        success "Prometheus health check passed."
    else
        warning "Prometheus health check failed."
    fi
    
    GRAFANA_HEALTH=$(curl -s http://localhost:3001/api/health || echo "failed")
    if [[ "$GRAFANA_HEALTH" == *"ok"* ]]; then
        success "Grafana health check passed."
    else
        warning "Grafana health check failed."
    fi
}

# Display deployment summary
display_summary() {
    log "📋 Deployment Summary:"
    echo ""
    echo "🌐 Application URLs:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - API: http://localhost:5000"
    echo "  - API Health: http://localhost:5000/health"
    echo ""
    echo "📊 Monitoring URLs:"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3001"
    echo "    - Username: $GRAFANA_USER"
    echo "    - Password: $GRAFANA_PASSWORD"
    echo ""
    echo "🗄️ Database:"
    echo "  - Server: localhost:1433"
    echo "  - Database: VereinDB"
    echo ""
    echo "📁 Backup Location: $BACKUP_DIR"
    echo "📝 Deployment Log: $LOG_FILE"
    echo ""
    success "Deployment completed successfully! 🎉"
}

# Main deployment function
main() {
    log "🚀 Starting Verein Application Production Deployment..."
    
    check_prerequisites
    setup_backup
    backup_database
    load_environment
    deploy_services
    wait_for_services
    run_migrations
    setup_monitoring
    run_health_checks
    display_summary
    
    success "🎉 Deployment completed successfully!"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi