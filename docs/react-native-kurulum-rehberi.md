# React Native Mobil Uygulama Kurulum Rehberi

## 🎯 **Proje Durumu: HAZIR** ✅

- **Backend API**: `http://localhost:5103`
- **React Native App**: `VereinMobile/` klasöründe
- **Metro Bundler**: `http://localhost:8081`
- **API Test Interface**: Mobil uygulama içinde

## 📱 React Native Uygulaması

### Proje Yapısı
```
VereinMobile/
├── App.tsx                 # Ana uygulama dosyası
├── src/
│   └── services/
│       └── api.ts         # API service katmanı
├── android/               # Android platform dosyaları
├── ios/                   # iOS platform dosyaları
└── package.json          # Dependencies
```

### Özellikler
- ✅ **API Bağlantı Kontrolü**: Health check ile backend durumu
- ✅ **Verein Yönetimi**: Dernek ekleme, listeleme, silme
- ✅ **Responsive Design**: Mobil cihazlar için optimize edilmiş
- ✅ **Error Handling**: Kullanıcı dostu hata mesajları
- ✅ **Loading States**: Yükleme durumu göstergeleri
- ✅ **TypeScript**: Tip güvenliği

## 🚀 Kurulum ve Çalıştırma

### 1. Backend API'yi Başlat
```bash
# Ana dizinde
cd VereinsApi
dotnet run
```
API şu adreste çalışacak: `http://localhost:5103`

### 2. React Native Uygulamasını Başlat
```bash
# Ana dizinde
cd VereinMobile
npm start
```
Metro bundler şu adreste çalışacak: `http://localhost:8081`

### 3. Mobil Cihazda Çalıştır

#### Android için:
```bash
# Yeni terminal açın
cd VereinMobile
npx react-native run-android
```

#### iOS için (macOS gerekli):
```bash
# Yeni terminal açın
cd VereinMobile
npx react-native run-ios
```

#### Expo Go ile Test (Alternatif):
1. Telefona Expo Go uygulamasını yükleyin
2. Metro bundler'da gösterilen QR kodu okutun

## 🔧 API Konfigürasyonu

### Android Emulator için:
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://10.0.2.2:5103/api';
```

### iOS Simulator için:
```typescript
// src/services/api.ts  
const API_BASE_URL = 'http://localhost:5103/api';
```

### Fiziksel Cihaz için:
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://[BILGISAYAR_IP]:5103/api';
// Örnek: 'http://192.168.1.100:5103/api'
```

## 📋 Uygulama Özellikleri

### Ana Ekran
- **API Durumu**: Gerçek zamanlı bağlantı kontrolü
- **Dernek Listesi**: Mevcut dernekleri görüntüleme
- **Yeni Dernek**: Form ile dernek ekleme
- **Silme İşlemi**: Onay ile dernek silme

### Form Alanları
- **Dernek Adı**: Zorunlu alan
- **Dernek Türü**: Spor, Kültür, Sosyal, vb.
- **Kuruluş Tarihi**: Tarih seçimi
- **Üye Sayısı**: Sayısal değer
- **Açıklama**: Opsiyonel metin

### API Entegrasyonu
- **GET /api/Health**: Sistem durumu kontrolü
- **GET /api/Vereine**: Dernek listesi
- **POST /api/Vereine**: Yeni dernek oluşturma
- **DELETE /api/Vereine/{id}**: Dernek silme

## 🛠️ Geliştirme Notları

### Bağımlılıklar
- **React Native**: 0.81.4
- **TypeScript**: Tip güvenliği için
- **Axios**: HTTP istekleri için

### Stil Özellikleri
- **Modern UI**: Material Design ilkelerine uygun
- **Responsive**: Farklı ekran boyutları için uyumlu
- **Accessibility**: Erişilebilirlik desteği

### Hata Yönetimi
- **Network Errors**: Bağlantı hatalarında kullanıcı bilgilendirmesi
- **Validation**: Form doğrulama kontrolleri
- **Loading States**: İşlem durumu göstergeleri

## 🔄 Sonraki Adımlar

### Planlanan Özellikler
1. **Adres Yönetimi**: Dernek adreslerini ekleme/düzenleme
2. **Üye Yönetimi**: Dernek üyelerini yönetme
3. **Etkinlik Yönetimi**: Dernek etkinliklerini planlama
4. **Offline Support**: Çevrimdışı çalışma desteği
5. **Push Notifications**: Bildirim sistemi

### Geliştirme Önerileri
- **State Management**: Redux veya Context API entegrasyonu
- **Navigation**: React Navigation ile çoklu ekran
- **Testing**: Jest ve Detox ile test yazma
- **CI/CD**: Otomatik build ve deployment

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Metro bundler loglarını kontrol edin
2. Backend API'nin çalıştığından emin olun
3. Network bağlantısını kontrol edin
4. Cihaz/emulator ayarlarını gözden geçirin

**Başarılı test için backend API'nin çalışır durumda olması gereklidir!** 🎯
