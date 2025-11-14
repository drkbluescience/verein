# Demo Hesaplar

Bu dokümanda veritabanındaki demo hesaplar ve giriş bilgileri yer almaktadır.

## 🔐 Giriş Bilgileri

### 1. Admin Hesabı
- **Email:** `admin@dernek.com`
- **Rol:** System Admin
- **Yetkiler:** Tüm dernekler ve üyeler üzerinde tam yetki
- **Açıklama:** Sistem yöneticisi, tüm verilere erişebilir

---

### 2. Dernek Yöneticisi Hesapları

#### München Derneği Yöneticisi
- **Email:** `ahmet.yilmaz@email.com`
- **Ad Soyad:** Ahmet Yılmaz
- **Dernek:** Türkisch-Deutscher Kulturverein München (TDKV München)
- **Dernek Email:** info@tdkv-muenchen.de
- **Rol:** Dernek Yöneticisi (Vorstandsvorsitzender)
- **Yetkiler:** München derneği ve üyeleri üzerinde yönetim yetkisi
- **Mitglied ID:** M001

#### Berlin Derneği Yöneticisi
- **Email:** `mehmet.demir@email.com`
- **Ad Soyad:** Mehmet Demir
- **Dernek:** Deutsch-Türkische Freundschaft Berlin (DTF Berlin)
- **Dernek Email:** kontakt@dtf-berlin.de
- **Rol:** Dernek Yöneticisi (Vorstandsvorsitzender)
- **Yetkiler:** Berlin derneği ve üyeleri üzerinde yönetim yetkisi
- **Mitglied ID:** B001

---

### 3. Üye Hesapları

#### München Derneği Üyesi - Fatma Özkan
- **Email:** `fatma.ozkan@email.com`
- **Ad Soyad:** Fatma Özkan
- **Dernek:** TDKV München
- **Rol:** Üye (Mitglied)
- **Yetkiler:** Kendi bilgilerini görüntüleme ve güncelleme
- **Mitglied ID:** M002
- **Özel Not:** Aile ilişkileri test senaryosu için kullanılır

#### München Derneği Üyesi - Can Schmidt
- **Email:** `can.schmidt@email.com`
- **Ad Soyad:** Can Schmidt
- **Dernek:** TDKV München
- **Rol:** Üye (Mitglied)
- **Yetkiler:** Kendi bilgilerini görüntüleme ve güncelleme
- **Mitglied ID:** M003

#### Berlin Derneği Üyesi - Ayşe Kaya
- **Email:** `ayse.kaya@email.com`
- **Ad Soyad:** Ayşe Kaya
- **Dernek:** DTF Berlin
- **Rol:** Üye (Mitglied)
- **Yetkiler:** Kendi bilgilerini görüntüleme ve güncelleme
- **Mitglied ID:** B002

---

## 📋 Veritabanı Yapısı

### Verein (Dernek) Tablosu
| Dernek | Email | Vorstandsvorsitzender |
|--------|-------|----------------------|
| TDKV München | info@tdkv-muenchen.de | Ahmet Yılmaz |
| DTF Berlin | kontakt@dtf-berlin.de | Mehmet Demir |

### Mitglied (Üye) Tablosu
| Email | Ad Soyad | Dernek | Rol |
|-------|----------|--------|-----|
| ahmet.yilmaz@email.com | Ahmet Yılmaz | München | Vorstandsvorsitzender |
| fatma.ozkan@email.com | Fatma Özkan | München | Üye |
| can.schmidt@email.com | Can Schmidt | München | Üye |
| mehmet.demir@email.com | Mehmet Demir | Berlin | Vorstandsvorsitzender |
| ayse.kaya@email.com | Ayşe Kaya | Berlin | Üye |

---

## 🔍 Giriş Mantığı

### AuthController Login Akışı:

1. **Admin Kontrolü:**
   - Email'de "admin" kelimesi varsa → `userType: "admin"`

2. **Mitglied Kontrolü:**
   - Mitglied tablosunda email aranır
   - Bulunursa → Verein'in Vorstandsvorsitzender alanı kontrol edilir
     - Eğer bu kişinin adı Vorstandsvorsitzender'de varsa → `userType: "dernek"`
     - Yoksa → `userType: "mitglied"`

3. **Verein Kontrolü:**
   - Verein tablosunda email aranır
   - Bulunursa → `userType: "dernek"`

### Önemli Notlar:
- Dernek Yöneticileri **Mitglied tablosunda** kayıtlıdır
- Vorstandsvorsitzender kontrolü ile "dernek" yetkisi alırlar
- Verein email'leri (info@tdkv-muenchen.de) kurumsal iletişim içindir, giriş için kullanılmaz
- Aynı kişi hem üye hem de yönetici olabilir (Vorstandsvorsitzender)

---

## 🧪 Test Senaryoları

### Finanz (Finans) Modülü:
- **Ahmet Yılmaz:** Ödeme yapılmış alacak (F-2025-001)
- **Fatma Özkan:** Açık alacak + Ön ödeme (50 EUR)
- **Can Schmidt:** Vadesi geçmiş alacak (F-2025-003)
- **Mehmet Demir:** Ödeme yapılmış alacak (F-2025-101)

### Aile İlişkileri:
- **Fatma Özkan:** Aile sayfası test senaryosu için kullanılır

### Raporlar:
- **Admin (admin@dernek.com):** Tüm dernekler için raporlar
- **Ahmet Yılmaz:** München raporları
- **Mehmet Demir:** Berlin raporları

---

## 📅 Son Güncelleme
Bu dokümandaki bilgiler `database/COMPLETE_DEMO_DATA.sql` dosyasından alınmıştır.

