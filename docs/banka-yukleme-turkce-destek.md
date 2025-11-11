# 🇹🇷 Banka Ödemeleri Yükleme - Türkçe Destek

## 📋 Genel Bakış

Banka ödemeleri yükleme sistemi artık **Türkçe, Almanca ve İngilizce** sütun isimlerini desteklemektedir.

---

## ✅ Desteklenen Sütun İsimleri

### 1. **Tarih Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| Tarih | Datum, Buchungsdatum, Valuta | Date |

**Örnek değerler:**
- `2024-01-15`
- `15.01.2024`
- `15/01/2024`

---

### 2. **Tutar Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| Tutar, Miktar | Betrag, Wert | Amount |

**Örnek değerler:**
- `50.00`
- `50,00`
- `1.234,56`

**Not:** Sistem hem nokta hem virgül ondalık ayırıcılarını destekler.

---

### 3. **Alıcı/Gönderen Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| Alıcı, Gönderen | Empfänger, Auftraggeber, Name | Recipient, Name |

**Örnek değerler:**
- `Ahmet Yılmaz`
- `Ayşe Demir`
- `Mehmet Kaya`

**Not:** Türkçe karakterler (ı, ğ, ü, ş, ö, ç) desteklenir.

---

### 4. **Açıklama Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| Açıklama | Verwendungszweck, Zweck, Beschreibung | Purpose, Description |

**Örnek değerler:**
- `Üyelik Aidatı Ocak 2024`
- `Yıllık Aidat`
- `Bağış`

---

### 5. **Referans Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| Referans | Referenz | Reference, Ref |

**Örnek değerler:**
- `UYE-001`
- `MB-2024-01`
- `REF-12345`

---

### 6. **IBAN/Hesap Sütunu**
| Türkçe | Almanca | İngilizce |
|--------|---------|-----------|
| IBAN, Hesap | IBAN, Konto | IBAN, Account |

**Örnek değerler:**
- `TR330006100519786457841326`
- `DE89370400440532013000`

**Not:** IBAN boşluklarla veya boşluksuz yazılabilir.

---

## 📝 Örnek Excel/CSV Dosyası

### Türkçe Format:
```csv
Tarih,Tutar,Alıcı,Açıklama,Referans,IBAN
2024-01-15,50.00,Ahmet Yılmaz,Üyelik Aidatı Ocak,UYE-001,TR330006100519786457841326
2024-01-16,75.00,Ayşe Demir,Yıllık Aidat 2024,UYE-002,TR330006100519786457841327
2024-01-17,100.00,Mehmet Kaya,Bağış,BAGIS-001,TR330006100519786457841328
```

### Almanca Format:
```csv
Datum,Betrag,Empfänger,Verwendungszweck,Referenz,IBAN
2024-01-15,50.00,Max Mustermann,Mitgliedsbeitrag Januar,MB-001,DE89370400440532013000
2024-01-16,75.00,Anna Schmidt,Jahresbeitrag 2024,MB-002,DE89370400440532013001
```

### İngilizce Format:
```csv
Date,Amount,Recipient,Purpose,Reference,IBAN
2024-01-15,50.00,John Doe,Membership Fee January,MEM-001,GB82WEST12345698765432
2024-01-16,75.00,Jane Smith,Annual Fee 2024,MEM-002,GB82WEST12345698765433
```

---

## 🎯 Önemli Notlar

### ✅ **Zorunlu Sütunlar:**
1. **Tarih** (Datum/Date/Tarih)
2. **Tutar** (Betrag/Amount/Tutar)

### ⚠️ **Opsiyonel Sütunlar:**
- Alıcı/Gönderen
- Açıklama
- Referans
- IBAN

### 🔍 **Otomatik Eşleştirme:**
Sistem üyeleri şu sırayla eşleştirir:
1. **IBAN** eşleşmesi (en güvenilir)
2. **İsim** eşleşmesi (Alıcı/Gönderen alanında)
3. **Referans** eşleşmesi (Açıklama veya Referans alanında üye numarası)

---

## 📥 Template İndirme

Sistem otomatik olarak **Türkçe template** oluşturur:
- Dosya adı: `banka-yukleme-sablonu.csv`
- Sütunlar: Tarih, Tutar, Alıcı, Açıklama, Referans, IBAN
- Örnek satır dahil

---

## 🚀 Kullanım Adımları

1. **Template İndir** butonuna tıklayın
2. Excel/CSV dosyanızı template formatına göre hazırlayın
3. **Banka Hesabı** seçin
4. Dosyayı **sürükle-bırak** veya **dosya seçici** ile yükleyin
5. **Yükle** butonuna tıklayın
6. Sonuçları inceleyin:
   - ✅ Başarılı işlemler
   - ⚠️ Atlanan işlemler (duplicate)
   - ❌ Hatalı işlemler

---

## 🔧 Teknik Detaylar

### Desteklenen Dosya Formatları:
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma Separated Values)

### Maksimum Dosya Boyutu:
- **10 MB**

### Karakter Kodlaması:
- **UTF-8** (Türkçe karakterler için önerilir)
- **ISO-8859-9** (Türkçe)
- **Windows-1254** (Türkçe)

### Ondalık Ayırıcılar:
- Nokta (`.`) → `50.00`
- Virgül (`,`) → `50,00`

### Binlik Ayırıcılar:
- Nokta (`.`) → `1.234,56`
- Virgül (`,`) → `1,234.56`
- Boşluk → `1 234,56`

---

## 📊 Örnek Sonuç Raporu

```json
{
  "success": true,
  "message": "15 işlem başarıyla işlendi, 0 hata, 2 atlandı",
  "successCount": 15,
  "failedCount": 0,
  "skippedCount": 2,
  "details": [
    {
      "rowNumber": 2,
      "status": "Success",
      "message": "İşlem başarıyla işlendi ve Ahmet Yılmaz ile eşleştirildi",
      "bankBuchungId": 123,
      "mitgliedId": 45,
      "mitgliedName": "Ahmet Yılmaz",
      "mitgliedZahlungId": 67
    }
  ]
}
```

---

## 🎓 İpuçları

### ✅ **En İyi Uygulamalar:**
1. **IBAN kullanın** - En güvenilir eşleştirme yöntemi
2. **Referans numarası ekleyin** - Üye numarası veya işlem referansı
3. **Tutarlı format kullanın** - Aynı tarih ve tutar formatını koruyun
4. **Türkçe karakterleri koruyun** - UTF-8 kodlaması kullanın

### ⚠️ **Dikkat Edilmesi Gerekenler:**
1. **Duplicate işlemler** - Aynı referans numarasıyla tekrar yükleme yapmayın
2. **Tarih formatı** - Excel'in tarih formatını kontrol edin
3. **Tutar formatı** - Negatif tutarlar için `-` işareti kullanın
4. **Boş satırlar** - Excel'de boş satırlar bırakmayın

---

## 🔄 Güncelleme Geçmişi

### v1.1.0 (2024-01-XX)
- ✅ Türkçe sütun isimleri desteği eklendi
- ✅ Türkçe template oluşturma
- ✅ Türkçe karakter desteği (ı, ğ, ü, ş, ö, ç)
- ✅ Esnek sütun eşleştirme

### v1.0.0 (2024-01-XX)
- ✅ İlk sürüm (Almanca ve İngilizce)

---

## 📞 Destek

Sorun yaşarsanız:
1. Dosya formatını kontrol edin
2. Sütun isimlerini kontrol edin
3. Hata mesajlarını okuyun
4. Sistem yöneticisine başvurun

---

**Son Güncelleme:** 2024-01-XX
**Versiyon:** 1.1.0

