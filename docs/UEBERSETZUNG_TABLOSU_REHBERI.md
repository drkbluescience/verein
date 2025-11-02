# 📚 Çeviri Tabloları (Uebersetzung) Rehberi

**Tarih:** 2025-10-27  
**Amaç:** Çok dilli (Multilingual) destek sağlamak

---

## 🎯 Neden Çeviri Tabloları Var?

Uygulamada **Türkçe (tr)**, **Almanca (de)**, **İngilizce (en)** gibi birden fazla dili desteklemek için!

---

## 📊 Yapı

### **Main Tablo (Keytable)**
```sql
[Keytable].[Geschlecht]
├── Id (Primary Key)
├── Code (Unique)
└── Uebersetzungen (Navigation)
```

### **Translation Tablo (Uebersetzung)**
```sql
[Keytable].[GeschlechtUebersetzung]
├── Id (Primary Key)
├── GeschlechtId (Foreign Key)
├── Sprache (Language Code: de, en, tr)
└── Name (Translated Name)
```

---

## 💾 Veritabanı Örneği

### **Geschlecht (Cinsiyet) Tablosu**

**Main Tablo:**
```
Id | Code
---|------
1  | M
2  | F
3  | O
```

**Translation Tablo:**
```
Id | GeschlechtId | Sprache | Name
---|--------------|---------|----------
1  | 1            | de      | Männlich
2  | 1            | en      | Male
3  | 1            | tr      | Erkek
4  | 2            | de      | Weiblich
5  | 2            | en      | Female
6  | 2            | tr      | Kadın
7  | 3            | de      | Sonstiges
8  | 3            | en      | Other
9  | 3            | tr      | Diğer
```

---

## 🔧 Backend'de Nasıl Çalışıyor?

### **1. Entity Tanımı**

```csharp
[Table("Geschlecht", Schema = "Keytable")]
public class Geschlecht
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Code { get; set; }
    
    // Navigation property
    public virtual ICollection<GeschlechtUebersetzung> Uebersetzungen { get; set; }
}
```

### **2. Translation Entity**

```csharp
[Table("GeschlechtUebersetzung", Schema = "Keytable")]
public class GeschlechtUebersetzung
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int GeschlechtId { get; set; }
    
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; } // "de", "en", "tr"
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    
    public virtual Geschlecht? Geschlecht { get; set; }
}
```

### **3. Service'de Kullanım**

```csharp
public async Task<IEnumerable<GeschlechtDto>> GetAllGeschlechterAsync()
{
    var data = await _context.Geschlechter
        .Include(x => x.Uebersetzungen)  // ← Translation'ları dahil et
        .ToListAsync();
    
    return _mapper.Map<IEnumerable<GeschlechtDto>>(data);
}
```

---

## 🎨 Frontend'de Nasıl Çalışıyor?

### **1. Keytable Service**

```typescript
// keytableService.ts
const getTranslatedName = (
  uebersetzungen: KeytableUebersetzung[], 
  defaultName: string = ''
): string => {
  const currentLang = i18n.language || 'de';  // Mevcut dili al
  
  // Mevcut dilde çeviri ara
  const translated = uebersetzungen.find(u => u.sprache === currentLang);
  if (translated) return translated.name;
  
  // Fallback: Almanca ara
  const german = uebersetzungen.find(u => u.sprache === 'de');
  if (german) return german.name;
  
  // Fallback: İlk çeviriyi kullan
  return uebersetzungen[0]?.name || defaultName;
};
```

### **2. API Çağrısı**

```typescript
const { data: geschlechter = [] } = useQuery({
  queryKey: ['keytable', 'geschlechter'],
  queryFn: () => keytableService.getGeschlechter(),
  staleTime: 24 * 60 * 60 * 1000,  // 24 saat cache
});
```

### **3. Select'te Kullanım**

```typescript
<select>
  {geschlechter.map((g) => (
    <option key={g.id} value={g.id}>
      {g.name}  {/* ← Otomatik olarak mevcut dilde gösterilir */}
    </option>
  ))}
</select>
```

---

## 🌍 Dil Değişimi

Kullanıcı dili değiştirdiğinde:

1. **i18n.language** değişir
2. **getTranslatedName()** yeni dilde çeviriyi bulur
3. **UI otomatik olarak güncellenir**

```typescript
// Dil değiştir
i18n.changeLanguage('tr');  // Türkçe'ye geç

// Keytable'lar otomatik olarak Türkçe gösterilir
// Çünkü getTranslatedName() yeni dili kullanır
```

---

## 📋 Tüm Keytable'lar (16 tane)

| # | Keytable | Main Tablo | Translation Tablo |
|---|----------|-----------|-------------------|
| 1 | Geschlecht | ✅ | ✅ GeschlechtUebersetzung |
| 2 | MitgliedStatus | ✅ | ✅ MitgliedStatusUebersetzung |
| 3 | MitgliedTyp | ✅ | ✅ MitgliedTypUebersetzung |
| 4 | Staatsangehoerigkeit | ✅ | ✅ StaatsangehoerigkeitUebersetzung |
| 5 | Waehrung | ✅ | ✅ WaehrungUebersetzung |
| 6 | BeitragPeriode | ✅ | ✅ BeitragPeriodeUebersetzung |
| 7 | BeitragZahlungstagTyp | ✅ | ✅ BeitragZahlungstagTypUebersetzung |
| 8 | ZahlungTyp | ✅ | ✅ ZahlungTypUebersetzung |
| 9 | ZahlungStatus | ✅ | ✅ ZahlungStatusUebersetzung |
| 10 | Rechtsform | ✅ | ✅ RechtsformUebersetzung |
| 11 | FamilienbeziehungTyp | ✅ | ✅ FamilienbeziehungTypUebersetzung |
| 12 | MitgliedFamilieStatus | ✅ | ✅ MitgliedFamilieStatusUebersetzung |
| 13 | Kontotyp | ✅ | ✅ KontotypUebersetzung |
| 14 | AdresseTyp | ✅ | ✅ AdresseTypUebersetzung |
| 15 | Forderungsart | ✅ | ✅ ForderungsartUebersetzung |
| 16 | Forderungsstatus | ✅ | ✅ ForderungsstatusUebersetzung |

---

## 🔄 Veri Akışı

```
Veritabanı
    ↓
Backend Service (Include Uebersetzungen)
    ↓
DTO (Uebersetzungen dahil)
    ↓
Frontend keytableService
    ↓
getTranslatedName() → Mevcut dilde çeviri
    ↓
UI'da göster
```

---

## 💡 Önemli Noktalar

1. **Cache:** 24 saat TTL ile cache'leniyor
2. **Fallback:** Dil bulunamazsa Almanca, sonra ilk çeviri kullanılır
3. **Performance:** Çeviriler API'dan bir kez yüklenir, sonra cache'lenir
4. **Consistency:** Tüm keytable'lar aynı pattern'i kullanır

---

## 🚀 Yeni Keytable Eklerken

1. Main tablo oluştur
2. Translation tablo oluştur (suffix: Uebersetzung)
3. Entity'de navigation property ekle
4. Service'de Include(x => x.Uebersetzungen) ekle
5. Frontend'de keytableService'e metod ekle
6. Form'da select'e entegre et

---

## 📝 Notlar

- **Sprache Kodları:** de (Deutsch), en (English), tr (Türkçe)
- **Name Max Length:** 50 karakter
- **Code Max Length:** 10-30 karakter (keytable'a göre değişir)
- **Unique Constraint:** Code alanında unique index var

