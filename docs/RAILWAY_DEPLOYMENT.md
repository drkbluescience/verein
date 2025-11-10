# 🚂 Railway Deployment Rehberi

**Tarih:** 2025-11-10  
**Platform:** Railway.app  
**Proje:** Verein API

---

## 📋 Hazırlık

### Gereksinimler
- Railway hesabı (ücretsiz 5$/ay kredi)
- GitHub hesabı
- Git kurulu

---

## 🚀 Deployment Adımları

### 1. Railway Hesabı Oluştur

1. [Railway.app](https://railway.app) adresine git
2. "Start a New Project" tıkla
3. GitHub ile giriş yap

### 2. Yeni Proje Oluştur

```bash
# Railway CLI yükle (opsiyonel)
npm install -g @railway/cli

# Login (opsiyonel)
railway login
```

### 3. GitHub'dan Deploy Et

**Railway Dashboard'da:**

1. **"New Project"** tıkla
2. **"Deploy from GitHub repo"** seç
3. **Repository seç:** `drkbluescience/verein`
4. **"Deploy Now"** tıkla

Railway otomatik olarak:
- ✅ `Dockerfile` dosyasını bulacak
- ✅ `railway.json` konfigürasyonunu okuyacak
- ✅ Build yapacak
- ✅ Deploy edecek

### 4. Environment Variables Ekle

Railway Dashboard → Settings → Variables:

```env
ASPNETCORE_ENVIRONMENT=Production
PORT=8080
```

**Not:** Connection string zaten `appsettings.Production.json` içinde tanımlı (Azure SQL Server).

### 5. Domain Ayarları

Railway otomatik bir domain verecek:
```
https://verein-api-production.up.railway.app
```

**Custom domain eklemek için:**
1. Settings → Domains
2. "Generate Domain" veya "Custom Domain" ekle

---

## 🔧 Deployment Sonrası

### 1. API URL'ini Kopyala

Railway'den aldığınız URL'yi not edin:
```
https://your-project-name.up.railway.app
```

### 2. Frontend'i Güncelle

`verein-web/.env.production` dosyasını düzenle:
```env
REACT_APP_API_URL=https://your-project-name.up.railway.app
```

### 3. Frontend'i Yeniden Build Et

```bash
cd verein-web
npm run build
```

### 4. cPanel'e Yeniden Yükle

1. `build/` klasörünün içeriğini cPanel'e yükle
2. Tarayıcıda test et

---

## ✅ Test

### API Health Check
```bash
curl https://your-project-name.up.railway.app/health
```

Beklenen yanıt:
```
Healthy
```

### API Swagger (Production'da kapalı)
Production'da Swagger kapalı. Test için endpoint'leri direkt çağırın:

```bash
# Vereine listesi
curl https://your-project-name.up.railway.app/api/vereine

# Login test
curl -X POST https://your-project-name.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmet.yilmaz@email.com","password":"Test123!"}'
```

---

## 🔍 Logs ve Monitoring

### Railway Dashboard'da Logs

1. Project → Deployments
2. Son deployment'a tıkla
3. "View Logs" tıkla

### CLI ile Logs

```bash
railway logs
```

---

## 🛠️ Sorun Giderme

### Build Hatası

**Hata:** `Dockerfile not found`
- **Çözüm:** `railway.json` dosyasında `dockerfilePath: "Dockerfile"` olduğundan emin ol

**Hata:** `dotnet restore failed`
- **Çözüm:** `VereinsApi.csproj` dosyasının doğru path'te olduğundan emin ol

### Runtime Hatası

**Hata:** `Database connection failed`
- **Çözüm:** Azure SQL Server firewall ayarlarını kontrol et
- Railway IP'lerini Azure SQL Server firewall'a ekle

**Hata:** `CORS error`
- **Çözüm:** `appsettings.Production.json` → `CorsSettings` → `AllowedOrigins` kontrol et

### Health Check Başarısız

```bash
# Logs kontrol et
railway logs

# Environment variables kontrol et
railway variables
```

---

## 💰 Maliyet

**Ücretsiz Tier:**
- ✅ 5$/ay kredi
- ✅ 500 saat/ay çalışma süresi
- ✅ 100 GB network
- ✅ 1 GB RAM

**Tahmini Kullanım:**
- Küçük trafik: ~2-3$/ay
- Orta trafik: ~5-8$/ay

---

## 🔄 Güncelleme

### Otomatik Deployment

Railway GitHub ile entegre. Her push'ta otomatik deploy olur:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Railway otomatik olarak:
1. Yeni commit'i algılar
2. Build yapar
3. Deploy eder
4. Health check yapar

### Manuel Deployment

Railway Dashboard → Deployments → "Redeploy"

---

## 📊 Monitoring

### Railway Dashboard

- **CPU Usage:** Gerçek zamanlı CPU kullanımı
- **Memory Usage:** RAM kullanımı
- **Network:** Gelen/giden trafik
- **Deployments:** Deployment geçmişi

### Alerts

Settings → Notifications → Email/Slack entegrasyonu

---

## 🔐 Güvenlik

### JWT Secret

Production'da güvenli bir secret key kullanılıyor:
```json
"SecretKey": "VereinsApiProductionSecretKey2024!@#Railway$%^&*()_+VeryLongAndSecureKey987654321ABCDEF"
```

**Önemli:** Bu key'i Railway environment variable olarak da ekleyebilirsiniz:
```bash
railway variables set JWT_SECRET="your-secret-key"
```

### Database Connection

Azure SQL Server connection string `appsettings.Production.json` içinde.

**Güvenlik için:** Connection string'i Railway environment variable'a taşıyın:
```bash
railway variables set ConnectionStrings__DefaultConnection="Server=..."
```

---

## 📞 Destek

**Railway Dokümantasyon:** https://docs.railway.app  
**Railway Discord:** https://discord.gg/railway  
**Railway Status:** https://status.railway.app

---

## ✨ Sonraki Adımlar

1. ✅ API Railway'de deploy edildi
2. ⏳ Frontend'i güncelle (.env.production)
3. ⏳ Frontend'i yeniden build et
4. ⏳ cPanel'e yükle
5. ⏳ Test et

**Başarılar!** 🎉

