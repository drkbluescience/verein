# Banka Ödemeleri Yükleme Kılavuzu

## 📋 Genel Bakış

Bu özellik, bankadan aldığınız ödeme Excel dosyasını sisteme yükleyerek üye ödemelerini otomatik olarak işlemenizi sağlar.

## 🎯 Özellikler

- ✅ Excel dosyası yükleme (drag & drop veya dosya seçimi)
- ✅ Otomatik üye eşleştirme
- ✅ Banka işlemi kaydı oluşturma
- ✅ Üye ödeme kaydı oluşturma
- ✅ Açık faturaları otomatik güncelleme
- ✅ Detaylı sonuç raporu

## 📁 Desteklenen Dosya Formatları

- Excel (.xlsx, .xls)
- CSV (.csv)
- Maksimum dosya boyutu: 10 MB

## 📊 Excel Dosyası Formatı

### Gerekli Sütunlar

Sistem aşağıdaki sütunları otomatik olarak tanır (Almanca veya İngilizce):

| Sütun Adı | Alternatif İsimler | Açıklama | Zorunlu |
|-----------|-------------------|----------|---------|
| **Buchungsdatum** | Datum, Date, Valuta | İşlem tarihi | ✅ Evet |
| **Betrag** | Amount, Wert | Ödeme tutarı | ✅ Evet |
| **Empfänger** | Auftraggeber, Name, Recipient | Ödemeyi yapan kişi | ❌ Hayır |
| **Verwendungszweck** | Zweck, Purpose, Beschreibung | Ödeme açıklaması | ❌ Hayır |
| **Referenz** | Reference, Ref | Referans numarası | ❌ Hayır |
| **IBAN** | Konto | Banka hesap numarası | ❌ Hayır |

### Örnek Excel Formatı

```csv
Buchungsdatum;Valuta;Empfänger/Auftraggeber;Betrag;Währung;Verwendungszweck;Referenz;IBAN
01.01.2024;01.01.2024;Ahmet Yılmaz;50,00;EUR;Mitgliedsbeitrag Januar 2024 - Mitglied 12345;REF-2024-001;DE89370400440532013000
05.01.2024;05.01.2024;Mehmet Demir;100,00;EUR;Mitgliedsbeitrag Januar 2024 - Mitglied 12346;REF-2024-002;DE89370400440532013001
```

### Sayı Formatı

Sistem hem Alman hem de İngiliz sayı formatlarını destekler:

- **Alman Format:** `1.234,56` (nokta binlik ayırıcı, virgül ondalık)
- **İngiliz Format:** `1,234.56` (virgül binlik ayırıcı, nokta ondalık)

### Tarih Formatı

Desteklenen tarih formatları:
- `DD.MM.YYYY` (örn: 01.01.2024)
- `DD/MM/YYYY` (örn: 01/01/2024)
- Excel tarih formatı (sayısal)

## 🔍 Üye Eşleştirme Algoritması

Sistem ödemeleri üyelere şu sırayla eşleştirir:

### 1. Mitgliedsnummer (Üye Numarası) ile Eşleştirme
- **Öncelik:** Yüksek
- **Arama Yeri:** Referenz veya Verwendungszweck sütunları
- **Örnek:** "Mitglied 12345" → Üye numarası 12345

### 2. İsim ile Eşleştirme (Fuzzy Matching)
- **Öncelik:** Orta
- **Arama Yeri:** Empfänger sütunu
- **Yöntem:** Vorname ve Nachname ile eşleştirme
- **Örnek:** "Ahmet Yılmaz" → Vorname: Ahmet, Nachname: Yılmaz

### Eşleştirme Durumları

| Durum | Açıklama | Sonuç |
|-------|----------|-------|
| ✅ **Success** | Üye bulundu ve ödeme kaydedildi | BankBuchung + MitgliedZahlung oluşturuldu |
| ⚠️ **Skipped** | Üye bulunamadı | Sadece BankBuchung oluşturuldu |
| ❌ **Failed** | Hata oluştu | İşlem yapılmadı |

## 📝 Kullanım Adımları

### 1. Sayfaya Erişim

- **URL:** `/finanzen/bank-upload`
- **Yetki:** Admin veya Dernek Yöneticisi
- **Menü:** Finanzlar → "Banka Ödemeleri Yükle" butonu

### 2. Banka Hesabı Seçimi

1. Açılır menüden ilgili banka hesabını seçin
2. Sistem sadece aktif banka hesaplarını gösterir

### 3. Excel Dosyası Yükleme

**Yöntem 1: Drag & Drop**
1. Excel dosyasını sürükleyip bırakma alanına sürükleyin
2. Dosya otomatik olarak seçilir

**Yöntem 2: Dosya Seçimi**
1. "Dosya seçmek için tıklayın" alanına tıklayın
2. Bilgisayarınızdan Excel dosyasını seçin

### 4. Dosya Validasyonu

Sistem otomatik olarak kontrol eder:
- ✅ Dosya formatı (.xlsx, .xls, .csv)
- ✅ Dosya boyutu (max 10 MB)
- ✅ Gerekli sütunlar (Buchungsdatum, Betrag)

### 5. Yükleme

1. "Yükle" butonuna tıklayın
2. Sistem dosyayı işlemeye başlar
3. İşlem tamamlanınca sonuç raporu görüntülenir

### 6. Sonuç Raporu

Rapor şu bilgileri içerir:

**Özet İstatistikler:**
- ✅ Başarılı işlemler
- ❌ Başarısız işlemler
- ⚠️ Atlanan işlemler (üye bulunamayan)

**Detaylı Sonuçlar:**
- Satır numarası
- Tarih
- Tutar
- Empfänger
- Durum (Success/Failed/Skipped)
- Mesaj
- Eşleşen üye (varsa)

## 📥 Örnek Dosyalar

Sistem iki örnek dosya sağlar:

### 1. Basit Format
- **Dosya:** `banka-odemeler-ornek.csv`
- **Sütunlar:** Buchungsdatum, Betrag, Empfänger, Verwendungszweck, Referenz, IBAN
- **Kayıt Sayısı:** 10

### 2. Detaylı Format (Banka Formatı)
- **Dosya:** `banka-odemeler-ornek-detayli.csv`
- **Sütunlar:** Buchungsdatum, Valuta, Empfänger/Auftraggeber, Betrag, Währung, Verwendungszweck, Referenz, IBAN
- **Kayıt Sayısı:** 17

**İndirme:** "Şablon İndir" butonuna tıklayın

## 🔄 İşlem Akışı

```
1. Excel Dosyası Yükleme
   ↓
2. Dosya Validasyonu
   ↓
3. Excel Parsing (EPPlus)
   ↓
4. Her Satır İçin:
   ├─ Üye Eşleştirme (Mitgliedsnummer/Name)
   ├─ BankBuchung Oluşturma
   ├─ MitgliedZahlung Oluşturma (üye varsa)
   ├─ MitgliedForderung Güncelleme (açık fatura varsa)
   └─ MitgliedForderungZahlung Allocation
   ↓
5. Sonuç Raporu
```

## ⚠️ Önemli Notlar

### Duplicate Kontrolü
- Sistem aynı tarih, tutar ve empfänger ile kayıt varsa **ATLAR**
- Tekrar yükleme yapılırsa duplicate oluşmaz

### Transaction Yönetimi
- Tüm işlemler transaction içinde yapılır
- Hata durumunda tüm işlemler geri alınır (rollback)

### Üye Durumu
- Sadece **aktif üyeler** (MitgliedStatusId = 1) eşleştirilir
- Pasif veya silinmiş üyeler göz ardı edilir

### Fatura Güncelleme
- Açık faturalar (StatusId = 1) otomatik ödendi olarak işaretlenir
- BezahltAm tarihi ödeme tarihine ayarlanır
- MitgliedForderungZahlung ile allocation yapılır

## 🐛 Hata Durumları

| Hata | Açıklama | Çözüm |
|------|----------|-------|
| **Geçersiz dosya türü** | Sadece .xlsx, .xls, .csv kabul edilir | Doğru formatta dosya yükleyin |
| **Dosya çok büyük** | Maksimum 10 MB | Dosyayı küçültün veya bölün |
| **Gerekli sütun eksik** | Buchungsdatum veya Betrag yok | Excel formatını kontrol edin |
| **Banka hesabı bulunamadı** | Seçilen hesap geçersiz | Aktif bir hesap seçin |
| **Üye bulunamadı** | Eşleştirme başarısız | Mitgliedsnummer veya isim kontrolü |

## 📞 Destek

Sorun yaşarsanız:
1. Örnek dosyaları indirip test edin
2. Excel formatınızı örnek dosyalarla karşılaştırın
3. Hata mesajlarını kontrol edin
4. Sistem yöneticisine başvurun

## 🔐 Güvenlik

- ✅ Sadece Admin ve Dernek Yöneticisi erişebilir
- ✅ JWT token ile authentication
- ✅ Verein bazlı yetkilendirme
- ✅ Dosya boyutu limiti
- ✅ Dosya formatı validasyonu
- ✅ SQL injection koruması (parameterized queries)

## 📊 Veritabanı Etkileri

Yükleme işlemi şu tabloları etkiler:

1. **Finanz.BankBuchung** - Banka işlemi kaydı
2. **Finanz.MitgliedZahlung** - Üye ödeme kaydı
3. **Finanz.MitgliedForderung** - Fatura durumu güncelleme
4. **Finanz.MitgliedForderungZahlung** - Ödeme-fatura eşleştirme

## 🎓 İpuçları

1. **İlk kez kullanıyorsanız:** Örnek dosyaları indirip test edin
2. **Büyük dosyalar:** Aylık veya haftalık parçalara bölün
3. **Üye eşleştirme:** Verwendungszweck'e "Mitglied XXXXX" ekleyin
4. **Kontrol:** Yüklemeden önce Excel'i açıp kontrol edin
5. **Yedekleme:** Önemli dosyaları yüklemeden önce veritabanı yedeği alın

---

**Son Güncelleme:** 2024-01-10
**Versiyon:** 1.0.0

