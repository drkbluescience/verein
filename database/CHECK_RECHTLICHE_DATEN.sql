-- ============================================================================
-- RechtlicheDaten Kontrol Script
-- ============================================================================
-- Bu script RechtlicheDaten tablosundaki verileri kontrol eder
-- ============================================================================

PRINT '🔍 RechtlicheDaten Tablosu Kontrol Ediliyor...';
PRINT '';

-- Tablo var mı kontrol et
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Verein].[RechtlicheDaten]') AND type in (N'U'))
BEGIN
    PRINT '✅ RechtlicheDaten tablosu mevcut';
    PRINT '';
    
    -- Kayıt sayısını göster
    DECLARE @RecordCount INT;
    SELECT @RecordCount = COUNT(*) FROM [Verein].[RechtlicheDaten] WHERE DeletedFlag = 0;
    PRINT '📊 Toplam Aktif Kayıt: ' + CAST(@RecordCount AS NVARCHAR(10));
    PRINT '';
    
    -- Tüm kayıtları göster
    IF @RecordCount > 0
    BEGIN
        PRINT '📋 Kayıtlar:';
        PRINT '';
        
        SELECT 
            rd.Id,
            rd.VereinId,
            v.Name AS VereinName,
            rd.RegistergerichtName,
            rd.RegistergerichtNummer,
            rd.FinanzamtName,
            rd.FinanzamtNummer,
            rd.GemeinnuetzigAnerkannt,
            rd.GemeinnuetzigkeitBis,
            rd.SteuererklaerungJahr,
            rd.DeletedFlag,
            rd.Created
        FROM [Verein].[RechtlicheDaten] rd
        LEFT JOIN [Verein].[Verein] v ON rd.VereinId = v.Id
        WHERE rd.DeletedFlag = 0
        ORDER BY rd.Id;
    END
    ELSE
    BEGIN
        PRINT '⚠️ Hiç kayıt bulunamadı!';
        PRINT '';
        PRINT '💡 Demo verileri eklemek için COMPLETE_DEMO_DATA.sql scriptini çalıştırın.';
    END
END
ELSE
BEGIN
    PRINT '❌ RechtlicheDaten tablosu bulunamadı!';
    PRINT '';
    PRINT '💡 Tabloyu oluşturmak için ADD_RECHTLICHE_DATEN_TABLE.sql scriptini çalıştırın.';
END

PRINT '';
PRINT '✅ Kontrol tamamlandı.';

