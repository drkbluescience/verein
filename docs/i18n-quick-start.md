# Çoklu Dil Desteği - Hızlı Başlangıç

## Özet

Verein web uygulamasına **Türkçe** ve **Almanca** dil desteği eklenmiştir. Kullanıcılar Ayarlar sayfasından diledikleri dili seçebilirler.

## Nasıl Kullanılır?

### Kullanıcı Olarak

1. Uygulamaya giriş yapın
2. Ayarlar sayfasına gidin (Settings)
3. "Dil ve Bölge" bölümünden istediğiniz dili seçin
4. "Kaydet" butonuna tıklayın
5. Uygulama seçtiğiniz dilde görüntülenecektir

### Geliştirici Olarak

#### Component'te Çeviri Kullanma

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mypage', 'common']);
  
  return (
    <div>
      <h1>{t('mypage:title')}</h1>
      <button>{t('common:actions.save')}</button>
    </div>
  );
};
```

#### Yeni Çeviri Ekleme

1. İlgili dil dosyasını açın: `src/locales/tr/mypage.json`
2. Çeviri anahtarını ekleyin:
   ```json
   {
     "title": "Başlık",
     "description": "Açıklama"
   }
   ```
3. Aynı anahtarı Almanca dosyasına da ekleyin: `src/locales/de/mypage.json`
   ```json
   {
     "title": "Titel",
     "description": "Beschreibung"
   }
   ```

## Dosya Yapısı

```
src/
├── locales/
│   ├── tr/          # Türkçe çeviriler
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   ├── settings.json
│   │   └── ...
│   └── de/          # Almanca çeviriler
│       ├── common.json
│       ├── dashboard.json
│       ├── settings.json
│       └── ...
├── i18n/
│   └── config.ts    # i18n yapılandırması
└── react-i18next.d.ts  # TypeScript tip tanımları
```

## Önemli Notlar

- Varsayılan dil: **Türkçe**
- Dil tercihi tarayıcıda saklanır (localStorage)
- Çeviri anahtarları her iki dilde de aynı olmalıdır
- Namespace kullanımı zorunludur: `t('namespace:key')`

## Detaylı Dokümantasyon

Daha fazla bilgi için [i18n-implementation.md](./i18n-implementation.md) dosyasına bakın.

## Yapılan Değişiklikler

### Yeni Dosyalar
- ✅ `src/locales/tr/*.json` - Türkçe çeviri dosyaları
- ✅ `src/locales/de/*.json` - Almanca çeviri dosyaları
- ✅ `src/i18n/config.ts` - i18n yapılandırması
- ✅ `src/react-i18next.d.ts` - TypeScript tip tanımları

### Güncellenen Dosyalar
- ✅ `src/App.tsx` - i18n başlatma
- ✅ `src/pages/Dashboard/Dashboard.tsx` - Çeviriler eklendi
- ✅ `src/pages/Settings/Settings.tsx` - Dil değiştirme özelliği
- ✅ `src/components/Common/Loading.tsx` - Çeviriler eklendi
- ✅ `src/components/Common/ErrorMessage.tsx` - Çeviriler eklendi

### Yüklenen Paketler
- `i18next`
- `react-i18next`
- `i18next-browser-languagedetector`

## Test Etme

1. Uygulamayı başlatın: `npm start`
2. Tarayıcıda açın: `http://localhost:3000`
3. Ayarlar sayfasına gidin
4. Dili Almanca'ya değiştirin
5. Sayfadaki metinlerin Almanca'ya dönüştüğünü kontrol edin

## Sorun mu Yaşıyorsunuz?

- Tarayıcı konsolunu kontrol edin
- localStorage'ı temizleyin ve tekrar deneyin
- Sayfayı yenileyin (F5)
- Detaylı dokümantasyona bakın

## Katkıda Bulunma

Yeni çeviriler eklemek veya mevcut çevirileri düzeltmek için:

1. İlgili JSON dosyasını düzenleyin
2. Her iki dilde de (TR ve DE) aynı anahtarları kullanın
3. Değişikliklerinizi test edin
4. Pull request oluşturun

---

**Not**: Bu özellik aktif olarak geliştirilmektedir. Tüm sayfalar henüz çevrilmemiştir.

