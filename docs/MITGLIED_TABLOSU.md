# Mitglied Tablosu Dokümantasyonu

## 📋 Genel Bakış

**Tablo Adı:** `[Mitglied].[Mitglied]`  
**Schema:** Mitglied  
**Açıklama:** Dernek üyelerinin (members/association members) bilgilerini tutan ana tablodur.

## 🎯 Ne İşe Yarar?

`Mitglied` tablosu, bir derneğe (Verein) kayıtlı olan **tüm üyelerin** kişisel ve üyelik bilgilerini saklar. Bu tablo:

- ✅ Dernek üyelerinin kimlik bilgilerini tutar
- ✅ Üyelik durumlarını ve tiplerini yönetir
- ✅ İletişim bilgilerini saklar
- ✅ Üyelik aidatı (Beitrag) bilgilerini içerir
- ✅ Aile ilişkilerini yönetir
- ✅ Etkinlik kayıtlarını takip eder

## 👥 Kimler Bu Tabloda?

### Tüm Dernek Üyeleri:
1. **Normal Üyeler** (Mitglied)
2. **Dernek Yöneticileri** (Vorstandsvorsitzender)
3. **Yönetim Kurulu Üyeleri**
4. **Onursal Üyeler**
5. **Pasif Üyeler**

> ⚠️ **ÖNEMLİ:** Dernek Yöneticileri de bu tabloda kayıtlıdır! Yönetici olup olmadıkları `Verein.Vorstandsvorsitzender` alanından kontrol edilir.

## 📊 Tablo Yapısı

### Temel Kimlik Bilgileri
| Alan | Tip | Açıklama |
|------|-----|----------|
| `Id` | int | Benzersiz üye kimliği (Primary Key) |
| `VereinId` | int | Hangi derneğe ait (Foreign Key → Verein) |
| `Mitgliedsnummer` | string(30) | Üye numarası (örn: M001, B001) |
| `Vorname` | string(100) | Ad |
| `Nachname` | string(100) | Soyad |
| `GeschlechtId` | int? | Cinsiyet (Foreign Key → Geschlecht) |
| `Geburtsdatum` | date? | Doğum tarihi |
| `Geburtsort` | string(100)? | Doğum yeri |
| `StaatsangehoerigkeitId` | int? | Uyruk (Foreign Key → Staatsangehoerigkeit) |

### İletişim Bilgileri
| Alan | Tip | Açıklama |
|------|-----|----------|
| `Email` | string(100)? | E-posta adresi |
| `Telefon` | string(30)? | Telefon numarası |
| `Mobiltelefon` | string(30)? | Cep telefonu |

### Üyelik Bilgileri
| Alan | Tip | Açıklama |
|------|-----|----------|
| `MitgliedStatusId` | int | Üyelik durumu (Foreign Key → MitgliedStatus) |
| `MitgliedTypId` | int | Üye tipi (Foreign Key → MitgliedTyp) |
| `Eintrittsdatum` | date? | Derneğe giriş tarihi |
| `Austrittsdatum` | date? | Dernekten çıkış tarihi |
| `Bemerkung` | string(250)? | Notlar |
| `Aktiv` | bool | Aktif mi? |

### Aidat (Beitrag) Bilgileri
| Alan | Tip | Açıklama |
|------|-----|----------|
| `BeitragBetrag` | decimal(18,2)? | Aidat tutarı |
| `BeitragWaehrungId` | int? | Para birimi (Foreign Key → Waehrung) |
| `BeitragPeriodeCode` | string(20)? | Ödeme periyodu (Aylık, Yıllık, vb.) |
| `BeitragZahlungsTag` | int? | Ödeme günü |
| `BeitragZahlungstagTypCode` | string(20)? | Ödeme günü tipi |
| `BeitragIstPflicht` | bool? | Aidat zorunlu mu? |

### Audit Alanları (AuditableEntity'den)
| Alan | Tip | Açıklama |
|------|-----|----------|
| `Created` | datetime | Oluşturulma tarihi |
| `CreatedBy` | string | Oluşturan kullanıcı |
| `Modified` | datetime? | Son değişiklik tarihi |
| `ModifiedBy` | string? | Son değiştiren kullanıcı |
| `DeletedFlag` | bool | Silinmiş mi? (Soft delete) |

## 🔗 İlişkiler (Navigation Properties)

### 1. Verein (Dernek)
```csharp
public virtual Verein? Verein { get; set; }
```
- Her üye bir derneğe aittir
- `VereinId` ile ilişkilendirilir

### 2. MitgliedAdressen (Üye Adresleri)
```csharp
public virtual ICollection<MitgliedAdresse> MitgliedAdressen { get; set; }
```
- Bir üyenin birden fazla adresi olabilir (ev, iş, vb.)
- One-to-Many ilişki

### 3. FamilienbeziehungenAlsKind (Çocuk Olarak Aile İlişkileri)
```csharp
public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsKind { get; set; }
```
- Bu üyenin ebeveynleri/vasileri
- One-to-Many ilişki

### 4. FamilienbeziehungenAlsElternteil (Ebeveyn Olarak Aile İlişkileri)
```csharp
public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsElternteil { get; set; }
```
- Bu üyenin çocukları/bakmakla yükümlü olduğu kişiler
- One-to-Many ilişki

### 5. VeranstaltungAnmeldungen (Etkinlik Kayıtları)
```csharp
public virtual ICollection<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; }
```
- Üyenin katıldığı etkinlikler
- One-to-Many ilişki

## 📝 Örnek Veriler

### Demo Veritabanındaki Üyeler:

#### München Derneği (TDKV München)
```sql
-- Dernek Yöneticisi
Mitgliedsnummer: M001
Vorname: Ahmet
Nachname: Yılmaz
Email: ahmet.yilmaz@email.com
Telefon: +49 89 111111111
Geburtsdatum: 1975-05-12
Eintrittsdatum: 2020-01-15
Rol: Vorstandsvorsitzender (Verein tablosunda belirtilir)

-- Normal Üye
Mitgliedsnummer: M002
Vorname: Fatma
Nachname: Özkan
Email: fatma.ozkan@email.com
Telefon: +49 89 222222222
Geburtsdatum: 1982-09-08
Eintrittsdatum: 2021-03-10
Rol: Üye
```

## 🔐 Kimlik Doğrulama (Authentication)

### Dernek Yöneticisi Nasıl Belirlenir?

1. Kullanıcı email ile giriş yapar
2. `Mitglied` tablosunda email aranır
3. Bulunursa → `Verein` tablosuna gidilir
4. `Verein.Vorstandsvorsitzender` alanı kontrol edilir
5. Eğer `Vorstandsvorsitzender` = "Ahmet Yılmaz" ise → `userType: "dernek"`
6. Değilse → `userType: "mitglied"`

### Kod Örneği (AuthController):
```csharp
var mitglied = mitglieder.FirstOrDefault(m => m.Email == request.Email);
if (mitglied != null)
{
    var verein = await _vereinService.GetByIdAsync(mitglied.VereinId);
    bool isVereinAdmin = verein?.Vorstandsvorsitzender?.Contains(
        mitglied.Vorname + " " + mitglied.Nachname
    ) == true;
    
    if (isVereinAdmin)
        return "dernek"; // Dernek Yöneticisi
    else
        return "mitglied"; // Normal Üye
}
```

## ❓ Sık Sorulan Sorular

### 1. Dernek Yöneticisi ayrı bir tabloda mı?
**Hayır!** Dernek Yöneticileri de `Mitglied` tablosundadır. Yönetici olup olmadıkları `Verein.Vorstandsvorsitzender` alanından kontrol edilir.

### 2. Bir kişi birden fazla derneğe üye olabilir mi?
**Evet!** Aynı kişi farklı `VereinId` değerleriyle birden fazla kayıt olarak eklenebilir.

### 3. Email zorunlu mu?
**Hayır!** Email opsiyoneldir (`Email?`). Ancak sisteme giriş yapabilmek için email gereklidir.

### 4. Mitgliedsnummer nasıl oluşturulur?
Genellikle dernek kısaltması + sıra numarası formatındadır:
- München: M001, M002, M003...
- Berlin: B001, B002, B003...

## 🎯 Özet

`[Mitglied].[Mitglied]` tablosu:
- ✅ Tüm dernek üyelerini tutar (yöneticiler dahil)
- ✅ Kişisel ve iletişim bilgilerini saklar
- ✅ Üyelik durumu ve aidat bilgilerini yönetir
- ✅ Aile ilişkileri ve etkinlik kayıtlarıyla bağlantılıdır
- ✅ Kimlik doğrulama için kullanılır

