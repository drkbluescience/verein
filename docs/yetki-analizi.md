# Dernek Yöneticisi Yetki Analizi

**Tarih:** 2025-10-03  
**Analiz Eden:** Augment Agent  
**Konu:** Dernek yöneticisinin üye bilgilerini güncelleme yetkisi

---

## 📊 Yönetici Özeti

SQL tablolarını ve backend kodunu inceledim. Dernek yöneticisinin üye bilgilerini güncelleme yetkisi **teorik olarak VAR** ancak bu yetki **API seviyesinde kontrol edilmiyor**. Bu ciddi bir güvenlik açığıdır.

---

## ✅ Mevcut Durum: Yetki Tanımı

### 🔑 Verilen Yetkiler

**Dosya:** `verein-api/Controllers/AuthController.cs` (Satır 80)

```csharp
if (isVereinAdmin)
{
    return Ok(new LoginResponseDto
    {
        UserType = "dernek",
        FirstName = mitglied.Vorname,
        LastName = mitglied.Nachname,
        Email = mitglied.Email,
        VereinId = mitglied.VereinId,
        MitgliedId = mitglied.Id,
        Permissions = new[] { 
            "verein.read",        // Dernek okuma
            "verein.update",      // Dernek güncelleme
            "mitglied.all",       // ÜYE TÜM YETKİLER ✅
            "veranstaltung.all"   // Etkinlik tüm yetkiler
        }
    });
}
```

### 📋 Yetki Kapsamı

**`"mitglied.all"`** yetkisi teorik olarak şunları kapsar:
- ✅ Üye oluşturma (Create)
- ✅ Üye okuma (Read)
- ✅ Üye güncelleme (Update)
- ✅ Üye silme (Delete)
- ✅ Üye aktif/pasif yapma
- ✅ Üye transfer etme

---

## ⚠️ Güvenlik Açıkları

### 🚨 1. Controller'larda Authorization Yok

**Dosya:** `verein-api/Controllers/MitgliederController.cs`

```csharp
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MitgliederController : ControllerBase
{
    // ❌ [Authorize] attribute YOK!
    // ❌ [RequirePermission("mitglied.all")] gibi bir kontrol YOK!
    
    /// <summary>
    /// Update existing Mitglied
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<MitgliedDto>> Update(
        int id,
        [FromBody] UpdateMitgliedDto updateDto,
        CancellationToken cancellationToken = default)
    {
        // Herkes bu endpoint'e erişebilir!
        // Yetki kontrolü yapılmıyor!
    }
}
```

**Etkilenen Endpoint'ler:**
- `GET /api/Mitglieder` - Tüm üyeleri listele
- `GET /api/Mitglieder/{id}` - Üye detayı
- `GET /api/Mitglieder/verein/{vereinId}` - Dernek üyelerini listele
- `POST /api/Mitglieder` - Yeni üye oluştur
- `PUT /api/Mitglieder/{id}` - Üye güncelle
- `DELETE /api/Mitglieder/{id}` - Üye sil
- `POST /api/Mitglieder/{id}/transfer` - Üye transfer et
- `POST /api/Mitglieder/{id}/set-active` - Üye aktif/pasif yap

### 🚨 2. Database'de User/Role/Permission Tabloları Yok

**Dosya:** `verein-api/Data/ApplicationDbContext.cs`

Mevcut tablolar:
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Apply entity configurations
    modelBuilder.ApplyConfiguration(new VereinConfiguration());
    modelBuilder.ApplyConfiguration(new AdresseConfiguration());
    modelBuilder.ApplyConfiguration(new BankkontoConfiguration());
    modelBuilder.ApplyConfiguration(new VeranstaltungConfiguration());
    modelBuilder.ApplyConfiguration(new VeranstaltungAnmeldungConfiguration());
    modelBuilder.ApplyConfiguration(new VeranstaltungBildConfiguration());
    modelBuilder.ApplyConfiguration(new MitgliedConfiguration());
    modelBuilder.ApplyConfiguration(new MitgliedAdresseConfiguration());
    modelBuilder.ApplyConfiguration(new MitgliedFamilieConfiguration());
}
```

**Eksik Tablolar:**
- ❌ `User` - Kullanıcı tablosu
- ❌ `Role` - Rol tablosu (Admin, Dernek, Mitglied)
- ❌ `Permission` - Yetki tablosu
- ❌ `UserRole` - Kullanıcı-Rol ilişki tablosu
- ❌ `RolePermission` - Rol-Yetki ilişki tablosu

**Mevcut Domain Tablolar:**
- ✅ `Verein` - Dernekler
- ✅ `Mitglied` - Üyeler
- ✅ `Veranstaltung` - Etkinlikler
- ✅ `Adresse` - Adresler
- ✅ `Bankkonto` - Banka hesapları
- ✅ `MitgliedAdresse` - Üye adresleri
- ✅ `MitgliedFamilie` - Üye aile ilişkileri
- ✅ `VeranstaltungAnmeldung` - Etkinlik kayıtları

### 🚨 3. JWT Token Doğrulama Yok

**Dosya:** `verein-api/Program.cs`

```csharp
// ❌ JWT Authentication middleware YOK
// ❌ app.UseAuthentication() çağrısı YOK
// ❌ app.UseAuthorization() çağrısı YOK
```

### 🚨 4. Frontend'de Sadece UI Kontrolü Var

**Dosya:** `verein-web/src/contexts/AuthContext.tsx`

```typescript
export interface User {
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  vereinId?: number;
  mitgliedId?: number;
}

interface AuthContextType {
  hasPermission: (permission: string) => boolean;
  // ...
}
```

**Sorun:** `hasPermission()` fonksiyonu sadece **butonları gizliyor**, API'yi korumaz!

Örnek kullanım:
```typescript
{hasPermission('mitglied.all') && (
  <button onClick={handleEdit}>Düzenle</button>
)}
```

Bu sadece UI'da butonu gizler, ama kullanıcı doğrudan API'ye request atabilir!

---

## 📊 Güvenlik Açığı Özeti

| Kriter | Durum | Açıklama |
|--------|-------|----------|
| **Yetki Tanımı** | ✅ VAR | `"mitglied.all"` dernek yöneticisine verilmiş |
| **API Kontrolü** | ❌ YOK | Controller'larda authorization attribute yok |
| **JWT Token** | ❌ YOK | Token doğrulama yapılmıyor |
| **Database Yapısı** | ❌ YOK | User/Role/Permission tabloları yok |
| **Middleware** | ❌ YOK | Authentication/Authorization middleware yok |
| **Frontend Kontrolü** | ⚠️ ZAYIF | Sadece UI kontrolü var, API korumasız |
| **Güvenlik Seviyesi** | 🚨 KRİTİK | Herkes her endpoint'e erişebilir |

---

## 🎯 Risk Senaryoları

### Senaryo 1: Yetkisiz Üye Güncelleme
```bash
# Herhangi bir kullanıcı (hatta giriş yapmamış biri bile):
curl -X PUT http://localhost:5103/api/Mitglieder/1 \
  -H "Content-Type: application/json" \
  -d '{
    "vorname": "Hacker",
    "nachname": "User",
    "email": "hacker@example.com"
  }'
```
**Sonuç:** ✅ İstek başarılı! Üye bilgileri güncellendi!

### Senaryo 2: Yetkisiz Üye Silme
```bash
curl -X DELETE http://localhost:5103/api/Mitglieder/1
```
**Sonuç:** ✅ İstek başarılı! Üye silindi!

### Senaryo 3: Yetkisiz Veri Okuma
```bash
curl http://localhost:5103/api/Mitglieder
```
**Sonuç:** ✅ İstek başarılı! Tüm üyelerin bilgileri döndü!

---

## 💡 Çözüm Önerileri

### 1. JWT Authentication Ekle

**Dosya:** `verein-api/Program.cs`

```csharp
// JWT Authentication ekle
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Middleware ekle
app.UseAuthentication();
app.UseAuthorization();
```

### 2. Controller'lara Authorization Ekle

**Dosya:** `verein-api/Controllers/MitgliederController.cs`

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // ✅ Tüm endpoint'ler için authentication gerekli
public class MitgliederController : ControllerBase
{
    [HttpPut("{id:int}")]
    [RequirePermission("mitglied.all")] // ✅ Özel yetki kontrolü
    public async Task<ActionResult<MitgliedDto>> Update(...)
    {
        // Sadece yetkili kullanıcılar erişebilir
    }
}
```

### 3. Custom Permission Attribute Oluştur

**Yeni Dosya:** `verein-api/Attributes/RequirePermissionAttribute.cs`

```csharp
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RequirePermissionAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    private readonly string _permission;

    public RequirePermissionAttribute(string permission)
    {
        _permission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var permissions = user.Claims
            .Where(c => c.Type == "permission")
            .Select(c => c.Value)
            .ToList();

        if (!permissions.Contains(_permission))
        {
            context.Result = new ForbidResult();
        }
    }
}
```

### 4. Database Tabloları Ekle

**Yeni Migration:** `AddUserRolePermissionTables`

```sql
-- User tablosu
CREATE TABLE [dbo].[User] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Email] NVARCHAR(100) NOT NULL UNIQUE,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [MitgliedId] INT NULL,
    [Created] DATETIME NOT NULL DEFAULT GETDATE(),
    [Aktiv] BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_User_Mitglied FOREIGN KEY ([MitgliedId]) 
        REFERENCES [Mitglied].[Mitglied]([Id])
);

-- Role tablosu
CREATE TABLE [dbo].[Role] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(50) NOT NULL UNIQUE,
    [Description] NVARCHAR(255)
);

-- Permission tablosu
CREATE TABLE [dbo].[Permission] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(50) NOT NULL UNIQUE,
    [Description] NVARCHAR(255)
);

-- UserRole ilişki tablosu
CREATE TABLE [dbo].[UserRole] (
    [UserId] INT NOT NULL,
    [RoleId] INT NOT NULL,
    PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT FK_UserRole_User FOREIGN KEY ([UserId]) 
        REFERENCES [dbo].[User]([Id]),
    CONSTRAINT FK_UserRole_Role FOREIGN KEY ([RoleId]) 
        REFERENCES [dbo].[Role]([Id])
);

-- RolePermission ilişki tablosu
CREATE TABLE [dbo].[RolePermission] (
    [RoleId] INT NOT NULL,
    [PermissionId] INT NOT NULL,
    PRIMARY KEY ([RoleId], [PermissionId]),
    CONSTRAINT FK_RolePermission_Role FOREIGN KEY ([RoleId]) 
        REFERENCES [dbo].[Role]([Id]),
    CONSTRAINT FK_RolePermission_Permission FOREIGN KEY ([PermissionId]) 
        REFERENCES [dbo].[Permission]([Id])
);

-- Seed data
INSERT INTO [Role] ([Name], [Description]) VALUES
    ('Admin', 'Sistem yöneticisi'),
    ('Dernek', 'Dernek yöneticisi'),
    ('Mitglied', 'Dernek üyesi');

INSERT INTO [Permission] ([Name], [Description]) VALUES
    ('verein.read', 'Dernek bilgilerini okuma'),
    ('verein.update', 'Dernek bilgilerini güncelleme'),
    ('mitglied.all', 'Üye tüm işlemleri'),
    ('veranstaltung.all', 'Etkinlik tüm işlemleri');
```

---

## 📅 Uygulama Planı

### Faz 1: Acil Güvenlik (1-2 gün)
- [ ] JWT Authentication ekle
- [ ] Controller'lara `[Authorize]` attribute ekle
- [ ] Test et

### Faz 2: Yetki Sistemi (3-5 gün)
- [ ] Database tablolarını oluştur
- [ ] Entity modelleri ekle
- [ ] Migration oluştur ve çalıştır
- [ ] Seed data ekle

### Faz 3: Permission Kontrolü (2-3 gün)
- [ ] `RequirePermissionAttribute` oluştur
- [ ] Controller'lara permission attribute'ları ekle
- [ ] JWT token'a permission claim'leri ekle
- [ ] Test et

### Faz 4: Test ve Dokümantasyon (1-2 gün)
- [ ] Unit testler yaz
- [ ] Integration testler yaz
- [ ] API dokümantasyonu güncelle
- [ ] Postman collection güncelle

**Toplam Süre:** 7-12 gün

---

## 🎯 Sonuç

**Dernek yöneticisinin üye bilgilerini güncelleme yetkisi VAR ama bu yetki KONTROL EDİLMİYOR!**

Şu an **herhangi bir kullanıcı** (hatta giriş yapmamış biri bile) tüm API endpoint'lerine erişebilir. Bu **kritik bir güvenlik açığıdır** ve **acilen kapatılmalıdır**.

---

## 📚 Referanslar

- [ASP.NET Core Authentication](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/)
- [ASP.NET Core Authorization](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/)
- [JWT Bearer Authentication](https://jwt.io/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

---

**Not:** Bu analiz 2025-10-03 tarihinde yapılmıştır. Sistemde yapılan değişiklikler bu analizi geçersiz kılabilir.

