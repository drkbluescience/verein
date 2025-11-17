-- Add Aktiv column to PageNote table
USE VereinDB;
GO

-- Check if column exists, if not add it
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
    
    PRINT '✓ Aktiv column added to PageNote table';
END
ELSE
BEGIN
    PRINT '✓ Aktiv column already exists in PageNote table';
END
GO

-- Update existing records to have Aktiv = 1
UPDATE [Web].[PageNote]
SET [Aktiv] = 1
WHERE [Aktiv] IS NULL;

PRINT '✓ Updated existing PageNote records';
GO

