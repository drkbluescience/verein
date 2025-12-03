-- =====================================================
-- Brief Schema and Tables Creation Script
-- Mektup/Mesaj Sistemi için veritabanı tabloları
-- =====================================================

USE VereinDB;
GO

-- Create Brief schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Brief')
BEGIN
    EXEC('CREATE SCHEMA Brief');
    PRINT 'Brief schema created.';
END
GO

-- =====================================================
-- 1. BriefVorlage Table (Letter Templates)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BriefVorlage' AND schema_id = SCHEMA_ID('Brief'))
BEGIN
    CREATE TABLE Brief.BriefVorlage (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        VereinId INT NOT NULL,
        Name NVARCHAR(150) NOT NULL,
        Beschreibung NVARCHAR(500) NULL,
        Betreff NVARCHAR(200) NOT NULL,
        Inhalt NVARCHAR(MAX) NOT NULL,
        Kategorie NVARCHAR(50) NULL,
        LogoPosition NVARCHAR(20) DEFAULT 'top',
        Schriftart NVARCHAR(50) DEFAULT 'Arial',
        Schriftgroesse INT DEFAULT 14,
        IstSystemvorlage BIT DEFAULT 0,
        IstAktiv BIT DEFAULT 1,
        Created DATETIME DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Modified DATETIME NULL,
        ModifiedBy INT NULL,
        DeletedFlag BIT DEFAULT 0,
        Aktiv BIT DEFAULT 1,
        CONSTRAINT FK_BriefVorlage_Verein FOREIGN KEY (VereinId) 
            REFERENCES Verein.Verein(Id) ON DELETE CASCADE
    );
    PRINT 'BriefVorlage table created.';

    -- Indexes
    CREATE INDEX IX_BriefVorlage_VereinId ON Brief.BriefVorlage(VereinId);
    CREATE INDEX IX_BriefVorlage_Kategorie ON Brief.BriefVorlage(Kategorie);
    CREATE INDEX IX_BriefVorlage_IstAktiv ON Brief.BriefVorlage(IstAktiv);
    CREATE INDEX IX_BriefVorlage_DeletedFlag ON Brief.BriefVorlage(DeletedFlag);
END
GO

-- =====================================================
-- 2. Brief Table (Letter Drafts)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Brief' AND schema_id = SCHEMA_ID('Brief'))
BEGIN
    CREATE TABLE Brief.Brief (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        VereinId INT NOT NULL,
        VorlageId INT NULL,
        Titel NVARCHAR(200) NOT NULL,
        Betreff NVARCHAR(200) NOT NULL,
        Inhalt NVARCHAR(MAX) NOT NULL,
        LogoUrl NVARCHAR(500) NULL,
        LogoPosition NVARCHAR(20) DEFAULT 'top',
        Schriftart NVARCHAR(50) DEFAULT 'Arial',
        Schriftgroesse INT DEFAULT 14,
        Status NVARCHAR(20) DEFAULT 'Entwurf',
        Created DATETIME DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Modified DATETIME NULL,
        ModifiedBy INT NULL,
        DeletedFlag BIT DEFAULT 0,
        Aktiv BIT DEFAULT 1,
        CONSTRAINT FK_Brief_Verein FOREIGN KEY (VereinId)
            REFERENCES Verein.Verein(Id) ON DELETE NO ACTION,
        CONSTRAINT FK_Brief_Vorlage FOREIGN KEY (VorlageId)
            REFERENCES Brief.BriefVorlage(Id) ON DELETE NO ACTION
    );
    PRINT 'Brief table created.';

    -- Indexes
    CREATE INDEX IX_Brief_VereinId ON Brief.Brief(VereinId);
    CREATE INDEX IX_Brief_VorlageId ON Brief.Brief(VorlageId);
    CREATE INDEX IX_Brief_Status ON Brief.Brief(Status);
    CREATE INDEX IX_Brief_DeletedFlag ON Brief.Brief(DeletedFlag);
    CREATE INDEX IX_Brief_Created ON Brief.Brief(Created DESC);
END
GO

-- =====================================================
-- 3. Nachricht Table (Sent Messages)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nachricht' AND schema_id = SCHEMA_ID('Brief'))
BEGIN
    CREATE TABLE Brief.Nachricht (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BriefId INT NOT NULL,
        VereinId INT NOT NULL,
        MitgliedId INT NOT NULL,
        Betreff NVARCHAR(200) NOT NULL,
        Inhalt NVARCHAR(MAX) NOT NULL,
        LogoUrl NVARCHAR(500) NULL,
        IstGelesen BIT DEFAULT 0,
        GelesenDatum DATETIME NULL,
        GesendetDatum DATETIME DEFAULT GETDATE(),
        DeletedFlag BIT DEFAULT 0,
        CONSTRAINT FK_Nachricht_Brief FOREIGN KEY (BriefId)
            REFERENCES Brief.Brief(Id) ON DELETE NO ACTION,
        CONSTRAINT FK_Nachricht_Verein FOREIGN KEY (VereinId)
            REFERENCES Verein.Verein(Id) ON DELETE NO ACTION,
        CONSTRAINT FK_Nachricht_Mitglied FOREIGN KEY (MitgliedId)
            REFERENCES Mitglied.Mitglied(Id) ON DELETE NO ACTION
    );
    PRINT 'Nachricht table created.';

    -- Indexes
    CREATE INDEX IX_Nachricht_BriefId ON Brief.Nachricht(BriefId);
    CREATE INDEX IX_Nachricht_VereinId ON Brief.Nachricht(VereinId);
    CREATE INDEX IX_Nachricht_MitgliedId ON Brief.Nachricht(MitgliedId);
    CREATE INDEX IX_Nachricht_IstGelesen ON Brief.Nachricht(IstGelesen);
    CREATE INDEX IX_Nachricht_GesendetDatum ON Brief.Nachricht(GesendetDatum DESC);
    CREATE INDEX IX_Nachricht_DeletedFlag ON Brief.Nachricht(DeletedFlag);
    -- Composite index for member inbox queries
    CREATE INDEX IX_Nachricht_MitgliedInbox ON Brief.Nachricht(MitgliedId, DeletedFlag, GesendetDatum DESC);
END
GO

PRINT '✅ Brief schema and tables created successfully!';
GO

