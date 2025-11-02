# Keytable Tablolarının Sütun Veri Aralığı Analizi

## 📊 Özet

**EVET!** Keytable tablolarının sütunları için **veri aralığı (data type constraints) belirtilmiş!**

Tüm sütunlar için:
- ✅ **Veri tipi** belirtilmiş (nvarchar, char, int)
- ✅ **Maksimum uzunluk** belirtilmiş
- ✅ **NOT NULL** kısıtlaması belirtilmiş
- ✅ **UNIQUE** kısıtlaması belirtilmiş (Code alanları)

---

## 🔍 Keytable Sütun Veri Aralıkları

### **Kategori 1: Id + Code Tabloları (13 tablo)**

| Sütun | Veri Tipi | Uzunluk | Kısıtlama | Açıklama |
|-------|-----------|---------|-----------|---------|
| **Id** | int | - | IDENTITY(1,1), NOT NULL, PK | Otomatik artan |
| **Code** | nvarchar | Değişken | NOT NULL, UNIQUE | Eşsiz kod |

#### **Code Uzunlukları:**

| Tablo | Code Uzunluğu |
|-------|---------------|
| Geschlecht | **10** |
| Waehrung | **10** |
| MitgliedStatus | **20** |
| MitgliedTyp | **20** |
| AdresseTyp | **20** |
| Kontotyp | **20** |
| Rechtsform | **20** |
| ZahlungStatus | **20** |
| ZahlungTyp | **30** ⭐ (En uzun) |
| Forderungsart | **20** |
| Forderungsstatus | **20** |
| FamilienbeziehungTyp | **20** |
| MitgliedFamilieStatus | **20** |

---

### **Kategori 2: Code + Sort Tabloları (2 tablo)**

| Sütun | Veri Tipi | Uzunluk | Kısıtlama | Açıklama |
|-------|-----------|---------|-----------|---------|
| **Code** | nvarchar | 20 | NOT NULL, PK | Eşsiz kod |
| **Sort** | int | - | NOT NULL | Sıralama |

**Tablolar:**
- BeitragPeriode
- BeitragZahlungstagTyp

---

### **Kategori 3: Özel Tablo - Staatsangehoerigkeit**

| Sütun | Veri Tipi | Uzunluk | Kısıtlama | Açıklama |
|-------|-----------|---------|-----------|---------|
| **Id** | int | - | IDENTITY(1,1), NOT NULL, PK | Otomatik artan |
| **Iso2** | char | 2 | NOT NULL, UNIQUE | 2 karakterli ülke kodu |
| **Iso3** | char | 3 | NOT NULL, UNIQUE | 3 karakterli ülke kodu |

---

### **Çeviri Tabloları - Sütun Veri Aralıkları**

#### **Tip 1 Çeviri Tabloları** (Id + Code tabloları için)

| Sütun | Veri Tipi | Uzunluk | Kısıtlama | Açıklama |
|-------|-----------|---------|-----------|---------|
| **Id** | int | - | IDENTITY(1,1), NOT NULL, PK | Otomatik artan |
| **{AnaTabloId}** | int | - | NOT NULL, FK | Ana tabloya referans |
| **Sprache** | char | 2 | NOT NULL | Dil kodu ("de", "tr") |
| **Name** | nvarchar | Değişken | NOT NULL | Çevrilmiş ad |

#### **Name Uzunlukları (Çeviri Tabloları):**

| Çeviri Tablosu | Name Uzunluğu |
|----------------|---------------|
| GeschlechtUebersetzung | **50** |
| MitgliedStatusUebersetzung | **50** |
| MitgliedTypUebersetzung | **50** |
| AdresseTypUebersetzung | **50** |
| KontotypUebersetzung | **50** |
| RechtsformUebersetzung | **50** |
| WaehrungUebersetzung | **50** |
| ZahlungStatusUebersetzung | **50** |
| ZahlungTypUebersetzung | **50** |
| Forderungsart Uebersetzung | **50** |
| ForderungsstatusUebersetzung | **50** |
| FamilienbeziehungTypUebersetzung | **50** |
| MitgliedFamilieStatusUebersetzung | **50** |
| **StaatsangehoerigkeitUebersetzung** | **100** ⭐ (En uzun) |

#### **Tip 2 Çeviri Tabloları** (Code + Sort tabloları için)

| Sütun | Veri Tipi | Uzunluk | Kısıtlama | Açıklama |
|-------|-----------|---------|-----------|---------|
| **{AnaTabloCode}** | nvarchar | 20 | NOT NULL, PK, FK | Ana tabloya referans |
| **Sprache** | char | 2 | NOT NULL, PK | Dil kodu ("de", "tr") |
| **Name** | nvarchar | Değişken | NOT NULL | Çevrilmiş ad |

**Name Uzunlukları:**
- BeitragPeriodeUebersetzung: **30**
- BeitragZahlungstagTypUebersetzung: **30**

---

## 📋 Veri Ekleme Sınırları

### **Code Alanı Sınırları**

```
Geschlecht:              MAX 10 karakter
Waehrung:                MAX 10 karakter
MitgliedStatus:          MAX 20 karakter
MitgliedTyp:             MAX 20 karakter
AdresseTyp:              MAX 20 karakter
Kontotyp:                MAX 20 karakter
Rechtsform:             MAX 20 karakter
ZahlungStatus:          MAX 20 karakter
ZahlungTyp:             MAX 30 karakter ⭐
Forderungsart:          MAX 20 karakter
Forderungsstatus:       MAX 20 karakter
FamilienbeziehungTyp:   MAX 20 karakter
MitgliedFamilieStatus:  MAX 20 karakter
BeitragPeriode:         MAX 20 karakter
BeitragZahlungstagTyp:  MAX 20 karakter
```

### **Name Alanı Sınırları (Çeviri)**

```
Çoğu çeviri tablosu:     MAX 50 karakter
Staatsangehoerigkeit:    MAX 100 karakter ⭐
BeitragPeriode:          MAX 30 karakter
BeitragZahlungstagTyp:   MAX 30 karakter
```

### **Iso Alanları (Staatsangehoerigkeit)**

```
Iso2:  EXACTLY 2 karakter (char(2))
Iso3:  EXACTLY 3 karakter (char(3))
```

---

## ✅ Veri Ekleme Kontrol Listesi

### **Code Alanı İçin:**
- [ ] Code boş değil mi?
- [ ] Code maksimum uzunluğu aşmıyor mu?
- [ ] Code eşsiz mi (başka tabloda aynı Code yok)?
- [ ] Code NULL değil mi?

### **Name Alanı İçin (Çeviri):**
- [ ] Name boş değil mi?
- [ ] Name maksimum uzunluğu aşmıyor mu?
- [ ] Name NULL değil mi?

### **Sprache Alanı İçin:**
- [ ] Sprache "de" veya "tr" mi?
- [ ] Sprache tam 2 karakter mi?
- [ ] Sprache NULL değil mi?

### **Iso Alanları İçin (Staatsangehoerigkeit):**
- [ ] Iso2 tam 2 karakter mi?
- [ ] Iso3 tam 3 karakter mi?
- [ ] Iso2 eşsiz mi?
- [ ] Iso3 eşsiz mi?

---

## 🚀 Veri Ekleme Örnekleri

### **Doğru Örnekler:**

```sql
-- ✅ Code uzunluğu uygun
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');      -- 1 karakter (MAX 10)
INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('BEITRAG'); -- 7 karakter (MAX 30)

-- ✅ Name uzunluğu uygun
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'de', 'Männlich');  -- 8 karakter (MAX 50)

-- ✅ Iso alanları uygun
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) 
VALUES ('DE', 'DEU');  -- Iso2: 2 karakter, Iso3: 3 karakter
```

### **Yanlış Örnekler:**

```sql
-- ❌ Code çok uzun
INSERT INTO [Keytable].[Geschlecht] (Code) 
VALUES ('MannlichFemaleOther');  -- 21 karakter (MAX 10) → HATA!

-- ❌ Name çok uzun
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'de', 'MännlichFemaleOtherDiverseUnknownNotSpecified');  -- 51 karakter (MAX 50) → HATA!

-- ❌ Iso2 yanlış uzunluk
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) 
VALUES ('DEU', 'DEU');  -- Iso2: 3 karakter (EXACTLY 2) → HATA!

-- ❌ Sprache yanlış
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'en', 'Male');  -- 'en' desteklenmiyor → HATA!
```

---

## 📊 Özet Tablo

| Özellik | Değer |
|---------|-------|
| **Toplam Keytable Tablosu** | 16 |
| **Toplam Çeviri Tablosu** | 16 |
| **Code Max Uzunluğu** | 30 (ZahlungTyp) |
| **Code Min Uzunluğu** | 10 (Geschlecht, Waehrung) |
| **Name Max Uzunluğu** | 100 (StaatsangehoerigkeitUebersetzung) |
| **Name Min Uzunluğu** | 30 (BeitragPeriode, BeitragZahlungstagTyp) |
| **Iso2 Uzunluğu** | Exactly 2 |
| **Iso3 Uzunluğu** | Exactly 3 |
| **Sprache Uzunluğu** | Exactly 2 ("de", "tr") |

