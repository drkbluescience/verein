# Verein Application Production Deployment Guide
# Üye Finans Sayfası Production Deploy Rehberi

## 📋 İçerdekiler

1. [Genel Bakış](#genel-bakış)
2. [Sistem Gereksinimleri](#sistem-gereksinimleri)
3. [Kurulum Adımları](#kurulum-adımları)
4. [Konfigürasyon](#konfigürasyon)
5. [Deploy İşlemi](#deploy-işlemi)
6. [Monitoring](#monitoring)
7. [Sorun Giderme](#sorun-giderme)
8. [Bakım ve Güncelleme](#bakım-ve-güncelleme)

## 🎯 Genel Bakış

Bu rehber, Verein uygulamasının production ortamına deploy edilmesi için gerekli adımları içerir. Üye finans sayfası performans optimizasyonları tamamlanmış ve production için hazır hale getirilmiştir.

### 🚀 Optimizasyon Özellikleri

- **Backend Sorgu Optimizasyonu**: 3 ayrı sorgudan tek sorguya indirgeme
- **Frontend React Query**: Caching ve infinite scroll
- **Veritabanı Index'leri**: 20+ performans index'i
- **Caching Stratejisi**: 5 dakika backend cache
- **Pagination**: Lazy loading ve virtual scrolling
- **Monitoring**: Prometheus ve Grafana entegrasyonu

## 🖥️ Sistem Gereksinimleri

### Minimum Gereksinimler
- **CPU**: 4 core
- **Memory**: 8GB RAM
- **Storage**: 50GB SSD
- **Network**: 100 Mbps
- **OS**: Linux (Ubuntu 20.04+) veya Windows Server 2019+

### Tavsiye Edilen
- **CPU**: 8 core
- **Memory**: 16GB RAM
- **Storage**: 100GB SSD
- **Network**: 1 Gbps
- **OS**: Linux (Ubuntu 22.04 LTS)

### Yazılım Gereksinimleri
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **SSL Sertifikası** (production için)

## 📦 Kurulum Adımları

### 1. Repository Klonlama

```bash
git clone https://github.com/your-org/verein.git
cd verein
```

### 2. Environment Konfigürasyonu

```bash
cd deploy
cp .env.production.example .env.production
```

### 3. Environment Variables Düzenleme

`.env.production` dosyasını düzenleyin:

```bash
nano .env.production
```

**Önemli Değişkenler:**
- `DB_PASSWORD`: Güçlü veritabanı şifresi
- `JWT_SECRET_KEY`: Güçlü JWT anahtarı
- `GRAFANA_PASSWORD`: Grafana admin şifresi
- `REACT_APP_API_URL`: Production API URL

### 4. SSL Sertifikası Kurulumu

#### Let's Encrypt ile SSL (Tavsiye Edilen)

```bash
# Certbot kurulumu
sudo apt update
sudo apt install certbot

# SSL sertifikası alma
sudo certbot certonly --standalone -d yourdomain.com

# Sertifikaları kopyalama
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
```

#### Kendi Sertifikanız

```bash
mkdir -p ssl
# Sertifika dosyalarını ssl/ dizinine kopyalayın
```

### 5. Firewall Konfigürasyonu

```bash
# Gerekli portları açma
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp  # API
sudo ufw allow 3000/tcp  # Web
sudo ufw allow 9090/tcp  # Prometheus
sudo ufw allow 3001/tcp  # Grafana

# Firewall'ı etkinleştirme
sudo ufw enable
```

## ⚙️ Konfigürasyon

### Environment Variables

| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `DB_CONNECTION_STRING` | Veritabanı bağlantı dizesi | `Server=database,1433;...` |
| `JWT_SECRET_KEY` | JWT imzalama anahtarı | `YourSuperSecretKey...` |
| `CACHE_EXPIRATION_MINUTES` | Cache süresi (dakika) | `5` |
| `ENABLE_QUERY_LOGGING` | Sorgu loglama | `false` |
| `SLOW_QUERY_THRESHOLD_MS` | Yavaş sorgu eşiği | `500` |

### Docker Compose Konfigürasyonu

`production-deploy.yml` dosyası aşağıdaki servisleri içerir:

- **verein-api**: ASP.NET Core API
- **verein-web**: React frontend (nginx)
- **database**: SQL Server 2022
- **redis-cache**: Redis cache
- **prometheus**: Monitoring
- **grafana**: Dashboard

### Veritabanı Konfigürasyonu

Production veritabanı için:

```sql
-- Veritabanı kullanıcı oluşturma
CREATE LOGIN verein_app WITH PASSWORD = 'StrongPassword123!';
CREATE USER verein_app FOR LOGIN verein_app;
ALTER ROLE db_datareader ADD MEMBER verein_app;
ALTER ROLE db_datawriter ADD MEMBER verein_app;
```

## 🚀 Deploy İşlemi

### 1. Otomatik Deploy Script'i

```bash
cd deploy
chmod +x deploy.sh
./deploy.sh
```

### 2. Manuel Deploy

```bash
# Environment variables yükleme
source .env.production

# Docker Compose ile deploy
docker-compose -f production-deploy.yml down
docker-compose -f production-deploy.yml pull
docker-compose -f production-deploy.yml build --no-cache
docker-compose -f production-deploy.yml up -d

# Servislerin başlamasını bekle
sleep 60

# Health check
curl -f http://localhost:5000/health
curl -f http://localhost:3000/health
```

### 3. Veritabanı Migrasyonları

```bash
# Performance index'leri uygulama
docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "$DB_PASSWORD" \
    -i "/tmp/PERFORMANCE_INDEXES.sql"

# Production tablolarını oluşturma
docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "$DB_PASSWORD" \
    -i "/tmp/production-init.sql"
```

## 📊 Monitoring

### Prometheus Metrics

Endpoint: `http://localhost:9090`

**Önemli Metrikler:**
- `http_request_duration_seconds`: API yanıt süresi
- `database_query_duration_seconds`: Veritabanı sorgu süresi
- `process_resident_memory_bytes`: Memory kullanımı
- `process_cpu_seconds_total`: CPU kullanımı

### Grafana Dashboard

Endpoint: `http://localhost:3001`

- **Kullanıcı Adı**: `admin`
- **Şifre**: `.env.production` dosyasında tanımlı

**Dashboard'lar:**
- **Verein Performance Dashboard**: Genel performans metrikleri
- **Database Performance**: Veritabanı performansı
- **Application Health**: Uygulama sağlığı

### Alert Kuralları

**Önemli Alert'ler:**
- API yanıt süresi > 1 saniye
- Veritabanı sorgu süresi > 500ms
- Memory kullanımı > 1GB
- CPU kullanımı > 80%
- Hata oranı > 5%

## 🔧 Sorun Giderme

### Yaygın Sorunlar

#### 1. Servis Başlamıyor

```bash
# Log kontrolü
docker-compose -f production-deploy.yml logs verein-api
docker-compose -f production-deploy.yml logs verein-web

# Container durumu
docker-compose -f production-deploy.yml ps
```

#### 2. Veritabanı Bağlantı Hatası

```bash
# Veritabanı bağlantı testi
docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "$DB_PASSWORD" \
    -Q "SELECT 1"

# Connection string kontrolü
echo $DB_CONNECTION_STRING
```

#### 3. Performance Sorunları

```bash
# Veritabanı index'leri kontrolü
docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "$DB_PASSWORD" \
    -Q "SELECT name, type_desc FROM sys.indexes WHERE object_id = OBJECT_ID('MitgliedForderung')"

# Cache durumu
docker exec verein-redis-prod redis-cli info stats
```

#### 4. SSL Sertifikası Sorunları

```bash
# Sertifika geçerliliği kontrolü
openssl x509 -in ssl/fullchain.pem -text -noout

# Nginx konfigürasyon testi
docker exec verein-web-prod nginx -t
```

### Log Konumları

- **Application Logs**: `docker logs verein-api-prod`
- **Web Logs**: `docker logs verein-web-prod`
- **Database Logs**: `docker logs verein-db-prod`
- **Deploy Log**: `deploy/deploy-*.log`

## 🔍 Bakım ve Güncelleme

### Günlük Bakım

```bash
# Log temizliği (30 günden eski)
docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "$DB_PASSWORD" \
    -Q "EXEC production.sp_CleanupOldLogs @RetentionDays = 30"

# Container temizliği
docker system prune -f
```

### Haftalık Bakım

```bash
# Yedekleme
./backup.sh

# Güncelleme kontrolü
docker-compose -f production-deploy.yml pull

# Performans analizi
curl -s http://localhost:9090/api/v1/query?query=up
```

### Güncelleme İşlemi

```bash
# Yedekleme
./backup.sh

# Güncelleme
git pull origin main
./deploy.sh

# Veritabanı migrasyonları
./migrate.sh

# Health check
./health-check.sh
```

### Yedekleme Stratejisi

```bash
# Otomatik yedekleme (cron)
0 2 * * * /path/to/verein/deploy/backup.sh

# Manuel yedekleme
./backup.sh --full
```

## 📈 Performans İpuçları

### 1. Veritabanı Optimizasyonu

```sql
-- Sorgu planı analizi
SET SHOWPLAN_TEXT ON;
GO
SELECT * FROM MitgliedForderung WHERE MitgliedId = 1;
GO

-- Index kullanım kontrolü
SELECT 
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    user_seeks, user_scans, user_lookups, user_updates
FROM sys.dm_db_index_usage_stats us
JOIN sys.indexes i ON us.object_id = i.object_id AND us.index_id = i.index_id
WHERE OBJECT_NAME(i.object_id) = 'MitgliedForderung';
```

### 2. Cache Optimizasyonu

```bash
# Redis cache durumu
docker exec verein-redis-prod redis-cli info memory
docker exec verein-redis-prod redis-cli info stats

# Cache temizleme
docker exec verein-redis-prod redis-cli FLUSHDB
```

### 3. Application Monitoring

```bash
# Real-time metrics
curl -s http://localhost:9090/api/v1/query?query=rate(http_requests_total[5m])

# Error rate
curl -s http://localhost:9090/api/v1/query?query=rate(http_requests_total{status=~"5.."}[5m])
```

## 🚨 Acil Durum Prosedürleri

### Servis Kesintisi

1. **Durum Tespiti**
   ```bash
   docker-compose -f production-deploy.yml ps
   docker-compose -f production-deploy.yml logs --tail=100
   ```

2. **Hızlı Çözüm**
   ```bash
   # Servis yeniden başlatma
   docker-compose -f production-deploy.yml restart verein-api
   
   # Cache temizleme
   docker exec verein-redis-prod redis-cli FLUSHALL
   ```

3. **Rollback**
   ```bash
   # Önceki versiyona dönme
   git checkout previous-tag
   ./deploy.sh
   ```

### Veritabanı Sorunları

1. **Yedekten Geri Yükleme**
   ```bash
   # Son yedekten geri yükleme
   docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
       -S localhost -U sa -P "$DB_PASSWORD" \
       -Q "RESTORE DATABASE VereinDB FROM DISK = '/tmp/backup.bak' WITH REPLACE"
   ```

2. **Veritabanı Onarımı**
   ```bash
   # Veritabanı bütünlük kontrolü
   docker exec verein-db-prod /opt/mssql-tools/bin/sqlcmd \
       -S localhost -U sa -P "$DB_PASSWORD" \
       -Q "DBCC CHECKDB (VereinDB)"
   ```

## 📞 Destek

### İletişim
- **Teknik Destek**: support@verein.com
- **Acil Durum**: emergency@verein.com
- **Documentation**: https://docs.verein.com

### Monitoring Dashboard'ları
- **Production**: https://monitoring.verein.com
- **Staging**: https://staging-monitoring.verein.com

---

**Not**: Bu rehber production ortamı için hazırlanmıştır. Test ortamında deploy işlemi için `staging-deploy.yml` dosyasını kullanın.

**Son Güncelleme**: 8 Aralık 2025
**Versiyon**: v1.0