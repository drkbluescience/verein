# Keytable Tablolarının Sütun Veri Aralığı - Özet Tablosu

## 📋 Tüm Keytable Tablolarının Sütun Tanımları

### **Kategori 1: Id + Code Tabloları**

```
┌─────────────────────────────────────────────────────────────────┐
│ Sütun Adı │ Veri Tipi │ Uzunluk │ Kısıtlama                    │
├─────────────────────────────────────────────────────────────────┤
│ Id        │ int       │ -       │ IDENTITY(1,1), NOT NULL, PK  │
│ Code      │ nvarchar  │ VAR*    │ NOT NULL, UNIQUE             │
└─────────────────────────────────────────────────────────────────┘

* VAR = Tabloya göre değişken (10-30 karakter)
```

#### **Code Uzunlukları Detaylı:**

```
Geschlecht              → nvarchar(10)
Waehrung                → nvarchar(10)
MitgliedStatus          → nvarchar(20)
MitgliedTyp             → nvarchar(20)
AdresseTyp              → nvarchar(20)
Kontotyp                → nvarchar(20)
Rechtsform              → nvarchar(20)
ZahlungStatus           → nvarchar(20)
ZahlungTyp              → nvarchar(30) ⭐ MAX
Forderungsart           → nvarchar(20)
Forderungsstatus        → nvarchar(20)
FamilienbeziehungTyp    → nvarchar(20)
MitgliedFamilieStatus   → nvarchar(20)
```

---

### **Kategori 2: Code + Sort Tabloları**

```
┌─────────────────────────────────────────────────────────────────┐
│ Sütun Adı │ Veri Tipi │ Uzunluk │ Kısıtlama                    │
├─────────────────────────────────────────────────────────────────┤
│ Code      │ nvarchar  │ 20      │ NOT NULL, PK, UNIQUE         │
│ Sort      │ int       │ -       │ NOT NULL                     │
└─────────────────────────────────────────────────────────────────┘
```

**Tablolar:**
- BeitragPeriode
- BeitragZahlungstagTyp

---

### **Kategori 3: Staatsangehoerigkeit (Özel)**

```
┌─────────────────────────────────────────────────────────────────┐
│ Sütun Adı │ Veri Tipi │ Uzunluk │ Kısıtlama                    │
├─────────────────────────────────────────────────────────────────┤
│ Id        │ int       │ -       │ IDENTITY(1,1), NOT NULL, PK  │
│ Iso2      │ char      │ 2       │ NOT NULL, UNIQUE             │
│ Iso3      │ char      │ 3       │ NOT NULL, UNIQUE             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔤 Çeviri Tabloları - Sütun Tanımları

### **Tip 1: Id + {AnaTabloId} + Sprache + Name**

```
┌─────────────────────────────────────────────────────────────────┐
│ Sütun Adı      │ Veri Tipi │ Uzunluk │ Kısıtlama               │
├─────────────────────────────────────────────────────────────────┤
│ Id             │ int       │ -       │ IDENTITY(1,1), NOT NULL │
│ {AnaTabloId}   │ int       │ -       │ NOT NULL, FK            │
│ Sprache        │ char      │ 2       │ NOT NULL                │
│ Name           │ nvarchar  │ VAR*    │ NOT NULL                │
└─────────────────────────────────────────────────────────────────┘

* VAR = 50 veya 100 karakter
```

#### **Name Uzunlukları:**

```
GeschlechtUebersetzung              → nvarchar(50)
MitgliedStatusUebersetzung          → nvarchar(50)
MitgliedTypUebersetzung             → nvarchar(50)
AdresseTypUebersetzung              → nvarchar(50)
KontotypUebersetzung                → nvarchar(50)
RechtsformUebersetzung              → nvarchar(50)
WaehrungUebersetzung                → nvarchar(50)
ZahlungStatusUebersetzung           → nvarchar(50)
ZahlungTypUebersetzung              → nvarchar(50)
ForderungsartUebersetzung           → nvarchar(50)
ForderungsstatusUebersetzung        → nvarchar(50)
FamilienbeziehungTypUebersetzung    → nvarchar(50)
MitgliedFamilieStatusUebersetzung   → nvarchar(50)
StaatsangehoerigkeitUebersetzung    → nvarchar(100) ⭐ MAX
```

---

### **Tip 2: {AnaTabloCode} + Sprache + Name**

```
┌─────────────────────────────────────────────────────────────────┐
│ Sütun Adı      │ Veri Tipi │ Uzunluk │ Kısıtlama               │
├─────────────────────────────────────────────────────────────────┤
│ {AnaTabloCode} │ nvarchar  │ 20      │ NOT NULL, PK, FK        │
│ Sprache        │ char      │ 2       │ NOT NULL, PK            │
│ Name           │ nvarchar  │ 30      │ NOT NULL                │
└─────────────────────────────────────────────────────────────────┘
```

**Tablolar:**
- BeitragPeriodeUebersetzung
- BeitragZahlungstagTypUebersetzung

---

## 📊 Veri Aralığı Özet

### **Code Alanı**

| Min | Max | Ortalama |
|-----|-----|----------|
| 10 | 30 | 19 |

**Dağılım:**
- 10 karakter: 2 tablo (Geschlecht, Waehrung)
- 20 karakter: 11 tablo
- 30 karakter: 1 tablo (ZahlungTyp)

### **Name Alanı (Çeviri)**

| Min | Max | Ortalama |
|-----|-----|----------|
| 30 | 100 | 52 |

**Dağılım:**
- 30 karakter: 2 tablo (BeitragPeriode, BeitragZahlungstagTyp)
- 50 karakter: 13 tablo
- 100 karakter: 1 tablo (Staatsangehoerigkeit)

### **Iso Alanları**

| Alan | Uzunluk | Tip |
|------|---------|-----|
| Iso2 | 2 | char (EXACTLY) |
| Iso3 | 3 | char (EXACTLY) |

---

## ✅ Veri Ekleme Kuralları

### **1. Code Alanı**

```
✅ Maksimum uzunluğu aşmayacak
✅ Boş olmayacak (NOT NULL)
✅ Eşsiz olacak (UNIQUE)
✅ Sadece ASCII karakterler (önerilir)

Örnek:
- "M" (1 karakter) ✅
- "BEITRAG" (7 karakter) ✅
- "MannlichFemaleOtherDiverseUnknown" (34 karakter) ❌ (MAX 30)
```

### **2. Name Alanı (Çeviri)**

```
✅ Maksimum uzunluğu aşmayacak
✅ Boş olmayacak (NOT NULL)
✅ Unicode karakterler desteklenir (Türkçe, Almanca)

Örnek:
- "Männlich" (8 karakter) ✅
- "Erkek" (5 karakter) ✅
- "MännlichFemaleOtherDiverseUnknownNotSpecifiedYetToBeDetermined" (60 karakter) ❌ (MAX 50)
```

### **3. Sprache Alanı**

```
✅ Tam 2 karakter
✅ Sadece "de" veya "tr"
✅ Boş olmayacak (NOT NULL)

Geçerli Değerler:
- "de" (Deutsch/Almanca) ✅
- "tr" (Türkçe) ✅
- "en" (English) ❌
- "fr" (Français) ❌
```

### **4. Iso Alanları (Staatsangehoerigkeit)**

```
✅ Iso2: EXACTLY 2 karakter
✅ Iso3: EXACTLY 3 karakter
✅ Her ikisi de UNIQUE
✅ Boş olmayacak (NOT NULL)

Geçerli Değerler:
- Iso2: "DE", "TR", "AT", "CH" ✅
- Iso3: "DEU", "TUR", "AUT", "CHE" ✅
- Iso2: "DEU" ❌ (3 karakter)
- Iso3: "DE" ❌ (2 karakter)
```

---

## 🔍 Hızlı Referans

| Sütun Tipi | Veri Tipi | Uzunluk | Kısıtlama |
|-----------|-----------|---------|-----------|
| **Id** | int | - | IDENTITY, NOT NULL, PK |
| **Code (Kategori 1)** | nvarchar | 10-30 | NOT NULL, UNIQUE |
| **Code (Kategori 2)** | nvarchar | 20 | NOT NULL, PK |
| **Sort** | int | - | NOT NULL |
| **Iso2** | char | 2 | NOT NULL, UNIQUE |
| **Iso3** | char | 3 | NOT NULL, UNIQUE |
| **Sprache** | char | 2 | NOT NULL |
| **Name** | nvarchar | 30-100 | NOT NULL |

---

## 🚀 Veri Ekleme Şablonu

```sql
-- Ana Tablo
INSERT INTO [Keytable].[{TableName}] (Code) 
VALUES ('{CODE}');  -- MAX {LENGTH} karakter

-- Çeviri Tablosu
INSERT INTO [Keytable].[{TableName}Uebersetzung] 
  ({TableNameId}, Sprache, Name) 
VALUES 
  ({ID}, 'de', N'{GERMAN_NAME}'),    -- MAX 50-100 karakter
  ({ID}, 'tr', N'{TURKISH_NAME}');   -- MAX 50-100 karakter
```

**Örnek:**
```sql
INSERT INTO [Keytable].[Geschlecht] (Code) 
VALUES ('M');  -- MAX 10 karakter

INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES 
  (1, 'de', N'Männlich'),    -- MAX 50 karakter
  (1, 'tr', N'Erkek');       -- MAX 50 karakter
```

