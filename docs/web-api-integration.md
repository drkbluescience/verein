# Web-API Entegrasyon Durumu

## 📊 Genel Bakış

Bu dokümantasyon, backend API endpointleri ile frontend web servisleri arasındaki entegrasyon durumunu gösterir.

## ✅ Tamamlanan Servisler

### 1. **Verein Servisi** (`vereinService.ts`)
Backend Controller: `VereineController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Vereine` - Tüm dernekleri getir
- ✅ GET `/api/Vereine/{id}` - ID'ye göre dernek getir
- ✅ GET `/api/Vereine/active` - Aktif dernekleri getir
- ✅ POST `/api/Vereine` - Yeni dernek oluştur
- ✅ PUT `/api/Vereine/{id}` - Dernek güncelle
- ✅ DELETE `/api/Vereine/{id}` - Dernek sil (soft delete)

### 2. **Adresse Servisi** (`adresseService.ts`)
Backend Controller: `AdressenController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Adressen` - Tüm adresleri getir
- ✅ GET `/api/Adressen/{id}` - ID'ye göre adres getir
- ✅ GET `/api/Adressen/verein/{vereinId}` - Derneğe göre adresleri getir
- ✅ POST `/api/Adressen` - Yeni adres oluştur
- ✅ PUT `/api/Adressen/{id}` - Adres güncelle
- ✅ DELETE `/api/Adressen/{id}` - Adres sil

### 3. **Bankkonto Servisi** (`vereinService.ts` içinde)
Backend Controller: `BankkontenController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Bankkonten` - Tüm banka hesaplarını getir
- ✅ GET `/api/Bankkonten/{id}` - ID'ye göre banka hesabı getir
- ✅ GET `/api/Bankkonten/verein/{vereinId}` - Derneğe göre banka hesaplarını getir
- ✅ POST `/api/Bankkonten` - Yeni banka hesabı oluştur
- ✅ PUT `/api/Bankkonten/{id}` - Banka hesabı güncelle
- ✅ DELETE `/api/Bankkonten/{id}` - Banka hesabı sil

### 4. **Mitglied Servisi** (`mitgliedService.ts`)
Backend Controller: `MitgliederController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Mitglieder` - Tüm üyeleri getir (pagination)
- ✅ GET `/api/Mitglieder/{id}` - ID'ye göre üye getir
- ✅ GET `/api/Mitglieder/verein/{vereinId}` - Derneğe göre üyeleri getir
- ✅ POST `/api/Mitglieder` - Yeni üye oluştur
- ✅ POST `/api/Mitglieder/with-address` - Adresli üye oluştur
- ✅ PUT `/api/Mitglieder/{id}` - Üye güncelle
- ✅ DELETE `/api/Mitglieder/{id}` - Üye sil
- ✅ POST `/api/Mitglieder/{id}/transfer` - Üye transfer et
- ✅ POST `/api/Mitglieder/{id}/set-active` - Aktiflik durumu ayarla
- ✅ GET `/api/Mitglieder/search` - Üye ara

### 5. **MitgliedAdresse Servisi** (`mitgliedService.ts` içinde)
Backend Controller: `MitgliedAdressenController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/MitgliedAdressen` - Tüm adresleri getir (pagination) **[YENİ]**
- ✅ GET `/api/MitgliedAdressen/{id}` - ID'ye göre adres getir
- ✅ GET `/api/MitgliedAdressen/mitglied/{mitgliedId}` - Üyeye göre adresleri getir
- ✅ GET `/api/MitgliedAdressen/mitglied/{mitgliedId}/standard` - Standart adresi getir **[YENİ]**
- ✅ POST `/api/MitgliedAdressen` - Yeni adres oluştur
- ✅ PUT `/api/MitgliedAdressen/{id}` - Adres güncelle
- ✅ DELETE `/api/MitgliedAdressen/{id}` - Adres sil
- ✅ POST `/api/MitgliedAdressen/{mitgliedId}/address/{addressId}/set-standard` - Standart adres ayarla **[YENİ]**
- ✅ GET `/api/MitgliedAdressen/statistics/mitglied/{mitgliedId}` - Adres istatistikleri **[YENİ]**

### 6. **MitgliedFamilie Servisi** (`mitgliedService.ts` içinde)
Backend Controller: `MitgliedFamilienController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/MitgliedFamilien` - Tüm aile ilişkilerini getir (pagination) **[YENİ]**
- ✅ GET `/api/MitgliedFamilien/{id}` - ID'ye göre aile ilişkisi getir **[YENİ]**
- ✅ GET `/api/MitgliedFamilien/mitglied/{mitgliedId}` - Üyeye göre aile ilişkilerini getir
- ✅ GET `/api/MitgliedFamilien/mitglied/{parentMitgliedId}/children` - Çocukları getir
- ✅ GET `/api/MitgliedFamilien/mitglied/{mitgliedId}/parents` - Ebeveynleri getir
- ✅ GET `/api/MitgliedFamilien/mitglied/{mitgliedId}/siblings` - Kardeşleri getir **[YENİ]**
- ✅ GET `/api/MitgliedFamilien/mitglied/{mitgliedId}/family-tree` - Aile ağacını getir
- ✅ GET `/api/MitgliedFamilien/statistics/mitglied/{mitgliedId}` - Aile istatistikleri **[YENİ]**
- ✅ POST `/api/MitgliedFamilien` - Yeni aile ilişkisi oluştur
- ✅ PUT `/api/MitgliedFamilien/{id}` - Aile ilişkisi güncelle
- ✅ DELETE `/api/MitgliedFamilien/{id}` - Aile ilişkisi sil

### 7. **Veranstaltung Servisi** (`veranstaltungService.ts`)
Backend Controller: `VeranstaltungenController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Veranstaltungen` - Tüm etkinlikleri getir
- ✅ GET `/api/Veranstaltungen/{id}` - ID'ye göre etkinlik getir
- ✅ GET `/api/Veranstaltungen/verein/{vereinId}` - Derneğe göre etkinlikleri getir
- ✅ GET `/api/Veranstaltungen/date-range` - Tarih aralığına göre etkinlikleri getir
- ✅ POST `/api/Veranstaltungen` - Yeni etkinlik oluştur
- ✅ PUT `/api/Veranstaltungen/{id}` - Etkinlik güncelle
- ✅ DELETE `/api/Veranstaltungen/{id}` - Etkinlik sil

### 8. **VeranstaltungAnmeldung Servisi** (`veranstaltungService.ts` içinde)
Backend Controller: `VeranstaltungAnmeldungenController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/VeranstaltungAnmeldungen` - Tüm kayıtları getir
- ✅ GET `/api/VeranstaltungAnmeldungen/{id}` - ID'ye göre kayıt getir
- ✅ GET `/api/VeranstaltungAnmeldungen/veranstaltung/{veranstaltungId}` - Etkinliğe göre kayıtları getir
- ✅ GET `/api/VeranstaltungAnmeldungen/mitglied/{mitgliedId}` - Üyeye göre kayıtları getir
- ✅ GET `/api/VeranstaltungAnmeldungen/status/{status}` - Duruma göre kayıtları getir **[YENİ]**
- ✅ POST `/api/VeranstaltungAnmeldungen` - Yeni kayıt oluştur
- ✅ PUT `/api/VeranstaltungAnmeldungen/{id}` - Kayıt güncelle **[YENİ]**
- ✅ PATCH `/api/VeranstaltungAnmeldungen/{id}/status` - Kayıt durumu güncelle **[YENİ]**
- ✅ DELETE `/api/VeranstaltungAnmeldungen/{id}` - Kayıt sil

### 9. **VeranstaltungBild Servisi** (`veranstaltungService.ts` içinde) **[YENİ EKLENEN]**
Backend Controller: `VeranstaltungBilderController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/VeranstaltungBilder` - Tüm resimleri getir **[YENİ]**
- ✅ GET `/api/VeranstaltungBilder/{id}` - ID'ye göre resim getir **[YENİ]**
- ✅ GET `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}` - Etkinliğe göre resimleri getir **[YENİ]**
- ✅ POST `/api/VeranstaltungBilder/upload/{veranstaltungId}` - Resim yükle **[YENİ]**
- ✅ POST `/api/VeranstaltungBilder` - Mevcut yol ile resim oluştur **[YENİ]**
- ✅ PUT `/api/VeranstaltungBilder/{id}` - Resim güncelle **[YENİ]**
- ✅ PATCH `/api/VeranstaltungBilder/veranstaltung/{veranstaltungId}/reorder` - Resimleri yeniden sırala **[YENİ]**
- ✅ DELETE `/api/VeranstaltungBilder/{id}` - Resim sil **[YENİ]**

### 10. **Auth Servisi** (`authService.ts`)
Backend Controller: `AuthController.cs`

**Kullanılan Endpointler:**
- ✅ POST `/api/Auth/login` - Giriş yap
- ✅ POST `/api/Auth/register/mitglied` - Üye kaydı
- ✅ POST `/api/Auth/register/verein` - Dernek kaydı

### 11. **Health Servisi** (`vereinService.ts` içinde)
Backend Controller: `HealthController.cs`

**Kullanılan Endpointler:**
- ✅ GET `/api/Health` - Temel sağlık kontrolü
- ✅ GET `/api/Health/detailed` - Detaylı sağlık kontrolü

## 📈 İstatistikler

- **Toplam Backend Controller:** 11
- **Toplam Frontend Servis:** 11
- **Toplam Endpoint:** 70+
- **Kullanılan Endpoint:** 70+
- **Kullanılmayan Endpoint:** 0
- **Kapsama Oranı:** %100

## 🎯 Yeni Eklenen Özellikler

### MitgliedAdresse Servisi
1. Pagination desteği
2. Standart adres yönetimi
3. Adres istatistikleri

### MitgliedFamilie Servisi
1. Pagination desteği
2. ID'ye göre aile ilişkisi getirme
3. Kardeş ilişkileri
4. Aile istatistikleri

### VeranstaltungAnmeldung Servisi
1. Duruma göre filtreleme
2. Kayıt güncelleme
3. Durum güncelleme (PATCH)

### VeranstaltungBild Servisi (Tamamen Yeni)
1. Resim listeleme
2. Resim yükleme
3. Resim güncelleme
4. Resim sıralama
5. Resim silme

## 🔧 Kullanım Örnekleri

### VeranstaltungBild Servisi Kullanımı

```typescript
import { veranstaltungBildService } from './services/veranstaltungService';

// Etkinlik resimlerini getir
const bilder = await veranstaltungBildService.getByVeranstaltungId(1);

// Resim yükle
const file = document.querySelector('input[type="file"]').files[0];
const uploadedBild = await veranstaltungBildService.uploadImage(1, file, 'Etkinlik Fotoğrafı');

// Resimleri yeniden sırala
const sortOrders = { 1: 2, 2: 1, 3: 3 };
await veranstaltungBildService.reorderImages(1, sortOrders);
```

### MitgliedAdresse Servisi Kullanımı

```typescript
import { mitgliedAdresseService } from './services/mitgliedService';

// Standart adresi getir
const standardAddress = await mitgliedAdresseService.getStandardAddress(1);

// Standart adres olarak ayarla
await mitgliedAdresseService.setAsStandardAddress(1, 5);

// Adres istatistiklerini getir
const stats = await mitgliedAdresseService.getAddressStatistics(1);
```

### MitgliedFamilie Servisi Kullanımı

```typescript
import { mitgliedFamilieService } from './services/mitgliedService';

// Kardeşleri getir
const siblings = await mitgliedFamilieService.getSiblings(1);

// Aile ağacını getir
const familyTree = await mitgliedFamilieService.getFamilyTree(1, 3);

// Aile istatistiklerini getir
const stats = await mitgliedFamilieService.getFamilyStatistics(1);
```

## 📝 Notlar

1. Tüm servisler TypeScript ile yazılmıştır
2. Tüm servisler merkezi `api.ts` dosyasını kullanır
3. Tüm servisler async/await pattern kullanır
4. Tüm servisler hata yönetimi içerir
5. Tüm servisler type-safe'tir

## 🚀 Sonraki Adımlar

1. ✅ Tüm backend endpointleri frontend'e entegre edildi
2. ⏳ UI bileşenlerinde yeni servislerin kullanımı
3. ⏳ Test yazımı
4. ⏳ Dokümantasyon güncellemesi

---

**Son Güncelleme:** 2025-10-13
**Durum:** ✅ Tamamlandı

