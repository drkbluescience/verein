-- ============================================================================
-- VEREIN - CLEAN ALL DATA
-- ============================================================================
-- Bu dosya veritabanındaki TÜM verileri siler
-- ⚠️ UYARI: Bu işlem GERİ ALINAMAZ! Lütfen dikkatli kullanın!
-- ============================================================================

-- ÖNEMLİ: Azure SQL Database'de USE komutu desteklenmez!
-- Bu scripti çalıştırmadan ÖNCE VereinDB veritabanına bağlanın
-- USE [VEREIN];
-- GO

PRINT '╔════════════════════════════════════════════════════════════════╗';
PRINT '║         ⚠️  TÜÜN VERİTABANI VERİLERİ SİLİNİYOR...             ║';
PRINT '║         Bu işlem GERİ ALINAMAZ!                               ║';
PRINT '╚════════════════════════════════════════════════════════════════╝';
PRINT '';
GO

-- ============================================================================
-- ADIM 1: FOREIGN KEY CONSTRAINTS'İ GEÇICI OLARAK DEVRE DIŞI BIRAKTıRMA
-- ============================================================================

PRINT '🔧 Foreign Key Constraints devre dışı bırakılıyor...';
GO

ALTER TABLE [Verein].[VeranstaltungAnmeldung] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Verein].[Veranstaltung] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Mitglied].[MitgliedFamilie] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Mitglied].[Mitglied] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Verein].[Verein] NOCHECK CONSTRAINT ALL;

PRINT '   ✓ Foreign Key Constraints devre dışı bırakıldı';
GO

-- ============================================================================
-- ADIM 2: DEMO VERİLERİNİ SİL (Child Tables Önce)
-- ============================================================================

PRINT '';
PRINT '📋 DEMO VERİLERİ SİLİNİYOR...';
PRINT '';

-- ============================================================================
-- 1. FINANZ ÖDEME TAHSISLERINI SİL (MitgliedForderungZahlung)
-- ============================================================================
PRINT '1️⃣  Finanz ödeme tahsisleri siliniyor...';

DECLARE @DeletedForderungZahlungCount INT = 0;

DELETE FROM [Finanz].[MitgliedForderungZahlung];
SET @DeletedForderungZahlungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedForderungZahlungCount AS VARCHAR(10)) + ' ödeme tahsisi silindi';
GO

-- ============================================================================
-- 2. FINANZ ÖDEME AVANSLARINI SİL (MitgliedVorauszahlung)
-- ============================================================================
PRINT '2️⃣  Finanz ödeme avansları siliniyor...';

DECLARE @DeletedVorauszahlungCount INT = 0;

DELETE FROM [Finanz].[MitgliedVorauszahlung];
SET @DeletedVorauszahlungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedVorauszahlungCount AS VARCHAR(10)) + ' ödeme avansı silindi';
GO

-- ============================================================================
-- 3. FINANZ ÖDEMELERİNİ SİL (MitgliedZahlung)
-- ============================================================================
PRINT '3️⃣  Finanz ödemeleri siliniyor...';

DECLARE @DeletedZahlungCount INT = 0;

DELETE FROM [Finanz].[MitgliedZahlung];
SET @DeletedZahlungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedZahlungCount AS VARCHAR(10)) + ' ödeme silindi';
GO

-- ============================================================================
-- 4. FINANZ TALEPLERI SİL (MitgliedForderung)
-- ============================================================================
PRINT '4️⃣  Finanz talepleri siliniyor...';

DECLARE @DeletedForderungCount INT = 0;

DELETE FROM [Finanz].[MitgliedForderung];
SET @DeletedForderungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedForderungCount AS VARCHAR(10)) + ' talep silindi';
GO

-- ============================================================================
-- 5. FINANZ BANKA HAREKETLERİNİ SİL (BankBuchung)
-- ============================================================================
PRINT '5️⃣  Finanz banka hareketleri siliniyor...';

DECLARE @DeletedBankBuchungCount INT = 0;

DELETE FROM [Finanz].[BankBuchung];
SET @DeletedBankBuchungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedBankBuchungCount AS VARCHAR(10)) + ' banka hareketi silindi';
GO

-- ============================================================================
-- 6. ETKİNLİK ÖDEMELERİNİ SİL (VeranstaltungZahlung)
-- ============================================================================
PRINT '6️⃣  Etkinlik ödemeleri siliniyor...';

DECLARE @DeletedVeranstaltungZahlungCount INT = 0;

DELETE FROM [Finanz].[VeranstaltungZahlung];
SET @DeletedVeranstaltungZahlungCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedVeranstaltungZahlungCount AS VARCHAR(10)) + ' etkinlik ödemesi silindi';
GO

-- ============================================================================
-- 7. ETKİNLİK RESİMLERİNİ SİL (VeranstaltungBild)
-- ============================================================================
PRINT '7️⃣  Etkinlik resimleri siliniyor...';

DECLARE @DeletedVeranstaltungBildCount INT = 0;

DELETE FROM [Verein].[VeranstaltungBild];
SET @DeletedVeranstaltungBildCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedVeranstaltungBildCount AS VARCHAR(10)) + ' etkinlik resmi silindi';
GO

-- ============================================================================
-- 8. ETKİNLİK KAYITLARINI SİL (VeranstaltungAnmeldung)
-- ============================================================================
PRINT '8️⃣  Etkinlik kayıtları siliniyor...';

DECLARE @DeletedRegistrationCount INT = 0;

DELETE FROM [Verein].[VeranstaltungAnmeldung];
SET @DeletedRegistrationCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedRegistrationCount AS VARCHAR(10)) + ' etkinlik kaydı silindi';
GO

-- ============================================================================
-- 9. ETKİNLİKLERİ SİL (Veranstaltung)
-- ============================================================================
PRINT '9️⃣  Etkinlikler siliniyor...';

DECLARE @DeletedEventCount INT = 0;

DELETE FROM [Verein].[Veranstaltung];
SET @DeletedEventCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedEventCount AS VARCHAR(10)) + ' etkinlik silindi';
GO

-- ============================================================================
-- 🔟 ÜYE ADRESLERİNİ SİL (MitgliedAdresse)
-- ============================================================================
PRINT '🔟 Üye adresleri siliniyor...';

DECLARE @DeletedMitgliedAdresseCount INT = 0;

DELETE FROM [Mitglied].[MitgliedAdresse];
SET @DeletedMitgliedAdresseCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedMitgliedAdresseCount AS VARCHAR(10)) + ' üye adresi silindi';
GO

-- ============================================================================
-- 1️⃣1️⃣ AİLE İLİŞKİLERİNİ SİL (MitgliedFamilie)
-- ============================================================================
PRINT '1️⃣1️⃣ Aile ilişkileri siliniyor...';

DECLARE @DeletedFamilyCount INT = 0;

DELETE FROM [Mitglied].[MitgliedFamilie];
SET @DeletedFamilyCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedFamilyCount AS VARCHAR(10)) + ' aile ilişkisi silindi';
GO

-- ============================================================================
-- 1️⃣2️⃣ KULLANICI ROLLERİNİ SİL (UserRole) - User'dan önce!
-- ============================================================================
PRINT '1️⃣2️⃣ Kullanıcı rolleri siliniyor...';

DECLARE @DeletedUserRoleCount INT = 0;

DELETE FROM [Web].[UserRole];
SET @DeletedUserRoleCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedUserRoleCount AS VARCHAR(10)) + ' kullanıcı rolü silindi';
GO

-- ============================================================================
-- 1️⃣3️⃣ KULLANICILARI SİL (User)
-- ============================================================================
PRINT '1️⃣3️⃣ Kullanıcılar siliniyor...';

DECLARE @DeletedUserCount INT = 0;

DELETE FROM [Web].[User];
SET @DeletedUserCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedUserCount AS VARCHAR(10)) + ' kullanıcı silindi';
GO

-- ============================================================================
-- 1️⃣4️⃣ ÜYELERİ SİL (Mitglied)
-- ============================================================================
PRINT '1️⃣4️⃣ Üyeler siliniyor...';

DECLARE @DeletedMemberCount INT = 0;

DELETE FROM [Mitglied].[Mitglied];
SET @DeletedMemberCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedMemberCount AS VARCHAR(10)) + ' üye silindi';
GO

-- ============================================================================
-- 1️⃣5️⃣ BANKA HESAPLARINI SİL (Bankkonto)
-- ============================================================================
PRINT '1️⃣5️⃣ Banka hesapları siliniyor...';

DECLARE @DeletedBankkontoCount INT = 0;

DELETE FROM [Verein].[Bankkonto];
SET @DeletedBankkontoCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedBankkontoCount AS VARCHAR(10)) + ' banka hesabı silindi';
GO

-- ============================================================================
-- 1️⃣6️⃣ SAYFA NOTLARINI SİL (PageNote)
-- ============================================================================
PRINT '1️⃣6️⃣ Sayfa notları siliniyor...';

DECLARE @DeletedPageNoteCount INT = 0;

DELETE FROM [Web].[PageNote];
SET @DeletedPageNoteCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedPageNoteCount AS VARCHAR(10)) + ' sayfa notu silindi';
GO

-- ============================================================================
-- 1️⃣7️⃣ DERNEK YASAL VERİLERİNİ SİL (RechtlicheDaten)
-- ============================================================================
PRINT '1️⃣7️⃣ Dernek yasal verileri siliniyor...';

DECLARE @DeletedRechtlicheDatenCount INT = 0;

DELETE FROM [Verein].[RechtlicheDaten];
SET @DeletedRechtlicheDatenCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedRechtlicheDatenCount AS VARCHAR(10)) + ' yasal veri silindi';
GO

-- ============================================================================
-- 1️⃣8️⃣ DERNEKLERİ SİL (Verein)
-- ============================================================================
PRINT '1️⃣8️⃣ Dernekler siliniyor...';

DECLARE @DeletedVereinCount INT = 0;

DELETE FROM [Verein].[Verein];
SET @DeletedVereinCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedVereinCount AS VARCHAR(10)) + ' dernek silindi';
GO

-- ============================================================================
-- 1️⃣9️⃣ ADRESLERİ SİL (Adresse)
-- ============================================================================
PRINT '1️⃣9️⃣ Adresler siliniyor...';

DECLARE @DeletedAdresseCount INT = 0;

DELETE FROM [Verein].[Adresse];
SET @DeletedAdresseCount = @@ROWCOUNT;

PRINT '   ✓ ' + CAST(@DeletedAdresseCount AS VARCHAR(10)) + ' adres silindi';
GO

-- ============================================================================
-- ADIM 3: KEYTABLE ÇEVIRI VERİLERİNİ SİL
-- ============================================================================

PRINT '';
PRINT '🗑️  KEYTABLE ÇEVIRI VERİLERİ SİLİNİYOR...';
PRINT '';

PRINT '6️⃣  Keytable çeviri tabloları siliniyor...';

DELETE FROM [Keytable].[GeschlechtUebersetzung];
DELETE FROM [Keytable].[MitgliedStatusUebersetzung];
DELETE FROM [Keytable].[MitgliedTypUebersetzung];
DELETE FROM [Keytable].[WaehrungUebersetzung];
DELETE FROM [Keytable].[ZahlungTypUebersetzung];
DELETE FROM [Keytable].[ZahlungStatusUebersetzung];
DELETE FROM [Keytable].[ForderungsartUebersetzung];
DELETE FROM [Keytable].[ForderungsstatusUebersetzung];
DELETE FROM [Keytable].[FamilienbeziehungTypUebersetzung];
DELETE FROM [Keytable].[MitgliedFamilieStatusUebersetzung];
DELETE FROM [Keytable].[BeitragPeriodeUebersetzung];
DELETE FROM [Keytable].[BeitragZahlungstagTypUebersetzung];
DELETE FROM [Keytable].[StaatsangehoerigkeitUebersetzung];
DELETE FROM [Keytable].[AdresseTypUebersetzung];
DELETE FROM [Keytable].[KontotypUebersetzung];
DELETE FROM [Keytable].[RechtsformUebersetzung];

PRINT '   ✓ Tüm Keytable çeviri tabloları silindi';
GO

-- ============================================================================
-- ADIM 4: KEYTABLE ANA VERİLERİNİ SİL
-- ============================================================================

PRINT '7️⃣  Keytable ana tabloları siliniyor...';

DELETE FROM [Keytable].[Geschlecht];
DELETE FROM [Keytable].[MitgliedStatus];
DELETE FROM [Keytable].[MitgliedTyp];
DELETE FROM [Keytable].[Waehrung];
DELETE FROM [Keytable].[ZahlungTyp];
DELETE FROM [Keytable].[ZahlungStatus];
DELETE FROM [Keytable].[Forderungsart];
DELETE FROM [Keytable].[Forderungsstatus];
DELETE FROM [Keytable].[FamilienbeziehungTyp];
DELETE FROM [Keytable].[MitgliedFamilieStatus];
DELETE FROM [Keytable].[BeitragPeriode];
DELETE FROM [Keytable].[BeitragZahlungstagTyp];
DELETE FROM [Keytable].[Staatsangehoerigkeit];
DELETE FROM [Keytable].[AdresseTyp];
DELETE FROM [Keytable].[Kontotyp];
DELETE FROM [Keytable].[Rechtsform];

PRINT '   ✓ Tüm Keytable ana tabloları silindi';
GO

-- ============================================================================
-- ADIM 5: FOREIGN KEY CONSTRAINTS'İ YENİDEN ETKINLEŞTIR
-- ============================================================================

PRINT '';
PRINT '🔧 Foreign Key Constraints yeniden etkinleştiriliyor...';
GO

ALTER TABLE [Verein].[VeranstaltungAnmeldung] CHECK CONSTRAINT ALL;
ALTER TABLE [Verein].[Veranstaltung] CHECK CONSTRAINT ALL;
ALTER TABLE [Mitglied].[MitgliedFamilie] CHECK CONSTRAINT ALL;
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT ALL;
ALTER TABLE [Verein].[Verein] CHECK CONSTRAINT ALL;

PRINT '   ✓ Foreign Key Constraints yeniden etkinleştirildi';
GO

-- ============================================================================
-- ADIM 6: IDENTITY SEED'İ SIFIRLA
-- ============================================================================

PRINT '';
PRINT '🔄 IDENTITY Seed değerleri sıfırlanıyor...';
GO

-- Verein Schema
DBCC CHECKIDENT ('[Verein].[Verein]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[Adresse]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[RechtlicheDaten]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[Bankkonto]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[Veranstaltung]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[VeranstaltungAnmeldung]', RESEED, 0);
DBCC CHECKIDENT ('[Verein].[VeranstaltungBild]', RESEED, 0);

-- Web Schema
DBCC CHECKIDENT ('[Web].[User]', RESEED, 0);
DBCC CHECKIDENT ('[Web].[UserRole]', RESEED, 0);
DBCC CHECKIDENT ('[Web].[PageNote]', RESEED, 0);

-- Mitglied Schema
DBCC CHECKIDENT ('[Mitglied].[Mitglied]', RESEED, 0);
DBCC CHECKIDENT ('[Mitglied].[MitgliedAdresse]', RESEED, 0);
DBCC CHECKIDENT ('[Mitglied].[MitgliedFamilie]', RESEED, 0);

-- Finanz Schema
DBCC CHECKIDENT ('[Finanz].[BankBuchung]', RESEED, 0);
DBCC CHECKIDENT ('[Finanz].[MitgliedForderung]', RESEED, 0);
DBCC CHECKIDENT ('[Finanz].[MitgliedZahlung]', RESEED, 0);
DBCC CHECKIDENT ('[Finanz].[MitgliedForderungZahlung]', RESEED, 0);
DBCC CHECKIDENT ('[Finanz].[MitgliedVorauszahlung]', RESEED, 0);
DBCC CHECKIDENT ('[Finanz].[VeranstaltungZahlung]', RESEED, 0);

-- Keytable Schema
DBCC CHECKIDENT ('[Keytable].[Geschlecht]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[MitgliedStatus]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[MitgliedTyp]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Waehrung]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[ZahlungTyp]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[ZahlungStatus]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Forderungsart]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Forderungsstatus]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[FamilienbeziehungTyp]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[MitgliedFamilieStatus]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Staatsangehoerigkeit]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[AdresseTyp]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Kontotyp]', RESEED, 0);
DBCC CHECKIDENT ('[Keytable].[Rechtsform]', RESEED, 0);

PRINT '   ✓ IDENTITY Seed değerleri sıfırlandı';
GO

-- ============================================================================
-- ADIM 7: KONTROL SORGUSU - VERİLERİN SİLİNDİĞİNİ DOĞRULA
-- ============================================================================

PRINT '';
PRINT '🔍 KONTROL SORGUSU ÇALIŞTIRILIYYOR...';
PRINT '';

SELECT 'Verein' as Tablo, COUNT(*) as Kayıt_Sayısı FROM [Verein].[Verein]
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
SELECT 'Forderungsart', COUNT(*) FROM [Keytable].[Forderungsart]
UNION ALL
SELECT 'Forderungsstatus', COUNT(*) FROM [Keytable].[Forderungsstatus]
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
ORDER BY Tablo;

-- ============================================================================
-- ÖZET
-- ============================================================================

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════╗';
PRINT '║         ✅ TÜM VERİTABANI VERİLERİ SİLİNDİ!                   ║';
PRINT '╚════════════════════════════════════════════════════════════════╝';
PRINT '';
PRINT '📊 SİLİNEN VERİLER:';
PRINT '';
PRINT '   📋 DEMO VERİLERİ:';
PRINT '      ✓ Finanz Ödeme Tahsisleri (MitgliedForderungZahlung)';
PRINT '      ✓ Finanz Ödeme Avansları (MitgliedVorauszahlung)';
PRINT '      ✓ Finanz Ödemeleri (MitgliedZahlung)';
PRINT '      ✓ Finanz Talepleri (MitgliedForderung)';
PRINT '      ✓ Finanz Banka Hareketleri (BankBuchung)';
PRINT '      ✓ Finanz Etkinlik Ödemeleri (VeranstaltungZahlung)';
PRINT '      ✓ Etkinlik Resimleri (VeranstaltungBild)';
PRINT '      ✓ Etkinlik Kayıtları (VeranstaltungAnmeldung)';
PRINT '      ✓ Etkinlikler (Veranstaltung)';
PRINT '      ✓ Üye Adresleri (MitgliedAdresse)';
PRINT '      ✓ Aile İlişkileri (MitgliedFamilie)';
PRINT '      ✓ Kullanıcı Rolleri (UserRole)';
PRINT '      ✓ Kullanıcılar (User)';
PRINT '      ✓ Üyeler (Mitglied)';
PRINT '      ✓ Banka Hesapları (Bankkonto)';
PRINT '      ✓ Sayfa Notları (PageNote)';
PRINT '      ✓ Dernek Yasal Verileri (RechtlicheDaten)';
PRINT '      ✓ Dernekler (Verein)';
PRINT '      ✓ Adresler (Adresse)';
PRINT '';
PRINT '   🗑️  KEYTABLE VERİLERİ:';
PRINT '      ✓ Tüm Keytable Çeviri Verileri (16 tablo)';
PRINT '      ✓ Tüm Keytable Ana Verileri (16 tablo)';
PRINT '';
PRINT '🔄 IDENTITY Seed değerleri sıfırlandı (27 tablo)';
PRINT '🔧 Foreign Key Constraints yeniden etkinleştirildi';
PRINT '';
PRINT '💡 Şimdi COMPLETE_DEMO_DATA.sql dosyasını çalıştırabilirsiniz.';
PRINT '';
GO

