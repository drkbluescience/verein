# Verein API cPanel Hızlı Başlangıç Kılavuzu

Bu kılavuz, Verein API'yi cPanel'e en hızlı şekilde yayınlamanız için adım adım talimatlar içerir.

## ⚡ 5 Dakikada Hızlı Kurulum

### 1. Ön Hazırlık (1 dakika)

```bash
# Deployment script'ini indirin
curl -O https://raw.githubusercontent.com/your-repo/verein/main/deploy/cpanel-deploy.sh
chmod +x cpanel-deploy.sh

# Ortam değişkenlerini yapılandırın
cp deploy/.env.example deploy/.env
```

### 2. Konfigürasyon (2 dakika)

[`deploy/.env`](deploy/.env) dosyasını düzenleyin:

```bash
# FTP bilgilerinizi girin
FTP_SERVER="ftp.siteniz.com"
FTP_USER="cpanel_kullanici"
FTP_PASS="sifreniz"

# Domain adresiniz
DOMAIN="siteniz.com"
```

### 3. Veritabanı (1 dakika)

cPanel'de hızlı veritabanı oluşturma:

1. **MySQL Databases** → **Create Database**
2. Veritabanı adı: `verein_api_db`
3. Kullanıcı adı: `verein_api_user`
4. Şifre: Güçlü bir şifre oluşturun
5. Kullanıcıya veritabanı yetkisi verin

### 4. API Konfigürasyonu (1 dakika)

[`verein-api/appsettings.Production.json`](verein-api/appsettings.Production.json) dosyasını güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=verein_api_db;User Id=verein_api_user;Password=OLUSTURDUGUNUZ_SIFRE;TrustServerCertificate=true;MultipleActiveResultSets=true;Encrypt=false;"
  }
}
```

### 5. Deployment (1 dakika)

```bash
# Deployment script'ini çalıştırın
./cpanel-deploy.sh --backup
```

## 🎯 Sonuç

API'niz şu adreste hazır olacak:
- **API URL**: `https://siteniz.com/api`
- **Swagger UI**: `https://siteniz.com/api/swagger`
- **Swagger JSON**: `https://siteniz.com/api/swagger/v1/swagger.json`
- **Health Check**: `https://siteniz.com/api/health`

## 🔧 Hızlı Test

```bash
# API testi
curl https://siteniz.com/api/health

# Swagger UI testi
curl https://siteniz.com/api/swagger

# Swagger JSON testi
curl https://siteniz.com/api/swagger/v1/swagger.json
```

## 🚨 Hızlı Sorun Çözümü

### En Yaygın Sorunlar

| Sorun | Çözüm |
|-------|-------|
| 500 Internal Server Error | `logs/verein-api-.txt` dosyasını kontrol edin |
| Veritabanı bağlantı hatası | Bağlantı string'ini kontrol edin |
| Dosya yükleme hatası | `uploads/` dizininin izinlerini kontrol edin |
| CORS hatası | `AllowedOrigins` listesini güncelleyin |

### Hızlı Komutlar

```bash
# Logları kontrol et
tail -f public_html/api/logs/verein-api-.txt

# İzinleri düzelt
chmod 755 public_html/api/
chmod 777 public_html/api/uploads/
chmod 777 public_html/api/logs/

# Yeniden başlat
touch public_html/api/web.config
```

## 📊 Performans İpuçları

### 1. Hız İçin

```json
// appsettings.Production.json
{
  "ApiSettings": {
    "EnableSwagger": false,
    "EnableDetailedErrors": false
  }
}
```

### 2. Güvenlik İçin

```json
// appsettings.Production.json
{
  "JwtSettings": {
    "SecretKey": "cok-guvenli-uzun-secret-key-buraya"
  }
}
```

### 3. CORS İçin

```json
// appsettings.Production.json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "https://siteniz.com",
      "https://www.siteniz.com"
    ]
  }
}
```

## 🔄 Otomatik Deployment

### GitHub Actions (1 dakika kurulum)

`.github/workflows/deploy.yml` dosyası oluşturun:

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
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 8.0.x
        
    - name: Deploy
      run: |
        curl -O https://raw.githubusercontent.com/your-repo/verein/main/deploy/cpanel-deploy.sh
        chmod +x cpanel-deploy.sh
        ./cpanel-deploy.sh --build-only
```

## 📱 Mobil Test

API'nizi mobil cihazlarda test etmek için:

```bash
# HTTPS zorunlu (mobil cihazlar için)
curl -k https://siteniz.com/api/health

# JWT token testi
curl -X POST https://siteniz.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'
```

## 🎉 Başarılı Deployment Kontrol Listesi

- [ ] API `https://siteniz.com/api/health` adresinde çalışıyor
- [ ] Swagger `https://siteniz.com/api/swagger` erişilebilir
- [ ] Veritabanı bağlantısı başarılı
- [ ] Dosya yükleme çalışıyor
- [ ] JWT kimlik doğrulama çalışıyor
- [ ] CORS ayarları doğru
- [ ] Loglama çalışıyor
- [ ] HTTPS yönlendirmesi aktif

## 🆘 Acil Durum Kurtarma

### API Çalışmıyorsa

```bash
# 1. Hızlı yeniden başlatma
touch public_html/api/web.config

# 2. Log kontrolü
cat public_html/api/logs/verein-api-.txt | tail -20

# 3. Veritabanı testi
curl -X POST https://siteniz.com/api/health \
  -H "Content-Type: application/json"
```

### Yedek Geri Yükleme

```bash
# Son yedeği geri yükle
./cpanel-deploy.sh --restore
```

## 📞 Destek

Sorun yaşarsanız:

1. **Logları kontrol edin**: `public_html/api/logs/`
2. **Health check yapın**: `https://siteniz.com/api/health`
3. **cPanel .NET ayarlarını kontrol edin**
4. **FTP izinlerini doğrulayın**

---

**Tebrikler!** Verein API'niz başarıyla cPanel üzerinde yayınlandı! 🎉

Şimdi frontend uygulamanızı bu API'ye bağlayabilirsiniz.