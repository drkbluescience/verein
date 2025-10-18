# 📊 Raporlar Sayfası - Özet

## ✅ Tamamlanan İşlemler

### 1. **Yeni Sayfalar Oluşturuldu**

#### 📁 Dosya Yapısı
```
verein-web/src/pages/Reports/
├── Reports.tsx          # Ana rapor sayfası (role-based routing)
├── AdminRaporlar.tsx    # Admin için genel raporlar
├── DernekRaporlar.tsx   # Dernek yöneticisi için raporlar
└── Reports.css          # Rapor sayfaları için stil dosyası
```

---

### 2. **Admin Raporları (AdminRaporlar.tsx)**

**Erişim:** Sadece `admin` rolündeki kullanıcılar

**İçerik:**
- 📊 **Genel İstatistikler**
  - Toplam Dernek Sayısı (aktif/pasif)
  - Toplam Üye Sayısı (aktif/pasif)
  - Son 30 Günde Yeni Üye Kayıtları
  - Dernek Başına Ortalama Üye Sayısı

- 📈 **Yaş Dağılımı Grafiği**
  - 0-18 yaş
  - 19-30 yaş
  - 31-45 yaş
  - 46-60 yaş
  - 60+ yaş

- ⚧ **Cinsiyet Dağılımı**
  - Erkek üye sayısı ve yüzdesi
  - Kadın üye sayısı ve yüzdesi

- 📋 **Dernek Bazlı İstatistikler Tablosu**
  - Her dernek için toplam üye
  - Her dernek için aktif üye
  - Aktif üye oranı (%)

---

### 3. **Dernek Raporları (DernekRaporlar.tsx)**

**Erişim:** Sadece `dernek` rolündeki kullanıcılar (kendi dernekleri için)

**İçerik:**
- 📊 **Genel Bakış**
  - Toplam Üye Sayısı (aktif/pasif)
  - Toplam Etkinlik Sayısı (yaklaşan)
  - Son 30 Günde Yeni Üye Kayıtları
  - Aktif Üye Oranı (%)

- 📈 **Yaş Dağılımı Grafiği**
  - Derneğe kayıtlı üyelerin yaş gruplarına göre dağılımı

- ⚧ **Cinsiyet Dağılımı**
  - Derneğe kayıtlı üyelerin cinsiyet dağılımı

- 📊 **Aylık Üye Kayıt Trendi**
  - Son 6 ayın aylık üye kayıt grafiği
  - Trend analizi

- 📅 **Yaklaşan Etkinlikler (30 Gün)**
  - Önümüzdeki 30 gün içindeki etkinlikler
  - Etkinlik adı, tarihi, kayıt durumu, üye/herkese açık bilgisi

---

### 4. **Routing Güncellemesi**

**App.tsx** dosyasında `/reports` route'u güncellendi:

```tsx
import Reports from './pages/Reports/Reports';

// ...

<Route path="/reports" element={
  <Layout>
    <Reports />
  </Layout>
} />
```

**Reports.tsx** kullanıcı rolüne göre doğru sayfayı gösterir:
- `admin` → `AdminRaporlar`
- `dernek` → `DernekRaporlar`
- `mitglied` → Erişim yok mesajı

---

### 5. **Demo Data Güncellemesi**

**DEMO_DATA.sql** dosyası güncellendi:

#### Yeni Üyeler Eklendi:
- **München Derneği:** 7 temel üye + 3 aile üyesi = 10 üye (eskiden 3)
  - Farklı yaş grupları: 2005, 1995, 1988, 1962 doğumlular
  - Farklı kayıt tarihleri: 2, 4, 6, 8 ay önce
  - Aile üyeleri: Mehmet Özkan (M008), Ali Özkan (M009), Elif Özkan (M010)

- **Berlin Derneği:** 5 üye (eskiden 2)
  - Farklı yaş grupları: 2008, 1978, 1992 doğumlular
  - Farklı kayıt tarihleri: 3, 5, 7 ay önce

**Toplam:** 15 üye (12 temel + 3 aile, eskiden 5)

#### Yeni Etkinlikler Eklendi:
- **München Derneği:** 5 etkinlik (eskiden 2)
  - Türkischer Kulturabend (15 gün sonra)
  - Deutsch-Türkisches Fußballturnier (30 gün sonra)
  - Kinder-Sprachkurs Türkisch (7 gün sonra)
  - Mitgliederversammlung 2025 (20 gün sonra)
  - Türkischer Filmabend (40 gün sonra)

- **Berlin Derneği:** 6 etkinlik (eskiden 2)
  - Integrationsseminar (10 gün önce - geçmiş)
  - Ramadan Iftar Abend (45 gün sonra)
  - Türkisch-Deutsche Kochkurs (12 gün sonra)
  - Jugendtreffen (25 gün sonra)
  - Sommerfest 2025 (60 gün sonra)

**Toplam:** 11 etkinlik (eskiden 4)

---

## 🎨 Tasarım Özellikleri

### Responsive Design
- Mobil, tablet ve desktop uyumlu
- Grid layout otomatik ayarlanır
- Tablolar yatay scroll destekler

### Renkli Grafikler
- **Yaş Dağılımı:** Yeşil gradient
- **Erkek:** Mavi gradient
- **Kadın:** Pembe gradient
- **Trend:** Turuncu gradient

### Animasyonlar
- Hover efektleri
- Grafik barları animasyonlu genişler
- Smooth transitions

---

## 🚀 Kullanım

### 1. **Demo Data'yı Yükleyin**
```sql
-- SQL Server Management Studio'da çalıştırın
USE [VEREIN];
GO

-- DEMO_DATA.sql dosyasını çalıştırın
```

### 2. **Backend'i Başlatın**
```bash
cd verein-api
dotnet run
```

### 3. **Frontend'i Başlatın**
```bash
cd verein-web
npm start
```

### 4. **Test Edin**

#### Admin Hesabı:
- Email: `admin@dernek.com`
- Menü: **Raporlar**
- Görüntü: Tüm dernekler için genel raporlar

#### Dernek Yöneticisi (München):
- Email: `ahmet.yilmaz@email.com`
- Menü: **Raporlarımız**
- Görüntü: Sadece München derneği raporları

#### Dernek Yöneticisi (Berlin):
- Email: `mehmet.demir@email.com`
- Menü: **Raporlarımız**
- Görüntü: Sadece Berlin derneği raporları

---

## 📝 Notlar

1. **Mitglied (Üye) Rolü:** Raporlar sayfasına erişemez (menüde görünmez)

2. **Gerçek Zamanlı Veriler:** Tüm istatistikler veritabanından gerçek zamanlı çekilir

3. **Trend Analizi:** Son 6 ayın aylık kayıt trendi gösterilir

4. **Yaklaşan Etkinlikler:** Sadece önümüzdeki 30 gün içindeki etkinlikler listelenir

5. **Aktif/Pasif Filtreleme:** Aktif ve pasif üyeler ayrı ayrı sayılır

---

## ✅ Tamamlandı!

Raporlar sayfası tamamen çalışır durumda ve demo data ile test edilmeye hazır! 🎉

