# CLEAN_ALL_DATA.sql - Kullanım Rehberi

## ⚠️ UYARI

**Bu dosya veritabanındaki TÜM verileri siler!**

```
🚨 Bu işlem GERİ ALINAMAZ!
🚨 Lütfen çalıştırmadan önce veritabanını yedekleyin!
🚨 Üretim (Production) ortamında kullanmayın!
```

---

## 📋 Genel Bilgi

**Dosya Adı:** `docs/CLEAN_ALL_DATA.sql`

**Amaç:** Veritabanındaki tüm verileri temizlemek

**Boyut:** 350+ satır

**Silme Sırası:** Child tables → Parent tables → Keytable

---

## 🗑️ Silinen Veriler

### **1. Finanz Verileri (5 tablo)**

| Tablo | Açıklama |
|-------|----------|
| MitgliedForderungZahlung | Ödeme tahsisleri |
| MitgliedVorauszahlung | Ödeme avansları |
| MitgliedZahlung | Ödemeler |
| MitgliedForderung | Talep/Faturalar |
| BankBuchung | Banka hareketleri |

### **2. Demo Verileri (6 tablo)**

| Tablo | Açıklama |
|-------|----------|
| VeranstaltungAnmeldung | Etkinlik kayıtları |
| Veranstaltung | Etkinlikler |
| MitgliedFamilie | Aile ilişkileri |
| Mitglied | Üyeler |
| Bankkonto | Banka hesapları |
| Verein | Dernekler |

### **2. Keytable Çeviri Verileri (16 tablo)**

```
GeschlechtUebersetzung
MitgliedStatusUebersetzung
MitgliedTypUebersetzung
WaehrungUebersetzung
ZahlungTypUebersetzung
ZahlungStatusUebersetzung
ForderungsartUebersetzung
ForderungsstatusUebersetzung
FamilienbeziehungTypUebersetzung
MitgliedFamilieStatusUebersetzung
BeitragPeriodeUebersetzung
BeitragZahlungstagTypUebersetzung
StaatsangehoerigkeitUebersetzung
AdresseTypUebersetzung
KontotypUebersetzung
RechtsformUebersetzung
```

### **3. Keytable Ana Verileri (16 tablo)**

```
Geschlecht
MitgliedStatus
MitgliedTyp
Waehrung
ZahlungTyp
ZahlungStatus
Forderungsart
Forderungsstatus
FamilienbeziehungTyp
MitgliedFamilieStatus
BeitragPeriode
BeitragZahlungstagTyp
Staatsangehoerigkeit
AdresseTyp
Kontotyp
Rechtsform
```

---

## 🔄 Silme Sırası

Dosya aşağıdaki sırada veri siler:

```
1️⃣  MitgliedForderungZahlung (Ödeme tahsisleri)
2️⃣  MitgliedVorauszahlung (Ödeme avansları)
3️⃣  MitgliedZahlung (Ödemeler)
4️⃣  MitgliedForderung (Talep/Faturalar)
5️⃣  BankBuchung (Banka hareketleri)
6️⃣  VeranstaltungAnmeldung (Etkinlik kayıtları)
7️⃣  Veranstaltung (Etkinlikler)
8️⃣  MitgliedFamilie (Aile ilişkileri)
9️⃣  Mitglied (Üyeler)
🔟 Bankkonto (Banka hesapları)
1️⃣1️⃣ Verein (Dernekler)
1️⃣2️⃣ Keytable Çeviri Tabloları (16 tablo)
1️⃣3️⃣ Keytable Ana Tabloları (16 tablo)
```

**Neden bu sıra?**
- Foreign key ilişkilerini dikkate almak için
- Child tables önce, parent tables sonra
- Finanz tabloları en önce (en çok referans alan)
- Veri bütünlüğünü korumak için

---

## 🛠️ Dosya Özellikleri

### **1. Foreign Key Constraints Yönetimi**

```sql
-- Silme işlemi öncesi devre dışı bırak
ALTER TABLE [Verein].[VeranstaltungAnmeldung] NOCHECK CONSTRAINT ALL;

-- Silme işlemi sonrası yeniden etkinleştir
ALTER TABLE [Verein].[VeranstaltungAnmeldung] CHECK CONSTRAINT ALL;
```

✅ **Avantajlar:**
- Silme işlemini hızlandırır
- Constraint hatalarını önler
- Veri bütünlüğünü korur

### **2. IDENTITY Seed Sıfırlama**

```sql
DBCC CHECKIDENT ('[Verein].[Verein]', RESEED, 0);
DBCC CHECKIDENT ('[Mitglied].[Mitglied]', RESEED, 0);
```

✅ **Avantajlar:**
- Yeni veriler 1'den başlar
- Veritabanı temiz başlar
- Önceki Id'ler kullanılmaz

### **3. Kontrol Sorgusu**

```sql
SELECT 'Verein' as Tablo, COUNT(*) as Kayıt_Sayısı FROM [Verein].[Verein]
UNION ALL
SELECT 'Mitglied', COUNT(*) FROM [Mitglied].[Mitglied]
-- ... diğer tablolar
```

✅ **Avantajlar:**
- Silme işleminin başarısını doğrular
- Tüm tabloların boş olduğunu gösterir
- Hata kontrolü sağlar

---

## 🚀 Çalıştırma Adımları

### **Adım 1: Veritabanını Yedekle**

```sql
-- SQL Server Management Studio'da
BACKUP DATABASE [VEREIN] 
TO DISK = 'C:\Backups\VEREIN_Backup_2025-11-02.bak'
```

### **Adım 2: CLEAN_ALL_DATA.sql Dosyasını Çalıştır**

**SQL Server Management Studio (SSMS):**
```
1. SSMS'i aç
2. Veritabanına bağlan
3. CLEAN_ALL_DATA.sql dosyasını aç
4. F5 tuşuna bas veya "Execute" butonuna tıkla
5. Kontrol sorgusunun çıktısını kontrol et
```

**PowerShell / Command Line:**
```powershell
sqlcmd -S localhost -U sa -P YourPassword -i CLEAN_ALL_DATA.sql
```

### **Adım 3: Kontrol Sorgusunun Çıktısını Doğrula**

Tüm tablolar 0 kayıt göstermeli:

```
Tablo                    Kayıt_Sayısı
─────────────────────────────────────
AdresseTyp               0
BeitragPeriode           0
BeitragZahlungstagTyp    0
Forderungsart            0
Forderungsstatus         0
Geschlecht               0
Kontotyp                 0
MitgliedFamilieStatus    0
MitgliedFamilie          0
MitgliedStatus           0
MitgliedTyp              0
Mitglied                 0
Rechtsform               0
Staatsangehoerigkeit     0
Veranstaltung            0
VeranstaltungAnmeldung   0
Verein                   0
Waehrung                 0
ZahlungStatus            0
ZahlungTyp               0
```

---

## 📝 Dosya İçeriği Özeti

| Bölüm | Satır Aralığı | Açıklama |
|-------|--------------|---------|
| Header | 1-14 | Dosya başlığı ve uyarı |
| FK Devre Dışı | 15-30 | Foreign Key Constraints devre dışı |
| Demo Veri Silme | 31-100 | 5 demo tablosundan veri sil |
| Keytable Çeviri Silme | 101-130 | 16 çeviri tablosundan veri sil |
| Keytable Ana Silme | 131-150 | 16 ana tablodan veri sil |
| FK Etkinleştir | 151-165 | Foreign Key Constraints yeniden etkinleştir |
| IDENTITY Sıfırla | 166-185 | IDENTITY Seed değerlerini sıfırla |
| Kontrol Sorgusu | 186-220 | Silme başarısını doğrula |
| Özet | 221-240 | Özet ve tamamlama mesajı |

---

## ✅ Güvenlik Kontrol Listesi

- [ ] **Veritabanını yedekledin mi?** (BACKUP DATABASE)
- [ ] **Üretim ortamında değil misin?** (Development/Test ortamında mı?)
- [ ] **Dosyayı dikkatli okudum mu?** (Tüm uyarıları anladım mı?)
- [ ] **Başka kullanıcılar bağlı değil mi?** (Veritabanına kimse bağlı mı?)
- [ ] **Silme işlemini geri almak istersen yedekten restore edebilirsin mi?**

---

## 🔄 Silme Sonrası

### **Yeni Veriler Eklemek İçin**

```
1. CLEAN_ALL_DATA.sql      ← Tüm verileri sil
2. COMPLETE_DEMO_DATA.sql  ← Yeni demo verilerini ekle
```

### **Veritabanını Restore Etmek İçin**

```sql
-- SQL Server Management Studio'da
RESTORE DATABASE [VEREIN] 
FROM DISK = 'C:\Backups\VEREIN_Backup_2025-11-02.bak'
WITH REPLACE
```

---

## 📊 Silme İstatistikleri

```
┌──────────────────────────────────────────┐
│ SİLİNEN TABLOLAR: 43                     │
├──────────────────────────────────────────┤
│ Finanz Tabloları: 5                      │
│ Demo Tabloları: 6                        │
│ Keytable Çeviri Tabloları: 16            │
│ Keytable Ana Tabloları: 16               │
├──────────────────────────────────────────┤
│ IDENTITY SEED SIFIRLANACAK: 19           │
│ FOREIGN KEY CONSTRAINTS: 5               │
│ KONTROL SORGUSU: 26 tablo                │
└──────────────────────────────────────────┘
```

---

## 🎯 Sonuç

✅ **Tüm veriler silinir**
✅ **IDENTITY Seed sıfırlanır**
✅ **Foreign Key Constraints korunur**
✅ **Kontrol sorgusu ile doğrulama yapılır**
✅ **Veritabanı temiz başlar**

---

## 🚨 Acil Durum

**Eğer silme işlemini yanlışlıkla çalıştırdıysan:**

```sql
-- 1. Veritabanını yedekten restore et
RESTORE DATABASE [VEREIN] 
FROM DISK = 'C:\Backups\VEREIN_Backup_2025-11-02.bak'
WITH REPLACE

-- 2. Veritabanını çevrimiçi yap
ALTER DATABASE [VEREIN] SET ONLINE
```

---

**Lütfen bu dosyayı dikkatli kullanın! ⚠️**

