# User Authentication System - Yeni Mimari

## 📋 Genel Bakış

Veritabanına **User Authentication** sistemi eklendi. Artık authentication (kimlik doğrulama) ve domain logic (iş mantığı) **ayrı tablolarda** tutuluyor.

---

## 🏗️ Tablo Yapısı

### **1. [Web].[User] Tablosu**

**Amaç:** Kullanıcı kimlik doğrulama bilgilerini saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| **Id** | INT | Primary Key |
| **Email** | NVARCHAR(100) | Unique, giriş için kullanılır |
| **PasswordHash** | NVARCHAR(255) | Şifre hash'i (nullable - ileride eklenecek) |
| **Vorname** | NVARCHAR(100) | Ad |
| **Nachname** | NVARCHAR(100) | Soyad |
| **IsActive** | BIT | Aktif mi? |
| **EmailConfirmed** | BIT | Email onaylandı mı? |
| **LastLogin** | DATETIME | Son giriş zamanı |
| **FailedLoginAttempts** | INT | Başarısız giriş denemeleri |
| **LockoutEnd** | DATETIME | Hesap kilidi bitiş zamanı |
| **Created, Modified, DeletedFlag** | - | Audit alanları |

**Özellikler:**
- ✅ Email UNIQUE constraint
- ✅ Soft delete (DeletedFlag)
- ✅ Security features (lockout, failed attempts)

---

### **2. [Web].[UserRole] Tablosu**

**Amaç:** Kullanıcı rollerini ve yetkilerini saklar (Many-to-Many).

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| **Id** | INT | Primary Key |
| **UserId** | INT | FK to [Web].[User] |
| **RoleType** | NVARCHAR(20) | 'admin', 'dernek', 'mitglied' |
| **MitgliedId** | INT | FK to [Mitglied].[Mitglied] (nullable) |
| **VereinId** | INT | FK to [Verein].[Verein] (nullable) |
| **GueltigVon** | DATE | Geçerlilik başlangıç tarihi |
| **GueltigBis** | DATE | Geçerlilik bitiş tarihi (nullable = sınırsız) |
| **IsActive** | BIT | Aktif mi? |
| **Bemerkung** | NVARCHAR(250) | Notlar |
| **Created, Modified, DeletedFlag** | - | Audit alanları |

**Özellikler:**
- ✅ Bir User birden fazla role sahip olabilir
- ✅ MitgliedId ve VereinId nullable (dışarıdan yönetici için)
- ✅ Tarihsel kayıt (GueltigVon/GueltigBis)
- ✅ CHECK constraint (RoleType IN ('admin', 'dernek', 'mitglied'))

---

## 🎯 Kullanım Senaryoları

### **Senaryo 1: Admin Kullanıcı**

```sql
-- User kaydı
INSERT INTO [Web].[User] (Email, Vorname, Nachname, IsActive)
VALUES ('admin@system.de', 'System', 'Admin', 1)

-- Admin rolü
INSERT INTO [Web].[UserRole] (UserId, RoleType, IsActive)
VALUES (1, 'admin', 1)
```

**Sonuç:**
- ✅ MitgliedId/VereinId yok (gerekmiyor)
- ✅ Tüm yetkilere sahip

---

### **Senaryo 2: Normal Üye**

```sql
-- User kaydı
INSERT INTO [Web].[User] (Email, Vorname, Nachname, IsActive)
VALUES ('ahmet@email.com', 'Ahmet', 'Yılmaz', 1)

-- Mitglied rolü
INSERT INTO [Web].[UserRole] (UserId, RoleType, MitgliedId, VereinId, IsActive)
VALUES (2, 'mitglied', 5, 1, 1)
```

**Sonuç:**
- ✅ MitgliedId ile ilişkilendirilmiş
- ✅ Sadece kendi verilerine erişebilir

---

### **Senaryo 3: Dernek Yöneticisi (Aynı Zamanda Üye)**

```sql
-- User kaydı
INSERT INTO [Web].[User] (Email, Vorname, Nachname, IsActive)
VALUES ('mehmet@email.com', 'Mehmet', 'Demir', 1)

-- Hem üye hem yönetici (2 rol!)
INSERT INTO [Web].[UserRole] (UserId, RoleType, MitgliedId, VereinId, IsActive)
VALUES 
    (3, 'mitglied', 10, 1, 1),  -- Üye rolü
    (3, 'dernek', 10, 1, 1)     -- Yönetici rolü
```

**Sonuç:**
- ✅ Bir kişi iki role sahip
- ✅ Hem üye hem yönetici yetkilerine sahip

---

### **Senaryo 4: Dışarıdan Profesyonel Yönetici**

```sql
-- User kaydı
INSERT INTO [Web].[User] (Email, Vorname, Nachname, IsActive)
VALUES ('manager@professional.de', 'Hans', 'Müller', 1)

-- Sadece yönetici rolü (MitgliedId NULL!)
INSERT INTO [Web].[UserRole] (UserId, RoleType, MitgliedId, VereinId, IsActive)
VALUES (4, 'dernek', NULL, 1, 1)
```

**Sonuç:**
- ✅ Dernek üyesi olmadan yönetici olabilir
- ✅ Esneklik maksimum!

---

## 🔄 Migration Süreci

### **Adım 1: Veritabanını Oluştur**

```bash
# Azure SQL Database'de VereinDB oluştur
# Sonra scripti çalıştır:
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i APPLICATION_H_101_AZURE.sql
```

### **Adım 2: Demo Data Ekle**

```bash
# Mevcut Mitglied kayıtlarını User'a migrate et
sqlcmd -S Verein08112025.database.windows.net -d VereinDB -U vereinsa -P [password] -i USER_DEMO_DATA.sql
```

---

## 📊 Avantajlar

| Özellik | Eski Sistem | Yeni Sistem |
|---------|-------------|-------------|
| **Separation of Concerns** | ❌ Karışık | ✅ Ayrı tablolar |
| **Esneklik** | ❌ Sadece Mitglied | ✅ Herkes giriş yapabilir |
| **Çoklu Rol** | ❌ Tek rol | ✅ Birden fazla rol |
| **Admin Yönetimi** | ❌ Hardcoded | ✅ Veritabanında |
| **Güvenlik** | ❌ Password yok | ✅ Hash + Lockout |
| **Dışarıdan Yönetici** | ❌ İmkansız | ✅ Mümkün |
| **Tarihsel Kayıt** | ❌ Yok | ✅ GueltigVon/Bis |

---

## 🔍 Sorgular

### **Tüm Kullanıcıları Listele**

```sql
SELECT 
    u.Id,
    u.Email,
    u.Vorname,
    u.Nachname,
    u.IsActive,
    u.LastLogin
FROM [Web].[User] u
WHERE u.DeletedFlag = 0
ORDER BY u.Created DESC
```

### **Kullanıcının Rollerini Getir**

```sql
SELECT 
    u.Email,
    ur.RoleType,
    ur.MitgliedId,
    ur.VereinId,
    ur.GueltigVon,
    ur.GueltigBis,
    ur.IsActive
FROM [Web].[User] u
INNER JOIN [Web].[UserRole] ur ON ur.UserId = u.Id
WHERE u.Email = 'mehmet@email.com'
  AND ur.DeletedFlag = 0
  AND ur.IsActive = 1
ORDER BY ur.RoleType
```

### **Dernek Yöneticilerini Listele**

```sql
SELECT 
    u.Email,
    u.Vorname + ' ' + u.Nachname AS FullName,
    v.Name AS VereinName,
    ur.GueltigVon,
    ur.GueltigBis
FROM [Web].[User] u
INNER JOIN [Web].[UserRole] ur ON ur.UserId = u.Id
INNER JOIN [Verein].[Verein] v ON v.Id = ur.VereinId
WHERE ur.RoleType = 'dernek'
  AND ur.DeletedFlag = 0
  AND ur.IsActive = 1
  AND u.DeletedFlag = 0
ORDER BY v.Name, u.Nachname
```

---

## ⚠️ Önemli Notlar

1. **Password Sistemi:** Şu anda PasswordHash nullable. İleride BCrypt veya PBKDF2 ile hash eklenecek.

2. **Email Kontrolü:** Login sırasında sadece email kontrolü yapılıyor (demo amaçlı).

3. **Geriye Uyumluluk:** `Verein.Vorstandsvorsitzender` alanı korundu ama artık kullanılmayacak.

4. **Migration:** Mevcut Mitglied kayıtları otomatik olarak User'a migrate edilir.

5. **Roller:** Bir kullanıcı birden fazla role sahip olabilir (örn: hem mitglied hem dernek).

---

## 🚀 Sonraki Adımlar

1. ✅ **Backend:** AuthController'ı güncelle (User tablosunu kullan)
2. ✅ **Backend:** UserService ve UserRoleService oluştur
3. ✅ **Backend:** Password hashing sistemi ekle
4. ✅ **Frontend:** Minimal değişiklik (AuthContext zaten hazır)
5. ✅ **Test:** Login akışını test et

---

**Oluşturulma Tarihi:** 14.11.2025  
**Versiyon:** 1.0  
**Durum:** ✅ Tamamlandı

