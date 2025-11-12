-- ============================================================================
-- VereinDB - RechtlicheDaten Tablosu Ekleme
-- ============================================================================
-- Bu dosya sadece RechtlicheDaten tablosunu ekler
-- Mevcut veritabanına eklemek için kullanılabilir
-- ============================================================================
-- ÖNEMLİ: Azure SQL Database kullanıyorsanız, bu scripti çalıştırmadan ÖNCE
-- VereinDB veritabanına bağlanın. USE komutu Azure'da desteklenmez.
-- ============================================================================

PRINT '';
PRINT '📋 RechtlicheDaten tablosu oluşturuluyor...';
GO

-- =============================================
-- Tablo Oluşturma
-- =============================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Verein].[RechtlicheDaten]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Verein].[RechtlicheDaten](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Created] [datetime] NULL DEFAULT GETDATE(),
        [CreatedBy] [int] NULL,
        [Modified] [datetime] NULL,
        [ModifiedBy] [int] NULL,
        [DeletedFlag] [bit] NULL DEFAULT 0,
        [VereinId] [int] NOT NULL,
        [RegistergerichtName] [nvarchar](200) NULL,
        [RegistergerichtNummer] [nvarchar](50) NULL,
        [RegistergerichtOrt] [nvarchar](100) NULL,
        [RegistergerichtEintragungsdatum] [date] NULL,
        [FinanzamtName] [nvarchar](200) NULL,
        [FinanzamtNummer] [nvarchar](50) NULL,
        [FinanzamtOrt] [nvarchar](100) NULL,
        [Steuerpflichtig] [bit] NULL DEFAULT 1,
        [Steuerbefreit] [bit] NULL DEFAULT 0,
        [GemeinnuetzigAnerkannt] [bit] NULL DEFAULT 0,
        [GemeinnuetzigkeitBis] [date] NULL,
        [SteuererklaerungPfad] [nvarchar](500) NULL,
        [SteuererklaerungJahr] [int] NULL,
        [SteuerbefreiungPfad] [nvarchar](500) NULL,
        [GemeinnuetzigkeitsbescheidPfad] [nvarchar](500) NULL,
        [RegisterauszugPfad] [nvarchar](500) NULL,
        [Bemerkung] [nvarchar](1000) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
        WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    
    PRINT '  ✓ RechtlicheDaten tablosu oluşturuldu';
END
ELSE
BEGIN
    PRINT '  ⚠ RechtlicheDaten tablosu zaten mevcut';
END
GO

-- =============================================
-- Foreign Key Constraint
-- =============================================

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[Verein].[FK_RechtlicheDaten_Verein]'))
BEGIN
    ALTER TABLE [Verein].[RechtlicheDaten] WITH CHECK 
    ADD CONSTRAINT [FK_RechtlicheDaten_Verein] 
    FOREIGN KEY([VereinId])
    REFERENCES [Verein].[Verein] ([Id])
    ON DELETE CASCADE
    
    ALTER TABLE [Verein].[RechtlicheDaten] 
    CHECK CONSTRAINT [FK_RechtlicheDaten_Verein]
    
    PRINT '  ✓ Foreign Key constraint eklendi';
END
GO

-- =============================================
-- Indexes
-- =============================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RechtlicheDaten_VereinId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_RechtlicheDaten_VereinId] 
    ON [Verein].[RechtlicheDaten]([VereinId] ASC)
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    
    PRINT '  ✓ VereinId index eklendi';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RechtlicheDaten_DeletedFlag')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_RechtlicheDaten_DeletedFlag] 
    ON [Verein].[RechtlicheDaten]([DeletedFlag] ASC)
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    
    PRINT '  ✓ DeletedFlag index eklendi';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RechtlicheDaten_VereinId_Unique')
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_RechtlicheDaten_VereinId_Unique] 
    ON [Verein].[RechtlicheDaten]([VereinId] ASC)
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    
    PRINT '  ✓ Unique VereinId index eklendi';
END
GO

PRINT '';
PRINT '✅ RechtlicheDaten tablosu başarıyla eklendi!';
PRINT '';
GO

