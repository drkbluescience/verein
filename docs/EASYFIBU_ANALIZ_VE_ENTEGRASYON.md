# easyFiBu 2025 (v4.6) Analiz ve Entegrasyon Dokümanı

## 📋 İçindekiler

1. [Excel Dosyası Sayfa Analizi](#1-excel-dosyası-sayfa-analizi)
2. [Mevcut Veritabanı Yapısı](#2-mevcut-veritabanı-yapısı)
3. [Yeni Tablolar ve Gerekçeleri](#3-yeni-tablolar-ve-gerekçeleri)
4. [Tablo Karşılaştırmaları](#4-tablo-karşılaştırmaları)
5. [Entegrasyon Planı](#5-entegrasyon-planı)

---

## 1. Excel Dosyası Sayfa Analizi

### 1.1 Sayfa Listesi (13 Sayfa)

| # | Sayfa Adı | Renk | Görünürlük | Açıklama |
|---|-----------|------|------------|----------|
| 1 | **Tickets&Versionen** | - | Gizli | Versiyon geçmişi, değişiklik notları, hata takibi |
| 2 | **Hauptmenü** | Yeşil | Görünür | Ana Menü - Dernek bilgileri girişi (isim, adres, vergi no) |
| 3 | **Anleitung** | - | Görünür | Kullanım kılavuzu (TR/DE) - Nasıl kayıt yapılır |
| 4 | **FiBuNr.** | Mavi | Görünür | Muhasebe hesap planı (~75 hesap kodu) |
| 5 | **KASSENBUCH** | Beyaz | Görünür | Kasa Defteri - 2000 satıra kadar kayıt kapasitesi |
| 6 | **Belege** | Sarı | Görünür | Fiş/Makbuz oluşturma ve yazdırma |
| 7 | **EÜR-Finanzamt** | Kırmızı | Görünür | Gelir-Gider Tablosu (Vergi dairesi formatı) |
| 8 | **Durchlaufend** | Turuncu | Görünür | Transit/Geçiş Hesapları (DITIB'e aktarılan bağışlar) |
| 9 | **Protokol Spenden** | Turuncu | Görünür | Bağış Protokolü (Nakit para sayım formu) |
| 10 | **8032_G&Kinderfest** | - | Görünür | Kermes/Çocuk Şenliği Hesabı |
| 11 | **Dernek-Kodlari** | - | Gizli | DITIB Dernekleri Listesi (Münster bölgesi) |
| 12 | **Pivot** | - | Gizli | Pivot Tablo (raporlama) |
| 13 | **easyWiki** | - | Görünür | Sık Sorulan Sorular (FAQ) |

### 1.2 Sayfa Detayları

#### 📌 Hauptmenü (Ana Menü)
Derneğin temel bilgilerinin girildiği sayfa:
- Dernek adı
- Registergericht (Sicil mahkemesi) ve kayıt numarası
- Finanzamt (Vergi dairesi) ve vergi numarası
- Mali yıl
- Başkan ve kasiyer isimleri

#### 📌 FiBuNr. (Hesap Planı)
SKR-49 standardına uygun hesap planı. 4 ana faaliyet alanı:

| Kod | Alan (DE) | Alan (TR) | Açıklama |
|-----|-----------|-----------|----------|
| **A** | Ideeller Bereich | Ana Faaliyet Alanı | Derneğin asıl amacına yönelik faaliyetler |
| **B** | Vermögensverwaltung | Gayrimenkul/Varlık Yönetimi | Kira gelirleri, faiz gelirleri |
| **C** | Zweckbetrieb | Amaca Uygun İşletme | Kurslar, dini hizmetler |
| **D** | Geschäftsbetrieb | Ticari İşletme | Kermes, lokanta, satış |

#### 📌 KASSENBUCH (Kasa Defteri)
Ana veri giriş sayfası. Sütunlar:
- Beleg-Nr. (Fiş No)
- Beleg-Datum (Fiş Tarihi)
- FiBu-Nr. (Hesap Kodu)
- Verwendungszweck (Açıklama)
- Einnahme Kasse (Kasa Gelir)
- Ausgabe Kasse (Kasa Gider)
- Lfd. Bestand Kasse (Kasa Bakiyesi)
- Einnahme Bank (Banka Gelir)
- Ausgabe Bank (Banka Gider)
- Lfd. Bestand Bank (Banka Bakiyesi)

#### 📌 EÜR-Finanzamt (Gelir-Gider Tablosu)
Kassenbuch'tan otomatik hesaplanan vergi beyanı formatı:
- A. Ideeller Bereich (Summen A)
- B. Vermögensverwaltung (Summen B)
- C. Zweckbetrieb (Summen C)
- D. Geschäftsbetrieb (Summen D)
- Gesamtbilanz (Toplam Bilanço)
- Vermögensaufstellung (Varlık Durumu)

#### 📌 Protokol Spenden (Bağış Protokolü)
Nakit bağış sayım tutanağı:
- Para birimi bazında sayım (200€, 100€, 50€, 20€, 10€, 5€, 2€, 1€, 0.50€...)
- Adet x Değer = Toplam
- 3 imza alanı (Sayımcı + 2 Tanık)
- Bağış amacı seçimi

---

## 2. Mevcut Veritabanı Yapısı

### 2.1 Finanz Schema Tabloları

| Tablo | Amaç | Kayıt Tipi |
|-------|------|------------|
| `BankBuchung` | Banka hareketleri | Tekil banka işlemleri |
| `MitgliedForderung` | Üye alacakları | Üyeye kesilmiş faturalar |
| `MitgliedZahlung` | Üye ödemeleri | Üyenin yaptığı ödemeler |
| `MitgliedForderungZahlung` | Fatura-Ödeme eşleştirmesi | Junction table |
| `MitgliedVorauszahlung` | Üye avans ödemeleri | Henüz faturası kesilmemiş |
| `VeranstaltungZahlung` | Etkinlik ödemeleri | Etkinlik katılım ücretleri |
| `VereinDitibZahlung` | DITIB'e ödemeler | Merkeze ödenen aidatlar |

### 2.2 Keytable.ZahlungTyp (Mevcut Ödeme Türleri)

| Id | Code | TR | DE |
|----|------|----|----|
| 1 | MITGLIEDSBEITRAG | Üyelik Aidatı | Mitgliedsbeitrag |
| 2 | SPENDE | Bağış | Spende |
| 3 | VERANSTALTUNG | Etkinlik | Veranstaltung |

**Önemli Not:** Bu tablo sadece 3 kayıt içerir ve üye ödemelerini sınıflandırmak için kullanılır.

---

## 3. Yeni Tablolar ve Gerekçeleri

### 3.1 FiBuKonto (Muhasebe Hesap Planı)

#### Neden Gerekli?
- Mevcut `ZahlungTyp` sadece 3 kategori içerir
- easyFiBu 75+ farklı hesap numarası kullanır
- EÜR raporu için detaylı hesap planı şart
- Kasa/Banka ayrımı mevcut sistemde yok

#### ZahlungTyp ile Farkı

| Özellik | ZahlungTyp | FiBuKonto |
|---------|------------|-----------|
| Amaç | Ödeme türü sınıflandırma | Muhasebe hesap planı |
| Kayıt Sayısı | 3 | 75+ |
| Hiyerarşi | Yok | 4 ana alan (A, B, C, D) |
| Kasa/Banka | Yok | Var (Bereich alanı) |
| Gelir/Gider | Yok | Var (Typ alanı) |
| Kullanım | MitgliedZahlung | Kassenbuch |

#### Tablo Yapısı

```sql
CREATE TABLE [Finanz].[FiBuKonto](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Nummer] NVARCHAR(10) NOT NULL,              -- "2110", "GTU", "9096"
    [Bezeichnung] NVARCHAR(200) NOT NULL,         -- Almanca açıklama
    [BezeichnungTR] NVARCHAR(200) NULL,           -- Türkçe açıklama
    [Bereich] NVARCHAR(20) NOT NULL,              -- "Kasse", "Bank", "Kasse/Bank"
    [Typ] NVARCHAR(20) NOT NULL,                  -- "Einnahmen", "Ausgaben", "Ein.-Ausg."
    [Hauptbereich] CHAR(1) NOT NULL,              -- "A", "B", "C", "D"
    [HauptbereichName] NVARCHAR(50) NULL,         -- "Ideeller Bereich", vb.
    [ZahlungTypId] INT NULL,                      -- Opsiyonel: ZahlungTyp eşleştirmesi
    [Reihenfolge] INT DEFAULT 0,                  -- Sıralama
    [IsAktiv] BIT DEFAULT 1,
    [Created] DATETIME NULL,
    [CreatedBy] INT NULL,
    [Modified] DATETIME NULL,
    [ModifiedBy] INT NULL,

    CONSTRAINT UQ_FiBuKonto_Nummer UNIQUE ([Nummer]),
    FOREIGN KEY ([ZahlungTypId]) REFERENCES [Keytable].[ZahlungTyp]([Id])
);
```

#### Örnek Veriler (easyFiBu'dan)

| Nummer | Bezeichnung | BezeichnungTR | Bereich | Typ | Hauptbereich |
|--------|-------------|---------------|---------|-----|--------------|
| 2110 | Mitgliedsbeiträge | Üyelik Aidatları | Bank | Einnahmen | A |
| 3220 | Erhaltene Spenden | Alınan Bağışlar | Kasse/Bank | Einnahmen | A |
| 3226 | Spendenbox/Spendensammlungen | Bağış Kutusu | Kasse | Einnahmen | A |
| 2551 | Löhne & Gehälter-Minijob | Mini İş Maaşları | Bank | Ausgaben | A |
| 2663 | Strom-Gas-Wasser | Elektrik-Gaz-Su | Bank | Ausgaben | A |
| 2752 | Beiträge an DITIB-Bundesverband | DITIB Merkez Aidatları | Bank | Ausgaben | A |
| 4110 | Miet- und Pachterträge | Kira Gelirleri | Bank | Einnahmen | B |
| 6505 | Einnahmen aus Kursen | Kurs Gelirleri | Bank | Einnahmen | C |
| 8032 | Verkaufserlöse Gemeinde und Kinderfest | Kermes Satışları | Kasse | Einnahmen | D |
| 9096 | Spenden an DITIB Köln=Durchlaufend | DITIB Köln Transit Bağış | Kasse/Bank | Ein.-Ausg. | - |
| GTU | Geldübertrag/Umbuchung | Para Transferi | Kasse/Bank | Ein.-Ausg. | - |

---

### 3.2 Kassenbuch (Kasa Defteri)

#### Neden Gerekli?
- Mevcut tablolar **üye odaklı**, Kassenbuch **işlem odaklı**
- Üye dışı işlemler (fatura, maaş, kira) kaydedilemiyor
- Kasa ve Banka bakiyeleri ayrı takip edilemiyor
- Yıllık devir mekanizması yok

#### MitgliedZahlung ile Farkı

| Özellik | MitgliedZahlung | Kassenbuch |
|---------|-----------------|------------|
| Odak | Üye ödemeleri | Tüm finansal işlemler |
| MitgliedId | Zorunlu | Opsiyonel |
| Tutar Alanları | 1 (Betrag) | 4 (Kasa G/G, Banka G/G) |
| Hesap Kodu | ZahlungTypId (3 seçenek) | FiBuNummer (75+ seçenek) |
| Bakiye Takibi | Yok | Anlık bakiye hesaplanır |
| Belge No | Yok | BelegNr (fiş numarası) |
| Yıl Devri | Yok | Jahr + Jahresabschluss |

#### Tablo Yapısı

```sql
CREATE TABLE [Finanz].[Kassenbuch](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [VereinId] INT NOT NULL,
    [BelegNr] INT NOT NULL,                        -- Fiş No (yıl içinde sıralı)
    [BelegDatum] DATE NOT NULL,                    -- Fiş Tarihi
    [FiBuNummer] NVARCHAR(10) NOT NULL,            -- Hesap Kodu (FK)
    [Verwendungszweck] NVARCHAR(500) NULL,         -- Açıklama
    [EinnahmeKasse] DECIMAL(18,2) NULL,            -- Kasa Gelir
    [AusgabeKasse] DECIMAL(18,2) NULL,             -- Kasa Gider
    [EinnahmeBank] DECIMAL(18,2) NULL,             -- Banka Gelir
    [AusgabeBank] DECIMAL(18,2) NULL,              -- Banka Gider
    [Jahr] INT NOT NULL,                           -- Mali Yıl
    [MitgliedId] INT NULL,                         -- Üye bağlantısı (opsiyonel)
    [MitgliedZahlungId] INT NULL,                  -- MitgliedZahlung bağlantısı
    [BankBuchungId] INT NULL,                      -- BankBuchung bağlantısı
    [Created] DATETIME NULL,
    [CreatedBy] INT NULL,
    [Modified] DATETIME NULL,
    [ModifiedBy] INT NULL,

    FOREIGN KEY ([VereinId]) REFERENCES [Verein].[Verein]([Id]),
    FOREIGN KEY ([FiBuNummer]) REFERENCES [Finanz].[FiBuKonto]([Nummer]),
    FOREIGN KEY ([MitgliedId]) REFERENCES [Mitglied].[Mitglied]([Id]),
    FOREIGN KEY ([MitgliedZahlungId]) REFERENCES [Finanz].[MitgliedZahlung]([Id]),
    FOREIGN KEY ([BankBuchungId]) REFERENCES [Finanz].[BankBuchung]([Id])
);

-- İndeksler
CREATE INDEX IX_Kassenbuch_VereinJahr ON [Finanz].[Kassenbuch]([VereinId], [Jahr]);
CREATE INDEX IX_Kassenbuch_FiBuNummer ON [Finanz].[Kassenbuch]([FiBuNummer]);
CREATE UNIQUE INDEX IX_Kassenbuch_BelegNr ON [Finanz].[Kassenbuch]([VereinId], [Jahr], [BelegNr]);
```

#### Örnek Kayıtlar

| BelegNr | BelegDatum | FiBuNummer | Verwendungszweck | EinnahmeKasse | AusgabeKasse | EinnahmeBank | AusgabeBank |
|---------|------------|------------|------------------|---------------|--------------|--------------|-------------|
| 1 | 2025-01-05 | 2110 | Ali Örnek - Aidat 2025 | - | - | 120.00 | - |
| 2 | 2025-01-10 | 3226 | Cuma bağış kutusu | 450.00 | - | - | - |
| 3 | 2025-01-15 | 2663 | Ocak elektrik faturası | - | - | - | 280.00 |
| 4 | 2025-01-20 | GTU | Kasadan bankaya aktarım | - | 450.00 | 450.00 | - |
| 5 | 2025-01-25 | 9096 | Deprem yardımı - DITIB Köln | 1500.00 | - | - | - |

---

### 3.3 KassenbuchJahresabschluss (Yıl Sonu Kapanış)

#### Neden Gerekli?
- Her yılın başında önceki yıldan devir bakiyesi gerekli
- Yıl sonu denetim kayıtları tutulmalı
- Tasarruf hesabı bakiyesi ayrıca takip edilmeli

#### Tablo Yapısı

```sql
CREATE TABLE [Finanz].[KassenbuchJahresabschluss](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [VereinId] INT NOT NULL,
    [Jahr] INT NOT NULL,                           -- Kapanış yılı
    [KasseAnfangsbestand] DECIMAL(18,2) NOT NULL,  -- Kasa açılış bakiyesi
    [KasseEndbestand] DECIMAL(18,2) NOT NULL,      -- Kasa kapanış bakiyesi
    [BankAnfangsbestand] DECIMAL(18,2) NOT NULL,   -- Banka açılış bakiyesi
    [BankEndbestand] DECIMAL(18,2) NOT NULL,       -- Banka kapanış bakiyesi
    [SparbuchEndbestand] DECIMAL(18,2) NULL,       -- Tasarruf hesabı (opsiyonel)
    [AbschlussDatum] DATE NOT NULL,                -- Kapanış tarihi
    [Geprueft] BIT DEFAULT 0,                      -- Denetlendi mi?
    [GeprueftVon] NVARCHAR(100) NULL,              -- Denetleyen kişi
    [GeprueftAm] DATE NULL,                        -- Denetim tarihi
    [Bemerkung] NVARCHAR(500) NULL,
    [Created] DATETIME NULL,
    [CreatedBy] INT NULL,

    CONSTRAINT UQ_Jahresabschluss_VereinJahr UNIQUE ([VereinId], [Jahr]),
    FOREIGN KEY ([VereinId]) REFERENCES [Verein].[Verein]([Id])
);
```

---

### 3.4 SpendenProtokoll (Bağış Protokolü)

#### Neden Gerekli?
- Nakit bağış sayımı için resmi tutanak gerekli
- Para birimi bazında detaylı sayım (kaç adet 50€, kaç adet 20€)
- Yasal gereklilik: 3 imza (sayımcı + 2 tanık)
- Bağış amacı takibi (deprem, kurban, zekat, genel)

#### MitgliedZahlung ile Farkı

| Özellik | MitgliedZahlung | SpendenProtokoll |
|---------|-----------------|------------------|
| Amaç | Üye ödemesi kaydı | Nakit sayım tutanağı |
| Detay | Tek tutar | Para birimi bazında adet |
| İmza | Yok | 3 imza alanı |
| Bağış Amacı | ZahlungTyp=SPENDE | Zweck alanı (detaylı) |
| Anonim | MitgliedId zorunlu | Anonim olabilir |

#### Tablo Yapısı

```sql
-- Ana Protokol Tablosu
CREATE TABLE [Finanz].[SpendenProtokoll](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [VereinId] INT NOT NULL,
    [Datum] DATE NOT NULL,                         -- Sayım tarihi
    [Zweck] NVARCHAR(200) NOT NULL,                -- Bağış amacı
    [ZweckKategorie] NVARCHAR(50) NULL,            -- GENEL, DEPREM, KURBAN, ZEKAT, FITRE
    [Betrag] DECIMAL(18,2) NOT NULL,               -- Toplam tutar
    [Protokollant] NVARCHAR(100) NOT NULL,         -- Sayımı yapan
    [Zeuge1Name] NVARCHAR(100) NULL,               -- Tanık 1
    [Zeuge1Unterschrift] BIT DEFAULT 0,
    [Zeuge2Name] NVARCHAR(100) NULL,               -- Tanık 2
    [Zeuge2Unterschrift] BIT DEFAULT 0,
    [Zeuge3Name] NVARCHAR(100) NULL,               -- Tanık 3 (opsiyonel)
    [Zeuge3Unterschrift] BIT DEFAULT 0,
    [KassenbuchId] INT NULL,                       -- Kassenbuch kaydına bağlantı
    [Bemerkung] NVARCHAR(500) NULL,
    [Created] DATETIME NULL,
    [CreatedBy] INT NULL,

    FOREIGN KEY ([VereinId]) REFERENCES [Verein].[Verein]([Id]),
    FOREIGN KEY ([KassenbuchId]) REFERENCES [Finanz].[Kassenbuch]([Id])
);

-- Sayım Detayları (200€, 100€, 50€ ... adetleri)
CREATE TABLE [Finanz].[SpendenProtokollDetail](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [SpendenProtokollId] INT NOT NULL,
    [Wert] DECIMAL(18,2) NOT NULL,                 -- Para değeri (200, 100, 50, 20...)
    [Anzahl] INT NOT NULL,                         -- Adet
    [Summe] DECIMAL(18,2) NOT NULL,                -- Toplam (Wert x Anzahl)

    FOREIGN KEY ([SpendenProtokollId])
        REFERENCES [Finanz].[SpendenProtokoll]([Id]) ON DELETE CASCADE
);
```

#### Örnek Kayıt

**SpendenProtokoll:**
| Id | Datum | Zweck | Betrag | Protokollant | Zeuge1Name | Zeuge2Name |
|----|-------|-------|--------|--------------|------------|------------|
| 1 | 2025-02-14 | Cuma Bağış Kutusu | 847.50 | Ahmet Yılmaz | Mehmet Demir | Ali Kaya |

**SpendenProtokollDetail:**
| SpendenProtokollId | Wert | Anzahl | Summe |
|--------------------|------|--------|-------|
| 1 | 100.00 | 3 | 300.00 |
| 1 | 50.00 | 6 | 300.00 |
| 1 | 20.00 | 8 | 160.00 |
| 1 | 10.00 | 5 | 50.00 |
| 1 | 5.00 | 4 | 20.00 |
| 1 | 2.00 | 6 | 12.00 |
| 1 | 1.00 | 3 | 3.00 |
| 1 | 0.50 | 5 | 2.50 |

---

### 3.5 DurchlaufendePosten (Transit Hesaplar)

#### Neden Gerekli?
- DITIB merkezine aktarılan bağışlar derneğin kendi geliri/gideri değil
- EÜR raporunda ayrı gösterilmeli
- Giriş-çıkış takibi ve eşleştirme gerekli
- Henüz aktarılmamış transit bakiye takibi

#### VereinDitibZahlung ile Farkı

| Özellik | VereinDitibZahlung | DurchlaufendePosten |
|---------|-------------------|---------------------|
| Amaç | DITIB aidat ödemesi | Transit bağış takibi |
| Yön | Sadece çıkış | Giriş + Çıkış |
| Kaynak | Dernek bütçesi | Toplanan bağışlar |
| EÜR'de | Gider olarak | Ayrı bölümde (transit) |
| Eşleştirme | Yok | Giriş-Çıkış eşleştirmesi |

#### Tablo Yapısı

```sql
CREATE TABLE [Finanz].[DurchlaufendePosten](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [VereinId] INT NOT NULL,
    [FiBuNummer] NVARCHAR(10) NOT NULL,            -- 9096, 9097, 9010, vb.
    [Bezeichnung] NVARCHAR(200) NOT NULL,          -- "Deprem Yardımı - DITIB Köln"
    [EinnahmenDatum] DATE NOT NULL,                -- Giriş tarihi
    [EinnahmenBetrag] DECIMAL(18,2) NOT NULL,      -- Toplanan tutar
    [AusgabenDatum] DATE NULL,                     -- Çıkış tarihi (transfer)
    [AusgabenBetrag] DECIMAL(18,2) NULL,           -- Aktarılan tutar
    [Empfaenger] NVARCHAR(200) NULL,               -- Alıcı kurum
    [Referenz] NVARCHAR(100) NULL,                 -- Transfer referansı
    [Status] NVARCHAR(20) DEFAULT 'OFFEN',         -- OFFEN, TEILWEISE, ABGESCHLOSSEN
    [KassenbuchEinnahmeId] INT NULL,               -- Giriş Kassenbuch kaydı
    [KassenbuchAusgabeId] INT NULL,                -- Çıkış Kassenbuch kaydı
    [Created] DATETIME NULL,
    [CreatedBy] INT NULL,

    FOREIGN KEY ([VereinId]) REFERENCES [Verein].[Verein]([Id]),
    FOREIGN KEY ([FiBuNummer]) REFERENCES [Finanz].[FiBuKonto]([Nummer]),
    FOREIGN KEY ([KassenbuchEinnahmeId]) REFERENCES [Finanz].[Kassenbuch]([Id]),
    FOREIGN KEY ([KassenbuchAusgabeId]) REFERENCES [Finanz].[Kassenbuch]([Id])
);
```

#### Transit Hesap Numaraları (easyFiBu)

| FiBuNummer | Bezeichnung | Açıklama |
|------------|-------------|----------|
| 9091 | Kurban=Durchlaufend | Kurban bağışları |
| 9092 | Zekat-Fitre=Durchlaufend | Zekat ve fitre |
| 9093 | Spenden an DITIB Gemeinden=Durchlaufend | Diğer camilere |
| 9094 | Spenden an DITIB Gemeinde=vom eigene Bestand | Kendi bütçesinden |
| 9096 | Spenden an DITIB Köln=Durchlaufend | DITIB Köln'e |
| 9097 | Spenden an DITIB Landes-/Regionalverband | Eyalet birliğine |

---

## 4. Tablo Karşılaştırmaları

### 4.1 Genel Karşılaştırma Tablosu

| Yeni Tablo | Mevcut Karşılık | Temel Fark | Neden Ayrı Tablo? |
|------------|-----------------|------------|-------------------|
| **FiBuKonto** | ZahlungTyp | 3 vs 75+ hesap | Muhasebe hesabı ≠ Ödeme türü |
| **Kassenbuch** | MitgliedZahlung + BankBuchung | Üye dışı işlemler | Tüm finansal hareketler tek yerde |
| **KassenbuchJahresabschluss** | Yok | Yıllık devir | Kapanış ve denetim kaydı |
| **SpendenProtokoll** | MitgliedZahlung (kısmen) | Nakit sayım detayı | Yasal tutanak gereksinimi |
| **DurchlaufendePosten** | VereinDitibZahlung (kısmen) | Transit bağışlar | Giriş-çıkış eşleştirmesi |

### 4.2 Veri Akışı Karşılaştırması

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MEVCUT SİSTEM                                │
│                                                                     │
│  Üye Ödeme Yaptı → MitgliedZahlung → ZahlungTyp (3 seçenek)        │
│                           ↓                                         │
│                    BankBuchung (banka ise)                          │
│                                                                     │
│  ❌ Elektrik faturası nereye?                                       │
│  ❌ Maaş ödemesi nereye?                                            │
│  ❌ Kasa bakiyesi nasıl takip edilir?                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        YENİ SİSTEM                                  │
│                                                                     │
│  Herhangi Bir İşlem → Kassenbuch → FiBuKonto (75+ hesap)           │
│                           ↓                                         │
│              ┌────────────┴────────────┐                            │
│              ↓                         ↓                            │
│     MitgliedZahlung              BankBuchung                        │
│     (üye ödemesi ise)            (banka ise)                        │
│              ↓                                                      │
│     SpendenProtokoll                                                │
│     (nakit bağış ise)                                               │
│                                                                     │
│  ✅ Tüm işlemler tek yerde                                          │
│  ✅ Anlık kasa/banka bakiyesi                                       │
│  ✅ EÜR raporu otomatik                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 İlişki Diyagramı

```
                    ┌──────────────────┐
                    │  Keytable.       │
                    │  ZahlungTyp      │
                    │  (3 kayıt)       │
                    └────────┬─────────┘
                             │ FK (opsiyonel)
                             ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Verein.      │    │  Finanz.         │    │  Finanz.         │
│ Verein       │◄───│  FiBuKonto       │◄───│  Kassenbuch      │
│              │    │  (75+ kayıt)     │    │                  │
└──────────────┘    └──────────────────┘    └────────┬─────────┘
       │                                             │
       │            ┌──────────────────┐             │
       │            │  Finanz.         │             │
       └───────────►│  Kassenbuch      │◄────────────┘
                    │  Jahresabschluss │
                    └──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│  Finanz.         │    │  Finanz.         │
│  SpendenProtokoll│───►│  Kassenbuch      │
│                  │    │                  │
└────────┬─────────┘    └──────────────────┘
         │
         ▼
┌──────────────────┐
│  Finanz.         │
│  SpendenProtokoll│
│  Detail          │
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│  Finanz.         │    │  Finanz.         │
│  Durchlaufende   │───►│  FiBuKonto       │
│  Posten          │    │  (9xxx serisi)   │
└──────────────────┘    └──────────────────┘
```

---

## 5. Entegrasyon Planı

### 5.1 Uygulama Fazları

| Faz | Tablo | Öncelik | Bağımlılık | Açıklama |
|-----|-------|---------|------------|----------|
| **1** | FiBuKonto | 🔴 Yüksek | Yok | Temel veri - önce bu oluşturulmalı |
| **2** | Kassenbuch | 🔴 Yüksek | FiBuKonto | Ana işlem tablosu |
| **3** | KassenbuchJahresabschluss | 🟡 Orta | Kassenbuch | Yıl sonu işlemleri |
| **4** | SpendenProtokoll + Detail | 🟡 Orta | Kassenbuch | Bağış tutanakları |
| **5** | DurchlaufendePosten | 🟢 Düşük | FiBuKonto, Kassenbuch | Transit hesaplar |

### 5.2 Her Faz İçin Yapılacaklar

#### Faz 1: FiBuKonto
```
Backend:
├── Entity: FiBuKonto.cs
├── Configuration: FiBuKontoConfiguration.cs
├── DTO: FiBuKontoDto.cs
├── Service: IFiBuKontoService.cs, FiBuKontoService.cs
├── Controller: FiBuKontoController.cs
└── Migration: AddFiBuKontoTable

Frontend:
├── Types: fibuKonto.types.ts
├── API: fibuKonto.api.ts
├── Page: /finanz/kontenplan
└── Components: FiBuKontoTable, FiBuKontoForm

Seed Data:
└── 75+ hesap kaydı (easyFiBu'dan)
```

#### Faz 2: Kassenbuch
```
Backend:
├── Entity: Kassenbuch.cs
├── Configuration: KassenbuchConfiguration.cs
├── DTO: KassenbuchDto.cs, KassenbuchCreateDto.cs
├── Service: IKassenbuchService.cs, KassenbuchService.cs
├── Controller: KassenbuchController.cs
└── Migration: AddKassenbuchTable

Frontend:
├── Types: kassenbuch.types.ts
├── API: kassenbuch.api.ts
├── Page: /finanz/kassenbuch
└── Components: KassenbuchGrid, KassenbuchEntry, BakiyeAnzeige
```

#### Faz 3: KassenbuchJahresabschluss
```
Backend:
├── Entity: KassenbuchJahresabschluss.cs
├── Service: IJahresabschlussService.cs
└── Controller: JahresabschlussController.cs

Frontend:
├── Page: /finanz/jahresabschluss
└── Components: JahresabschlussForm, DevirBakiye
```

#### Faz 4: SpendenProtokoll
```
Backend:
├── Entities: SpendenProtokoll.cs, SpendenProtokollDetail.cs
├── Service: ISpendenProtokollService.cs
└── Controller: SpendenProtokollController.cs

Frontend:
├── Page: /finanz/spenden-protokoll
└── Components: NakitSayimForm, ParaBirimiGrid, ImzaAlani
```

#### Faz 5: DurchlaufendePosten
```
Backend:
├── Entity: DurchlaufendePosten.cs
├── Service: IDurchlaufendePostenService.cs
└── Controller: DurchlaufendePostenController.cs

Frontend:
├── Page: /finanz/transit-hesaplar
└── Components: TransitListesi, GirisÇıkısEslestirme
```

### 5.3 Mevcut Sistemle Entegrasyon

#### MitgliedZahlung → Kassenbuch Bağlantısı
```csharp
// MitgliedZahlung kaydedildiğinde otomatik Kassenbuch kaydı
public async Task<MitgliedZahlungDto> CreateMitgliedZahlung(MitgliedZahlungCreateDto dto)
{
    // 1. MitgliedZahlung oluştur
    var zahlung = await _mitgliedZahlungService.Create(dto);

    // 2. Otomatik Kassenbuch kaydı
    var kassenbuchDto = new KassenbuchCreateDto
    {
        FiBuNummer = MapZahlungTypToFiBu(dto.ZahlungTypId), // 1→"2110", 2→"3220"
        Verwendungszweck = $"{mitglied.Vorname} {mitglied.Nachname} - {zahlungTyp.Name}",
        EinnahmeBank = dto.Zahlungsweg == "UEBERWEISUNG" ? dto.Betrag : null,
        EinnahmeKasse = dto.Zahlungsweg == "BAR" ? dto.Betrag : null,
        MitgliedId = dto.MitgliedId,
        MitgliedZahlungId = zahlung.Id
    };
    await _kassenbuchService.Create(kassenbuchDto);

    return zahlung;
}
```

#### ZahlungTyp → FiBuKonto Eşleştirmesi
| ZahlungTypId | ZahlungTyp.Code | FiBuNummer | FiBuKonto.Bezeichnung |
|--------------|-----------------|------------|----------------------|
| 1 | MITGLIEDSBEITRAG | 2110 | Mitgliedsbeiträge |
| 2 | SPENDE | 3220 | Erhaltene Spenden |
| 3 | VERANSTALTUNG | 6510 | Eintrittsgelder |

### 5.4 Raporlar

#### EÜR (Einnahmen-Überschuss-Rechnung)
```sql
-- Gelir-Gider Tablosu Sorgusu
SELECT
    fk.Hauptbereich,
    fk.HauptbereichName,
    fk.Nummer,
    fk.Bezeichnung,
    SUM(k.EinnahmeKasse + k.EinnahmeBank) AS Einnahmen,
    SUM(k.AusgabeKasse + k.AusgabeBank) AS Ausgaben
FROM Finanz.Kassenbuch k
JOIN Finanz.FiBuKonto fk ON k.FiBuNummer = fk.Nummer
WHERE k.VereinId = @VereinId AND k.Jahr = @Jahr
GROUP BY fk.Hauptbereich, fk.HauptbereichName, fk.Nummer, fk.Bezeichnung
ORDER BY fk.Hauptbereich, fk.Reihenfolge;
```

#### Vermögensaufstellung (Varlık Durumu)
```sql
-- Yıl Sonu Varlık Durumu
SELECT
    ja.Jahr,
    ja.KasseEndbestand,
    ja.BankEndbestand,
    ja.SparbuchEndbestand,
    (ja.KasseEndbestand + ja.BankEndbestand + ISNULL(ja.SparbuchEndbestand, 0)) AS Gesamtvermoegen
FROM Finanz.KassenbuchJahresabschluss ja
WHERE ja.VereinId = @VereinId AND ja.Jahr = @Jahr;
```

---

## 6. Sonuç ve Öneriler

### 6.1 Neden Bu Tablolar Gerekli?

| Gereksinim | Mevcut Sistem | Yeni Sistem |
|------------|---------------|-------------|
| Tam muhasebe | ❌ Sadece üye ödemeleri | ✅ Tüm gelir/giderler |
| Kasa takibi | ❌ Yok | ✅ Anlık bakiye |
| Banka takibi | ⚠️ Kısmen (BankBuchung) | ✅ Entegre |
| EÜR raporu | ❌ Manual | ✅ Otomatik |
| Yıl devri | ❌ Yok | ✅ Jahresabschluss |
| Bağış tutanağı | ❌ Yok | ✅ SpendenProtokoll |
| Transit hesaplar | ❌ Yok | ✅ DurchlaufendePosten |
| easyFiBu uyumu | ❌ Yok | ✅ Import/Export |

### 6.2 Önemli Notlar

1. **Mevcut sistem bozulmayacak**: ZahlungTyp ve MitgliedZahlung olduğu gibi kalacak
2. **Kademeli geçiş**: Yeni tablolar eklendikçe entegrasyon sağlanacak
3. **Geriye uyumluluk**: Eski veriler yeni sisteme migrate edilebilir
4. **easyFiBu uyumu**: Excel import/export ile mevcut kullanıcılar desteklenecek

### 6.3 Başlangıç Adımları

1. ✅ Analiz tamamlandı (bu doküman)
2. ⏳ FiBuKonto entity ve migration oluştur
3. ⏳ easyFiBu hesap planını seed data olarak ekle
4. ⏳ Kassenbuch entity ve migration oluştur
5. ⏳ Frontend sayfalarını geliştir
6. ⏳ Raporlama modülünü ekle

---

## 7. Keytable Kararı

### 7.1 Analiz

Yeni tablolar için Keytable oluşturulup oluşturulmayacağı değerlendirildi.

**Mevcut sistemdeki örnek:**
```csharp
// MitgliedZahlung.cs
[MaxLength(30)]
public string? Zahlungsweg { get; set; }  // Keytable YOK, string kullanılmış
```

**Keytable oluşturmanın dezavantajları:**
- Her Keytable için ~5-6 dosya (Entity, Uebersetzung, Configuration, Migration, Seed)
- Gereksiz JOIN işlemleri
- Bakım zorluğu

### 7.2 Karar: Keytable OLUŞTURULMAYACAK

| Alan | Keytable | Yapı | Gerekçe |
|------|----------|------|---------|
| FiBuKonto.Bereich | ❌ | `NVARCHAR(20)` | 3 sabit değer, değişmez |
| FiBuKonto.Typ | ❌ | `NVARCHAR(20)` | 3 sabit değer, değişmez |
| FiBuKonto.Hauptbereich | ❌ | `CHAR(1)` | 4 sabit değer (Alman standardı) |
| Kassenbuch.Zahlungsweg | ❌ | `NVARCHAR(30)` | MitgliedZahlung ile tutarlılık |
| SpendenProtokoll.ZweckKategorie | ❌ | `NVARCHAR(30)` | Sabit kategoriler yeterli |
| DurchlaufendePosten.Status | ❌ | `NVARCHAR(20)` | 3 sabit değer |

### 7.3 Alternatif Çözüm: Backend Constants + Frontend i18n

**Backend (C#):**
```csharp
public static class FiBuHauptbereich
{
    public const string IdeellerBereich = "A";
    public const string Vermoegensverwaltung = "B";
    public const string Zweckbetrieb = "C";
    public const string Geschaeftsbetrieb = "D";
}

public static class FiBuBereich
{
    public const string Kasse = "KASSE";
    public const string Bank = "BANK";
    public const string KasseBank = "KASSE_BANK";
}

public static class FiBuTyp
{
    public const string Einnahmen = "EINNAHMEN";
    public const string Ausgaben = "AUSGABEN";
    public const string EinAusg = "EIN_AUSG";
}

public static class Zahlungsweg
{
    public const string Bar = "BAR";
    public const string Ueberweisung = "UEBERWEISUNG";
    public const string Lastschrift = "LASTSCHRIFT";
    public const string EcKarte = "EC_KARTE";
}

public static class SpendenZweckKategorie
{
    public const string Genel = "GENEL";
    public const string Kurban = "KURBAN";
    public const string Zekat = "ZEKAT";
    public const string Fitre = "FITRE";
    public const string Deprem = "DEPREM";
    public const string Cami = "CAMI";
    public const string Egitim = "EGITIM";
}
```

**Frontend (TypeScript):**
```typescript
export const FIBU_HAUPTBEREICH_LABELS: Record<string, { de: string; tr: string }> = {
  A: { de: 'Ideeller Bereich', tr: 'Ana Faaliyet Alanı' },
  B: { de: 'Vermögensverwaltung', tr: 'Varlık Yönetimi' },
  C: { de: 'Zweckbetrieb', tr: 'Amaca Uygun İşletme' },
  D: { de: 'Geschäftsbetrieb', tr: 'Ticari İşletme' },
};

export const FIBU_BEREICH_LABELS: Record<string, { de: string; tr: string }> = {
  KASSE: { de: 'Kasse', tr: 'Kasa' },
  BANK: { de: 'Bank', tr: 'Banka' },
  KASSE_BANK: { de: 'Kasse/Bank', tr: 'Kasa/Banka' },
};

export const SPENDEN_ZWECK_LABELS: Record<string, { de: string; tr: string }> = {
  GENEL: { de: 'Allgemeine Spende', tr: 'Genel Bağış' },
  KURBAN: { de: 'Kurban', tr: 'Kurban Bağışı' },
  ZEKAT: { de: 'Zekat', tr: 'Zekat' },
  FITRE: { de: 'Fitre', tr: 'Fitre' },
  DEPREM: { de: 'Katastrophenhilfe', tr: 'Afet Yardımı' },
  CAMI: { de: 'Moscheebau', tr: 'Cami İnşaat' },
  EGITIM: { de: 'Bildung', tr: 'Eğitim' },
};
```

---

## 8. Referanslar

- **easyFiBu Excel**: `docs/#easyFiBu_2025 (vers 4.6)_LEER.xlsm`
- **Mevcut DB Şeması**: `database/APPLICATION_H_101_AZURE.sql`
- **Finanz Entegrasyon Planı**: `docs/FINANZ_ENTEGRASYON_PLANI.md`

---

*Doküman Tarihi: 2025-12-27*
*Versiyon: 1.0*

