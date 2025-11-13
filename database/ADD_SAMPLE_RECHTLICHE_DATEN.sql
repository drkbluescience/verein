-- ============================================================================
-- RechtlicheDaten Örnek Veri Ekleme
-- ============================================================================
-- Bu script mevcut derneklere örnek yasal bilgiler ekler
-- ============================================================================

PRINT '📝 RechtlicheDaten Örnek Verileri Ekleniyor...';
PRINT '';

-- Önce mevcut RechtlicheDaten kayıtlarını kontrol et
DECLARE @ExistingCount INT;
SELECT @ExistingCount = COUNT(*) FROM [Verein].[RechtlicheDaten] WHERE DeletedFlag = 0;

IF @ExistingCount > 0
BEGIN
    PRINT '⚠️ Zaten ' + CAST(@ExistingCount AS NVARCHAR(10)) + ' adet RechtlicheDaten kaydı mevcut.';
    PRINT '💡 Mevcut kayıtları silmek için önce CLEAN_ALL_DATA.sql çalıştırın.';
    PRINT '';
END

-- Verein ID'lerini al
DECLARE @VereinId1 INT, @VereinId2 INT;

SELECT TOP 1 @VereinId1 = Id FROM [Verein].[Verein] WHERE DeletedFlag = 0 ORDER BY Id;
SELECT TOP 1 @VereinId2 = Id FROM [Verein].[Verein] WHERE DeletedFlag = 0 AND Id != @VereinId1 ORDER BY Id;

IF @VereinId1 IS NULL
BEGIN
    PRINT '❌ Hiç Verein kaydı bulunamadı!';
    PRINT '💡 Önce COMPLETE_DEMO_DATA.sql ile demo verileri ekleyin.';
    RETURN;
END

PRINT '📋 Verein ID: ' + CAST(@VereinId1 AS NVARCHAR(10));
IF @VereinId2 IS NOT NULL
    PRINT '📋 Verein ID: ' + CAST(@VereinId2 AS NVARCHAR(10));
PRINT '';

-- İlk Verein için RechtlicheDaten ekle (eğer yoksa)
IF NOT EXISTS (SELECT 1 FROM [Verein].[RechtlicheDaten] WHERE VereinId = @VereinId1 AND DeletedFlag = 0)
BEGIN
    INSERT INTO [Verein].[RechtlicheDaten] (
        VereinId,
        RegistergerichtName, RegistergerichtNummer, RegistergerichtOrt, RegistergerichtEintragungsdatum,
        FinanzamtName, FinanzamtNummer, FinanzamtOrt,
        Steuerpflichtig, Steuerbefreit, GemeinnuetzigAnerkannt, GemeinnuetzigkeitBis,
        SteuererklaerungJahr,
        DeletedFlag, Created, CreatedBy
    ) VALUES (
        @VereinId1,
        N'Amtsgericht München',
        N'VR 12345',
        N'München',
        '1985-03-15',
        N'Finanzamt München',
        N'143/123/45678',
        N'München',
        0,  -- Steuerpflichtig: Hayır
        1,  -- Steuerbefreit: Evet
        1,  -- GemeinnuetzigAnerkannt: Evet
        '2025-12-31',
        2024,
        0,  -- DeletedFlag
        GETDATE(),
        1   -- CreatedBy: Admin
    );
    
    PRINT '✅ Verein ID ' + CAST(@VereinId1 AS NVARCHAR(10)) + ' için RechtlicheDaten eklendi';
END
ELSE
BEGIN
    PRINT '⚠️ Verein ID ' + CAST(@VereinId1 AS NVARCHAR(10)) + ' için RechtlicheDaten zaten mevcut';
END

-- İkinci Verein için RechtlicheDaten ekle (eğer varsa ve yoksa)
IF @VereinId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [Verein].[RechtlicheDaten] WHERE VereinId = @VereinId2 AND DeletedFlag = 0)
BEGIN
    INSERT INTO [Verein].[RechtlicheDaten] (
        VereinId,
        RegistergerichtName, RegistergerichtNummer, RegistergerichtOrt, RegistergerichtEintragungsdatum,
        FinanzamtName, FinanzamtNummer, FinanzamtOrt,
        Steuerpflichtig, Steuerbefreit, GemeinnuetzigAnerkannt, GemeinnuetzigkeitBis,
        SteuererklaerungJahr,
        DeletedFlag, Created, CreatedBy
    ) VALUES (
        @VereinId2,
        N'Amtsgericht Charlottenburg',
        N'VR 67890',
        N'Berlin',
        '1992-08-22',
        N'Finanzamt Berlin-Charlottenburg',
        N'27/456/78901',
        N'Berlin',
        0,  -- Steuerpflichtig: Hayır
        1,  -- Steuerbefreit: Evet
        1,  -- GemeinnuetzigAnerkannt: Evet
        '2025-12-31',
        2024,
        0,  -- DeletedFlag
        GETDATE(),
        1   -- CreatedBy: Admin
    );
    
    PRINT '✅ Verein ID ' + CAST(@VereinId2 AS NVARCHAR(10)) + ' için RechtlicheDaten eklendi';
END
ELSE IF @VereinId2 IS NOT NULL
BEGIN
    PRINT '⚠️ Verein ID ' + CAST(@VereinId2 AS NVARCHAR(10)) + ' için RechtlicheDaten zaten mevcut';
END

PRINT '';
PRINT '✅ İşlem tamamlandı.';
PRINT '';
PRINT '🔍 Kontrol için CHECK_RECHTLICHE_DATEN.sql scriptini çalıştırabilirsiniz.';

