# Veritabanı SQL Scriptleri

Bu klasör Verein uygulamasının veritabanı scriptlerini içerir.

## 📁 Dosya Yapısı

### 🔵 Azure SQL Database Scriptleri (Kullanımda)

#### 1. **APPLICATION_H_101_AZURE.sql**
- **Amaç:** Azure SQL Database için schema oluşturma scripti
- **İçerik:** 
  - 10 Schema (Bank, Finanz, Keytable, Logs, Mitglied, Stammdaten, Todesfall, Verein, Web, Xbackups)
  - 47 Tablo
  - 16 Index
  - 121 Foreign Key ve Constraint
- **Kullanım:** İlk kurulumda çalıştırılır
- **Not:** CREATE DATABASE ve ALTER DATABASE komutları kaldırılmıştır (Azure uyumlu)

#### 2. **COMPLETE_DEMO_DATA.sql**
- **Amaç:** Kapsamlı demo verileri ekleme
- **İçerik:**
  - Keytable verileri (Cinsiyet, Üye durumu, Ülkeler, Para birimleri, vb.)
  - 2 Demo dernek
  - 12+ Demo üye
  - Aile ilişkileri
  - Ödeme kayıtları
- **Kullanım:** Test ve geliştirme ortamı için
- **Not:** Production'da kullanılmamalı

---

### 🟡 Yardımcı Scriptler

#### 3. **CLEAN_ALL_DATA.sql**
- **Amaç:** Veritabanındaki tüm verileri siler (schema korunur)
- **Kullanım:** Veritabanını sıfırlamak için
- **⚠️ DİKKAT:** Tüm veriler silinir! Production'da kullanma!

**Not:** COMPLETE_DEMO_DATA.sql zaten aktif olmayan dernekleri de içerir, ayrı bir script gerekmez.

---

### 🟢 Referans (Local SQL Server)

#### 4. **APPLICATION_H_101.sql**
- **Amaç:** Orijinal schema scripti (Local SQL Server için)
- **Kullanım:** Yedek/Referans amaçlı
- **Not:** Azure'da kullanılmaz

---

## 🚀 Kurulum Sırası

### Azure SQL Database İçin

1. **Azure Portal'da VereinDB oluştur**
   - Server: `Verein08112025.database.windows.net`
   - Database: `VereinDB`

2. **SSMS ile VereinDB'ye bağlan**
   ```
   Server: Verein08112025.database.windows.net
   Database: VereinDB
   User: vereinsa
   Password: ]L1iGfZJ*34iw9
   ```

3. **Schema'yı oluştur**
   ```sql
   -- APPLICATION_H_101_AZURE.sql dosyasını çalıştır
   ```

4. **Demo verileri ekle (Opsiyonel)**
   ```sql
   -- COMPLETE_DEMO_DATA.sql dosyasını çalıştır
   ```

---

## ⚠️ Önemli Notlar

### Azure SQL Database Kısıtlamaları

1. **USE komutu çalışmaz**
   - Her zaman doğru veritabanına bağlı olduğunuzdan emin olun
   - SSMS'de Connection Properties → Connect to database: VereinDB

2. **CREATE DATABASE çalışmaz**
   - Veritabanı Azure Portal'dan oluşturulmalı

3. **ALTER DATABASE sınırlı**
   - Çoğu ayar Azure tarafından yönetilir

---

## 📊 Veritabanı Yapısı

### Schema'lar
- **Bank:** Banka işlemleri
- **Finanz:** Finansal işlemler
- **Keytable:** Referans tabloları (Ülkeler, Cinsiyet, vb.)
- **Logs:** Log kayıtları
- **Mitglied:** Üye bilgileri
- **Stammdaten:** Ana veriler
- **Todesfall:** Vefat kayıtları
- **Verein:** Dernek bilgileri
- **Web:** Web uygulaması verileri
- **Xbackups:** Yedek veriler

### Ana Tablolar
- **Verein.Verein:** Dernekler
- **Mitglied.Mitglied:** Üyeler
- **Mitglied.MitgliedAdresse:** Üye adresleri
- **Mitglied.MitgliedFamilie:** Aile ilişkileri
- **Finanz.MitgliedForderung:** Üye alacakları
- **Finanz.MitgliedZahlung:** Üye ödemeleri
- **Stammdaten.Adresse:** Adresler
- **Stammdaten.Bankkonto:** Banka hesapları

---

## 🔧 Bakım

### Veritabanını Sıfırlama

```sql
-- 1. Tüm verileri sil
-- CLEAN_ALL_DATA.sql çalıştır

-- 2. Demo verileri ekle
-- COMPLETE_DEMO_DATA.sql çalıştır
```

### Yeni Dernek Ekleme

```sql
-- ADD_INACTIVE_VEREINE.sql çalıştır
```

---

## 📝 Versiyon Geçmişi

- **v1.0** - İlk Azure SQL Database versiyonu
- Schema oluşturma ve demo veriler

---

## 🆘 Sorun Giderme

### "USE statement is not supported"
- **Çözüm:** SSMS'de doğru veritabanına bağlanın (Connection Properties)

### "There is already an object named..."
- **Çözüm:** Tablolar zaten var. CLEAN_ALL_DATA.sql ile temizleyin veya yeni veritabanı oluşturun

### "Cannot connect to server"
- **Çözüm:** Azure Portal'da Firewall ayarlarına IP adresinizi ekleyin

---

## 📞 İletişim

Sorularınız için proje dokümantasyonuna bakın.

