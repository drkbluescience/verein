-- Add UserType column to PageNote table
USE [VereinDB];
GO

-- Check if column exists
IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[Web].[PageNote]') 
    AND name = 'UserType'
)
BEGIN
    ALTER TABLE [Web].[PageNote]
    ADD [UserType] NVARCHAR(50) NULL;
    
    PRINT '✅ UserType column added to Web.PageNote table';
END
ELSE
BEGIN
    PRINT '⚠️ UserType column already exists in Web.PageNote table';
END
GO

