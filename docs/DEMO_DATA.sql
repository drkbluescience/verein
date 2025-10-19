-- =============================================
-- VEREIN Demo Data
-- =============================================
-- Bu dosya demo/test verileri içerir
-- APPLICATION_H_101.sql çalıştırıldıktan sonra bu dosyayı çalıştırın
-- =============================================

USE [VEREIN];
GO

-- =============================================
-- ÖNCE ESKİ DEMO VERİLERİNİ TEMİZLE
-- =============================================

PRINT 'Eski demo verileri temizleniyor...';

-- Demo email ve MitgliedNr listeleri
DECLARE @DemoEmails TABLE (Email NVARCHAR(255));
INSERT INTO @DemoEmails VALUES
    ('ahmet.yilmaz@email.com'),
    ('fatma.ozkan@email.com'),
    ('mehmet.ozkan@email.com'),
    ('ali.ozkan@email.com'),
    ('elif.ozkan@email.com'),
    ('mehmet.demir@email.com'),
    ('ayse.kaya@email.com'),
    ('can.kaya@email.com'),
    ('can.schmidt@email.com'),
    ('zeynep.yilmaz@email.com'),
    ('emre.koc@email.com'),
    ('selin.arslan@email.com'),
    ('burak.celik@email.com'),
    ('deniz.sahin@email.com'),
    ('ece.yildiz@email.com'),
    ('kerem.ozturk@email.com');

DECLARE @DemoMitgliedsnummer TABLE (Mitgliedsnummer NVARCHAR(50));
INSERT INTO @DemoMitgliedsnummer VALUES
    ('M001'), ('M002'), ('M003'), ('M004'), ('M005'), ('M006'), ('M007'), ('M008'), ('M009'), ('M010'),
    ('B001'), ('B002'), ('B003'), ('B004'), ('B005'), ('B006');

-- 1. Aile ilişkilerini sil (Email veya Mitgliedsnummer bazlı)
DELETE FROM [Mitglied].[MitgliedFamilie]
WHERE MitgliedId IN (
    SELECT Id FROM [Mitglied].[Mitglied]
    WHERE Email IN (SELECT Email FROM @DemoEmails)
       OR Mitgliedsnummer IN (SELECT Mitgliedsnummer FROM @DemoMitgliedsnummer)
)
OR ParentMitgliedId IN (
    SELECT Id FROM [Mitglied].[Mitglied]
    WHERE Email IN (SELECT Email FROM @DemoEmails)
       OR Mitgliedsnummer IN (SELECT Mitgliedsnummer FROM @DemoMitgliedsnummer)
);

-- 2. Etkinlik kayıtlarını sil (Email veya Mitgliedsnummer bazlı)
DELETE FROM [Verein].[VeranstaltungAnmeldung]
WHERE MitgliedId IN (
    SELECT Id FROM [Mitglied].[Mitglied]
    WHERE Email IN (SELECT Email FROM @DemoEmails)
       OR Mitgliedsnummer IN (SELECT Mitgliedsnummer FROM @DemoMitgliedsnummer)
);

-- 3. Etkinlik resimlerini sil (Dernek bazlı) - ÖNCE BU!
DELETE FROM [Verein].[VeranstaltungBild]
WHERE VeranstaltungId IN (
    SELECT Id FROM [Verein].[Veranstaltung]
    WHERE VereinId IN (
        SELECT Id FROM [Verein].[Verein]
        WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
    )
);

-- 4. Etkinlikleri sil (Dernek bazlı)
DELETE FROM [Verein].[Veranstaltung]
WHERE VereinId IN (
    SELECT Id FROM [Verein].[Verein]
    WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
);

-- 5. Üye adreslerini sil (Email veya Mitgliedsnummer bazlı)
DELETE FROM [Mitglied].[MitgliedAdresse]
WHERE MitgliedId IN (
    SELECT Id FROM [Mitglied].[Mitglied]
    WHERE Email IN (SELECT Email FROM @DemoEmails)
       OR Mitgliedsnummer IN (SELECT Mitgliedsnummer FROM @DemoMitgliedsnummer)
);

-- 6. Üyeleri sil (Email veya Mitgliedsnummer bazlı - TÜM kayıtları sil)
DELETE FROM [Mitglied].[Mitglied]
WHERE Email IN (SELECT Email FROM @DemoEmails)
   OR Mitgliedsnummer IN (SELECT Mitgliedsnummer FROM @DemoMitgliedsnummer);

-- 7. Dernekleri sil
DELETE FROM [Verein].[Verein]
WHERE Kurzname IN (N'TDKV München', N'DTF Berlin');

PRINT '  ✓ Eski demo verileri temizlendi';
GO

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

PRINT '';
PRINT '==============================================';
PRINT 'TÜM DEMO VERİLERİ BAŞARIYLA EKLENDİ!';
PRINT '==============================================';
PRINT '';
PRINT 'Özet:';
PRINT '  ✓ 2 Dernek';
PRINT '  ✓ 15 Üye (12 temel + 3 aile)';
PRINT '  ✓ 11 Etkinlik';
PRINT '  ✓ 8 Aile ilişkisi';
PRINT '';
PRINT 'Demo Hesaplar:';
PRINT '  1. ahmet.yilmaz@email.com (Dernek Yöneticisi - München)';
PRINT '  2. fatma.ozkan@email.com (Üye - München) - Ailem sayfasını test edin!';
PRINT '  3. mehmet.demir@email.com (Dernek Yöneticisi - Berlin)';
PRINT '';
PRINT 'Raporlar Sayfası:';
PRINT '  - Admin: admin@dernek.com → Tüm dernekler için raporlar';
PRINT '  - Dernek: ahmet.yilmaz@email.com → München raporları';
PRINT '  - Dernek: mehmet.demir@email.com → Berlin raporları';
PRINT '';

