# Verein API cPanel Deployment

Verein API projesinin cPanel üzerinde yayınlanması için gerekli tüm dosyalar ve belgeler.

## 📁 Dosya Yapısı

```
verein/
├── docs/
│   ├── CPANEL_DEPLOYMENT_REHBERI.md    # Detaylı deployment rehberi
│   └── CPANEL_HIZLI_BASLANGIC.md       # Hızlı başlangıç kılavuzu
├── deploy/
│   ├── cpanel-deploy.sh               # Otomatik deployment script'i
│   └── .env.example                   # Ortam değişkenleri şablonu
└── verein-api/
    ├── web.config                     # IIS konfigürasyon dosyası
    └── appsettings.Production.json    # Production ayarları
```

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler

- cPanel hesabı (.NET 8.0 desteği)
- FTP/SFTP erişimi
- SQL Server veya MySQL veritabanı

### 2. Kurulum

```bash
# 1. Deployment script'ini indir
curl -O https://raw.githubusercontent.com/your-repo/verein/main/deploy/cpanel-deploy.sh
chmod +x cpanel-deploy.sh

# 2. Konfigürasyon dosyasını oluştur
cp deploy/.env.example deploy/.env

# 3. .env dosyasını düzenle
nano deploy/.env

# 4. Deployment çalıştır
./cpanel-deploy.sh --backup
```

### 3. Test

```bash
# API testi
curl https://siteniz.com/api/health

# Swagger UI testi
curl https://siteniz.com/api/swagger

# Swagger JSON testi
curl https://siteniz.com/api/swagger/v1/swagger.json
```

## 📚 Belgeler

- [Detaylı Deployment Rehberi](docs/CPANEL_DEPLOYMENT_REHBERI.md)
- [Hızlı Başlangıç Kılavuzu](docs/CPANEL_HIZLI_BASLANGIC.md)

## 🛠️ Script Kullanımı

### Temel Komutlar

```bash
# Tam deployment (build + upload + test)
./cpanel-deploy.sh

# Sadece build yap
./cpanel-deploy.sh --build-only

# Sadece upload yap
./cpanel-deploy.sh --upload-only

# Yedek alarak deployment yap
./cpanel-deploy.sh --backup

# Yardım
./cpanel-deploy.sh --help
```

### Parametreler

| Parametre | Açıklama |
|-----------|----------|
| `-s, --server` | FTP sunucu adresi |
| `-u, --user` | FTP kullanıcı adı |
| `-p, --password` | FTP şifresi |
| `--path` | FTP hedef dizini |
| `--build-only` | Sadece build yap |
| `--upload-only` | Sadece upload yap |
| `--backup` | Yedek al |
| `--restore` | Yedek geri yükle |

## 🔧 Konfigürasyon

### .env Dosyası

```bash
# FTP Bağlantı Bilgileri
FTP_SERVER="ftp.domain.com"
FTP_USER="username"
FTP_PASS="password"

# FTP Hedef Dizini
FTP_PATH="/public_html/api"

# Domain Bilgisi
DOMAIN="domain.com"
```

### appsettings.Production.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=verein_api_db;User Id=user;Password=pass;TrustServerCertificate=true;MultipleActiveResultSets=true;Encrypt=false;"
  },
  "AllowedHosts": "*",
  "ApiSettings": {
    "EnableSwagger": true,
    "EnableDetailedErrors": false
  }
}
```

## 🎯 Özellikler

### ✅ Otomatik Deployment

- Proje build ve publish
- FTP upload
- Dosya izinleri ayarlama
- Health check testi
- Yedek alma/geri yükleme

### ✅ Güvenlik

- HTTPS yönlendirmesi
- Security headers
- CORS konfigürasyonu
- JWT kimlik doğrulama
- Dosya yükleme güvenliği

### ✅ Performans

- Response compression
- Static file caching
- Memory caching
- Database connection pooling

### ✅ İzleme

- Serilog loglama
- Health checks
- Error handling
- Performance monitoring

## 🚨 Sorun Giderme

### Yaygın Sorunlar

1. **500 Internal Server Error**
   - Logları kontrol et: `public_html/api/logs/`
   - web.config'i kontrol et

2. **Veritabanı Bağlantı Hatası**
   - Bağlantı string'ini kontrol et
   - Veritabanı izinlerini kontrol et

3. **CORS Hatası**
   - AllowedOrigins listesini güncelle
   - Frontend URL'sini ekle

4. **Dosya Yükleme Hatası**
   - uploads/ dizininin izinlerini kontrol et
   - Disk alanını kontrol et

### Hızlı Çözümler

```bash
# Logları kontrol et
tail -f public_html/api/logs/verein-api-.txt

# İzinleri düzelt
chmod 755 public_html/api/
chmod 777 public_html/api/uploads/

# Yeniden başlat
touch public_html/api/web.config
```

## 📊 Monitoring

### Health Check

```bash
# API health check
curl https://siteniz.com/api/health

# Detaylı health check
curl -X GET https://siteniz.com/api/health/detailed
```

### Log Monitoring

```bash
# Real-time log izleme
tail -f public_html/api/logs/verein-api-.txt

# Error logları
grep "ERROR" public_html/api/logs/verein-api-.txt
```

## 🔄 CI/CD

### GitHub Actions

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      run: |
        curl -O https://raw.githubusercontent.com/your-repo/verein/main/deploy/cpanel-deploy.sh
        chmod +x cpanel-deploy.sh
        ./cpanel-deploy.sh
```

## 📱 Mobil Uyum

API mobil cihazlarla tam uyumludur:

- HTTPS zorunlu
- Responsive API responses
- JWT token desteği
- CORS mobil uyumlu

## 🎉 Başarılı Deployment

Deployment başarılı olduğunda:

- ✅ API `https://siteniz.com/api` adresinde çalışır
- ✅ Swagger UI `https://siteniz.com/api/swagger` erişilebilir
- ✅ Swagger JSON `https://siteniz.com/api/swagger/v1/swagger.json` erişilebilir
- ✅ Health check `https://siteniz.com/api/health` çalışır
- ✅ Veritabanı bağlantısı aktif
- ✅ Dosya yükleme çalışır
- ✅ JWT kimlik doğrulama aktif

## 📞 Destek

Sorun yaşarsanız:

1. [Detaylı Rehberi](docs/CPANEL_DEPLOYMENT_REHBERI.md) inceleyin
2. [Hızlı Başlangıç](docs/CPANEL_HIZLI_BASLANGIC.md) kılavuzunu takip edin
3. Logları kontrol edin
4. Health check yapın

---

**Verein API** cPanel deployment hazır! 🚀