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
-- 0. TABLO YAPILARINI KONTROL ET VE DÜZELT
-- =============================================

PRINT '0. Tablo yapıları kontrol ediliyor...';

-- User tablosuna Aktiv kolonu ekle (eğer yoksa)
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'Web'
      AND TABLE_NAME = 'User'
      AND COLUMN_NAME = 'Aktiv'
)
BEGIN
    ALTER TABLE [Web].[User]
    ADD [Aktiv] BIT NULL DEFAULT 1;

    PRINT '  ✓ User.Aktiv kolonu eklendi';
END
ELSE
BEGIN
    PRINT '  ✓ User.Aktiv kolonu zaten mevcut';
END

-- UserRole tablosuna Aktiv kolonu ekle (eğer yoksa)
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'Web'
      AND TABLE_NAME = 'UserRole'
      AND COLUMN_NAME = 'Aktiv'
)
BEGIN
    ALTER TABLE [Web].[UserRole]
    ADD [Aktiv] BIT NULL DEFAULT 1;

    PRINT '  ✓ UserRole.Aktiv kolonu eklendi';
END
ELSE
BEGIN
    PRINT '  ✓ UserRole.Aktiv kolonu zaten mevcut';
END

-- PageNote tablosuna Aktiv kolonu ekle (eğer yoksa)
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'Web'
      AND TABLE_NAME = 'PageNote'
      AND COLUMN_NAME = 'Aktiv'
)
BEGIN
    ALTER TABLE [Web].[PageNote]
    ADD [Aktiv] BIT NULL DEFAULT 1;

    PRINT '  ✓ PageNote.Aktiv kolonu eklendi';
END
ELSE
BEGIN
    PRINT '  ✓ PageNote.Aktiv kolonu zaten mevcut';
END

-- PageNote tablosunda CreatedBy ve ModifiedBy kolonlarını nvarchar(256)'ya çevir
-- (APPLICATION_H_101_AZURE.sql'de zaten nvarchar(256) olarak tanımlı)
IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'Web'
      AND TABLE_NAME = 'PageNote'
      AND COLUMN_NAME = 'CreatedBy'
      AND DATA_TYPE = 'int'
)
BEGIN
    -- Önce mevcut veriyi temizle (çünkü tip değişikliği yapacağız)
    DELETE FROM [Web].[PageNote];

    -- CreatedBy kolonunu nvarchar(256)'ya çevir
    ALTER TABLE [Web].[PageNote]
    ALTER COLUMN [CreatedBy] NVARCHAR(256) NULL;

    PRINT '  ✓ PageNote.CreatedBy kolonu nvarchar(256) tipine çevrildi';
END

IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'Web'
      AND TABLE_NAME = 'PageNote'
      AND COLUMN_NAME = 'ModifiedBy'
      AND DATA_TYPE = 'int'
)
BEGIN
    -- ModifiedBy kolonunu nvarchar(256)'ya çevir
    ALTER TABLE [Web].[PageNote]
    ALTER COLUMN [ModifiedBy] NVARCHAR(256) NULL;

    PRINT '  ✓ PageNote.ModifiedBy kolonu nvarchar(256) tipine çevrildi';
END
GO

-- =============================================
-- 1. KEYTABLE VERİLERİ (Önce referans tabloları)
-- =============================================

PRINT '1. Referans tabloları kontrol ediliyor...';

-- Geschlecht (Cinsiyet)
-- Geschlecht (Cinsiyet) - Ana kayıtlar
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

-- Geschlecht çevirilerini ekle
DECLARE @GeschlechtMId INT = (SELECT Id FROM [Keytable].[Geschlecht] WHERE Code = 'M');
IF @GeschlechtMId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[GeschlechtUebersetzung] WHERE GeschlechtId = @GeschlechtMId AND Sprache = 'tr')
        INSERT INTO [Keytable].[GeschlechtUebersetzung] (GeschlechtId, Sprache, Name) VALUES (@GeschlechtMId, 'tr', N'Erkek');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[GeschlechtUebersetzung] WHERE GeschlechtId = @GeschlechtMId AND Sprache = 'de')
        INSERT INTO [Keytable].[GeschlechtUebersetzung] (GeschlechtId, Sprache, Name) VALUES (@GeschlechtMId, 'de', N'Männlich');
    PRINT '  ✓ Geschlecht M çevirileri eklendi';
END

DECLARE @GeschlechtFId INT = (SELECT Id FROM [Keytable].[Geschlecht] WHERE Code = 'F');
IF @GeschlechtFId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[GeschlechtUebersetzung] WHERE GeschlechtId = @GeschlechtFId AND Sprache = 'tr')
        INSERT INTO [Keytable].[GeschlechtUebersetzung] (GeschlechtId, Sprache, Name) VALUES (@GeschlechtFId, 'tr', N'Kadın');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[GeschlechtUebersetzung] WHERE GeschlechtId = @GeschlechtFId AND Sprache = 'de')
        INSERT INTO [Keytable].[GeschlechtUebersetzung] (GeschlechtId, Sprache, Name) VALUES (@GeschlechtFId, 'de', N'Weiblich');
    PRINT '  ✓ Geschlecht F çevirileri eklendi';
END

-- MitgliedStatus - Çevirilerle birlikte
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV')
BEGIN
    INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('AKTIV');
    PRINT '  ✓ MitgliedStatus AKTIV eklendi';
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatus] WHERE Code = 'PASSIV')
BEGIN
    INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('PASSIV');
    PRINT '  ✓ MitgliedStatus PASSIV eklendi';
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatus] WHERE Code = 'AUSGETRETEN')
BEGIN
    INSERT INTO [Keytable].[MitgliedStatus] (Code) VALUES ('AUSGETRETEN');
    PRINT '  ✓ MitgliedStatus AUSGETRETEN eklendi';
END

-- MitgliedStatus çevirilerini ekle
DECLARE @MitgliedStatusAktivId INT = (SELECT Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV');
IF @MitgliedStatusAktivId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusAktivId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusAktivId, 'tr', N'Aktif');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusAktivId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusAktivId, 'de', N'Aktiv');
END

DECLARE @MitgliedStatusPassivId INT = (SELECT Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'PASSIV');
IF @MitgliedStatusPassivId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusPassivId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusPassivId, 'tr', N'Pasif');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusPassivId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusPassivId, 'de', N'Passiv');
END

DECLARE @MitgliedStatusAusgetretenId INT = (SELECT Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'AUSGETRETEN');
IF @MitgliedStatusAusgetretenId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusAusgetretenId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusAusgetretenId, 'tr', N'Ayrılmış');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedStatusUebersetzung] WHERE MitgliedStatusId = @MitgliedStatusAusgetretenId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedStatusUebersetzung] (MitgliedStatusId, Sprache, Name) VALUES (@MitgliedStatusAusgetretenId, 'de', N'Ausgetreten');
END
PRINT '  ✓ MitgliedStatus çevirileri eklendi';

-- MitgliedTyp - Çevirilerle birlikte
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED')
BEGIN
    INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('VOLLMITGLIED');
    PRINT '  ✓ MitgliedTyp VOLLMITGLIED eklendi';
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTyp] WHERE Code = 'FOERDERMITGLIED')
BEGIN
    INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('FOERDERMITGLIED');
    PRINT '  ✓ MitgliedTyp FOERDERMITGLIED eklendi';
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTyp] WHERE Code = 'EHRENMITGLIED')
BEGIN
    INSERT INTO [Keytable].[MitgliedTyp] (Code) VALUES ('EHRENMITGLIED');
    PRINT '  ✓ MitgliedTyp EHRENMITGLIED eklendi';
END

-- MitgliedTyp çevirilerini ekle
DECLARE @VollmitgliedId INT = (SELECT Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED');
IF @VollmitgliedId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @VollmitgliedId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@VollmitgliedId, 'tr', N'Tam Üye');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @VollmitgliedId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@VollmitgliedId, 'de', N'Vollmitglied');
END

DECLARE @FoerdermitgliedId INT = (SELECT Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'FOERDERMITGLIED');
IF @FoerdermitgliedId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @FoerdermitgliedId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@FoerdermitgliedId, 'tr', N'Destekçi Üye');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @FoerdermitgliedId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@FoerdermitgliedId, 'de', N'Fördermitglied');
END

DECLARE @EhrenmitgliedId INT = (SELECT Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'EHRENMITGLIED');
IF @EhrenmitgliedId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @EhrenmitgliedId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@EhrenmitgliedId, 'tr', N'Onursal Üye');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedTypUebersetzung] WHERE MitgliedTypId = @EhrenmitgliedId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedTypUebersetzung] (MitgliedTypId, Sprache, Name) VALUES (@EhrenmitgliedId, 'de', N'Ehrenmitglied');
END
PRINT '  ✓ MitgliedTyp çevirileri eklendi';

-- FamilienbeziehungTyp (Aile İlişki Tipleri) - Çevirilerle birlikte
IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'EBEVEYN')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('EBEVEYN');
    DECLARE @EbeveynId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
        (@EbeveynId, 'tr', N'Ebeveyn'),
        (@EbeveynId, 'de', N'Elternteil');
    PRINT '  ✓ FamilienbeziehungTyp EBEVEYN eklendi';
END
ELSE
BEGIN
    DECLARE @ExistingEbeveynId INT = (SELECT Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'EBEVEYN');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTypUebersetzung] WHERE FamilienbeziehungTypId = @ExistingEbeveynId AND Sprache = 'tr')
    BEGIN
        INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
            (@ExistingEbeveynId, 'tr', N'Ebeveyn'),
            (@ExistingEbeveynId, 'de', N'Elternteil');
        PRINT '  ✓ FamilienbeziehungTyp EBEVEYN çevirileri eklendi';
    END
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'COCUK')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('COCUK');
    DECLARE @CocukId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
        (@CocukId, 'tr', N'Çocuk'),
        (@CocukId, 'de', N'Kind');
    PRINT '  ✓ FamilienbeziehungTyp COCUK eklendi';
END
ELSE
BEGIN
    DECLARE @ExistingCocukId INT = (SELECT Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'COCUK');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTypUebersetzung] WHERE FamilienbeziehungTypId = @ExistingCocukId AND Sprache = 'tr')
    BEGIN
        INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
            (@ExistingCocukId, 'tr', N'Çocuk'),
            (@ExistingCocukId, 'de', N'Kind');
        PRINT '  ✓ FamilienbeziehungTyp COCUK çevirileri eklendi';
    END
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'ES')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('ES');
    DECLARE @EsId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
        (@EsId, 'tr', N'Eş'),
        (@EsId, 'de', N'Ehepartner');
    PRINT '  ✓ FamilienbeziehungTyp ES eklendi';
END
ELSE
BEGIN
    DECLARE @ExistingEsId INT = (SELECT Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'ES');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTypUebersetzung] WHERE FamilienbeziehungTypId = @ExistingEsId AND Sprache = 'tr')
    BEGIN
        INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
            (@ExistingEsId, 'tr', N'Eş'),
            (@ExistingEsId, 'de', N'Ehepartner');
        PRINT '  ✓ FamilienbeziehungTyp ES çevirileri eklendi';
    END
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'KARDES')
BEGIN
    INSERT INTO [Keytable].[FamilienbeziehungTyp] (Code) VALUES ('KARDES');
    DECLARE @KardesId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
        (@KardesId, 'tr', N'Kardeş'),
        (@KardesId, 'de', N'Geschwister');
    PRINT '  ✓ FamilienbeziehungTyp KARDES eklendi';
END
ELSE
BEGIN
    DECLARE @ExistingKardesId INT = (SELECT Id FROM [Keytable].[FamilienbeziehungTyp] WHERE Code = 'KARDES');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[FamilienbeziehungTypUebersetzung] WHERE FamilienbeziehungTypId = @ExistingKardesId AND Sprache = 'tr')
    BEGIN
        INSERT INTO [Keytable].[FamilienbeziehungTypUebersetzung] (FamilienbeziehungTypId, Sprache, Name) VALUES
            (@ExistingKardesId, 'tr', N'Kardeş'),
            (@ExistingKardesId, 'de', N'Geschwister');
        PRINT '  ✓ FamilienbeziehungTyp KARDES çevirileri eklendi';
    END
END

-- MitgliedFamilieStatus - Çevirilerle birlikte
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'AKTIV')
    INSERT INTO [Keytable].[MitgliedFamilieStatus] (Code) VALUES ('AKTIV');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'INAKTIV')
    INSERT INTO [Keytable].[MitgliedFamilieStatus] (Code) VALUES ('INAKTIV');

DECLARE @FamilieStatusAktivId2 INT = (SELECT Id FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'AKTIV');
IF @FamilieStatusAktivId2 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatusUebersetzung] WHERE MitgliedFamilieStatusId = @FamilieStatusAktivId2 AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES (@FamilieStatusAktivId2, 'tr', N'Aktif');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatusUebersetzung] WHERE MitgliedFamilieStatusId = @FamilieStatusAktivId2 AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES (@FamilieStatusAktivId2, 'de', N'Aktiv');
END

DECLARE @FamilieStatusInaktivId INT = (SELECT Id FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'INAKTIV');
IF @FamilieStatusInaktivId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatusUebersetzung] WHERE MitgliedFamilieStatusId = @FamilieStatusInaktivId AND Sprache = 'tr')
        INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES (@FamilieStatusInaktivId, 'tr', N'Pasif');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatusUebersetzung] WHERE MitgliedFamilieStatusId = @FamilieStatusInaktivId AND Sprache = 'de')
        INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES (@FamilieStatusInaktivId, 'de', N'Inaktiv');
END
PRINT '  ✓ MitgliedFamilieStatus çevirileri eklendi';

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
    INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('MITGLIEDSBEITRAG');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTyp] WHERE Code = 'SPENDE')
    INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('SPENDE');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTyp] WHERE Code = 'VERANSTALTUNG')
    INSERT INTO [Keytable].[ZahlungTyp] (Code) VALUES ('VERANSTALTUNG');
PRINT '  ✓ ZahlungTyp kayıtları eklendi';

-- ZahlungTyp çevirilerini ekle
DECLARE @ZahlungTypMitgliedsbeitragId INT = (SELECT Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'MITGLIEDSBEITRAG');
IF @ZahlungTypMitgliedsbeitragId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypMitgliedsbeitragId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypMitgliedsbeitragId, 'tr', N'Üyelik Aidatı');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypMitgliedsbeitragId AND Sprache = 'de')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypMitgliedsbeitragId, 'de', N'Mitgliedsbeitrag');
END

DECLARE @ZahlungTypSpendeId INT = (SELECT Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'SPENDE');
IF @ZahlungTypSpendeId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypSpendeId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypSpendeId, 'tr', N'Bağış');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypSpendeId AND Sprache = 'de')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypSpendeId, 'de', N'Spende');
END

DECLARE @ZahlungTypVeranstaltungId INT = (SELECT Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'VERANSTALTUNG');
IF @ZahlungTypVeranstaltungId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypVeranstaltungId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypVeranstaltungId, 'tr', N'Etkinlik');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungTypUebersetzung] WHERE ZahlungTypId = @ZahlungTypVeranstaltungId AND Sprache = 'de')
        INSERT INTO [Keytable].[ZahlungTypUebersetzung] (ZahlungTypId, Sprache, Name) VALUES (@ZahlungTypVeranstaltungId, 'de', N'Veranstaltung');
END
PRINT '  ✓ ZahlungTyp çevirileri eklendi';

-- ZahlungStatus çevirilerini ekle
DECLARE @ZahlungStatusBezahltId INT = (SELECT Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'BEZAHLT');
IF @ZahlungStatusBezahltId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatusUebersetzung] WHERE ZahlungStatusId = @ZahlungStatusBezahltId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ZahlungStatusUebersetzung] (ZahlungStatusId, Sprache, Name) VALUES (@ZahlungStatusBezahltId, 'tr', N'Ödendi');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatusUebersetzung] WHERE ZahlungStatusId = @ZahlungStatusBezahltId AND Sprache = 'de')
        INSERT INTO [Keytable].[ZahlungStatusUebersetzung] (ZahlungStatusId, Sprache, Name) VALUES (@ZahlungStatusBezahltId, 'de', N'Bezahlt');
END

DECLARE @ZahlungStatusOffenId INT = (SELECT Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'OFFEN');
IF @ZahlungStatusOffenId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatusUebersetzung] WHERE ZahlungStatusId = @ZahlungStatusOffenId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ZahlungStatusUebersetzung] (ZahlungStatusId, Sprache, Name) VALUES (@ZahlungStatusOffenId, 'tr', N'Açık');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ZahlungStatusUebersetzung] WHERE ZahlungStatusId = @ZahlungStatusOffenId AND Sprache = 'de')
        INSERT INTO [Keytable].[ZahlungStatusUebersetzung] (ZahlungStatusId, Sprache, Name) VALUES (@ZahlungStatusOffenId, 'de', N'Offen');
END
PRINT '  ✓ ZahlungStatus çevirileri eklendi';

-- Waehrung (Para Birimi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Waehrung] WHERE Code = 'EUR')
    INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('EUR');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Waehrung] WHERE Code = 'TRY')
    INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('TRY');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Waehrung] WHERE Code = 'USD')
    INSERT INTO [Keytable].[Waehrung] (Code) VALUES ('USD');
PRINT '  ✓ Waehrung kayıtları eklendi';

-- Waehrung çevirilerini ekle
DECLARE @WaehrungEurId INT = (SELECT Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');
IF @WaehrungEurId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungEurId AND Sprache = 'tr')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungEurId, 'tr', N'Euro');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungEurId AND Sprache = 'de')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungEurId, 'de', N'Euro');
END

DECLARE @WaehrungTryId INT = (SELECT Id FROM [Keytable].[Waehrung] WHERE Code = 'TRY');
IF @WaehrungTryId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungTryId AND Sprache = 'tr')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungTryId, 'tr', N'Türk Lirası');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungTryId AND Sprache = 'de')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungTryId, 'de', N'Türkische Lira');
END

DECLARE @WaehrungUsdId INT = (SELECT Id FROM [Keytable].[Waehrung] WHERE Code = 'USD');
IF @WaehrungUsdId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungUsdId AND Sprache = 'tr')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungUsdId, 'tr', N'ABD Doları');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[WaehrungUebersetzung] WHERE WaehrungId = @WaehrungUsdId AND Sprache = 'de')
        INSERT INTO [Keytable].[WaehrungUebersetzung] (WaehrungId, Sprache, Name) VALUES (@WaehrungUsdId, 'de', N'US-Dollar');
END
PRINT '  ✓ Waehrung çevirileri eklendi';

-- Forderungsart (Alacak Türü)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsart] WHERE Code = 'BEITRAG')
    INSERT INTO [Keytable].[Forderungsart] (Code) VALUES ('BEITRAG');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsart] WHERE Code = 'VERANSTALTUNG')
    INSERT INTO [Keytable].[Forderungsart] (Code) VALUES ('VERANSTALTUNG');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsart] WHERE Code = 'SONSTIGE')
    INSERT INTO [Keytable].[Forderungsart] (Code) VALUES ('SONSTIGE');
PRINT '  ✓ Forderungsart kayıtları eklendi';

-- Forderungsart çevirilerini ekle
DECLARE @ForderungsartBeitragId INT = (SELECT Id FROM [Keytable].[Forderungsart] WHERE Code = 'BEITRAG');
IF @ForderungsartBeitragId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartBeitragId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartBeitragId, 'tr', N'Aidat');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartBeitragId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartBeitragId, 'de', N'Beitrag');
END

DECLARE @ForderungsartVeranstaltungId INT = (SELECT Id FROM [Keytable].[Forderungsart] WHERE Code = 'VERANSTALTUNG');
IF @ForderungsartVeranstaltungId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartVeranstaltungId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartVeranstaltungId, 'tr', N'Etkinlik');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartVeranstaltungId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartVeranstaltungId, 'de', N'Veranstaltung');
END

DECLARE @ForderungsartSonstigeId INT = (SELECT Id FROM [Keytable].[Forderungsart] WHERE Code = 'SONSTIGE');
IF @ForderungsartSonstigeId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartSonstigeId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartSonstigeId, 'tr', N'Diğer');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsartUebersetzung] WHERE ForderungsartId = @ForderungsartSonstigeId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsartUebersetzung] (ForderungsartId, Sprache, Name) VALUES (@ForderungsartSonstigeId, 'de', N'Sonstige');
END
PRINT '  ✓ Forderungsart çevirileri eklendi';

-- Forderungsstatus (Alacak Durumu)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsstatus] WHERE Code = 'OFFEN')
    INSERT INTO [Keytable].[Forderungsstatus] (Code) VALUES ('OFFEN');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsstatus] WHERE Code = 'BEZAHLT')
    INSERT INTO [Keytable].[Forderungsstatus] (Code) VALUES ('BEZAHLT');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsstatus] WHERE Code = 'TEILBEZAHLT')
    INSERT INTO [Keytable].[Forderungsstatus] (Code) VALUES ('TEILBEZAHLT');
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Forderungsstatus] WHERE Code = 'STORNIERT')
    INSERT INTO [Keytable].[Forderungsstatus] (Code) VALUES ('STORNIERT');
PRINT '  ✓ Forderungsstatus kayıtları eklendi';

-- Forderungsstatus çevirilerini ekle
DECLARE @ForderungsstatusOffenId INT = (SELECT Id FROM [Keytable].[Forderungsstatus] WHERE Code = 'OFFEN');
IF @ForderungsstatusOffenId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusOffenId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusOffenId, 'tr', N'Açık');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusOffenId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusOffenId, 'de', N'Offen');
END

DECLARE @ForderungsstatusBezahltId INT = (SELECT Id FROM [Keytable].[Forderungsstatus] WHERE Code = 'BEZAHLT');
IF @ForderungsstatusBezahltId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusBezahltId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusBezahltId, 'tr', N'Ödendi');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusBezahltId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusBezahltId, 'de', N'Bezahlt');
END

DECLARE @ForderungsstatusTeilbezahltId INT = (SELECT Id FROM [Keytable].[Forderungsstatus] WHERE Code = 'TEILBEZAHLT');
IF @ForderungsstatusTeilbezahltId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusTeilbezahltId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusTeilbezahltId, 'tr', N'Kısmi Ödendi');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusTeilbezahltId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusTeilbezahltId, 'de', N'Teilbezahlt');
END

DECLARE @ForderungsstatusStorniertId INT = (SELECT Id FROM [Keytable].[Forderungsstatus] WHERE Code = 'STORNIERT');
IF @ForderungsstatusStorniertId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusStorniertId AND Sprache = 'tr')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusStorniertId, 'tr', N'İptal Edildi');
    IF NOT EXISTS (SELECT 1 FROM [Keytable].[ForderungsstatusUebersetzung] WHERE ForderungsstatusId = @ForderungsstatusStorniertId AND Sprache = 'de')
        INSERT INTO [Keytable].[ForderungsstatusUebersetzung] (ForderungsstatusId, Sprache, Name) VALUES (@ForderungsstatusStorniertId, 'de', N'Storniert');
END
PRINT '  ✓ Forderungsstatus çevirileri eklendi';

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
        ('MONTHLY', 'tr', N'Aylık'), ('MONTHLY', 'de', N'Monatlich');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'YEARLY')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('YEARLY', 2);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('YEARLY', 'tr', N'Yıllık'), ('YEARLY', 'de', N'Jährlich');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'QUARTERLY')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('QUARTERLY', 3);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('QUARTERLY', 'tr', N'Üç Aylık'), ('QUARTERLY', 'de', N'Vierteljährlich');
END
PRINT '  ✓ BeitragPeriode kayıtları eklendi';

-- BeitragZahlungstagTyp (Ödeme Günü Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'DAY_OF_MONTH')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('DAY_OF_MONTH', 1);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('DAY_OF_MONTH', 'tr', N'Ayın Günü'), ('DAY_OF_MONTH', 'de', N'Tag des Monats');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'FIRST_DAY')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('FIRST_DAY', 2);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('FIRST_DAY', 'tr', N'Ayın İlk Günü'), ('FIRST_DAY', 'de', N'Erster Tag');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'LAST_DAY')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('LAST_DAY', 3);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('LAST_DAY', 'tr', N'Ayın Son Günü'), ('LAST_DAY', 'de', N'Letzter Tag');
END
PRINT '  ✓ BeitragZahlungstagTyp kayıtları eklendi';

-- Rechtsform (Hukuki Yapı)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Rechtsform] WHERE Code = 'EV')
BEGIN
    INSERT INTO [Keytable].[Rechtsform] (Code) VALUES ('EV');
    DECLARE @EvId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[RechtsformUebersetzung] (RechtsformId, Sprache, Name) VALUES
        (@EvId, 'tr', N'Dernek (e.V.)'), (@EvId, 'de', N'Eingetragener Verein (e.V.)');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Rechtsform] WHERE Code = 'GMBH')
BEGIN
    INSERT INTO [Keytable].[Rechtsform] (Code) VALUES ('GMBH');
    DECLARE @GmbhId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[RechtsformUebersetzung] (RechtsformId, Sprache, Name) VALUES
        (@GmbhId, 'tr', N'Limited Şirket'), (@GmbhId, 'de', N'GmbH');
END
PRINT '  ✓ Rechtsform kayıtları eklendi';

-- AdresseTyp (Adres Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'HOME')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('HOME');
    DECLARE @HomeId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@HomeId, 'tr', N'Ev'), (@HomeId, 'de', N'Privat');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'WORK')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('WORK');
    DECLARE @WorkId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@WorkId, 'tr', N'İş'), (@WorkId, 'de', N'Geschäftlich');
END
PRINT '  ✓ AdresseTyp kayıtları eklendi';

-- Kontotyp (Hesap Tipi)
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Kontotyp] WHERE Code = 'CHECKING')
BEGIN
    INSERT INTO [Keytable].[Kontotyp] (Code) VALUES ('CHECKING');
    DECLARE @CheckingId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[KontotypUebersetzung] (KontotypId, Sprache, Name) VALUES
        (@CheckingId, 'tr', N'Vadesiz Hesap'), (@CheckingId, 'de', N'Girokonto');
END
IF NOT EXISTS (SELECT 1 FROM [Keytable].[Kontotyp] WHERE Code = 'SAVINGS')
BEGIN
    INSERT INTO [Keytable].[Kontotyp] (Code) VALUES ('SAVINGS');
    DECLARE @SavingsId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[KontotypUebersetzung] (KontotypId, Sprache, Name) VALUES
        (@SavingsId, 'tr', N'Vadeli Hesap'), (@SavingsId, 'de', N'Sparkonto');
END
PRINT '  ✓ Kontotyp kayıtları eklendi';

PRINT '  ✓ Referans tabloları hazır';
GO

-- =============================================
-- 1. VEREINE (Dernekler)
-- =============================================

PRINT '1. Dernekler ekleniyor...';

-- Organizasyon kaydı (Verein.OrganizationId zorunlu)
DECLARE @DefaultLandesverbandId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE DeletedFlag = 0 AND OrgType = 'Landesverband' AND FederationCode = 'DITIB'
    ORDER BY Id
);
IF @DefaultLandesverbandId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Eyalet Birligi (Demo)', 'Landesverband', 'DITIB', NULL, 0, GETDATE(), 1, 1);
    SET @DefaultLandesverbandId = SCOPE_IDENTITY();
END

DECLARE @DefaultRegionId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE DeletedFlag = 0 AND OrgType = 'Region' AND FederationCode = 'DITIB'
    ORDER BY Id
);
IF @DefaultRegionId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Bolge (Demo)', 'Region', 'DITIB', @DefaultLandesverbandId, 0, GETDATE(), 1, 1);
    SET @DefaultRegionId = SCOPE_IDENTITY();
END

DECLARE @MunichOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'TÇ¬rkisch-Deutscher Kulturverein MÇ¬nchen'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @MunichOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'TÇ¬rkisch-Deutscher Kulturverein MÇ¬nchen', 'Verein', 'DITIB', @DefaultRegionId, 0, GETDATE(), 1, 1);
    SET @MunichOrgId = SCOPE_IDENTITY();
END

DECLARE @BerlinOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Deutsch-TÇ¬rkische Freundschaft Berlin'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @BerlinOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Deutsch-TÇ¬rkische Freundschaft Berlin', 'Verein', 'DITIB', @DefaultRegionId, 0, GETDATE(), 1, 1);
    SET @BerlinOrgId = SCOPE_IDENTITY();
END

IF NOT EXISTS (
    SELECT 1
    FROM [Verein].[Organization]
    WHERE Name = N'DITIB Dernek (Demo)' AND OrgType = 'Verein' AND FederationCode = 'DITIB' AND ParentOrganizationId = @DefaultRegionId
)
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Dernek (Demo)', 'Verein', 'DITIB', @DefaultRegionId, 0, GETDATE(), 1, 1);
    PRINT '  ? Demo Organization kaydi olusturuldu';
END

-- Önce adresleri ekle
INSERT INTO [Verein].[Adresse] (
    Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
    Aktiv, IstStandard, DeletedFlag, Created, CreatedBy
) VALUES
(
    N'Sonnenstraße', N'25', N'80331', N'München', N'Bayern', N'Deutschland',
    1, 1, 0, GETDATE(), 1
),
(
    N'Kurfürstendamm', N'156', N'10709', N'Berlin', N'Berlin', N'Deutschland',
    1, 1, 0, GETDATE(), 1
);

DECLARE @AdressMuenchen INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'80331' ORDER BY Id DESC);
DECLARE @AdressBerlin INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'10709' ORDER BY Id DESC);

-- Sonra dernekleri ekle
INSERT INTO [Verein].[Verein] (
    Name, Kurzname, Zweck, Telefon, Fax, Email, VertreterEmail, Webseite,
    Gruendungsdatum, Mitgliederzahl, Vereinsnummer, Steuernummer,
    Vorstandsvorsitzender, Geschaeftsfuehrer, Kontaktperson,
    SocialMediaLinks, OrganizationId, AdresseId,
    DeletedFlag, Created, CreatedBy
) VALUES
(
    N'Türkisch-Deutscher Kulturverein München',
    N'TDKV München',
    N'Kultureller Austausch und Integration in München',
    '+49 89 123456789',
    '+49 89 123456790',
    'info@tdkv-muenchen.de',
    'vorstand@tdkv-muenchen.de',
    'https://www.tdkv-muenchen.de',
    '1985-03-15',
    245,
    'VR 12345',
    '143/123/45678',
    N'Ahmet Yılmaz',
    N'Dr. Mehmet Öztürk',
    N'Fatma Özkan',
    N'{"facebook":"https://www.facebook.com/tdkv.muenchen","instagram":"https://www.instagram.com/tdkv_muenchen","twitter":"https://twitter.com/tdkv_muenchen","linkedin":"https://www.linkedin.com/company/tdkv-muenchen","youtube":"https://www.youtube.com/@tdkvmuenchen"}',
    @MunichOrgId,
    @AdressMuenchen,
    0,
    GETDATE(),
    1
),
(
    N'Deutsch-Türkische Freundschaft Berlin',
    N'DTF Berlin',
    N'Förderung der deutsch-türkischen Freundschaft',
    '+49 30 987654321',
    '+49 30 987654322',
    'kontakt@dtf-berlin.de',
    'info@dtf-berlin.de',
    'https://www.dtf-berlin.de',
    '1992-08-22',
    189,
    'VR 67890',
    '27/456/78901',
    'Mehmet Demir',
    N'Ayşe Yıldırım',
    N'Ayşe Kaya',
    N'{"facebook":"https://facebook.com/dtf.berlin","instagram":"https://instagram.com/dtf_berlin","linkedin":"https://linkedin.com/company/dtf-berlin"}',
    @BerlinOrgId,
    @AdressBerlin,
    0,
    GETDATE(),
    1
);

-- Adres VereinId'lerini güncelle
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressMuenchen) WHERE Id = @AdressMuenchen;
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressBerlin) WHERE Id = @AdressBerlin;

PRINT '  ✓ 2 Dernek eklendi';
GO

-- =============================================
-- 1.1 RECHTLICHE DATEN (Yasal Veriler)
-- =============================================

PRINT '1.1 Dernek yasal verileri ekleniyor...';

DECLARE @MuenchenVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');

IF NOT EXISTS (SELECT 1 FROM [Verein].[RechtlicheDaten] WHERE VereinId = @MuenchenVereinId)
BEGIN
    INSERT INTO [Verein].[RechtlicheDaten] (
        VereinId,
        RegistergerichtName, RegistergerichtNummer, RegistergerichtOrt, RegistergerichtEintragungsdatum,
        FinanzamtName, FinanzamtNummer, FinanzamtOrt,
        Steuerpflichtig, Steuerbefreit, GemeinnuetzigAnerkannt, GemeinnuetzigkeitBis,
        SteuererklaerungJahr,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (
        @MuenchenVereinId,
        N'Amtsgericht München',
        N'VR 12345',
        N'München',
        '1985-03-15',
        N'Finanzamt München',
        N'143/123/45678',
        N'München',
        0,
        1,
        1,
        '2025-12-31',
        2024,
        0,
        GETDATE(),
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Verein].[RechtlicheDaten] WHERE VereinId = @BerlinVereinId)
BEGIN
    INSERT INTO [Verein].[RechtlicheDaten] (
        VereinId,
        RegistergerichtName, RegistergerichtNummer, RegistergerichtOrt, RegistergerichtEintragungsdatum,
        FinanzamtName, FinanzamtNummer, FinanzamtOrt,
        Steuerpflichtig, Steuerbefreit, GemeinnuetzigAnerkannt, GemeinnuetzigkeitBis,
        SteuererklaerungJahr,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (
        @BerlinVereinId,
        N'Amtsgericht Charlottenburg',
        N'VR 67890',
        N'Berlin',
        '1992-08-22',
        N'Finanzamt Berlin-Charlottenburg',
        N'27/456/78901',
        N'Berlin',
        0,
        1,
        1,
        '2025-12-31',
        2024,
        0,
        GETDATE(),
        1
    );
END

PRINT '  ✓ 2 Dernek yasal verisi eklendi';
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

IF NOT EXISTS (SELECT 1 FROM [Mitglied].[Mitglied] WHERE Mitgliedsnummer IN ('M001','M002','M003','M004','M005','M006','B001','B002','B003','B004'))
BEGIN
-- München Derneği Üyeleri
-- NOT: Ahmet Yılmaz dernek başkanıdır, üye değildir - User tablosunda tanımlanacak
-- Aidat bilgileri: BeitragBetrag, BeitragWaehrungId (1=EUR), BeitragPeriodeCode, BeitragZahlungsTag, BeitragIstPflicht
DECLARE @EurWaehrungId INT = (SELECT TOP 1 Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');

INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    BeitragBetrag, BeitragWaehrungId, BeitragPeriodeCode, BeitragZahlungsTag, BeitragZahlungstagTypCode, BeitragIstPflicht,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    'M001',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Fatma',
    N'Özkan',
    @GeschlechtF,
    'fatma.ozkan@email.com',
    '+49 89 222222222',
    '1982-09-08',
    '2021-03-10',
    120.00,              -- BeitragBetrag: 120 EUR
    @EurWaehrungId,      -- BeitragWaehrungId: EUR
    'QUARTERLY',         -- BeitragPeriodeCode: Üç aylık
    15,                  -- BeitragZahlungsTag: Ayın 15'i
    'DAY_OF_MONTH',      -- BeitragZahlungstagTypCode
    1,                   -- BeitragIstPflicht: Evet
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
    'Can',
    'Schmidt',
    @GeschlechtM,
    'can.schmidt@email.com',
    '+49 89 333333333',
    '1990-12-03',
    '2022-06-20',
    60.00,               -- BeitragBetrag: 60 EUR
    @EurWaehrungId,      -- BeitragWaehrungId: EUR
    'MONTHLY',           -- BeitragPeriodeCode: Aylık
    1,                   -- BeitragZahlungsTag: Ayın 1'i
    'FIRST_DAY',         -- BeitragZahlungstagTypCode
    1,                   -- BeitragIstPflicht: Evet
    1,
    0,
    GETDATE(),
    1
);

-- Berlin Derneği Üyeleri
-- NOT: Mehmet Demir dernek başkanıdır, üye değildir - User tablosunda tanımlanacak
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    BeitragBetrag, BeitragWaehrungId, BeitragPeriodeCode, BeitragZahlungsTag, BeitragZahlungstagTypCode, BeitragIstPflicht,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @BerlinVereinId,
    'B001',
    @AktivStatusId,
    @VollmitgliedTypId,
    N'Ayşe',
    'Kaya',
    @GeschlechtF,
    'ayse.kaya@email.com',
    '+49 30 555555555',
    '1985-02-14',
    '2020-04-18',
    100.00,              -- BeitragBetrag: 100 EUR
    @EurWaehrungId,      -- BeitragWaehrungId: EUR
    'QUARTERLY',         -- BeitragPeriodeCode: Üç aylık
    1,                   -- BeitragZahlungsTag: Ayın 1'i
    'FIRST_DAY',         -- BeitragZahlungstagTypCode
    1,                   -- BeitragIstPflicht: Evet
    1,
    0,
    GETDATE(),
    1
);

-- Daha fazla München üyesi (farklı yaş grupları ve kayıt tarihleri)
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    BeitragBetrag, BeitragWaehrungId, BeitragPeriodeCode, BeitragZahlungsTag, BeitragZahlungstagTypCode, BeitragIstPflicht,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    'M003',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Zeynep',
    N'Yılmaz',
    @GeschlechtF,
    'zeynep.yilmaz@email.com',
    '+49 89 444444444',
    '2005-03-15',
    DATEADD(MONTH, -2, GETDATE()), -- 2 ay önce
    30.00, @EurWaehrungId, 'MONTHLY', 1, 'FIRST_DAY', 1,  -- Genç üye indirimi
    1,
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    'M004',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Emre',
    N'Koç',
    @GeschlechtM,
    'emre.koc@email.com',
    '+49 89 555555555',
    '1995-07-22',
    DATEADD(MONTH, -4, GETDATE()), -- 4 ay önce
    60.00, @EurWaehrungId, 'MONTHLY', 15, 'DAY_OF_MONTH', 1,
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
    'Selin',
    'Arslan',
    @GeschlechtF,
    'selin.arslan@email.com',
    '+49 89 666666666',
    '1988-11-30',
    DATEADD(MONTH, -6, GETDATE()), -- 6 ay önce
    240.00, @EurWaehrungId, 'YEARLY', 1, 'FIRST_DAY', 1,  -- Yıllık ödeme
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
    'Burak',
    N'Çelik',
    @GeschlechtM,
    'burak.celik@email.com',
    '+49 89 777777777',
    '1962-04-18',
    DATEADD(MONTH, -8, GETDATE()), -- 8 ay önce
    50.00, @EurWaehrungId, 'MONTHLY', NULL, 'LAST_DAY', 1,  -- Emekli indirimi
    1,
    0,
    GETDATE(),
    1
);

-- Daha fazla Berlin üyesi
INSERT INTO [Mitglied].[Mitglied] (
    VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
    Vorname, Nachname, GeschlechtId, Email, Telefon, Geburtsdatum, Eintrittsdatum,
    BeitragBetrag, BeitragWaehrungId, BeitragPeriodeCode, BeitragZahlungsTag, BeitragZahlungstagTypCode, BeitragIstPflicht,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    @BerlinVereinId,
    'B002',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Deniz',
    N'Şahin',
    @GeschlechtM,
    'deniz.sahin@email.com',
    '+49 30 666666666',
    '2008-09-12',
    DATEADD(MONTH, -3, GETDATE()), -- 3 ay önce
    25.00, @EurWaehrungId, 'MONTHLY', 1, 'FIRST_DAY', 1,  -- Genç üye indirimi
    1,
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    'B003',
    @AktivStatusId,
    @VollmitgliedTypId,
    'Ece',
    N'Yıldız',
    @GeschlechtF,
    'ece.yildiz@email.com',
    '+49 30 777777777',
    '1978-06-25',
    DATEADD(MONTH, -5, GETDATE()), -- 5 ay önce
    100.00, @EurWaehrungId, 'QUARTERLY', 15, 'DAY_OF_MONTH', 1,
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
    'Kerem',
    N'Öztürk',
    @GeschlechtM,
    'kerem.ozturk@email.com',
    '+49 30 888888888',
    '1992-01-08',
    DATEADD(MONTH, -7, GETDATE()), -- 7 ay önce
    50.00, @EurWaehrungId, 'MONTHLY', 10, 'DAY_OF_MONTH', 1,
    1,
    0,
    GETDATE(),
    1
);

END
ELSE
BEGIN
    PRINT '  ? Üye verileri zaten mevcut - atlandı';
END

PRINT '  ✓ 10 Üye eklendi (6 München, 4 Berlin)';
GO

-- =============================================
-- 2b. MEVCUT ÜYELERİN AİDAT BİLGİLERİNİ GÜNCELLE
-- =============================================
-- Bu bölüm, daha önce aidat bilgisi olmadan eklenen üyeleri günceller

PRINT '2b. Mevcut üyelerin aidat bilgileri güncelleniyor...';

DECLARE @EurWaehrungIdUpd INT = (SELECT TOP 1 Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');

-- München üyelerini güncelle
UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 120.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'QUARTERLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M001' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 60.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 1,
    BeitragZahlungstagTypCode = 'FIRST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M002' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 30.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 1,
    BeitragZahlungstagTypCode = 'FIRST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M003' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 60.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M004' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 240.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'YEARLY',
    BeitragZahlungsTag = 1,
    BeitragZahlungstagTypCode = 'FIRST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M005' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 50.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = NULL,
    BeitragZahlungstagTypCode = 'LAST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M006' AND BeitragBetrag IS NULL;

-- Aile üyeleri için aidat bilgileri
UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 120.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'QUARTERLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'M008' AND BeitragBetrag IS NULL;  -- Mehmet Özkan

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 20.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 0
WHERE Mitgliedsnummer = 'M009' AND BeitragBetrag IS NULL;  -- Ali Özkan (çocuk)

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 20.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 0
WHERE Mitgliedsnummer = 'M010' AND BeitragBetrag IS NULL;  -- Elif Özkan (çocuk)

-- Berlin üyelerini güncelle
UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 100.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'QUARTERLY',
    BeitragZahlungsTag = 1,
    BeitragZahlungstagTypCode = 'FIRST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'B001' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 25.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 1,
    BeitragZahlungstagTypCode = 'FIRST_DAY',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'B002' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 100.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'QUARTERLY',
    BeitragZahlungsTag = 15,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'B003' AND BeitragBetrag IS NULL;

UPDATE [Mitglied].[Mitglied]
SET BeitragBetrag = 50.00,
    BeitragWaehrungId = @EurWaehrungIdUpd,
    BeitragPeriodeCode = 'MONTHLY',
    BeitragZahlungsTag = 10,
    BeitragZahlungstagTypCode = 'DAY_OF_MONTH',
    BeitragIstPflicht = 1
WHERE Mitgliedsnummer = 'B004' AND BeitragBetrag IS NULL;

PRINT '  ✓ Mevcut üyelerin aidat bilgileri güncellendi';
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
    IstWiederholend, WiederholungTyp, WiederholungInterval, WiederholungEnde, WiederholungTage,
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
    0, NULL, NULL, NULL, NULL, -- Tekrar etmiyor
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
    0, NULL, NULL, NULL, NULL, -- Tekrar etmiyor
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
    1, 'weekly', 1, DATEADD(MONTH, 6, GETDATE()), 'Mon,Wed,Fri', -- Her hafta Pzt, Çar, Cum
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
    1, 'monthly', 1, DATEADD(YEAR, 1, GETDATE()), NULL, -- Her ay
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
    1, 'weekly', 2, DATEADD(MONTH, 3, GETDATE()), 'Fri', -- Her 2 haftada bir Cuma
    0,
    GETDATE(),
    1
);

-- Berlin Derneği Etkinlikleri
INSERT INTO [Verein].[Veranstaltung] (
    VereinId, Titel, Beschreibung, Beginn, Ende, Preis,
    AnmeldeErforderlich, NurFuerMitglieder,
    IstWiederholend, WiederholungTyp, WiederholungInterval, WiederholungEnde, WiederholungTage,
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
    0, NULL, NULL, NULL, NULL, -- Tekrar etmiyor (geçmiş etkinlik)
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
    1, 'daily', 1, DATEADD(DAY, 75, GETDATE()), NULL, -- Her gün (Ramazan boyunca)
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
    1, 'weekly', 1, DATEADD(MONTH, 4, GETDATE()), 'Sat', -- Her hafta Cumartesi
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
    1, 'weekly', 2, DATEADD(MONTH, 6, GETDATE()), 'Sat', -- Her 2 haftada bir Cumartesi
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
    1, 'yearly', 1, NULL, NULL, -- Her yıl (süresiz)
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 10 Etkinlik eklendi (5 München, 5 Berlin)';
GO

-- =============================================
-- 3.1. ETKİNLİK KAYITLARI (VeranstaltungAnmeldung)
-- =============================================

PRINT '3.1. Etkinlik kayıtları ekleniyor...';

-- Dernek ID'lerini al
DECLARE @MuenchenVereinIdAnm INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = 'TDKV München');
DECLARE @BerlinVereinIdAnm INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = 'DTF Berlin');

-- Etkinlik ID'lerini al (veritabanında mevcut etkinlik başlıklarını kullan)
DECLARE @VeranstaltungMuenchen1 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @MuenchenVereinIdAnm AND Titel = N'Türkischer Kulturabend' ORDER BY Id);
DECLARE @VeranstaltungMuenchen2 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @MuenchenVereinIdAnm AND Titel = N'Kinder-Sprachkurs Türkisch' ORDER BY Id);
DECLARE @VeranstaltungBerlin1 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @BerlinVereinIdAnm AND Titel = N'Türkisch-Deutsche Kochkurs' ORDER BY Id);
DECLARE @VeranstaltungBerlin2 INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE VereinId = @BerlinVereinIdAnm AND Titel = N'Integrationsseminar' ORDER BY Id);

-- Üye ID'lerini al
DECLARE @FatmaId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com' ORDER BY Id);
DECLARE @AyseId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ayse.kaya@email.com' ORDER BY Id);
DECLARE @CanId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'can.yildirim@email.com' ORDER BY Id);
DECLARE @ZeynepId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'zeynep.arslan@email.com' ORDER BY Id);

-- Ödeme durumu ID'lerini al
DECLARE @ZahlungBezahlt INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'BEZAHLT');
DECLARE @ZahlungOffen INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'OFFEN');
DECLARE @WaehrungEUR INT = (SELECT TOP 1 Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');

-- München Etkinlik Kayıtları
INSERT INTO [Verein].[VeranstaltungAnmeldung] (
    VeranstaltungId, MitgliedId, Name, Email, Telefon, Status, Bemerkung,
    Preis, WaehrungId, ZahlungStatusId,
    DeletedFlag, Aktiv, Created, CreatedBy
) VALUES
-- Türkischer Kulturabend kayıtları
(@VeranstaltungMuenchen1, @FatmaId, N'Fatma Özkan', 'fatma.ozkan@email.com', '+49 89 12345678', 'BESTAETIGT', N'Ailesiyle birlikte gelecek', 25.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),
(@VeranstaltungMuenchen1, @CanId, N'Can Yıldırım', 'can.yildirim@email.com', '+49 89 23456789', 'BESTAETIGT', NULL, 25.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),
(@VeranstaltungMuenchen1, NULL, N'Ahmet Yılmaz', 'ahmet.yilmaz@email.com', '+49 89 11111111', 'BESTAETIGT', N'Dernek başkanı', 0.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),

-- Kinder-Sprachkurs Türkisch kayıtları
(@VeranstaltungMuenchen2, @FatmaId, N'Fatma Özkan', 'fatma.ozkan@email.com', '+49 89 12345678', 'BESTAETIGT', N'Çocuğu için kayıt', 5.00, @WaehrungEUR, @ZahlungOffen, 0, 1, GETDATE(), 1),
(@VeranstaltungMuenchen2, NULL, N'Emine Şahin', 'emine.sahin@email.com', '+49 89 99999999', 'WARTELISTE', N'Kurs dolu, bekleme listesinde', 5.00, @WaehrungEUR, @ZahlungOffen, 0, 1, GETDATE(), 1);

-- Berlin Etkinlik Kayıtları
INSERT INTO [Verein].[VeranstaltungAnmeldung] (
    VeranstaltungId, MitgliedId, Name, Email, Telefon, Status, Bemerkung,
    Preis, WaehrungId, ZahlungStatusId,
    DeletedFlag, Aktiv, Created, CreatedBy
) VALUES
-- Türkisch-Deutsche Kochkurs kayıtları
(@VeranstaltungBerlin1, @AyseId, N'Ayşe Kaya', 'ayse.kaya@email.com', '+49 30 12345678', 'BESTAETIGT', NULL, 20.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),
(@VeranstaltungBerlin1, @ZeynepId, N'Zeynep Arslan', 'zeynep.arslan@email.com', '+49 30 23456789', 'BESTAETIGT', NULL, 20.00, @WaehrungEUR, @ZahlungOffen, 0, 1, GETDATE(), 1),
(@VeranstaltungBerlin1, NULL, N'Mehmet Demir', 'mehmet.demir@email.com', '+49 30 11111111', 'BESTAETIGT', N'Dernek başkanı', 0.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),

-- Integrationsseminar kayıtları
(@VeranstaltungBerlin2, @AyseId, N'Ayşe Kaya', 'ayse.kaya@email.com', '+49 30 12345678', 'BESTAETIGT', NULL, 0.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1),
(@VeranstaltungBerlin2, NULL, N'Hasan Öztürk', 'hasan.ozturk@email.com', '+49 30 88888888', 'BESTAETIGT', NULL, 0.00, @WaehrungEUR, @ZahlungBezahlt, 0, 1, GETDATE(), 1);

PRINT '  ✓ 10 Etkinlik kaydı eklendi (5 München, 5 Berlin)';
GO

-- =============================================
-- 3.2. ETKİNLİK RESİMLERİ (VeranstaltungBild)
-- =============================================

PRINT '3.2. Etkinlik resimleri ekleniyor...';

-- Etkinlik ID'lerini al (veritabanında mevcut etkinlik başlıklarını kullan)
DECLARE @VeranstaltungMuenchen1Bild INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE Titel = N'Türkischer Kulturabend' ORDER BY Id);
DECLARE @VeranstaltungMuenchen2Bild INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE Titel = N'Kinder-Sprachkurs Türkisch' ORDER BY Id);
DECLARE @VeranstaltungBerlin1Bild INT = (SELECT TOP 1 Id FROM [Verein].[Veranstaltung] WHERE Titel = N'Türkisch-Deutsche Kochkurs' ORDER BY Id);

-- München Etkinlik Resimleri
INSERT INTO [Verein].[VeranstaltungBild] (
    VeranstaltungId, BildPfad, Titel, Reihenfolge,
    DeletedFlag, Created, CreatedBy
) VALUES
(@VeranstaltungMuenchen1Bild, '/images/events/kulturabend-1.jpg', N'Türkischer Kulturabend - Ana Görsel', 1, 0, GETDATE(), 1),
(@VeranstaltungMuenchen1Bild, '/images/events/kulturabend-2.jpg', N'Türk Yemekleri', 2, 0, GETDATE(), 1),
(@VeranstaltungMuenchen1Bild, '/images/events/kulturabend-3.jpg', N'Müzik Gösterisi', 3, 0, GETDATE(), 1),

(@VeranstaltungMuenchen2Bild, '/images/events/sprachkurs-1.jpg', N'Kinder-Sprachkurs - Sınıf', 1, 0, GETDATE(), 1),
(@VeranstaltungMuenchen2Bild, '/images/events/sprachkurs-2.jpg', N'Çocuklar Türkçe Öğreniyor', 2, 0, GETDATE(), 1);

-- Berlin Etkinlik Resimleri
INSERT INTO [Verein].[VeranstaltungBild] (
    VeranstaltungId, BildPfad, Titel, Reihenfolge,
    DeletedFlag, Created, CreatedBy
) VALUES
(@VeranstaltungBerlin1Bild, '/images/events/kochkurs-1.jpg', N'Kochkurs - Ana Görsel', 1, 0, GETDATE(), 1),
(@VeranstaltungBerlin1Bild, '/images/events/kochkurs-2.jpg', N'Yemek Hazırlığı', 2, 0, GETDATE(), 1),
(@VeranstaltungBerlin1Bild, '/images/events/kochkurs-3.jpg', N'Hazır Yemekler', 3, 0, GETDATE(), 1);

PRINT '  ✓ 8 Etkinlik resmi eklendi (5 München, 3 Berlin)';
GO

-- =============================================
-- 3.3. ÜYE ADRESLERİ (MitgliedAdresse)
-- =============================================

PRINT '3.3. Üye adresleri ekleniyor...';

-- Üye ID'lerini al
DECLARE @FatmaIdAddr INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com' ORDER BY Id);
DECLARE @AyseIdAddr INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ayse.kaya@email.com' ORDER BY Id);
DECLARE @CanIdAddr INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'can.yildirim@email.com' ORDER BY Id);
DECLARE @ZeynepIdAddr INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'zeynep.arslan@email.com' ORDER BY Id);
DECLARE @EmreIdAddr INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'emre.celik@email.com' ORDER BY Id);

-- Adres tipi ID'sini al
DECLARE @AdresseTypHome INT = (SELECT TOP 1 Id FROM [Keytable].[AdresseTyp] WHERE Code = 'HOME');

-- Üye Adresleri (sadece geçerli ID'ler varsa)
IF @FatmaIdAddr IS NOT NULL AND @AdresseTypHome IS NOT NULL
BEGIN
    INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
        Telefonnummer, EMail, IstStandard, GueltigVon,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@FatmaIdAddr, @AdresseTypHome, N'Leopoldstraße', N'45', N'80802', N'München', N'Bayern', N'Deutschland', '+49 89 12345678', 'fatma.ozkan@email.com', 1, '2020-01-15', 0, GETDATE(), 1);
END

IF @CanIdAddr IS NOT NULL AND @AdresseTypHome IS NOT NULL
BEGIN
    INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
        Telefonnummer, EMail, IstStandard, GueltigVon,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@CanIdAddr, @AdresseTypHome, N'Maximilianstraße', N'12', N'80539', N'München', N'Bayern', N'Deutschland', '+49 89 23456789', 'can.yildirim@email.com', 1, '2019-03-20', 0, GETDATE(), 1);
END

IF @EmreIdAddr IS NOT NULL AND @AdresseTypHome IS NOT NULL
BEGIN
    INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
        Telefonnummer, EMail, IstStandard, GueltigVon,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@EmreIdAddr, @AdresseTypHome, N'Sendlinger Straße', N'78', N'80331', N'München', N'Bayern', N'Deutschland', '+49 89 34567890', 'emre.celik@email.com', 1, '2021-06-10', 0, GETDATE(), 1);
END

IF @AyseIdAddr IS NOT NULL AND @AdresseTypHome IS NOT NULL
BEGIN
    INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
        Telefonnummer, EMail, IstStandard, GueltigVon,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@AyseIdAddr, @AdresseTypHome, N'Friedrichstraße', N'123', N'10117', N'Berlin', N'Berlin', N'Deutschland', '+49 30 12345678', 'ayse.kaya@email.com', 1, '2018-09-01', 0, GETDATE(), 1);
END

IF @ZeynepIdAddr IS NOT NULL AND @AdresseTypHome IS NOT NULL
BEGIN
    INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
        Telefonnummer, EMail, IstStandard, GueltigVon,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@ZeynepIdAddr, @AdresseTypHome, N'Unter den Linden', N'56', N'10117', N'Berlin', N'Berlin', N'Deutschland', '+49 30 23456789', 'zeynep.arslan@email.com', 1, '2020-11-15', 0, GETDATE(), 1);
END

PRINT '  ✓ 5 Üye adresi eklendi (3 München, 2 Berlin)';
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
-- NOT: Ahmet Yılmaz ve Mehmet Demir üye değil, bu yüzden alacakları yok

-- München Üyeleri
DECLARE @FatmaId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com');
DECLARE @CanId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'can.schmidt@email.com');
DECLARE @ZeynepId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'zeynep.yilmaz@email.com');
DECLARE @EmreId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'emre.koc@email.com');
DECLARE @SelinId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'selin.arslan@email.com');
DECLARE @BurakId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'burak.celik@email.com');

-- Berlin Üyeleri
DECLARE @AyseId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ayse.kaya@email.com');
DECLARE @DenizId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'deniz.sahin@email.com');
DECLARE @EceId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ece.yildiz@email.com');
DECLARE @KeremId INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'kerem.ozturk@email.com');

-- ZahlungTypId: 1 = Mitgliedsbeitrag (Keytable.ZahlungTyp)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = OFFEN (Keytable.ZahlungStatus)
INSERT INTO [Finanz].[MitgliedForderung] (
    VereinId, MitgliedId, ZahlungTypId, Forderungsnummer, Betrag, WaehrungId, Faelligkeit,
    Beschreibung, Jahr, Quartal, Monat, StatusId,
    DeletedFlag, Created, CreatedBy
) VALUES
-- München alacakları - Q4 2025 (Ekim-Kasım-Aralık dönemi)
-- Fatma: 15 Aralık 2025 vadeli (BeitragZahlungsTag=15 ile uyumlu)
(@MuenchenVereinId, @FatmaId, 1, 'F-2025-001', 120.00, 1, '2025-12-15', N'Mitgliedsbeitrag Q4 2025', 2025, 4, 12, 2, 0, GETDATE(), 1),
-- Can: 5 gün önce vadesi geçmiş
(@MuenchenVereinId, @CanId, 1, 'F-2025-002', 120.00, 1, DATEADD(DAY, -5, GETDATE()), N'Mitgliedsbeitrag Q4 2025', 2025, 4, 12, 2, 0, GETDATE(), 1),
-- Berlin alacakları - Q4 2025
(@BerlinVereinId, @AyseId, 1, 'F-2025-101', 100.00, 1, DATEADD(DAY, 10, GETDATE()), N'Mitgliedsbeitrag Q4 2025', 2025, 4, 12, 2, 0, GETDATE(), 1);

DECLARE @Forderung1Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedForderung] WHERE Forderungsnummer = 'F-2025-001');
DECLARE @Forderung2Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedForderung] WHERE Forderungsnummer = 'F-2025-002');
DECLARE @Forderung101Id INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedForderung] WHERE Forderungsnummer = 'F-2025-101');

PRINT '  ✓ 3 Üye alacağı eklendi (Dernek yöneticileri üye değil)';

-- Üye ödemeleri ekle (MitgliedZahlung)
-- ZahlungTypId: 1 = MITGLIEDSBEITRAG, 2 = SPENDE, 3 = VERANSTALTUNG (Keytable.ZahlungTyp)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = OFFEN (Keytable.ZahlungStatus)
-- Zahlungsweg: BAR (Nakit), UEBERWEISUNG (Havale), LASTSCHRIFT (Otomatik Ödeme)

-- ZahlungTyp ID'lerini al
DECLARE @ZTypMitgliedsbeitrag INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'MITGLIEDSBEITRAG');
DECLARE @ZTypSpende INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'SPENDE');
DECLARE @ZTypVeranstaltung INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'VERANSTALTUNG');

INSERT INTO [Finanz].[MitgliedZahlung] (
    VereinId, MitgliedId, ZahlungTypId, Betrag, WaehrungId, Zahlungsdatum, Zahlungsweg,
    BankkontoId, Bemerkung, StatusId,
    DeletedFlag, Created, CreatedBy
) VALUES
-- ============================================================================
-- MÜNCHEN ÜYE ÖDEMELERİ
-- ============================================================================
-- Fatma Özkan - Üyelik Aidatı (Kısmi, Nakit) - Banka bilgisi gereksiz
(@MuenchenVereinId, @FatmaId, @ZTypMitgliedsbeitrag, 50.00, 1, DATEADD(DAY, -10, GETDATE()), 'BAR', NULL, N'Teilzahlung - Üyelik aidatı kısmi ödeme', 2, 0, GETDATE(), 1),
-- Fatma Özkan - Bağış (Havale) - Banka bilgisi gerekli
(@MuenchenVereinId, @FatmaId, @ZTypSpende, 100.00, 1, DATEADD(DAY, -25, GETDATE()), 'UEBERWEISUNG', @MuenchenBankkontoId, N'Ramazan Bağışı', 1, 0, GETDATE(), 1),

-- Can Schmidt - Üyelik Aidatı (Tam, Otomatik Ödeme) - Banka bilgisi gerekli
(@MuenchenVereinId, @CanId, @ZTypMitgliedsbeitrag, 60.00, 1, DATEADD(DAY, -5, GETDATE()), 'LASTSCHRIFT', @MuenchenBankkontoId, N'Monatlicher Beitrag - Aylık aidat', 1, 0, GETDATE(), 1),
-- Can Schmidt - Etkinlik Ödemesi (Nakit) - Banka bilgisi gereksiz
(@MuenchenVereinId, @CanId, @ZTypVeranstaltung, 25.00, 1, DATEADD(DAY, -15, GETDATE()), 'BAR', NULL, N'Kültür Gecesi Bilet', 1, 0, GETDATE(), 1),

-- Zeynep Yılmaz - Üyelik Aidatı (Havale) - Banka bilgisi gerekli
(@MuenchenVereinId, @ZeynepId, @ZTypMitgliedsbeitrag, 30.00, 1, DATEADD(DAY, -3, GETDATE()), 'UEBERWEISUNG', @MuenchenBankkontoId, N'Genç üye aidatı', 1, 0, GETDATE(), 1),

-- Emre Koç - Üyelik Aidatı (Otomatik Ödeme) - Banka bilgisi gerekli
(@MuenchenVereinId, @EmreId, @ZTypMitgliedsbeitrag, 60.00, 1, DATEADD(DAY, -8, GETDATE()), 'LASTSCHRIFT', @MuenchenBankkontoId, N'Monatlicher Beitrag', 1, 0, GETDATE(), 1),
-- Emre Koç - Bağış (Nakit) - Banka bilgisi gereksiz
(@MuenchenVereinId, @EmreId, @ZTypSpende, 50.00, 1, DATEADD(DAY, -20, GETDATE()), 'BAR', NULL, N'Kurban Bağışı', 1, 0, GETDATE(), 1),

-- Selin Arslan - Üyelik Aidatı (Yıllık, Havale) - Banka bilgisi gerekli
(@MuenchenVereinId, @SelinId, @ZTypMitgliedsbeitrag, 240.00, 1, DATEADD(DAY, -45, GETDATE()), 'UEBERWEISUNG', @MuenchenBankkontoId, N'Yıllık üyelik aidatı', 1, 0, GETDATE(), 1),

-- Burak Çelik - Üyelik Aidatı (Emekli indirimi, Nakit) - Banka bilgisi gereksiz
(@MuenchenVereinId, @BurakId, @ZTypMitgliedsbeitrag, 50.00, 1, DATEADD(DAY, -12, GETDATE()), 'BAR', NULL, N'Emekli üye aidatı', 1, 0, GETDATE(), 1),

-- ============================================================================
-- BERLİN ÜYE ÖDEMELERİ
-- ============================================================================
-- Ayşe Kaya - Üyelik Aidatı (Üç aylık, Havale) - Banka bilgisi gerekli
(@BerlinVereinId, @AyseId, @ZTypMitgliedsbeitrag, 100.00, 1, DATEADD(DAY, -7, GETDATE()), 'UEBERWEISUNG', @BerlinBankkontoId, N'Quartalsbeitrag - Üç aylık aidat', 1, 0, GETDATE(), 1),
-- Ayşe Kaya - Bağış (Nakit) - Banka bilgisi gereksiz
(@BerlinVereinId, @AyseId, @ZTypSpende, 200.00, 1, DATEADD(DAY, -30, GETDATE()), 'BAR', NULL, N'Cami yapımına bağış', 1, 0, GETDATE(), 1),

-- Deniz Şahin - Üyelik Aidatı (Genç üye, Otomatik Ödeme) - Banka bilgisi gerekli
(@BerlinVereinId, @DenizId, @ZTypMitgliedsbeitrag, 25.00, 1, DATEADD(DAY, -4, GETDATE()), 'LASTSCHRIFT', @BerlinBankkontoId, N'Genç üye aidatı', 1, 0, GETDATE(), 1),

-- Ece Yıldız - Üyelik Aidatı (Üç aylık, Havale) - Banka bilgisi gerekli
(@BerlinVereinId, @EceId, @ZTypMitgliedsbeitrag, 100.00, 1, DATEADD(DAY, -14, GETDATE()), 'UEBERWEISUNG', @BerlinBankkontoId, N'Quartalsbeitrag', 1, 0, GETDATE(), 1),
-- Ece Yıldız - Etkinlik Ödemesi (Havale) - Banka bilgisi gerekli
(@BerlinVereinId, @EceId, @ZTypVeranstaltung, 30.00, 1, DATEADD(DAY, -21, GETDATE()), 'UEBERWEISUNG', @BerlinBankkontoId, N'Konser Bilet', 1, 0, GETDATE(), 1),
-- Ece Yıldız - Bağış (Nakit) - Banka bilgisi gereksiz
(@BerlinVereinId, @EceId, @ZTypSpende, 75.00, 1, DATEADD(DAY, -35, GETDATE()), 'BAR', NULL, N'Genel bağış', 1, 0, GETDATE(), 1),

-- Kerem Öztürk - Üyelik Aidatı (Aylık, Nakit) - Banka bilgisi gereksiz
(@BerlinVereinId, @KeremId, @ZTypMitgliedsbeitrag, 50.00, 1, DATEADD(DAY, -6, GETDATE()), 'BAR', NULL, N'Monatlicher Beitrag', 1, 0, GETDATE(), 1),
-- Kerem Öztürk - Etkinlik Ödemesi (Otomatik Ödeme) - Banka bilgisi gerekli
(@BerlinVereinId, @KeremId, @ZTypVeranstaltung, 15.00, 1, DATEADD(DAY, -18, GETDATE()), 'LASTSCHRIFT', @BerlinBankkontoId, N'Workshop Katılım', 1, 0, GETDATE(), 1);

PRINT '  ✓ 17 Üye ödemesi eklendi (Farklı ödeme tipleri ve yöntemleri ile)';
PRINT '    - MITGLIEDSBEITRAG (Üyelik Aidatı): 9 ödeme';
PRINT '    - SPENDE (Bağış): 5 ödeme';
PRINT '    - VERANSTALTUNG (Etkinlik): 3 ödeme';
PRINT '    - BAR (Nakit): 7 ödeme';
PRINT '    - UEBERWEISUNG (Havale): 6 ödeme';
PRINT '    - LASTSCHRIFT (Otomatik): 4 ödeme';

-- Ödeme-Alacak eşleştirmeleri (MitgliedForderungZahlung)
-- Fatma'nın ödemesi ile alacağını eşleştir (kısmi ödeme)
DECLARE @ZahlungFatmaId INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @FatmaId AND Betrag = 50.00);

IF @Forderung1Id IS NOT NULL AND @ZahlungFatmaId IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedForderungZahlung] (
        ForderungId, ZahlungId, Betrag,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@Forderung1Id, @ZahlungFatmaId, 50.00, 0, GETDATE(), 1);
END

PRINT '  ✓ 1 Ödeme-Alacak eşleştirmesi eklendi (Fatma - kısmi ödeme)';

-- Ön ödemeler (MitgliedVorauszahlung)
-- NOT: Fatma'nın 50 EUR ödemesi zaten alacağına eşleştirildi
-- Ön ödeme için ayrı bir ödeme kaydı gerekir, şimdilik yok
-- (Bir ödeme hem alacağa eşleştirilemez hem de ön ödeme olamaz)

PRINT '  ✓ 0 Ön ödeme eklendi (Fatma ödemesi alacağa eşleştirildi)';

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
    (@VeranstaltungBerlin1, @AnmeldungBerlin2, 'Ayşe Kaya', 'ayse.kaya@email.com', 20.00, 1, GETDATE(), 'OFFEN', 2, 0, GETDATE(), 1);
END

PRINT '  ✓ 4 Etkinlik ödemesi eklendi';

-- Dernek DITIB ödemeleri (VereinDitibZahlung)
-- WaehrungId: 1 = EUR (Keytable.Waehrung)
-- StatusId: 1 = BEZAHLT, 2 = OFFEN (Keytable.ZahlungStatus)
INSERT INTO [Finanz].[VereinDitibZahlung] (
    VereinId, Betrag, WaehrungId, Zahlungsdatum, Zahlungsperiode,
    Zahlungsweg, BankkontoId, Referenz, Bemerkung, StatusId,
    DeletedFlag, Created, CreatedBy
) VALUES
-- München DITIB ödemeleri (son 6 ay)
(@MuenchenVereinId, 500.00, 1, DATEADD(MONTH, -5, GETDATE()), FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-06', N'Monatliche DITIB Zahlung - Juni 2024', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, 500.00, 1, DATEADD(MONTH, -4, GETDATE()), FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-07', N'Monatliche DITIB Zahlung - Juli 2024', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, 500.00, 1, DATEADD(MONTH, -3, GETDATE()), FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-08', N'Monatliche DITIB Zahlung - August 2024', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, 500.00, 1, DATEADD(MONTH, -2, GETDATE()), FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-09', N'Monatliche DITIB Zahlung - September 2024', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, 500.00, 1, DATEADD(MONTH, -1, GETDATE()), FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-10', N'Monatliche DITIB Zahlung - Oktober 2024', 1, 0, GETDATE(), 1),
(@MuenchenVereinId, 500.00, 1, GETDATE(), FORMAT(GETDATE(), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-11', N'Monatliche DITIB Zahlung - November 2024', 2, 0, GETDATE(), 1),

-- Berlin DITIB ödemeleri (son 6 ay)
(@BerlinVereinId, 450.00, 1, DATEADD(MONTH, -5, GETDATE()), FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-06', N'Monatliche DITIB Zahlung - Juni 2024', 1, 0, GETDATE(), 1),
(@BerlinVereinId, 450.00, 1, DATEADD(MONTH, -4, GETDATE()), FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-07', N'Monatliche DITIB Zahlung - Juli 2024', 1, 0, GETDATE(), 1),
(@BerlinVereinId, 450.00, 1, DATEADD(MONTH, -3, GETDATE()), FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-08', N'Monatliche DITIB Zahlung - August 2024', 1, 0, GETDATE(), 1),
(@BerlinVereinId, 450.00, 1, DATEADD(MONTH, -2, GETDATE()), FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-09', N'Monatliche DITIB Zahlung - September 2024', 1, 0, GETDATE(), 1),
(@BerlinVereinId, 450.00, 1, DATEADD(MONTH, -1, GETDATE()), FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-10', N'Monatliche DITIB Zahlung - Oktober 2024', 1, 0, GETDATE(), 1),
(@BerlinVereinId, 450.00, 1, GETDATE(), FORMAT(GETDATE(), 'yyyy-MM'), 'UEBERWEISUNG', NULL, 'DITIB-2024-11', N'Monatliche DITIB Zahlung - November 2024', 2, 0, GETDATE(), 1);

PRINT '  ✓ 12 DITIB ödemesi eklendi (München: 6, Berlin: 6)';

-- Forderung'ları güncelle (BezahltAm)
UPDATE [Finanz].[MitgliedForderung]
SET BezahltAm = DATEADD(DAY, -15, GETDATE())
WHERE Forderungsnummer = 'F-2025-001';

UPDATE [Finanz].[MitgliedForderung]
SET BezahltAm = DATEADD(DAY, -20, GETDATE())
WHERE Forderungsnummer = 'F-2025-101';

-- =============================================
-- 5.1. ÜYE AVANS ÖDEMELERİ (MitgliedVorauszahlung)
-- =============================================

PRINT '5.1. Üye avans ödemeleri ekleniyor...';

-- Üye ve ödeme ID'lerini al
DECLARE @CanIdVor INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'can.yildirim@email.com' ORDER BY Id);
DECLARE @CanVereinId INT = (SELECT TOP 1 VereinId FROM [Mitglied].[Mitglied] WHERE Email = 'can.yildirim@email.com' ORDER BY Id);
DECLARE @EmreIdVor INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'emre.celik@email.com' ORDER BY Id);
DECLARE @EmreVereinId INT = (SELECT TOP 1 VereinId FROM [Mitglied].[Mitglied] WHERE Email = 'emre.celik@email.com' ORDER BY Id);

-- Ödeme ID'lerini al (MitgliedZahlung'dan)
DECLARE @CanZahlungId INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @CanIdVor ORDER BY Id);
DECLARE @EmreZahlungId INT = (SELECT TOP 1 Id FROM [Finanz].[MitgliedZahlung] WHERE MitgliedId = @EmreIdVor ORDER BY Id);

DECLARE @WaehrungEURVor INT = (SELECT TOP 1 Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');

-- Avans ödemeleri ekle (sadece geçerli ödeme ID'leri varsa)
IF @CanZahlungId IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedVorauszahlung] (
        VereinId, MitgliedId, ZahlungId, Betrag, WaehrungId, Beschreibung,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@CanVereinId, @CanIdVor, @CanZahlungId, 50.00, @WaehrungEURVor, N'2025 yılı için avans ödeme', 0, GETDATE(), 1);
    PRINT '  ✓ Can Yıldırım için avans ödeme eklendi';
END

IF @EmreZahlungId IS NOT NULL
BEGIN
    INSERT INTO [Finanz].[MitgliedVorauszahlung] (
        VereinId, MitgliedId, ZahlungId, Betrag, WaehrungId, Beschreibung,
        DeletedFlag, Created, CreatedBy
    ) VALUES
    (@EmreVereinId, @EmreIdVor, @EmreZahlungId, 30.00, @WaehrungEURVor, N'Gelecek dönem için ön ödeme', 0, GETDATE(), 1);
    PRINT '  ✓ Emre Çelik için avans ödeme eklendi';
END

PRINT '  ✓ Üye avans ödemeleri tamamlandı';

-- =============================================
-- 5.2. KASA DEFTERİ VE HESAP PLANI (Kassenbuch & FiBuKonto)
-- =============================================

PRINT '5.2. Kasa defteri ve hesap planı demo verileri ekleniyor...';

-- FiBu hesap planı kayıtları (varsa ekleme atlanır)
IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '1000')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '1000', N'Kasse', N'Kasa', 'KASSE', 'EIN_AUSG', 'A', N'Ideeller Bereich',
        1, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '1200')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '1200', N'Bank', N'Banka', 'BANK', 'EIN_AUSG', 'A', N'Ideeller Bereich',
        2, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '2000')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '2000', N'Mitgliedsbeiträge', N'Üyelik aidat gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'A', N'Ideeller Bereich',
        10, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '2100')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '2100', N'Spenden', N'Bağış gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'A', N'Ideeller Bereich',
        11, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '3000')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '3000', N'Raummiete', N'Kira giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', N'Ideeller Bereich',
        20, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '3100')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '3100', N'Veranstaltungskosten', N'Etkinlik giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', N'Ideeller Bereich',
        21, 1, 0, GETDATE(), 1
    );
END

IF NOT EXISTS (SELECT 1 FROM [Finanz].[FiBuKonto] WHERE Nummer = '4200')
BEGIN
    INSERT INTO [Finanz].[FiBuKonto] (
        Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName,
        Reihenfolge, IsAktiv, DeletedFlag, Created, CreatedBy
    ) VALUES (
        '4200', N'Veranstaltungserlöse', N'Etkinlik gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'A', N'Ideeller Bereich',
        30, 1, 0, GETDATE(), 1
    );
END

-- MÜNCHEN için 2026 Kassenbuch verilerini temizle ve ekle
DELETE FROM [Finanz].[Kassenbuch]
WHERE VereinId = @MuenchenVereinId AND Jahr = 2026;

INSERT INTO [Finanz].[Kassenbuch] (
    VereinId, BelegNr, BelegDatum, FiBuNummer, Verwendungszweck,
    EinnahmeKasse, AusgabeKasse, EinnahmeBank, AusgabeBank,
    Zahlungsweg, Bemerkung, MitgliedId, Jahr,
    DeletedFlag, Created, CreatedBy
) VALUES
(@MuenchenVereinId, 1, '2026-01-05', '2000', N'Üyelik aidatı - Ocak 2026 (nakit)', 180.00, NULL, NULL, NULL, 'BAR', N'Kasa tahsilatı', @FatmaId, 2026, 0, GETDATE(), 1),
(@MuenchenVereinId, 2, '2026-01-08', '2100', N'Bağış makbuzu - kültür etkinliği', NULL, NULL, 500.00, NULL, 'UEBERWEISUNG', N'Banka girişi', @CanId, 2026, 0, GETDATE(), 1),
(@MuenchenVereinId, 3, '2026-01-12', '3000', N'Kültür merkezi kira ödemesi', NULL, NULL, NULL, 850.00, 'UEBERWEISUNG', N'Ocak kira ödemesi', NULL, 2026, 0, GETDATE(), 1),
(@MuenchenVereinId, 4, '2026-01-15', '3100', N'Etkinlik ikram ve lojistik gideri', NULL, 220.00, NULL, NULL, 'BAR', N'Kültür gecesi hazırlığı', @ZeynepId, 2026, 0, GETDATE(), 1),
(@MuenchenVereinId, 5, '2026-01-18', '4200', N'Kültür gecesi bilet satışı', 320.00, NULL, NULL, NULL, 'BAR', N'Bilet ve stand satışları', @EmreId, 2026, 0, GETDATE(), 1),
(@MuenchenVereinId, 6, '2026-01-22', '1200', N'Kasa -> banka transferi', NULL, 300.00, 300.00, NULL, 'UEBERWEISUNG', N'Kasa bakiyesi bankaya aktarıldı', NULL, 2026, 0, GETDATE(), 1);

PRINT '  ✓ Kasa defteri ve FiBu hesap planı demo verileri eklendi (München, 2026)';
GO

-- =============================================
-- 5.3. SAYFA NOTLARI (PageNote)
-- =============================================

PRINT '5.3. Sayfa notları ekleniyor...';

-- Dernek ID'lerini al
DECLARE @MuenchenVereinIdNote INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = 'TDKV München');
DECLARE @BerlinVereinIdNote INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = 'DTF Berlin');

-- Üye ID'lerini al
DECLARE @FatmaIdNote INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'fatma.ozkan@email.com' ORDER BY Id);
DECLARE @AyseIdNote INT = (SELECT TOP 1 Id FROM [Mitglied].[Mitglied] WHERE Email = 'ayse.kaya@email.com' ORDER BY Id);

-- Sayfa notları ekle
INSERT INTO [Web].[PageNote] (
    PageUrl, PageTitle, EntityType, EntityId,
    Title, Content, Category, Priority,
    UserEmail, UserName, Status,
    DeletedFlag, Aktiv, Created, CreatedBy
) VALUES
-- Dernek sayfası notları
('/vereine/' + CAST(@MuenchenVereinIdNote AS NVARCHAR(10)), N'TDKV München - Detay', 'Verein', @MuenchenVereinIdNote,
 N'Adres bilgisi eksik', N'Dernek adres bilgilerinde posta kodu güncellenebilir mi?', 'General', 'Medium',
 'fatma.ozkan@email.com', N'Fatma Özkan', 'Pending', 0, 1, GETDATE(), 'fatma.ozkan@email.com'),

('/vereine/' + CAST(@BerlinVereinIdNote AS NVARCHAR(10)), N'DTF Berlin - Detay', 'Verein', @BerlinVereinIdNote,
 N'Telefon numarası hatalı', N'Dernek telefon numarası güncel değil, lütfen güncelleyin.', 'Bug', 'High',
 'ayse.kaya@email.com', N'Ayşe Kaya', 'Pending', 0, 1, GETDATE(), 'ayse.kaya@email.com'),

-- Üye sayfası notları
('/mitglieder/' + CAST(@FatmaIdNote AS NVARCHAR(10)), N'Fatma Özkan - Profil', 'Mitglied', @FatmaIdNote,
 N'Profil fotoğrafı eklenebilir mi?', N'Üye profil sayfasına fotoğraf yükleme özelliği eklenirse güzel olur.', 'Feature', 'Medium',
 'fatma.ozkan@email.com', N'Fatma Özkan', 'Pending', 0, 1, GETDATE(), 'fatma.ozkan@email.com'),

-- Dashboard notları
('/dashboard', N'Dashboard', 'Dashboard', NULL,
 N'İstatistikler çok güzel', N'Dashboard sayfasındaki istatistikler çok bilgilendirici, teşekkürler!', 'Question', 'Low',
 'ayse.kaya@email.com', N'Ayşe Kaya', 'Completed', 0, 1, GETDATE(), 'ayse.kaya@email.com'),

-- Etkinlik sayfası notları
('/veranstaltungen', N'Etkinlikler', 'Veranstaltung', NULL,
 N'Takvim görünümü eklenebilir', N'Etkinlikleri takvim formatında görmek daha kullanışlı olabilir.', 'Feature', 'Medium',
 'fatma.ozkan@email.com', N'Fatma Özkan', 'Pending', 0, 1, GETDATE(), 'fatma.ozkan@email.com');

PRINT '  ✓ 5 Sayfa notu eklendi';
GO

PRINT '  ✓ Finanz verileri tamamlandı';
GO

-- =============================================
-- 6. DERNEK TÜZÜKLERİ (VereinSatzung)
-- =============================================

PRINT '6. Dernek tüzükleri ekleniyor...';

-- Dernek ID'lerini al
DECLARE @MuenchenVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinId INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');

-- Tüzük belgelerini ekle
INSERT INTO [Verein].[VereinSatzung] (
    VereinId, DosyaPfad, SatzungVom, Aktiv, Bemerkung, DosyaAdi, DosyaBoyutu,
    DeletedFlag, Created, CreatedBy
) VALUES
(
    @MuenchenVereinId,
    '/documents/satzungen/tdkv-muenchen-satzung.pdf',
    '2024-01-15',
    1,
    N'TDKV München Tüzüğü - Türkisch-Deutscher Kulturverein München e.V. resmi tüzüğü. Derneğin amaçları, çalışma alanları, üyelik koşulları ve yönetim yapısı hakkında detaylı bilgiler içerir.',
    'TDKV_Muenchen_Satzung_2024.pdf',
    245760, -- 240 KB
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    '/documents/satzungen/dtf-berlin-satzung.pdf',
    '2023-06-20',
    1,
    N'DTF Berlin Tüzüğü - Deutsch-Türkische Freundschaft Berlin e.V. resmi tüzüğü. Derneğin kültürel faaliyetleri, üyelik süreçleri ve organları hakkında bilgiler içerir.',
    'DTF_Berlin_Satzung_2023.pdf',
    312320, -- 305 KB
    0,
    GETDATE(),
    1
),
(
    @MuenchenVereinId,
    '/documents/satzungen/tdkv-muenchen-yonetmelik.pdf',
    '2024-02-01',
    1,
    N'TDKV München İç Yönetmelik - Derneğin iç çalışma düzeni, toplantı usulleri ve karar alma mekanizmaları hakkında detaylı yönetmelik.',
    'TDKV_Muenchen_Yonetmelik_2024.pdf',
    156672, -- 153 KB
    0,
    GETDATE(),
    1
),
(
    @BerlinVereinId,
    '/documents/satzungen/dtf-berlin-etik.pdf',
    '2023-09-10',
    1,
    N'DTF Berlin Etik Kuralları - Üyeler arası ilişkiler, etik davranış standartları ve disiplin süreci hakkında kurallar.',
    'DTF_Berlin_Etik_Kurallari_2023.pdf',
    98304, -- 96 KB
    0,
    GETDATE(),
    1
);

PRINT '  ✓ 4 Dernek tüzüğü eklendi (2 München, 2 Berlin)';
GO

-- ============================================================================
-- 7. PASIF DERNEKLER (ADD_INACTIVE_VEREINE.sql'den)
-- ============================================================================

PRINT '';
PRINT '6. Pasif dernekler ekleniyor...';

DECLARE @DefaultLandesverbandPassiveId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE DeletedFlag = 0 AND OrgType = 'Landesverband' AND FederationCode = 'DITIB'
      AND Name = N'DITIB Eyalet Birligi (Demo Pasif)'
    ORDER BY Id
);
IF @DefaultLandesverbandPassiveId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Eyalet Birligi (Demo Pasif)', 'Landesverband', 'DITIB', NULL, 0, GETDATE(), 1, 1);
    SET @DefaultLandesverbandPassiveId = SCOPE_IDENTITY();
END

DECLARE @DefaultRegionPassiveId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE DeletedFlag = 0 AND OrgType = 'Region' AND FederationCode = 'DITIB'
      AND Name = N'DITIB Bolge (Demo Pasif)'
    ORDER BY Id
);
IF @DefaultRegionPassiveId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Bolge (Demo Pasif)', 'Region', 'DITIB', @DefaultLandesverbandPassiveId, 0, GETDATE(), 1, 1);
    SET @DefaultRegionPassiveId = SCOPE_IDENTITY();
END

IF NOT EXISTS (
    SELECT 1
    FROM [Verein].[Organization]
    WHERE Name = N'DITIB Dernek (Demo Pasif)' AND OrgType = 'Verein'
      AND FederationCode = 'DITIB' AND ParentOrganizationId = @DefaultRegionPassiveId
)
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'DITIB Dernek (Demo Pasif)', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 1);
END

DECLARE @HamburgOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Türkişch-Deutscher Sportverein Hamburg (Kapatıldı)'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @HamburgOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Türkişch-Deutscher Sportverein Hamburg (Kapatıldı)', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 0);
    SET @HamburgOrgId = SCOPE_IDENTITY();
END

DECLARE @FrankfurtOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Anadolu Kültür Derneği Frankfurt'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @FrankfurtOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Anadolu Kültür Derneği Frankfurt', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 0);
    SET @FrankfurtOrgId = SCOPE_IDENTITY();
END

DECLARE @KoelnOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Köln Türk Gençlik Birliği (Birleşti)'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @KoelnOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Köln Türk Gençlik Birliği (Birleşti)', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 0);
    SET @KoelnOrgId = SCOPE_IDENTITY();
END

DECLARE @StuttgartOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Stuttgart Anadolu Kültür ve Sanat Derneği'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @StuttgartOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Stuttgart Anadolu Kültür ve Sanat Derneği', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 0);
    SET @StuttgartOrgId = SCOPE_IDENTITY();
END

DECLARE @DuesseldorfOrgId INT = (
    SELECT TOP 1 Id
    FROM [Verein].[Organization]
    WHERE Name = N'Düsseldorf Türk Toplumu Derneği'
      AND OrgType = 'Verein'
      AND FederationCode = 'DITIB'
);
IF @DuesseldorfOrgId IS NULL
BEGIN
    INSERT INTO [Verein].[Organization] (Name, OrgType, FederationCode, ParentOrganizationId, DeletedFlag, Created, CreatedBy, Aktiv)
    VALUES (N'Düsseldorf Türk Toplumu Derneği', 'Verein', 'DITIB', @DefaultRegionPassiveId, 0, GETDATE(), 1, 0);
    SET @DuesseldorfOrgId = SCOPE_IDENTITY();
END

-- Mevcut dernekleri aktif olarak işaretle
UPDATE [Verein].[Verein]
SET Aktiv = 1,
    Modified = GETDATE(),
    ModifiedBy = 1
WHERE Aktiv IS NULL OR Aktiv = 0;

DECLARE @UpdatedCount INT = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@UpdatedCount AS NVARCHAR(10)) + ' dernek aktif olarak işaretlendi';

-- Önce pasif dernekler için adresleri ekle
INSERT INTO [Verein].[Adresse] (
    Strasse, Hausnummer, PLZ, Ort, Bundesland, Land,
    Aktiv, IstStandard, DeletedFlag, Created, CreatedBy
) VALUES
(N'Reeperbahn', N'88', N'20359', N'Hamburg', N'Hamburg', N'Deutschland', 0, 1, 0, GETDATE(), 1),
(N'Zeil', N'42', N'60313', N'Frankfurt am Main', N'Hessen', N'Deutschland', 0, 1, 0, GETDATE(), 1),
(N'Hohe Straße', N'65', N'50667', N'Köln', N'Nordrhein-Westfalen', N'Deutschland', 0, 1, 0, GETDATE(), 1),
(N'Königstraße', N'28', N'70173', N'Stuttgart', N'Baden-Württemberg', N'Deutschland', 0, 1, 0, GETDATE(), 1),
(N'Schadowstraße', N'11', N'40212', N'Düsseldorf', N'Nordrhein-Westfalen', N'Deutschland', 0, 1, 0, GETDATE(), 1);

DECLARE @AdressHamburg INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'20359' ORDER BY Id DESC);
DECLARE @AdressFrankfurt INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'60313' ORDER BY Id DESC);
DECLARE @AdressKoeln INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'50667' ORDER BY Id DESC);
DECLARE @AdressStuttgart INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'70173' ORDER BY Id DESC);
DECLARE @AdressDuesseldorf INT = (SELECT TOP 1 Id FROM [Verein].[Adresse] WHERE PLZ = N'40212' ORDER BY Id DESC);

-- Pasif dernekler ekle
INSERT INTO [Verein].[Verein] (
    Name, Kurzname, Zweck, Telefon, Fax, Email, VertreterEmail, Webseite,
    Gruendungsdatum, Mitgliederzahl, Vereinsnummer, Steuernummer,
    Vorstandsvorsitzender, Geschaeftsfuehrer, Kontaktperson,
    SocialMediaLinks, OrganizationId, AdresseId,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
(
    N'Türkisch-Deutscher Sportverein Hamburg (Kapatıldı)',
    N'TDSV Hamburg',
    N'Spor ve kültürel faaliyetler - 2023''te kapatıldı',
    '+49 40 555555555',
    '+49 40 555555556',
    'archiv@tdsv-hamburg.de',
    NULL,
    'https://www.tdsv-hamburg.de',
    '1998-06-10',
    0,
    'VR 11111',
    '22/111/11111',
    N'Ali Çelik',
    NULL,
    N'Zeynep Arslan',
    NULL,
    @HamburgOrgId,
    @AdressHamburg,
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
    NULL,
    'info@akd-frankfurt.de',
    'yonetim@akd-frankfurt.de',
    NULL,
    '2005-11-20',
    45,
    'VR 22222',
    '45/222/22222',
    N'Hasan Yıldız',
    N'Zehra Demir',
    N'Elif Şahin',
    N'{"facebook":"https://facebook.com/akd.frankfurt","youtube":"https://youtube.com/@akdfrankfurt"}',
    @FrankfurtOrgId,
    @AdressFrankfurt,
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
    NULL,
    'eski@ktgb-koeln.de',
    NULL,
    NULL,
    '2010-03-05',
    0,
    'VR 33333',
    '50/333/33333',
    N'Emre Kara',
    NULL,
    N'Selin Aydın',
    NULL,
    @KoelnOrgId,
    @AdressKoeln,
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
    '+49 711 999999998',
    'muhasebe@saksd-stuttgart.de',
    'baskan@saksd-stuttgart.de',
    'https://www.saksd-stuttgart.de',
    '2012-09-18',
    28,
    'VR 44444',
    '70/444/44444',
    N'Kemal Öztürk',
    N'Murat Yılmaz',
    N'Aylin Koç',
    N'{"instagram":"https://instagram.com/saksd_stuttgart","twitter":"https://twitter.com/saksd_stuttgart"}',
    @StuttgartOrgId,
    @AdressStuttgart,
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
    '+49 211 666666667',
    'iletisim@dttd-duesseldorf.de',
    NULL,
    NULL,
    '2008-04-12',
    15,
    'VR 55555',
    '40/555/55555',
    N'Murat Demir',
    NULL,
    N'Gül Yılmaz',
    N'{"facebook":"https://facebook.com/dttd.duesseldorf"}',
    @DuesseldorfOrgId,
    @AdressDuesseldorf,
    0,
    0,
    GETDATE(),
    1
);

-- Adres VereinId'lerini güncelle
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressHamburg) WHERE Id = @AdressHamburg;
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressFrankfurt) WHERE Id = @AdressFrankfurt;
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressKoeln) WHERE Id = @AdressKoeln;
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressStuttgart) WHERE Id = @AdressStuttgart;
UPDATE [Verein].[Adresse] SET VereinId = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE AdresseId = @AdressDuesseldorf) WHERE Id = @AdressDuesseldorf;

PRINT '  ✓ 5 Pasif dernek eklendi';
GO

PRINT '';
PRINT '==============================================';
PRINT 'TÜM DEMO VERİLERİ BAŞARIYLA EKLENDİ!';
PRINT '==============================================';
PRINT '';
PRINT 'Özet:';
PRINT '  ✓ 7 Dernek (2 aktif + 5 pasif)';
PRINT '  ✓ 10 Üye (6 München + 4 Berlin) - Dernek başkanları üye değil!';
PRINT '  ✓ 10 Etkinlik (7 recurring)';
PRINT '  ✓ 8 Aile ilişkisi';
PRINT '  ✓ 2 Banka hesabı';
PRINT '  ✓ 9 Banka hareketi';
PRINT '  ✓ 3 Üye alacağı (Dernek yöneticileri üye değil)';
PRINT '  ✓ 1 Üye ödemesi (Dernek yöneticileri üye değil)';
PRINT '  ✓ 1 Ödeme-Alacak eşleştirmesi (Fatma - kısmi ödeme)';
PRINT '  ✓ 0 Ön ödeme (Fatma ödemesi alacağa eşleştirildi)';
PRINT '  ✓ 4 Etkinlik ödemesi';
PRINT '  ✓ 4 Dernek tüzüğü (2 München, 2 Berlin)';
PRINT '  ✓ 13 User (1 admin + 2 dernek yöneticisi + 10 üye)';
PRINT '  ✓ 13 UserRole (authentication için)';
PRINT '';
PRINT 'Demo Hesaplar (Şifre: demo123):';
PRINT '  1. admin@system.de (Admin)';
PRINT '  2. ahmet.yilmaz@email.com (Dernek Yöneticisi - München) - ÜYE DEĞİL!';
PRINT '  3. mehmet.demir@email.com (Dernek Yöneticisi - Berlin) - ÜYE DEĞİL!';
PRINT '  4. fatma.ozkan@email.com (Üye - München) - Ailem sayfasını test edin!';
PRINT '  5. ayse.kaya@email.com (Üye - Berlin)';
PRINT '';
PRINT 'Finanz Test Senaryoları:';
PRINT '  - Fatma Özkan: Açık alacak (F-2025-001, 120 EUR) + Kısmi ödeme (50 EUR) = Kalan: 70 EUR';
PRINT '  - Can Schmidt: Vadesi geçmiş alacak (F-2025-002, 120 EUR) - Ödeme yok';
PRINT '  - Ayşe Kaya: Açık alacak (F-2025-101, 100 EUR) - Ödeme yok';
PRINT '';
PRINT 'Raporlar Sayfası:';
PRINT '  - Admin: admin@system.de → Tüm dernekler için raporlar';
PRINT '  - Dernek: ahmet.yilmaz@email.com → München raporları';
PRINT '  - Dernek: mehmet.demir@email.com → Berlin raporları';
PRINT '';
GO

-- =============================================
-- 10. USER & AUTHENTICATION DATA
-- =============================================
-- Web.User ve Web.UserRole tablolarını doldur
-- DEMO PASSWORD: demo123
-- BCrypt Hash: $2a$11$T9oH4v7kTCv3MQc7blWOTuFaNaCQnaoZACXzQKauIkaxVEiG1zZH6

PRINT '';
PRINT '==============================================';
PRINT '10. USER & AUTHENTICATION DATA';
PRINT '==============================================';

-- =============================================
-- STEP 1: Create Admin User
-- =============================================

PRINT 'Creating Admin User...';
GO

IF NOT EXISTS (SELECT 1 FROM [Web].[User] WHERE Email = 'admin@system.de')
BEGIN
    INSERT INTO [Web].[User] (
        Email,
        PasswordHash,
        Vorname,
        Nachname,
        IsActive,
        EmailConfirmed,
        Created
    )
    VALUES (
        'admin@system.de',
        '$2a$11$T9oH4v7kTCv3MQc7blWOTuFaNaCQnaoZACXzQKauIkaxVEiG1zZH6', -- demo123
        'System',
        'Admin',
        1,
        1,
        GETDATE()
    )
END
GO

-- Create Admin Role
IF NOT EXISTS (
    SELECT 1 FROM [Web].[UserRole] ur
    INNER JOIN [Web].[User] u ON ur.UserId = u.Id
    WHERE u.Email = 'admin@system.de' AND ur.RoleType = 'admin'
)
BEGIN
    INSERT INTO [Web].[UserRole] (
        UserId,
        RoleType,
        MitgliedId,
        VereinId,
        GueltigVon,
        IsActive,
        Created
    )
    SELECT
        Id,
        'admin',
        NULL,
        NULL,
        GETDATE(),
        1,
        GETDATE()
    FROM [Web].[User]
    WHERE Email = 'admin@system.de'
END
GO

PRINT '  ✓ Admin user created';
GO

-- =============================================
-- STEP 2: Create Dernek Yöneticileri (Non-Member Managers)
-- =============================================

PRINT 'Creating Dernek Yöneticileri (Association Managers)...';
GO

-- Ahmet Yılmaz - München Dernek Başkanı (ÜYE DEĞİL!)
IF NOT EXISTS (SELECT 1 FROM [Web].[User] WHERE Email = 'ahmet.yilmaz@email.com')
BEGIN
    INSERT INTO [Web].[User] (
        Email,
        PasswordHash,
        Vorname,
        Nachname,
        IsActive,
        EmailConfirmed,
        Created
    )
    VALUES (
        'ahmet.yilmaz@email.com',
        '$2a$11$T9oH4v7kTCv3MQc7blWOTuFaNaCQnaoZACXzQKauIkaxVEiG1zZH6', -- demo123
        'Ahmet',
        N'Yılmaz',
        1,
        1,
        GETDATE()
    )
END
GO

-- Mehmet Demir - Berlin Dernek Başkanı (ÜYE DEĞİL!)
IF NOT EXISTS (SELECT 1 FROM [Web].[User] WHERE Email = 'mehmet.demir@email.com')
BEGIN
    INSERT INTO [Web].[User] (
        Email,
        PasswordHash,
        Vorname,
        Nachname,
        IsActive,
        EmailConfirmed,
        Created
    )
    VALUES (
        'mehmet.demir@email.com',
        '$2a$11$T9oH4v7kTCv3MQc7blWOTuFaNaCQnaoZACXzQKauIkaxVEiG1zZH6', -- demo123
        'Mehmet',
        'Demir',
        1,
        1,
        GETDATE()
    )
END
GO

-- Create Dernek Roles for Managers (MitgliedId = NULL çünkü üye değiller!)
INSERT INTO [Web].[UserRole] (
    UserId,
    RoleType,
    MitgliedId,
    VereinId,
    GueltigVon,
    IsActive,
    Created,
    Bemerkung
)
SELECT
    u.Id,
    'dernek',
    NULL, -- ÜYE DEĞİL!
    v.Id,
    GETDATE(),
    1,
    GETDATE(),
    'Dernek Başkanı - Üye değil'
FROM [Web].[User] u
INNER JOIN [Verein].[Verein] v ON v.Vorstandsvorsitzender LIKE '%' + u.Vorname + '%' + u.Nachname + '%'
WHERE u.Email IN ('ahmet.yilmaz@email.com', 'mehmet.demir@email.com')
  AND ISNULL(v.DeletedFlag, 0) = 0
  AND NOT EXISTS (
      SELECT 1 FROM [Web].[UserRole] ur
      WHERE ur.UserId = u.Id AND ur.RoleType = 'dernek' AND ur.VereinId = v.Id
  )
GO

PRINT '  ✓ Dernek Yöneticileri created';
GO

-- =============================================
-- STEP 3: Migrate Existing Mitglied to Users
-- =============================================

PRINT 'Migrating existing Mitglied records to Users...';
GO

-- Create User records for all Mitglied with email
-- Default password: demo123 (for demo purposes)
INSERT INTO [Web].[User] (
    Email,
    PasswordHash,
    Vorname,
    Nachname,
    IsActive,
    EmailConfirmed,
    Created,
    CreatedBy
)
SELECT
    m.Email,
    '$2a$11$T9oH4v7kTCv3MQc7blWOTuFaNaCQnaoZACXzQKauIkaxVEiG1zZH6', -- demo123
    m.Vorname,
    m.Nachname,
    CAST(ISNULL(m.Aktiv, 1) AS BIT),
    0,  -- Email not confirmed yet
    ISNULL(m.Created, GETDATE()),
    m.CreatedBy
FROM [Mitglied].[Mitglied] m
WHERE m.Email IS NOT NULL
  AND m.Email <> ''
  AND ISNULL(m.DeletedFlag, 0) = 0
  AND NOT EXISTS (
      SELECT 1 FROM [Web].[User] u WHERE u.Email = m.Email
  )
GO

PRINT '  ✓ Users created from Mitglied records';
GO


-- =============================================
-- STEP 4: Create Mitglied Roles
-- =============================================

PRINT 'Creating Mitglied roles...';
GO

INSERT INTO [Web].[UserRole] (
    UserId,
    RoleType,
    MitgliedId,
    VereinId,
    GueltigVon,
    IsActive,
    Created,
    CreatedBy
)
SELECT
    u.Id,
    'mitglied',
    m.Id,
    m.VereinId,
    ISNULL(m.Eintrittsdatum, GETDATE()),
    CAST(ISNULL(m.Aktiv, 1) AS BIT),
    ISNULL(m.Created, GETDATE()),
    m.CreatedBy
FROM [Mitglied].[Mitglied] m
INNER JOIN [Web].[User] u ON u.Email = m.Email
WHERE ISNULL(m.DeletedFlag, 0) = 0
  AND m.Email IS NOT NULL
  AND m.Email <> ''
  AND NOT EXISTS (
      SELECT 1 FROM [Web].[UserRole] ur
      WHERE ur.UserId = u.Id
        AND ur.RoleType = 'mitglied'
        AND ur.MitgliedId = m.Id
  )
GO

PRINT '  ✓ Mitglied roles created';
GO

-- =============================================
-- STEP 5: Create Additional Dernek Roles (If Member is Also Manager)
-- =============================================
-- Bu adım sadece ÜYE OLAN ama AYNI ZAMANDA YÖNETICI olan kişiler için

PRINT 'Creating additional Dernek roles for members who are also managers...';
GO

-- Create dernek roles for members who are Vorstandsvorsitzender
-- (Sadece hem üye hem yönetici olanlar için - nadir durum)
INSERT INTO [Web].[UserRole] (
    UserId,
    RoleType,
    MitgliedId,
    VereinId,
    GueltigVon,
    IsActive,
    Created,
    Bemerkung
)
SELECT
    u.Id,
    'dernek',
    m.Id,
    m.VereinId,
    GETDATE(),
    1,
    GETDATE(),
    'Üye ve aynı zamanda Dernek Başkanı'
FROM [Mitglied].[Mitglied] m
INNER JOIN [Web].[User] u ON u.Email = m.Email
INNER JOIN [Verein].[Verein] v ON v.Id = m.VereinId
WHERE ISNULL(m.DeletedFlag, 0) = 0
  AND ISNULL(v.DeletedFlag, 0) = 0
  AND m.Email IS NOT NULL
  AND m.Email <> ''
  AND v.Vorstandsvorsitzender IS NOT NULL
  AND (
      v.Vorstandsvorsitzender LIKE '%' + m.Vorname + '%' + m.Nachname + '%'
      OR v.Vorstandsvorsitzender LIKE '%' + m.Nachname + '%' + m.Vorname + '%'
  )
  AND NOT EXISTS (
      SELECT 1 FROM [Web].[UserRole] ur
      WHERE ur.UserId = u.Id
        AND ur.RoleType = 'dernek'
        AND ur.VereinId = m.VereinId
  )
GO

PRINT '  ✓ Additional Dernek roles created';
GO

PRINT '';
PRINT '==============================================';
PRINT 'USER & AUTHENTICATION DATA COMPLETED!';
PRINT '==============================================';
PRINT '';
PRINT 'User Summary:';
PRINT '  ✓ 1 Admin user (admin@system.de)';
PRINT '  ✓ 2 Dernek Yöneticileri (non-members)';
PRINT '  ✓ 10 Mitglied users (from Mitglied table)';
PRINT '  ✓ Total: 13 users';
PRINT '';
PRINT 'Role Summary:';
PRINT '  ✓ 1 Admin role';
PRINT '  ✓ 2 Dernek roles (non-member managers)';
PRINT '  ✓ 10 Mitglied roles';
PRINT '  ✓ Total: 13 roles';
PRINT '';
PRINT 'Demo Login Credentials (Password: demo123):';
PRINT '  - Admin: admin@system.de';
PRINT '  - Dernek Manager (München): ahmet.yilmaz@email.com';
PRINT '  - Dernek Manager (Berlin): mehmet.demir@email.com';
PRINT '  - Member (München): fatma.ozkan@email.com';
PRINT '  - Member (Berlin): ayse.kaya@email.com';
PRINT '';
GO

-- ============================================================================
-- FINAL SUMMARY: TÜM TABLOLARIN VERİ SAYILARI
-- ============================================================================

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════╗';
PRINT '║         📊 TÜM TABLOLARIN VERİ SAYILARI                       ║';
PRINT '╚════════════════════════════════════════════════════════════════╝';
PRINT '';

SELECT 'Verein' as Tablo, COUNT(*) as [Kayıt Sayısı] FROM [Verein].[Verein]
UNION ALL
SELECT 'Adresse', COUNT(*) FROM [Verein].[Adresse]
UNION ALL
SELECT 'RechtlicheDaten', COUNT(*) FROM [Verein].[RechtlicheDaten]
UNION ALL
SELECT 'Bankkonto', COUNT(*) FROM [Verein].[Bankkonto]
UNION ALL
SELECT 'Veranstaltung', COUNT(*) FROM [Verein].[Veranstaltung]
UNION ALL
SELECT 'VeranstaltungAnmeldung', COUNT(*) FROM [Verein].[VeranstaltungAnmeldung]
UNION ALL
SELECT 'VeranstaltungBild', COUNT(*) FROM [Verein].[VeranstaltungBild]
UNION ALL
SELECT 'User', COUNT(*) FROM [Web].[User]
UNION ALL
SELECT 'UserRole', COUNT(*) FROM [Web].[UserRole]
UNION ALL
SELECT 'PageNote', COUNT(*) FROM [Web].[PageNote]
UNION ALL
SELECT 'Mitglied', COUNT(*) FROM [Mitglied].[Mitglied]
UNION ALL
SELECT 'MitgliedAdresse', COUNT(*) FROM [Mitglied].[MitgliedAdresse]
UNION ALL
SELECT 'MitgliedFamilie', COUNT(*) FROM [Mitglied].[MitgliedFamilie]
UNION ALL
SELECT 'BankBuchung', COUNT(*) FROM [Finanz].[BankBuchung]
UNION ALL
SELECT 'MitgliedForderung', COUNT(*) FROM [Finanz].[MitgliedForderung]
UNION ALL
SELECT 'MitgliedZahlung', COUNT(*) FROM [Finanz].[MitgliedZahlung]
UNION ALL
SELECT 'MitgliedForderungZahlung', COUNT(*) FROM [Finanz].[MitgliedForderungZahlung]
UNION ALL
SELECT 'MitgliedVorauszahlung', COUNT(*) FROM [Finanz].[MitgliedVorauszahlung]
UNION ALL
SELECT 'VeranstaltungZahlung', COUNT(*) FROM [Finanz].[VeranstaltungZahlung]
UNION ALL
SELECT 'Geschlecht', COUNT(*) FROM [Keytable].[Geschlecht]
UNION ALL
SELECT 'MitgliedStatus', COUNT(*) FROM [Keytable].[MitgliedStatus]
UNION ALL
SELECT 'MitgliedTyp', COUNT(*) FROM [Keytable].[MitgliedTyp]
UNION ALL
SELECT 'Waehrung', COUNT(*) FROM [Keytable].[Waehrung]
UNION ALL
SELECT 'ZahlungTyp', COUNT(*) FROM [Keytable].[ZahlungTyp]
UNION ALL
SELECT 'ZahlungStatus', COUNT(*) FROM [Keytable].[ZahlungStatus]
UNION ALL
SELECT 'FamilienbeziehungTyp', COUNT(*) FROM [Keytable].[FamilienbeziehungTyp]
UNION ALL
SELECT 'MitgliedFamilieStatus', COUNT(*) FROM [Keytable].[MitgliedFamilieStatus]
UNION ALL
SELECT 'BeitragPeriode', COUNT(*) FROM [Keytable].[BeitragPeriode]
UNION ALL
SELECT 'BeitragZahlungstagTyp', COUNT(*) FROM [Keytable].[BeitragZahlungstagTyp]
UNION ALL
SELECT 'Staatsangehoerigkeit', COUNT(*) FROM [Keytable].[Staatsangehoerigkeit]
UNION ALL
SELECT 'AdresseTyp', COUNT(*) FROM [Keytable].[AdresseTyp]
UNION ALL
SELECT 'Kontotyp', COUNT(*) FROM [Keytable].[Kontotyp]
UNION ALL
SELECT 'Rechtsform', COUNT(*) FROM [Keytable].[Rechtsform]
UNION ALL
SELECT 'VereinSatzung', COUNT(*) FROM [Verein].[VereinSatzung]
ORDER BY Tablo;

-- Çeviri tablolarının durumu
PRINT '';
PRINT '--- ÇEVİRİ TABLOLARI DURUMU ---';
SELECT 'GeschlechtUebersetzung' AS Tablo, COUNT(*) AS Kayit FROM [Keytable].[GeschlechtUebersetzung]
UNION ALL
SELECT 'MitgliedStatusUebersetzung', COUNT(*) FROM [Keytable].[MitgliedStatusUebersetzung]
UNION ALL
SELECT 'MitgliedTypUebersetzung', COUNT(*) FROM [Keytable].[MitgliedTypUebersetzung]
UNION ALL
SELECT 'FamilienbeziehungTypUebersetzung', COUNT(*) FROM [Keytable].[FamilienbeziehungTypUebersetzung]
UNION ALL
SELECT 'StaatsangehoerigkeitUebersetzung', COUNT(*) FROM [Keytable].[StaatsangehoerigkeitUebersetzung]
UNION ALL
SELECT 'BeitragPeriodeUebersetzung', COUNT(*) FROM [Keytable].[BeitragPeriodeUebersetzung]
UNION ALL
SELECT 'ZahlungTypUebersetzung', COUNT(*) FROM [Keytable].[ZahlungTypUebersetzung]
UNION ALL
SELECT 'ZahlungStatusUebersetzung', COUNT(*) FROM [Keytable].[ZahlungStatusUebersetzung]
UNION ALL
SELECT 'WaehrungUebersetzung', COUNT(*) FROM [Keytable].[WaehrungUebersetzung]
UNION ALL
SELECT 'ForderungsartUebersetzung', COUNT(*) FROM [Keytable].[ForderungsartUebersetzung]
UNION ALL
SELECT 'ForderungsstatusUebersetzung', COUNT(*) FROM [Keytable].[ForderungsstatusUebersetzung]
ORDER BY Tablo;

-- =====================================================
-- BRIEF VORLAGEN (Mektup Şablonları)
-- =====================================================
PRINT '';
PRINT '--- 12. Brief Vorlagen (Mektup Şablonları) Ekleniyor ---';

-- Her dernek için sistem şablonları ekle
DECLARE @VereinId INT;
DECLARE @VereinName NVARCHAR(200);

DECLARE verein_cursor CURSOR FOR
SELECT Id, Name FROM Verein.Verein WHERE DeletedFlag = 0;

OPEN verein_cursor;
FETCH NEXT FROM verein_cursor INTO @VereinId, @VereinName;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Şablonların zaten var olup olmadığını kontrol et
    IF NOT EXISTS (SELECT 1 FROM Brief.BriefVorlage WHERE VereinId = @VereinId AND IstSystemvorlage = 1)
    BEGIN
        -- 1. Hoş Geldiniz Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Hoş Geldiniz', N'Yeni üyeler için karşılama mektubu',
                N'{{vereinName}} Ailesine Hoş Geldiniz!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesine hoş geldiniz!</p><p>Üyelik numaranız: <strong>{{mitgliedsnummer}}</strong></p><p>Derneğimize katıldığınız için çok mutluyuz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Willkommen', 1);

        -- 2. Aidat Hatırlatma Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Aidat Hatırlatması', N'Üyelik aidatı ödeme hatırlatması',
                N'Aidat Ödeme Hatırlatması',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} üyelik aidatınızı hatırlatmak isteriz.</p><p>Ödenmemiş aidat tutarı: <strong>{{beitragBetrag}}</strong></p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Zahlung', 1);

        -- 3. Ödeme Teşekkür Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Ödeme Teşekkür', N'Ödeme sonrası teşekkür mektubu',
                N'Ödemeniz İçin Teşekkürler',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>Ödemeniz başarıyla alınmıştır.</p><p>{{vereinName}} adına teşekkür ederiz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Zahlung', 1);

        -- 4. Etkinlik Daveti Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Etkinlik Daveti', N'Genel etkinlik davet mektubu',
                N'Etkinliğimize Davetlisiniz!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} olarak düzenleyeceğimiz etkinliğe sizi davet ediyoruz.</p><p>Katılımınızı bekliyoruz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Einladung', 1);

        -- 5. Toplantı Daveti Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Toplantı Daveti', N'Genel kurul veya toplantı daveti',
                N'Toplantı Daveti',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} toplantısına katılmanızı rica ederiz.</p><p>Katılımınız bizim için önemlidir.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Einladung', 1);

        -- 6. Yeni Yıl Kutlaması Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Yeni Yıl Kutlaması', N'Yılbaşı kutlama mesajı',
                N'Yeni Yılınız Kutlu Olsun!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesi olarak yeni yılınızı en içten dileklerimizle kutlarız.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Feiertag', 1);

        -- 7. Bayram Kutlaması Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Bayram Kutlaması', N'Dini ve milli bayram kutlamaları',
                N'Bayramınız Kutlu Olsun!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesi olarak bayramınızı en içten dileklerimizle kutlarız.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Feiertag', 1);

        -- 8. Genel Duyuru Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Genel Duyuru', N'Genel bilgilendirme mektubu',
                N'Önemli Duyuru',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} olarak sizlere önemli bir duyuru iletmek istiyoruz.</p><p>[Duyuru içeriğini buraya yazın]</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Allgemein', 1);

        -- 9. Boş Şablon
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, N'Boş Şablon', N'Sadece logo ve başlık içeren boş şablon',
                N'Konu',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p></p><p>Saygılarımızla,<br/>{{vereinName}}<br/>Yönetim Kurulu</p>',
                N'Allgemein', 1);

        PRINT '  ✓ Şablonlar eklendi: ' + @VereinName;
    END

    FETCH NEXT FROM verein_cursor INTO @VereinId, @VereinName;
END

CLOSE verein_cursor;
DEALLOCATE verein_cursor;
GO

-- =====================================================
-- ÖZET RAPOR
-- =====================================================
PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════╗';
PRINT '║         ✅ DEMO VERİLERİ BAŞARIYLA YÜKLENDİ!                  ║';
PRINT '╚════════════════════════════════════════════════════════════════╝';
PRINT '';
GO

-- ============================================================================
-- 13. PERFORMANS TEST VERİLERİ (1000+ Ödemeli Üye)
-- ============================================================================
-- Bu bölüm, üye finans sayfasının performansını test etmek için
-- 1000+ ödemeli üye verisi ekler

PRINT '';
PRINT '13. Performans test verileri ekleniyor (1000+ ödemeli üye)...';
GO

-- Performans testi için 1000 üye ve ödeme kaydı oluştur
DECLARE @MuenchenVereinIdPerf INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'TDKV München');
DECLARE @BerlinVereinIdPerf INT = (SELECT TOP 1 Id FROM [Verein].[Verein] WHERE Kurzname = N'DTF Berlin');
DECLARE @AktivStatusIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV');
DECLARE @VollmitgliedTypIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED');
DECLARE @GeschlechtMPerf INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'M');
DECLARE @GeschlechtFPerf INT = (SELECT TOP 1 Id FROM [Keytable].[Geschlecht] WHERE Code = 'F');
DECLARE @EurWaehrungIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[Waehrung] WHERE Code = 'EUR');
DECLARE @BeitragTypIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungTyp] WHERE Code = 'MITGLIEDSBEITRAG');
DECLARE @BezahltStatusIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'BEZAHLT');
DECLARE @OffenStatusIdPerf INT = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'OFFEN');

PRINT '  1000 performans test üyesi oluşturuluyor...';

-- 1000 üye oluştur (500 München, 500 Berlin)
DECLARE @i INT = 1;
DECLARE @batchSize INT = 100; -- Her seferinde 100 kayıt

WHILE @i <= 1000
BEGIN
    -- Mevcut üye sayısını kontrol et
    DECLARE @currentMemberCount INT = (SELECT COUNT(*) FROM [Mitglied].[Mitglied] WHERE DeletedFlag = 0);
    
    IF @currentMemberCount >= 1000
    BEGIN
        PRINT '  ✓ Zaten 1000+ üye mevcut, performans verileri oluşturulmadı';
        BREAK;
    END
    
    -- Batch olarak üyeleri oluştur
    BEGIN TRANSACTION;
    
    DECLARE @j INT = 1;
    WHILE @j <= @batchSize AND @i <= 1000
    BEGIN
        DECLARE @isMuenchen BIT = CASE WHEN @i % 2 = 1 THEN 1 ELSE 0 END;
        DECLARE @vereinId INT = CASE WHEN @isMuenchen = 1 THEN @MuenchenVereinIdPerf ELSE @BerlinVereinIdPerf END;
        DECLARE @geschlechtId INT = CASE WHEN @i % 3 = 0 THEN @GeschlechtFPerf ELSE @GeschlechtMPerf END;
        DECLARE @mitgliedsnummer NVARCHAR(20) = CASE
            WHEN @isMuenchen = 1 THEN 'PERF-M' + RIGHT('000' + CAST(@i AS NVARCHAR(10)), 4)
            ELSE 'PERF-B' + RIGHT('000' + CAST(@i AS NVARCHAR(10)), 4)
        END;
        
        -- Rastgele isimler oluştur
        DECLARE @vorname NVARCHAR(100) = CASE
            WHEN @i % 10 = 0 THEN N'Muhammed'
            WHEN @i % 10 = 1 THEN N'Fatma'
            WHEN @i % 10 = 2 THEN N'Ahmet'
            WHEN @i % 10 = 3 THEN N'Ayşe'
            WHEN @i % 10 = 4 THEN N'Mehmet'
            WHEN @i % 10 = 5 THEN N'Zeynep'
            WHEN @i % 10 = 6 THEN N'Emre'
            WHEN @i % 10 = 7 THEN N'Elif'
            WHEN @i % 10 = 8 THEN N'Can'
            ELSE N'Ali'
        END;
        
        DECLARE @nachname NVARCHAR(100) = CASE
            WHEN @i % 8 = 0 THEN N'Yılmaz'
            WHEN @i % 8 = 1 THEN N'Öztürk'
            WHEN @i % 8 = 2 THEN N'Kaya'
            WHEN @i % 8 = 3 THEN N'Demir'
            WHEN @i % 8 = 4 THEN N'Çelik'
            WHEN @i % 8 = 5 THEN N'Koç'
            WHEN @i % 8 = 6 THEN N'Arslan'
            ELSE N'Şahin'
        END;
        
        DECLARE @email NVARCHAR(200) = REPLACE(REPLACE(LOWER(@vorname + '.' + @nachname + CAST(@i AS NVARCHAR(10)) + '@test-perf.de'), 'ı', 'i'), 'ş', 's');
        DECLARE @beitrag DECIMAL(10,2) = CASE
            WHEN @i % 5 = 0 THEN 120.00  -- Standart ücret
            WHEN @i % 5 = 1 THEN 60.00   -- İndirimli
            WHEN @i % 5 = 2 THEN 30.00   -- Genç üye
            WHEN @i % 5 = 3 THEN 240.00  -- Yıllık
            ELSE 50.00              -- Emekli
        END;
        
        DECLARE @beitragPeriode NVARCHAR(20) = CASE
            WHEN @i % 4 = 0 THEN 'QUARTERLY'
            WHEN @i % 4 = 1 THEN 'MONTHLY'
            WHEN @i % 4 = 2 THEN 'YEARLY'
            ELSE 'MONTHLY'
        END;
        
        -- Üye kaydı oluştur
        INSERT INTO [Mitglied].[Mitglied] (
            VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId,
            Vorname, Nachname, GeschlechtId, Email, Telefon,
            Geburtsdatum, Eintrittsdatum,
            BeitragBetrag, BeitragWaehrungId, BeitragPeriodeCode,
            BeitragZahlungsTag, BeitragZahlungstagTypCode, BeitragIstPflicht,
            Aktiv, DeletedFlag, Created, CreatedBy
        ) VALUES (
            @vereinId, @mitgliedsnummer, @AktivStatusIdPerf, @VollmitgliedTypIdPerf,
            @vorname, @nachname, @geschlechtId, @email, '+49 123456' + RIGHT('0000' + CAST(@i AS NVARCHAR(10)), 4),
            DATEADD(YEAR, -(@i % 60 + 18), GETDATE()), -- 18-78 yaş arası
            DATEADD(DAY, -(@i % 365), GETDATE()), -- Son 1 yıl içinde kayıt
            @beitrag, @EurWaehrungIdPerf, @beitragPeriode,
            (@i % 28) + 1, -- Ayın 1-28'i arasında ödeme günü
            'DAY_OF_MONTH', 1,
            1, 0, GETDATE(), 1
        );
        
        DECLARE @mitgliedId INT = SCOPE_IDENTITY();
        
        -- Her üye için 5-15 arası ödeme kaydı oluştur
        DECLARE @paymentCount INT = (@i % 10) + 5;
        DECLARE @k INT = 1;
        
        WHILE @k <= @paymentCount
        BEGIN
            DECLARE @paymentDate DATETIME = DATEADD(DAY, -(@k * 30), GETDATE());
            DECLARE @paymentAmount DECIMAL(10,2) = @beitrag * (0.8 + (@k % 5) * 0.1); -- 80%-120% arası ödeme
            DECLARE @paymentStatus INT = CASE WHEN @k % 4 = 0 THEN @BezahltStatusIdPerf ELSE @OffenStatusIdPerf END;
            
            INSERT INTO [Finanz].[MitgliedZahlung] (
                VereinId, MitgliedId, ZahlungTypId, Betrag, WaehrungId,
                Zahlungsdatum, Zahlungsweg, Bemerkung, StatusId,
                DeletedFlag, Created, CreatedBy
            ) VALUES (
                @vereinId, @mitgliedId, @BeitragTypIdPerf, @paymentAmount, @EurWaehrungIdPerf,
                @paymentDate,
                CASE WHEN @k % 3 = 0 THEN 'UEBERWEISUNG' WHEN @k % 3 = 1 THEN 'BAR' ELSE 'LASTSCHRIFT' END,
                N'Ödeme ' + CAST(@k AS NVARCHAR(10)),
                @paymentStatus,
                0, GETDATE(), 1
            );
            
            SET @k = @k + 1;
        END
        
        -- Her üye için 2-5 arası alacak kaydı oluştur
        DECLARE @forderungCount INT = (@i % 4) + 2;
        DECLARE @f INT = 1;
        
        WHILE @f <= @forderungCount
        BEGIN
            DECLARE @forderungDate DATETIME = DATEADD(DAY, @f * 15, GETDATE());
            DECLARE @forderungAmount DECIMAL(10,2) = @beitrag * (0.9 + (@f % 3) * 0.2); -- 90%-130% arası alacak
            DECLARE @forderungStatus INT = CASE WHEN @f % 3 = 0 THEN @OffenStatusIdPerf ELSE @BezahltStatusIdPerf END;
            
            INSERT INTO [Finanz].[MitgliedForderung] (
                VereinId, MitgliedId, ZahlungTypId, Forderungsnummer,
                Betrag, WaehrungId, Faelligkeit, Beschreibung,
                Jahr, Quartal, Monat, StatusId,
                DeletedFlag, Created, CreatedBy
            ) VALUES (
                @vereinId, @mitgliedId, @BeitragTypIdPerf,
                CASE WHEN @isMuenchen = 1 THEN 'PERF-M-' ELSE 'PERF-B-' END + CAST(@i AS NVARCHAR(10)) + '-' + CAST(@f AS NVARCHAR(10)),
                @forderungAmount, @EurWaehrungIdPerf, @forderungDate,
                N'Performans test alacağı ' + CAST(@f AS NVARCHAR(10)),
                YEAR(@forderungDate),
                CASE WHEN MONTH(@forderungDate) BETWEEN 1 AND 3 THEN 1
                     WHEN MONTH(@forderungDate) BETWEEN 4 AND 6 THEN 2
                     WHEN MONTH(@forderungDate) BETWEEN 7 AND 9 THEN 3
                     ELSE 4 END,
                MONTH(@forderungDate),
                @forderungStatus,
                0, GETDATE(), 1
            );
            
            SET @f = @f + 1;
        END
        
        SET @j = @j + 1;
        SET @i = @i + 1;
    END
    
    COMMIT TRANSACTION;
    
    PRINT '  ✓ Batch ' + CAST((@i - 1) / @batchSize AS NVARCHAR(10)) + ' tamamlandı (' + CAST(@i - 1 AS NVARCHAR(10)) + ' üye)';
END

PRINT '  ✓ 1000+ performans test üyesi ve ödeme kayıtları oluşturuldu';
GO

-- Performans test verileri özeti
PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════╗';
PRINT '║         📊 PERFORMANS TEST VERİLERİ ÖZETİ                    ║';
PRINT '╚════════════════════════════════════════════════════════════════╝';
PRINT '';

SELECT
    'Toplam Üye Sayısı' AS Metrik,
    COUNT(*) AS [Değer]
FROM [Mitglied].[Mitglied]
WHERE DeletedFlag = 0

UNION ALL

SELECT
    'Toplam Ödeme Sayısı',
    COUNT(*)
FROM [Finanz].[MitgliedZahlung]
WHERE DeletedFlag = 0

UNION ALL

SELECT
    'Toplam Alacak Sayısı',
    COUNT(*)
FROM [Finanz].[MitgliedForderung]
WHERE DeletedFlag = 0

UNION ALL

SELECT
    'Açık Alacaklar',
    COUNT(*)
FROM [Finanz].[MitgliedForderung]
WHERE DeletedFlag = 0 AND StatusId = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'OFFEN')

UNION ALL

SELECT
    'Ödenmiş Alacaklar',
    COUNT(*)
FROM [Finanz].[MitgliedForderung]
WHERE DeletedFlag = 0 AND StatusId = (SELECT TOP 1 Id FROM [Keytable].[ZahlungStatus] WHERE Code = 'BEZAHLT');

PRINT '';
PRINT 'Performans Test Senaryoları:';
PRINT '  - Üye finans sayfasını açın (fatma.ozkan@email.com ile giriş yapın)';
PRINT '  - Overview sekmesinde tüm özet verilerinin yüklenme süresini ölçün';
PRINT '  - History sekmesinde 1000+ ödeme kaydının yüklenme süresini ölçün';
PRINT '  - Claims sekmesinde tüm alacakların yüklenme süresini ölçün';
PRINT '  - Filtreleme ve arama fonksiyonlarının performansını test edin';
PRINT '';
GO
