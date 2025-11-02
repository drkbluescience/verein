# Keytable Şeması - Detaylı Analiz ve Implementasyon Rehberi
**Tarih**: 2025-10-27  
**Durum**: Eksik ❌

---

## 📋 KEYTABLE TABLOLARI (30+ Tablo)

### Kategori 1: Kişi Bilgileri
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **Geschlecht** | Cinsiyet (M/F/Other) | Mitglied.Geschlecht | ❌ Eksik |
| **GeschlechtUebersetzung** | Cinsiyet çevirisi | i18n | ❌ Eksik |
| **Staatsangehoerigkeit** | Uyrukluk (ISO2/ISO3) | Mitglied.Staatsangehoerigkeit | ❌ Eksik |
| **StaatsangehoerigkeitUebersetzung** | Uyrukluk çevirisi | i18n | ❌ Eksik |

### Kategori 2: Üye Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **MitgliedStatus** | Üye durumu (Aktif/Pasif/vb.) | Mitglied.MitgliedStatusId | ❌ Eksik |
| **MitgliedStatusUebersetzung** | Üye durumu çevirisi | i18n | ❌ Eksik |
| **MitgliedTyp** | Üye tipi (Bireysel/Kurumsal/vb.) | Mitglied.MitgliedTypId | ❌ Eksik |
| **MitgliedTypUebersetzung** | Üye tipi çevirisi | i18n | ❌ Eksik |
| **MitgliedFamilieStatus** | Aile ilişkisi durumu | MitgliedFamilie.MitgliedFamilieStatusId | ❌ Eksik |
| **MitgliedFamilieStatusUebersetzung** | Aile ilişkisi durumu çevirisi | i18n | ❌ Eksik |
| **FamilienbeziehungTyp** | Aile ilişkisi tipi (Anne/Baba/Kardeş/vb.) | MitgliedFamilie.FamilienbeziehungTypId | ❌ Eksik |
| **FamilienbeziehungTypUebersetzung** | Aile ilişkisi tipi çevirisi | i18n | ❌ Eksik |

### Kategori 3: Adres Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **AdresseTyp** | Adres tipi (Ev/İş/vb.) | Adresse.AdresseTypId | ❌ Eksik |
| **AdresseTypUebersetzung** | Adres tipi çevirisi | i18n | ❌ Eksik |

### Kategori 4: Finansal Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **ZahlungTyp** | Ödeme tipi (Nakit/Çek/Banka/vb.) | MitgliedZahlung.ZahlungTypId | ❌ Eksik |
| **ZahlungTypUebersetzung** | Ödeme tipi çevirisi | i18n | ❌ Eksik |
| **ZahlungStatus** | Ödeme durumu (Beklemede/Tamamlandı/vb.) | MitgliedZahlung.StatusId | ❌ Eksik |
| **ZahlungStatusUebersetzung** | Ödeme durumu çevirisi | i18n | ❌ Eksik |
| **Forderungsart** | Talep tipi (Aidat/Ceza/vb.) | MitgliedForderung.ZahlungTypId | ❌ Eksik |
| **ForderungsartUebersetzung** | Talep tipi çevirisi | i18n | ❌ Eksik |
| **Forderungsstatus** | Talep durumu (Açık/Kapalı/vb.) | MitgliedForderung.StatusId | ❌ Eksik |
| **ForderungsstatusUebersetzung** | Talep durumu çevirisi | i18n | ❌ Eksik |
| **Waehrung** | Para birimi (EUR/USD/TRY/vb.) | BankBuchung.WaehrungId | ❌ Eksik |
| **WaehrungUebersetzung** | Para birimi çevirisi | i18n | ❌ Eksik |

### Kategori 5: Banka Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **Kontotyp** | Hesap tipi (Çek/Tasarruf/vb.) | Bankkonto.KontotypId | ❌ Eksik |
| **KontotypUebersetzung** | Hesap tipi çevirisi | i18n | ❌ Eksik |

### Kategori 6: Dernek Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **Rechtsform** | Hukuki form (e.V./GmbH/vb.) | Verein.RechtsformId | ❌ Eksik |
| **RechtsformUebersetzung** | Hukuki form çevirisi | i18n | ❌ Eksik |

### Kategori 7: Aidat Yönetimi
| Tablo | Amaç | Kullanıldığı Yer | Durum |
|-------|------|-----------------|-------|
| **BeitragPeriode** | Aidat dönemi (Aylık/Yıllık/vb.) | ? | ❌ Eksik |
| **BeitragPeriodeUebersetzung** | Aidat dönemi çevirisi | i18n | ❌ Eksik |
| **BeitragZahlungstagTyp** | Aidat ödeme günü tipi | ? | ❌ Eksik |
| **BeitragZahlungstagTypUebersetzung** | Aidat ödeme günü tipi çevirisi | i18n | ❌ Eksik |

---

## 🔧 IMPLEMENTASYON PLANLAMASI

### Adım 1: Entity Sınıfları Oluştur
**Dosya**: `verein-api/Domain/Entities/Keytable/`

```csharp
// Örnek: Geschlecht.cs
[Table("Geschlecht", Schema = "Keytable")]
public class Geschlecht
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Code { get; set; }
    
    // Navigation
    public virtual ICollection<GeschlechtUebersetzung> Uebersetzungen { get; set; }
}

// Örnek: GeschlechtUebersetzung.cs
[Table("GeschlechtUebersetzung", Schema = "Keytable")]
public class GeschlechtUebersetzung
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int GeschlechtId { get; set; }
    
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    
    // Navigation
    public virtual Geschlecht Geschlecht { get; set; }
}
```

### Adım 2: DbContext'e DbSet'ler Ekle
**Dosya**: `verein-api/Data/ApplicationDbContext.cs`

```csharp
// Keytable DbSets
public DbSet<Geschlecht> Geschlechter { get; set; }
public DbSet<GeschlechtUebersetzung> GeschlechtUebersetzungen { get; set; }
// ... (diğer 28+ tablo)
```

### Adım 3: EF Core Configuration'lar Oluştur
**Dosya**: `verein-api/Data/Configurations/Keytable/`

```csharp
public class GeschlechtConfiguration : IEntityTypeConfiguration<Geschlecht>
{
    public void Configure(EntityTypeBuilder<Geschlecht> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.Code).IsUnique();
        
        builder.HasMany(x => x.Uebersetzungen)
            .WithOne(x => x.Geschlecht)
            .HasForeignKey(x => x.GeschlechtId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### Adım 4: Repository Oluştur (Read-Only)
**Dosya**: `verein-api/Services/Interfaces/IKeytableService.cs`

```csharp
public interface IKeytableService
{
    Task<IEnumerable<GeschlechtDto>> GetGeschlechterAsync();
    Task<GeschlechtDto> GetGeschlechtByIdAsync(int id);
    Task<IEnumerable<MitgliedStatusDto>> GetMitgliedStatusAsync();
    // ... (diğer lookup'lar)
}
```

### Adım 5: Service Oluştur (Caching ile)
**Dosya**: `verein-api/Services/KeytableService.cs`

```csharp
public class KeytableService : IKeytableService
{
    private readonly IRepository<Geschlecht> _geschlechtRepo;
    private readonly IMemoryCache _cache;
    
    public async Task<IEnumerable<GeschlechtDto>> GetGeschlechterAsync()
    {
        const string cacheKey = "geschlechter_all";
        
        if (!_cache.TryGetValue(cacheKey, out IEnumerable<GeschlechtDto> result))
        {
            result = await _geschlechtRepo.GetAllAsync();
            _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
        }
        
        return result;
    }
}
```

### Adım 6: Controller Oluştur
**Dosya**: `verein-api/Controllers/KeytableController.cs`

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KeytableController : ControllerBase
{
    private readonly IKeytableService _service;
    
    [HttpGet("geschlechter")]
    public async Task<ActionResult<IEnumerable<GeschlechtDto>>> GetGeschlechter()
    {
        var result = await _service.GetGeschlechterAsync();
        return Ok(result);
    }
}
```

### Adım 7: Frontend Service Oluştur
**Dosya**: `verein-web/src/services/keytableService.ts`

```typescript
export const keytableService = {
  getGeschlechter: async (): Promise<GeschlechtDto[]> => {
    return api.get<GeschlechtDto[]>('/api/Keytable/geschlechter');
  },
  // ... (diğer lookup'lar)
};
```

---

## 📊 TAHMINI ÇALIŞMA SÜRESİ

- **Entity Sınıfları**: 2-3 saat
- **Configuration'lar**: 1-2 saat
- **Service/Repository**: 1-2 saat
- **Controller**: 1 saat
- **Frontend Service**: 1 saat
- **Testing**: 2-3 saat

**Toplam**: ~10-12 saat

---

## ✅ KONTROL LİSTESİ

- [ ] 30+ Entity sınıfı oluştur
- [ ] DbContext'e DbSet'ler ekle
- [ ] Configuration'lar oluştur
- [ ] Service/Repository oluştur
- [ ] Controller oluştur
- [ ] Frontend Service oluştur
- [ ] Unit test'ler yaz
- [ ] Integration test'ler yaz
- [ ] API documentation güncelle
- [ ] Frontend dropdown'ları güncelle

