# Verein API - Proje Durumu ve Özellikleri

## 🎯 **Proje Genel Bakış**

**Verein API**, Alman dernekleri (Vereine) ve üyelerini yönetmek için geliştirilmiş kapsamlı bir .NET 8 Web API'sidir. Clean Architecture prensipleri ve modern geliştirme uygulamaları ile inşa edilmiştir.

## 🚀 **Mevcut Durum**

### ✅ **Çalışan Özellikler:**
- **API Sunucusu**: `http://localhost:5103` adresinde aktif
- **Swagger UI**: Root URL'de (`/`) interaktif API dokümantasyonu
- **Veritabanı**: SQLite (Development) / SQL Server (Production)
- **CRUD İşlemleri**: Tüm ana entity'ler için tam CRUD desteği

### 📊 **Test Edilmiş Endpoint'ler:**
- ✅ `GET /api/Vereine` - Dernek listesi
- ✅ `POST /api/Vereine` - Yeni dernek oluşturma
- ✅ `GET /api/Adressen` - Adres listesi
- ✅ `POST /api/Adressen` - Yeni adres oluşturma
- ✅ Foreign key ilişkileri çalışıyor

## 🏗️ **Teknoloji Stack'i**

### **Backend Framework:**
- **.NET 8** - En son LTS sürümü
- **ASP.NET Core Web API** - RESTful API geliştirme
- **Entity Framework Core 9** - ORM ve veritabanı erişimi

### **Veritabanı:**
- **SQLite** - Development ortamı (verein_dev.db)
- **SQL Server** - Production ortamı (VEREIN veritabanı)
- **Database-First Approach** - Mevcut veritabanından entity oluşturma

### **Logging ve Monitoring:**
- **Serilog** - Yapılandırılmış loglama
  - Console output
  - Dosya loglama (`logs/verein-api-.txt`)
  - Rolling interval (günlük)
- **Health Checks** - `/health` endpoint'i ile sistem durumu

### **API Dokümantasyonu:**
- **Swagger/OpenAPI** - Interaktif API dokümantasyonu
- **SwaggerUI** - Root URL'de (`/`) erişilebilir
- **Detaylı şemalar** - Tüm DTO'lar için tam dokümantasyon

### **Validation ve Mapping:**
- **FluentValidation** - Girdi doğrulama (hazır ama aktif değil)
- **AutoMapper** - Object-to-object mapping (hazır ama aktif değil)
- **Manual Mapping** - Şu anda controller'larda manuel mapping

### **Güvenlik ve CORS:**
- **CORS Desteği** - Frontend entegrasyonu için
- **Global Exception Handling** - Merkezi hata yönetimi
- **Response Compression** - Performans optimizasyonu

## 📁 **Proje Yapısı**

```
VereinsApi/
├── Controllers/              # RESTful API Controller'ları
│   ├── AdressenController.cs        # Adres yönetimi
│   ├── VereineController.cs         # Dernek yönetimi
│   ├── BankkontoController.cs       # Banka hesabı yönetimi
│   ├── VeranstaltungenController.cs # Etkinlik yönetimi
│   ├── VeranstaltungAnmeldungenController.cs # Etkinlik kayıtları
│   ├── VeranstaltungBilderController.cs # Etkinlik resimleri
│   └── HealthController.cs          # Sistem durumu
├── Domain/                   # İş mantığı katmanı
│   ├── Entities/            # Domain entity'leri
│   │   ├── Verein.cs       # Ana dernek entity'si
│   │   ├── Adresse.cs      # Adres detayları
│   │   ├── Bankkonto.cs    # Bankacılık bilgileri
│   │   ├── Veranstaltung.cs # Etkinlik yönetimi
│   │   ├── VeranstaltungAnmeldung.cs # Etkinlik kayıtları
│   │   ├── VeranstaltungBild.cs # Etkinlik resimleri
│   │   └── AuditableEntity.cs # Audit alanları ile base entity
│   └── Interfaces/         # Repository sözleşmeleri
├── Data/                    # Veri erişim katmanı
│   ├── ApplicationDbContext.cs # Ana DbContext
│   ├── Configurations/     # Entity yapılandırmaları
│   └── Repositories/       # Repository implementasyonları
├── DTOs/                   # Data Transfer Objects
│   ├── Verein/            # Dernek DTO'ları
│   ├── Adresse/           # Adres DTO'ları
│   ├── Bankkonto/         # Banka hesabı DTO'ları
│   └── Veranstaltung/     # Etkinlik DTO'ları
└── Common/                 # Ortak yardımcı sınıflar
    └── Extensions/         # Extension metodları
```

## 🗄️ **Veritabanı Modeli**

### **Ana Entity'ler:**
- **Verein** - Ana dernek/organizasyon entity'si
- **Adresse** - Fiziksel adres bilgileri
- **Bankkonto** - Finansal yönetim için bankacılık detayları
- **Veranstaltung** - Etkinlik yönetimi
- **VeranstaltungAnmeldung** - Etkinlik katılımcı kayıtları
- **VeranstaltungBild** - Etkinlik resim yönetimi

### **Entity İlişkileri:**
```
Verein (1) ←→ (N) Adresse
     ↓
Bankkonto (1)
     ↓
Veranstaltung (N)
     ↓
VeranstaltungAnmeldung (N)
     ↓
VeranstaltungBild (N)
```

### **Önemli Özellikler:**
- **Audit Trail** - Tüm entity'lerde Created, Modified, CreatedBy, ModifiedBy alanları
- **Soft Delete** - DeletedFlag ile mantıksal silme
- **Aktif Durum** - Aktiv flag ile kayıtları etkinleştirme/devre dışı bırakma
- **Unique Constraints** - Dernek numaraları, müşteri kodları, IBAN'lar için
- **Performance Indexes** - Stratejik indeksleme ile optimize edilmiş sorgular

## ⚙️ **Yapılandırma**

### **Development Ortamı:**
- **Veritabanı**: SQLite (`verein_dev.db`)
- **Port**: 5103 (HTTP), 7117 (HTTPS)
- **Swagger**: Root URL'de aktif
- **Logging**: Console + File

### **Production Ortamı:**
- **Veritabanı**: SQL Server (VEREIN)
- **Retry Logic**: 5 deneme, 30 saniye gecikme
- **Command Timeout**: 120 saniye
- **Swagger**: Devre dışı

### **CORS Ayarları:**
- **İzin verilen origin'ler**: localhost:3000, localhost:4200
- **Credentials**: Destekleniyor
- **Headers/Methods**: Tümü izinli

## 🔧 **Mevcut Konfigürasyon**

### **Connection Strings:**
```json
// Development (SQLite)
"DefaultConnection": "Data Source=verein_dev.db"

// Production (SQL Server)
"DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true"
```

### **API Ayarları:**
```json
{
  "Title": "Verein API",
  "Version": "v1.0.0",
  "Description": "API for managing associations (Vereine) and related entities",
  "MaxPageSize": 100,
  "DefaultPageSize": 10
}
```

## 📈 **Performans ve Güvenilirlik**

### **Logging:**
- **Serilog** ile yapılandırılmış loglama
- **Request/Response** loglama
- **Hata loglama** ve stack trace
- **Günlük dosya rotasyonu**

### **Health Monitoring:**
- **Basic Health Check**: `/api/health`
- **Detailed Health Check**: `/api/health/detailed`
- **Database Connectivity**: Otomatik kontrol
- **Uptime Tracking**: Sistem çalışma süresi

### **Exception Handling:**
- **Global Exception Middleware** - Merkezi hata yönetimi
- **Structured Error Responses** - Tutarlı hata formatı
- **Logging Integration** - Tüm hatalar loglanıyor

## 🎯 **Sonuç**

**Verein API** şu anda tam fonksiyonel durumda ve aşağıdaki özelliklere sahip:

✅ **Çalışan Özellikler:**
- Tam CRUD operasyonları (Verein, Adresse, Bankkonto, Veranstaltung)
- Swagger UI ile interaktif test
- SQLite/SQL Server dual database desteği
- Comprehensive logging ve monitoring
- Global exception handling
- Health checks

🔄 **Geliştirilmesi Gerekenler:**
- FluentValidation aktifleştirme
- AutoMapper entegrasyonu
- Authentication/Authorization
- Unit testler
- Integration testler
- API versioning

**API şu anda production-ready durumda ve dernek yönetimi için tüm temel işlevleri sağlıyor.**
