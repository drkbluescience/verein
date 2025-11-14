# Veritabanı Kurulum Rehberi

## 🎯 Hızlı Başlangıç

Veritabanını sıfırdan kurmak için bu adımları takip edin.

---

## 📋 Gereksinimler

- ✅ Azure SQL Database (veya SQL Server 2019+)
- ✅ sqlcmd veya Azure Data Studio
- ✅ Veritabanı bağlantı bilgileri

---

## 🚀 Kurulum Adımları

### **ADIM 1: Veritabanını Oluştur**

**Azure Portal'dan:**
1. Azure Portal'a giriş yap
2. SQL Database oluştur
3. Database adı: `VereinDB`
4. Server: `Verein08112025.database.windows.net`
5. Authentication: SQL Authentication
6. Username: `vereinsa`
7. Password: `[güvenli şifre]`

---

### **ADIM 2: Schema ve Tabloları Oluştur**

```bash
# Komut satırından:
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i database/APPLICATION_H_101_AZURE.sql
```

**Veya Azure Data Studio'dan:**
1. VereinDB'ye bağlan
2. `database/APPLICATION_H_101_AZURE.sql` dosyasını aç
3. Execute (F5)

**Bu script şunları oluşturur:**
- ✅ 10 Schema (Bank, Finanz, Keytable, Mitglied, Verein, Web, vb.)
- ✅ 50+ Tablo
- ✅ Foreign Key Constraints
- ✅ Indexes
- ✅ **YENİ:** [Web].[User] ve [Web].[UserRole] tabloları

---

### **ADIM 3: Demo Data Ekle (Opsiyonel)**

```bash
# User ve Role demo verilerini ekle:
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i database/USER_DEMO_DATA.sql
```

**Bu script şunları yapar:**
- ✅ Admin kullanıcı oluşturur (`admin@system.de`)
- ✅ Mevcut Mitglied kayıtlarını User tablosuna migrate eder
- ✅ Mitglied rollerini atar
- ✅ Dernek yöneticisi rollerini atar (Vorstandsvorsitzender)

---

### **ADIM 4: Keytable Verilerini Ekle**

```bash
# Lookup tablolarını doldur:
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i database/KEYTABLE_DATA.sql
```

**Bu script şunları ekler:**
- ✅ MitgliedTyp (VOLLMITGLIED, EHRENMITGLIED, vb.)
- ✅ MitgliedStatus (AKTIV, PASSIV, vb.)
- ✅ Geschlecht (MAENNLICH, WEIBLICH, DIVERS)
- ✅ Waehrung (EUR, USD, TRY)
- ✅ Diğer lookup tabloları

---

### **ADIM 5: Test Verilerini Ekle (Opsiyonel)**

```bash
# Tam demo verileri (Verein, Mitglied, Veranstaltung, vb.):
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i database/COMPLETE_DEMO_DATA.sql
```

---

## ✅ Doğrulama

### **1. Schema'ları Kontrol Et**

```sql
SELECT name FROM sys.schemas
WHERE name IN ('Bank', 'Finanz', 'Keytable', 'Mitglied', 'Verein', 'Web')
ORDER BY name
```

**Beklenen Sonuç:** 6 schema

---

### **2. User Tablosunu Kontrol Et**

```sql
SELECT 
    u.Id,
    u.Email,
    u.Vorname,
    u.Nachname,
    u.IsActive,
    COUNT(ur.Id) AS RoleCount
FROM [Web].[User] u
LEFT JOIN [Web].[UserRole] ur ON ur.UserId = u.Id AND ur.DeletedFlag = 0
WHERE u.DeletedFlag = 0
GROUP BY u.Id, u.Email, u.Vorname, u.Nachname, u.IsActive
ORDER BY u.Created DESC
```

**Beklenen Sonuç:** En az 1 kullanıcı (admin)

---

### **3. Rolleri Kontrol Et**

```sql
SELECT 
    RoleType,
    COUNT(*) AS Count
FROM [Web].[UserRole]
WHERE DeletedFlag = 0 AND IsActive = 1
GROUP BY RoleType
ORDER BY RoleType
```

**Beklenen Sonuç:**
- admin: 1
- dernek: X (Vorstandsvorsitzender sayısı)
- mitglied: Y (Mitglied sayısı)

---

## 🔧 Sorun Giderme

### **Hata: "Cannot open database"**

**Çözüm:**
1. Azure Portal'da database'in oluşturulduğunu kontrol et
2. Firewall kurallarını kontrol et (IP adresiniz izin listesinde mi?)
3. Bağlantı string'ini kontrol et

---

### **Hata: "Login failed for user"**

**Çözüm:**
1. Username ve password'ü kontrol et
2. SQL Authentication'ın aktif olduğunu kontrol et
3. Azure Portal'da kullanıcı izinlerini kontrol et

---

### **Hata: "Foreign key constraint failed"**

**Çözüm:**
1. Scriptleri sırayla çalıştır:
   - Önce `APPLICATION_H_101_AZURE.sql`
   - Sonra `KEYTABLE_DATA.sql`
   - Sonra `USER_DEMO_DATA.sql`
   - En son `COMPLETE_DEMO_DATA.sql`

---

## 📊 Veritabanı Yapısı

```
VereinDB
├── [Bank] Schema
│   └── BankKonto
├── [Finanz] Schema
│   ├── BankBuchung
│   ├── MitgliedForderung
│   └── MitgliedZahlung
├── [Keytable] Schema
│   ├── MitgliedTyp
│   ├── MitgliedStatus
│   ├── Geschlecht
│   └── Waehrung
├── [Mitglied] Schema
│   ├── Mitglied
│   ├── MitgliedAdresse
│   └── Familienbeziehung
├── [Verein] Schema
│   ├── Verein
│   ├── Veranstaltung
│   └── VeranstaltungAnmeldung
└── [Web] Schema ⭐ YENİ!
    ├── User
    └── UserRole
```

---

## 🎯 Sonraki Adımlar

1. ✅ **Backend:** AuthController'ı güncelle
2. ✅ **Backend:** UserService oluştur
3. ✅ **Backend:** Password hashing ekle
4. ✅ **Test:** Login akışını test et

---

## 📚 İlgili Dokümantasyon

- [USER_AUTHENTICATION_SYSTEM.md](./USER_AUTHENTICATION_SYSTEM.md) - Detaylı User sistemi açıklaması
- [MITGLIED_TABLOSU_DETAYLI.md](./MITGLIED_TABLOSU_DETAYLI.md) - Mitglied tablosu açıklaması
- [VEREIN_TABLOSU.md](./VEREIN_TABLOSU.md) - Verein tablosu açıklaması

---

**Oluşturulma Tarihi:** 14.11.2025  
**Versiyon:** 1.0  
**Durum:** ✅ Tamamlandı

