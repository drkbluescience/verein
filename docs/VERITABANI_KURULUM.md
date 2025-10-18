# Veritabanı Kurulum Rehberi

Bu rehber, VEREIN uygulaması için SQL Server veritabanını sıfırdan kurmanız için gerekli adımları içerir.

## 📋 Gereksinimler

- SQL Server (LocalDB, Express, veya Standard)
- SQL Server Management Studio (SSMS) veya Azure Data Studio

## 🚀 Kurulum Adımları

### 1. Veritabanı Schema'sını Oluşturun

İlk olarak veritabanı yapısını oluşturun:

```sql
-- SQL Server Management Studio'da:
1. SSMS'i açın
2. File → Open → File
3. docs/APPLICATION_H_101.sql dosyasını seçin
4. Execute (F5) tuşuna basın
```

Bu script şunları oluşturur:
- ✅ VEREIN veritabanı
- ✅ Tüm tablolar (Verein, Mitglied, Veranstaltung, vb.)
- ✅ Foreign key ilişkileri
- ✅ Indexler
- ✅ Stored procedure'ler

### 2. Demo Verilerini Ekleyin

Veritabanı oluşturulduktan sonra demo verileri ekleyin:

```sql
-- SQL Server Management Studio'da:
1. File → Open → File
2. docs/DEMO_DATA.sql dosyasını seçin
3. Execute (F5) tuşuna basın
```

Bu script şunları ekler:
- ✅ 2 Dernek (München, Berlin)
- ✅ 5 Üye
- ✅ 4 Etkinlik

### 3. Demo Hesapları Test Edin

Demo veriler eklendikten sonra şu hesaplarla giriş yapabilirsiniz:

| Email | Rol | Dernek |
|-------|-----|--------|
| `ahmet.yilmaz@email.com` | Dernek Yöneticisi | TDKV München |
| `fatma.ozkan@email.com` | Üye | TDKV München |
| `mehmet.demir@email.com` | Dernek Yöneticisi | DTF Berlin |

**Not:** Şu anda şifre kontrolü yok, sadece email ile giriş yapılıyor.

## 📁 SQL Dosyaları

### 1. `APPLICATION_H_101.sql` ⭐ ZORUNLU
- **Amaç:** Veritabanı schema'sını oluşturur
- **Ne zaman çalıştırılır:** İlk kurulumda (bir kez)
- **İçerik:** Tablolar, ilişkiler, indexler
- **Sıra:** 1. adım

### 2. `DEMO_DATA.sql` ⭐ ZORUNLU
- **Amaç:** Tüm demo/test verileri ekler
- **Ne zaman çalıştırılır:** Schema oluşturulduktan sonra
- **İçerik:**
  - Otomatik temizlik (eski demo verileri)
  - Keytable verileri (Geschlecht, MitgliedStatus, MitgliedTyp)
  - 2 Dernek (München, Berlin)
  - 8 Üye (5 temel + 3 aile üyesi)
  - 4 Etkinlik
  - 8 Aile ilişkisi (Fatma Özkan ailesi)
- **Sıra:** 2. adım
- **Not:** Tekrar çalıştırılabilir (otomatik temizlik yapar)

### 3. `TEMIZLE_DEMO_DATA.sql` 🔹 OPSİYONEL
- **Amaç:** Sadece demo verilerini temizler
- **Ne zaman çalıştırılır:** Demo verilerini silmek istediğinizde
- **İçerik:** Tüm demo verileri için DELETE komutları
- **Not:** DEMO_DATA.sql zaten otomatik temizlik yapıyor

## 🔄 Veritabanını Sıfırlama

Veritabanını sıfırdan oluşturmak isterseniz:

```sql
-- 1. Mevcut veritabanını silin
USE master;
GO
DROP DATABASE IF EXISTS [VEREIN];
GO

-- 2. APPLICATION_H_101.sql'i çalıştırın
-- 3. DEMO_DATA.sql'i çalıştırın
```

## ⚠️ Önemli Notlar

### Kod İçinde Seed Data YOK

Artık demo veriler **kod içinde değil**, **SQL dosyalarında** saklanıyor:

- ❌ **ESKİ:** `SeedData.cs` dosyasında C# kodu
- ✅ **YENİ:** `DEMO_DATA.sql` dosyasında SQL script

### Backend Otomatik Seed Yapmıyor

`Program.cs` dosyasında seed logic kaldırıldı:

```csharp
// ❌ ESKİ KOD (kaldırıldı):
await SeedData.SeedAsync(context);

// ✅ YENİ KOD:
// Demo data is now managed via SQL scripts (docs/DEMO_DATA.sql)
```

### Neden Bu Değişiklik?

1. **Tutarlılık:** Tüm veritabanı işlemleri SQL dosyalarında
2. **Kontrol:** SQL Studio ile kolay yönetim
3. **Esneklik:** Production'da seed data çalışmaz
4. **Şeffaflık:** Veriler kod içinde gizli değil

## 🎯 Hızlı Başlangıç

```bash
# 1. SQL Server'ı başlatın
# 2. SSMS'i açın
# 3. Şu dosyaları SIRAYLA çalıştırın:

1️⃣ docs/APPLICATION_H_101.sql    # Veritabanı schema (sadece ilk kurulumda)
2️⃣ docs/DEMO_DATA.sql            # Tüm demo veriler (dernekler, üyeler, etkinlikler, aile ilişkileri)
```

**Bu kadar!** Artık uygulamayı test edebilirsiniz.

## 📊 Veritabanı Yapısı

```
VEREIN
├── Verein (Dernekler)
├── Mitglied (Üyeler)
├── Veranstaltung (Etkinlikler)
├── VeranstaltungAnmeldung (Etkinlik Kayıtları)
├── MitgliedFamilie (Aile İlişkileri)
└── ... (diğer tablolar)
```

## 🔍 Kontrol Sorguları

### Dernekleri Görüntüle
```sql
SELECT Id, Name, Kurzname, Email
FROM Verein
WHERE DeletedFlag = 0;
```

### Üyeleri Görüntüle
```sql
SELECT Id, Vorname, Nachname, Email, VereinId
FROM Mitglied
WHERE DeletedFlag = 0;
```

### Etkinlikleri Görüntüle
```sql
SELECT Id, Titel, Startdatum, Preis, AnmeldeErforderlich
FROM Veranstaltung
WHERE DeletedFlag = 0
ORDER BY Startdatum;
```

## 🆘 Sorun Giderme

### "Database already exists" Hatası
```sql
-- Mevcut veritabanını silin
DROP DATABASE [VEREIN];
-- Sonra tekrar çalıştırın
```

### "Invalid object name" Hatası
```sql
-- Doğru veritabanını seçtiğinizden emin olun
USE [VEREIN];
GO
```

### Demo Veriler Görünmüyor
```sql
-- Demo verileri kontrol edin
SELECT COUNT(*) FROM Verein;
SELECT COUNT(*) FROM Mitglied;
SELECT COUNT(*) FROM Veranstaltung;

-- Eğer 0 ise, DEMO_DATA.sql'i çalıştırın
```

## 📞 Destek

Sorun yaşarsanız:
1. SQL Server'ın çalıştığından emin olun
2. SSMS'de doğru sunucuya bağlandığınızdan emin olun
3. Script'leri sırayla çalıştırdığınızdan emin olun

---

**Son Güncelleme:** 2025-01-13  
**Versiyon:** 1.0

