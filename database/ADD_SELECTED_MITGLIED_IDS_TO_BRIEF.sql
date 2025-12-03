-- =====================================================
-- Add SelectedMitgliedIds column to Brief table
-- This column stores selected member IDs as JSON for draft letters
-- =====================================================

USE VereinDB;
GO

-- Add SelectedMitgliedIds column if not exists
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('Brief.Brief') 
    AND name = 'SelectedMitgliedIds'
)
BEGIN
    ALTER TABLE Brief.Brief
    ADD SelectedMitgliedIds NVARCHAR(MAX) NULL;
    
    PRINT '✅ SelectedMitgliedIds column added to Brief.Brief table';
END
ELSE
BEGIN
    PRINT 'ℹ️ SelectedMitgliedIds column already exists in Brief.Brief table';
END
GO

