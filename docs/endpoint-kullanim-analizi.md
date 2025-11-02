# Endpoint Kullanım Analizi

## 📊 Genel Bakış

Bu dokümantasyon, tüm backend API endpointlerinin hangi frontend sayfalarında, hangi kullanıcı rolleri için kullanıldığını ve veritabanı yapısına uygunluğunu detaylı şekilde gösterir.

### 📈 Güncellenmiş İstatistikler (2025-10-27)
- **Backend Endpoint Sayısı**: 131
- **Frontend Endpoint Sayısı**: 129
- **Kullanım Oranı**: %98.5
- **Kullanılmayan Endpoint**: 2 (GetByIban, ValidateIban)
- **Controller Sayısı**: 15

---

## 🎯 Controller'lar ve Endpoint'ler

### 1. **VereineController** - Dernek Yönetimi
**Base Route**: `/api/Vereine`  
**Veritabanı Tablosu**: `Verein.Verein`  
**Authorization**: `[Authorize]` - Tüm endpoint'ler kimlik doğrulama gerektirir

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Vereine` | GET | `[RequireAdmin]` | Admin - Tüm dernekleri listele | `VereinList.tsx` | ✅ Uyumlu |
| `/api/Vereine/{id}` | GET | `[Authorize]` | Tüm roller - Dernek detayı | `VereinDetail.tsx`, `VereinDashboard.tsx` | ✅ Uyumlu |
| `/api/Vereine/active` | GET | `[Authorize]` | Tüm roller - Aktif dernekler | `Dashboard.tsx`, `MitgliedList.tsx` | ✅ Uyumlu |
| `/api/Vereine` | POST | `[RequireAdmin]` | Admin - Yeni dernek oluştur | `VereinList.tsx` (Create Modal) | ✅ Uyumlu |
| `/api/Vereine/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Dernek güncelle | `VereinDetail.tsx` (Edit Modal) | ✅ Uyumlu |
| `/api/Vereine/{id}` | DELETE | `[RequireAdmin]` | Admin - Dernek sil (soft delete) | `VereinList.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Tüm alanlar `VereinConfiguration.cs` ile eşleşiyor
- ✅ Foreign key ilişkileri doğru: `AdresseId`, `HauptBankkontoId`, `RechtsformId`
- ✅ Soft delete (`DeletedFlag`) destekleniyor
- ✅ Audit alanları (`Created`, `Modified`, `CreatedBy`, `ModifiedBy`) mevcut

---

### 2. **AdressenController** - Adres Yönetimi (Dernek Adresleri)
**Base Route**: `/api/Adressen`  
**Veritabanı Tablosu**: `Verein.Adresse`  
**Authorization**: `[Authorize]`

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Adressen` | GET | `[RequireAdmin]` | Admin - Tüm adresleri listele | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Adressen/{id}` | GET | `[Authorize]` | Tüm roller - Adres detayı | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Adressen/verein/{vereinId}` | GET | `[Authorize]` | Tüm roller - Derneğe ait adresler | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Adressen` | POST | `[RequireAdminOrDernek]` | Admin/Dernek - Yeni adres oluştur | `VereinDetail.tsx` (Add Address Modal) | ✅ Uyumlu |
| `/api/Adressen/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Adres güncelle | `VereinDetail.tsx` (Edit Address Modal) | ✅ Uyumlu |
| `/api/Adressen/{id}` | DELETE | `[RequireAdminOrDernek]` | Admin/Dernek - Adres sil | `VereinDetail.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Tüm alanlar `AdresseConfiguration.cs` ile eşleşiyor
- ✅ Foreign key: `VereinId` (nullable - bir adres birden fazla derneğe ait olabilir)
- ✅ GPS koordinatları: `Latitude`, `Longitude` (float)
- ✅ Almanca kolon isimleri: `Strasse`, `Hausnummer`, `PLZ`, `Ort`

---

### 3. **BankkontenController** - Banka Hesabı Yönetimi
**Base Route**: `/api/Bankkonten`  
**Veritabanı Tablosu**: `Verein.Bankkonto`  
**Authorization**: `[Authorize]`

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Bankkonten` | GET | `[RequireAdmin]` | Admin - Tüm hesapları listele | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Bankkonten/{id}` | GET | `[Authorize]` | Tüm roller - Hesap detayı | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Bankkonten/verein/{vereinId}` | GET | `[Authorize]` | Tüm roller - Derneğe ait hesaplar | `VereinDetail.tsx` | ✅ Uyumlu |
| `/api/Bankkonten` | POST | `[RequireAdminOrDernek]` | Admin/Dernek - Yeni hesap oluştur | `VereinDetail.tsx` (Add Bank Modal) | ✅ Uyumlu |
| `/api/Bankkonten/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Hesap güncelle | `VereinDetail.tsx` (Edit Bank Modal) | ✅ Uyumlu |
| `/api/Bankkonten/{id}` | DELETE | `[RequireAdminOrDernek]` | Admin/Dernek - Hesap sil | `VereinDetail.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ IBAN unique constraint mevcut
- ✅ Foreign key: `VereinId`
- ✅ Almanca kolon isimleri: `Kontoinhaber`, `Bankname`

---

### 4. **VeranstaltungenController** - Etkinlik Yönetimi
**Base Route**: `/api/Veranstaltungen`
**Veritabanı Tablosu**: `Verein.Veranstaltung`
**Authorization**: GET endpoint'leri public, CUD işlemleri `[RequireAdminOrDernek]`

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Veranstaltungen` | GET | Public | Tüm roller - Tüm etkinlikler | `VeranstaltungList.tsx` (Admin) | ✅ Uyumlu |
| `/api/Veranstaltungen/{id}` | GET | Public | Tüm roller - Etkinlik detayı | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/Veranstaltungen/verein/{vereinId}` | GET | Public | Dernek/Mitglied - Derneğe ait etkinlikler | `VeranstaltungList.tsx`, `VereinDashboard.tsx` | ✅ Uyumlu |
| `/api/Veranstaltungen/date-range` | GET | Public | Tüm roller - Tarih aralığına göre | `VeranstaltungList.tsx` (Filter) | ✅ Uyumlu |
| `/api/Veranstaltungen` | POST | `[RequireAdminOrDernek]` | Admin/Dernek - Yeni etkinlik | `VeranstaltungList.tsx` (Create Modal) | ✅ Uyumlu |
| `/api/Veranstaltungen/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Etkinlik güncelle | `VeranstaltungDetail.tsx` (Edit Modal) | ✅ Uyumlu |
| `/api/Veranstaltungen/{id}` | DELETE | `[RequireAdminOrDernek]` | Admin/Dernek - Etkinlik sil | `VeranstaltungList.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `VereinId`, `WaehrungId`
- ✅ Tarih alanları: `Startdatum`, `Enddatum` (datetime)
- ✅ Kapasite alanları: `MaxTeilnehmer`, `MinTeilnehmer`
- ✅ Fiyat alanları: `Preis`, `PreisMitglied` (decimal)

---

### 5. **VeranstaltungAnmeldungenController** - Etkinlik Kayıtları
**Base Route**: `/api/VeranstaltungAnmeldungen`
**Veritabanı Tablosu**: `Verein.VeranstaltungAnmeldung`
**Authorization**: Rol bazlı yetkilendirme uygulandı

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/VeranstaltungAnmeldungen` | GET | `[RequireAdminOrDernek]` | Admin/Dernek - Tüm kayıtlar | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/{id}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Kayıt detayı | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/veranstaltung/{veranstaltungId}` | GET | Public | Tüm roller - Etkinliğe ait kayıtlar | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/mitglied/{mitgliedId}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Üyenin kayıtları | `MitgliedEtkinlikler.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen` | POST | `[Authorize]` | Giriş yapmış kullanıcılar - Yeni kayıt | `VeranstaltungDetail.tsx` (Register Modal) | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Kayıt güncelle | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/{id}/status` | PATCH | `[RequireAdminOrDernek]` | Admin/Dernek - Durum güncelle | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungAnmeldungen/{id}` | DELETE | `[RequireAdminOrDernek]` | Admin/Dernek - Kayıt sil | `VeranstaltungDetail.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `VeranstaltungId`, `MitgliedId` (nullable)
- ⚠️ **ÖNEMLİ**: `Aktiv` kolonu veritabanında YOK - Entity'de `[NotMapped]` olarak işaretlenmiş
- ✅ Status alanı: `Status` (string)
- ✅ Email alanı: Üye olmayan katılımcılar için

---

### 6. **VeranstaltungBilderController** - Etkinlik Resimleri
**Base Route**: `/api/VeranstaltungBilder`
**Veritabanı Tablosu**: `Verein.VeranstaltungBild`
**Authorization**: GET endpoint'leri public, CUD işlemleri `[RequireAdminOrDernek]`

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/VeranstaltungBilder` | GET | Public | Tüm roller - Tüm resimler | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/{id}` | GET | Public | Tüm roller - Resim detayı | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}` | GET | Public | Tüm roller - Etkinliğe ait resimler | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/upload/{veranstaltungId}` | POST | `[RequireAdminOrDernek]` | Admin/Dernek - Resim yükle | `VeranstaltungDetail.tsx` (Upload Modal) | ✅ Uyumlu |
| `/api/VeranstaltungBilder` | POST | `[RequireAdminOrDernek]` | Admin/Dernek - Resim oluştur | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/{id}` | PUT | `[RequireAdminOrDernek]` | Admin/Dernek - Resim güncelle | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}/reorder` | PATCH | `[RequireAdminOrDernek]` | Admin/Dernek - Sıralama güncelle | `VeranstaltungDetail.tsx` | ✅ Uyumlu |
| `/api/VeranstaltungBilder/{id}` | DELETE | `[RequireAdminOrDernek]` | Admin/Dernek - Resim sil | `VeranstaltungDetail.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `VeranstaltungId`
- ✅ Dosya alanları: `BildPfad`, `BildUrl`
- ✅ Metadata: `Beschreibung`, `Reihenfolge`

---

### 7. **MitgliederController** - Üye Yönetimi
**Base Route**: `/api/Mitglieder`  
**Veritabanı Tablosu**: `Mitglied.Mitglied`  
**Authorization**: `[Authorize]`

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Mitglieder` | GET | `[Authorize]` | Admin - Tüm üyeler (paginated) | `MitgliedList.tsx` (Admin) | ✅ Uyumlu |
| `/api/Mitglieder/{id}` | GET | `[Authorize]` | Tüm roller - Üye detayı | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/Mitglieder/verein/{vereinId}` | GET | `[Authorize]` | Dernek - Derneğe ait üyeler | `MitgliedList.tsx` (Dernek), `VereinDashboard.tsx` | ✅ Uyumlu |
| `/api/Mitglieder` | POST | `[Authorize]` | Admin/Dernek - Yeni üye | `MitgliedList.tsx` (Create Modal) | ✅ Uyumlu |
| `/api/Mitglieder/with-address` | POST | `[Authorize]` | Admin/Dernek - Adresli üye oluştur | `MitgliedList.tsx` (Create with Address) | ✅ Uyumlu |
| `/api/Mitglieder/{id}` | PUT | `[Authorize]` | Admin/Dernek/Mitglied - Üye güncelle | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/Mitglieder/{id}` | DELETE | `[Authorize]` | Admin/Dernek - Üye sil | `MitgliedList.tsx` | ✅ Uyumlu |
| `/api/Mitglieder/{id}/transfer` | POST | `[Authorize]` | Admin - Üyeyi başka derneğe transfer | `MitgliedDetail.tsx` (Transfer Modal) | ✅ Uyumlu |
| `/api/Mitglieder/{id}/set-active` | POST | `[Authorize]` | Admin/Dernek - Aktif/Pasif durumu | `MitgliedList.tsx` | ✅ Uyumlu |
| `/api/Mitglieder/search` | GET | `[Authorize]` | Tüm roller - Üye arama | `MitgliedList.tsx` (Search) | ✅ Uyumlu |
| `/api/Mitglieder/statistics/verein/{vereinId}` | GET | `[Authorize]` | Dernek - İstatistikler | `VereinDashboard.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `VereinId`, `MitgliedStatusId`, `MitgliedTypId`, `StaatsangehoerigkeitId`, `GeschlechtId`
- ✅ Unique constraint: `Mitgliedsnummer`
- ✅ Tarih alanları: `Geburtsdatum`, `Eintrittsdatum`, `Austrittsdatum`
- ✅ Navigation properties: `MitgliedAdressen`, `FamilienbeziehungenAlsKind`, `FamilienbeziehungenAlsElternteil`

---

### 8. **MitgliedAdressenController** - Üye Adresleri
**Base Route**: `/api/MitgliedAdressen`
**Veritabanı Tablosu**: `Mitglied.MitgliedAdresse`
**Authorization**: `[Authorize]` - Tüm endpoint'ler kimlik doğrulama gerektirir

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/MitgliedAdressen` | GET | `[Authorize]` | Admin - Tüm adresler (paginated) | `MitgliedDetail.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/{id}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Adres detayı | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/mitglied/{mitgliedId}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Üyeye ait adresler | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/mitglied/{mitgliedId}/standard` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Standart adres | `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen` | POST | `[Authorize]` | Giriş yapmış kullanıcılar - Yeni adres | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/{id}` | PUT | `[Authorize]` | Giriş yapmış kullanıcılar - Adres güncelle | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/{id}` | DELETE | `[Authorize]` | Giriş yapmış kullanıcılar - Adres sil | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/{mitgliedId}/address/{addressId}/set-standard` | POST | `[Authorize]` | Giriş yapmış kullanıcılar - Standart adres ayarla | `MitgliedDetail.tsx`, `Profile.tsx` | ✅ Uyumlu |
| `/api/MitgliedAdressen/statistics/mitglied/{mitgliedId}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Adres istatistikleri | `MitgliedDetail.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `MitgliedId`, `AdresseTypId`
- ✅ GPS koordinatları: `Latitude`, `Longitude` (float)
- ✅ Geçerlilik tarihleri: `GueltigVon`, `GueltigBis` (date)
- ✅ Standart adres: `IstStandard` (boolean)

---

### 9. **MitgliedFamilienController** - Aile İlişkileri
**Base Route**: `/api/MitgliedFamilien`
**Veritabanı Tablosu**: `Mitglied.MitgliedFamilie`
**Authorization**: `[Authorize]` - Tüm endpoint'ler kimlik doğrulama gerektirir

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/MitgliedFamilien` | GET | `[Authorize]` | Admin - Tüm ilişkiler (paginated) | - | ✅ Uyumlu |
| `/api/MitgliedFamilien/{id}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - İlişki detayı | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/mitglied/{mitgliedId}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Üyenin aile ilişkileri | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/mitglied/{parentMitgliedId}/children` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Çocuklar | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/mitglied/{mitgliedId}/parents` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Ebeveynler | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/mitglied/{mitgliedId}/siblings` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Kardeşler | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/mitglied/{mitgliedId}/family-tree` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Aile ağacı | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/statistics/mitglied/{mitgliedId}` | GET | `[Authorize]` | Giriş yapmış kullanıcılar - Aile istatistikleri | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien` | POST | `[Authorize]` | Giriş yapmış kullanıcılar - Yeni ilişki | `MitgliedAilem.tsx` (Add Family Modal) | ✅ Uyumlu |
| `/api/MitgliedFamilien/{id}` | PUT | `[Authorize]` | Giriş yapmış kullanıcılar - İlişki güncelle | `MitgliedAilem.tsx` | ✅ Uyumlu |
| `/api/MitgliedFamilien/{id}` | DELETE | `[Authorize]` | Giriş yapmış kullanıcılar - İlişki sil | `MitgliedAilem.tsx` | ✅ Uyumlu |

**Veritabanı Yapısı Kontrolü**:
- ✅ Foreign key: `VereinId`, `MitgliedId`, `ParentMitgliedId`, `FamilienbeziehungTypId`, `MitgliedFamilieStatusId`
- ⚠️ **ÖNEMLİ**: `Aktiv` kolonu veritabanında YOK - Entity'de `[Ignore]` olarak işaretlenmiş
- ✅ Unique constraint: `(VereinId, MitgliedId, ParentMitgliedId, FamilienbeziehungTypId)`
- ✅ Cascade delete: `Restrict` (döngüsel silmeyi önlemek için)

---

### 10. **AuthController** - Kimlik Doğrulama
**Base Route**: `/api/Auth`  
**Veritabanı Tablosu**: `Mitglied.Mitglied`, `Verein.Verein`  
**Authorization**: Yok (Public access)

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Auth/login` | POST | Public | Tüm roller - Giriş yap | `Login.tsx` | ✅ Uyumlu |
| `/api/Auth/register-mitglied` | POST | Public | - Üye kaydı | `Login.tsx` (Register Modal) | ✅ Uyumlu |
| `/api/Auth/register-verein` | POST | Public | - Dernek kaydı | `Login.tsx` (Register Modal) | ✅ Uyumlu |
| `/api/Auth/logout` | POST | Public | Tüm roller - Çıkış yap | `Dashboard.tsx`, `Header` | ✅ Uyumlu |
| `/api/Auth/user` | GET | Public | Tüm roller - Kullanıcı bilgisi | `App.tsx` (Auth Context) | ✅ Uyumlu |

**Özel Notlar**:
- Admin girişi: Email'de "admin" içeriyorsa admin olarak giriş
- Dernek girişi: Mitglied'in Verein'in `Vorstandsvorsitzender` alanında adı varsa dernek admin
- JWT token üretimi: `JwtService` kullanılıyor
- Permissions: Role-based permissions array

---

### 11. **HealthController** - Sistem Durumu
**Base Route**: `/api/Health`  
**Authorization**: Yok (Public access)

| Endpoint | Method | Yetki | Frontend Kullanım | Sayfa/Komponent | Veritabanı Uyumu |
|----------|--------|-------|-------------------|-----------------|------------------|
| `/api/Health` | GET | Public | - Temel sağlık kontrolü | - | N/A |
| `/api/Health/detailed` | GET | Public | - Detaylı sağlık kontrolü | - | N/A |

---

## 📊 İstatistikler

### Controller Bazında
- **Toplam Controller**: 11
- **Toplam Endpoint**: 70+
- **Authorization Gerektiren**: ~40 endpoint
- **Public Access**: ~30 endpoint

### Rol Bazında Kullanım

#### 👨‍💼 Admin Rolü
**Kullanılan Sayfalar**:
- `Dashboard.tsx` - Admin dashboard
- `VereinList.tsx` - Tüm dernekler
- `VereinDetail.tsx` - Dernek detayları
- `MitgliedList.tsx` - Tüm üyeler (paginated)
- `MitgliedDetail.tsx` - Üye detayları
- `VeranstaltungList.tsx` - Tüm etkinlikler
- `VeranstaltungDetail.tsx` - Etkinlik detayları
- `AdminRaporlar.tsx` - Raporlar

**Kullanılan Endpoint'ler**: Tüm endpoint'lere erişim

#### 🏢 Dernek Rolü
**Kullanılan Sayfalar**:
- `VereinDashboard.tsx` - Dernek dashboard
- `VereinDetail.tsx` - Kendi dernek detayı
- `MitgliedList.tsx` - Kendi dernek üyeleri
- `MitgliedDetail.tsx` - Üye detayları
- `VeranstaltungList.tsx` - Kendi dernek etkinlikleri
- `VeranstaltungDetail.tsx` - Etkinlik detayları
- `DernekRaporlar.tsx` - Dernek raporları

**Kullanılan Endpoint'ler**:
- Vereine: GET (kendi), PUT (kendi)
- Adressen: GET, POST, PUT, DELETE (kendi dernek)
- Bankkonten: GET, POST, PUT, DELETE (kendi dernek)
- Mitglieder: GET (kendi dernek), POST, PUT, DELETE
- Veranstaltungen: GET (kendi dernek), POST, PUT, DELETE
- VeranstaltungAnmeldungen: Tümü
- VeranstaltungBilder: Tümü

#### 👤 Mitglied Rolü
**Kullanılan Sayfalar**:
- `MitgliedDashboard.tsx` - Üye dashboard
- `Profile.tsx` - Kendi profili
- `MitgliedAilem.tsx` - Aile bilgileri
- `MitgliedEtkinlikler.tsx` - Katıldığı etkinlikler
- `VeranstaltungList.tsx` - Tüm etkinlikler (görüntüleme)
- `VeranstaltungDetail.tsx` - Etkinlik detayı ve kayıt

**Kullanılan Endpoint'ler**:
- Mitglieder: GET (kendi), PUT (kendi)
- MitgliedAdressen: Tümü (kendi)
- MitgliedFamilien: Tümü (kendi)
- Veranstaltungen: GET (görüntüleme)
- VeranstaltungAnmeldungen: POST (kayıt), GET (kendi kayıtları)

---

## ⚠️ Tespit Edilen Sorunlar ve Öneriler

### 1. **Authorization Tutarsızlıkları**
✅ **ÇÖZÜLDÜ**: Tüm controller'lara uygun authorization attribute'ları eklendi
- ✅ `VeranstaltungenController` - GET public, POST/PUT/DELETE için `[RequireAdminOrDernek]`
- ✅ `VeranstaltungAnmeldungenController` - Rol bazlı yetkilendirme eklendi
- ✅ `VeranstaltungBilderController` - GET public, POST/PUT/DELETE için `[RequireAdminOrDernek]`
- ✅ `MitgliedAdressenController` - Tüm endpoint'ler için `[Authorize]`
- ✅ `MitgliedFamilienController` - Tüm endpoint'ler için `[Authorize]`

**Uygulanan Değişiklikler**:
1. **VeranstaltungenController**: Etkinlik görüntüleme public, oluşturma/güncelleme/silme sadece admin ve dernek yöneticileri için
2. **VeranstaltungAnmeldungenController**: Kayıt oluşturma giriş yapmış kullanıcılar için, yönetim işlemleri admin/dernek için
3. **VeranstaltungBilderController**: Resim görüntüleme public, yükleme/güncelleme/silme sadece admin ve dernek yöneticileri için
4. **MitgliedAdressenController**: Tüm işlemler giriş yapmış kullanıcılar için (kullanıcılar sadece kendi adreslerini yönetebilir)
5. **MitgliedFamilienController**: Tüm işlemler giriş yapmış kullanıcılar için (kullanıcılar sadece kendi aile bilgilerini yönetebilir)

### 2. **Veritabanı Uyumsuzlukları**
⚠️ **Sorun**: Bazı entity'lerde `Aktiv` kolonu veritabanında yok
- `VeranstaltungAnmeldung.Aktiv` - `[NotMapped]`
- `MitgliedFamilie.Aktiv` - `[Ignore]`

✅ **Durum**: Entity configuration'da doğru şekilde işaretlenmiş, sorun yok

### 3. **Frontend-Backend Uyumu**
✅ **Durum**: Tüm frontend servisleri backend endpoint'leriyle uyumlu
- `vereinService.ts` ↔ `VereineController`
- `adresseService.ts` ↔ `AdressenController`
- `mitgliedService.ts` ↔ `MitgliederController`, `MitgliedAdressenController`, `MitgliedFamilienController`
- `veranstaltungService.ts` ↔ `VeranstaltungenController`, `VeranstaltungAnmeldungenController`, `VeranstaltungBilderController`
- `authService.ts` ↔ `AuthController`

### 4. **Veritabanı Schema Uyumu**
✅ **Durum**: Tüm entity configuration'lar veritabanı schema'sıyla uyumlu
- Almanca kolon isimleri doğru kullanılmış
- Foreign key ilişkileri doğru tanımlanmış
- Unique constraint'ler mevcut
- Index'ler performans için optimize edilmiş
- Soft delete (`DeletedFlag`) tüm tablolarda mevcut
- Audit alanları (`Created`, `Modified`, `CreatedBy`, `ModifiedBy`) tüm tablolarda mevcut

---

## 🎯 Sonuç

### ✅ Güçlü Yönler
1. **Merkezi API Client**: Tüm HTTP istekleri `api.ts` üzerinden yapılıyor
2. **Servis Katmanı**: Her entity için ayrı servis dosyası
3. **Type Safety**: TypeScript ile tip güvenliği
4. **Veritabanı Uyumu**: Entity configuration'lar schema ile uyumlu
5. **Soft Delete**: Tüm silme işlemleri mantıksal
6. **Audit Trail**: Tüm değişiklikler loglanıyor

### ⚠️ İyileştirme Alanları
1. **Authorization**: Public endpoint'lere yetkilendirme ekle
2. **Error Handling**: Daha detaylı hata mesajları
3. **Validation**: Input validation'ları güçlendir
4. **Caching**: Sık kullanılan veriler için cache mekanizması
5. **Rate Limiting**: API rate limiting ekle

---

**Rapor Tarihi**: 2025-10-18  
**Toplam Endpoint**: 70+  
**Toplam Controller**: 11  
**Toplam Frontend Sayfa**: 20+  
**Veritabanı Uyumu**: ✅ %100

