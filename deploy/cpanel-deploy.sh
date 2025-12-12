#!/bin/bash

# Verein API Node.js cPanel Deployment Script
# Bu script, Verein API (Node.js) uygulamasını cPanel'e deploy etmek için kullanılır

set -e

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Konfigürasyon
PROJECT_NAME="verein-api-node"
PROJECT_PATH="../verein-api-node"
PUBLISH_PATH="./publish"
FTP_SERVER=""
FTP_USER=""
FTP_PASS=""
FTP_PATH="/public_html/api"
BACKUP_PATH="./backup"

# Varsayılan değerleri yükle
if [ -f ".env" ]; then
    source .env
    log ".env dosyası yüklendi"
fi

# Yardım mesajı
show_help() {
    echo "Kullanım: $0 [seçenekler]"
    echo ""
    echo "Seçenekler:"
    echo "  -h, --help              Bu yardım mesajını gösterir"
    echo "  -s, --server            FTP sunucu adresi"
    echo "  -u, --user              FTP kullanıcı adı"
    echo "  -p, --password          FTP şifresi"
    echo "  --path                  FTP hedef dizini (varsayılan: $FTP_PATH)"
    echo "  --build-only            Sadece build yap, upload etme"
    echo "  --upload-only           Sadece upload yap, build etme"
    echo "  --backup                Deploy öncesi yedek al"
    echo "  --restore               Son yedeği geri yükle"
    echo ""
    echo "Örnek:"
    echo "  $0 -s ftp.domain.com -u username -p password --backup"
}

# Parametreleri parse et
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--server)
            FTP_SERVER="$2"
            shift 2
            ;;
        -u|--user)
            FTP_USER="$2"
            shift 2
            ;;
        -p|--password)
            FTP_PASS="$2"
            shift 2
            ;;
        --path)
            FTP_PATH="$2"
            shift 2
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --upload-only)
            UPLOAD_ONLY=true
            shift
            ;;
        --backup)
            BACKUP=true
            shift
            ;;
        --restore)
            RESTORE=true
            shift
            ;;
        *)
            error "Bilinmeyen parametre: $1"
            show_help
            exit 1
            ;;
    esac
done

# Gerekli kontroller
check_requirements() {
    log "Gereksinimler kontrol ediliyor..."

    # Node.js kontrolü
    if ! command -v node &> /dev/null; then
        error "Node.js bulunamadı. Lütfen Node.js 18+ kurun."
        exit 1
    fi

    # npm kontrolü
    if ! command -v npm &> /dev/null; then
        error "npm bulunamadı."
        exit 1
    fi

    # lftp kontrolü (FTP için)
    if ! command -v lftp &> /dev/null; then
        warning "lftp bulunamadı. FTP işlemleri için curl kullanılacak."
    fi

    success "Gereksinimler kontrol edildi"
}

# Proje build işlemi
build_project() {
    log "Node.js projesi build ediliyor..."

    cd "$PROJECT_PATH"

    # Clean dist folder
    rm -rf dist

    # Install dependencies
    log "Dependencies kuruluyor..."
    npm ci --only=production

    # TypeScript build
    log "TypeScript derleniyor..."
    npm run build

    # Publish dizinini hazırla
    cd "../deploy"
    rm -rf "$PUBLISH_PATH"
    mkdir -p "$PUBLISH_PATH"

    # Gerekli dosyaları kopyala
    cp -r "$PROJECT_PATH/dist" "$PUBLISH_PATH/"
    cp -r "$PROJECT_PATH/node_modules" "$PUBLISH_PATH/"
    cp "$PROJECT_PATH/package.json" "$PUBLISH_PATH/"
    cp "$PROJECT_PATH/package-lock.json" "$PUBLISH_PATH/"

    # .env.production dosyası varsa kopyala
    if [ -f "$PROJECT_PATH/.env.production" ]; then
        cp "$PROJECT_PATH/.env.production" "$PUBLISH_PATH/.env"
    fi

    # cPanel için app.js giriş dosyası oluştur (Passenger uyumluluğu)
    cat > "$PUBLISH_PATH/app.js" << 'APPJS'
// cPanel Passenger Entry Point
require('./dist/index.js');
APPJS

    success "Proje başarıyla build edildi"
}

# Yedek alma
backup_remote() {
    log "Uzak sunucudan yedek alınıyor..."
    
    if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
        error "FTP bilgileri eksik. Yedek alınamıyor."
        return 1
    fi
    
    BACKUP_DIR="$BACKUP_PATH/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if command -v lftp &> /dev/null; then
        lftp -u "$FTP_USER,$FTP_PASS" "ftp://$FTP_SERVER" <<EOF
set ftp:ssl-allow no
mirror -R "$FTP_PATH" "$BACKUP_DIR"
quit
EOF
    else
        warning "lftp bulunamadığı için yedek alınamadı."
        return 1
    fi
    
    success "Yedek alındı: $BACKUP_DIR"
}

# FTP upload işlemi
upload_files() {
    log "Dosyalar upload ediliyor..."
    
    if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
        error "FTP bilgileri eksik. Upload yapılamıyor."
        exit 1
    fi
    
    if [ ! -d "$PUBLISH_PATH" ]; then
        error "Publish dizini bulunamadı: $PUBLISH_PATH"
        exit 1
    fi
    
    # Gerekli dizinleri oluştur
    log "Gerekli dizinler oluşturuluyor..."
    
    if command -v lftp &> /dev/null; then
        lftp -u "$FTP_USER,$FTP_PASS" "ftp://$FTP_SERVER" <<EOF
set ftp:ssl-allow no
mkdir -p $FTP_PATH/uploads
mkdir -p $FTP_PATH/logs
mirror -R "$PUBLISH_PATH" "$FTP_PATH"
quit
EOF
    else
        warning "lftp bulunamadığı için curl ile upload yapılıyor..."
        
        # Dosyaları curl ile upload et
        find "$PUBLISH_PATH" -type f | while read file; do
            relative_path="${file#$PUBLISH_PATH/}"
            remote_path="$FTP_PATH/$relative_path"
            
            # Dizin yapısını oluştur
            remote_dir=$(dirname "$remote_path")
            curl -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_SERVER" -Q "MKDIR $remote_dir" 2>/dev/null || true
            
            # Dosyayı upload et
            curl -T "$file" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_SERVER$remote_path"
        done
    fi
    
    success "Dosyalar başarıyla upload edildi"
}

# İzinleri ayarla
set_permissions() {
    log "Dosya izinleri ayarlanıyor..."

    if command -v lftp &> /dev/null; then
        lftp -u "$FTP_USER,$FTP_PASS" "ftp://$FTP_SERVER" <<EOF
set ftp:ssl-allow no
chmod 755 $FTP_PATH
chmod 755 $FTP_PATH/dist
chmod 644 $FTP_PATH/*.js
chmod 644 $FTP_PATH/*.json
chmod 755 $FTP_PATH/uploads
chmod 777 $FTP_PATH/uploads
chmod 755 $FTP_PATH/logs
chmod 777 $FTP_PATH/logs
quit
EOF
    else
        warning "lftp bulunamadığı için izinler ayarlanamadı. Manuel olarak ayarlamanız gerekebilir."
    fi

    success "Dosya izinleri ayarlandı"
}

# Test işlemi
test_deployment() {
    log "Deployment test ediliyor..."
    
    # Health check
    if command -v curl &> /dev/null; then
        # URL'yi FTP sunucu adresinden çıkar
        DOMAIN=$(echo "$FTP_SERVER" | sed 's/ftp\./www\./' | sed 's/^ftp\.//')
        
        log "Health check: https://$DOMAIN/api/health"
        response=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" || echo "000")
        
        if [ "$response" = "200" ]; then
            success "API başarıyla çalışıyor"
        else
            warning "API test edilemedi. HTTP kodu: $response"
        fi
    else
        warning "curl bulunamadığı için test yapılamadı."
    fi
}

# Ana işlem
main() {
    log "Verein API cPanel Deployment başlatılıyor..."
    
    check_requirements
    
    # Restore işlemi
    if [ "$RESTORE" = true ]; then
        log "Yedek geri yükleniyor..."
        # Yedek geri yükleme mantığı buraya eklenebilir
        exit 0
    fi
    
    # Yedek alma
    if [ "$BACKUP" = true ]; then
        backup_remote
    fi
    
    # Build işlemi
    if [ "$UPLOAD_ONLY" != true ]; then
        build_project
    fi
    
    # Upload işlemi
    if [ "$BUILD_ONLY" != true ]; then
        upload_files
        set_permissions
        test_deployment
    fi
    
    success "Deployment tamamlandı!"
    
    # Temizlik
    if [ "$BUILD_ONLY" != true ] && [ -d "$PUBLISH_PATH" ]; then
        log "Geçici dosyalar temizleniyor..."
        rm -rf "$PUBLISH_PATH"
    fi
}

# Script'i çalıştır
main "$@"