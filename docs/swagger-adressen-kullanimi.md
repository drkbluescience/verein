# Swagger Arayüzü ile Adressen (Adresler) API Kullanım Kılavuzu

## 🚀 Swagger Arayüzüne Erişim

### Geliştirme Ortamında
- **URL**: `http://localhost:5103` veya `https://localhost:7117`
- Uygulama başlatıldığında otomatik olarak Swagger arayüzü açılır
- Alternatif olarak: `http://localhost:5103/swagger` adresini kullanabilirsiniz

## 📍 Adressen API Endpoint'leri

### 1. Tüm Adresleri Listele
**Endpoint**: `GET /api/Adressen`

#### Kullanım:
1. Swagger arayüzünde "Adressen" bölümünü bulun
2. "GET /api/Adressen" endpoint'ini tıklayın
3. "Try it out" butonuna tıklayın
4. "Execute" butonuna basın

#### Çıktı Analizi:
```json
[
  {
    "id": 1,
    "vereinId": 1,
    "adresseTypId": 1,
    "strasse": "Musterstraße",
    "hausnummer": "123",
    "plz": "12345",
    "ort": "Berlin",
    "aktiv": true,
    "istStandard": true
  }
]
```

**Önemli Alanlar:**
- `id`: Adresin benzersiz kimliği
- `vereinId`: Hangi derneğe ait olduğu
- `istStandard`: Ana adres mi?
- `aktiv`: Adres aktif mi?
- `gueltigVon/gueltigBis`: Geçerlilik tarihleri

### 2. Belirli Bir Adresi Getir
**Endpoint**: `GET /api/Adressen/{id}`

#### Kullanım:
1. "GET /api/Adressen/{id}" endpoint'ini seçin
2. "Try it out" butonuna tıklayın
3. `id` parametresine adres ID'sini girin (örn: 1)
4. "Execute" butonuna basın

#### Çıktı Analizi:
- **200 OK**: Adres bulundu ve detayları döndürüldü
- **404 Not Found**: Belirtilen ID'de adres bulunamadı
- **500 Internal Server Error**: Sunucu hatası

### 3. Derneğe Göre Adresleri Getir
**Endpoint**: `GET /api/Adressen/verein/{vereinId}`

#### Kullanım:
1. "GET /api/Adressen/verein/{vereinId}" endpoint'ini seçin
2. "Try it out" butonuna tıklayın
3. `vereinId` parametresine dernek ID'sini girin
4. "Execute" butonuna basın

#### Çıktı Analizi:
Bu endpoint belirli bir derneğin tüm adreslerini döndürür. Çıktıda:
- Derneğin ana adresi (`istStandard: true`)
- Alternatif adresler
- Geçmiş adresler (`aktiv: false`)

### 4. Yeni Adres Oluştur
**Endpoint**: `POST /api/Adressen`

#### Kullanım:
1. "POST /api/Adressen" endpoint'ini seçin
2. "Try it out" butonuna tıklayın
3. Request body'yi doldurun:

```json
{
  "vereinId": 1,
  "adresseTypId": 1,
  "strasse": "Neue Straße",
  "hausnummer": "456",
  "plz": "54321",
  "ort": "Hamburg",
  "aktiv": true,
  "istStandard": false
}
```

#### Çıktı Analizi:
- **201 Created**: Adres başarıyla oluşturuldu
- **400 Bad Request**: Geçersiz veri gönderildi
- **500 Internal Server Error**: Sunucu hatası

### 5. Adresi Güncelle
**Endpoint**: `PUT /api/Adressen/{id}`

#### Kullanım:
1. "PUT /api/Adressen/{id}" endpoint'ini seçin
2. "Try it out" butonuna tıklayın
3. `id` parametresini girin
4. Request body'de güncellenecek verileri belirtin

#### Çıktı Analizi:
- **200 OK**: Güncelleme başarılı
- **404 Not Found**: Adres bulunamadı
- **400 Bad Request**: Geçersiz veri

### 6. Adresi Sil (Soft Delete)
**Endpoint**: `DELETE /api/Adressen/{id}`

#### Kullanım:
1. "DELETE /api/Adressen/{id}" endpoint'ini seçin
2. "Try it out" butonuna tıklayın
3. `id` parametresini girin
4. "Execute" butonuna basın

#### Çıktı Analizi:
- **204 No Content**: Silme işlemi başarılı
- **404 Not Found**: Adres bulunamadı

**Not**: Bu bir "soft delete" işlemidir. Adres fiziksel olarak silinmez, sadece `deletedFlag: true` ve `aktiv: false` olarak işaretlenir.

## 🔍 Çıktı Analizi İpuçları

### 1. HTTP Status Kodları
- **2xx**: Başarılı işlemler
- **4xx**: İstemci hataları (yanlış parametre, veri eksikliği)
- **5xx**: Sunucu hataları

### 2. Veri Doğrulama
- **Zorunlu Alanlar**: `vereinId`, `strasse`, `plz`, `ort`
- **Opsiyonel Alanlar**: `adresszusatz`, `telefonnummer`, `email`
- **Koordinatlar**: `latitude`, `longitude` GPS konumu için

### 3. Tarih Formatları
- **ISO 8601**: `2024-01-15T10:30:00Z`
- **Sadece Tarih**: `2024-01-15`

### 4. Boolean Değerler
- `aktiv`: Adresin aktif olup olmadığı
- `istStandard`: Ana adres olup olmadığı
- `deletedFlag`: Silinmiş olup olmadığı

## 🛠️ Pratik Kullanım Örnekleri

### Senaryo 1: Derneğin Ana Adresini Bul
```
1. GET /api/Adressen/verein/{vereinId}
2. Çıktıda "istStandard": true olan adresi bul
```

### Senaryo 2: Aktif Adresleri Filtrele
```
1. GET /api/Adressen
2. Çıktıda "aktiv": true olan adresleri filtrele
```

### Senaryo 3: Adres Güncelleme
```
1. GET /api/Adressen/{id} ile mevcut veriyi al
2. Gerekli alanları değiştir
3. PUT /api/Adressen/{id} ile güncelle
```

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Veri Bütünlüğü**: `vereinId` mutlaka var olan bir dernek ID'si olmalı
2. **Ana Adres**: Bir derneğin sadece bir ana adresi (`istStandard: true`) olmalı
3. **Soft Delete**: Silinen adresler hala veritabanında kalır
4. **Audit Alanları**: `created`, `createdBy`, `modified`, `modifiedBy` otomatik doldurulur

## 🔧 Hata Durumları ve Çözümleri

### Yaygın Hatalar:
1. **404 Not Found**: ID kontrol edin
2. **400 Bad Request**: JSON formatını ve zorunlu alanları kontrol edin
3. **500 Internal Server Error**: Log dosyalarını kontrol edin

### Debug İpuçları:
- Response Headers'da detaylı hata bilgileri olabilir
- Network tab'ında request/response detaylarını inceleyin
- Swagger'da "Responses" bölümünde örnek çıktıları görün
