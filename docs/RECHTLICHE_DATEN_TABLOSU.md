# 📋 RechtlicheDaten Tablosu Dokümantasyonu

## 📊 Genel Bakış

`Verein.RechtlicheDaten` tablosu, derneklerin yasal ve resmi bilgilerini saklamak için oluşturulmuştur.

**Tablo Adı:** `[Verein].[RechtlicheDaten]`  
**İlişki Tipi:** 1-to-1 (Her derneğin bir yasal veri kaydı)  
**Foreign Key:** `VereinId` → `Verein.Verein.Id`

---

## 🎯 Amaç

Bu tablo aşağıdaki bilgileri saklar:
1. ✅ Mahkeme kayıt bilgileri (Registergericht)
2. ✅ Vergi dairesi bilgileri (Finanzamt)
3. ✅ Vergi durumu (Steuerpflichtig, Steuerbefreit)
4. ✅ Kamu yararı statüsü (Gemeinnützigkeit)
5. ✅ Yasal belgeler (Vergi beyannamesi, tüzük, vb.)

---

## 📋 Tablo Yapısı

### Temel Alanlar
| Alan | Tip | Null | Açıklama |
|------|-----|------|----------|
| `Id` | int | NO | Primary Key (IDENTITY) |
| `VereinId` | int | NO | Foreign Key → Verein.Verein.Id |
| `Created` | datetime | YES | Oluşturulma tarihi |
| `CreatedBy` | int | YES | Oluşturan kullanıcı ID |
| `Modified` | datetime | YES | Güncellenme tarihi |
| `ModifiedBy` | int | YES | Güncelleyen kullanıcı ID |
| `DeletedFlag` | bit | YES | Silinme durumu (0=Aktif, 1=Silinmiş) |

### Mahkeme Bilgileri (Registergericht)
| Alan | Tip | Null | Açıklama | Örnek |
|------|-----|------|----------|-------|
| `RegistergerichtName` | nvarchar(200) | YES | Mahkeme adı | "Amtsgericht München" |
| `RegistergerichtNummer` | nvarchar(50) | YES | Kayıt numarası | "VR 12345" |
| `RegistergerichtOrt` | nvarchar(100) | YES | Mahkeme şehri | "München" |
| `RegistergerichtEintragungsdatum` | date | YES | Kayıt tarihi | "1985-03-15" |

### Vergi Dairesi Bilgileri (Finanzamt)
| Alan | Tip | Null | Açıklama | Örnek |
|------|-----|------|----------|-------|
| `FinanzamtName` | nvarchar(200) | YES | Vergi dairesi adı | "Finanzamt München" |
| `FinanzamtNummer` | nvarchar(50) | YES | Vergi dairesi numarası | "143/123/45678" |
| `FinanzamtOrt` | nvarchar(100) | YES | Vergi dairesi şehri | "München" |

### Vergi Durumu
| Alan | Tip | Null | Default | Açıklama |
|------|-----|------|---------|----------|
| `Steuerpflichtig` | bit | YES | 1 | Vergiye tabi mi? |
| `Steuerbefreit` | bit | YES | 0 | Vergi muafiyeti var mı? |
| `GemeinnuetzigAnerkannt` | bit | YES | 0 | Kamu yararına tanınmış mı? |
| `GemeinnuetzigkeitBis` | date | YES | NULL | Kamu yararı statüsü geçerlilik tarihi |

### Belgeler (Dosya Yolları)
| Alan | Tip | Null | Açıklama |
|------|-----|------|----------|
| `SteuererklaerungPfad` | nvarchar(500) | YES | Vergi beyannamesi dosya yolu |
| `SteuererklaerungJahr` | int | YES | Beyanname yılı |
| `SteuerbefreiungPfad` | nvarchar(500) | YES | Vergi muafiyet belgesi dosya yolu |
| `GemeinnuetzigkeitsbescheidPfad` | nvarchar(500) | YES | Kamu yararı belgesi dosya yolu |
| `RegisterauszugPfad` | nvarchar(500) | YES | Mahkeme kayıt belgesi dosya yolu |

### Diğer
| Alan | Tip | Null | Açıklama |
|------|-----|------|----------|
| `Bemerkung` | nvarchar(1000) | YES | Notlar/Açıklamalar |

---

## 🔑 İlişkiler ve Kısıtlamalar

### Foreign Keys
```sql
FK_RechtlicheDaten_Verein
  VereinId → Verein.Verein.Id
  ON DELETE CASCADE
```

### Indexes
1. **IX_RechtlicheDaten_VereinId** - VereinId üzerinde index (performans)
2. **IX_RechtlicheDaten_DeletedFlag** - DeletedFlag üzerinde index (filtreleme)
3. **IX_RechtlicheDaten_VereinId_Unique** - Her derneğin sadece bir aktif kaydı olabilir

---

## 📁 SQL Dosyaları

### 1. Tam Kurulum (Sıfırdan)
```bash
1. database/APPLICATION_H_101_AZURE.sql  # Tüm tabloları oluşturur (RechtlicheDaten dahil)
2. database/COMPLETE_DEMO_DATA.sql       # Demo veriler (2 dernek + yasal verileri)
```

### 2. Sadece RechtlicheDaten Tablosu Eklemek
```bash
database/ADD_RECHTLICHE_DATEN_TABLE.sql  # Sadece bu tabloyu ekler
```

### 3. Tüm Verileri Temizleme
```bash
database/CLEAN_ALL_DATA.sql  # RechtlicheDaten dahil tüm verileri siler
```

---

## 🚀 Kullanım Örnekleri

### Yeni Kayıt Ekleme
```sql
INSERT INTO [Verein].[RechtlicheDaten] (
    VereinId, RegistergerichtName, RegistergerichtNummer,
    FinanzamtName, Steuerpflichtig, GemeinnuetzigAnerkannt,
    Created, CreatedBy, DeletedFlag
) VALUES (
    1, 
    N'Amtsgericht München', 
    N'VR 12345',
    N'Finanzamt München',
    0,  -- Vergiye tabi değil
    1,  -- Kamu yararına tanınmış
    GETDATE(),
    1,
    0
);
```

### Dernek ile Birlikte Sorgulama
```sql
SELECT 
    v.Name AS DernekAdi,
    r.RegistergerichtName,
    r.RegistergerichtNummer,
    r.FinanzamtName,
    r.GemeinnuetzigAnerkannt,
    r.GemeinnuetzigkeitBis
FROM [Verein].[Verein] v
LEFT JOIN [Verein].[RechtlicheDaten] r ON v.Id = r.VereinId
WHERE v.DeletedFlag = 0 AND (r.DeletedFlag = 0 OR r.DeletedFlag IS NULL);
```

---

## ✅ Sonraki Adımlar

1. ✅ **Veritabanı:** SQL dosyaları güncellendi
2. ⏳ **Backend:** Entity, DTO, Service oluşturulacak
3. ⏳ **Frontend:** Yasal bilgiler sayfası eklenecek
4. ⏳ **API:** CRUD endpoint'leri eklenecek

---

## 📝 Notlar

- Tüm alanlar **nullable** (opsiyonel)
- `ON DELETE CASCADE`: Dernek silinirse yasal veriler de silinir
- Unique constraint: Her derneğin sadece **bir aktif** yasal veri kaydı olabilir
- Dosya yolları: Belge yükleme sistemi için hazır

