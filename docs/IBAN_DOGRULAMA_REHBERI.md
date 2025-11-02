# IBAN Doğrulama ve Banka Hesabı Arama Rehberi

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Kurulum](#kurulum)
3. [Kullanım](#kullanım)
4. [API Endpoint'leri](#api-endpointleri)
5. [Utility Fonksiyonları](#utility-fonksiyonları)
6. [React Component'leri](#react-componentleri)
7. [Custom Hook'lar](#custom-hooks)
8. [Örnekler](#örnekler)

---

## 🎯 Genel Bakış

Bu rehber, IBAN doğrulama ve banka hesabı arama işlevselliğinin nasıl kullanılacağını açıklar.

### Özellikler

✅ **İstemci Tarafı Doğrulama**
- IBAN format kontrolü
- Mod-97 kontrol rakamı doğrulaması
- Ülke kodu tanıması

✅ **Sunucu Tarafı Doğrulama**
- Ek IBAN doğrulaması
- Banka hesabı araması

✅ **Kullanıcı Dostu Arayüz**
- Gerçek zamanlı doğrulama
- Hata mesajları
- Ülke bilgisi gösterimi

---

## 🔧 Kurulum

### 1. Backend Endpoint'lerinin Aktif Olduğundan Emin Olun

Backend'de aşağıdaki endpoint'ler aktif olmalıdır:

```csharp
// BankkontenController.cs
[HttpGet("iban/{iban}")]
public async Task<ActionResult<BankkontoDto>> GetByIban(string iban)
{
    // Implementation
}

[HttpPost("validate-iban")]
public async Task<ActionResult<IbanValidationResult>> ValidateIban(IbanValidationRequest request)
{
    // Implementation
}
```

### 2. Frontend Dosyaları

Aşağıdaki dosyalar otomatik olarak oluşturulmuştur:

```
verein-web/src/
├── utils/
│   └── ibanValidator.ts              # IBAN doğrulama utility'leri
├── hooks/
│   └── useIbanValidation.ts           # Custom hook
├── components/Bankkonto/
│   ├── BankkontoIbanSearch.tsx        # React component
│   └── BankkontoIbanSearch.css        # Stil dosyası
└── pages/Bankkonto/
    ├── BankkontoIbanSearchPage.tsx    # Örnek sayfa
    └── BankkontoIbanSearchPage.css    # Stil dosyası
```

---

## 💡 Kullanım

### Seçenek 1: Component Kullanımı (En Basit)

```typescript
import BankkontoIbanSearch from '@/components/Bankkonto/BankkontoIbanSearch';
import { BankkontoDto } from '@/types/verein';

function MyComponent() {
  const handleSelect = (bankkonto: BankkontoDto) => {
    console.log('Seçilen hesap:', bankkonto);
  };

  return (
    <BankkontoIbanSearch
      onSelect={handleSelect}
      onValidationChange={(isValid) => console.log('Geçerli:', isValid)}
    />
  );
}
```

### Seçenek 2: Custom Hook Kullanımı (Daha Kontrollü)

```typescript
import { useIbanValidation } from '@/hooks/useIbanValidation';

function MyComponent() {
  const {
    iban,
    setIban,
    validationResult,
    bankkonto,
    isValidating,
    isSearching,
    error,
    clearIban,
    validateAndSearch,
  } = useIbanValidation({
    autoSearch: true,
    onSuccess: (bankkonto) => {
      console.log('Hesap bulundu:', bankkonto);
    },
    onError: (error) => {
      console.error('Hata:', error);
    },
  });

  return (
    <div>
      <input
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        placeholder="IBAN girin"
      />
      {validationResult && (
        <p>{validationResult.message}</p>
      )}
      {bankkonto && (
        <p>Hesap: {bankkonto.kontoinhaber}</p>
      )}
    </div>
  );
}
```

### Seçenek 3: Service Doğrudan Kullanımı (Maksimum Kontrol)

```typescript
import { bankkontoService } from '@/services/vereinService';

async function searchBankkonto() {
  try {
    // IBAN doğrulama
    const validation = await bankkontoService.validateIban('DE89370400440532013000');
    
    if (validation.isValid) {
      // Banka hesabı arama
      const bankkonto = await bankkontoService.getByIban('DE89370400440532013000');
      console.log('Hesap:', bankkonto);
    }
  } catch (error) {
    console.error('Hata:', error);
  }
}
```

---

## 🔌 API Endpoint'leri

### GET /api/Bankkonten/iban/{iban}

IBAN'a göre banka hesabı getir.

**Parametreler:**
- `iban` (string, required): IBAN numarası

**Yanıt:**
```json
{
  "id": 1,
  "vereinId": 1,
  "kontoinhaber": "Verein Name",
  "iban": "DE89370400440532013000",
  "bic": "COBADEFFXXX",
  "bankname": "Commerzbank",
  "aktiv": true
}
```

**Hata Yanıtları:**
- `400 Bad Request`: Geçersiz IBAN formatı
- `404 Not Found`: Hesap bulunamadı
- `401 Unauthorized`: Yetkilendirme hatası

---

### POST /api/Bankkonten/validate-iban

IBAN doğrulama.

**İstek Gövdesi:**
```json
{
  "iban": "DE89370400440532013000"
}
```

**Yanıt:**
```json
{
  "isValid": true,
  "message": "IBAN geçerli"
}
```

**Hata Yanıtları:**
```json
{
  "isValid": false,
  "message": "IBAN kontrol rakamları geçersiz"
}
```

---

## 🛠️ Utility Fonksiyonları

### isValidIban(iban: string): boolean

IBAN'ı doğrular.

```typescript
import { isValidIban } from '@/utils/ibanValidator';

const result = isValidIban('DE89370400440532013000');
console.log(result); // true
```

### validateIbanDetailed(iban: string): { isValid: boolean; message: string }

Detaylı IBAN doğrulaması.

```typescript
import { validateIbanDetailed } from '@/utils/ibanValidator';

const result = validateIbanDetailed('DE89370400440532013000');
console.log(result);
// { isValid: true, message: 'IBAN geçerli' }
```

### formatIban(iban: string): string

IBAN'ı okunabilir formata dönüştürür.

```typescript
import { formatIban } from '@/utils/ibanValidator';

const formatted = formatIban('DE89370400440532013000');
console.log(formatted); // 'DE89 3704 0044 0532 0130 00'
```

### getIbanCountryCode(iban: string): string | null

IBAN'dan ülke kodunu çıkarır.

```typescript
import { getIbanCountryCode } from '@/utils/ibanValidator';

const code = getIbanCountryCode('DE89370400440532013000');
console.log(code); // 'DE'
```

### getCountryNameFromIban(iban: string): string | null

IBAN'dan ülke adını çıkarır.

```typescript
import { getCountryNameFromIban } from '@/utils/ibanValidator';

const country = getCountryNameFromIban('DE89370400440532013000');
console.log(country); // 'Almanya'
```

---

## ⚛️ React Component'leri

### BankkontoIbanSearch

IBAN arama ve doğrulama component'i.

**Props:**
```typescript
interface BankkontoIbanSearchProps {
  onSelect?: (bankkonto: BankkontoDto) => void;
  onValidationChange?: (isValid: boolean) => void;
}
```

**Örnek:**
```typescript
<BankkontoIbanSearch
  onSelect={(bankkonto) => console.log(bankkonto)}
  onValidationChange={(isValid) => console.log(isValid)}
/>
```

---

## 🎣 Custom Hook'lar

### useIbanValidation

IBAN doğrulama ve arama için custom hook.

**Parametreler:**
```typescript
interface UseIbanValidationOptions {
  autoSearch?: boolean;        // Otomatik arama (default: true)
  onSuccess?: (bankkonto) => void;
  onError?: (error) => void;
}
```

**Dönüş Değerleri:**
```typescript
{
  iban: string;
  setIban: (iban: string) => void;
  validationResult: { isValid: boolean; message: string } | null;
  bankkonto: BankkontoDto | undefined;
  isValidating: boolean;
  isSearching: boolean;
  error: Error | null;
  clearIban: () => void;
  validateAndSearch: (ibanValue: string) => Promise<void>;
}
```

---

## 📚 Örnekler

### Örnek 1: Form İçinde Kullanım

```typescript
import { useState } from 'react';
import BankkontoIbanSearch from '@/components/Bankkonto/BankkontoIbanSearch';
import { BankkontoDto } from '@/types/verein';

function BankkontoForm() {
  const [selectedBankkonto, setSelectedBankkonto] = useState<BankkontoDto | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBankkonto) {
      console.log('Form gönderiliyor:', selectedBankkonto);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BankkontoIbanSearch
        onSelect={setSelectedBankkonto}
        onValidationChange={setIsFormValid}
      />
      <button type="submit" disabled={!selectedBankkonto}>
        Kaydet
      </button>
    </form>
  );
}
```

### Örnek 2: Modal İçinde Kullanım

```typescript
import { useState } from 'react';
import { useIbanValidation } from '@/hooks/useIbanValidation';

function BankkontoModal({ onClose, onConfirm }) {
  const { iban, setIban, bankkonto, validateAndSearch } = useIbanValidation();

  const handleConfirm = async () => {
    if (bankkonto) {
      onConfirm(bankkonto);
      onClose();
    }
  };

  return (
    <div className="modal">
      <h2>Banka Hesabı Seç</h2>
      <input
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        placeholder="IBAN girin"
      />
      {bankkonto && (
        <div>
          <p>Hesap: {bankkonto.kontoinhaber}</p>
          <button onClick={handleConfirm}>Seç</button>
        </div>
      )}
      <button onClick={onClose}>İptal</button>
    </div>
  );
}
```

---

## ⚠️ Önemli Notlar

1. **IBAN Formatı**: IBAN'lar boşluk ile yazılabilir (otomatik olarak temizlenir)
2. **Büyük/Küçük Harf**: IBAN'lar otomatik olarak büyük harfe dönüştürülür
3. **Doğrulama**: İstemci tarafı doğrulama hızlı, sunucu tarafı doğrulama güvenlidir
4. **Hata Yönetimi**: Tüm hata mesajları Türkçedir

---

## 🔗 İlgili Dosyalar

- `verein-web/src/services/vereinService.ts` - Service tanımları
- `verein-web/src/types/verein.ts` - Type tanımları
- `verein-api/Controllers/BankkontenController.cs` - Backend endpoint'leri

