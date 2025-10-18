-- =============================================
-- DEMO VERİLERİNİ TEMİZLE
-- =============================================
-- Bu dosya demo/test verilerini temizler
-- UYARI: Bu işlem geri alınamaz!
-- =============================================

USE [VEREIN];
GO

PRINT '==============================================';
PRINT 'DEMO VERİLERİ TEMİZLENİYOR...';
PRINT '==============================================';
PRINT '';

-- =============================================
-- 1. AİLE İLİŞKİLERİNİ SİL
-- =============================================

PRINT '1. Aile ilişkileri siliniyor...';

DECLARE @DeletedFamilyCount INT;

DELETE FROM [Mitglied].[MitgliedFamilie]
WHERE VereinId IN (
    SELECT Id FROM [Verein].[Verein] 
    WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
);

SET @DeletedFamilyCount = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@DeletedFamilyCount AS VARCHAR(10)) + ' aile ilişkisi silindi';
GO

-- =============================================
-- 2. ETKİNLİK KAYITLARINI SİL
-- =============================================

PRINT '2. Etkinlik kayıtları siliniyor...';

DECLARE @DeletedRegistrationCount INT;

DELETE FROM [Verein].[VeranstaltungAnmeldung]
WHERE VeranstaltungId IN (
    SELECT Id FROM [Verein].[Veranstaltung]
    WHERE VereinId IN (
        SELECT Id FROM [Verein].[Verein] 
        WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
    )
);

SET @DeletedRegistrationCount = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@DeletedRegistrationCount AS VARCHAR(10)) + ' etkinlik kaydı silindi';
GO

-- =============================================
-- 3. ETKİNLİKLERİ SİL
-- =============================================

PRINT '3. Etkinlikler siliniyor...';

DECLARE @DeletedEventCount INT;

DELETE FROM [Verein].[Veranstaltung]
WHERE VereinId IN (
    SELECT Id FROM [Verein].[Verein] 
    WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
);

SET @DeletedEventCount = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@DeletedEventCount AS VARCHAR(10)) + ' etkinlik silindi';
GO

-- =============================================
-- 4. ÜYELERİ SİL
-- =============================================

PRINT '4. Üyeler siliniyor...';

DECLARE @DeletedMemberCount INT;

DELETE FROM [Mitglied].[Mitglied]
WHERE VereinId IN (
    SELECT Id FROM [Verein].[Verein] 
    WHERE Kurzname IN (N'TDKV München', N'DTF Berlin')
);

SET @DeletedMemberCount = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@DeletedMemberCount AS VARCHAR(10)) + ' üye silindi';
GO

-- =============================================
-- 5. DERNEKLERİ SİL
-- =============================================

PRINT '5. Dernekler siliniyor...';

DECLARE @DeletedVereinCount INT;

DELETE FROM [Verein].[Verein]
WHERE Kurzname IN (N'TDKV München', N'DTF Berlin');

SET @DeletedVereinCount = @@ROWCOUNT;
PRINT '  ✓ ' + CAST(@DeletedVereinCount AS VARCHAR(10)) + ' dernek silindi';
GO

-- =============================================
-- 6. KEYTABLE VERİLERİNİ SİL (OPSİYONEL)
-- =============================================

PRINT '6. Keytable verileri kontrol ediliyor...';

-- Not: Keytable verilerini silmiyoruz çünkü başka veriler de kullanıyor olabilir
-- Eğer silmek isterseniz aşağıdaki satırların başındaki -- işaretini kaldırın

-- DELETE FROM [Keytable].[Geschlecht] WHERE Code IN ('M', 'F');
-- DELETE FROM [Keytable].[MitgliedStatus] WHERE Code = 'AKTIV';
-- DELETE FROM [Keytable].[MitgliedTyp] WHERE Code = 'VOLLMITGLIED';

PRINT '  ℹ Keytable verileri korundu (başka veriler kullanıyor olabilir)';
GO

PRINT '';
PRINT '==============================================';
PRINT 'DEMO VERİLERİ TEMİZLENDİ!';
PRINT '==============================================';
PRINT '';
PRINT 'Özet:';
PRINT '  ✓ Aile ilişkileri silindi';
PRINT '  ✓ Etkinlik kayıtları silindi';
PRINT '  ✓ Etkinlikler silindi';
PRINT '  ✓ Üyeler silindi';
PRINT '  ✓ Dernekler silindi';
PRINT '';
PRINT 'Şimdi DEMO_DATA.sql dosyasını çalıştırabilirsiniz.';
PRINT '';

