# 🏦 BankkontoFormModal Rehberi

**Tarih:** 2025-10-27  
**Durum:** ✅ Oluşturuldu ve Kontotyp Keytable'ı Entegre Edildi

---

## 📋 Genel Bilgi

**BankkontoFormModal**, banka hesaplarını (IBAN, BIC, vb.) yönetmek için kullanılan bir React form component'idir.

**Dosya:** `verein-web/src/components/Finanz/BankkontoFormModal.tsx`

---

## 🎯 Özellikler

✅ **Create Mode:** Yeni banka hesabı oluştur  
✅ **Edit Mode:** Mevcut banka hesabını düzenle  
✅ **Kontotyp Keytable:** Hesap tipi seçimi (Checking, Savings, Business, vb.)  
✅ **IBAN Doğrulaması:** IBAN format kontrolü  
✅ **Tarih Alanları:** Geçerlilik tarihleri (gueltigVon, gueltigBis)  
✅ **React Query:** Veri yönetimi ve caching  
✅ **Çok Dilli:** i18next ile çeviri desteği  

---

## 📦 Props

```typescript
interface BankkontoFormModalProps {
  isOpen: boolean;              // Modal açık mı?
  onClose: () => void;          // Modal kapatma callback
  bankkonto?: BankkontoDto | null;  // Düzenlenecek hesap (edit mode)
  mode: 'create' | 'edit';      // Form modu
}
```

---

## 🔧 Kullanım Örneği

### **1. Component'i Import Et**

```typescript
import BankkontoFormModal from '../components/Finanz/BankkontoFormModal';
```

### **2. State Oluştur**

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedBankkonto, setSelectedBankkonto] = useState<BankkontoDto | null>(null);
const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
```

### **3. Modal'ı Render Et**

```typescript
<BankkontoFormModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedBankkonto(null);
  }}
  bankkonto={selectedBankkonto}
  mode={modalMode}
/>
```

### **4. Yeni Hesap Oluştur**

```typescript
const handleCreateBankkonto = () => {
  setSelectedBankkonto(null);
  setModalMode('create');
  setIsModalOpen(true);
};
```

### **5. Hesap Düzenle**

```typescript
const handleEditBankkonto = (bankkonto: BankkontoDto) => {
  setSelectedBankkonto(bankkonto);
  setModalMode('edit');
  setIsModalOpen(true);
};
```

---

## 📝 Form Alanları

| Alan | Tür | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **kontotypId** | Select | ❌ | Hesap tipi (Kontotyp keytable'ı) |
| **iban** | Text | ✅ | IBAN (format: DE89370400440532013000) |
| **bic** | Text | ❌ | BIC/SWIFT kodu |
| **kontoinhaber** | Text | ❌ | Hesap sahibinin adı |
| **bankname** | Text | ❌ | Banka adı |
| **kontoNr** | Text | ❌ | Hesap numarası (legacy) |
| **blz** | Text | ❌ | Banka kodu (legacy) |
| **beschreibung** | Textarea | ❌ | Açıklama/Notlar |
| **gueltigVon** | Date | ❌ | Geçerlilik başlangıç tarihi |
| **gueltigBis** | Date | ❌ | Geçerlilik bitiş tarihi |
| **istStandard** | Checkbox | ❌ | Standart hesap mı? |
| **aktiv** | Checkbox | ❌ | Aktif mi? |

---

## ✅ Validasyonlar

### **IBAN Doğrulaması**
```
Format: [A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}
Örnek: DE89370400440532013000
```

### **Tarih Doğrulaması**
```
gueltigBis >= gueltigVon
(Bitiş tarihi başlangıç tarihinden sonra olmalı)
```

---

## 🔄 Veri Akışı

### **Create Mode**
```
Form Doldur
    ↓
Validasyon
    ↓
CreateBankkontoDto Oluştur
    ↓
API POST /api/Bankkonten
    ↓
React Query Invalidate
    ↓
Modal Kapat
```

### **Edit Mode**
```
Form Doldur (Mevcut veriler yüklü)
    ↓
Validasyon
    ↓
UpdateBankkontoDto Oluştur
    ↓
API PUT /api/Bankkonten/{id}
    ↓
React Query Invalidate
    ↓
Modal Kapat
```

---

## 🎨 Kontotyp Keytable Entegrasyonu

### **Keytable Yükleme**
```typescript
const { data: kontotypen = [] } = useQuery({
  queryKey: ['keytable', 'kontotypen'],
  queryFn: () => keytableService.getKontotypen(),
  staleTime: 24 * 60 * 60 * 1000,  // 24 saat cache
});
```

### **Select'te Gösterme**
```typescript
<select id="kontotypId" name="kontotypId" value={formData.kontotypId}>
  <option value="">Seçiniz</option>
  {kontotypen.map((k) => (
    <option key={k.id} value={k.id}>
      {k.name}  {/* ← Çok dilli isim */}
    </option>
  ))}
</select>
```

---

## 🌍 Çok Dilli Destek

Form, i18next kullanarak çok dilli desteklenmiştir:

```typescript
const { t } = useTranslation(['finanz', 'common']);

// Kullanım
<label>{t('finanz:bankAccounts.iban')}</label>
<label>{t('finanz:bankAccounts.accountType')}</label>
<label>{t('common:active')}</label>
```

---

## 📊 TypeScript Türleri

### **BankkontoDto** (Okuma)
```typescript
interface BankkontoDto {
  id: number;
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}
```

### **CreateBankkontoDto** (Oluşturma)
```typescript
interface CreateBankkontoDto {
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: Date;
  gueltigBis?: Date;
  istStandard?: boolean;
  aktiv?: boolean;
}
```

### **UpdateBankkontoDto** (Güncelleme)
```typescript
interface UpdateBankkontoDto {
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: Date;
  gueltigBis?: Date;
  istStandard?: boolean;
  aktiv?: boolean;
}
```

---

## 🚀 Sonraki Adımlar

1. **BankkontoList Component'i:** Banka hesaplarını listeleyen component
2. **BankkontoDetail Component'i:** Hesap detaylarını gösteren component
3. **Seed Data:** Test verileri ekle
4. **Unit Tests:** Form validasyonları test et

---

## 📝 Notlar

- **IBAN:** Uluslararası Banka Hesap Numarası (34 karakter max)
- **BIC:** Bank Identifier Code (20 karakter max)
- **Kontotyp:** Hesap tipi (Checking, Savings, Business, vb.)
- **Cache:** Kontotyp keytable'ı 24 saat cache'leniyor
- **Validasyon:** IBAN format ve tarih aralığı kontrol edilir

