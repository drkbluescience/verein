-- ============================================================================
-- KEYTABLE TABLOLARINA VERİ EKLEME ÖRNEKLERİ
-- ============================================================================
-- Bu dosya Keytable tablolarına nasıl veri ekleyeceğini gösterir
-- Tüm örnekler best practices'i takip eder

USE [VEREIN]
GO

-- ============================================================================
-- 1. GESCHLECHT (Cinsiyet) - Kategori 1: Id + Code
-- ============================================================================

-- Ana tablo
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');  -- Id = 1
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('F');  -- Id = 2
INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('D');  -- Id = 3 (Divers)

-- Çeviri tablosu - Her kayıt için her dil
INSERT INTO [Keytable].[GeschlechtUebersetzung] (GeschlechtId, Sprache, Name) VALUES
  (1, 'de', 'Männlich'),
  (1, 'tr', 'Erkek'),
  (2, 'de', 'Weiblich'),
  (2, 'tr', 'Kadın'),
  (3, 'de', 'Divers'),
  (3, 'tr', 'Diğer');

-- ============================================================================
-- 2. MITGLIEDSTATUS (Üye Durumu) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('AKTIV');      -- Id = 1
INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('PASIV');      -- Id = 2
INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('AUSTRITT');   -- Id = 3
INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('GESPERRT');   -- Id = 4

INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES
  (1, 'de', 'Aktiv'),
  (1, 'tr', 'Aktif'),
  (2, 'de', 'Passiv'),
  (2, 'tr', 'Pasif'),
  (3, 'de', 'Austritt'),
  (3, 'tr', 'Çıkış'),
  (4, 'de', 'Gesperrt'),
  (4, 'tr', 'Kilitli');

-- ============================================================================
-- 3. MITGLIEDTYP (Üye Tipi) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('PERSON');   -- Id = 1
INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('FIRMA');    -- Id = 2

INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES
  (1, 'de', 'Privatperson'),
  (1, 'tr', 'Bireysel'),
  (2, 'de', 'Firma'),
  (2, 'tr', 'Kurumsal');

-- ============================================================================
-- 4. BEITRAGPERIODE (Aidat Dönemi) - Kategori 2: Code + Sort
-- ============================================================================
-- NOT: Bu tabloda PRIMARY KEY = Code (Id değil!)

INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('MONATLICH', 1);
INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('JAEHRLICH', 2);
INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('QUARTALSWEISE', 3);

INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
  ('MONATLICH', 'de', 'Monatlich'),
  ('MONATLICH', 'tr', 'Aylık'),
  ('JAEHRLICH', 'de', 'Jährlich'),
  ('JAEHRLICH', 'tr', 'Yıllık'),
  ('QUARTALSWEISE', 'de', 'Quartalsweise'),
  ('QUARTALSWEISE', 'tr', 'Üç Aylık');

-- ============================================================================
-- 5. WAEHRUNG (Para Birimi) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('EUR');   -- Id = 1
INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('USD');   -- Id = 2
INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('TRY');   -- Id = 3

INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES
  (1, 'de', 'Euro'),
  (1, 'tr', 'Euro'),
  (2, 'de', 'US-Dollar'),
  (2, 'tr', 'ABD Doları'),
  (3, 'de', 'Türkische Lira'),
  (3, 'tr', 'Türk Lirası');

-- ============================================================================
-- 6. ZAHLUNGTYP (Ödeme Tipi) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('BEITRAG');      -- Id = 1
INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('SPENDE');       -- Id = 2
INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('GEBUEHR');      -- Id = 3

INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES
  (1, 'de', 'Beitrag'),
  (1, 'tr', 'Aidat'),
  (2, 'de', 'Spende'),
  (2, 'tr', 'Bağış'),
  (3, 'de', 'Gebühr'),
  (3, 'tr', 'Ücret');

-- ============================================================================
-- 7. ZAHLUNGSTATUS (Ödeme Durumu) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[ZahlungStatus] (Code) VALUES ('BEZAHLT');    -- Id = 1
INSERT INTO [Keytable].[ZahlungStatus] (Code) VALUES ('OFFEN');      -- Id = 2
INSERT INTO [Keytable].[ZahlungStatus] (Code) VALUES ('UEBERFAELLIG');-- Id = 3

INSERT INTO [Keytable].[ZahlungStatusUebersetzung] (ZahlungStatusId, Sprache, Name) VALUES
  (1, 'de', 'Bezahlt'),
  (1, 'tr', 'Ödendi'),
  (2, 'de', 'Offen'),
  (2, 'tr', 'Beklemede'),
  (3, 'de', 'Überfällig'),
  (3, 'tr', 'Vadesi Geçmiş');

-- ============================================================================
-- 8. STAATSANGEHOERIGKEIT (Uyruk) - Kategori 3: Özel (Iso2 + Iso3)
-- ============================================================================

INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) VALUES ('DE', 'DEU');  -- Id = 1
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) VALUES ('TR', 'TUR');  -- Id = 2
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) VALUES ('AT', 'AUT');  -- Id = 3
INSERT INTO [Keytable].[Staatsangehoerigkeit] (Iso2, Iso3) VALUES ('CH', 'CHE');  -- Id = 4

INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
  (1, 'de', 'Deutschland'),
  (1, 'tr', 'Almanya'),
  (2, 'de', 'Türkei'),
  (2, 'tr', 'Türkiye'),
  (3, 'de', 'Österreich'),
  (3, 'tr', 'Avusturya'),
  (4, 'de', 'Schweiz'),
  (4, 'tr', 'İsviçre');

-- ============================================================================
-- 9. ADRESSETYP (Adres Tipi) - Kategori 1: Id + Code
-- ============================================================================

INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('PRIVAT');    -- Id = 1
INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('GESCHAFT');  -- Id = 2
INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('RECHNUNGS'); -- Id = 3

INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
  (1, 'de', 'Privatadresse'),
  (1, 'tr', 'Özel Adres'),
  (2, 'de', 'Geschäftsadresse'),
  (2, 'tr', 'İş Adresi'),
  (3, 'de', 'Rechnungsadresse'),
  (3, 'tr', 'Fatura Adresi');

-- ============================================================================
-- KONTROL SORGUSU
-- ============================================================================

-- Tüm Geschlecht verilerini kontrol et
SELECT 
  g.Id,
  g.Code,
  STRING_AGG(gu.Name, ', ') as Çeviriler
FROM [Keytable].[Geschlecht] g
LEFT JOIN [Keytable].[GeschlechtUebersetzung] gu ON g.Id = gu.GeschlechtId
GROUP BY g.Id, g.Code
ORDER BY g.Id;

-- Eksik çeviri kontrol
SELECT 
  g.Id,
  g.Code,
  COUNT(DISTINCT gu.Sprache) as DilSayı
FROM [Keytable].[Geschlecht] g
LEFT JOIN [Keytable].[GeschlechtUebersetzung] gu ON g.Id = gu.GeschlechtId
GROUP BY g.Id, g.Code
HAVING COUNT(DISTINCT gu.Sprache) < 2;

