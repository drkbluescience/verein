# 🚀 Verein Projesi - Ücretsiz Deployment Rehberi

**Tarih:** 2025-11-06  
**Durum:** Docker + Ücretsiz Cloud Hosting

---

## 📋 İçindekiler

1. [Lokal Docker Test](#1-lokal-docker-test)
2. [Fly.io Deployment (ÖNERİLEN)](#2-flyio-deployment-önerilen)
3. [Railway.app Deployment](#3-railwayapp-deployment)
4. [Render.com Deployment](#4-rendercom-deployment)
5. [cPanel Static Hosting](#5-cpanel-static-hosting)

---

## 🎯 Deployment Seçenekleri Karşılaştırması

| Platform | Frontend | Backend | Database | Maliyet | Zorluk |
|----------|----------|---------|----------|---------|--------|
| **Fly.io** | ✅ | ✅ | ✅ MSSQL Docker | Ücretsiz* | Orta |
| **Railway** | ✅ | ✅ | ✅ MSSQL Docker | 5$/ay kredi | Kolay |
| **Render** | ✅ | ✅ | ❌ (PostgreSQL) | Ücretsiz | Kolay |
| **cPanel + VPS** | ✅ | ❌ | ❌ | ~5€/ay | Zor |

*Fly.io: 3 GB volume + 160 GB transfer ücretsiz

---

## 1️⃣ Lokal Docker Test

Önce her şeyin lokal'de çalıştığından emin olalım:

### Adım 1: Environment Dosyası Oluştur

```bash
# .env dosyası oluştur
cp .env.example .env

# Şifreyi güvenli bir şeyle değiştir
nano .env
```

`.env` içeriği:
```env
MSSQL_SA_PASSWORD=YourStrong@Passw0rd123!
```

### Adım 2: Docker Compose ile Başlat

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servislerin durumunu kontrol et
docker-compose ps
```

### Adım 3: Veritabanını Hazırla

```bash
# MSSQL container'a bağlan
docker exec -it verein-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123!'

# SQL komutları:
# 1> CREATE DATABASE VEREIN;
# 2> GO
# 3> EXIT

# Schema'yı yükle
docker exec -i verein-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123!' < docs/APPLICATION_H_101.sql

# Demo data'yı yükle
docker exec -i verein-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123!' -d VEREIN < docs/COMPLETE_DEMO_DATA.sql
```

### Adım 4: Test Et

```bash
# API health check
curl http://localhost:5103/health

# Frontend
open http://localhost:3000

# Swagger (Development modunda)
open http://localhost:5103
```

---

## 2️⃣ Fly.io Deployment (ÖNERİLEN) ⭐

### Neden Fly.io?
- ✅ Docker Compose tam desteği
- ✅ MSSQL container çalıştırabilir
- ✅ 3 GB persistent volume (ücretsiz)
- ✅ Otomatik HTTPS
- ✅ Global CDN

### Adım 1: Fly.io Hesabı Oluştur

```bash
# Fly CLI yükle (macOS)
brew install flyctl

# Giriş yap
flyctl auth login

# Kredi kartı ekle (ücret alınmaz, doğrulama için)
flyctl auth signup
```

### Adım 2: Fly.io Konfigürasyonu

`fly.toml` dosyası oluştur:

```toml
# fly.toml
app = "verein-app"
primary_region = "fra"  # Frankfurt

[build]
  dockerfile = "Dockerfile.flyio"

[env]
  ASPNETCORE_ENVIRONMENT = "Production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[mounts]
  source = "verein_data"
  destination = "/data"
```

### Adım 3: Multi-Stage Dockerfile

`Dockerfile.flyio` oluştur:

```dockerfile
# MSSQL + API + Frontend hepsi bir arada
FROM mcr.microsoft.com/mssql/server:2022-latest AS mssql-base

# .NET API Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /src
COPY verein-api/ .
RUN dotnet publish -c Release -o /app/api

# React Build
FROM node:18-alpine AS web-build
WORKDIR /app
COPY verein-web/ .
RUN npm ci && npm run build

# Final Image
FROM mcr.microsoft.com/mssql/server:2022-latest
WORKDIR /app

# .NET Runtime yükle
RUN apt-get update && apt-get install -y \
    wget \
    apt-transport-https \
    && wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y aspnetcore-runtime-8.0 nginx \
    && rm -rf /var/lib/apt/lists/*

# API kopyala
COPY --from=api-build /app/api /app/api

# Frontend kopyala
COPY --from=web-build /app/build /usr/share/nginx/html

# Startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8080 1433

CMD ["/app/start.sh"]
```

`start.sh`:
```bash
#!/bin/bash
set -e

# MSSQL başlat
/opt/mssql/bin/sqlservr &

# MSSQL'in hazır olmasını bekle
sleep 30

# Veritabanını oluştur
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "CREATE DATABASE VEREIN"

# API başlat
cd /app/api
dotnet VereinsApi.dll &

# Nginx başlat
nginx -g 'daemon off;'
```

### Adım 4: Deploy Et

```bash
# Volume oluştur
flyctl volumes create verein_data --size 3 --region fra

# Deploy
flyctl deploy

# Secrets ekle
flyctl secrets set MSSQL_SA_PASSWORD="YourStrong@Passw0rd123!"

# Logları izle
flyctl logs

# URL'i aç
flyctl open
```

---

## 3️⃣ Railway.app Deployment

### Adım 1: Railway Hesabı

1. https://railway.app adresine git
2. GitHub ile giriş yap
3. 5$/ay ücretsiz kredi al

### Adım 2: Proje Oluştur

```bash
# Railway CLI yükle
npm i -g @railway/cli

# Giriş yap
railway login

# Proje oluştur
railway init

# GitHub repo'yu bağla
railway link
```

### Adım 3: Deploy

```bash
# Docker Compose ile deploy
railway up

# Environment variables ekle
railway variables set MSSQL_SA_PASSWORD="YourStrong@Passw0rd123!"

# Domain ekle
railway domain
```

---

## 4️⃣ Render.com Deployment

**NOT:** Render MSSQL desteklemiyor, PostgreSQL'e geçiş gerekir.

### Alternatif: Backend + Frontend Ayrı

**Backend (Render):**
```bash
# render.yaml
services:
  - type: web
    name: verein-api
    env: docker
    dockerfilePath: ./verein-api/Dockerfile
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
```

**Frontend (Vercel/Netlify):**
```bash
# Vercel
cd verein-web
vercel --prod

# Netlify
netlify deploy --prod --dir=build
```

---

## 5️⃣ cPanel Static Hosting (Sadece Frontend)

### Adım 1: Build Oluştur

```bash
cd verein-web
npm run build
```

### Adım 2: cPanel'e Yükle

1. cPanel → File Manager
2. `public_html` klasörüne git
3. `build/` içeriğini yükle
4. `.htaccess` ekle:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Adım 3: API URL Güncelle

`verein-web/.env.production`:
```env
REACT_APP_API_URL=https://your-api-domain.com
```

---

## 🔧 Sorun Giderme

### Docker Build Hatası

```bash
# Cache'i temizle
docker-compose down -v
docker system prune -a

# Tekrar build et
docker-compose up --build
```

### MSSQL Bağlantı Hatası

```bash
# Container loglarını kontrol et
docker logs verein-mssql

# Manuel bağlantı testi
docker exec -it verein-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourPassword'
```

### API Health Check Başarısız

```bash
# API loglarını kontrol et
docker logs verein-api

# Manuel test
curl -v http://localhost:5103/health
```

---

## 📊 Maliyet Karşılaştırması

| Senaryo | Aylık Maliyet | Özellikler |
|---------|---------------|------------|
| **Fly.io (Free Tier)** | 0€ | 3 GB volume, 160 GB transfer |
| **Railway (Free)** | 0€ (5$ kredi) | 500 saat/ay, 100 GB transfer |
| **Render + Vercel** | 0€ | Backend uyur (15 dk), Frontend CDN |
| **VPS (Hetzner)** | 4.5€ | Tam kontrol, sınırsız |

---

## ✅ Önerilen Strateji

### Başlangıç (0-100 kullanıcı):
```
Frontend → Vercel/Netlify (Ücretsiz)
Backend + DB → Fly.io (Ücretsiz)
```

### Büyüme (100-1000 kullanıcı):
```
Frontend → Vercel (Ücretsiz)
Backend → Railway ($5-10/ay)
Database → Railway MSSQL Container
```

### Production (1000+ kullanıcı):
```
Frontend → Vercel/Cloudflare Pages
Backend → VPS (Hetzner 4.5€/ay)
Database → Managed MSSQL (Azure/AWS)
```

---

## 🚀 Hızlı Başlangıç

```bash
# 1. Lokal test
docker-compose up -d

# 2. Fly.io deploy
flyctl launch
flyctl deploy

# 3. Domain ekle
flyctl certs add yourdomain.com

# 4. Veritabanını yükle
flyctl ssh console
# SQL scriptlerini çalıştır
```

---

## 📞 Destek

Sorun yaşarsanız:
1. `docker-compose logs` kontrol edin
2. GitHub Issues açın
3. Discord/Slack kanalına yazın

**Son Güncelleme:** 2025-11-06  
**Versiyon:** 1.0

