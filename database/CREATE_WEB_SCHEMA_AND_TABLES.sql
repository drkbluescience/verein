-- =============================================
-- Script: Create Web Schema and User Tables
-- Description: Creates Web schema and User/UserRole tables for Azure SQL Database
-- Date: 2025-11-24
-- =============================================

-- Create Web schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Web')
BEGIN
    EXEC('CREATE SCHEMA [Web]')
    PRINT 'Web schema created successfully'
END
ELSE
BEGIN
    PRINT 'Web schema already exists'
END
GO

-- =============================================
-- Create Web.User Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Web].[User]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Web].[User](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Created] [datetime] NULL,
        [CreatedBy] [int] NULL,
        [Modified] [datetime] NULL,
        [ModifiedBy] [int] NULL,
        [DeletedFlag] [bit] NULL DEFAULT 0,

        -- Authentication
        [Email] [nvarchar](100) NOT NULL,
        [PasswordHash] [nvarchar](255) NULL,

        -- Personal Information
        [Vorname] [nvarchar](100) NOT NULL,
        [Nachname] [nvarchar](100) NOT NULL,

        -- Status
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [EmailConfirmed] [bit] NOT NULL DEFAULT 0,
        [LastLogin] [datetime] NULL,

        -- Security
        [FailedLoginAttempts] [int] NOT NULL DEFAULT 0,
        [LockoutEnd] [datetime] NULL,

        -- Aktiv flag (for compatibility)
        [Aktiv] [bit] NULL DEFAULT 1,

    PRIMARY KEY CLUSTERED ([Id] ASC),
    UNIQUE NONCLUSTERED ([Email] ASC)
    )
    PRINT 'Web.User table created successfully'
END
ELSE
BEGIN
    PRINT 'Web.User table already exists'
END
GO

-- =============================================
-- Create Web.UserRole Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Web].[UserRole]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Web].[UserRole](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Created] [datetime] NULL,
        [CreatedBy] [int] NULL,
        [Modified] [datetime] NULL,
        [ModifiedBy] [int] NULL,
        [DeletedFlag] [bit] NULL DEFAULT 0,

        -- User Reference
        [UserId] [int] NOT NULL,

        -- Role Type
        [RoleType] [nvarchar](20) NOT NULL,

        -- Optional References
        [MitgliedId] [int] NULL,
        [VereinId] [int] NULL,

        -- Validity Period
        [GueltigVon] [date] NOT NULL DEFAULT GETDATE(),
        [GueltigBis] [date] NULL,

        -- Status
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [Aktiv] [bit] NULL DEFAULT 1,

        -- Notes
        [Bemerkung] [nvarchar](250) NULL,

    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([UserId]) REFERENCES [Web].[User]([Id]) ON DELETE CASCADE
    )
    PRINT 'Web.UserRole table created successfully'
END
ELSE
BEGIN
    PRINT 'Web.UserRole table already exists'
END
GO

-- =============================================
-- Create Indexes
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_User_Email_Unique' AND object_id = OBJECT_ID('[Web].[User]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_User_Email_Unique] ON [Web].[User]([Email] ASC)
    PRINT 'Index IX_User_Email_Unique created'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_User_IsActive' AND object_id = OBJECT_ID('[Web].[User]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_User_IsActive] ON [Web].[User]([IsActive] ASC)
    PRINT 'Index IX_User_IsActive created'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_User_DeletedFlag' AND object_id = OBJECT_ID('[Web].[User]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_User_DeletedFlag] ON [Web].[User]([DeletedFlag] ASC)
    PRINT 'Index IX_User_DeletedFlag created'
END
GO

PRINT '✅ All Web schema tables and indexes created successfully!'

