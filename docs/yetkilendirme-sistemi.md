# Yetkilendirme Sistemi

## 📋 Genel Bakış

Verein yönetim sisteminde 3 farklı kullanıcı tipi vardır ve her birinin farklı yetkileri bulunmaktadır.

---

## 👥 Kullanıcı Tipleri

### 1. **Admin** (Sistem Yöneticisi)
- **Tanım**: Tüm sistemi yönetebilen süper kullanıcı
- **Giriş**: Email'de "admin" kelimesi içeren herhangi bir email
- **Yetkiler**: Tüm işlemler için tam yetki

### 2. **Dernek** (Verein Yöneticisi)
- **Tanım**: Bir derneğin yöneticisi (Vorstandsvorsitzender)
- **Giriş**: Dernek üyesi olarak kayıtlı ve Vorstandsvorsitzender olarak belirlenmiş
- **Yetkiler**: Sadece kendi derneğinin verileri üzerinde yetki

### 3. **Mitglied** (Üye)
- **Tanım**: Bir derneğin normal üyesi
- **Giriş**: Dernek üyesi olarak kayıtlı
- **Yetkiler**: Sadece okuma ve kendi verilerini düzenleme

---

## 🔐 Adres Yönetimi Yetkileri

### Yetki Matrisi

| İşlem | Admin | Dernek Yöneticisi | Üye |
|-------|-------|-------------------|-----|
| **Tüm Adresleri Görüntüleme** | ✅ | ❌ | ❌ |
| **Kendi Derneğinin Adreslerini Görüntüleme** | ✅ | ✅ | ✅ |
| **Adres Ekleme** | ✅ Her derneğe | ✅ Kendi derneğine | ❌ |
| **Adres Düzenleme** | ✅ Tüm adresler | ✅ Kendi derneğinin | ❌ |
| **Adres Silme** | ✅ Tüm adresler | ✅ Kendi derneğinin | ❌ |
| **Varsayılan Adres Ayarlama** | ✅ | ✅ | ❌ |

---

## 🎯 Permission Sistemi

### Backend Permissions (AuthController)

#### Admin Permissions
```csharp
Permissions = new[] { 
    "admin.all",           // Tüm admin işlemleri
    "verein.all",          // Tüm dernek işlemleri
    "mitglied.all",        // Tüm üye işlemleri
    "veranstaltung.all",   // Tüm etkinlik işlemleri
    "adresse.all"          // Tüm adres işlemleri
}
```

#### Dernek Yöneticisi Permissions
```csharp
Permissions = new[] { 
    "verein.read",         // Dernek okuma
    "verein.update",       // Dernek güncelleme
    "mitglied.all",        // Tüm üye işlemleri (kendi derneğinde)
    "veranstaltung.all",   // Tüm etkinlik işlemleri (kendi derneğinde)
    "adresse.manage"       // Adres yönetimi (kendi derneğinde)
}
```

#### Üye Permissions
```csharp
Permissions = new[] { 
    "mitglied.read",       // Üye okuma
    "mitglied.update",     // Kendi bilgilerini güncelleme
    "veranstaltung.read",  // Etkinlik okuma
    "adresse.read"         // Adres okuma
}
```

---

## 💻 Frontend Yetkilendirme

### AuthContext Kullanımı

```typescript
import { useAuth } from '../../contexts/AuthContext';

const { user } = useAuth();

// Yetki kontrolü fonksiyonu
const canEditAddress = (): boolean => {
  if (!user) return false;
  
  // Admin her şeyi yapabilir
  if (user.type === 'admin') return true;
  
  // Dernek yöneticisi sadece kendi derneğinin adreslerini düzenleyebilir
  if (user.type === 'dernek' && user.vereinId === vereinId) return true;
  
  // Üyeler düzenleyemez
  return false;
};
```

### Buton Görünürlüğü

```tsx
{/* Sadece yetkili kullanıcılar için göster */}
{canEditAddress() && (
  <button onClick={handleAddAdresse}>
    + Adres Ekle
  </button>
)}
```

---

## 📊 Veritabanı İlişkileri

### Adresse Tablosu
```sql
CREATE TABLE Adresse (
    Id INTEGER PRIMARY KEY,
    VereinId INTEGER,  -- Hangi derneğe ait
    Strasse TEXT,
    PLZ TEXT,
    Ort TEXT,
    IstStandard BOOLEAN,
    Aktiv BOOLEAN,
    -- ... diğer alanlar
    FOREIGN KEY (VereinId) REFERENCES Verein(Id)
);
```

### Yetkilendirme Mantığı
1. Her adres bir `VereinId` ile ilişkilidir
2. Dernek yöneticisi sadece `user.vereinId === adresse.vereinId` olan adresleri yönetebilir
3. Admin tüm adresleri yönetebilir
4. Üyeler sadece görüntüleyebilir

---

## 🔄 Yetkilendirme Akışı

### 1. Login
```
Kullanıcı → AuthController.Login() → Permissions belirlenir → Frontend'e gönderilir
```

### 2. Frontend Yetki Kontrolü
```
Sayfa yüklenir → useAuth() ile user bilgisi alınır → canEditAddress() kontrolü → UI güncellenir
```

### 3. İşlem Yapma
```
Kullanıcı butona tıklar → Frontend kontrolü → API isteği → Backend kontrolü (gelecekte) → İşlem
```

---

## ✅ Uygulanan Kontroller

### Frontend (VereinDetail.tsx)
- ✅ `canEditAddress()` fonksiyonu eklendi
- ✅ "Adres Ekle" butonu sadece yetkili kullanıcılara gösteriliyor
- ✅ "Düzenle" ve "Sil" butonları sadece yetkili kullanıcılara gösteriliyor
- ✅ Admin tüm derneklerin adreslerini yönetebilir
- ✅ Dernek yöneticisi sadece kendi derneğinin adreslerini yönetebilir
- ✅ Üyeler sadece görüntüleyebilir

### Backend (AuthController.cs)
- ✅ Admin için `adresse.all` permission eklendi
- ✅ Dernek yöneticisi için `adresse.manage` permission eklendi
- ✅ Üye için `adresse.read` permission eklendi

---

## 🚀 Gelecek Geliştirmeler

### Backend Yetkilendirme (Önerilen)
```csharp
[HttpPut("{id}")]
public async Task<ActionResult<AdresseDto>> Update(int id, [FromBody] UpdateAdresseDto updateDto)
{
    // 1. Kullanıcı bilgisini al (JWT token'dan)
    var userType = User.Claims.FirstOrDefault(c => c.Type == "UserType")?.Value;
    var vereinId = User.Claims.FirstOrDefault(c => c.Type == "VereinId")?.Value;
    
    // 2. Adresi al
    var adresse = await _adresseService.GetByIdAsync(id);
    
    // 3. Yetki kontrolü
    if (userType != "admin" && adresse.VereinId.ToString() != vereinId)
    {
        return Forbid("Bu adresi düzenleme yetkiniz yok");
    }
    
    // 4. İşlemi yap
    var result = await _adresseService.UpdateAsync(id, updateDto);
    return Ok(result);
}
```

### Middleware Ekleme
```csharp
// Startup.cs veya Program.cs
app.UseAuthentication();
app.UseAuthorization();
```

### Attribute-Based Authorization
```csharp
[Authorize(Roles = "admin,dernek")]
[HttpPost]
public async Task<ActionResult<AdresseDto>> Create([FromBody] CreateAdresseDto createDto)
{
    // ...
}
```

---

## 📝 Test Senaryoları

### Senaryo 1: Admin Kullanıcı
1. Admin olarak login ol
2. Herhangi bir derneğin detay sayfasına git
3. ✅ "Adres Ekle" butonu görünür
4. ✅ "Düzenle" ve "Sil" butonları görünür
5. ✅ Adres ekleyebilir, düzenleyebilir, silebilir

### Senaryo 2: Dernek Yöneticisi
1. Dernek yöneticisi olarak login ol
2. Kendi derneğinin detay sayfasına git
3. ✅ "Adres Ekle" butonu görünür
4. ✅ "Düzenle" ve "Sil" butonları görünür
5. Başka bir derneğin detay sayfasına git
6. ❌ "Adres Ekle" butonu görünmez
7. ❌ "Düzenle" ve "Sil" butonları görünmez

### Senaryo 3: Üye
1. Üye olarak login ol
2. Derneğin detay sayfasına git
3. ❌ "Adres Ekle" butonu görünmez
4. ❌ "Düzenle" ve "Sil" butonları görünmez
5. ✅ Adresleri görüntüleyebilir
6. ✅ "Haritada Göster" butonu çalışır

---

## 🎯 Özet

**Adres Yönetimi Yetkilendirmesi:**
- ✅ **Admin**: Tüm adresleri yönetebilir
- ✅ **Dernek Yöneticisi**: Sadece kendi derneğinin adreslerini yönetebilir
- ✅ **Üye**: Sadece görüntüleyebilir

**Uygulama:**
- ✅ Frontend'de yetkilendirme kontrolleri eklendi
- ✅ Backend'de permission sistemi güncellendi
- ✅ UI butonları yetkilere göre gösteriliyor/gizleniyor

**Güvenlik:**
- ✅ Frontend kontrolü aktif
- ⏳ Backend kontrolü (gelecekte JWT ile eklenecek)
- ✅ Kullanıcı deneyimi optimize edildi

