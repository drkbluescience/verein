-- =============================================
-- Aktiv Kolonlarını Ekle
-- =============================================
-- Bu script User, UserRole ve PageNote tablolarına
-- Aktiv kolonu ekler (eğer yoksa)
-- =============================================

USE [VereinDB];
GO

PRINT 'Aktiv kolonları ekleniyor...';
PRINT '';

-- User tablosuna Aktiv kolonu ekle
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
GO

-- UserRole tablosuna Aktiv kolonu ekle
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
GO

-- PageNote tablosuna Aktiv kolonu ekle
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
GO

PRINT '';
PRINT '✅ Aktiv kolonları başarıyla eklendi!';
PRINT '';

