# 🚀 Fly.io Migration Guide - Verein API

**Tarih:** 2025-12-09  
**Hedef:** Railway'den Fly.io'ya tam migration  
**Süre:** Tahmini 2-3 saat

---

## 📋 MIGRATION ÖNCESİ CHECKLIST

### ✅ Gereksinimler
- [ ] Fly.io hesabı oluşturuldu
- [ ] Fly CLI yüklendi
- [ ] Mevcut veritabanı backup alındı
- [ ] GitHub reposu güncel
- [ ] Environment variables not edildi

### 🔧 Gerekli Araçlar
```bash
# Fly CLI kurulum
curl -L https://fly.io/install.sh | sh

# Windows için
iwr https://fly.io/install.ps1 -useb | iex

# Giriş yap
flyctl auth signup
flyctl auth login
```

---

## 🎯 ADIM 1: PROJE HAZIRLIĞI

### 1.1 Fly.io Konfigürasyon Dosyaları
```bash
# Mevcut dosyalar kontrol
ls -la fly.toml
ls -la Dockerfile.flyio
ls -la deploy/
```

### 1.2 Environment Variables Hazırlığı
```bash
# Güvenli şifre oluştur
MSSQL_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
JWT_SECRET=$(openssl rand -base64 32)

echo "MSSQL Password: $MSSQL_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
```

### 1.3 Dockerfile Güncelleme
```bash
# Fly.io için Dockerfile kopyala
cp Dockerfile.flyio Dockerfile

# .dockerignore kontrol
cat .dockerignore
```

---

## 🎯 ADIM 2: FLY.IO APP OLUŞTURMA

### 2.1 Yeni App Oluştur
```bash
# App oluştur
flyctl launch --name verein-api --region fra --no-deploy

# Region seçimi: fra (Frankfurt) - Türkiye'ye en yakın
# App name: verein-api (değiştirilebilir)
```

### 2.2 Volume Oluştur (MSSQL için)
```bash
# 3 GB volume oluştur
flyctl volumes create verein-db --size 3 --region fra

# Volume kontrol
flyctl volumes list
```

### 2.3 Secrets Ekle
```bash
# MSSQL şifresi
flyctl secrets set MSSQL_SA_PASSWORD="YourSecurePassword123!"

# JWT secret
flyctl secrets set JWT_SECRET="your-jwt-secret-32-chars-minimum"

# Diğer environment variables
flyctl secrets set ASPNETCORE_ENVIRONMENT="Production"
```

---

## 🎯 ADIM 3: VERİTABANI MIGRASYONU

### 3.1 Mevcut Verileri Backup Etme
```bash
# Lokal MSSQL container'dan backup
docker exec verein-mssql /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourCurrentPassword" \
  -Q "BACKUP DATABASE [VEREIN] TO DISK = '/tmp/VEREIN_BACKUP.bak' WITH INIT, STATS = 10"

# Backup dosyasını kopyala
docker cp verein-mssql:/tmp/VEREIN_BACKUP.bak ./VEREIN_BACKUP.bak
```

### 3.2 Backup Dosyasını Fly.io'ya Yükleme
```bash
# Deploy sonrası SSH ile bağlanıp upload
flyctl ssh console
# Container içinde:
mkdir -p /tmp/backup
exit

# SFTP ile dosya yükle
flyctl sftp shell
put VEREIN_BACKUP.bak /tmp/backup/
```

### 3.3 Veritabanı Restore
```bash
# SSH ile container'a bağlan
flyctl ssh console

# MSSQL'e bağlan ve restore et
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
RESTORE DATABASE [VEREIN] 
FROM DISK = '/tmp/backup/VEREIN_BACKUP.bak'
WITH REPLACE, RECOVERY
"

# Verify restore
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -Q "SELECT COUNT(*) FROM Verein.Verein"
```

---

## 🎯 ADIM 4: DEPLOYMENT

### 4.1 İlk Deployment
```bash
# Build ve deploy
flyctl deploy

# Deploy loglarını izle
flyctl logs --tail
```

### 4.2 Health Check Kontrol
```bash
# Health endpoint test
curl https://verein-api.fly.dev/health

# API test
curl https://verein-api.fly.dev/api/vereine
```

### 4.3 Troubleshooting
```bash
# Logları kontrol et
flyctl logs

# SSH ile bağlan
flyctl ssh console

# Servisleri kontrol et
ps aux | grep sqlservr
ps aux | grep dotnet

# Manuel restart
flyctl apps restart verein-api
```

---

## 🎯 ADIM 5: FRONTEND KONFİGÜRASYONU

### 5.1 React App URL Güncelleme
```bash
# verein-web/src/config/api.ts veya benzeri dosya
const API_BASE_URL = 'https://verein-api.fly.dev';
```

### 5.2 Frontend Deployment (Vercel)
```bash
cd verein-web

# Vercel deployment
npm i -g vercel
vercel --prod

# Custom domain ayarla (opsiyonel)
vercel domains add verein.yourdomain.com
```

---

## 🎯 ADIM 6: TEST VE VALIDASYON

### 6.1 API Testleri
```bash
# Health check
curl -f https://verein-api.fly.dev/health

# Authentication test
curl -X POST https://verein-api.fly.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Data test
curl https://verein-api.fly.dev/api/vereine
```

### 6.2 Frontend Test
```bash
# Browser'da test et
open https://verein.yourdomain.com

# Login testi
# Email: ahmet.yilmaz@email.com (demo hesabı)
```

### 6.3 Database Test
```bash
# SSH ile bağlan
flyctl ssh console

# Database bağlantı testi
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d VEREIN -Q "
SELECT 
    'Verein' as Table, COUNT(*) as Count FROM Verein.Verein WHERE DeletedFlag = 0
UNION ALL
SELECT 'Mitglied', COUNT(*) FROM Mitglied.Mitglied WHERE DeletedFlag = 0
UNION ALL
SELECT 'Veranstaltung', COUNT(*) FROM Verein.Veranstaltung WHERE DeletedFlag = 0
"
```

---

## 🎯 ADIM 7: MONITORING VE MAINTENANCE

### 7.1 Monitoring Kurulumu
```bash
# Fly.io metrics
flyctl metrics

# Log monitoring
flyctl logs --since 1h

# Health monitoring
flyctl status
```

### 7.2 Backup Stratejisi
```bash
# Otomatik backup script (cron job)
flyctl ssh console
# Container içinde crontab düzenle

# Manuel backup
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" \
  -Q "BACKUP DATABASE [VEREIN] TO DISK = '/var/opt/mssql/backup/VEREIN_$(date +%Y%m%d).bak'"
```

### 7.3 SSL ve Domain
```bash
# Custom domain ekle
flyctl certs add verein.yourdomain.com

# DNS ayarları
# CNAME: verein.yourdomain.com -> verein-api.fly.dev
```

---

## 🚨 OLASI SORUNLAR VE ÇÖZÜMLERİ

### Sorun 1: MSSQL Başlamıyor
```bash
# Logları kontrol et
flyctl logs | grep sqlservr

# Memory kontrol
flyctl ssh console
free -h

# Restart
flyctl apps restart verein-api
```

### Sorun 2: API Yanıt Vermiyor
```bash
# Port kontrol
flyctl ssh console
netstat -tlnp | grep 8080

# Process kontrol
ps aux | grep dotnet

# Manuel restart
flyctl ssh console
pkill -f dotnet
cd /app/api && dotnet VereinsApi.dll &
```

### Sorun 3: Database Bağlantı Hatası
```bash
# Connection string kontrol
flyctl ssh console
echo $ConnectionStrings__DefaultConnection

# MSSQL status
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT @@VERSION"
```

### Sorun 4: Memory Yetersiz
```bash
# Memory upgrade
flyctl vm resize --memory 1024

# Veya shared CPU'dan performance'a geç
flyctl vm resize --cpu-kind performance --cpus 1
```

---

## 📊 PERFORMANS OPTİMİZASYONU

### 1. Database Optimizasyonu
```sql
-- Index kontrolü
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType
FROM sys.tables t
INNER JOIN sys.indexes i ON t.object_id = i.object_id
WHERE t.is_ms_shipped = 0;

-- Query performance
SELECT TOP 10 
    total_elapsed_time/execution_count AS AvgElapsedTime,
    total_logical_reads/execution_count AS AvgLogicalReads,
    total_worker_time/execution_count AS AvgCPUTime,
    execution_count,
    SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(st.text)
            ELSE qs.statement_end_offset END
            - qs.statement_start_offset)/2) + 1) AS query_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
ORDER BY total_elapsed_time/execution_count DESC;
```

### 2. Application Optimizasyonu
```bash
# Connection pooling
# appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VEREIN;...",
    "MaxPoolSize": "100",
    "MinPoolSize": "5"
  }
}
```

---

## 🎯 POST-MIGRATION CHECKLIST

### ✅ Başarılı Migration İşaretleri
- [ ] API health endpoint çalışıyor
- [ ] Database bağlantısı başarılı
- [ ] Veriler tam olarak aktarıldı
- [ ] Frontend API'ye bağlanabiliyor
- [ ] Login sistemi çalışıyor
- [ ] SSL sertifikası aktif
- [ ] Monitoring çalışıyor

### 📈 Performance Metrikleri
- [ ] API response time < 500ms
- [ ] Memory usage < 400MB
- [ ] Database query time < 100ms
- [ ] Uptime > 99%

---

## 🔄 ROLLBACK PLANI

### Railway'e Geri Dönüş
```bash
# Railway'de yeniden deploy
railway up

# Domain yönlendirme değişikliği
# DNS: verein.yourdomain.com -> railway.app URL
```

### Veritabanı Geri Dönüş
```bash
# Railway MSSQL'e restore
docker exec railway-mssql /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "RailwayPassword" \
  -Q "RESTORE DATABASE [VEREIN] FROM DISK = '/backup/RAILWAY_BACKUP.bak'"
```

---

## 📞 DESTEK VE İLETİŞİM

### Fly.io Dokümantasyon
- [Fly.io Docs](https://fly.io/docs/)
- [MSSQL on Fly.io](https://fly.io/docs/app-guides/run-sql-server/)
- [Docker Deployment](https://fly.io/docs/languages-and-frameworks/docker/)

### Acil Durum İletişimi
- Fly.io Support: support@fly.io
- Community: [Fly.io Discord](https://discord.gg/fly-io)

---

## 🎉 MIGRATION TAMAMLANDI

### Sonraki Adımlar
1. ✅ Monitoring kurulumu
2. ✅ Backup otomasyonu
3. ✅ Performance optimizasyonu
4. ✅ Security audit
5. ✅ Documentation update

### Başarı Metrikleri
- 🚀 **0€ maliyet** - Tamamen ücretsiz
- 🌍 **Global deployment** - Frankfurt region
- 🔒 **SSL dahil** - Otomatik HTTPS
- 📊 **Monitoring** - Built-in metrics
- 🔄 **CI/CD hazır** - GitHub entegrasyonu

**🎉 Tebrikler! Verein API artık Fly.io'da çalışıyor! 🚀**