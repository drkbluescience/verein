# Finanz Tabloları Entegrasyon Planı

## 📋 Genel Bakış

Bu doküman, `APPLICATION_H_101.sql` dosyasındaki **Finanz** şemasındaki tabloların mevcut backend (verein-api) ve frontend (verein-web) uygulamalarına entegrasyonu için detaylı bir plan sunmaktadır.

---

## 🗄️ Finanz Şeması Tabloları

Veritabanında **Finanz** şeması altında 6 tablo bulunmaktadır:

### 1. **BankBuchung** (Banka Hareketi)
Banka hesap hareketlerini takip eder.

**Kolonlar:**
- `Id` (int, PK, Identity)
- `Created`, `CreatedBy`, `Modified`, `ModifiedBy`, `DeletedFlag` (Audit alanları)
- `VereinId` (int, NOT NULL) - Dernek referansı
- `BankKontoId` (int, NOT NULL) - Banka hesabı referansı
- `Buchungsdatum` (date, NOT NULL) - İşlem tarihi
- `Betrag` (decimal(18,2), NOT NULL) - Tutar
- `WaehrungId` (int, NOT NULL) - Para birimi
- `Empfaenger` (nvarchar(100)) - Alıcı
- `Verwendungszweck` (nvarchar(250)) - Açıklama
- `Referenz` (nvarchar(100)) - Referans numarası
- `StatusId` (int, NOT NULL) - Durum
- `AngelegtAm` (datetime) - Oluşturulma zamanı

**İlişkiler:**
- `Verein` → `VereinId`
- `Bankkonto` → `BankKontoId`
- `Keytable.Waehrung` → `WaehrungId`

---

### 2. **MitgliedForderung** (Üye Alacağı/Borcu)
Üyelerin aidat ve diğer ödemelerle ilgili alacaklarını yönetir.

**Kolonlar:**
- `Id` (int, PK, Identity)
- Audit alanları
- `VereinId` (int, NOT NULL)
- `MitgliedId` (int, NOT NULL) - Üye referansı
- `ZahlungTypId` (int, NOT NULL) - Ödeme tipi
- `Forderungsnummer` (nvarchar(50)) - Alacak numarası
- `Betrag` (decimal(18,2), NOT NULL) - Tutar
- `WaehrungId` (int, NOT NULL)
- `Jahr` (int) - Yıl
- `Quartal` (int) - Çeyrek
- `Monat` (int) - Ay
- `Faelligkeit` (date, NOT NULL) - Vade tarihi
- `Beschreibung` (nvarchar(250)) - Açıklama
- `StatusId` (int, NOT NULL) - Durum
- `BezahltAm` (date) - Ödenme tarihi

**İlişkiler:**
- `Verein` → `VereinId`
- `Mitglied` → `MitgliedId`
- `Keytable.ZahlungTyp` → `ZahlungTypId`
- `Keytable.Waehrung` → `WaehrungId`
- `Keytable.Forderungsstatus` → `StatusId`

---

### 3. **MitgliedZahlung** (Üye Ödemesi)
Üyelerin yaptığı ödemeleri kaydeder.

**Kolonlar:**
- `Id` (int, PK, Identity)
- Audit alanları
- `VereinId` (int, NOT NULL)
- `MitgliedId` (int, NOT NULL)
- `ForderungId` (int, NULL) - Hangi alacağa karşılık (opsiyonel)
- `ZahlungTypId` (int, NOT NULL)
- `Betrag` (decimal(18,2), NOT NULL)
- `WaehrungId` (int, NOT NULL)
- `Zahlungsdatum` (date, NOT NULL) - Ödeme tarihi
- `Zahlungsweg` (nvarchar(30)) - Ödeme yöntemi (Nakit, Havale, vb.)
- `BankkontoId` (int, NULL) - Hangi hesaba yatırıldı
- `Referenz` (nvarchar(100)) - Referans
- `Bemerkung` (nvarchar(250)) - Not
- `StatusId` (int, NOT NULL)
- `BankBuchungId` (int, NULL) - Banka hareketi ile eşleşme

**İlişkiler:**
- `Verein` → `VereinId`
- `Mitglied` → `MitgliedId`
- `MitgliedForderung` → `ForderungId`
- `Bankkonto` → `BankkontoId`
- `BankBuchung` → `BankBuchungId`

---

### 4. **MitgliedForderungZahlung** (Alacak-Ödeme Eşleştirme)
Bir ödemenin hangi alacağa ne kadar karşılık geldiğini gösterir (many-to-many ilişki).

**Kolonlar:**
- `Id` (int, PK, Identity)
- Audit alanları
- `ForderungId` (int, NOT NULL)
- `ZahlungId` (int, NOT NULL)
- `Betrag` (decimal(18,2), NOT NULL) - Eşleşen tutar

**İlişkiler:**
- `MitgliedForderung` → `ForderungId`
- `MitgliedZahlung` → `ZahlungId`

---

### 5. **MitgliedVorauszahlung** (Üye Avans Ödemesi)
Henüz bir alacağa karşılık gelmeyen, ileride kullanılacak ödemeleri saklar.

**Kolonlar:**
- `Id` (int, PK, Identity)
- Audit alanları
- `VereinId` (int, NOT NULL)
- `MitgliedId` (int, NOT NULL)
- `ZahlungId` (int, NOT NULL) - Hangi ödeme
- `Betrag` (decimal(18,2), NOT NULL) - Kalan avans tutarı
- `WaehrungId` (int, NOT NULL)
- `Beschreibung` (nvarchar(250))

**İlişkiler:**
- `Verein` → `VereinId`
- `Mitglied` → `MitgliedId`
- `MitgliedZahlung` → `ZahlungId`

---

### 6. **VeranstaltungZahlung** (Etkinlik Ödemesi)
Etkinlik katılım ücretlerinin ödemelerini takip eder.

**Kolonlar:**
- `Id` (int, PK, Identity)
- Audit alanları
- `VeranstaltungId` (int, NOT NULL)
- `AnmeldungId` (int, NOT NULL) - Kayıt referansı
- `Name` (nvarchar(100)) - Ödeme yapan kişi
- `Email` (nvarchar(100))
- `Betrag` (decimal(18,2), NOT NULL)
- `WaehrungId` (int, NOT NULL)
- `Zahlungsdatum` (date, NOT NULL)
- `Zahlungsweg` (nvarchar(30))
- `Referenz` (nvarchar(100))
- `StatusId` (int, NOT NULL)

**İlişkiler:**
- `Veranstaltung` → `VeranstaltungId`
- `VeranstaltungAnmeldung` → `AnmeldungId`

---

## 🔍 Mevcut Sistem Analizi

### Backend (verein-api) Mevcut Yapı

#### ✅ Var Olan Özellikler:
1. **Entity Framework Core** kullanımı
2. **Repository Pattern** implementasyonu
3. **Generic Repository** (`IRepository<T>`, `Repository<T>`)
4. **Özel Repository'ler** (örn: `MitgliedRepository`, `VereinRepository`)
5. **Service Layer** (Interface + Implementation)
6. **AutoMapper** profilleri
7. **DTO Pattern** (Create, Update, Response DTO'ları)
8. **Soft Delete** desteği (`DeletedFlag`)
9. **Audit Fields** (`Created`, `CreatedBy`, `Modified`, `ModifiedBy`)
10. **Schema-based organization** (Verein, Mitglied şemaları mevcut)

#### 📂 Klasör Yapısı:
```
verein-api/
├── Domain/
│   ├── Entities/          # Entity sınıfları
│   └── Interfaces/        # Repository interface'leri
├── Data/
│   ├── ApplicationDbContext.cs
│   ├── Configurations/    # EF Core configurations
│   └── Repositories/      # Repository implementasyonları
├── Services/
│   ├── Interfaces/        # Service interface'leri
│   └── [Service].cs       # Service implementasyonları
├── DTOs/                  # Data Transfer Objects
├── Profiles/              # AutoMapper profilleri
└── Controllers/           # API Controllers
```

#### 🔗 İlgili Mevcut Entity'ler:
- `Verein` ✅
- `Mitglied` ✅
- `Bankkonto` ✅
- `Veranstaltung` ✅
- `VeranstaltungAnmeldung` ✅

---

### Frontend (verein-web) Mevcut Yapı

#### ✅ Var Olan Özellikler:
1. **React + TypeScript**
2. **React Query** (TanStack Query) - veri yönetimi
3. **Axios** - HTTP client
4. **Merkezi API Service** yapısı
5. **Service Pattern** (vereinService, mitgliedService, veranstaltungService)
6. **Context API** (AuthContext, ToastContext)
7. **i18n** desteği
8. **Modal-based Forms**
9. **Dashboard** yapısı

#### 📂 Klasör Yapısı:
```
verein-web/src/
├── services/
│   ├── api.ts             # Merkezi axios instance
│   ├── vereinService.ts
│   ├── mitgliedService.ts
│   └── veranstaltungService.ts
├── pages/
│   ├── Dashboard/
│   ├── Vereine/
│   ├── Mitglieder/
│   └── Veranstaltungen/
├── components/
│   ├── Vereine/
│   ├── Mitglied/
│   └── Veranstaltung/
└── contexts/
```

---

## 🎯 Entegrasyon Stratejisi

### Faz 1: Backend Geliştirme

#### 1.1. Entity Sınıfları Oluşturma
**Dosya Konumu:** `verein-api/Domain/Entities/`

Oluşturulacak Entity'ler:
- `BankBuchung.cs`
- `MitgliedForderung.cs`
- `MitgliedZahlung.cs`
- `MitgliedForderungZahlung.cs`
- `MitgliedVorauszahlung.cs`
- `VeranstaltungZahlung.cs`

**Özellikler:**
- `AuditableEntity`'den türetilecek
- `[Table("TableName", Schema = "Finanz")]` attribute'u
- Navigation property'ler tanımlanacak
- Data annotations (Required, MaxLength, Column types)

#### 1.2. EF Core Configurations
**Dosya Konumu:** `verein-api/Data/Configurations/`

Oluşturulacak Configuration'lar:
- `BankBuchungConfiguration.cs`
- `MitgliedForderungConfiguration.cs`
- `MitgliedZahlungConfiguration.cs`
- `MitgliedForderungZahlungConfiguration.cs`
- `MitgliedVorauszahlungConfiguration.cs`
- `VeranstaltungZahlungConfiguration.cs`

**İçerik:**
- Foreign key ilişkileri
- Index tanımlamaları
- Decimal precision ayarları
- Cascade delete davranışları

#### 1.3. DbContext Güncelleme
**Dosya:** `verein-api/Data/ApplicationDbContext.cs`

Eklenecekler:
```csharp
public DbSet<BankBuchung> BankBuchungen { get; set; }
public DbSet<MitgliedForderung> MitgliedForderungen { get; set; }
public DbSet<MitgliedZahlung> MitgliedZahlungen { get; set; }
public DbSet<MitgliedForderungZahlung> MitgliedForderungZahlungen { get; set; }
public DbSet<MitgliedVorauszahlung> MitgliedVorauszahlungen { get; set; }
public DbSet<VeranstaltungZahlung> VeranstaltungZahlungen { get; set; }
```

#### 1.4. Repository Interfaces & Implementations
**Dosya Konumu:** 
- `verein-api/Domain/Interfaces/`
- `verein-api/Data/Repositories/`

Oluşturulacak Repository'ler:
- `IBankBuchungRepository` / `BankBuchungRepository`
- `IMitgliedForderungRepository` / `MitgliedForderungRepository`
- `IMitgliedZahlungRepository` / `MitgliedZahlungRepository`
- `IVeranstaltungZahlungRepository` / `VeranstaltungZahlungRepository`

**Özel Metodlar (Örnek):**
```csharp
// MitgliedForderungRepository
Task<IEnumerable<MitgliedForderung>> GetByMitgliedIdAsync(int mitgliedId);
Task<IEnumerable<MitgliedForderung>> GetUnpaidAsync(int vereinId);
Task<IEnumerable<MitgliedForderung>> GetOverdueAsync(int vereinId);

// MitgliedZahlungRepository
Task<IEnumerable<MitgliedZahlung>> GetByMitgliedIdAsync(int mitgliedId);
Task<IEnumerable<MitgliedZahlung>> GetByDateRangeAsync(DateTime from, DateTime to);
```

#### 1.5. DTOs Oluşturma
**Dosya Konumu:** `verein-api/DTOs/Finanz/`

Her entity için 3 DTO:
- `Create[Entity]Dto` - Oluşturma için
- `Update[Entity]Dto` - Güncelleme için
- `[Entity]Dto` - Response için

Örnek:
- `CreateMitgliedForderungDto.cs`
- `UpdateMitgliedForderungDto.cs`
- `MitgliedForderungDto.cs`

#### 1.6. AutoMapper Profiles
**Dosya Konumu:** `verein-api/Profiles/`

Oluşturulacak Profiller:
- `BankBuchungProfile.cs`
- `MitgliedForderungProfile.cs`
- `MitgliedZahlungProfile.cs`
- `VeranstaltungZahlungProfile.cs`

**Mapping'ler:**
```csharp
CreateMap<CreateMitgliedForderungDto, MitgliedForderung>();
CreateMap<UpdateMitgliedForderungDto, MitgliedForderung>();
CreateMap<MitgliedForderung, MitgliedForderungDto>();
```

#### 1.7. Service Layer
**Dosya Konumu:**
- `verein-api/Services/Interfaces/`
- `verein-api/Services/`

Oluşturulacak Servisler:
- `IBankBuchungService` / `BankBuchungService`
- `IMitgliedForderungService` / `MitgliedForderungService`
- `IMitgliedZahlungService` / `MitgliedZahlungService`
- `IVeranstaltungZahlungService` / `VeranstaltungZahlungService`

**Business Logic Örnekleri:**
- Ödeme yapıldığında alacak durumunu güncelleme
- Avans ödemelerini yönetme
- Vade geçmiş alacakları hesaplama
- Ödeme-alacak eşleştirme

#### 1.8. Controllers
**Dosya Konumu:** `verein-api/Controllers/`

Oluşturulacak Controller'lar:
- `BankBuchungenController.cs`
- `MitgliedForderungenController.cs`
- `MitgliedZahlungenController.cs`
- `VeranstaltungZahlungenController.cs`

**Endpoint Örnekleri:**
```
GET    /api/MitgliedForderungen
GET    /api/MitgliedForderungen/{id}
GET    /api/MitgliedForderungen/mitglied/{mitgliedId}
GET    /api/MitgliedForderungen/unpaid
GET    /api/MitgliedForderungen/overdue
POST   /api/MitgliedForderungen
PUT    /api/MitgliedForderungen/{id}
DELETE /api/MitgliedForderungen/{id}

GET    /api/MitgliedZahlungen
GET    /api/MitgliedZahlungen/{id}
GET    /api/MitgliedZahlungen/mitglied/{mitgliedId}
POST   /api/MitgliedZahlungen
PUT    /api/MitgliedZahlungen/{id}
DELETE /api/MitgliedZahlungen/{id}
```

#### 1.9. Program.cs Güncellemeleri
**Dosya:** `verein-api/Program.cs`

Eklenecek Dependency Injection kayıtları:
```csharp
// Finanz Repositories
builder.Services.AddScoped<IBankBuchungRepository, BankBuchungRepository>();
builder.Services.AddScoped<IMitgliedForderungRepository, MitgliedForderungRepository>();
builder.Services.AddScoped<IMitgliedZahlungRepository, MitgliedZahlungRepository>();
builder.Services.AddScoped<IVeranstaltungZahlungRepository, VeranstaltungZahlungRepository>();

// Finanz Services
builder.Services.AddScoped<IBankBuchungService, BankBuchungService>();
builder.Services.AddScoped<IMitgliedForderungService, MitgliedForderungService>();
builder.Services.AddScoped<IMitgliedZahlungService, MitgliedZahlungService>();
builder.Services.AddScoped<IVeranstaltungZahlungService, VeranstaltungZahlungService>();

// AutoMapper Profiles
builder.Services.AddAutoMapper(
    typeof(BankBuchungProfile),
    typeof(MitgliedForderungProfile),
    typeof(MitgliedZahlungProfile),
    typeof(VeranstaltungZahlungProfile)
);
```

#### 1.10. Migration Oluşturma
```bash
cd verein-api
dotnet ef migrations add AddFinanzTables
dotnet ef database update
```

---

### Faz 2: Frontend Geliştirme

#### 2.1. TypeScript Types/Interfaces
**Dosya Konumu:** `verein-web/src/types/` (yeni klasör)

Oluşturulacak Type Dosyaları:
- `finanz.types.ts`

**İçerik:**
```typescript
export interface MitgliedForderungDto {
  id: number;
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  forderungsnummer?: string;
  betrag: number;
  waehrungId: number;
  jahr?: number;
  quartal?: number;
  monat?: number;
  faelligkeit: string;
  beschreibung?: string;
  statusId: number;
  bezahltAm?: string;
  created?: string;
  modified?: string;
}

export interface CreateMitgliedForderungDto {
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  betrag: number;
  waehrungId: number;
  faelligkeit: string;
  beschreibung?: string;
  // ... diğer alanlar
}

// Diğer entity'ler için benzer interface'ler
```

#### 2.2. API Service Oluşturma
**Dosya Konumu:** `verein-web/src/services/`

Oluşturulacak Servis Dosyası:
- `finanzService.ts`

**İçerik:**
```typescript
import { api } from './api';
import {
  MitgliedForderungDto,
  CreateMitgliedForderungDto,
  MitgliedZahlungDto,
  CreateMitgliedZahlungDto,
  // ... diğer tipler
} from '../types/finanz.types';

// Mitglied Forderung Service
export const mitgliedForderungService = {
  getAll: async (): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>('/api/MitgliedForderungen');
  },

  getById: async (id: number): Promise<MitgliedForderungDto> => {
    return api.get<MitgliedForderungDto>(`/api/MitgliedForderungen/${id}`);
  },

  getByMitgliedId: async (mitgliedId: number): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>(`/api/MitgliedForderungen/mitglied/${mitgliedId}`);
  },

  getUnpaid: async (): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>('/api/MitgliedForderungen/unpaid');
  },

  create: async (data: CreateMitgliedForderungDto): Promise<MitgliedForderungDto> => {
    return api.post<MitgliedForderungDto>('/api/MitgliedForderungen', data);
  },

  update: async (id: number, data: Partial<CreateMitgliedForderungDto>): Promise<MitgliedForderungDto> => {
    return api.put<MitgliedForderungDto>(`/api/MitgliedForderungen/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/MitgliedForderungen/${id}`);
  },
};

// Mitglied Zahlung Service
export const mitgliedZahlungService = {
  // Benzer metodlar...
};

// Diğer servisler...
```

#### 2.3. Service Index Güncelleme
**Dosya:** `verein-web/src/services/index.ts`

```typescript
// Finanz Services
export {
  mitgliedForderungService,
  mitgliedZahlungService,
  bankBuchungService,
  veranstaltungZahlungService
} from './finanzService';
```

#### 2.4. Sayfa Bileşenleri
**Dosya Konumu:** `verein-web/src/pages/Finanz/`

Oluşturulacak Sayfalar:
- `MitgliedForderungList.tsx` - Alacak listesi
- `MitgliedForderungDetail.tsx` - Alacak detayı
- `MitgliedZahlungList.tsx` - Ödeme listesi
- `MitgliedZahlungDetail.tsx` - Ödeme detayı
- `BankBuchungList.tsx` - Banka hareketleri
- `FinanzDashboard.tsx` - Finans özet dashboard

**Özellikler:**
- React Query kullanımı (useQuery, useMutation)
- Filtreleme (tarih, durum, üye)
- Sıralama
- Pagination
- Export (Excel/PDF)

#### 2.5. Form Modal Bileşenleri
**Dosya Konumu:** `verein-web/src/components/Finanz/`

Oluşturulacak Modal'lar:
- `MitgliedForderungFormModal.tsx`
- `MitgliedZahlungFormModal.tsx`
- `BankBuchungFormModal.tsx`

**Özellikler:**
- Create/Edit mode desteği
- Form validation
- React Query mutations
- Toast notifications

#### 2.6. Dashboard Widget'ları
**Dosya Konumu:** `verein-web/src/components/Dashboard/`

Oluşturulacak Widget'lar:
- `FinanzSummaryCard.tsx` - Toplam alacak/ödeme özeti
- `UnpaidForderungenWidget.tsx` - Ödenmemiş alacaklar
- `RecentZahlungenWidget.tsx` - Son ödemeler
- `OverdueForderungenWidget.tsx` - Vadesi geçmiş alacaklar

#### 2.7. Routing Güncellemeleri
**Dosya:** `verein-web/src/App.tsx`

Eklenecek Route'lar:
```typescript
<Route path="/finanz" element={<FinanzDashboard />} />
<Route path="/finanz/forderungen" element={<MitgliedForderungList />} />
<Route path="/finanz/forderungen/:id" element={<MitgliedForderungDetail />} />
<Route path="/finanz/zahlungen" element={<MitgliedZahlungList />} />
<Route path="/finanz/zahlungen/:id" element={<MitgliedZahlungDetail />} />
<Route path="/finanz/bank-buchungen" element={<BankBuchungList />} />
```

#### 2.8. Navigation Menu Güncelleme
**Dosya:** `verein-web/src/components/Layout/Sidebar.tsx` (veya Navigation)

Eklenecek Menü:
```typescript
{
  name: 'Finanzlar',
  icon: <MoneyIcon />,
  path: '/finanz',
  children: [
    { name: 'Dashboard', path: '/finanz' },
    { name: 'Alacaklar', path: '/finanz/forderungen' },
    { name: 'Ödemeler', path: '/finanz/zahlungen' },
    { name: 'Banka Hareketleri', path: '/finanz/bank-buchungen' },
  ]
}
```

#### 2.9. i18n Çevirileri
**Dosya Konumu:** `verein-web/src/i18n/locales/`

Eklenecek Çeviri Dosyaları:
- `de/finanz.json`
- `tr/finanz.json`

**Örnek İçerik:**
```json
{
  "finanz": {
    "title": "Finanzlar",
    "forderungen": "Alacaklar",
    "zahlungen": "Ödemeler",
    "fields": {
      "betrag": "Tutar",
      "faelligkeit": "Vade Tarihi",
      "status": "Durum",
      "beschreibung": "Açıklama"
    },
    "status": {
      "offen": "Açık",
      "bezahlt": "Ödendi",
      "ueberfaellig": "Vadesi Geçmiş"
    }
  }
}
```

---

## 📊 Veri İlişkileri ve Bağımlılıklar

### Mevcut Entity'lere Eklenecek Navigation Properties

#### Mitglied Entity'ye Eklenecekler:
```csharp
public virtual ICollection<MitgliedForderung> Forderungen { get; set; }
public virtual ICollection<MitgliedZahlung> Zahlungen { get; set; }
public virtual ICollection<MitgliedVorauszahlung> Vorauszahlungen { get; set; }
```

#### Verein Entity'ye Eklenecekler:
```csharp
public virtual ICollection<BankBuchung> BankBuchungen { get; set; }
public virtual ICollection<MitgliedForderung> MitgliedForderungen { get; set; }
public virtual ICollection<MitgliedZahlung> MitgliedZahlungen { get; set; }
```

#### Bankkonto Entity'ye Eklenecekler:
```csharp
public virtual ICollection<BankBuchung> Buchungen { get; set; }
public virtual ICollection<MitgliedZahlung> Zahlungen { get; set; }
```

#### Veranstaltung Entity'ye Eklenecekler:
```csharp
public virtual ICollection<VeranstaltungZahlung> Zahlungen { get; set; }
```

#### VeranstaltungAnmeldung Entity'ye Eklenecekler:
```csharp
public virtual ICollection<VeranstaltungZahlung> Zahlungen { get; set; }
```

---

## 🔐 Yetkilendirme ve Güvenlik

### API Endpoint Yetkileri

**Admin:**
- Tüm finans verilerine erişim
- Tüm CRUD işlemleri

**Dernek (Verein):**
- Sadece kendi derneğinin finans verilerine erişim
- Tüm CRUD işlemleri (kendi dernekleri için)

**Mitglied (Üye):**
- Sadece kendi alacak ve ödemelerini görüntüleme
- Kendi ödemelerini yapabilme (opsiyonel)

### Controller'larda Yetki Kontrolü
```csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MitgliedForderungenController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin,Dernek")]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetAll()

    [HttpGet("mitglied/{mitgliedId}")]
    [Authorize(Roles = "Admin,Dernek,Mitglied")]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetByMitgliedId(int mitgliedId)
    {
        // Mitglied ise sadece kendi verilerini görebilir
        if (User.IsInRole("Mitglied"))
        {
            var userMitgliedId = GetCurrentUserMitgliedId();
            if (userMitgliedId != mitgliedId)
                return Forbid();
        }
        // ...
    }
}
```

---

## 📝 Test Stratejisi

### Backend Testleri
1. **Unit Tests** - Service layer business logic
2. **Integration Tests** - Repository ve database işlemleri
3. **API Tests** - Controller endpoint'leri

### Frontend Testleri
1. **Component Tests** - React bileşenleri
2. **Service Tests** - API servis çağrıları
3. **E2E Tests** - Kullanıcı akışları

---

## 🚀 Geliştirme Sırası (Öncelik Sırası)

### Öncelik 1: Temel Altyapı (1-2 Hafta)
1. ✅ Backend Entity'leri oluştur
2. ✅ EF Core Configuration'ları yaz
3. ✅ DbContext'i güncelle
4. ✅ Migration oluştur ve çalıştır
5. ✅ Repository'leri oluştur
6. ✅ DTO'ları oluştur

### Öncelik 2: Backend API (1-2 Hafta)
7. ✅ AutoMapper profilleri
8. ✅ Service layer
9. ✅ Controller'lar
10. ✅ Program.cs DI kayıtları
11. ✅ API testleri

### Öncelik 3: Frontend Temel (1-2 Hafta)
12. ✅ TypeScript types
13. ✅ API servisleri
14. ✅ Sayfa bileşenleri (List sayfaları)
15. ✅ Form modal'ları
16. ✅ Routing

### Öncelik 4: Frontend İleri Özellikler (1 Hafta)
17. ✅ Dashboard widget'ları
18. ✅ Filtreleme ve sıralama
19. ✅ Export özellikleri
20. ✅ i18n çevirileri

### Öncelik 5: Entegrasyon ve Test (1 Hafta)
21. ✅ Mevcut entity'lere navigation property'ler ekle
22. ✅ End-to-end testler
23. ✅ Performans optimizasyonu
24. ✅ Dokümantasyon

---

## ⚠️ Dikkat Edilmesi Gerekenler

### Backend
1. **Decimal Precision:** Tüm para alanları `decimal(18,2)` olmalı
2. **Soft Delete:** Tüm entity'ler `DeletedFlag` kullanmalı
3. **Audit Fields:** `Created`, `CreatedBy`, `Modified`, `ModifiedBy` otomatik doldurulmalı
4. **Foreign Key Constraints:** Cascade delete davranışları dikkatli ayarlanmalı
5. **Transaction Management:** Ödeme-alacak eşleştirme işlemleri transaction içinde yapılmalı

### Frontend
1. **Decimal Formatting:** Para tutarları doğru formatta gösterilmeli (2 ondalık basamak)
2. **Date Formatting:** Tarihler kullanıcı locale'ine göre formatlanmalı
3. **Error Handling:** API hatalarını kullanıcı dostu mesajlarla göster
4. **Loading States:** Veri yüklenirken loading indicator göster
5. **Optimistic Updates:** React Query'nin optimistic update özelliğini kullan

### Genel
1. **Naming Convention:** Almanca tablo/kolon isimleri korunmalı
2. **Schema Organization:** Finanz şeması altında organize edilmeli
3. **Performance:** Büyük veri setleri için pagination kullan
4. **Security:** Yetkilendirme kontrolleri her endpoint'te olmalı

---

## 📚 Ek Kaynaklar

### Mevcut Dokümantasyon
- `docs/api-servisleri-kullanim-rehberi.md` - API servis kullanımı
- `docs/i18n-implementation.md` - Çoklu dil desteği
- `docs/yetkilendirme-sistemi.md` - Yetkilendirme sistemi

### Referans Implementasyonlar
- `Mitglied` entity ve servisleri - Benzer yapı
- `Veranstaltung` entity ve servisleri - Benzer yapı
- `Bankkonto` entity ve servisleri - İlişkili yapı

---

## ✅ Sonuç

Bu plan, Finanz tablolarının mevcut sisteme tam uyumlu şekilde entegrasyonunu sağlayacaktır.

**Toplam Tahmini Süre:** 5-7 hafta

**Gerekli Kaynaklar:**
- 1 Backend Developer (C# / .NET)
- 1 Frontend Developer (React / TypeScript)
- 1 QA Engineer (Test)

**Başarı Kriterleri:**
- ✅ Tüm Finanz tabloları backend'e entegre edildi
- ✅ CRUD işlemleri çalışıyor
- ✅ Frontend'de görüntüleme ve düzenleme yapılabiliyor
- ✅ Yetkilendirme doğru çalışıyor
- ✅ Testler yazıldı ve geçiyor
- ✅ Dokümantasyon tamamlandı


