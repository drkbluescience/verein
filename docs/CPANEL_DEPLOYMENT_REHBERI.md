# Verein API cPanel Deployment Rehberi

Bu rehber, Verein API projesinin cPanel üzerinde nasıl yayınlanacağını adım adım açıklamaktadır.

## 📋 Ön Gereksinimler

1. **cPanel Hosting**: .NET 8.0 destekli cPanel hesabı
2. **Veritabanı**: SQL Server veya MySQL (cPanel'de mevcut olan)
3. **FTP/SFTP Erişimi**: Dosya yüklemek için
4. **Veritabanı Yönetimi**: phpMyAdmin veya benzeri araç

## 🏗️ Proje Analizi

Verein API şu özelliklere sahiptir:
- **Framework**: .NET 8.0 ASP.NET Core Web API
- **Veritabanı**: SQL Server (Entity Framework Core 9.0.8)
- **Kimlik Doğrulama**: JWT Bearer
- **Loglama**: Serilog
- **API Dokümantasyonu**: Swagger/OpenAPI
- **Dosya Yükleme**: Resim ve dosya upload desteği

## 🚀 Adım Adım Deployment Süreci

### 1. cPanel .NET Kurulum Kontrolü

1. cPanel'inize giriş yapın
2. **"Setup .NET Core Application"** veya **"Setup .NET App"** seçeneğini bulun
3. .NET 8.0'ın desteklendiğini doğrulayın
4. Desteklenmiyorsa, hosting sağlayıcınızla iletişime geçin

### 2. Proje Yapılandırması

#### 2.1. Production Ayarlarını Güncelleme

[`appsettings.Production.json`](verein-api/appsettings.Production.json) dosyasını cPanel ortamına göre güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=cPanel_sunucu_adresi;Database=veritabani_adi;User Id=kullanici_adi;Password=sifre;TrustServerCertificate=true;MultipleActiveResultSets=true;Encrypt=false;"
  },
  "AllowedHosts": "*",
  "ApiSettings": {
      "EnableSwagger": true,
      "EnableDetailedErrors": false
  }
}
```

#### 2.2. Bağlantı String'i Ayarlama

cPanel veritabanı bilgilerinizi kullanarak bağlantı string'ini güncelleyin:

```json
"DefaultConnection": "Server=localhost;Database=veritabani_adi;User Id=kullanici_adi;Password=sifre;TrustServerCertificate=true;MultipleActiveResultSets=true;Encrypt=false;"
```

### 3. Proje Derleme ve Yayınlama

#### 3.1. Local'de Proje Derleme

```bash
# Proje dizinine gidin
cd verein-api

# Production modunda publish
dotnet publish -c Release -o ./publish --self-contained false --runtime linux-x64
```

#### 3.2. Dosyaları Hazırlama

Publish işlemi sonrası şu dosyalar oluşacaktır:
- `VereinsApi.dll`
- `VereinsApi.deps.json`
- `VereinsApi.runtimeconfig.json`
- `appsettings.json`
- `appsettings.Production.json`
- `web.config` (oluşturulacak)

#### 3.3. web.config Oluşturma

Proje kök dizinine [`web.config`](verein-api/web.config) dosyası oluşturun:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" 
                  arguments=".\VereinsApi.dll" 
                  stdoutLogEnabled="false" 
                  stdoutLogFile=".\logs\stdout" 
                  hostingModel="inprocess">
        <environmentVariables>
          <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Production" />
        </environmentVariables>
      </aspNetCore>
    </system.webServer>
  </location>
</configuration>
```

### 4. cPanel'e Dosya Yükleme

#### 4.1. FTP/SFTP ile Bağlanma

1. FTP istemcisini (FileZilla, WinSCP vb.) açın
2. cPanel FTP bilgilerinizle bağlanın
3. `public_html` veya `www` dizinine gidin

#### 4.2. API için Alt Dizin Oluşturma

```bash
# API için alt dizin oluşturun
public_html/api/
```

#### 4.3. Dosyaları Yükleme

Publish edilen dosyaları şöyle yükleyin:

```
public_html/api/
├── VereinsApi.dll
├── VereinsApi.deps.json
├── VereinsApi.runtimeconfig.json
├── appsettings.json
├── appsettings.Production.json
├── web.config
├── uploads/ (oluşturun)
└── logs/ (oluşturun)
```

### 5. Veritabanı Kurulumu

#### 5.1. Veritabanı Oluşturma

1. cPanel'de **"MySQL Databases"** veya **"SQL Server"** seçeneğine gidin
2. Yeni veritabanı oluşturun: `verein_api_db`
3. Kullanıcı oluşturun ve yetkilendirin

#### 5.2. Veritabanı Schema'sını İçe Aktarma

[`database/APPLICATION_H_101_AZURE.sql`](database/APPLICATION_H_101_AZURE.sql) dosyasını kullanın:

1. phpMyAdmin veya benzeri araçla veritabanına bağlanın
2. SQL dosyasını içe aktarın
3. Tabloların oluşturulduğunu doğrulayın

### 6. cPanel .NET Uygulaması Yapılandırma

#### 6.1. .NET Core App Setup

1. cPanel'de **"Setup .NET Core Application"** seçeneğine tıklayın
2. **"Setup New Application"** seçin
3. Aşağıdaki bilgileri girin:

```
Application Root: /home/kullanici/public_html/api
Application URL: https://domain.com/api
Application Startup File: VereinsApi.dll
.NET Runtime: .NET 8.0
```

#### 6.2. Application Pool Ayarları

```
Application Pool: DefaultAppPool
Pipeline Mode: Integrated
.NET CLR Version: No Managed Code
```

### 7. İzinleri Ayarlama

#### 7.1. Dosya İzinleri

FTP veya cPanel File Manager kullanarak izinleri ayarlayın:

```bash
# API dizini için
chmod 755 public_html/api/

# Dosyalar için
chmod 644 public_html/api/*.dll
chmod 644 public_html/api/*.json
chmod 644 public_html/api/web.config

# Upload ve logs dizinleri için
chmod 755 public_html/api/uploads/
chmod 755 public_html/api/logs/
```

#### 7.2. Yazma İzinleri

```bash
# Upload dizinine yazma izni
chmod 777 public_html/api/uploads/

# Logs dizinine yazma izni
chmod 777 public_html/api/logs/
```

### 8. CORS Ayarları

[`appsettings.Production.json`](verein-api/appsettings.Production.json) dosyasında CORS ayarlarını güncelleyin:

```json
"CorsSettings": {
  "AllowedOrigins": [
    "https://domain.com",
    "https://www.domain.com",
    "https://subdomain.domain.com"
  ],
  "AllowCredentials": true
}
```

### 9. Test ve Doğrulama

#### 9.1. API Testi

```bash
# Health check endpoint
curl https://domain.com/api/health

# Swagger testi (eğer aktif ise)
curl https://domain.com/api/swagger
```

#### 9.2. Log Kontrolü

```bash
# cPanel File Manager ile logları kontrol edin
public_html/api/logs/verein-api-.txt
```

### 10. Sorun Giderme

#### 10.1. Yaygın Sorunlar

**Soru: API çalışmıyor, 500 hatası alıyorum**
- Çözüm: Logları kontrol edin, `web.config` ayarlarını doğrulayın

**Soru: Veritabanı bağlantı hatası**
- Çözüm: Bağlantı string'ini kontrol edin, veritabanı izinlerini doğrulayın

**Soru: Dosya yüklenmiyor**
- Çözüm: `uploads` dizininin yazma izinlerini kontrol edin

#### 10.2. Hata Ayıklama

[`web.config`](verein-api/web.config) dosyasında hata ayıklamayı etkinleştirin:

```xml
<aspNetCore stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout">
```

## 🔄 Otomatik Deployment (İsteğe Bağlı)

### GitHub Actions ile Otomatik Deployment

`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 8.0.x
        
    - name: Publish
      run: dotnet publish -c Release -o ./publish
      
    - name: Deploy to cPanel
      uses: SamKirkland/FTP-Deploy-Action@4.0.0
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./publish/
        server-dir: /public_html/api/
```

## 📊 Performans Optimizasyonu

### 1. Response Compression

[`Program.cs`](verein-api/Program.cs:371) dosyasında zaten etkin:

```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});
```

### 2. Caching

Memory caching zaten yapılandırılmış:

```csharp
builder.Services.AddMemoryCache();
```

### 3. Database Connection Pooling

Connection string'de pooling zaten aktif.

## 🔐 Güvenlik Önlemleri

### 1. HTTPS Zorunluluğu

cPanel'de SSL kurulumunu yapın ve HTTPS'i zorlayın.

### 2. JWT Secret Key

Production ortamında güvenli bir JWT secret key kullanın:

```json
"JwtSettings": {
  "SecretKey": "cok-guvenli-uzun-secret-key-buraya-gelir"
}
```

### 3. CORS Kısıtlamaları

Sadece güvenilir domain'leri CORS listesine ekleyin.

## 📝 Bakım ve İzleme

### 1. Loglama

Serilog loglarını düzenli olarak kontrol edin:
- Konum: `public_html/api/logs/`
- Dosya: `verein-api-.txt`

### 2. Health Checks

Health check endpoint'ini düzenli olarak izleyin:
- URL: `https://domain.com/api/health`

### 3. Performans İzleme

cPanel'in sağladığı araçlarla:
- CPU kullanımı
- Bellek kullanımı
- Disk alanı

## 📚 Swagger Kullanımı

### Swagger Production'da Aktif Etme

Verein API'de Swagger production ortamında da aktif kalabilir. Bu, API dokümantasyonuna erişim ve test için önemlidir.

#### 1. Swagger Ayarları

[`appsettings.Production.json`](verein-api/appsettings.Production.json) dosyasında Swagger'ı aktif edin:

```json
{
  "ApiSettings": {
    "EnableSwagger": true,
    "EnableDetailedErrors": false,
    "Title": "Verein API",
    "Version": "v1.0.0"
  }
}
```

#### 2. Swagger Erişim

Swagger UI'ye şu adreslerden erişebilirsiniz:

- **Ana Swagger UI**: `https://domain.com/api/swagger`
- **Swagger JSON**: `https://domain.com/api/swagger/v1/swagger.json`

#### 3. Swagger Güvenlik Ayarları

Production ortamında Swagger'ı güvenli hale getirmek için:

##### a. IP Kısıtlaması

[`web.config`](verein-api/web.config) dosyasında IP kısıtlaması ekleyin:

```xml
<system.webServer>
  <security>
    <ipSecurity allowUnlisted="false">
      <add ipAddress="127.0.0.1" allowed="true" />
      <add ipAddress="::1" allowed="true" />
      <!-- Sadece belirli IP'lere erişim izni -->
      <add ipAddress="SIZIN_IP_ADRESINIZ" allowed="true" />
    </ipSecurity>
  </security>
</system.webServer>
```

##### b. HTTPS Zorunluluğu

Swagger'a sadece HTTPS üzerinden erişim:

```xml
<system.webServer>
  <rewrite>
    <rules>
      <rule name="Redirect Swagger to HTTPS" stopProcessing="true">
        <match url="swagger.*" />
        <conditions>
          <add input="{HTTPS}" pattern="off" ignoreCase="true" />
        </conditions>
        <action type="Redirect" url="https://{HTTP_HOST}/{R:0}" redirectType="Permanent" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

#### 4. Swagger Test Kullanımı

Swagger UI'da API testleri yapabilirsiniz:

##### a. JWT Authentication

1. `/api/auth/login` endpoint'i ile token alın
2. Swagger UI'da "Authorize" butonuna tıklayın
3. Token'ı `Bearer YOUR_TOKEN` formatında girin

##### b. API Testleri

Tüm endpoint'leri Swagger üzerinden test edebilirsiniz:

- **GET**: Veri listeleme
- **POST**: Veri ekleme
- **PUT**: Veri güncelleme
- **DELETE**: Veri silme

##### c. Dosya Yükleme

Swagger üzerinden dosya yükleme testi:

```json
{
  "file": "binary_data",
  "description": "Test dosyası"
}
```

#### 5. Swagger Özelleştirme

[`Program.cs`](verein-api/Program.cs:271) dosyasında Swagger özelleştirmeleri:

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Verein API",
        Version = "v1.0.0",
        Description = "Dernek yönetim sistemi API'si",
        Contact = new OpenApiContact
        {
            Name = "Verein API Support",
            Email = "support@verein-api.com"
        }
    });

    // JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
```

#### 6. Swagger Troubleshooting

##### Yaygın Swagger Sorunları

| Sorun | Çözüm |
|-------|-------|
| Swagger UI yüklenmiyor | `EnableSwagger` ayarını kontrol edin |
| 403 Forbidden hatası | IP kısıtlamalarını kontrol edin |
| Authentication hatası | JWT token'ını doğru girin |
| CORS hatası | CORS ayarlarını kontrol edin |

##### Swagger Debug Modu

Hata ayıklama için:

```json
{
  "ApiSettings": {
    "EnableSwagger": true,
    "EnableDetailedErrors": true
  }
}
```

#### 7. Swagger Production Best Practices

1. **Güvenlik**: Swagger'a sadece yetkili kullanıcılar erişebilmeli
2. **Monitoring**: Swagger kullanımını düzenli olarak izleyin
3. **Performance**: Swagger'ı cache'leyerek performansı artırın
4. **Documentation**: API dokümantasyonunu güncel tutun
5. **Versioning**: API versiyonlarını doğru yönetin

#### 8. Swagger Alternatifleri

Swagger'a ek olarak:

- **Redoc**: `https://domain.com/api/redoc`
- **ReDoc**: Modern API dokümantasyonu
- **Postman Collections**: Swagger'dan export edilebilir

## 🎯 Özet

Verein API'yi cPanel'e yayınlamak için:

1. ✅ Proje production ayarlarını yapılandır
2. ✅ Proje publish et ve dosyaları hazırla
3. ✅ cPanel'de veritabanı oluştur
4. ✅ Dosyaları FTP ile yükle
5. ✅ İzinleri ayarla
6. ✅ .NET uygulamasını yapılandır
7. ✅ Swagger'ı yapılandır ve güvenli hale getir
8. ✅ Test et ve doğrula

Bu rehberi takip ederek Verein API'nizi başarıyla cPanel üzerinde yayınlayabilir ve Swagger aracılığıyla API'yi test edebilirsiniz.