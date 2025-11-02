# Verein API - Tüm Endpoint'ler Listesi

## 🎯 **API Base URL**
- **Development**: `http://localhost:5103`
- **Production**: `https://localhost:7117`
- **Swagger UI**: `http://localhost:5103` (Root URL)

## 📊 **Özet İstatistikler**
- **Toplam Controller**: 15
- **Toplam Backend Endpoint**: 131
- **Toplam Frontend Endpoint**: 129
- **Frontend Kullanım Oranı**: %98.5%
- **Kullanılmayan Backend Endpoint**: 2 (GetByIban, ValidateIban)

---

## 📍 **Tüm Mevcut Endpoint'ler**

### 🏢 **1. VereineController - Dernek Yönetimi**
**Base Route**: `/api/Vereine`
**Toplam Endpoint**: 7

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Vereine` | Tüm dernekleri listele | `[RequireAdmin]` | ✅ Aktif |
| `GET` | `/api/Vereine/{id}` | ID'ye göre dernek getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Vereine/active` | Aktif dernekleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Vereine/{id}/full-details` | Dernek detayları (adres, banka vb.) | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/Vereine` | Yeni dernek oluştur | `[RequireAdmin]` | ✅ Aktif |
| `PUT` | `/api/Vereine/{id}` | Derneği güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `DELETE` | `/api/Vereine/{id}` | Derneği sil (soft delete) | `[RequireAdmin]` | ✅ Aktif |

**Frontend Kullanım**: `vereinService.ts` (21 API çağrısı)

---

### 🏠 **2. AdressenController - Adres Yönetimi (Dernek Adresleri)**
**Base Route**: `/api/Adressen`
**Toplam Endpoint**: 8

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Adressen` | Tüm adresleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Adressen/{id}` | ID'ye göre adres getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Adressen/verein/{vereinId}` | Derneğe göre adresleri getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/Adressen` | Yeni adres oluştur | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PUT` | `/api/Adressen/{id}` | Adresi güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PATCH` | `/api/Adressen/{id}/set-default` | Varsayılan adres olarak ayarla | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/Adressen/{id}` | Adresi sil (soft delete) | `[RequireAdminOrDernek]` | ✅ Aktif |

**Frontend Kullanım**: `adresseService.ts` (6 API çağrısı)

---

### 🏦 **3. BankkontenController - Banka Hesabı Yönetimi**
**Base Route**: `/api/Bankkonten`
**Toplam Endpoint**: 9

| HTTP Method | Endpoint | Açıklama | Yetki | Durum | Frontend |
|-------------|----------|----------|-------|-------|----------|
| `GET` | `/api/Bankkonten` | Tüm banka hesaplarını listele | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `GET` | `/api/Bankkonten/{id}` | ID'ye göre banka hesabı getir | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `GET` | `/api/Bankkonten/verein/{vereinId}` | Derneğe göre hesapları getir | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `GET` | `/api/Bankkonten/iban/{iban}` | IBAN'a göre hesap getir | `[Authorize]` | ✅ Aktif | ❌ Kullanılmıyor |
| `POST` | `/api/Bankkonten` | Yeni banka hesabı oluştur | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `POST` | `/api/Bankkonten/validate-iban` | IBAN doğrulama | `[Authorize]` | ✅ Aktif | ❌ Kullanılmıyor |
| `PUT` | `/api/Bankkonten/{id}` | Banka hesabını güncelle | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `PATCH` | `/api/Bankkonten/{id}/set-default` | Varsayılan hesap olarak ayarla | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |
| `DELETE` | `/api/Bankkonten/{id}` | Banka hesabını sil (soft delete) | `[Authorize]` | ✅ Aktif | ✅ Kullanılıyor |

**Özel Özellikler**: IBAN benzersizlik kontrolü, Otomatik BIC doğrulama
**Frontend Kullanım**: `bankkontoService.ts` (6 API çağrısı)

---

### 🎉 **4. VeranstaltungenController - Etkinlik Yönetimi**
**Base Route**: `/api/Veranstaltungen`
**Toplam Endpoint**: 8

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Veranstaltungen` | Tüm etkinlikleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Veranstaltungen/{id}` | ID'ye göre etkinlik getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Veranstaltungen/verein/{vereinId}` | Derneğe göre etkinlikleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Veranstaltungen/upcoming` | Yaklaşan etkinlikleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Veranstaltungen/date-range` | Tarih aralığına göre etkinlikler | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/Veranstaltungen` | Yeni etkinlik oluştur | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PUT` | `/api/Veranstaltungen/{id}` | Etkinliği güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `DELETE` | `/api/Veranstaltungen/{id}` | Etkinliği sil (soft delete) | `[RequireAdminOrDernek]` | ✅ Aktif |

**Frontend Kullanım**: `veranstaltungService.ts` (22 API çağrısı - Anmeldungen ve Bilder dahil)

---

### 📝 **5. VeranstaltungAnmeldungenController - Etkinlik Kayıtları**
**Base Route**: `/api/VeranstaltungAnmeldungen`
**Toplam Endpoint**: 9

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/VeranstaltungAnmeldungen` | Tüm kayıtları listele | `[RequireAdminOrDernek]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungAnmeldungen/{id}` | ID'ye göre kayıt getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungAnmeldungen/veranstaltung/{veranstaltungId}` | Etkinliğe göre kayıtları getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungAnmeldungen/mitglied/{mitgliedId}` | Üyeye göre kayıtları getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungAnmeldungen/status/{status}` | Duruma göre kayıtları getir | `[RequireAdminOrDernek]` | ✅ Aktif |
| `POST` | `/api/VeranstaltungAnmeldungen` | Yeni kayıt oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/VeranstaltungAnmeldungen/{id}` | Kaydı güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PATCH` | `/api/VeranstaltungAnmeldungen/{id}/status` | Kayıt durumunu güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `DELETE` | `/api/VeranstaltungAnmeldungen/{id}` | Kaydı sil (soft delete) | `[RequireAdminOrDernek]` | ✅ Aktif |

**Frontend Kullanım**: `veranstaltungAnmeldungService.ts` (9 API çağrısı)

---

### 📸 **6. VeranstaltungBilderController - Etkinlik Resimleri**
**Base Route**: `/api/VeranstaltungBilder`
**Toplam Endpoint**: 8

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/VeranstaltungBilder` | Tüm resimleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungBilder/{id}` | ID'ye göre resim getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}` | Etkinliğe göre resimleri getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/VeranstaltungBilder/upload/{veranstaltungId}` | Resim yükle (multipart/form-data) | `[RequireAdminOrDernek]` | ✅ Aktif |
| `POST` | `/api/VeranstaltungBilder` | Yeni resim kaydı oluştur | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PUT` | `/api/VeranstaltungBilder/{id}` | Resim bilgilerini güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PATCH` | `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}/reorder` | Resim sıralamasını güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `DELETE` | `/api/VeranstaltungBilder/{id}` | Resmi sil (soft delete) | `[RequireAdminOrDernek]` | ✅ Aktif |

**Özel Özellikler**: Dosya yükleme desteği, Resim metadata yönetimi, Sıralama

---

### 👥 **7. MitgliederController - Üye Yönetimi**
**Base Route**: `/api/Mitglieder`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Mitglieder` | Tüm üyeleri listele (sayfalama) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Mitglieder/{id}` | ID'ye göre üye getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Mitglieder/verein/{vereinId}` | Derneğe göre üyeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Mitglieder/search` | Üye arama | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Mitglieder/statistics/verein/{vereinId}` | Dernek üye istatistikleri | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/Mitglieder` | Yeni üye oluştur | `[RequireAdminOrDernek]` | ✅ Aktif |
| `POST` | `/api/Mitglieder/with-address` | Adresli üye oluştur (tek transaction) | `[RequireAdminOrDernek]` | ✅ Aktif |
| `POST` | `/api/Mitglieder/{id}/transfer` | Üyeyi başka derneğe transfer et | `[RequireAdmin]` | ✅ Aktif |
| `POST` | `/api/Mitglieder/{id}/set-active` | Üye aktiflik durumunu değiştir | `[RequireAdminOrDernek]` | ✅ Aktif |
| `PUT` | `/api/Mitglieder/{id}` | Üyeyi güncelle | `[RequireAdminOrDernek]` | ✅ Aktif |
| `DELETE` | `/api/Mitglieder/{id}` | Üyeyi sil (soft delete) | `[RequireAdminOrDernek]` | ✅ Aktif |

**Frontend Kullanım**: `mitgliedService.ts` (32 API çağrısı - Adressen ve Familien dahil)

---

### 🏠 **8. MitgliedAdressenController - Üye Adresleri**
**Base Route**: `/api/MitgliedAdressen`
**Toplam Endpoint**: 9

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedAdressen` | Tüm üye adreslerini listele (sayfalama) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/{id}` | ID'ye göre adres getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/mitglied/{mitgliedId}` | Üyeye göre adresleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/mitglied/{mitgliedId}/standard` | Üyenin standart adresini getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/statistics/mitglied/{mitgliedId}` | Üye adres istatistikleri | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedAdressen` | Yeni adres oluştur | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedAdressen/{mitgliedId}/address/{addressId}/set-standard` | Standart adres olarak ayarla | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedAdressen/{id}` | Adresi güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedAdressen/{id}` | Adresi sil (soft delete) | `[Authorize]` | ✅ Aktif |

---

### 👨‍👩‍👧‍👦 **9. MitgliedFamilienController - Aile İlişkileri**
**Base Route**: `/api/MitgliedFamilien`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedFamilien` | Tüm aile ilişkilerini listele (sayfalama) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/{id}` | ID'ye göre aile ilişkisi getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}` | Üyenin tüm aile ilişkileri | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{parentMitgliedId}/children` | Üyenin çocuklarını getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{childMitgliedId}/parents` | Üyenin ebeveynlerini getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}/siblings` | Üyenin kardeşlerini getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}/family-tree` | Üyenin aile ağacını getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/statistics/mitglied/{mitgliedId}` | Üye aile istatistikleri | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedFamilien` | Yeni aile ilişkisi oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedFamilien/{id}` | Aile ilişkisini güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedFamilien/{id}` | Aile ilişkisini sil (soft delete) | `[Authorize]` | ✅ Aktif |

---

### 🔐 **10. AuthController - Kimlik Doğrulama**
**Base Route**: `/api/Auth`
**Toplam Endpoint**: 5

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `POST` | `/api/Auth/login` | Kullanıcı girişi (JWT token) | Public | ✅ Aktif |
| `POST` | `/api/Auth/register-mitglied` | Yeni üye kaydı | Public | ✅ Aktif |
| `POST` | `/api/Auth/register-verein` | Yeni dernek kaydı | Public | ✅ Aktif |
| `POST` | `/api/Auth/logout` | Kullanıcı çıkışı | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/Auth/user` | Mevcut kullanıcı bilgisi | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `authService.ts` (5 API çağrısı)

---

### 🏥 **11. HealthController - Sistem Durumu**
**Base Route**: `/api/Health`
**Toplam Endpoint**: 2

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Health` | Temel sistem durumu | Public | ✅ Aktif |
| `GET` | `/api/Health/detailed` | Detaylı sistem durumu | Public | ✅ Aktif |

---

## 🎯 **Endpoint Özellikleri**

### ✅ **Ortak Özellikler**
- **Soft Delete**: Tüm DELETE işlemleri mantıksal silme (`DeletedFlag`)
- **Audit Trail**: `Created`, `Modified`, `CreatedBy`, `ModifiedBy` alanları
- **Error Handling**: Global exception handling middleware
- **Logging**: Tüm işlemler Serilog ile loglanıyor
- **Validation**: FluentValidation ile input validation
- **Authorization**: JWT token tabanlı kimlik doğrulama
- **Pagination**: Büyük veri setleri için sayfalama desteği

### 📊 **Response Formatları**
- **200 OK**: Başarılı GET işlemleri
- **201 Created**: Başarılı POST işlemleri (Location header ile)
- **204 No Content**: Başarılı PUT/DELETE işlemleri
- **400 Bad Request**: Validation hataları
- **401 Unauthorized**: Kimlik doğrulama hatası
- **403 Forbidden**: Yetki hatası
- **404 Not Found**: Kayıt bulunamadı
- **500 Internal Server Error**: Sunucu hataları

### 🔐 **Yetkilendirme Seviyeleri**
- **Public**: Kimlik doğrulama gerektirmez
- **`[Authorize]`**: Herhangi bir giriş yapmış kullanıcı
- **`[RequireAdmin]`**: Sadece Admin kullanıcılar
- **`[RequireAdminOrDernek]`**: Admin veya Dernek yöneticileri
- **`[RequireVereinAccess]`**: Dernek kullanıcıları sadece kendi verilerine erişebilir

### 🔗 **Veritabanı İlişkileri**

**Verein İlişkileri:**
- `Adresse` → `Verein` (VereinId)
- `Bankkonto` → `Verein` (VereinId)
- `Veranstaltung` → `Verein` (VereinId)
- `Mitglied` → `Verein` (VereinId)

**Mitglied İlişkileri:**
- `MitgliedAdresse` → `Mitglied` (MitgliedId)
- `MitgliedFamilie` → `Mitglied` (ParentMitgliedId, ChildMitgliedId)
- `VeranstaltungAnmeldung` → `Mitglied` (MitgliedId)

**Veranstaltung İlişkileri:**
- `VeranstaltungAnmeldung` → `Veranstaltung` (VeranstaltungId)
- `VeranstaltungBild` → `Veranstaltung` (VeranstaltungId)

---

## 📈 **Frontend-Backend Entegrasyonu**

### **Service Dosyaları ve Kullanım**

| Service | Controller | Endpoint Sayısı | Kullanım Oranı |
|---------|-----------|----------------|---------------|
| `authService.ts` | AuthController | 5 | %100 |
| `vereinService.ts` | VereineController | 7 | %100 |
| `adresseService.ts` | AdressenController | 7 | %100 |
| `mitgliedService.ts` | MitgliederController, MitgliedAdressenController, MitgliedFamilienController | 31 | %100 |
| `veranstaltungService.ts` | VeranstaltungenController, VeranstaltungAnmeldungenController, VeranstaltungBilderController | 25 | %100 |

---

### 👥 **11. MitgliedAdressenController - Üye Adresleri**
**Base Route**: `/api/MitgliedAdressen`
**Toplam Endpoint**: 9

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedAdressen` | Tüm üye adreslerini listele (sayfalı) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/{id}` | ID'ye göre adres getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/mitglied/{mitgliedId}` | Üyeye ait adresleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/mitglied/{mitgliedId}/standard` | Üyenin standart adresini getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedAdressen` | Yeni üye adresi oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedAdressen/{id}` | Üye adresini güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedAdressen/{id}` | Üye adresini sil (soft delete) | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedAdressen/{mitgliedId}/address/{addressId}/set-standard` | Adresi standart olarak ayarla | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedAdressen/statistics/mitglied/{mitgliedId}` | Adres istatistikleri | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `mitgliedAdresseService.ts` (9 API çağrısı)

---

### 👨‍👩‍👧‍👦 **12. MitgliedFamilienController - Üye Aile İlişkileri**
**Base Route**: `/api/MitgliedFamilien`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedFamilien` | Tüm aile ilişkilerini listele (sayfalı) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/{id}` | ID'ye göre ilişki getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}` | Üyeye ait ilişkileri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{parentMitgliedId}/children` | Çocukları getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{childMitgliedId}/parents` | Ebeveynleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}/siblings` | Kardeşleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/mitglied/{mitgliedId}/family-tree` | Aile ağacını getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedFamilien` | Yeni aile ilişkisi oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedFamilien/{id}` | Aile ilişkisini güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedFamilien/{id}` | Aile ilişkisini sil (soft delete) | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedFamilien/statistics/mitglied/{mitgliedId}` | Aile istatistikleri | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `mitgliedFamilieService.ts` (11 API çağrısı)

---

### 💰 **13. BankBuchungenController - Banka İşlemleri**
**Base Route**: `/api/BankBuchungen`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/BankBuchungen` | Tüm banka işlemlerini listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/{id}` | ID'ye göre işlem getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/verein/{vereinId}` | Derneğe ait işlemleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/bankkonto/{bankKontoId}` | Hesaba ait işlemleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/unmatched` | Eşleştirilmemiş işlemleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/date-range` | Tarih aralığına göre işlemleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/BankBuchungen/bankkonto/{bankKontoId}/total` | Hesap toplam tutarını getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/BankBuchungen` | Yeni banka işlemi oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/BankBuchungen/{id}` | Banka işlemini güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/BankBuchungen/{id}` | Banka işlemini sil (soft delete) | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `bankBuchungService.ts` (6 API çağrısı)

---

### 📋 **14. MitgliedForderungenController - Üye Talepleri/Faturalar**
**Base Route**: `/api/MitgliedForderungen`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedForderungen` | Tüm talepleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/{id}` | ID'ye göre talep getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/mitglied/{mitgliedId}` | Üyeye ait talepleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/verein/{vereinId}` | Derneğe ait talepleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/unpaid` | Ödenmemiş talepleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/overdue` | Vadesi geçmiş talepleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedForderungen/mitglied/{mitgliedId}/total-unpaid` | Ödenmemiş toplam tutarı getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedForderungen` | Yeni talep oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedForderungen/{id}` | Talebi güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedForderungen/{id}` | Talebi sil (soft delete) | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `mitgliedForderungService.ts` (8 API çağrısı)

---

### 💳 **15. MitgliedZahlungenController - Üye Ödemeleri**
**Base Route**: `/api/MitgliedZahlungen`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/MitgliedZahlungen` | Tüm ödemeleri listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/{id}` | ID'ye göre ödeme getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/mitglied/{mitgliedId}` | Üyeye ait ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/verein/{vereinId}` | Derneğe ait ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/unallocated` | Tahsis edilmemiş ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/date-range` | Tarih aralığına göre ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/MitgliedZahlungen/mitglied/{mitgliedId}/total` | Toplam ödeme tutarını getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/MitgliedZahlungen` | Yeni ödeme oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/MitgliedZahlungen/{id}` | Ödemeyi güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/MitgliedZahlungen/{id}` | Ödemeyi sil (soft delete) | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `mitgliedZahlungService.ts` (7 API çağrısı)

---

### 🎉 **16. VeranstaltungZahlungenController - Etkinlik Ödemeleri**
**Base Route**: `/api/VeranstaltungZahlungen`
**Toplam Endpoint**: 11

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/VeranstaltungZahlungen` | Tüm etkinlik ödemelerini listele | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungZahlungen/{id}` | ID'ye göre ödeme getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungZahlungen/veranstaltung/{veranstaltungId}` | Etkinliğe ait ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungZahlungen/anmeldung/{anmeldungId}` | Kayda ait ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungZahlungen/date-range` | Tarih aralığına göre ödemeleri getir | `[Authorize]` | ✅ Aktif |
| `GET` | `/api/VeranstaltungZahlungen/veranstaltung/{veranstaltungId}/total` | Etkinlik toplam ödeme tutarını getir | `[Authorize]` | ✅ Aktif |
| `POST` | `/api/VeranstaltungZahlungen` | Yeni etkinlik ödemesi oluştur | `[Authorize]` | ✅ Aktif |
| `PUT` | `/api/VeranstaltungZahlungen/{id}` | Etkinlik ödemesini güncelle | `[Authorize]` | ✅ Aktif |
| `DELETE` | `/api/VeranstaltungZahlungen/{id}` | Etkinlik ödemesini sil (soft delete) | `[Authorize]` | ✅ Aktif |

**Frontend Kullanım**: `veranstaltungZahlungService.ts` (6 API çağrısı)

---

### 🏥 **17. HealthController - Sistem Durumu**
**Base Route**: `/api/Health`
**Toplam Endpoint**: 2

| HTTP Method | Endpoint | Açıklama | Yetki | Durum |
|-------------|----------|----------|-------|-------|
| `GET` | `/api/Health` | Temel sistem durumu kontrolü | `[AllowAnonymous]` | ✅ Aktif |
| `GET` | `/api/Health/detailed` | Detaylı sistem durumu (veritabanı bağlantısı vb.) | `[AllowAnonymous]` | ✅ Aktif |

**Frontend Kullanım**: `healthService.ts` (2 API çağrısı)

---

**Toplam**: 131 endpoint, %98.5 kullanım oranı

---

## 🚀 **Kullanım Önerileri**

### **1. Swagger UI Kullanımı**
- **URL**: `http://localhost:5103`
- **Özellikler**:
  - Interaktif API testi
  - "Try it out" ile gerçek API çağrıları
  - Otomatik request/response örnekleri
  - JWT token ile authorization testi

### **2. Test Sırası**
1. **Kimlik Doğrulama**: `POST /api/Auth/login` ile token al
2. **Dernek Oluştur**: `POST /api/Vereine` ile dernek oluştur
3. **Adres Ekle**: `POST /api/Adressen` ile dernek adresini ekle
4. **Üye Ekle**: `POST /api/Mitglieder/with-address` ile adresli üye ekle
5. **Etkinlik Oluştur**: `POST /api/Veranstaltungen` ile etkinlik oluştur
6. **Kayıt Yap**: `POST /api/VeranstaltungAnmeldungen` ile etkinliğe kayıt yap

### **3. Hata Ayıklama**
- **Health Check**: `/api/Health/detailed` ile sistem durumunu kontrol et
- **Logs**: `logs/` klasöründe Serilog loglarını incele
- **Swagger**: Response kodlarını ve error message'ları takip et
- **Browser DevTools**: Network tab'inde request/response detaylarını incele

---

## 📊 **Özet**

**Toplam: 131 Backend Endpoint (15 Controller) + 129 Frontend Endpoint** 🎯

### Backend Endpoint Dağılımı:
- **VereineController**: 7 endpoint
- **AdressenController**: 8 endpoint
- **BankkontenController**: 9 endpoint
- **VeranstaltungenController**: 8 endpoint
- **VeranstaltungAnmeldungenController**: 9 endpoint
- **VeranstaltungBilderController**: 8 endpoint
- **MitgliederController**: 11 endpoint
- **MitgliedAdressenController**: 9 endpoint
- **MitgliedFamilienController**: 11 endpoint
- **AuthController**: 5 endpoint
- **HealthController**: 2 endpoint
- **BankBuchungenController**: 11 endpoint
- **MitgliedForderungenController**: 11 endpoint
- **MitgliedZahlungenController**: 11 endpoint
- **VeranstaltungZahlungenController**: 11 endpoint

### Frontend Entegrasyonu:
- ✅ 129 endpoint kullanılıyor (%98.5)
- ❌ 2 endpoint kullanılmıyor (GetByIban, ValidateIban)
- ✅ Kapsamlı yetkilendirme sistemi
- ✅ Soft delete ve audit trail desteği
- ✅ Sayfalama ve arama özellikleri
- ✅ Finansal yönetim özellikleri (Forderungen, Zahlungen, BankBuchungen)
- ✅ Swagger UI ile tam dokümantasyon
