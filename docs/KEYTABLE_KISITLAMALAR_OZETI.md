# Keytable Tablolarının Kısıtlamaları - Özet Tablosu

## 🔒 Tüm Keytable Tablolarının Kısıtlamaları

### **Kategori 1: Id + Code Tabloları**

| Tablo | Sütunlar | Kısıtlamalar | Çeviri Tablosu |
|-------|----------|--------------|----------------|
| **Geschlecht** | Id (PK), Code (UNIQUE) | Code: nvarchar(10), NOT NULL | GeschlechtUebersetzung |
| **MitgliedStatus** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | MitgliedStatusUebersetzung |
| **MitgliedTyp** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | MitgliedTypUebersetzung |
| **AdresseTyp** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | AdresseTypUebersetzung |
| **Kontotyp** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | KontotypUebersetzung |
| **Rechtsform** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | RechtsformUebersetzung |
| **Waehrung** | Id (PK), Code (UNIQUE) | Code: nvarchar(10), NOT NULL | WaehrungUebersetzung |
| **ZahlungTyp** | Id (PK), Code (UNIQUE) | Code: nvarchar(30), NOT NULL | ZahlungTypUebersetzung |
| **ZahlungStatus** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | ZahlungStatusUebersetzung |
| **Forderungsart** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | ForderungsartUebersetzung |
| **Forderungsstatus** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | ForderungsstatusUebersetzung |
| **FamilienbeziehungTyp** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | FamilienbeziehungTypUebersetzung |
| **MitgliedFamilieStatus** | Id (PK), Code (UNIQUE) | Code: nvarchar(20), NOT NULL | MitgliedFamilieStatusUebersetzung |

### **Kategori 2: Code + Sort Tabloları**

| Tablo | Sütunlar | Kısıtlamalar | Çeviri Tablosu |
|-------|----------|--------------|----------------|
| **BeitragPeriode** | Code (PK), Sort | Code: nvarchar(20), Sort: int | BeitragPeriodeUebersetzung |
| **BeitragZahlungstagTyp** | Code (PK), Sort | Code: nvarchar(20), Sort: int | BeitragZahlungstagTypUebersetzung |

### **Kategori 3: Özel Tablo**

| Tablo | Sütunlar | Kısıtlamalar | Çeviri Tablosu |
|-------|----------|--------------|----------------|
| **Staatsangehoerigkeit** | Id (PK), Iso2 (UNIQUE), Iso3 (UNIQUE) | Iso2: char(2), Iso3: char(3) | StaatsangehoerigkeitUebersetzung |

---

## 📋 Çeviri Tabloları Yapısı

### **Tip 1 Çeviri Tabloları** (Id + Code tabloları için)

```
Sütunlar:
- Id (int, IDENTITY, PK)
- {AnaTabloId} (int, NOT NULL, FK)
- Sprache (char(2), NOT NULL) → "de" veya "tr"
- Name (nvarchar(50-100), NOT NULL)

Örnek: GeschlechtUebersetzung
- Id (PK)
- GeschlechtId (FK → Geschlecht.Id)
- Sprache (char(2))
- Name (nvarchar(50))
```

### **Tip 2 Çeviri Tabloları** (Code + Sort tabloları için)

```
Sütunlar:
- {AnaTabloCode} (nvarchar(20), PK)
- Sprache (char(2), NOT NULL, PK) → "de" veya "tr"
- Name (nvarchar(30-50), NOT NULL)

Örnek: BeitragPeriodeUebersetzung
- BeitragPeriodeCode (PK, FK → BeitragPeriode.Code)
- Sprache (char(2), PK)
- Name (nvarchar(30))
```

### **Tip 3 Çeviri Tablosu** (Staatsangehoerigkeit için)

```
Sütunlar:
- Id (int, IDENTITY, PK)
- StaatsangehoerigkeitId (int, NOT NULL, FK)
- Sprache (char(2), NOT NULL) → "de" veya "tr"
- Name (nvarchar(100), NOT NULL)
```

---

## ⚠️ Kritik Kısıtlamalar

### **1. UNIQUE Constraints**

```
✅ Code değerleri UNIQUE NONCLUSTERED ile korunur
❌ Aynı Code iki kez eklenemez
❌ NULL değer kabul etmez

Örnek Hata:
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M'); 
-- Hata: Violation of UNIQUE KEY constraint
```

### **2. Foreign Key Constraints**

```
✅ Çeviri tablosundaki Id'ler ana tabloda var olmalı
❌ Geçersiz Id referansı hata verir

Örnek Hata:
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (999, 'de', 'Test');
-- Hata: The INSERT, UPDATE, or DELETE statement conflicted with a FOREIGN KEY constraint
```

### **3. Sprache Constraint**

```
✅ Sadece "de" (Deutsch) veya "tr" (Türkçe)
❌ Diğer dil kodları kabul edilmez

Desteklenen Diller:
- "de" → Almanca
- "tr" → Türkçe

Örnek Hata:
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'en', 'Male');
-- Hata: Constraint violation (uygulama seviyesinde kontrol)
```

### **4. NOT NULL Constraints**

```
✅ Tüm zorunlu alanlar doldurulmalı
❌ NULL değer kabul etmez

Zorunlu Alanlar:
- Code (tüm tablolarda)
- Sprache (çeviri tablolarında)
- Name (çeviri tablolarında)
- Iso2, Iso3 (Staatsangehoerigkeit'te)
```

### **5. PRIMARY KEY Constraints**

```
Kategori 1 & 3: Id (IDENTITY)
- Otomatik artan
- Tekrar edemez

Kategori 2: Code
- Manuel giriş
- Tekrar edemez
- Çeviri tablosunda referans alınır
```

---

## 🔍 Veri Ekleme Sırası

**Doğru Sıra:**

1. **Ana tablo** → Code/Iso2/Iso3 ekle
2. **Çeviri tablosu** → Her dil için çeviri ekle

```sql
-- ✅ DOĞRU SIRADA

-- 1. Ana tablo
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');

-- 2. Çeviri tablosu (ana tablo kaydı oluşturulduktan sonra)
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'de', 'Männlich');
```

**Yanlış Sıra:**

```sql
-- ❌ YANLIŞ SIRADA

-- 1. Çeviri tablosu (ana tablo kaydı henüz yok!)
INSERT INTO [Keytable].[GeschlechtUebersetzung] 
  (GeschlechtId, Sprache, Name) 
VALUES (1, 'de', 'Männlich');
-- Hata: Foreign Key constraint violation

-- 2. Ana tablo
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
```

---

## ✅ Veri Ekleme Kontrol Listesi

- [ ] **Code değerleri eşsiz mi?** (UNIQUE)
- [ ] **Sprache sadece "de" veya "tr" mi?**
- [ ] **Her ana kayıt için her dil çevirisi var mı?**
- [ ] **Foreign key referansları geçerli mi?**
- [ ] **Staatsangehoerigkeit için Iso2 ve Iso3 eşsiz mi?**
- [ ] **Hiçbir zorunlu alan boş değil mi?** (NOT NULL)
- [ ] **Ana tablo önce, çeviri tablosu sonra mı eklendi?**
- [ ] **Sort değerleri sıralı mı?** (BeitragPeriode, BeitragZahlungstagTyp)
- [ ] **Code uzunluğu sınırı aşmıyor mu?**
  - Geschlecht: max 10
  - Waehrung: max 10
  - ZahlungTyp: max 30
  - Diğerleri: max 20

---

## 🚀 Hızlı Referans

| Kısıtlama | Tür | Etki |
|-----------|-----|------|
| UNIQUE (Code) | Constraint | Tekrar eden Code'lar hata verir |
| NOT NULL | Constraint | Boş değerler hata verir |
| FOREIGN KEY | Constraint | Geçersiz referanslar hata verir |
| IDENTITY | Özellik | Otomatik artan Id |
| Sprache | Uygulama | Sadece "de" veya "tr" |
| PRIMARY KEY | Constraint | Tekrar eden PK hata verir |

