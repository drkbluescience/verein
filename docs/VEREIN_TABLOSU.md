# Verein.Verein Tablosu - Detaylı Dokümantasyon

## 📋 Genel Bakış

**Tablo Adı:** `[Verein].[Verein]`  
**Schema:** Verein  
**Açıklama:** Dernek (Association/Organization) bilgilerini tutan ana tablodur.

## 🎯 Ne İşe Yarar?

`Verein` tablosu, sistemdeki **derneklerin** (associations) tüm temel bilgilerini saklar:
- ✅ Dernek kimlik ve iletişim bilgileri
- ✅ Yasal ve resmi bilgiler
- ✅ Yönetim bilgileri
- ✅ Finansal bilgiler
- ✅ Dijital entegrasyon bilgileri

---

## 📊 Tablo Yapısı - Tüm Sütunlar

### 🔑 Primary Key
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| **Id** | int IDENTITY(1,1) | Benzersiz dernek kimliği (Primary Key) |

---

### 📝 Temel Bilgiler

#### 1. **Name** (Zorunlu)
- **Tip:** nvarchar(200) NOT NULL
- **Açıklama:** Derneğin tam resmi adı
- **Örnek:** "Türkisch-Deutscher Kulturverein München"
- **Kullanım:** Tüm resmi belgelerde ve ekranlarda gösterilir

#### 2. **Kurzname** (Opsiyonel)
- **Tip:** nvarchar(50) NULL
- **Açıklama:** Derneğin kısa adı veya kısaltması
- **Örnek:** "TDKV München"
- **Kullanım:** Menülerde, listelerde kısa gösterim için

#### 3. **Zweck** (Opsiyonel)
- **Tip:** nvarchar(500) NULL
- **Açıklama:** Derneğin amacı, misyonu
- **Örnek:** "Kultureller Austausch und Integration in München"
- **Kullanım:** Dernek tanıtımı, raporlar

---

### 🏛️ Resmi/Yasal Bilgiler

#### 4. **Vereinsnummer** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Resmi dernek kayıt numarası
- **Örnek:** "VR 12345"
- **Kullanım:** Resmi yazışmalar, yasal belgeler

#### 5. **Steuernummer** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Vergi numarası
- **Örnek:** "143/123/45678"
- **Kullanım:** Vergi beyannameleri, faturalar

#### 6. **UstIdNr** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** KDV kimlik numarası (Umsatzsteuer-Identifikationsnummer)
- **Örnek:** "DE123456789"
- **Kullanım:** AB içi işlemler, faturalar

#### 7. **RechtsformId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Hukuki yapı türü (Foreign Key → Rechtsform tablosu)
- **Örnek:** 1 = "e.V." (eingetragener Verein)
- **Kullanım:** Yasal sınıflandırma

#### 8. **Gruendungsdatum** (Opsiyonel)
- **Tip:** date NULL
- **Açıklama:** Derneğin kuruluş tarihi
- **Örnek:** "1985-03-15"
- **Kullanım:** Yıldönümü kutlamaları, istatistikler

---

### 📞 İletişim Bilgileri

#### 9. **Telefon** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Ana telefon numarası
- **Örnek:** "+49 89 123456789"
- **Kullanım:** İletişim, acil durumlar

#### 10. **Fax** (Opsiyonel)
- **Tip:** nvarchar(30) NULL
- **Açıklama:** Faks numarası
- **Örnek:** "+49 89 123456788"
- **Kullanım:** Resmi yazışmalar

#### 11. **Email** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Derneğin resmi e-posta adresi
- **Örnek:** "info@tdkv-muenchen.de"
- **Kullanım:** Kurumsal iletişim
- **⚠️ NOT:** Bu email giriş için KULLANILMAZ! Sadece kurumsal iletişim için.

#### 12. **Webseite** (Opsiyonel)
- **Tip:** nvarchar(200) NULL
- **Açıklama:** Derneğin web sitesi URL'i
- **Örnek:** "https://www.tdkv-muenchen.de"
- **Kullanım:** Tanıtım, bilgilendirme

#### 13. **SocialMediaLinks** (Opsiyonel)
- **Tip:** nvarchar(500) NULL
- **Açıklama:** Sosyal medya bağlantıları (JSON veya virgülle ayrılmış)
- **Örnek:** "facebook.com/tdkv,instagram.com/tdkv"
- **Kullanım:** Sosyal medya entegrasyonu

---

### 👥 Yönetim Bilgileri

#### 14. **Vorstandsvorsitzender** (Opsiyonel) ⚠️
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Dernek başkanının adı
- **Örnek:** "Ahmet Yılmaz"
- **Kullanım:** Kimlik doğrulama, yetkilendirme
- **⚠️ SORUN:** Sadece string, Mitglied ile ilişkisi YOK!
- **🔧 İYİLEŞTİRME GEREKLİ:** Foreign Key olmalı

#### 15. **Geschaeftsfuehrer** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Genel müdür/yönetici adı
- **Örnek:** "Mehmet Demir"
- **Kullanım:** Yönetim hiyerarşisi

#### 16. **Kontaktperson** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Ana iletişim kişisi
- **Örnek:** "Fatma Özkan"
- **Kullanım:** Günlük iletişim

#### 17. **VertreterEmail** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Temsilcinin e-posta adresi
- **Örnek:** "vertreter@tdkv-muenchen.de"
- **Kullanım:** Resmi yazışmalar

---

### 📍 Adres ve Banka Bilgileri

#### 18. **AdresseId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Ana adres kimliği (Foreign Key → Adresse tablosu)
- **Kullanım:** Derneğin fiziksel adresi
- **İlişki:** One-to-One (HauptAdresse navigation property)

#### 19. **HauptBankkontoId** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Ana banka hesabı kimliği (Foreign Key → Bankkonto tablosu)
- **Kullanım:** Finansal işlemler için varsayılan hesap
- **İlişki:** One-to-One (HauptBankkonto navigation property)

---

### 📊 İstatistik Bilgileri

#### 20. **Mitgliederzahl** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Toplam üye sayısı
- **Örnek:** 245
- **Kullanım:** İstatistikler, raporlar
- **⚠️ NOT:** Manuel güncellenir, otomatik hesaplanmaz

---

### 📄 Dosya Yolları

#### 21. **SatzungPfad** (Opsiyonel)
- **Tip:** nvarchar(200) NULL
- **Açıklama:** Dernek tüzüğü dosya yolu
- **Örnek:** "/documents/satzung_tdkv.pdf"
- **Kullanım:** Tüzük belgesi erişimi

#### 22. **LogoPfad** (Opsiyonel)
- **Tip:** nvarchar(200) NULL
- **Açıklama:** Dernek logosu dosya yolu
- **Örnek:** "/images/logos/tdkv_logo.png"
- **Kullanım:** Arayüzde logo gösterimi

---

### 💳 Finansal/Entegrasyon Bilgileri

#### 23. **SEPA_GlaeubigerID** (Opsiyonel)
- **Tip:** nvarchar(50) NULL
- **Açıklama:** SEPA alacaklı kimliği (otomatik ödeme tahsilatı için)
- **Örnek:** "DE98ZZZ09999999999"
- **Kullanım:** SEPA direct debit işlemleri

#### 24. **Mandantencode** (Opsiyonel)
- **Tip:** nvarchar(50) NULL
- **Açıklama:** Müşteri/mandant kodu (multi-tenant sistemler için)
- **Örnek:** "TDKV-MUC-001"
- **Kullanım:** Sistem entegrasyonu, veri ayrımı

#### 25. **ExterneReferenzId** (Opsiyonel)
- **Tip:** nvarchar(50) NULL
- **Açıklama:** Harici sistem referans kimliği
- **Örnek:** "EXT-12345"
- **Kullanım:** Üçüncü parti sistem entegrasyonları

---

### 🔐 Dijital İmza ve E-Posta

#### 26. **ElektronischeSignaturKey** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** Elektronik imza anahtarı
- **Kullanım:** Dijital belge imzalama

#### 27. **EPostEmpfangAdresse** (Opsiyonel)
- **Tip:** nvarchar(100) NULL
- **Açıklama:** E-Posta (elektronik posta) alma adresi
- **Örnek:** "epost@tdkv-muenchen.de"
- **Kullanım:** Resmi elektronik posta sistemi

---

### ✅ Durum Bilgileri

#### 28. **Aktiv** (Opsiyonel)
- **Tip:** bit NULL
- **Açıklama:** Dernek aktif mi?
- **Değerler:** 1 = Aktif, 0 = Pasif
- **Kullanım:** Kapatılmış dernekleri filtreleme

---

### 🕐 Audit Alanları (AuditableEntity'den)

#### 29. **Created** (Opsiyonel)
- **Tip:** datetime NULL
- **Açıklama:** Kaydın oluşturulma tarihi
- **Varsayılan:** GETDATE()

#### 30. **CreatedBy** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Kaydı oluşturan kullanıcı ID'si

#### 31. **Modified** (Opsiyonel)
- **Tip:** datetime NULL
- **Açıklama:** Son değişiklik tarihi

#### 32. **ModifiedBy** (Opsiyonel)
- **Tip:** int NULL
- **Açıklama:** Son değiştiren kullanıcı ID'si

#### 33. **DeletedFlag** (Opsiyonel)
- **Tip:** bit NULL
- **Açıklama:** Soft delete bayrağı
- **Değerler:** 1 = Silinmiş, 0 = Aktif
- **Varsayılan:** 0

---

## 🔗 Navigation Properties (İlişkiler)

### 1. HauptAdresse
```csharp
public virtual Adresse? HauptAdresse { get; set; }
```
- Derneğin ana adresi
- Foreign Key: AdresseId

### 2. HauptBankkonto
```csharp
public virtual Bankkonto? HauptBankkonto { get; set; }
```
- Derneğin ana banka hesabı
- Foreign Key: HauptBankkontoId

### 3. Bankkonten
```csharp
public virtual ICollection<Bankkonto> Bankkonten { get; set; }
```
- Derneğin tüm banka hesapları
- One-to-Many ilişki

### 4. Veranstaltungen
```csharp
public virtual ICollection<Veranstaltung> Veranstaltungen { get; set; }
```
- Derneğin düzenlediği etkinlikler
- One-to-Many ilişki

### 5. Mitglieder
```csharp
public virtual ICollection<Mitglied> Mitglieder { get; set; }
```
- Derneğin üyeleri
- One-to-Many ilişki

### 6. MitgliedFamilien
```csharp
public virtual ICollection<MitgliedFamilie> MitgliedFamilien { get; set; }
```
- Dernek içindeki aile ilişkileri
- One-to-Many ilişki

### 7. RechtlicheDaten
```csharp
public virtual RechtlicheDaten? RechtlicheDaten { get; set; }
```
- Derneğin yasal verileri
- One-to-One ilişki

---

## 📝 Örnek Veri

```sql
INSERT INTO [Verein].[Verein] VALUES (
    Name: 'Türkisch-Deutscher Kulturverein München',
    Kurzname: 'TDKV München',
    Zweck: 'Kultureller Austausch und Integration',
    Telefon: '+49 89 123456789',
    Email: 'info@tdkv-muenchen.de',
    Webseite: 'https://www.tdkv-muenchen.de',
    Gruendungsdatum: '1985-03-15',
    Mitgliederzahl: 245,
    Vereinsnummer: 'VR 12345',
    Steuernummer: '143/123/45678',
    Vorstandsvorsitzender: 'Ahmet Yılmaz',
    Kontaktperson: 'Fatma Özkan',
    Aktiv: 1
)
```

---

## ⚠️ Önemli Notlar

1. **Email Alanı:** Derneğin kurumsal email'i, giriş için KULLANILMAZ!
2. **Vorstandsvorsitzender:** Sadece string, Foreign Key DEĞİL (iyileştirme gerekli)
3. **Mitgliederzahl:** Manuel güncellenir, otomatik hesaplanmaz
4. **Soft Delete:** DeletedFlag = 1 olan kayıtlar silinmiş sayılır
5. **Aktiv:** Kapatılmış dernekler için 0 yapılır

---

## 🎯 Özet

`[Verein].[Verein]` tablosu **33 sütun** içerir:
- ✅ 1 Primary Key (Id)
- ✅ 5 Audit alanı (Created, CreatedBy, Modified, ModifiedBy, DeletedFlag)
- ✅ 27 İş verisi alanı
- ✅ 7 Navigation Property (ilişkiler)

---

## 📋 Hızlı Referans Tablosu

| # | Sütun | Tip | Zorunlu | Açıklama |
|---|-------|-----|---------|----------|
| 1 | Id | int | ✅ | Primary Key |
| 2 | Name | nvarchar(200) | ✅ | Dernek adı |
| 3 | Kurzname | nvarchar(50) | ❌ | Kısa ad |
| 4 | Vereinsnummer | nvarchar(30) | ❌ | Kayıt numarası |
| 5 | Steuernummer | nvarchar(30) | ❌ | Vergi numarası |
| 6 | UstIdNr | nvarchar(30) | ❌ | KDV numarası |
| 7 | RechtsformId | int | ❌ | Hukuki yapı (FK) |
| 8 | Gruendungsdatum | date | ❌ | Kuruluş tarihi |
| 9 | Zweck | nvarchar(500) | ❌ | Amaç/Misyon |
| 10 | AdresseId | int | ❌ | Ana adres (FK) |
| 11 | HauptBankkontoId | int | ❌ | Ana banka hesabı (FK) |
| 12 | Telefon | nvarchar(30) | ❌ | Telefon |
| 13 | Fax | nvarchar(30) | ❌ | Faks |
| 14 | Email | nvarchar(100) | ❌ | Kurumsal email |
| 15 | Webseite | nvarchar(200) | ❌ | Web sitesi |
| 16 | SocialMediaLinks | nvarchar(500) | ❌ | Sosyal medya |
| 17 | Vorstandsvorsitzender | nvarchar(100) | ❌ | Başkan adı ⚠️ |
| 18 | Geschaeftsfuehrer | nvarchar(100) | ❌ | Genel müdür |
| 19 | VertreterEmail | nvarchar(100) | ❌ | Temsilci email |
| 20 | Kontaktperson | nvarchar(100) | ❌ | İletişim kişisi |
| 21 | Mitgliederzahl | int | ❌ | Üye sayısı |
| 22 | SatzungPfad | nvarchar(200) | ❌ | Tüzük dosyası |
| 23 | LogoPfad | nvarchar(200) | ❌ | Logo dosyası |
| 24 | ExterneReferenzId | nvarchar(50) | ❌ | Harici referans |
| 25 | Mandantencode | nvarchar(50) | ❌ | Mandant kodu |
| 26 | EPostEmpfangAdresse | nvarchar(100) | ❌ | E-Posta adresi |
| 27 | SEPA_GlaeubigerID | nvarchar(50) | ❌ | SEPA kimliği |
| 28 | ElektronischeSignaturKey | nvarchar(100) | ❌ | E-imza anahtarı |
| 29 | Aktiv | bit | ❌ | Aktif mi? |
| 30 | Created | datetime | ❌ | Oluşturulma tarihi |
| 31 | CreatedBy | int | ❌ | Oluşturan |
| 32 | Modified | datetime | ❌ | Değişiklik tarihi |
| 33 | ModifiedBy | int | ❌ | Değiştiren |
| 34 | DeletedFlag | bit | ❌ | Silinmiş mi? |

