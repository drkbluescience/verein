# MitgliedTypId - Üye Tipi Açıklaması

## 📋 Genel Bakış

**Tablo:** `[Keytable].[MitgliedTyp]`  
**Açıklama:** Üye tiplerini tanımlayan referans (lookup) tablosudur.

## 🎯 Ne İşe Yarar?

`MitgliedTypId`, bir üyenin **hangi kategoride** olduğunu belirtir:
- ✅ Normal üye mi?
- ✅ Onursal üye mi?
- ✅ Fahri üye mi?
- ✅ Aile üyesi mi?
- ✅ Kurumsal üye mi?

Bu bilgi, üyenin **haklarını**, **aidat yükümlülüklerini** ve **ayrıcalıklarını** belirler.

---

## 📊 Tablo Yapısı

### Keytable.MitgliedTyp
```sql
CREATE TABLE [Keytable].[MitgliedTyp](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Code] [nvarchar](20) NOT NULL,
    PRIMARY KEY (Id),
    UNIQUE (Code)
)
```

### Keytable.MitgliedTypUebersetzung
```sql
CREATE TABLE [Keytable].[MitgliedTypUebersetzung](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [MitgliedTypId] [int] NOT NULL,
    [Sprache] [char](2) NOT NULL,
    [Name] [nvarchar](50) NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY (MitgliedTypId) REFERENCES MitgliedTyp(Id)
)
```

---

## 🔢 Olası Değerler

Demo data'dan çıkarılan bilgilere göre:

### 1. **VOLLMITGLIED** (Tam Üye)
- **Code:** `VOLLMITGLIED`
- **Türkçe:** Tam Üye / Normal Üye
- **Almanca:** Vollmitglied
- **Açıklama:** Derneğin tam haklara sahip normal üyesi
- **Aidat:** Zorunlu
- **Oy Hakkı:** Var
- **Kullanım:** En yaygın üye tipi

**Örnek:**
```sql
MitgliedTypId: 1  -- VOLLMITGLIED
BeitragIstPflicht: 1  -- Aidat zorunlu
```

---

### 2. **EHRENMITGLIED** (Onursal Üye)
- **Code:** `EHRENMITGLIED`
- **Türkçe:** Onursal Üye
- **Almanca:** Ehrenmitglied
- **Açıklama:** Derneğe özel hizmetleri olan, onur üyesi yapılan kişi
- **Aidat:** Genellikle muaf
- **Oy Hakkı:** Var (tüzüğe göre)
- **Kullanım:** Özel durumlar

**Örnek:**
```sql
MitgliedTypId: 2  -- EHRENMITGLIED
BeitragIstPflicht: 0  -- Aidat muafiyeti
```

---

### 3. **FOERDERMITGLIED** (Destekleyici Üye)
- **Code:** `FOERDERMITGLIED`
- **Türkçe:** Destekleyici Üye
- **Almanca:** Fördermitglied
- **Açıklama:** Derneği maddi olarak destekleyen ama tam haklara sahip olmayan üye
- **Aidat:** Var (genellikle daha yüksek)
- **Oy Hakkı:** Yok (tüzüğe göre)
- **Kullanım:** Sponsorlar, destekçiler

**Örnek:**
```sql
MitgliedTypId: 3  -- FOERDERMITGLIED
BeitragIstPflicht: 1
BeitragBetrag: 100.00  -- Daha yüksek aidat
```

---

### 4. **FAMILIENMITGLIED** (Aile Üyesi)
- **Code:** `FAMILIENMITGLIED`
- **Türkçe:** Aile Üyesi
- **Almanca:** Familienmitglied
- **Açıklama:** Bir tam üyenin aile bireyi (eş, çocuk)
- **Aidat:** İndirimli veya muaf
- **Oy Hakkı:** Yaşa göre değişir
- **Kullanım:** Aile üyelikleri

**Örnek:**
```sql
MitgliedTypId: 4  -- FAMILIENMITGLIED
BeitragIstPflicht: 1
BeitragBetrag: 25.00  -- İndirimli aidat
```

---

### 5. **JUGENDMITGLIED** (Genç Üye)
- **Code:** `JUGENDMITGLIED`
- **Türkçe:** Genç Üye
- **Almanca:** Jugendmitglied
- **Açıklama:** 18 yaş altı gençler için özel üyelik
- **Aidat:** İndirimli veya muaf
- **Oy Hakkı:** Genellikle yok
- **Kullanım:** Gençlik programları

**Örnek:**
```sql
MitgliedTypId: 5  -- JUGENDMITGLIED
BeitragIstPflicht: 0
Geburtsdatum: '2010-05-15'  -- 18 yaş altı
```

---

### 6. **PASSIVMITGLIED** (Pasif Üye)
- **Code:** `PASSIVMITGLIED`
- **Türkçe:** Pasif Üye
- **Almanca:** Passivmitglied
- **Açıklama:** Dernek faaliyetlerine aktif katılmayan ama üyeliğini sürdüren kişi
- **Aidat:** Var (genellikle düşük)
- **Oy Hakkı:** Var ama kullanmıyor
- **Kullanım:** Emekliler, uzakta yaşayanlar

**Örnek:**
```sql
MitgliedTypId: 6  -- PASSIVMITGLIED
BeitragIstPflicht: 1
BeitragBetrag: 30.00  -- Düşük aidat
```

---

### 7. **FIRMENMITGLIED** (Kurumsal Üye)
- **Code:** `FIRMENMITGLIED`
- **Türkçe:** Kurumsal Üye
- **Almanca:** Firmenmitglied
- **Açıklama:** Şirket veya kurum olarak üyelik
- **Aidat:** Yüksek
- **Oy Hakkı:** Temsilci aracılığıyla
- **Kullanım:** Sponsor şirketler

**Örnek:**
```sql
MitgliedTypId: 7  -- FIRMENMITGLIED
BeitragIstPflicht: 1
BeitragBetrag: 500.00  -- Yüksek aidat
```

---

## 📝 Kullanım Örnekleri

### Örnek 1: Normal Üye Kaydı
```sql
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, Email, BeitragIstPflicht
) VALUES (
    1, 'M001', 1, 1,  -- MitgliedTypId = 1 (VOLLMITGLIED)
    'Ahmet', 'Yılmaz', 'ahmet@email.com', 1
)
```

### Örnek 2: Onursal Üye Kaydı
```sql
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, Email, BeitragIstPflicht
) VALUES (
    1, 'E001', 1, 2,  -- MitgliedTypId = 2 (EHRENMITGLIED)
    'Mehmet', 'Demir', 'mehmet@email.com', 0  -- Aidat muafiyeti
)
```

---

## 🔍 Sorgular

### Tüm Üye Tiplerini Getir
```sql
SELECT 
    mt.Id,
    mt.Code,
    mtu.Sprache,
    mtu.Name
FROM [Keytable].[MitgliedTyp] mt
LEFT JOIN [Keytable].[MitgliedTypUebersetzung] mtu ON mt.Id = mtu.MitgliedTypId
ORDER BY mt.Id, mtu.Sprache
```

### Üye Tipine Göre İstatistik
```sql
SELECT 
    mt.Code,
    COUNT(m.Id) AS UyeSayisi,
    AVG(m.BeitragBetrag) AS OrtalamaBeitrag
FROM [Mitglied].[Mitglied] m
INNER JOIN [Keytable].[MitgliedTyp] mt ON m.MitgliedTypId = mt.Id
WHERE m.DeletedFlag = 0 AND m.Aktiv = 1
GROUP BY mt.Code
ORDER BY UyeSayisi DESC
```

---

## ⚠️ Önemli Notlar

1. **Zorunlu Alan:** Her üye mutlaka bir `MitgliedTypId`'ye sahip olmalı
2. **Aidat İlişkisi:** Üye tipi genellikle aidat miktarını etkiler
3. **Haklar:** Üye tipi, oy hakkı ve diğer hakları belirler
4. **Çok Dilli:** Her üye tipi için Türkçe ve Almanca çeviri var
5. **Değiştirilebilir:** Bir üyenin tipi zamanla değişebilir (örn: Genç → Tam Üye)

---

## 🎯 Özet

`MitgliedTypId` **7 farklı değer** alabilir:

| ID | Code | Türkçe | Aidat | Oy Hakkı |
|----|------|--------|-------|----------|
| 1 | VOLLMITGLIED | Tam Üye | Zorunlu | ✅ |
| 2 | EHRENMITGLIED | Onursal Üye | Muaf | ✅ |
| 3 | FOERDERMITGLIED | Destekleyici Üye | Yüksek | ❌ |
| 4 | FAMILIENMITGLIED | Aile Üyesi | İndirimli | Yaşa göre |
| 5 | JUGENDMITGLIED | Genç Üye | Muaf/İndirimli | ❌ |
| 6 | PASSIVMITGLIED | Pasif Üye | Düşük | ✅ |
| 7 | FIRMENMITGLIED | Kurumsal Üye | Yüksek | Temsilci ile |

**Not:** Gerçek değerler veritabanında kontrol edilmelidir. Bu liste genel dernek uygulamalarına göre hazırlanmıştır.

