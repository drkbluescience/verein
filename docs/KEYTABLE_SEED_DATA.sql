-- =============================================
-- KEYTABLE SEED DATA
-- Tüm keytable'lar için temel veriler
-- =============================================

USE [VEREIN];
GO

PRINT 'Keytable seed data ekleniyor...';
GO

-- =============================================
-- 1. Staatsangehoerigkeit (Uyruk)
-- =============================================
PRINT '1. Staatsangehoerigkeit (Uyruk) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'TR')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('TR', 'TUR');
    DECLARE @TurkeyId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@TurkeyId, 'tr', N'Türkiye'),
        (@TurkeyId, 'de', N'Türkei');
    PRINT '  ✓ Türkiye eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'DE')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('DE', 'DEU');
    DECLARE @GermanyId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@GermanyId, 'tr', N'Almanya'),
        (@GermanyId, 'de', N'Deutschland');
    PRINT '  ✓ Almanya eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'AT')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('AT', 'AUT');
    DECLARE @AustriaId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@AustriaId, 'tr', N'Avusturya'),
        (@AustriaId, 'de', N'Österreich');
    PRINT '  ✓ Avusturya eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'CH')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('CH', 'CHE');
    DECLARE @SwitzerlandId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@SwitzerlandId, 'tr', N'İsviçre'),
        (@SwitzerlandId, 'de', N'Schweiz');
    PRINT '  ✓ İsviçre eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Staatsangehoerigkeit] WHERE ISO2 = 'FR')
BEGIN
    INSERT INTO [Keytable].[Staatsangehoerigkeit] (ISO2, ISO3) VALUES ('FR', 'FRA');
    DECLARE @FranceId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[StaatsangehoerigkeitUebersetzung] (StaatsangehoerigkeitId, Sprache, Name) VALUES
        (@FranceId, 'tr', N'Fransa'),
        (@FranceId, 'de', N'Frankreich');
    PRINT '  ✓ Fransa eklendi';
END

-- =============================================
-- 2. BeitragPeriode (Aidat Dönemi)
-- =============================================
PRINT '2. BeitragPeriode (Aidat Dönemi) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'MONTHLY')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('MONTHLY', 1);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('MONTHLY', 'tr', N'Aylık'),
        ('MONTHLY', 'de', N'Monatlich');
    PRINT '  ✓ Aylık eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'QUARTERLY')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('QUARTERLY', 2);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('QUARTERLY', 'tr', N'3 Aylık'),
        ('QUARTERLY', 'de', N'Vierteljährlich');
    PRINT '  ✓ 3 Aylık eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'SEMIANNUAL')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('SEMIANNUAL', 3);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('SEMIANNUAL', 'tr', N'6 Aylık'),
        ('SEMIANNUAL', 'de', N'Halbjährlich');
    PRINT '  ✓ 6 Aylık eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragPeriode] WHERE Code = 'ANNUAL')
BEGIN
    INSERT INTO [Keytable].[BeitragPeriode] (Code, Sort) VALUES ('ANNUAL', 4);
    INSERT INTO [Keytable].[BeitragPeriodeUebersetzung] (BeitragPeriodeCode, Sprache, Name) VALUES
        ('ANNUAL', 'tr', N'Yıllık'),
        ('ANNUAL', 'de', N'Jährlich');
    PRINT '  ✓ Yıllık eklendi';
END

-- =============================================
-- 3. BeitragZahlungstagTyp (Ödeme Günü Tipi)
-- =============================================
PRINT '3. BeitragZahlungstagTyp (Ödeme Günü Tipi) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'DAY_OF_MONTH')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('DAY_OF_MONTH', 1);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('DAY_OF_MONTH', 'tr', N'Ayın Günü'),
        ('DAY_OF_MONTH', 'de', N'Tag des Monats');
    PRINT '  ✓ Ayın Günü eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'FIRST_DAY')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('FIRST_DAY', 2);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('FIRST_DAY', 'tr', N'İlk Gün'),
        ('FIRST_DAY', 'de', N'Erster Tag');
    PRINT '  ✓ İlk Gün eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[BeitragZahlungstagTyp] WHERE Code = 'LAST_DAY')
BEGIN
    INSERT INTO [Keytable].[BeitragZahlungstagTyp] (Code, Sort) VALUES ('LAST_DAY', 3);
    INSERT INTO [Keytable].[BeitragZahlungstagTypUebersetzung] (Code, Sprache, Name) VALUES
        ('LAST_DAY', 'tr', N'Son Gün'),
        ('LAST_DAY', 'de', N'Letzter Tag');
    PRINT '  ✓ Son Gün eklendi';
END

-- =============================================
-- 4. Rechtsform (Hukuki Yapı)
-- =============================================
PRINT '4. Rechtsform (Hukuki Yapı) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Rechtsform] WHERE Code = 'EV')
BEGIN
    INSERT INTO [Keytable].[Rechtsform] (Code) VALUES ('EV');
    DECLARE @EvId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[RechtsformUebersetzung] (RechtsformId, Sprache, Name) VALUES
        (@EvId, 'tr', N'Dernek (e.V.)'),
        (@EvId, 'de', N'Eingetragener Verein (e.V.)');
    PRINT '  ✓ e.V. eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Rechtsform] WHERE Code = 'GGMBH')
BEGIN
    INSERT INTO [Keytable].[Rechtsform] (Code) VALUES ('GGMBH');
    DECLARE @GgmbhId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[RechtsformUebersetzung] (RechtsformId, Sprache, Name) VALUES
        (@GgmbhId, 'tr', N'Kamu Yararına Limited Şirket (gGmbH)'),
        (@GgmbhId, 'de', N'Gemeinnützige GmbH (gGmbH)');
    PRINT '  ✓ gGmbH eklendi';
END

-- =============================================
-- 5. AdresseTyp (Adres Tipi)
-- =============================================
PRINT '5. AdresseTyp (Adres Tipi) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'HOME')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('HOME');
    DECLARE @HomeId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@HomeId, 'tr', N'Ev'),
        (@HomeId, 'de', N'Privat');
    PRINT '  ✓ Ev adresi eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'WORK')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('WORK');
    DECLARE @WorkId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@WorkId, 'tr', N'İş'),
        (@WorkId, 'de', N'Geschäftlich');
    PRINT '  ✓ İş adresi eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[AdresseTyp] WHERE Code = 'BILLING')
BEGIN
    INSERT INTO [Keytable].[AdresseTyp] (Code) VALUES ('BILLING');
    DECLARE @BillingId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[AdresseTypUebersetzung] (AdresseTypId, Sprache, Name) VALUES
        (@BillingId, 'tr', N'Fatura'),
        (@BillingId, 'de', N'Rechnungsadresse');
    PRINT '  ✓ Fatura adresi eklendi';
END

-- =============================================
-- 6. Kontotyp (Hesap Tipi)
-- =============================================
PRINT '6. Kontotyp (Hesap Tipi) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Kontotyp] WHERE Code = 'CHECKING')
BEGIN
    INSERT INTO [Keytable].[Kontotyp] (Code) VALUES ('CHECKING');
    DECLARE @CheckingId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[KontotypUebersetzung] (KontotypId, Sprache, Name) VALUES
        (@CheckingId, 'tr', N'Vadesiz Hesap'),
        (@CheckingId, 'de', N'Girokonto');
    PRINT '  ✓ Vadesiz hesap eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[Kontotyp] WHERE Code = 'SAVINGS')
BEGIN
    INSERT INTO [Keytable].[Kontotyp] (Code) VALUES ('SAVINGS');
    DECLARE @SavingsId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[KontotypUebersetzung] (KontotypId, Sprache, Name) VALUES
        (@SavingsId, 'tr', N'Tasarruf Hesabı'),
        (@SavingsId, 'de', N'Sparkonto');
    PRINT '  ✓ Tasarruf hesabı eklendi';
END

-- =============================================
-- 7. MitgliedFamilieStatus (Aile Üyesi Durumu)
-- =============================================
PRINT '7. MitgliedFamilieStatus (Aile Üyesi Durumu) ekleniyor...';

IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'ACTIVE')
BEGIN
    INSERT INTO [Keytable].[MitgliedFamilieStatus] (Code) VALUES ('ACTIVE');
    DECLARE @ActiveId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES
        (@ActiveId, 'tr', N'Aktif'),
        (@ActiveId, 'de', N'Aktiv');
    PRINT '  ✓ Aktif eklendi';
END

IF NOT EXISTS (SELECT 1 FROM [Keytable].[MitgliedFamilieStatus] WHERE Code = 'INACTIVE')
BEGIN
    INSERT INTO [Keytable].[MitgliedFamilieStatus] (Code) VALUES ('INACTIVE');
    DECLARE @InactiveId INT = SCOPE_IDENTITY();
    INSERT INTO [Keytable].[MitgliedFamilieStatusUebersetzung] (MitgliedFamilieStatusId, Sprache, Name) VALUES
        (@InactiveId, 'tr', N'Pasif'),
        (@InactiveId, 'de', N'Inaktiv');
    PRINT '  ✓ Pasif eklendi';
END

PRINT '';
PRINT '==============================================';
PRINT 'KEYTABLE SEED DATA BAŞARIYLA EKLENDİ!';
PRINT '==============================================';
PRINT '';
PRINT 'Eklenen Veriler:';
PRINT '  ✓ 5 Uyruk (TR, DE, AT, CH, FR)';
PRINT '  ✓ 4 Aidat Dönemi (Aylık, 3 Aylık, 6 Aylık, Yıllık)';
PRINT '  ✓ 3 Ödeme Günü Tipi';
PRINT '  ✓ 2 Hukuki Yapı (e.V., gGmbH)';
PRINT '  ✓ 3 Adres Tipi (Ev, İş, Fatura)';
PRINT '  ✓ 2 Hesap Tipi (Vadesiz, Tasarruf)';
PRINT '  ✓ 2 Aile Üyesi Durumu (Aktif, Pasif)';
PRINT '';
GO

