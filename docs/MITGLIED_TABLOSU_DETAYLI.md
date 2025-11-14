# Mitglied.Mitglied Tablosu - Detaylı Dokümantasyon

## 📋 Genel Bakış

**Tablo Adı:** `[Mitglied].[Mitglied]`  
**Schema:** Mitglied  
**Açıklama:** Dernek üyelerinin (members) tüm bilgilerini tutan ana tablodur.

## 🎯 Ne İşe Yarar?

`Mitglied` tablosu, bir derneğe kayıtlı **TÜM ÜYELERİN** bilgilerini saklar:
- ✅ Kişisel kimlik bilgileri
- ✅ İletişim bilgileri
- ✅ Üyelik bilgileri
- ✅ Aidat (membership fee) bilgileri
- ✅ **Dernek Yöneticileri de bu tabloda!**

---

## 📊 Tablo Yapısı - Tüm Sütunlar

### 🔑 Primary Key
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| **Id** | int IDENTITY(1,1) | Benzersiz üye kimliği (Primary Key) |

---

### 🏢 Dernek İlişkisi

#### 1. **VereinId** (Zorunlu) ⭐
- **Tip:** int NOT NULL
- **Açıklama:** Üyenin ait olduğu dernek kimliği (Foreign Key → Verein.Verein)
- **Örnek:** 1 (München Derneği)
- **Kullanım:** Her üye mutlaka bir derneğe ait olmalı
- **İlişki:** Many-to-One (Verein navigation property)

---

### 🆔 Üyelik Kimlik Bilgileri

#### 2. **Mitgliedsnummer** (Zorunlu) ⭐
- **Tip:** nvarchar(30) NOT NULL
- **Açıklama:** Benzersiz üye numarası
- **Örnek:** "M001", "M20250001", "B001"
- **Kullanım:** Üye kartı, raporlar, arama
- **⚠️ UNIQUE:** Her üye numarası benzersiz olmalı!

#### 3. **MitgliedStatusId** (Zorunlu) ⭐
- **Tip:** int NOT NULL
- **Açıklama:** Üyelik durumu (Foreign Key → MitgliedStatus tablosu)
- **Örnek:** 1 = Aktif, 2 = Pasif, 3 = Askıda, 4 = Çıkmış
- **Kullanım:** Üye filtreleme, raporlar

#### 4. **MitgliedTypId** (Zorunlu) ⭐
- **Tip:** int NOT NULL
- **Açıklama:** Üye tipi (Foreign Key → MitgliedTyp tablosu)
- **Örnek:** 1 = Normal Üye, 2 = Onursal Üye, 3 = Fahri Üye
- **Kullanım:** Üye sınıflandırması, haklar

---

### 👤 Kişisel Bilgiler

#### 5. **Vorname** (Zorunlu) ⭐
- **Tip:** nvarchar(100) NOT NULL
- **Açıklama:** Üyenin adı
- **Örnek:** "Ahmet", "Fatma"
- **Kullanım:** Tüm ekranlarda gösterilir

#### 6. **Nachname** (Zorunlu) ⭐
- **Tip:** nvarchar(100) NOT NULL
- **Açıklama:** Üyenin soyadı
- **Örnek:** "Yılmaz", "Özkan"
- **Kullanım:** Tüm ekranlarda gösterilir

#### 7. **GeschlechtId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Cinsiyet (Foreign Key → Geschlecht tablosu)
- **Örnek:** 1 = Erkek, 2 = Kadın, 3 = Diğer
- **Kullanım:** İstatistikler, raporlar

#### 8. **Geburtsdatum** (Opsiyonel)
- **Tip:** date NULL
- **Açıklama:** Doğum tarihi
- **Örnek:** "1985-03-15"
- **Kullanım:** Yaş hesaplama, doğum günü kutlamaları

#### 9. **Geburtsort** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Doğum yeri
- **Örnek:** "İstanbul", "München"
- **Kullanım:** Kimlik bilgileri

#### 10. **StaatsangehoerigkeitId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Uyruk/Vatandaşlık (Foreign Key → Staatsangehoerigkeit tablosu)
- **Örnek:** 1 = Türkiye, 2 = Almanya, 3 = Çifte Vatandaş
- **Kullanım:** İstatistikler, resmi belgeler

---

### 📞 İletişim Bilgileri

#### 11. **Email** (Opsiyonel) ⭐
- **Tip:** nvarchar(100) NULL
- **Açıklama:** E-posta adresi
- **Örnek:** "ahmet.yilmaz@email.com"
- **Kullanım:** GİRİŞ YAPMAK İÇİN KULLANILIR!
- **⚠️ ÖNEMLİ:** Dernek Yöneticisi için bu email giriş email'idir

#### 12. **Telefon** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Sabit telefon numarası
- **Örnek:** "+49 89 123456789"
- **Kullanım:** İletişim

#### 13. **Mobiltelefon** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Cep telefonu numarası
- **Örnek:** "+49 176 12345678"
- **Kullanım:** SMS, acil durum

---

### 📅 Üyelik Tarihleri

#### 14. **Eintrittsdatum** (Opsiyonel)
- **Tip:** date NULL
- **Açıklama:** Derneğe giriş tarihi
- **Örnek:** "2020-01-15"
- **Kullanım:** Üyelik süresi hesaplama, kıdem

#### 15. **Austrittsdatum** (Opsiyonel)
- **Tip:** date NULL
- **Açıklama:** Dernekten çıkış tarihi
- **Örnek:** "2024-12-31"
- **Kullanım:** Eski üyeler, istatistikler
- **⚠️ NOT:** Dolu ise üye çıkmış demektir

---

### ✅ Durum Bilgileri

#### 16. **Aktiv** (Opsiyonel)
- **Tip:** bit NULL
- **Açıklama:** Üye aktif mi?
- **Değerler:** 1 = Aktif, 0 = Pasif
- **Kullanım:** Hızlı filtreleme
- **⚠️ NOT:** MitgliedStatusId ile birlikte kullanılır

---

### 📝 Notlar

#### 17. **Bemerkung** (Opsiyonel)
- **Tip:** nvarchar(250) NULL
- **Açıklama:** Üye hakkında notlar
- **Örnek:** "Özel durumu var", "Aidat muafiyeti"
- **Kullanım:** Özel durumlar, hatırlatmalar

---

### 💰 Aidat (Membership Fee) Bilgileri

#### 18. **BeitragBetrag** (Opsiyonel)
- **Tip:** decimal(18,2) NULL
- **Açıklama:** Aidat tutarı
- **Örnek:** 50.00, 100.00
- **Kullanım:** Aidat hesaplama, faturalama

#### 19. **BeitragWaehrungId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Aidat para birimi (Foreign Key → Waehrung tablosu)
- **Örnek:** 1 = EUR, 2 = USD, 3 = TRY
- **Kullanım:** Çok para birimli sistemler

#### 20. **BeitragPeriodeCode** (Opsiyonel)
- **Tip:** nvarchar(20) NULL
- **Açıklama:** Aidat periyodu (Foreign Key → BeitragPeriode tablosu)
- **Örnek:** "MONTHLY" = Aylık, "YEARLY" = Yıllık, "QUARTERLY" = 3 Aylık
- **Kullanım:** Otomatik aidat hesaplama

#### 21. **BeitragZahlungsTag** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Aidat ödeme günü
- **Örnek:** 1, 15, 30
- **Kullanım:** Otomatik tahsilat, hatırlatmalar

#### 22. **BeitragZahlungstagTypCode** (Opsiyonel)
- **Tip:** nvarchar(20) NULL
- **Açıklama:** Ödeme günü tipi (Foreign Key → BeitragZahlungstagTyp tablosu)
- **Örnek:** "MONTH_START" = Ayın başı, "MONTH_END" = Ayın sonu
- **Kullanım:** Esnek ödeme planları

#### 23. **BeitragIstPflicht** (Opsiyonel)
- **Tip:** bit NULL
- **Açıklama:** Aidat zorunlu mu?
- **Değerler:** 1 = Zorunlu, 0 = İsteğe bağlı
- **Kullanım:** Onursal üyeler için 0 olabilir

---

### 🕐 Audit Alanları (AuditableEntity'den)

#### 24. **Created** (Opsiyonel)
- **Tip:** datetime NULL
- **Açıklama:** Kaydın oluşturulma tarihi
- **Varsayılan:** GETDATE()

#### 25. **CreatedBy** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Kaydı oluşturan kullanıcı ID'si

#### 26. **Modified** (Opsiyonel)
- **Tip:** datetime NULL
- **Açıklama:** Son değişiklik tarihi

#### 27. **ModifiedBy** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Son değiştiren kullanıcı ID'si

#### 28. **DeletedFlag** (Opsiyonel)
- **Tip:** bit NULL
- **Açıklama:** Soft delete bayrağı
- **Değerler:** 1 = Silinmiş, 0 = Aktif
- **Varsayılan:** 0

---

## 🔗 Navigation Properties (İlişkiler)

### 1. Verein
```csharp
public virtual Verein? Verein { get; set; }
```
- Üyenin ait olduğu dernek
- Foreign Key: VereinId

### 2. MitgliedAdressen
```csharp
public virtual ICollection<MitgliedAdresse> MitgliedAdressen { get; set; }
```
- Üyenin adresleri
- One-to-Many ilişki

### 3. FamilienbeziehungenAlsKind
```csharp
public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsKind { get; set; }
```
- Bu üyenin çocuk olduğu aile ilişkileri
- One-to-Many ilişki

### 4. FamilienbeziehungenAlsElternteil
```csharp
public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsElternteil { get; set; }
```
- Bu üyenin ebeveyn olduğu aile ilişkileri
- One-to-Many ilişki

### 5. VeranstaltungAnmeldungen
```csharp
public virtual ICollection<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; }
```
- Üyenin etkinlik kayıtları
- One-to-Many ilişki

---

## 📝 Örnek Veri

```sql
INSERT INTO [Mitglied].[Mitglied] VALUES (
    VereinId: 1,
    Mitgliedsnummer: 'M001',
    MitgliedStatusId: 1,  -- Aktif
    MitgliedTypId: 1,     -- Normal Üye
    Vorname: 'Ahmet',
    Nachname: 'Yılmaz',
    GeschlechtId: 1,      -- Erkek
    Geburtsdatum: '1985-03-15',
    Geburtsort: 'İstanbul',
    StaatsangehoerigkeitId: 1,  -- Türkiye
    Email: 'ahmet.yilmaz@email.com',
    Telefon: '+49 89 123456789',
    Mobiltelefon: '+49 176 12345678',
    Eintrittsdatum: '2020-01-15',
    Austrittsdatum: NULL,
    Aktiv: 1,
    Bemerkung: NULL,
    BeitragBetrag: 50.00,
    BeitragWaehrungId: 1,  -- EUR
    BeitragPeriodeCode: 'MONTHLY',
    BeitragZahlungsTag: 1,
    BeitragZahlungstagTypCode: 'MONTH_START',
    BeitragIstPflicht: 1
)
```

---

## ⚠️ Önemli Notlar

### 1. **Dernek Yöneticileri**
- Dernek Yöneticisi (Vorstandsvorsitzender) **bu tabloda** kayıtlıdır!
- Yönetici olup olmadığı `Verein.Vorstandsvorsitzender` alanında kontrol edilir
- Örnek: Ahmet Yılmaz hem Mitglied hem de Dernek Başkanı

### 2. **Email Alanı**
- **GİRİŞ YAPMAK İÇİN KULLANILIR!**
- Dernek Yöneticisi bu email ile giriş yapar
- Normal üyeler de bu email ile giriş yapar

### 3. **Mitgliedsnummer**
- **UNIQUE** olmalı (veritabanı constraint var)
- Genellikle otomatik oluşturulur: `M{Year}{Sequence}`
- Örnek: M20250001, M20250002

### 4. **Aktiv vs DeletedFlag**
- `Aktiv = 0`: Üye pasif (geçici)
- `DeletedFlag = 1`: Üye silinmiş (kalıcı)
- İkisi farklı amaçlar için kullanılır

### 5. **Austrittsdatum**
- Dolu ise üye dernekten çıkmış demektir
- Genellikle `Aktiv = 0` ve `MitgliedStatusId = 4` (Çıkmış) ile birlikte kullanılır

### 6. **Aidat Bilgileri**
- Tüm aidat alanları opsiyoneldir
- Onursal üyeler için `BeitragIstPflicht = 0` olabilir
- Farklı üyeler farklı aidat tutarlarına sahip olabilir

---

## 🎯 Özet

`[Mitglied].[Mitglied]` tablosu **28 sütun** içerir:
- ✅ 1 Primary Key (Id)
- ✅ 5 Audit alanı (Created, CreatedBy, Modified, ModifiedBy, DeletedFlag)
- ✅ 4 Zorunlu alan (VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId, Vorname, Nachname)
- ✅ 18 Opsiyonel alan
- ✅ 5 Navigation Property (ilişkiler)

---

## 📋 Hızlı Referans Tablosu

| # | Sütun | Tip | Zorunlu | Açıklama |
|---|-------|-----|---------|----------|
| 1 | Id | int | ✅ | Primary Key |
| 2 | VereinId | int | ✅ | Dernek (FK) |
| 3 | Mitgliedsnummer | nvarchar(30) | ✅ | Üye numarası (UNIQUE) |
| 4 | MitgliedStatusId | int | ✅ | Üyelik durumu (FK) |
| 5 | MitgliedTypId | int | ✅ | Üye tipi (FK) |
| 6 | Vorname | nvarchar(100) | ✅ | Ad |
| 7 | Nachname | nvarchar(100) | ✅ | Soyad |
| 8 | GeschlechtId | int | ❌ | Cinsiyet (FK) |
| 9 | Geburtsdatum | date | ❌ | Doğum tarihi |
| 10 | Geburtsort | nvarchar(100) | ❌ | Doğum yeri |
| 11 | StaatsangehoerigkeitId | int | ❌ | Uyruk (FK) |
| 12 | Email | nvarchar(100) | ❌ | Email (GİRİŞ İÇİN!) ⭐ |
| 13 | Telefon | nvarchar(30) | ❌ | Telefon |
| 14 | Mobiltelefon | nvarchar(30) | ❌ | Cep telefonu |
| 15 | Eintrittsdatum | date | ❌ | Giriş tarihi |
| 16 | Austrittsdatum | date | ❌ | Çıkış tarihi |
| 17 | Aktiv | bit | ❌ | Aktif mi? |
| 18 | Bemerkung | nvarchar(250) | ❌ | Notlar |
| 19 | BeitragBetrag | decimal(18,2) | ❌ | Aidat tutarı |
| 20 | BeitragWaehrungId | int | ❌ | Para birimi (FK) |
| 21 | BeitragPeriodeCode | nvarchar(20) | ❌ | Aidat periyodu (FK) |
| 22 | BeitragZahlungsTag | int | ❌ | Ödeme günü |
| 23 | BeitragZahlungstagTypCode | nvarchar(20) | ❌ | Ödeme günü tipi (FK) |
| 24 | BeitragIstPflicht | bit | ❌ | Aidat zorunlu mu? |
| 25 | Created | datetime | ❌ | Oluşturulma tarihi |
| 26 | CreatedBy | int | ❌ | Oluşturan |
| 27 | Modified | datetime | ❌ | Değişiklik tarihi |
| 28 | ModifiedBy | int | ❌ | Değiştiren |
| 29 | DeletedFlag | bit | ❌ | Silinmiş mi? |

---

## 🔍 Sık Kullanılan Sorgular

### Aktif Üyeleri Getir
```sql
SELECT * FROM [Mitglied].[Mitglied]
WHERE DeletedFlag = 0
  AND Aktiv = 1
  AND Austrittsdatum IS NULL
```

### Dernek Yöneticilerini Bul
```sql
SELECT m.*
FROM [Mitglied].[Mitglied] m
INNER JOIN [Verein].[Verein] v ON m.VereinId = v.Id
WHERE v.Vorstandsvorsitzender LIKE '%' + m.Vorname + ' ' + m.Nachname + '%'
  AND m.DeletedFlag = 0
```

### Email ile Üye Ara
```sql
SELECT * FROM [Mitglied].[Mitglied]
WHERE Email = 'ahmet.yilmaz@email.com'
  AND DeletedFlag = 0
```

### Aidat Borçluları
```sql
SELECT * FROM [Mitglied].[Mitglied]
WHERE BeitragIstPflicht = 1
  AND Aktiv = 1
  AND DeletedFlag = 0
-- (Ödeme kayıtları başka tabloda kontrol edilir)
```

