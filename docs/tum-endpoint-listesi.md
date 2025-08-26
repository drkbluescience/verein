# Verein API - Tüm Endpoint'ler Listesi

## 🎯 **API Base URL**
- **Development**: `http://localhost:5103`
- **Production**: `https://localhost:7117`
- **Swagger UI**: `http://localhost:5103` (Root URL)

## 📍 **Tüm Mevcut Endpoint'ler**

### 🏢 **1. VereineController - Dernek Yönetimi**
**Base Route**: `/api/Vereine`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/Vereine` | Tüm dernekleri listele | ✅ **Tested & Working** |
| `GET` | `/api/Vereine/{id}` | ID'ye göre dernek getir | ✅ Implemented |
| `POST` | `/api/Vereine` | Yeni dernek oluştur | ✅ **Tested & Working** |
| `PUT` | `/api/Vereine/{id}` | Derneği güncelle | ✅ Implemented |
| `DELETE` | `/api/Vereine/{id}` | Derneği sil (soft delete) | ✅ Implemented |

**Örnek Kullanım:**
```json
POST /api/Vereine
{
  "name": "Test Verein",
  "aktiv": true,
  "telefon": "+49 30 12345678",
  "webseite": "https://www.test-verein.de"
}
```

---

### 🏠 **2. AdressenController - Adres Yönetimi**
**Base Route**: `/api/Adressen`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/Adressen` | Tüm adresleri listele | ✅ **Tested & Working** |
| `GET` | `/api/Adressen/{id}` | ID'ye göre adres getir | ✅ Implemented |
| `GET` | `/api/Adressen/verein/{vereinId}` | Derneğe göre adresleri getir | ✅ Implemented |
| `POST` | `/api/Adressen` | Yeni adres oluştur | ✅ **Tested & Working** |
| `PUT` | `/api/Adressen/{id}` | Adresi güncelle | ✅ Implemented |
| `DELETE` | `/api/Adressen/{id}` | Adresi sil (soft delete) | ✅ Implemented |

**Örnek Kullanım:**
```json
POST /api/Adressen
{
  "vereinId": 1,
  "strasse": "Musterstraße",
  "hausnummer": "123",
  "plz": "12345",
  "ort": "Berlin",
  "istStandard": true
}
```

---

### 🏦 **3. BankkontenController - Banka Hesabı Yönetimi**
**Base Route**: `/api/Bankkonten`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/Bankkonten` | Tüm banka hesaplarını listele | ✅ Implemented |
| `GET` | `/api/Bankkonten/{id}` | ID'ye göre banka hesabı getir | ✅ Implemented |
| `GET` | `/api/Bankkonten/verein/{vereinId}` | Derneğe göre hesapları getir | ✅ Implemented |
| `POST` | `/api/Bankkonten` | Yeni banka hesabı oluştur | ✅ Implemented |
| `PUT` | `/api/Bankkonten/{id}` | Banka hesabını güncelle | ✅ Implemented |
| `DELETE` | `/api/Bankkonten/{id}` | Banka hesabını sil (soft delete) | ✅ Implemented |

**Özel Özellikler:**
- IBAN benzersizlik kontrolü
- Otomatik BIC doğrulama

---

### 🎉 **4. VeranstaltungenController - Etkinlik Yönetimi**
**Base Route**: `/api/Veranstaltungen`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/Veranstaltungen` | Tüm etkinlikleri listele | ✅ Implemented |
| `GET` | `/api/Veranstaltungen/{id}` | ID'ye göre etkinlik getir | ✅ Implemented |
| `GET` | `/api/Veranstaltungen/verein/{vereinId}` | Derneğe göre etkinlikleri getir | ✅ Implemented |
| `POST` | `/api/Veranstaltungen` | Yeni etkinlik oluştur | ✅ Implemented |
| `PUT` | `/api/Veranstaltungen/{id}` | Etkinliği güncelle | ✅ Implemented |
| `DELETE` | `/api/Veranstaltungen/{id}` | Etkinliği sil (soft delete) | ✅ Implemented |

---

### 📝 **5. VeranstaltungAnmeldungenController - Etkinlik Kayıtları**
**Base Route**: `/api/VeranstaltungAnmeldungen`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/VeranstaltungAnmeldungen` | Tüm kayıtları listele | ✅ Implemented |
| `GET` | `/api/VeranstaltungAnmeldungen/{id}` | ID'ye göre kayıt getir | ✅ Implemented |
| `GET` | `/api/VeranstaltungAnmeldungen/veranstaltung/{veranstaltungId}` | Etkinliğe göre kayıtları getir | ✅ Implemented |
| `POST` | `/api/VeranstaltungAnmeldungen` | Yeni kayıt oluştur | ✅ Implemented |
| `PUT` | `/api/VeranstaltungAnmeldungen/{id}` | Kaydı güncelle | ✅ Implemented |
| `DELETE` | `/api/VeranstaltungAnmeldungen/{id}` | Kaydı sil (soft delete) | ✅ Implemented |

---

### 📸 **6. VeranstaltungBilderController - Etkinlik Resimleri**
**Base Route**: `/api/VeranstaltungBilder`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/VeranstaltungBilder` | Tüm resimleri listele | ✅ Implemented |
| `GET` | `/api/VeranstaltungBilder/{id}` | ID'ye göre resim getir | ✅ Implemented |
| `GET` | `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}` | Etkinliğe göre resimleri getir | ✅ Implemented |
| `POST` | `/api/VeranstaltungBilder` | Yeni resim yükle | ✅ Implemented |
| `PUT` | `/api/VeranstaltungBilder/{id}` | Resim bilgilerini güncelle | ✅ Implemented |
| `DELETE` | `/api/VeranstaltungBilder/{id}` | Resmi sil (soft delete) | ✅ Implemented |

**Özel Özellikler:**
- Dosya yükleme desteği
- Resim metadata yönetimi

---

### 🏥 **7. HealthController - Sistem Durumu**
**Base Route**: `/api/Health`

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/api/Health` | Temel sistem durumu | ✅ **Working** |
| `GET` | `/api/Health/detailed` | Detaylı sistem durumu | ✅ **Working** |

**Örnek Response:**
```json
{
  "Status": "Healthy",
  "Timestamp": "2025-08-26T13:45:23.137Z",
  "Version": "1.0.0",
  "Environment": "Development",
  "Database": "Connected",
  "Uptime": "00:15:30.123"
}
```

---

### 🔧 **8. Sistem Endpoint'leri**

| HTTP Method | Endpoint | Açıklama | Test Durumu |
|-------------|----------|----------|-------------|
| `GET` | `/health` | ASP.NET Core Health Check | ✅ **Working** |
| `GET` | `/` | Swagger UI Ana Sayfa | ✅ **Working** |
| `GET` | `/swagger/v1/swagger.json` | OpenAPI JSON Şeması | ✅ **Working** |

---

## 🎯 **Endpoint Özellikleri**

### ✅ **Ortak Özellikler:**
- **Soft Delete**: Tüm DELETE işlemleri mantıksal silme
- **Audit Trail**: Created, Modified, CreatedBy, ModifiedBy alanları
- **Error Handling**: Global exception handling
- **Logging**: Tüm işlemler loglanıyor
- **Validation**: Input validation ve error responses

### 📊 **Response Formatları:**
- **200 OK**: Başarılı GET işlemleri
- **201 Created**: Başarılı POST işlemleri
- **204 No Content**: Başarılı PUT/DELETE işlemleri
- **400 Bad Request**: Validation hataları
- **404 Not Found**: Kayıt bulunamadı
- **500 Internal Server Error**: Sunucu hataları

### 🔗 **Foreign Key İlişkileri:**
- **Adresse** → **Verein** (VereinId)
- **Bankkonto** → **Verein** (VereinId)
- **Veranstaltung** → **Verein** (VereinId)
- **VeranstaltungAnmeldung** → **Veranstaltung** (VeranstaltungId)
- **VeranstaltungBild** → **Veranstaltung** (VeranstaltungId)

## 🚀 **Kullanım Önerileri**

### 1. **Swagger UI Kullanımı:**
- `http://localhost:5103` adresinde interaktif test
- "Try it out" ile gerçek API çağrıları
- Otomatik request/response örnekleri

### 2. **Test Sırası:**
1. Önce `POST /api/Vereine` ile dernek oluştur
2. Dönen ID ile `POST /api/Adressen` ile adres ekle
3. Diğer endpoint'leri test et

### 3. **Hata Ayıklama:**
- `/api/Health/detailed` ile sistem durumunu kontrol et
- Log dosyalarını `logs/` klasöründe incele
- Swagger UI'da response kodlarını takip et

**Toplam: 31 Endpoint (7 Controller + 4 Sistem Endpoint'i)** 🎯
