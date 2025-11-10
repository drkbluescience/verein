-- ============================================================================
-- VEREIN - COMPLETE DEMO DATA
-- ============================================================================
-- Bu dosya TÜM tablolar için kapsamlı demo verilerini ekler
-- Çalıştırma sırası: APPLICATION_H_101.sql → COMPLETE_DEMO_DATA.sql
-- ============================================================================

-- ÖNEMLİ: Azure SQL Database'de USE komutu desteklenmez!
-- Bu scripti çalıştırmadan ÖNCE VereinDB veritabanına bağlanın
-- USE [VEREIN];
-- GO

PRINT '';
PRINT 'Demo verileri ekleniyor...';
GO

-- =============================================
-- 0. KEYTABLE VERİLERİ (Önce referans tabloları)
-- =============================================

PRINT '0. Referans tabloları kontrol ediliyor...';

-- Geschlecht (Cinsiyet)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Geschlecht] WHERE Code = 'M')
BEGIN
    INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('M');
    PRINT '  ✓ Geschlecht M eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Geschlecht] WHERE Code = 'F')
BEGIN
    INSERT INTO [Keytable].[Geschlecht] (Code) VALUES ('F');
    PRINT '  ✓ Geschlecht F eklendi';
END

-- MitgliedStatus
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV')
BEGIN
    INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('AKTIV');
    PRINT '  ✓ MitgliedStatus AKTIV eklendi';
END

-- MitgliedTyp
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED')
BEGIN
    INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('VOLLMITGLIED');
    PRINT '  ✓ MitgliedTyp VOLLMITGLIED eklendi';
END

-- FamilienbeziehungTyp (Aile İlişki Tipleri)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'EBEVEYN')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('EBEVEYN');
    PRINT '  ✓ FamilienbeziehungTyp EBEVEYN eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'COCUK')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('COCUK');
    PRINT '  ✓ FamilienbeziehungTyp COCUK eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'ES')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('ES');
    PRINT '  ✓ FamilienbeziehungTyp ES eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'KARDES')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('KARDES');
    PRINT '  ✓ FamilienbeziehungTyp KARDES eklendi';
END

-- MitgliedFamilieStatus
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'AKTIV')
BEGIN
    INSERT INTO [Keytable].[MitgliedFamilieStatus] (Code) VALUES ('AKTIV');
    PRINT '  ✓ MitgliedFamilieStatus AKTIV eklendi';
END

-- ZahlungStatus (Ödeme Durumu)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatus] WHERE Code = 'BEZAHLT')
BEGIN
    INSERT INTO [Keytable].[ZahlungStatus] (Code) VALUES ('BEZAHLT');
    PRINT '  ✓ ZahlungStatus BEZAHLT eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatus] WHERE Code = 'OFFEN')
BEGIN
    INSERT INTO [Keytable].[ZahlungStatus] (Code) VALUES ('OFFEN');
    PRINT '  ✓ ZahlungStatus OFFEN eklendi';
END

-- ZahlungTyp (Ödeme Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTyp] WHERE Code = 'MITGLIEDSBEITRAG')
BEGIN
    INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('MITGLIEDSBEITRAG');
    PRINT '  ✓ ZahlungTyp MITGLIEDSBEITRAG eklendi';
END

-- Waehrung (Para Birimi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Waehrung] WHERE Code = 'EUR')
BEGIN
    INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('EUR');
    PRINT '  ✓ Waehrung EUR eklendi';
END

-- Staatsangehoerigkeit (Uyruk) - KEYTABLE_SEED_DATA.sql'den
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'TR')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('TR', 'TUR');
    DECLARE @TurkeyId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@TurkeyId, 'tr', N'Türkiye'),
        (@TurkeyId, 'de', N'Türkei');
    PRINT '  ✓ Staatsangehoerigkeit TR eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'DE')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('DE', 'DEU');
    DECLARE @GermanyId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@GermanyId, 'tr', N'Almanya'),
        (@GermanyId, 'de', N'Deutschland');
    PRINT '  ✓ Staatsangehoerigkeit DE eklendi';
END

-- BeitragPeriode (Aidat Dönemi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'MONTHLY')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('MONTHLY', 1);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('MONTHLY', 'tr', N'Aylık'),
        ('MONTHLY', 'de', N'Monatlich');
    PRINT '  ✓ BeitragPeriode MONTHLY eklendi';
END

-- BeitragZahlungstagTyp (Ödeme Günü Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'DAY_OF_MONTH')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('DAY_OF_MONTH', 1);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('DAY_OF_MONTH', 'tr', N'Ayın Günü'),
        ('DAY_OF_MONTH', 'de', N'Tag des Monats');
    PRINT '  ✓ BeitragZahlungstagTyp DAY_OF_MONTH eklendi';
END

-- Rechtsform (Hukuki Yapı)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Rechtsform] WHERE Code = 'EV')
BEGIN
    INSERT INTO [Keytable].[Rechtsform] (Code) VALUES ('EV');
    DECLARE @EvId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[RechtsformUebersetzung] (RechtsformId, Sprache, Name) VALUES
        (@EvId, 'tr', N'Dernek (e.V.)'),
        (@EvId, 'de', N'Eingetragener Verein (e.V.)');
    PRINT '  ✓ Rechtsform EV eklendi';
END

-- AdresseTyp (Adres Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'HOME')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('HOME');
    DECLARE @HomeId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@HomeId, 'tr', N'Ev'),
        (@HomeId, 'de', N'Privat');
    PRINT '  ✓ AdresseTyp HOME eklendi';
END

-- Kontotyp (Hesap Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Kontotyp] WHERE Code = 'CHECKING')
BEGIN
    INSERT INTO [Keytable].[Kontotyp] (Code) VALUES ('CHECKING');
    DECLARE @CheckingId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[KontotypUebersetzung] (KontotypId, Sprache, Name) VALUES
        (@CheckingId, 'tr', N'Vadesiz Hesap'),
        (@CheckingId, 'de', N'Girokonto');
    PRINT '  ✓ Kontotyp CHECKING eklendi';
END

PRINT '  ✓ Referans tabloları hazır';
GO

-- =============================================
-- 1. VEREINE (Dernekler)
-- =============================================

PRINT '1. Dernekler ekleniyor...';

INSERT INTO [Verein].[Verein] (
    Name, Kurzname, Zweck, Telefon, Email, Webseite,
    Gruendungsdatum, Mitgliederzahl, Vereinsnummer, Steuernummer,
    Vorstandsvorsitzender, Kontaktperson,
    DeletedFlag, Created, CreatedBy
) VALUES
(
    N'Türkisch-Deutscher Kulturverein München',
    N'TDKV München',
    N'Kultureller Austausch und Integration in München',
    '+49 89 123456789',
    'info@tdkv-muenchen.de',
    'https://www.tdkv-muenchen.de',
    '1985-03-15',
    245,
    'VR 12345',
    '143/123/45678',
    N'Ahmet Yılmaz',
    N'Fatma Özkan',
    0,
    GETDATE(),
    1
),
(
    N'Deutsch-Türkische Freundschaft Berlin',
    N'DTF Berlin',
    N'Förderung der deutsch-türkischen Freundschaft',
    '+49 30 987654321',
    'kontakt@dtf-berlin.de',
    'https://www.dtf-berlin.de',
    '1992-08-22',
    189,
    'VR 67890',
    '27/456/78901',
    'Mehmet Demir',
    N'Ayşe Kaya',
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 2 Dernek eklendi';
GO

-- =============================================
-- 2. MITGLIEDER (Üyeler)
-- =============================================

PRINT '2. Üyeler ekleniyor...';

DECLARE @MuenchenVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');
DECLARE @AktivStatusId INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV');
DECLARE @VollmitgliedTypId INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED');
DECLARE @GeschlechtM INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'M');
DECLARE @GeschlechtF INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'F');

-- München Derneği Üyeleri
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    'M001',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Ahmet',
    N'Yılmaz',
    @GeschlechtM,
    'ahmet.yilmaz@email.com',
    '+49 89 111111111',
    '1975-05-12',
    '2020-01-15',
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M002',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Fatma',
    N'Özkan',
    @GeschlechtF,
    'fatma.ozkan@email.com',
    '+49 89 222222222',
    '1982-09-08',
    '2021-03-10',
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M003',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Can',
    'Schmidt',
    @GeschlechtM,
    'can.schmidt@email.com',
    '+49 89 333333333',
    '1990-12-03',
    '2022-06-20',
    1,
    0,
    GETDATE(),
    1
);

-- Berlin Derneği Üyeleri
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @BerlinVereinId,
    'B001',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Mehmet',
    'Demir',
    @GeschlechtM,
    'mehmet.demir@email.com',
    '+49 30 444444444',
    '1968-07-25',
    '2019-11-05',
    1,
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    'B002',
    @AktivStatusId,
    @VollmitgliedTypId,
    N'Ayşe',
    'Kaya',
    @GeschlechtF,
    'ayse.kaya@email.com',
    '+49 30 555555555',
    '1985-02-14',
    '2020-04-18',
    1,
    0,
    GETDATE(),
    1
);

-- Daha fazla München üyesi (farklı yaş grupları ve kayıt tarihleri)
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    'M004',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Zeynep',
    N'Yılmaz',
    @GeschlechtF,
    'zeynep.yilmaz@email.com',
    '+49 89 444444444',
    '2005-03-15',
    DATEADD(MONTH, -2, GETDATE()), -- 2 ay önce
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M005',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Emre',
    N'Koç',
    @GeschlechtM,
    'emre.koc@email.com',
    '+49 89 555555555',
    '1995-07-22',
    DATEADD(MONTH, -4, GETDATE()), -- 4 ay önce
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M006',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Selin',
    'Arslan',
    @GeschlechtF,
    'selin.arslan@email.com',
    '+49 89 666666666',
    '1988-11-30',
    DATEADD(MONTH, -6, GETDATE()), -- 6 ay önce
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M007',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Burak',
    N'Çelik',
    @GeschlechtM,
    'burak.celik@email.com',
    '+49 89 777777777',
    '1962-04-18',
    DATEADD(MONTH, -8, GETDATE()), -- 8 ay önce
    1,
    0,
    GETDATE(),
    1
);

-- Daha fazla Berlin üyesi
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @BerlinVereinId,
    'B003',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Deniz',
    N'Şahin',
    @GeschlechtM,
    'deniz.sahin@email.com',
    '+49 30 666666666',
    '2008-09-12',
    DATEADD(MONTH, -3, GETDATE()), -- 3 ay önce
    1,
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    'B004',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Ece',
    N'Yıldız',
    @GeschlechtF,
    'ece.yildiz@email.com',
    '+49 30 777777777',
    '1978-06-25',
    DATEADD(MONTH, -5, GETDATE()), -- 5 ay önce
    1,
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    'B005',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Kerem',
    N'Öztürk',
    @GeschlechtM,
    'kerem.ozturk@email.com',
    '+49 30 888888888',
    '1992-01-08',
    DATEADD(MONTH, -7, GETDATE()), -- 7 ay önce
    1,
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 12 Üye eklendi (7 München, 5 Berlin)';
GO

-- =============================================
-- 3. VERANSTALTUNGEN (Etkinlikler)
-- =============================================

PRINT '3. Etkinlikler ekleniyor...';

DECLARE @MuenchenVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');

-- München Derneği Etkinlikleri
INSERT INTO [Verein].[Veranstaltung] (
    VereinId, Titel, Beschreibung, Beginn, Ende, Preis,
    AnmeldeErforderlich, NurFuerMitglieder,
    DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    N'Türkischer Kulturabend',
    N'Ein Abend voller türkischer Kultur mit traditioneller Musik, Tanz und Küche',
    DATEADD(DAY, 15, GETDATE()),
    DATEADD(HOUR, 4, DATEADD(DAY, 15, GETDATE())),
    25.00,
    1, -- Kayıt gerekli
    0, -- Herkese açık
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    N'Deutsch-Türkisches Fußballturnier',
    N'Freundschaftliches Fußballturnier zwischen deutschen und türkischen Teams',
    DATEADD(DAY, 30, GETDATE()),
    DATEADD(HOUR, 6, DATEADD(DAY, 30, GETDATE())),
    10.00,
    1, -- Kayıt gerekli
    0, -- Herkese açık
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    N'Kinder-Sprachkurs Türkisch',
    N'Türkisch Sprachkurs für Kinder zwischen 6-12 Jahren',
    DATEADD(DAY, 7, GETDATE()),
    DATEADD(HOUR, 2, DATEADD(DAY, 7, GETDATE())),
    5.00,
    1, -- Kayıt gerekli
    1, -- Sadece üyeler
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    N'Mitgliederversammlung 2025',
    N'Jährliche Mitgliederversammlung mit Vorstandswahl',
    DATEADD(DAY, 20, GETDATE()),
    DATEADD(HOUR, 3, DATEADD(DAY, 20, GETDATE())),
    0.00,
    1, -- Kayıt gerekli
    1, -- Sadece üyeler
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    N'Türkischer Filmabend',
    N'Screening eines klassischen türkischen Films mit Diskussion',
    DATEADD(DAY, 40, GETDATE()),
    DATEADD(HOUR, 3, DATEADD(DAY, 40, GETDATE())),
    8.00,
    0, -- Kayıt gerekmez
    0, -- Herkese açık
    0,
    GETDATE(),
    1
);

-- Berlin Derneği Etkinlikleri
INSERT INTO [Verein].[Veranstaltung] (
    VereinId, Titel, Beschreibung, Beginn, Ende, Preis,
    AnmeldeErforderlich, NurFuerMitglieder,
    DeletedFlag, Created, CreatedBy
) VALUES
(
    @BerlinVereinId,
    'Integrationsseminar',
    N'Workshop über Integration und interkulturelle Kommunikation',
    DATEADD(DAY, -10, GETDATE()),
    DATEADD(HOUR, 3, DATEADD(DAY, -10, GETDATE())),
    0.00,
    0, -- Kayıt gerekmez
    0, -- Herkese açık
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    'Ramadan Iftar Abend',
    N'Gemeinsames Fastenbrechen während des Ramadan',
    DATEADD(DAY, 45, GETDATE()),
    DATEADD(HOUR, 3, DATEADD(DAY, 45, GETDATE())),
    15.00,
    1, -- Kayıt gerekli
    0, -- Herkese açık
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    N'Türkisch-Deutsche Kochkurs',
    N'Gemeinsames Kochen traditioneller türkischer Gerichte',
    DATEADD(DAY, 12, GETDATE()),
    DATEADD(HOUR, 4, DATEADD(DAY, 12, GETDATE())),
    20.00,
    1, -- Kayıt gerekli
    0, -- Herkese açık
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    N'Jugendtreffen',
    N'Treffen für Jugendliche zwischen 14-18 Jahren',
    DATEADD(DAY, 25, GETDATE()),
    DATEADD(HOUR, 3, DATEADD(DAY, 25, GETDATE())),
    0.00,
    0, -- Kayıt gerekmez
    1, -- Sadece üyeler
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    N'Sommerfest 2025',
    N'Großes Sommerfest mit Musik, Essen und Aktivitäten für die ganze Familie',
    DATEADD(DAY, 60, GETDATE()),
    DATEADD(HOUR, 8, DATEADD(DAY, 60, GETDATE())),
    12.00,
    1, -- Kayıt gerekli
    0, -- Herkese açık
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 11 Etkinlik eklendi (5 München, 6 Berlin)';
GO

-- =============================================
-- KONTROL SORGUSU
-- =============================================

PRINT '';
PRINT '==============================================';
PRINT 'DEMO VERİLERİ BAŞARIYLA EKLENDİ!';
PRINT '==============================================';
PRINT '';

-- Özet bilgi
SELECT
    'Dernekler' AS Kategori,
    COUNT(*) AS Adet
FROM [Verein].[Verein]
WHERE DeletedFlag = 0

UNION ALL

SELECT
    'Üyeler' AS Kategori,
    COUNT(*) AS Adet
FROM [Mitglied].[Mitglied]
WHERE DeletedFlag = 0

UNION ALL

SELECT
    'Etkinlikler' AS Kategori,
    COUNT(*) AS Adet
FROM [Verein].[Veranstaltung]
WHERE DeletedFlag = 0;

PRINT '';
PRINT 'Demo Hesaplar:';
PRINT '  1. ahmet.yilmaz@email.com (Dernek Yöneticisi - München)';
PRINT '  2. fatma.ozkan@email.com (Üye - München)';
PRINT '  3. mehmet.demir@email.com (Dernek Yöneticisi - Berlin)';
PRINT '';

-- =============================================
-- 4. AİLE ÜYELERİ VE İLİŞKİLERİ
-- =============================================

PRINT '4. Aile üyeleri ve ilişkileri ekleniyor...';

-- Fatma Özkan'ın bilgilerini al
DECLARE @FatmaId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com' AND DeletedFlag = 0);
DECLARE @FatmaVereinId INT = (SELECT TOP 1 VereinId FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com' AND DeletedFlag = 0);
DECLARE @AktivStatusId INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV');
DECLARE @VollmitgliedTypId INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED');
DECLARE @GeschlechtM INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'M');
DECLARE @GeschlechtF INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'F');
DECLARE @EbeveynTypId INT = (SELECT TOP 1 Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'EBEVEYN');
DECLARE @CocukTypId INT = (SELECT TOP 1 Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'COCUK');
DECLARE @EsTypId INT = (SELECT TOP 1 Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'ES');
DECLARE @KardesTypId INT = (SELECT TOP 1 Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'KARDES');
DECLARE @FamilieAktivStatusId INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'AKTIV');

-- Kontrol: Fatma Özkan bulundu mu?
IF @FatmaId IS NULL
BEGIN
    PRINT '  ⚠ UYARI: fatma.ozkan@email.com bulunamadı, aile verileri eklenemiyor!';
END
ELSE
BEGIN
    PRINT '  ✓ Fatma Özkan bulundu (ID: ' + CAST(@FatmaId AS VARCHAR(10)) + ')';

    -- Eş: Mehmet Özkan
    DECLARE @MehmetOzkanId INT;

    IF EXISTS (SELECT 1 FROM [Mitglied].[Mitglied] WHERE Vorname = 'Mehmet' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0)
    BEGIN
        SET @MehmetOzkanId = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Vorname = 'Mehmet' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0);
        PRINT '  ✓ Mehmet Özkan zaten mevcut';
    END
    ELSE
    BEGIN
        INSERT INTO [Mitglied].[Mitglied] (
            VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
            Vorname, Nachname, GeschlechtId, Email, Telefon, Mobiltelefon,
            Geburtsdatum, Eintrittsdatum,
            Aktiv, DeletedFlag, Created, CreatedBy
        ) VALUES (
            @FatmaVereinId, 'M008', @AktivStatusId, @VollmitgliedTypId,
            'Mehmet', N'Özkan', @GeschlechtM, 'mehmet.ozkan@email.com',
            '+49 89 98765432', '+49 170 9876543',
            '1978-03-20', GETDATE(),
            1, 0, GETDATE(), 1
        );
        SET @MehmetOzkanId = SCOPE_IDENTITY();
        PRINT '  ✓ Mehmet Özkan eklendi';
    END

    -- Oğul: Ali Özkan
    DECLARE @AliId INT;

    IF EXISTS (SELECT 1 FROM [Mitglied].[Mitglied] WHERE Vorname = 'Ali' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0)
    BEGIN
        SET @AliId = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Vorname = 'Ali' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0);
        PRINT '  ✓ Ali Özkan zaten mevcut';
    END
    ELSE
    BEGIN
        INSERT INTO [Mitglied].[Mitglied] (
            VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
            Vorname, Nachname, GeschlechtId, Email, Mobiltelefon,
            Geburtsdatum, Eintrittsdatum,
            Aktiv, DeletedFlag, Created, CreatedBy
        ) VALUES (
            @FatmaVereinId, 'M009', @AktivStatusId, @VollmitgliedTypId,
            'Ali', N'Özkan', @GeschlechtM, 'ali.ozkan@email.com', '+49 170 1112223',
            '2008-06-15', GETDATE(),
            1, 0, GETDATE(), 1
        );
        SET @AliId = SCOPE_IDENTITY();
        PRINT '  ✓ Ali Özkan eklendi';
    END

    -- Kız: Elif Özkan
    DECLARE @ElifId INT;

    IF EXISTS (SELECT 1 FROM [Mitglied].[Mitglied] WHERE Vorname = 'Elif' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0)
    BEGIN
        SET @ElifId = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Vorname = 'Elif' AND Nachname = N'Özkan' AND VereinId = @FatmaVereinId AND DeletedFlag = 0);
        PRINT '  ✓ Elif Özkan zaten mevcut';
    END
    ELSE
    BEGIN
        INSERT INTO [Mitglied].[Mitglied] (
            VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
            Vorname, Nachname, GeschlechtId, Email, Mobiltelefon,
            Geburtsdatum, Eintrittsdatum,
            Aktiv, DeletedFlag, Created, CreatedBy
        ) VALUES (
            @FatmaVereinId, 'M010', @AktivStatusId, @VollmitgliedTypId,
            'Elif', N'Özkan', @GeschlechtF, 'elif.ozkan@email.com', '+49 170 3334445',
            '2011-09-22', GETDATE(),
            1, 0, GETDATE(), 1
        );
        SET @ElifId = SCOPE_IDENTITY();
        PRINT '  ✓ Elif Özkan eklendi';
    END

    -- Mevcut aile ilişkilerini temizle (tekrar çalıştırılabilir olması için)
    DELETE FROM [Mitglied].[MitgliedFamilie]
    WHERE MitgliedId IN (@FatmaId, @MehmetOzkanId, @AliId, @ElifId)
       OR ParentMitgliedId IN (@FatmaId, @MehmetOzkanId, @AliId, @ElifId);

    -- Aile ilişkilerini ekle

    -- Fatma ve Mehmet eş
    INSERT INTO [Mitglied].[MitgliedFamilie] (
        VereinId, MitgliedId, ParentMitgliedId,
        FamilienbeziehungTypId, MitgliedFamilieStatusId,
        GueltigVon, DeletedFlag, Created, CreatedBy
    ) VALUES
    (@FatmaVereinId, @FatmaId, @MehmetOzkanId, @EsTypId, @FamilieAktivStatusId, GETDATE(), 0, GETDATE(), 1),
    (@FatmaVereinId, @MehmetOzkanId, @FatmaId, @EsTypId, @FamilieAktivStatusId, GETDATE(), 0, GETDATE(), 1);

    -- Ali'nin ebeveynleri
    INSERT INTO [Mitglied].[MitgliedFamilie] (
        VereinId, MitgliedId, ParentMitgliedId,
        FamilienbeziehungTypId, MitgliedFamilieStatusId,
        GueltigVon, DeletedFlag, Created, CreatedBy
    ) VALUES
    (@FatmaVereinId, @AliId, @FatmaId, @EbeveynTypId, @FamilieAktivStatusId, '2008-06-15', 0, GETDATE(), 1),
    (@FatmaVereinId, @AliId, @MehmetOzkanId, @EbeveynTypId, @FamilieAktivStatusId, '2008-06-15', 0, GETDATE(), 1);

    -- Elif'in ebeveynleri
    INSERT INTO [Mitglied].[MitgliedFamilie] (
        VereinId, MitgliedId, ParentMitgliedId,
        FamilienbeziehungTypId, MitgliedFamilieStatusId,
        GueltigVon, DeletedFlag, Created, CreatedBy
    ) VALUES
    (@FatmaVereinId, @ElifId, @FatmaId, @EbeveynTypId, @FamilieAktivStatusId, '2011-09-22', 0, GETDATE(), 1),
    (@FatmaVereinId, @ElifId, @MehmetOzkanId, @EbeveynTypId, @FamilieAktivStatusId, '2011-09-22', 0, GETDATE(), 1);

    -- Ali ve Elif kardeş
    INSERT INTO [Mitglied].[MitgliedFamilie] (
        VereinId, MitgliedId, ParentMitgliedId,
        FamilienbeziehungTypId, MitgliedFamilieStatusId,
        GueltigVon, DeletedFlag, Created, CreatedBy
    ) VALUES
    (@FatmaVereinId, @AliId, @ElifId, @KardesTypId, @FamilieAktivStatusId, '2011-09-22', 0, GETDATE(), 1),
    (@FatmaVereinId, @ElifId, @AliId, @KardesTypId, @FamilieAktivStatusId, '2011-09-22', 0, GETDATE(), 1);

    PRINT '  ✓ 3 Aile üyesi eklendi (Mehmet, Ali, Elif)';
    PRINT '  ✓ 8 Aile ilişkisi eklendi';
END
GO

-- =============================================
-- 5. FINANZ - BANKA HESAPLARI VE İŞLEMLER
-- =============================================

PRINT '5. Finanz - Banka hesapları ve işlemler ekleniyor...';

-- Önce Finanz verilerini temizle
DELETE FROM [Finanz].[MitgliedForderungZahlung];
DELETE FROM [Finanz].[MitgliedVorauszahlung];
DELETE FROM [Finanz].[VeranstaltungZahlung];
DELETE FROM [Finanz].[MitgliedZahlung];
DELETE FROM [Finanz].[MitgliedForderung];
DELETE FROM [Finanz].[BankBuchung];

DECLARE @MuenchenVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');

-- Banka hesaplarını al (Bankkonto tablosundan)
DECLARE @MuenchenBankkontoId INT = (SELECT TOP 1 Id FROM [Verein].[Bankkonto] WHERE VereinId = @MuenchenVereinId);
DECLARE @BerlinBankkontoId INT = (SELECT TOP 1 Id FROM [Verein].[Bankkonto] WHERE VereinId = @BerlinVereinId);

-- Eğer banka hesapları yoksa oluştur
IF @MuenchenBankkontoId IS NULL
BEGIN
    INSERT INTO [Verein].[Bankkonto] (
        VereinId, Bankname, IBAN, BIC, Kontoinhaber,
        Aktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        @MuenchenVereinId, 'Sparkasse München', 'DE89370400440532013000', 'COBADEFFXXX', N'TDKV München e.V.',
        1, 0, GETDATE(), 1
    );
    SET @MuenchenBankkontoId = SCOPE_IDENTITY();
    PRINT '  ✓ München banka hesabı oluşturuldu';
END

IF @BerlinBankkontoId IS NULL
BEGIN
    INSERT INTO [Verein].[Bankkonto] (
        VereinId, Bankname, IBAN, BIC, Kontoinhaber,
        Aktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        @BerlinVereinId, 'Berliner Sparkasse', 'DE89100500000054540402', 'BELADEBEXXX', N'DTF Berlin e.V.',
        1, 0, GETDATE(), 1
    );
    SET @BerlinBankkontoId = SCOPE_IDENTITY();
    PRINT '  ✓ Berlin banka hesabı oluşturuldu';
END

-- Banka hareketleri ekle (BankBuchung)
-- Waehrung ID: 1 = EUR (Keytable.Waehrung)
-- Status ID: 1 = VERBUCHT (Keytable.ZahlungStatus)
INSERT INTO [Finanz].[BankBuchung] (
    VereinId, BankKontoId, Buchungsdatum, Betrag, WaehrungId, Verwendungszweck,
    Empfaenger, StatusId, AngelegtAm,
    DeletedFlag, Created, CreatedBy
) VALUES
-- München banka hareketleri
(@MuenchenVereinId, @MuenchenBankkontoId, DATEADD(DAY, -30, GETDATE()), 1500.00, 1, N'Mitgliedsbeitrag Januar 2025', N'TDKV München', 1, DATEADD(DAY, -30, GETDATE()), 0, GETDATE(), 1),
(@MuenchenVereinId, @MuenchenBankkontoId, DATEADD(DAY, -25, GETDATE()), 800.00, 1, N'Spende', N'TDKV München', 1, DATEADD(DAY, -25, GETDATE()), 0, GETDATE(), 1),
(@MuenchenVereinId, @MuenchenBankkontoId, DATEADD(DAY, -20, GETDATE()), -450.00, 1, N'Raummiete', N'Kulturzentrum München', 1, DATEADD(DAY, -20, GETDATE()), 0, GETDATE(), 1),
(@MuenchenVereinId, @MuenchenBankkontoId, DATEADD(DAY, -15, GETDATE()), 250.00, 1, N'Veranstaltungsgebühr', N'TDKV München', 1, DATEADD(DAY, -15, GETDATE()), 0, GETDATE(), 1),
(@MuenchenVereinId, @MuenchenBankkontoId, DATEADD(DAY, -10, GETDATE()), 600.00, 1, N'Mitgliedsbeitrag Februar 2025', N'TDKV München', 1, DATEADD(DAY, -10, GETDATE()), 0, GETDATE(), 1),
-- Berlin banka hareketleri
(@BerlinVereinId, @BerlinBankkontoId, DATEADD(DAY, -28, GETDATE()), 1200.00, 1, N'Mitgliedsbeitrag Januar 2025', N'DTF Berlin', 1, DATEADD(DAY, -28, GETDATE()), 0, GETDATE(), 1),
(@BerlinVereinId, @BerlinBankkontoId, DATEADD(DAY, -22, GETDATE()), 500.00, 1, N'Spende', N'DTF Berlin', 1, DATEADD(DAY, -22, GETDATE()), 0, GETDATE(), 1),
(@BerlinVereinId, @BerlinBankkontoId, DATEADD(DAY, -18, GETDATE()), -300.00, 1, N'Büromaterial', N'Office Depot', 1, DATEADD(DAY, -18, GETDATE()), 0, GETDATE(), 1),
(@BerlinVereinId, @BerlinBankkontoId, DATEADD(DAY, -12, GETDATE()), 350.00, 1, N'Kursgebühr', N'DTF Berlin', 1, DATEADD(DAY, -12, GETDATE()), 0, GETDATE(), 1);

PRINT '  ✓ 9 Banka hareketi eklendi';

-- Üye alacakları ekle (MitgliedForderung)
DECLARE @AhmetId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ahmet.yilmaz@email.com');
DECLARE @FatmaId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com');
DECLARE @CanId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'can.schmidt@email.com');
DECLARE @MehmetDemirId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'mehmet.demir@email.com');
DECLARE @AyseId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ayse.kaya@email.com');

-- ZahlungTypId: 1 = Mitgliedsbeitrag (Keytable.ZahlungTyp)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = OFFEN (Keytable.ZahlungStatus)
INSERT INTO [Finanz].[MitgliedForderung] (
    VereinId, MitgliedId, ZahlungTypId, Forderungsnummer, Betrag, WaehrungId, Faelligkeit,
    Beschreibung, Jahr, Quartal, Monat, StatusId,
    DeletedFlag, Created, CreatedBy
) VALUES
-- München alacakları
(@MuenchenVereinId, @AhmetId, 1, 'F-2025-001', 120.00, 1, DATEADD(DAY, -15, GETDATE()), N'Mitgliedsbeitrag Q1 2025', 2025, 1, NULL, 1, 0, GETDATE(), 1),
(@MuenchenVereinId, @FatmaId, 1, 'F-2025-002', 120.00, 1, DATEADD(DAY, 15, GETDATE()), N'Mitgliedsbeitrag Q1 2025', 2025, 1, NULL, 2, 0, GETDATE(), 1),
(@MuenchenVereinId, @CanId, 1, 'F-2025-003', 120.00, 1, DATEADD(DAY, -5, GETDATE()), N'Mitgliedsbeitrag Q1 2025', 2025, 1, NULL, 2, 0, GETDATE(), 1),
(@MuenchenVereinId, @AhmetId, 1, 'F-2025-004', 120.00, 1, DATEADD(DAY, 75, GETDATE()), N'Mitgliedsbeitrag Q2 2025', 2025, 2, NULL, 2, 0, GETDATE(), 1),
-- Berlin alacakları
(@BerlinVereinId, @MehmetDemirId, 1, 'F-2025-101', 100.00, 1, DATEADD(DAY, -20, GETDATE()), N'Mitgliedsbeitrag Q1 2025', 2025, 1, NULL, 1, 0, GETDATE(), 1),
(@BerlinVereinId, @AyseId, 1, 'F-2025-102', 100.00, 1, DATEADD(DAY, 10, GETDATE()), N'Mitgliedsbeitrag Q1 2025', 2025, 1, NULL, 2, 0, GETDATE(), 1);

DECLARE @Forderung1Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedForderung] WHERE Forderungsnummer = 'F-2025-001');
DECLARE @Forderung5Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedForderung] WHERE Forderungsnummer = 'F-2025-101');

PRINT '  ✓ 6 Üye alacağı eklendi';

-- Üye ödemeleri ekle (MitgliedZahlung)
-- ZahlungTypId: 1 = Mitgliedsbeitrag (Keytable.ZahlungTyp)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = OFFEN (Keytable.ZahlungStatus)
INSERT INTO [Finanz].[MitgliedZahlung] (
    VereinId, MitgliedId, ZahlungTypId, Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg,
    BankkontoId, Bemerkung, StatusId,
    DeletedFlag, Created, CreatedBy
) VALUES
-- München ödemeleri
(@MuenchenVereinId, @AhmetId, 1, 120.00, 1, DATEADD(DAY, -15, GETDATE()), 'UEBERWEISUNG', @MuenchenBankkontoId, N'Mitgliedsbeitrag Q1 2025', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, @FatmaId, 1, 50.00, 1, DATEADD(DAY, -10, GETDATE()), 'BAR', NULL, N'Teilzahlung', 2, 0, GETDATE(), 1),
-- Berlin ödemeleri
(@BerlinVereinId, @MehmetDemirId, 1, 100.00, 1, DATEADD(DAY, -20, GETDATE()), 'UEBERWEISUNG', @BerlinBankkontoId, N'Mitgliedsbeitrag Q1 2025', 1, 0, GETDATE(), 1);

PRINT '  ✓ 3 Üye ödemesi eklendi';

-- Ödeme-Alacak eşleştirmeleri (MitgliedForderungZahlung)
DECLARE @Zahlung1Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @AhmetId AND Betrag = 120.00);
DECLARE @Zahlung3Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @MehmetDemirId);

IF @Forderung1Id IS NOT NULL AND @Zahlung1Id IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedForderungZahlung] (
        ForderungId, ZahlungId, Betrag,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@Forderung1Id, @Zahlung1Id, 120.00, 0, GETDATE(), 1);
END

IF @Forderung5Id IS NOT NULL AND @Zahlung3Id IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedForderungZahlung] (
        ForderungId, ZahlungId, Betrag,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@Forderung5Id, @Zahlung3Id, 100.00, 0, GETDATE(), 1);
END

PRINT '  ✓ 2 Ödeme-Alacak eşleştirmesi eklendi';

-- Ön ödemeler (MitgliedVorauszahlung)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
DECLARE @Zahlung2Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @FatmaId AND Betrag = 50.00);

IF @Zahlung2Id IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedVorauszahlung] (
        VereinId, MitgliedId, ZahlungId, Betrag, WaehrungId,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@MuenchenVereinId, @FatmaId, @Zahlung2Id, 50.00, 1, 0, GETDATE(), 1);
END

PRINT '  ✓ 1 Ön ödeme eklendi';

-- Etkinlik ödemeleri (VeranstaltungZahlung)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = AUSSTEHEND (Keytable.ZahlungStatus)
-- AnmeldungId: VeranstaltungAnmeldung tablosundan alınacak
DECLARE @VeranstaltungMuenchen1 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @MuenchenVereinId AND Titel = N'Türkischer Kulturabend');
DECLARE @VeranstaltungBerlin1 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @BerlinVereinId AND Titel = N'Türkisch-Deutsche Kochkurs');

-- Anmeldung ID'lerini al
DECLARE @AnmeldungMuenchen1 INT = (SELECT TOP 1 Id FROM [Verein].[VeranstaltungAnmeldung] WHERE VeranstaltungId = @VeranstaltungMuenchen1 ORDER BY Id ASC);
DECLARE @AnmeldungMuenchen2 INT = (SELECT TOP 1 Id FROM [Verein].[VeranstaltungAnmeldung] WHERE VeranstaltungId = @VeranstaltungMuenchen1 ORDER BY Id DESC);
DECLARE @AnmeldungBerlin1 INT = (SELECT TOP 1 Id FROM [Verein].[VeranstaltungAnmeldung] WHERE VeranstaltungId = @VeranstaltungBerlin1 ORDER BY Id ASC);
DECLARE @AnmeldungBerlin2 INT = (SELECT TOP 1 Id FROM [Verein].[VeranstaltungAnmeldung] WHERE VeranstaltungId = @VeranstaltungBerlin1 ORDER BY Id DESC);

-- Sadece geçerli AnmeldungId'leri olan kayıtları ekle
IF @AnmeldungMuenchen1 IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[VeranstaltungZahlung] (
        VeranstaltungId, AnmeldungId, Name, Email,
        Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg, StatusId,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@VeranstaltungMuenchen1, @AnmeldungMuenchen1, 'Ahmet Yılmaz', 'ahmet.yilmaz@email.com', 25.00, 1, DATEADD(DAY, -5, GETDATE()), 'UEBERWEISUNG', 1, 0, GETDATE(), 1);
END

IF @AnmeldungMuenchen2 IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[VeranstaltungZahlung] (
        VeranstaltungId, AnmeldungId, Name, Email,
        Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg, StatusId,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@VeranstaltungMuenchen1, @AnmeldungMuenchen2, 'Fatma Özkan', 'fatma.ozkan@email.com', 25.00, 1, DATEADD(DAY, -3, GETDATE()), 'BAR', 1, 0, GETDATE(), 1);
END

IF @AnmeldungBerlin1 IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[VeranstaltungZahlung] (
        VeranstaltungId, AnmeldungId, Name, Email,
        Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg, StatusId,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@VeranstaltungBerlin1, @AnmeldungBerlin1, 'Mehmet Demir', 'mehmet.demir@email.com', 20.00, 1, DATEADD(DAY, -2, GETDATE()), 'UEBERWEISUNG', 1, 0, GETDATE(), 1);
END

IF @AnmeldungBerlin2 IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[VeranstaltungZahlung] (
        VeranstaltungId, AnmeldungId, Name, Email,
        Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg, StatusId,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@VeranstaltungBerlin1, @AnmeldungBerlin2, 'Ayşe Kaya', 'ayse.kaya@email.com', 20.00, 1, NULL, NULL, 2, 0, GETDATE(), 1);
END

PRINT '  ✓ 4 Etkinlik ödemesi eklendi';

-- Forderung'ları güncelle (BezahltAm)
UPDATE [Finanz].[MitgliedForderung]
SET BezahltAm = DATEADD(DAY, -15, GETDATE())
WHERE Forderungsnummer = 'F-2025-001';

UPDATE [Finanz].[MitgliedForderung]
SET BezahltAm = DATEADD(DAY, -20, GETDATE())
WHERE Forderungsnummer = 'F-2025-101';

PRINT '  ✓ Finanz verileri tamamlandı';
GO

-- ============================================================================
-- 6. PASIF DERNEKLER (ADD_INACTIVE_VEREINE.sql'den)
-- ============================================================================

PRINT '';
PRINT '6. Pasif dernekler ekleniyor...';

-- Mevcut dernekleri aktif olarak işaretle
UPDATE [Verein].[Verein]
SET Aktiv = 1,
    Modified = GETDATE(),
    ModifiedBy = 1
WHERE Aktiv IS NULL OR Aktiv = 0;

DECLARE @UpdatedCount INT = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@UpdatedCount AS NVARCHAR(10)) + ' dernek aktif olarak işaretlendi';

-- Pasif dernekler ekle
INSERT INTO [Verein].[Verein] (
    Name, Kurzname, Zweck, Telefon, Email, Webseite,
    Gruendungsdatum, Mitgliederzahl, Vereinsnummer, Steuernummer,
    Vorstandsvorsitzender, Kontaktperson,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    N'Türkisch-Deutscher Sportverein Hamburg (Kapatıldı)',
    N'TDSV Hamburg',
    N'Spor ve kültürel faaliyetler - 2023''te kapatıldı',
    '+49 40 555555555',
    'archiv@tdsv-hamburg.de',
    'https://www.tdsv-hamburg.de',
    '1998-06-10',
    0,
    'VR 11111',
    '22/111/11111',
    N'Ali Çelik',
    N'Zeynep Arslan',
    0,
    0,
    GETDATE(),
    1
),
(
    N'Anadolu Kültür Derneği Frankfurt',
    N'AKD Frankfurt',
    N'Kültürel etkinlikler ve eğitim - Geçici olarak durduruldu',
    '+49 69 777777777',
    'info@akd-frankfurt.de',
    NULL,
    '2005-11-20',
    45,
    'VR 22222',
    '45/222/22222',
    N'Hasan Yıldız',
    N'Elif Şahin',
    0,
    0,
    GETDATE(),
    1
),
(
    N'Köln Türk Gençlik Birliği (Birleşti)',
    N'KTGB Köln',
    N'Gençlik faaliyetleri - 2024''te başka dernek ile birleşti',
    '+49 221 888888888',
    'eski@ktgb-koeln.de',
    NULL,
    '2010-03-05',
    0,
    'VR 33333',
    '50/333/33333',
    N'Emre Kara',
    N'Selin Aydın',
    0,
    0,
    GETDATE(),
    1
),
(
    N'Stuttgart Anadolu Kültür ve Sanat Derneği',
    N'SAKSD Stuttgart',
    N'Sanat ve kültür etkinlikleri - Mali sorunlar nedeniyle askıda',
    '+49 711 999999999',
    'muhasebe@saksd-stuttgart.de',
    'https://www.saksd-stuttgart.de',
    '2012-09-18',
    28,
    'VR 44444',
    '70/444/44444',
    N'Kemal Öztürk',
    N'Aylin Koç',
    0,
    0,
    GETDATE(),
    1
),
(
    N'Düsseldorf Türk Toplumu Derneği',
    N'DTTD Düsseldorf',
    N'Sosyal ve kültürel faaliyetler - Yönetim kurulu eksikliği',
    '+49 211 666666666',
    'iletisim@dttd-duesseldorf.de',
    NULL,
    '2008-04-12',
    15,
    'VR 55555',
    '40/555/55555',
    N'Murat Demir',
    N'Gül Yılmaz',
    0,
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 5 Pasif dernek eklendi';
GO

PRINT '';
PRINT '==============================================';
PRINT 'TÜM DEMO VERİLERİ BAŞARIYLA EKLENDİ!';
PRINT '==============================================';
PRINT '';
PRINT 'Özet:';
PRINT '  ✓ 7 Dernek (2 aktif + 5 pasif)';
PRINT '  ✓ 15 Üye (12 temel + 3 aile)';
PRINT '  ✓ 11 Etkinlik';
PRINT '  ✓ 8 Aile ilişkisi';
PRINT '  ✓ 2 Banka hesabı';
PRINT '  ✓ 9 Banka hareketi';
PRINT '  ✓ 6 Üye alacağı';
PRINT '  ✓ 3 Üye ödemesi';
PRINT '  ✓ 2 Ödeme-Alacak eşleştirmesi';
PRINT '  ✓ 1 Ön ödeme';
PRINT '  ✓ 4 Etkinlik ödemesi';
PRINT '';
PRINT 'Demo Hesaplar:';
PRINT '  1. ahmet.yilmaz@email.com (Dernek Yöneticisi - München)';
PRINT '  2. fatma.ozkan@email.com (Üye - München) - Ailem sayfasını test edin!';
PRINT '  3. mehmet.demir@email.com (Dernek Yöneticisi - Berlin)';
PRINT '';
PRINT 'Finanz Test Senaryoları:';
PRINT '  - Ahmet Yılmaz: Ödeme yapılmış alacak (F-2025-001)';
PRINT '  - Fatma Özkan: Açık alacak + Ön ödeme (50 EUR)';
PRINT '  - Can Schmidt: Vadesi geçmiş alacak (F-2025-003)';
PRINT '  - Mehmet Demir: Ödeme yapılmış alacak (F-2025-101)';
PRINT '';
PRINT 'Raporlar Sayfası:';
PRINT '  - Admin: admin@dernek.com → Tüm dernekler için raporlar';
PRINT '  - Dernek: ahmet.yilmaz@email.com → München raporları';
PRINT '  - Dernek: mehmet.demir@email.com → Berlin raporları';
PRINT '';

