#!/bin/bash

# Verein Application Backup Script
# Üye Finans Sayfası Yedekleme Script'i

set -e

# Configuration
BACKUP_DIR="./backups"
RETENTION_DAYS=30
ENV_FILE=".env.production"
LOG_FILE="./backup-$(date +%Y%m%d-%H%M%S).log"

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

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking backup prerequisites..."
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found."
    fi
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH."
    fi
    
    # Load environment variables
    set -a
    source "$ENV_FILE"
    set +a
    
    success "Backup prerequisites checked successfully."
}

# Create backup directory
setup_backup_dir() {
    log "📁 Setting up backup directory..."
    
    BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_DATE"
    
    mkdir -p "$BACKUP_PATH"
    mkdir -p "$BACKUP_PATH/database"
    mkdir -p "$BACKUP_PATH/configs"
    mkdir -p "$BACKUP_PATH/logs"
    
    success "Backup directory created: $BACKUP_PATH"
}

# Backup database
backup_database() {
    log "💾 Backing up database..."
    
    if docker ps | grep -q "verein-db-prod"; then
        DB_BACKUP_FILE="$BACKUP_PATH/database/verein-db-$BACKUP_DATE.bak"
        
        # Create database backup
        docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
            -S localhost -U sa -P "$DB_PASSWORD" \
            -Q "BACKUP DATABASE VereinDB TO DISK = '/tmp/backup.bak' WITH INIT, STATS = 10" \
            || error "Database backup failed."
        
        # Copy backup file
        docker cp verein-db-prod:/tmp/backup.bak "$DB_BACKUP_FILE" \
            || error "Could not copy database backup file."
        
        # Compress backup
        gzip "$DB_BACKUP_FILE"
        
        # Backup performance data
        PERF_BACKUP_FILE="$BACKUP_PATH/database/performance-data-$BACKUP_DATE.sql"
        docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
            -S localhost -U sa -P "$DB_PASSWORD" \
            -Q "EXEC sp_helptext 'production.sp_CleanupOldLogs'" > /dev/null 2>&1 \
            && docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
                -S localhost -U sa -P "$DB_PASSWORD" \
                -Q "SELECT * FROM production.PerformanceMetrics WHERE Timestamp >= DATEADD(DAY, -7, GETUTCDATE())" \
                -o "/tmp/perf_data.csv" \
            && docker cp verein-db-prod:/tmp/perf_data.csv "$BACKUP_PATH/database/" \
            || warning "Performance data backup failed, continuing..."
        
        success "Database backup completed: ${DB_BACKUP_FILE}.gz"
    else
        warning "Database container not found, skipping database backup."
    fi
}

# Backup application configurations
backup_configs() {
    log "⚙️ Backing up configurations..."
    
    # Copy environment files
    cp "$ENV_FILE" "$BACKUP_PATH/configs/" \
        || error "Could not copy environment file."
    
    # Copy Docker Compose files
    cp production-deploy.yml "$BACKUP_PATH/configs/" \
        || error "Could not copy Docker Compose file."
    
    # Copy monitoring configurations
    cp -r monitoring "$BACKUP_PATH/configs/" \
        || error "Could not copy monitoring configurations."
    
    success "Configuration backup completed."
}

# Backup application logs
backup_logs() {
    log "📝 Backing up application logs..."
    
    # API logs
    if docker ps | grep -q "verein-api-prod"; then
        docker logs verein-api-prod --since="7d" > "$BACKUP_PATH/logs/api-$BACKUP_DATE.log" \
            || warning "Could not backup API logs."
    fi
    
    # Web logs
    if docker ps | grep -q "verein-web-prod"; then
        docker logs verein-web-prod --since="7d" > "$BACKUP_PATH/logs/web-$BACKUP_DATE.log" \
            || warning "Could not backup web logs."
    fi
    
    # Database logs
    if docker ps | grep -q "verein-db-prod"; then
        docker logs verein-db-prod --since="7d" > "$BACKUP_PATH/logs/database-$BACKUP_DATE.log" \
            || warning "Could not backup database logs."
    fi
    
    # Monitoring logs
    if docker ps | grep -q "verein-prometheus"; then
        docker logs verein-prometheus --since="7d" > "$BACKUP_PATH/logs/prometheus-$BACKUP_DATE.log" \
            || warning "Could not backup Prometheus logs."
    fi
    
    if docker ps | grep -q "verein-grafana"; then
        docker logs verein-grafana --since="7d" > "$BACKUP_PATH/logs/grafana-$BACKUP_DATE.log" \
            || warning "Could not backup Grafana logs."
    fi
    
    success "Log backup completed."
}

# Backup uploaded files
backup_uploads() {
    log "📁 Backing up uploaded files..."
    
    if [ -d "../uploads" ]; then
        mkdir -p "$BACKUP_PATH/uploads"
        cp -r ../uploads/* "$BACKUP_PATH/uploads/" \
            || warning "Could not backup uploaded files."
        
        # Create archive
        cd "$BACKUP_PATH"
        tar -czf "uploads-$BACKUP_DATE.tar.gz" uploads/
        rm -rf uploads/
        cd - > /dev/null
        
        success "Uploaded files backup completed: uploads-$BACKUP_DATE.tar.gz"
    else
        warning "Uploads directory not found, skipping."
    fi
}

# Backup monitoring data
backup_monitoring() {
    log "📊 Backing up monitoring data..."
    
    # Prometheus data
    if docker ps | grep -q "verein-prometheus"; then
        docker exec verein-prometheus tar -czf /tmp/prometheus-data.tar.gz /prometheus \
            || warning "Could not backup Prometheus data."
        
        docker cp verein-prometheus:/tmp/prometheus-data.tar.gz "$BACKUP_PATH/monitoring/" \
            || warning "Could not copy Prometheus backup."
    fi
    
    # Grafana data
    if docker ps | grep -q "verein-grafana"; then
        docker exec verein-grafana tar -czf /tmp/grafana-data.tar.gz /var/lib/grafana \
            || warning "Could not backup Grafana data."
        
        docker cp verein-grafana:/tmp/grafana-data.tar.gz "$BACKUP_PATH/monitoring/" \
            || warning "Could not copy Grafana backup."
    fi
    
    success "Monitoring data backup completed."
}

# Create backup manifest
create_manifest() {
    log "📋 Creating backup manifest..."
    
    cat > "$BACKUP_PATH/backup-manifest.json" << EOF
{
    "backup_date": "$BACKUP_DATE",
    "backup_type": "full",
    "retention_days": $RETENTION_DAYS,
    "components": {
        "database": {
            "backup_file": "verein-db-$BACKUP_DATE.bak.gz",
            "size_bytes": $(stat -c%s "$BACKUP_PATH/database/verein-db-$BACKUP_DATE.bak.gz" 2>/dev/null || echo 0),
            "timestamp": "$(date -Iseconds)"
        },
        "configs": {
            "environment_file": ".env.production",
            "docker_compose": "production-deploy.yml",
            "monitoring_configs": "monitoring/"
        },
        "logs": {
            "api_log": "api-$BACKUP_DATE.log",
            "web_log": "web-$BACKUP_DATE.log",
            "database_log": "database-$BACKUP_DATE.log",
            "prometheus_log": "prometheus-$BACKUP_DATE.log",
            "grafana_log": "grafana-$BACKUP_DATE.log"
        },
        "uploads": {
            "archive": "uploads-$BACKUP_DATE.tar.gz",
            "timestamp": "$(date -Iseconds)"
        },
        "monitoring": {
            "prometheus_data": "prometheus-data.tar.gz",
            "grafana_data": "grafana-data.tar.gz"
        }
    },
    "system_info": {
        "docker_version": "$(docker --version)",
        "docker_compose_version": "$(docker-compose --version)",
        "hostname": "$(hostname)",
        "os_info": "$(uname -a)"
    }
}
EOF
    
    success "Backup manifest created."
}

# Cleanup old backups
cleanup_old_backups() {
    log "🧹 Cleaning up old backups..."
    
    if [ -d "$BACKUP_DIR" ]; then
        # Find and remove old backup directories
        find "$BACKUP_DIR" -maxdepth 1 -type d -name "????????-??????" -mtime +$RETENTION_DAYS -exec rm -rf {} \; \
            || warning "Could not cleanup old backups."
        
        # Count remaining backups
        BACKUP_COUNT=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "????????-??????" | wc -l)
        success "Cleanup completed. $BACKUP_COUNT backups retained."
    fi
}

# Verify backup integrity
verify_backup() {
    log "🔍 Verifying backup integrity..."
    
    # Check database backup
    if [ -f "$BACKUP_PATH/database/verein-db-$BACKUP_DATE.bak.gz" ]; then
        if gzip -t "$BACKUP_PATH/database/verein-db-$BACKUP_DATE.bak.gz" 2>/dev/null; then
            success "Database backup integrity verified."
        else
            error "Database backup is corrupted."
        fi
    fi
    
    # Check manifest file
    if [ -f "$BACKUP_PATH/backup-manifest.json" ]; then
        if python3 -m json.tool "$BACKUP_PATH/backup-manifest.json" > /dev/null 2>&1; then
            success "Backup manifest is valid."
        else
            warning "Backup manifest has invalid JSON format."
        fi
    fi
    
    # Check total backup size
    BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
    log "Total backup size: $BACKUP_SIZE"
}

# Create backup summary
create_summary() {
    log "📊 Creating backup summary..."
    
    cat > "$BACKUP_PATH/backup-summary.txt" << EOF
========================================
Verein Application Backup Summary
========================================

Backup Date: $BACKUP_DATE
Backup Type: Full
Retention Period: $RETENTION_DAYS days
Backup Location: $BACKUP_PATH

Components Backed Up:
✓ Database (SQL Server)
✓ Application Configurations
✓ Application Logs (7 days)
✓ Uploaded Files
✓ Monitoring Data (Prometheus & Grafana)

Backup Files:
$(find "$BACKUP_PATH" -type f -exec ls -lh {} \; | awk '{print "  " $9 " (" $5 ")"}')

System Information:
- Hostname: $(hostname)
- OS: $(uname -s) $(uname -r)
- Docker: $(docker --version)
- Docker Compose: $(docker-compose --version)

Next Backup: $(date -d "+1 day" '+%Y-%m-%d %H:%M:%S')
Retention Until: $(date -d "+$RETENTION_DAYS days" '+%Y-%m-%d %H:%M:%S')

========================================
Backup completed successfully!
========================================
EOF
    
    success "Backup summary created."
}

# Display backup information
display_backup_info() {
    log "📋 Backup Information:"
    echo ""
    echo "📍 Backup Location: $BACKUP_PATH"
    echo "📊 Backup Size: $(du -sh "$BACKUP_PATH" | cut -f1)"
    echo "📝 Backup Log: $LOG_FILE"
    echo "📅 Backup Date: $BACKUP_DATE"
    echo "⏰ Retention: $RETENTION_DAYS days"
    echo ""
    echo "📁 Backup Contents:"
    echo "  - Database: $(ls -la "$BACKUP_PATH/database/" | wc -l) files"
    echo "  - Configurations: $(ls -la "$BACKUP_PATH/configs/" | wc -l) files"
    echo "  - Logs: $(ls -la "$BACKUP_PATH/logs/" | wc -l) files"
    echo "  - Monitoring: $(ls -la "$BACKUP_PATH/monitoring/" 2>/dev/null | wc -l) files"
    echo ""
    success "Backup completed successfully! 🎉"
}

# Main backup function
main() {
    local backup_type=${1:-full}
    
    log "🚀 Starting Verein Application Backup ($backup_type)..."
    
    check_prerequisites
    setup_backup_dir
    
    case "$backup_type" in
        "full")
            backup_database
            backup_configs
            backup_logs
            backup_uploads
            backup_monitoring
            ;;
        "database")
            backup_database
            ;;
        "configs")
            backup_configs
            ;;
        "logs")
            backup_logs
            ;;
        *)
            error "Unknown backup type: $backup_type. Use: full, database, configs, logs"
            ;;
    esac
    
    create_manifest
    verify_backup
    create_summary
    cleanup_old_backups
    display_backup_info
    
    success "🎉 Backup process completed successfully!"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi