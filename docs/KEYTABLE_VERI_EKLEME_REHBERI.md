# Keytable Tablolarına Veri Ekleme Rehberi

## 📋 Genel Kurallar

### 1. **Eşsiz Değerler (UNIQUE Constraints)**

Keytable tablolarında **Code** alanı **UNIQUE NONCLUSTERED** constraint'i ile korunmaktadır. Bu nedenle:

- ✅ **Code değerleri eşsiz olmalı** - Aynı Code iki kez eklenemez
- ✅ **Case-sensitive değildir** - SQL Server varsayılan ayarlarında
- ✅ **Boş değer (NULL) kabul etmez** - NOT NULL constraint'i var

**Örnek:**
```sql
-- ❌ HATA - Aynı Code iki kez
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M'); -- Hata!

-- ✅ DOĞRU
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('F');
```

### 2. **Dil Kodu (Sprache)**

Çeviri tablolarında **Sprache** alanı **char(2)** formatında olmalıdır:

- ✅ **"de"** - Almanca (Deutsch)
- ✅ **"tr"** - Türkçe (Türkçe)
- ❌ **"en", "fr"** - Desteklenmiyor

**Kural:** Her ana tablo kaydı için **her dil için bir çeviri kaydı** olmalı.

```sql
-- ✅ DOĞRU - Her dil için çeviri
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES 
  (1, 'de', 'Männlich'),
  (1, 'tr', 'Erkek');
```

### 3. **Foreign Key İlişkileri**

Çeviri tablolarında ana tabloya referans olmalıdır:

- ✅ **GeschlechtUebersetzung.GeschlechtId** → **Geschlecht.Id**
- ✅ **MitgliedStatusUebersetzung.MitgliedStatusId** → **MitgliedStatus.Id**
- ❌ Geçersiz Id referansı → Hata!

```sql
-- ❌ HATA - Geçersiz GeschlechtId
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (999, 'de', 'Test'); -- GeschlechtId 999 yok!

-- ✅ DOĞRU
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'de', 'Männlich'); -- GeschlechtId 1 var
```

---

## 📊 Keytable Tabloları Kategorileri

### **Kategori 1: Id + Code Tabloları**

Yapı: `[Id] [int] IDENTITY(1,1)` + `[Code] [nvarchar]`

| Tablo | Code Max | Açıklama |
|-------|----------|---------|
| **Geschlecht** | 10 | Cinsiyet (M, F, D) |
| **MitgliedStatus** | 20 | Üye Durumu (AKTIV, PASIV, AUSTRITT) |
| **MitgliedTyp** | 20 | Üye Tipi (PERSON, FIRMA) |
| **AdresseTyp** | 20 | Adres Tipi (PRIVAT, GESCHAFT) |
| **Kontotyp** | 20 | Konto Tipi (GIROKONTO, SPARKONTO) |
| **Rechtsform** | 20 | Hukuki Form (eV, GmbH, AG) |
| **Waehrung** | 10 | Para Birimi (EUR, USD, TRY) |
| **ZahlungTyp** | 30 | Ödeme Tipi (BEITRAG, SPENDE) |
| **ZahlungStatus** | 20 | Ödeme Durumu (BEZAHLT, OFFEN) |
| **Forderungsart** | 20 | Talep Türü |
| **Forderungsstatus** | 20 | Talep Durumu |
| **FamilienbeziehungTyp** | 20 | Aile İlişkisi (EHEPARTNER, KIND) |
| **MitgliedFamilieStatus** | 20 | Aile Üye Durumu |

**Veri Ekleme Örneği:**
```sql
-- Ana tablo
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('F');

-- Çeviri tablosu
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES 
  (1, 'de', 'Männlich'),
  (1, 'tr', 'Erkek'),
  (2, 'de', 'Weiblich'),
  (2, 'tr', 'Kadın');
```

### **Kategori 2: Code + Sort Tabloları**

Yapı: `[Code] [nvarchar]` (PRIMARY KEY) + `[Sort] [int]`

| Tablo | Açıklama |
|-------|---------|
| **BeitragPeriode** | Aidat Dönemi (MONATLICH, JAEHRLICH) |
| **BeitragZahlungstagTyp** | Aidat Ödeme Gün Tipi |

**Özellikler:**
- ✅ **Code** PRIMARY KEY'dir (Id değil!)
- ✅ **Sort** sıralama için kullanılır (1, 2, 3...)
- ✅ Çeviri tablosunda **BeitragPeriodeCode** referans alınır

**Veri Ekleme Örneği:**
```sql
-- Ana tablo
INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) 
VALUES ('MONATLICH', 1);
INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) 
VALUES ('JAEHRLICH', 2);

-- Çeviri tablosu
INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] 
  (BeitragPeriodeCode, Sprache, Name) 
VALUES 
  ('MONATLICH', 'de', 'Monatlich'),
  ('MONATLICH', 'tr', 'Aylık'),
  ('JAEHRLICH', 'de', 'Jährlich'),
  ('JAEHRLICH', 'tr', 'Yıllık');
```

### **Kategori 3: Özel Tablo - Staatsangehoerigkeit**

Yapı: `[Id]` + `[Iso2]` (UNIQUE) + `[Iso3]` (UNIQUE)

**Özellikler:**
- ✅ **Iso2**: 2 karakterli ülke kodu (DE, TR, AT)
- ✅ **Iso3**: 3 karakterli ülke kodu (DEU, TUR, AUT)
- ✅ **Her ikisi de UNIQUE** - Tekrar edemez
- ✅ Çeviri tablosunda **StaatsangehoerigkeitId** referans alınır

**Veri Ekleme Örneği:**
```sql
-- Ana tablo
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) 
VALUES ('DE', 'DEU');
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) 
VALUES ('TR', 'TUR');

-- Çeviri tablosu
INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] 
  (StaatsangehoerigkeitId, Sprache, Name) 
VALUES 
  (1, 'de', 'Deutschland'),
  (1, 'tr', 'Almanya'),
  (2, 'de', 'Türkei'),
  (2, 'tr', 'Türkiye');
```

---

## ⚠️ Sık Yapılan Hatalar

| Hata | Sebep | Çözüm |
|------|-------|-------|
| **Duplicate key error** | Code değeri tekrar ediliyor | Code'ları kontrol et, eşsiz yap |
| **Foreign key violation** | Geçersiz Id referansı | Ana tabloda kaydın var mı kontrol et |
| **Invalid Sprache value** | "en", "fr" gibi desteklenmeyen dil | Sadece "de" veya "tr" kullan |
| **Missing translation** | Bir dil için çeviri yok | Her dil için çeviri ekle |
| **NULL in Code** | Code alanı boş | Code zorunlu, boş bırakma |

---

## ✅ Kontrol Listesi

Veri eklemeden önce kontrol et:

- [ ] **Code değerleri eşsiz mi?** (UNIQUE constraint)
- [ ] **Sprache sadece "de" veya "tr" mi?**
- [ ] **Her ana kayıt için her dil çevirisi var mı?**
- [ ] **Foreign key referansları geçerli mi?**
- [ ] **Staatsangehoerigkeit için Iso2 ve Iso3 eşsiz mi?**
- [ ] **Hiçbir zorunlu alan boş değil mi?**
- [ ] **Sort değerleri sıralı mı?** (BeitragPeriode, BeitragZahlungstagTyp)

---

## 🔍 Veri Doğrulama Sorguları

```sql
-- Duplicate Code kontrol
SELECT Code, COUNT(*) as Sayı 
FROM [Keytable].[Geschlecht] 
GROUP BY Code 
HAVING COUNT(*) > 1;

-- Eksik çeviri kontrol
SELECT g.Id, g.Code, COUNT(DISTINCT gu.Sprache) as DilSayı
FROM [Keytable].[Geschlecht] g
LEFT JOIN [Keytable].[GeschlechtUebersetzung] gu ON g.Id = gu.GeschlechtId
GROUP BY g.Id, g.Code
HAVING COUNT(DISTINCT gu.Sprache) < 2;

-- Geçersiz Foreign Key kontrol
SELECT * FROM [Keytable].[GeschlechtUebersetzung] gu
WHERE NOT EXISTS (
  SELECT 1 FROM [Keytable].[Geschlecht] g WHERE g.Id = gu.GeschlechtId
);
```

