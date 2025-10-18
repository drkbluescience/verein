# API Servisleri Kullanım Rehberi

## 📚 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Servis Yapısı](#servis-yapısı)
3. [Kullanım Örnekleri](#kullanım-örnekleri)
4. [Servis Detayları](#servis-detayları)
5. [Hata Yönetimi](#hata-yönetimi)

## 🎯 Genel Bakış

Verein Web uygulaması, backend API ile iletişim kurmak için modüler bir servis yapısı kullanır. Tüm servisler TypeScript ile yazılmıştır ve type-safe'tir.

### Servis Dosyaları

```
verein-web/src/services/
├── api.ts                      # Merkezi API client
├── authService.ts              # Kimlik doğrulama servisi
├── vereinService.ts            # Dernek, adres, banka servisleri
├── mitgliedService.ts          # Üye, adres, aile servisleri
├── veranstaltungService.ts     # Etkinlik, kayıt, resim servisleri
└── index.ts                    # Merkezi export dosyası
```

## 🏗️ Servis Yapısı

### Merkezi API Client (`api.ts`)

Tüm HTTP istekleri için merkezi bir axios instance kullanılır:

```typescript
import { api } from './services/api';

// GET isteği
const data = await api.get<Type>('/endpoint');

// POST isteği
const result = await api.post<Type>('/endpoint', data);

// PUT isteği
const updated = await api.put<Type>('/endpoint', data);

// DELETE isteği
await api.delete('/endpoint');
```

### Servis Import Yöntemleri

```typescript
// Yöntem 1: Tek tek import
import { vereinService, mitgliedService } from './services';

// Yöntem 2: Tüm servisleri import
import * as services from './services';

// Yöntem 3: Type'lar ile birlikte
import { vereinService, type VereinDto } from './services';
```

## 💡 Kullanım Örnekleri

### 1. Verein (Dernek) İşlemleri

```typescript
import { vereinService } from './services';

// Tüm dernekleri getir
const vereine = await vereinService.getAll();

// Aktif dernekleri getir
const activeVereine = await vereinService.getActive();

// ID'ye göre dernek getir
const verein = await vereinService.getById(1);

// Yeni dernek oluştur
const newVerein = await vereinService.create({
  name: 'Yeni Dernek',
  kurzname: 'YD',
  email: 'info@yenidernek.de',
  aktiv: true
});

// Dernek güncelle
const updated = await vereinService.update(1, {
  name: 'Güncellenmiş Dernek'
});

// Dernek sil (soft delete)
await vereinService.delete(1);
```

### 2. Mitglied (Üye) İşlemleri

```typescript
import { mitgliedService } from './services';

// Tüm üyeleri getir (pagination)
const result = await mitgliedService.getAll({
  pageNumber: 1,
  pageSize: 10
});

// Derneğe göre üyeleri getir
const mitglieder = await mitgliedService.getByVereinId(1);

// Üye ara
const searchResults = await mitgliedService.search('Ahmet', 1);

// Yeni üye oluştur
const newMitglied = await mitgliedService.create({
  vereinId: 1,
  vorname: 'Ahmet',
  nachname: 'Yılmaz',
  email: 'ahmet@example.com',
  aktiv: true
});

// Adresli üye oluştur
const mitgliedWithAddress = await mitgliedService.createWithAddress({
  mitglied: {
    vereinId: 1,
    vorname: 'Mehmet',
    nachname: 'Demir',
    email: 'mehmet@example.com'
  },
  adresse: {
    strasse: 'Hauptstraße',
    hausnummer: '123',
    plz: '12345',
    ort: 'Berlin',
    land: 'Deutschland'
  }
});

// Üye transfer et
await mitgliedService.transfer(1, {
  newVereinId: 2,
  transferDate: new Date().toISOString(),
  reason: 'Taşınma'
});
```

### 3. MitgliedAdresse (Üye Adresi) İşlemleri

```typescript
import { mitgliedAdresseService } from './services';

// Üyenin adreslerini getir
const adressen = await mitgliedAdresseService.getByMitgliedId(1);

// Standart adresi getir
const standardAddress = await mitgliedAdresseService.getStandardAddress(1);

// Yeni adres ekle
const newAddress = await mitgliedAdresseService.create({
  mitgliedId: 1,
  strasse: 'Berliner Straße',
  hausnummer: '45',
  plz: '10115',
  ort: 'Berlin',
  land: 'Deutschland',
  adresseTypId: 1
});

// Standart adres olarak ayarla
await mitgliedAdresseService.setAsStandardAddress(1, 5);

// Adres istatistiklerini getir
const stats = await mitgliedAdresseService.getAddressStatistics(1);
```

### 4. MitgliedFamilie (Aile İlişkileri) İşlemleri

```typescript
import { mitgliedFamilieService } from './services';

// Aile ilişkilerini getir
const relationships = await mitgliedFamilieService.getByMitgliedId(1);

// Çocukları getir
const children = await mitgliedFamilieService.getChildren(1);

// Ebeveynleri getir
const parents = await mitgliedFamilieService.getParents(1);

// Kardeşleri getir
const siblings = await mitgliedFamilieService.getSiblings(1);

// Aile ağacını getir
const familyTree = await mitgliedFamilieService.getFamilyTree(1, 3);

// Aile istatistikleri
const stats = await mitgliedFamilieService.getFamilyStatistics(1);

// Yeni aile ilişkisi oluştur
await mitgliedFamilieService.create({
  mitgliedId: 1,
  verwandterMitgliedId: 2,
  verwandtschaftsTypId: 1, // Örn: Ebeveyn
  aktiv: true
});
```

### 5. Veranstaltung (Etkinlik) İşlemleri

```typescript
import { veranstaltungService } from './services';

// Tüm etkinlikleri getir
const veranstaltungen = await veranstaltungService.getAll();

// Derneğe göre etkinlikleri getir
const vereinEvents = await veranstaltungService.getByVereinId(1);

// Tarih aralığına göre etkinlikleri getir
const events = await veranstaltungService.getByDateRange(
  '2024-01-01',
  '2024-12-31'
);

// Yeni etkinlik oluştur
const newEvent = await veranstaltungService.create({
  vereinId: 1,
  titel: 'Yaz Şenliği',
  beschreibung: 'Geleneksel yaz şenliği',
  startdatum: '2024-07-15T10:00:00',
  enddatum: '2024-07-15T18:00:00',
  ort: 'Park',
  maxTeilnehmer: 100,
  istOeffentlich: true,
  aktiv: true
});
```

### 6. VeranstaltungAnmeldung (Etkinlik Kayıtları) İşlemleri

```typescript
import { veranstaltungAnmeldungService } from './services';

// Etkinlik kayıtlarını getir
const anmeldungen = await veranstaltungAnmeldungService.getByVeranstaltungId(1);

// Üyenin kayıtlarını getir
const memberRegistrations = await veranstaltungAnmeldungService.getByMitgliedId(1);

// Duruma göre kayıtları getir
const confirmedRegistrations = await veranstaltungAnmeldungService.getByStatus(1);

// Yeni kayıt oluştur
const registration = await veranstaltungAnmeldungService.create({
  veranstaltungId: 1,
  mitgliedId: 1,
  teilnehmerAnzahl: 2,
  bemerkung: 'Ailemle birlikte geleceğim'
});

// Kayıt durumunu güncelle
await veranstaltungAnmeldungService.updateStatus(1, 'Onaylandı');

// Kayıt güncelle
await veranstaltungAnmeldungService.update(1, {
  teilnehmerAnzahl: 3,
  bemerkung: 'Katılımcı sayısı arttı'
});
```

### 7. VeranstaltungBild (Etkinlik Resimleri) İşlemleri

```typescript
import { veranstaltungBildService } from './services';

// Etkinlik resimlerini getir
const bilder = await veranstaltungBildService.getByVeranstaltungId(1);

// Resim yükle
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const uploadedImage = await veranstaltungBildService.uploadImage(
    1, // veranstaltungId
    file,
    'Etkinlik Fotoğrafı', // titel
    1 // reihenfolge
  );
}

// Mevcut yol ile resim oluştur
const newBild = await veranstaltungBildService.create({
  veranstaltungId: 1,
  bildPfad: '/uploads/event-photo.jpg',
  titel: 'Ana Fotoğraf',
  istHauptbild: true
});

// Resimleri yeniden sırala
const sortOrders = {
  1: 2,  // ID 1'i 2. sıraya
  2: 1,  // ID 2'yi 1. sıraya
  3: 3   // ID 3'ü 3. sırada tut
};
await veranstaltungBildService.reorderImages(1, sortOrders);

// Resim sil
await veranstaltungBildService.delete(1);
```

## 🛠️ Utility Fonksiyonları

### Mitglied Utils

```typescript
import { mitgliedUtils } from './services';

// Tam ad
const fullName = mitgliedUtils.getFullName(mitglied);

// Yaş hesapla
const age = mitgliedUtils.calculateAge(mitglied.geburtsdatum);

// Üyelik süresi
const duration = mitgliedUtils.getMembershipDuration(mitglied.eintrittsdatum);

// Durum metni
const status = mitgliedUtils.getStatusText(mitglied);

// Durum rengi
const color = mitgliedUtils.getStatusColor(mitglied);
```

### Veranstaltung Utils

```typescript
import { veranstaltungUtils } from './services';

// Tarih formatla
const dateStr = veranstaltungUtils.formatEventDate(
  event.startdatum,
  event.enddatum
);

// Saat formatla
const timeStr = veranstaltungUtils.formatEventTime(
  event.startdatum,
  event.enddatum
);

// Gelecek mi?
const isUpcoming = veranstaltungUtils.isUpcoming(event.startdatum);

// Geçmiş mi?
const isPast = veranstaltungUtils.isPast(event.startdatum, event.enddatum);

// Bugün mü?
const isToday = veranstaltungUtils.isToday(event.startdatum);

// Etkinliğe kaç gün kaldı?
const daysUntil = veranstaltungUtils.getDaysUntilEvent(event.startdatum);

// Etkinlik durumu
const status = veranstaltungUtils.getEventStatus(
  event.startdatum,
  event.enddatum
);
```

## ⚠️ Hata Yönetimi

Tüm servisler merkezi hata yönetimi kullanır:

```typescript
try {
  const verein = await vereinService.getById(1);
  console.log('Başarılı:', verein);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Dernek bulunamadı');
  } else if (error.response?.status === 401) {
    console.error('Yetkilendirme hatası');
  } else {
    console.error('Bir hata oluştu:', error.message);
  }
}
```

## 📝 Best Practices

1. **Type Safety**: Her zaman TypeScript type'larını kullanın
2. **Error Handling**: Try-catch blokları kullanın
3. **Loading States**: API çağrıları sırasında loading state'i gösterin
4. **Caching**: React Query veya benzeri bir kütüphane kullanın
5. **Pagination**: Büyük listeler için pagination kullanın

## 🔗 İlgili Dokümantasyon

- [Web-API Entegrasyon Durumu](./web-api-integration.md)
- [Backend API Dokümantasyonu](../README.md)
- [Type Tanımlamaları](../verein-web/src/types/)

---

**Son Güncelleme:** 2025-10-13

