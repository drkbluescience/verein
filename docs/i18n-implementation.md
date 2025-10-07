# Çoklu Dil Desteği (i18n) Dokümantasyonu

## Genel Bakış

Verein web uygulamasına profesyonel bir çoklu dil desteği eklenmiştir. Uygulama şu anda **Türkçe** ve **Almanca** dillerini desteklemektedir.

## Kullanılan Teknolojiler

- **i18next**: Çoklu dil yönetimi için temel kütüphane
- **react-i18next**: React entegrasyonu
- **i18next-browser-languagedetector**: Tarayıcı dil algılama

## Dil Dosyaları Yapısı

Dil dosyaları her sayfa için ayrı namespace'lerle organize edilmiştir. Bu yapı sayesinde:
- Çevirilerin yönetimi kolaydır
- Her sayfa için çeviriler bağımsız olarak düzenlenebilir
- Yeni dil eklemek basittir

### Dosya Konumları

```
verein-web/src/locales/
├── tr/                      # Türkçe çeviriler
│   ├── common.json          # Genel çeviriler (butonlar, durumlar, vb.)
│   ├── dashboard.json       # Dashboard sayfası
│   ├── settings.json        # Ayarlar sayfası
│   ├── auth.json            # Giriş/Çıkış sayfaları
│   ├── profile.json         # Profil sayfası
│   ├── vereine.json         # Dernekler sayfası
│   ├── mitglieder.json      # Üyeler sayfası
│   └── veranstaltungen.json # Etkinlikler sayfası
└── de/                      # Almanca çeviriler
    ├── common.json
    ├── dashboard.json
    ├── settings.json
    ├── auth.json
    ├── profile.json
    ├── vereine.json
    ├── mitglieder.json
    └── veranstaltungen.json
```

## Yapılandırma

### i18n Konfigürasyonu

Konfigürasyon dosyası: `verein-web/src/i18n/config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını import et
// ...

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(), // localStorage'dan kaydedilmiş dili al
    fallbackLng: 'tr',       // Varsayılan dil: Türkçe
    defaultNS: 'common',     // Varsayılan namespace
    ns: ['common', 'dashboard', 'settings', ...],
  });
```

### App.tsx Entegrasyonu

```typescript
import './i18n/config'; // i18n'i başlat
```

## Kullanım

### Component İçinde Kullanım

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['namespace1', 'namespace2']);
  
  return (
    <div>
      <h1>{t('namespace1:title')}</h1>
      <p>{t('common:actions.save')}</p>
    </div>
  );
};
```

### Dil Değiştirme

Settings sayfasında dil değiştirme:

```typescript
const { t, i18n } = useTranslation(['settings', 'common']);

const handleLanguageChange = (language: string) => {
  i18n.changeLanguage(language);
  // localStorage'a kaydet
  localStorage.setItem('app-settings', JSON.stringify({ ...settings, language }));
};
```

## Dil Dosyası Örnekleri

### common.json (Genel Çeviriler)

```json
{
  "app": {
    "name": "Verein Yönetim Sistemi",
    "title": "Verein"
  },
  "navigation": {
    "dashboard": "Ana Sayfa",
    "vereine": "Dernekler",
    "mitglieder": "Üyeler"
  },
  "actions": {
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil"
  },
  "status": {
    "loading": "Yükleniyor...",
    "success": "Başarılı",
    "error": "Hata"
  }
}
```

### dashboard.json (Dashboard Sayfası)

```json
{
  "title": "Dashboard",
  "subtitle": "Verein yönetim sistemi genel durumu",
  "systemStatus": {
    "title": "Sistem Durumu",
    "connected": "API Bağlı",
    "disconnected": "API Bağlantısı Yok"
  },
  "statistics": {
    "title": "İstatistikler",
    "totalVereine": "Toplam Dernekler"
  }
}
```

## Yeni Dil Ekleme

1. **Dil dosyalarını oluştur**: `src/locales/[dil_kodu]/` klasörü altında tüm JSON dosyalarını oluştur
2. **config.ts'yi güncelle**: Yeni dil dosyalarını import et ve resources'a ekle
3. **Settings sayfasını güncelle**: Dil seçeneklerine yeni dili ekle

```typescript
// config.ts
import commonEn from '../locales/en/common.json';
// ... diğer import'lar

const resources = {
  tr: { ... },
  de: { ... },
  en: {  // Yeni dil
    common: commonEn,
    // ...
  }
};
```

```typescript
// Settings.tsx
<option value="en">English</option>
```

## Çeviri Anahtarları Kullanım Kuralları

1. **Namespace kullanımı**: Her zaman namespace belirt
   ```typescript
   t('dashboard:title')  // ✅ Doğru
   t('title')            // ❌ Yanlış
   ```

2. **Nokta notasyonu**: İç içe objelere erişim için nokta kullan
   ```typescript
   t('common:actions.save')
   t('dashboard:systemStatus.connected')
   ```

3. **Parametreli çeviriler**: Dinamik değerler için
   ```json
   {
     "validation": {
       "minLength": "En az {{count}} karakter olmalıdır"
     }
   }
   ```
   ```typescript
   t('common:validation.minLength', { count: 5 })
   ```

## Güncellenmiş Sayfalar

Aşağıdaki sayfalar i18n ile entegre edilmiştir:

- ✅ **Dashboard** (`pages/Dashboard/Dashboard.tsx`)
- ✅ **Settings** (`pages/Settings/Settings.tsx`)
- ✅ **Loading Component** (`components/Common/Loading.tsx`)
- ✅ **ErrorMessage Component** (`components/Common/ErrorMessage.tsx`)

## Gelecek Geliştirmeler

- [ ] Diğer sayfaların i18n entegrasyonu (Vereine, Mitglieder, Veranstaltungen, vb.)
- [ ] Tarih ve sayı formatlaması için i18n kullanımı
- [ ] Dil değişikliğinde sayfa yenileme olmadan güncelleme
- [ ] İngilizce dil desteği ekleme
- [ ] Çeviri eksikliklerini otomatik tespit etme

## Sorun Giderme

### TypeScript Hataları

Eğer `useTranslation` kullanırken TypeScript hataları alıyorsanız:

```typescript
// @ts-ignore - i18next type definitions
const { t } = useTranslation(['namespace']);
```

### Çeviriler Görünmüyor

1. Dil dosyasının doğru konumda olduğundan emin olun
2. `config.ts`'de import edildiğinden emin olun
3. Namespace'in doğru belirtildiğinden emin olun
4. Tarayıcı konsolunda hata olup olmadığını kontrol edin

### Dil Değişmiyor

1. localStorage'da `app-settings` anahtarını kontrol edin
2. `i18n.changeLanguage()` fonksiyonunun çağrıldığından emin olun
3. Sayfayı yenileyin

## Notlar

- Varsayılan dil: **Türkçe (tr)**
- Fallback dil: **Türkçe (tr)**
- Dil tercihi localStorage'da saklanır
- Uygulama ilk açılışta localStorage'daki dil tercihini kullanır
- Eğer localStorage'da kayıtlı dil yoksa, varsayılan dil (Türkçe) kullanılır

## Katkıda Bulunma

Yeni çeviriler eklerken veya mevcut çevirileri güncellerken:

1. Aynı anahtar yapısını her iki dilde de koruyun
2. Çeviri anahtarlarını anlamlı ve tutarlı isimlendirin
3. Uzun metinler için açıklayıcı anahtarlar kullanın
4. Değişikliklerinizi test edin

## İletişim

Sorularınız veya önerileriniz için lütfen proje yöneticisiyle iletişime geçin.

