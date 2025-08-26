# Veritabanı Bağlantısı Rehberi

## 🔍 Mevcut Durum

### API Şu Anda Hangi Veritabanını Kullanıyor?

**Development Ortamında (şu anki durum):**
- **Veritabanı Türü**: SQLite
- **Dosya Konumu**: `VereinsApi/verein_dev.db`
- **Connection String**: `"Data Source=verein_dev.db"`
- **SQL Studio ile İlişkisi**: ❌ YOK

**Production Ortamında:**
- **Veritabanı Türü**: SQL Server
- **Veritabanı Adı**: VEREIN
- **Connection String**: `"Server=localhost;Database=VEREIN;Trusted_Connection=true"`
- **SQL Studio ile İlişkisi**: ✅ VAR

## 📋 Yapılandırma Dosyaları

### 1. appsettings.Development.json (Aktif)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=verein_dev.db"
  }
}
```

### 2. appsettings.json (Production)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true"
  }
}
```

## 🔧 SQL Server'a Nasıl Geçilir?

### Yöntem 1: Environment Değiştir
```bash
# PowerShell'de
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet run --project VereinsApi
```

### Yöntem 2: Development Ayarını Değiştir
`appsettings.Development.json` dosyasını şu şekilde değiştir:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VEREIN;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;"
  }
}
```

## 📊 Veritabanı İçeriğini Kontrol Etme

### SQLite Veritabanını Kontrol Et (Mevcut)
```bash
# SQLite komut satırı ile
sqlite3 VereinsApi/verein_dev.db
.tables
SELECT * FROM Adresse LIMIT 5;
.quit
```

### SQL Server Veritabanını Kontrol Et
SQL Studio'da:
```sql
USE VEREIN;
SELECT * FROM Adresse;
SELECT * FROM Verein;
```

## 🎯 Hangi Veritabanının Kullanıldığını Anlama

### 1. API Loglarını Kontrol Et
API başlatıldığında şu mesajları ara:
- SQLite: `"Data Source=verein_dev.db"`
- SQL Server: `"Server=localhost;Database=VEREIN"`

### 2. Swagger'da Test Et
- `GET /api/Adressen` endpoint'ini çalıştır
- Dönen veriler SQLite'dan mı SQL Server'dan mı geliyor kontrol et

### 3. Veritabanı Dosyasını Kontrol Et
```bash
# Eğer bu dosya varsa SQLite kullanılıyor
ls VereinsApi/verein_dev.db
```

## ⚠️ Önemli Notlar

### SQLite (Development)
- ✅ Hızlı geliştirme
- ✅ Kurulum gerektirmez
- ❌ SQL Studio ile uyumlu değil
- ❌ Sınırlı özellikler

### SQL Server (Production)
- ✅ SQL Studio ile uyumlu
- ✅ Tam özellikli
- ✅ Gerçek production ortamı
- ❌ SQL Server kurulumu gerekli

## 🚀 Önerilen Adımlar

### Eğer SQL Studio'daki VEREIN veritabanını kullanmak istiyorsan:

1. **Environment'ı Production'a çevir:**
```bash
$env:ASPNETCORE_ENVIRONMENT="Production"
```

2. **API'yi yeniden başlat:**
```bash
dotnet run --project VereinsApi
```

3. **Bağlantıyı test et:**
- Swagger'da `GET /api/Adressen` çalıştır
- SQL Studio'daki verilerle karşılaştır

### Eğer SQLite ile devam etmek istiyorsan:

1. **SQLite Browser indir** (DB Browser for SQLite)
2. **verein_dev.db dosyasını aç**
3. **Tabloları ve verileri incele**

## 🔍 Troubleshooting

### "Failed to fetch" Hatası
- API çalışıyor mu kontrol et: `http://localhost:5103`
- Connection string doğru mu kontrol et
- Veritabanı erişilebilir mi kontrol et

### SQL Server Bağlantı Hatası
- SQL Server çalışıyor mu?
- VEREIN veritabanı var mı?
- Windows Authentication aktif mi?

### SQLite Dosya Hatası
- verein_dev.db dosyası var mı?
- Dosya izinleri doğru mu?
- Dosya bozuk mu?

## 📈 Veri Akışı

```
Swagger UI → API Controller → Repository → DbContext → Veritabanı
     ↓              ↓             ↓           ↓           ↓
  HTTP İstek    AdressenController  Repository  EF Core   SQLite/SQL Server
```

## 🎯 Sonuç

**Şu anda API SQLite kullanıyor, SQL Studio'daki VEREIN veritabanını değil!**

SQL Server'a geçmek için environment'ı Production'a çevir veya Development ayarlarını değiştir.
