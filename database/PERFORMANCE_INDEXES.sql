-- =============================================
-- PERFORMANCE INDEXES FOR FINANZ MODULE
-- =============================================
-- Date: 2025-12-08
-- Description: Performance optimization indexes for member finance page
-- Target: Improve query performance for large datasets (1000+ members)

PRINT 'Creating performance indexes for Finanz module...';
GO

-- Set proper options for index creation
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

-- =============================================
-- MITGLIEDFORDERUNG INDEXES
-- =============================================
-- Composite index for member finance summary queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedForderung_MitgliedId_VereinId_StatusId')
BEGIN
    PRINT 'Creating IX_MitgliedForderung_MitgliedId_VereinId_StatusId...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedForderung_MitgliedId_VereinId_StatusId] 
    ON [Finanz].[MitgliedForderung] ([MitgliedId], [VereinId], [StatusId])
    INCLUDE ([Betrag], [Faelligkeit], [BezahltAm], [Jahr], [Monat], [Beschreibung])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedForderung_MitgliedId_VereinId_StatusId created';
END
GO

-- Index for payment status filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedForderung_StatusId_Faelligkeit')
BEGIN
    PRINT 'Creating IX_MitgliedForderung_StatusId_Faelligkeit...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedForderung_StatusId_Faelligkeit] 
    ON [Finanz].[MitgliedForderung] ([StatusId], [Faelligkeit])
    INCLUDE ([MitgliedId], [VereinId], [Betrag])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedForderung_StatusId_Faelligkeit created';
END
GO

-- Index for annual/monthly reporting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedForderung_Jahr_Monat_VereinId')
BEGIN
    PRINT 'Creating IX_MitgliedForderung_Jahr_Monat_VereinId...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedForderung_Jahr_Monat_VereinId] 
    ON [Finanz].[MitgliedForderung] ([Jahr], [Monat], [VereinId])
    INCLUDE ([MitgliedId], [StatusId], [Betrag])
    WHERE [DeletedFlag] = 0 AND [Jahr] IS NOT NULL
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedForderung_Jahr_Monat_VereinId created';
END
GO

-- =============================================
-- MITGLIEDZAHLUNG INDEXES
-- =============================================
-- Composite index for member payment history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedZahlung_MitgliedId_VereinId_Zahlungsdatum')
BEGIN
    PRINT 'Creating IX_MitgliedZahlung_MitgliedId_VereinId_Zahlungsdatum...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedZahlung_MitgliedId_VereinId_Zahlungsdatum] 
    ON [Finanz].[MitgliedZahlung] ([MitgliedId], [VereinId], [Zahlungsdatum] DESC)
    INCLUDE ([Betrag], [Zahlungsweg], [Referenz], [Bemerkung], [StatusId], [ForderungId])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedZahlung_MitgliedId_VereinId_Zahlungsdatum created';
END
GO

-- Index for payment type filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedZahlung_ZahlungTypId_StatusId')
BEGIN
    PRINT 'Creating IX_MitgliedZahlung_ZahlungTypId_StatusId...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedZahlung_ZahlungTypId_StatusId] 
    ON [Finanz].[MitgliedZahlung] ([ZahlungTypId], [StatusId])
    INCLUDE ([MitgliedId], [VereinId], [Betrag], [Zahlungsdatum])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedZahlung_ZahlungTypId_StatusId created';
END
GO

-- Index for payment method analysis
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedZahlung_Zahlungsweg_Zahlungsdatum')
BEGIN
    PRINT 'Creating IX_MitgliedZahlung_Zahlungsweg_Zahlungsdatum...';
    CREATE NONCLUSTERED INDEX [IX_MitgliedZahlung_Zahlungsweg_Zahlungsdatum] 
    ON [Finanz].[MitgliedZahlung] ([Zahlungsweg], [Zahlungsdatum] DESC)
    INCLUDE ([MitgliedId], [VereinId], [Betrag])
    WHERE [DeletedFlag] = 0 AND [Zahlungsweg] IS NOT NULL
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_MitgliedZahlung_Zahlungsweg_Zahlungsdatum created';
END
GO

-- =============================================
-- VERANSTALTUNGZAHLUNG INDEXES
-- =============================================
-- Index for event payment history by member
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_VeranstaltungZahlung_VeranstaltungId_AnmeldungId_Zahlungsdatum')
BEGIN
    PRINT 'Creating IX_VeranstaltungZahlung_VeranstaltungId_AnmeldungId_Zahlungsdatum...';
    CREATE NONCLUSTERED INDEX [IX_VeranstaltungZahlung_VeranstaltungId_AnmeldungId_Zahlungsdatum] 
    ON [Finanz].[VeranstaltungZahlung] ([VeranstaltungId], [AnmeldungId], [Zahlungsdatum] DESC)
    INCLUDE ([Betrag], [Zahlungsweg], [Referenz], [StatusId], [Name], [Email])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_VeranstaltungZahlung_VeranstaltungId_AnmeldungId_Zahlungsdatum created';
END
GO

-- Index for event payment status tracking
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_VeranstaltungZahlung_StatusId_Zahlungsdatum')
BEGIN
    PRINT 'Creating IX_VeranstaltungZahlung_StatusId_Zahlungsdatum...';
    CREATE NONCLUSTERED INDEX [IX_VeranstaltungZahlung_StatusId_Zahlungsdatum] 
    ON [Finanz].[VeranstaltungZahlung] ([StatusId], [Zahlungsdatum] DESC)
    INCLUDE ([VeranstaltungId], [Betrag])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_VeranstaltungZahlung_StatusId_Zahlungsdatum created';
END
GO

-- =============================================
-- MITGLIED INDEXES
-- =============================================
-- Index for member lookup by Verein and status
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Mitglied_VereinId_MitgliedStatusId_Aktiv')
BEGIN
    PRINT 'Creating IX_Mitglied_VereinId_MitgliedStatusId_Aktiv...';
    CREATE NONCLUSTERED INDEX [IX_Mitglied_VereinId_MitgliedStatusId_Aktiv] 
    ON [Mitglied].[Mitglied] ([VereinId], [MitgliedStatusId], [Aktiv])
    INCLUDE ([Vorname], [Nachname], [Email], [Mitgliedsnummer], [BeitragBetrag])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Mitglied_VereinId_MitgliedStatusId_Aktiv created';
END
GO

-- Index for member search by name
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Mitglied_Nachname_Vorname_VereinId')
BEGIN
    PRINT 'Creating IX_Mitglied_Nachname_Vorname_VereinId...';
    CREATE NONCLUSTERED INDEX [IX_Mitglied_Nachname_Vorname_VereinId] 
    ON [Mitglied].[Mitglied] ([Nachname], [Vorname], [VereinId])
    INCLUDE ([Mitgliedsnummer], [Email], [MitgliedStatusId])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Mitglied_Nachname_Vorname_VereinId created';
END
GO

-- =============================================
-- VERANSTALTUNG INDEXES
-- =============================================
-- Index for active events by Verein
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Veranstaltung_VereinId_Aktiv_Beginn')
BEGIN
    PRINT 'Creating IX_Veranstaltung_VereinId_Aktiv_Beginn...';
    CREATE NONCLUSTERED INDEX [IX_Veranstaltung_VereinId_Aktiv_Beginn] 
    ON [Verein].[Veranstaltung] ([VereinId], [Aktiv], [Beginn] DESC)
    INCLUDE ([Titel], [Beschreibung], [Preis], [Ort], [NurFuerMitglieder], [AnmeldeErforderlich])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Veranstaltung_VereinId_Aktiv_Beginn created';
END
GO

-- Index for event date range queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Veranstaltung_Beginn_Ende_VereinId')
BEGIN
    PRINT 'Creating IX_Veranstaltung_Beginn_Ende_VereinId...';
    CREATE NONCLUSTERED INDEX [IX_Veranstaltung_Beginn_Ende_VereinId] 
    ON [Verein].[Veranstaltung] ([Beginn], [Ende], [VereinId])
    INCLUDE ([Titel], [Aktiv])
    WHERE [DeletedFlag] = 0 AND [Aktiv] = 1
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Veranstaltung_Beginn_Ende_VereinId created';
END
GO

-- =============================================
-- VEREIN INDEXES
-- =============================================
-- Index for Verein lookup
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Verein_Aktiv_Name')
BEGIN
    PRINT 'Creating IX_Verein_Aktiv_Name...';
    CREATE NONCLUSTERED INDEX [IX_Verein_Aktiv_Name] 
    ON [Verein].[Verein] ([Aktiv], [Name])
    INCLUDE ([Kurzname], [Vereinsnummer], [Email])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Verein_Aktiv_Name created';
END
GO

-- =============================================
-- BANKKONTO INDEXES
-- =============================================
-- Index for active bank accounts by Verein
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bankkonto_VereinId_Aktiv_IstStandard')
BEGIN
    PRINT 'Creating IX_Bankkonto_VereinId_Aktiv_IstStandard...';
    CREATE NONCLUSTERED INDEX [IX_Bankkonto_VereinId_Aktiv_IstStandard] 
    ON [Verein].[Bankkonto] ([VereinId], [Aktiv], [IstStandard])
    INCLUDE ([IBAN], [Kontoinhaber], [Bankname], [KontotypId])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_Bankkonto_VereinId_Aktiv_IstStandard created';
END
GO

-- =============================================
-- BANKBUCHUNG INDEXES
-- =============================================
-- Index for bank transaction history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BankBuchung_VereinId_BankKontoId_Buchungsdatum')
BEGIN
    PRINT 'Creating IX_BankBuchung_VereinId_BankKontoId_Buchungsdatum...';
    CREATE NONCLUSTERED INDEX [IX_BankBuchung_VereinId_BankKontoId_Buchungsdatum] 
    ON [Finanz].[BankBuchung] ([VereinId], [BankKontoId], [Buchungsdatum] DESC)
    INCLUDE ([Betrag], [Empfaenger], [Verwendungszweck], [Referenz], [StatusId])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_BankBuchung_VereinId_BankKontoId_Buchungsdatum created';
END
GO

-- =============================================
-- VEREINDITIBZAHLUNG INDEXES
-- =============================================
-- Index for DITIB payment tracking
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_VereinDitibZahlung_VereinId_Zahlungsdatum_Zahlungsperiode')
BEGIN
    PRINT 'Creating IX_VereinDitibZahlung_VereinId_Zahlungsdatum_Zahlungsperiode...';
    CREATE NONCLUSTERED INDEX [IX_VereinDitibZahlung_VereinId_Zahlungsdatum_Zahlungsperiode] 
    ON [Finanz].[VereinDitibZahlung] ([VereinId], [Zahlungsdatum] DESC, [Zahlungsperiode])
    INCLUDE ([Betrag], [Zahlungsweg], [Referenz], [StatusId])
    WHERE [DeletedFlag] = 0
    WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];
    PRINT '✓ IX_VereinDitibZahlung_VereinId_Zahlungsdatum_Zahlungsperiode created';
END
GO

-- =============================================
-- STATISTICS UPDATE
-- =============================================
PRINT 'Updating statistics for all new indexes...';
GO

UPDATE STATISTICS [Finanz].[MitgliedForderung];
UPDATE STATISTICS [Finanz].[MitgliedZahlung];
UPDATE STATISTICS [Finanz].[VeranstaltungZahlung];
UPDATE STATISTICS [Mitglied].[Mitglied];
UPDATE STATISTICS [Verein].[Veranstaltung];
UPDATE STATISTICS [Verein].[Verein];
UPDATE STATISTICS [Verein].[Bankkonto];
UPDATE STATISTICS [Finanz].[BankBuchung];
UPDATE STATISTICS [Finanz].[VereinDitibZahlung];
GO

PRINT '';
PRINT '========================================';
PRINT 'Performance indexes created successfully!';
PRINT '========================================';
PRINT '';
PRINT 'Indexes created for:';
PRINT '- MitgliedForderung queries (member demands)';
PRINT '- MitgliedZahlung queries (member payments)';
PRINT '- VeranstaltungZahlung queries (event payments)';
PRINT '- Mitglied lookup and search';
PRINT '- Veranstaltung filtering';
PRINT '- Verein and Bankkonto lookups';
PRINT '- BankBuchung transaction history';
PRINT '- VereinDitibZahlung tracking';
PRINT '';
PRINT 'These indexes will improve performance for:';
PRINT '- Member finance summary queries';
PRINT '- Payment history lookups';
PRINT '- Financial reporting';
PRINT '- Member search and filtering';
PRINT '- Event payment tracking';
PRINT '';
GO

-- =============================================
-- PERFORMANCE MONITORING QUERY
-- =============================================
-- Query to check index usage and performance
PRINT 'Creating performance monitoring query...';
GO

/*
-- Monitor index usage after implementation:
SELECT 
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates,
    s.last_user_seek,
    s.last_user_scan,
    s.last_user_lookup
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE i.name LIKE 'IX_%' AND OBJECT_NAME(i.object_id) IN (
    'MitgliedForderung', 'MitgliedZahlung', 'VeranstaltungZahlung', 
    'Mitglied', 'Veranstaltung', 'Verein', 'Bankkonto', 'BankBuchung', 'VereinDitibZahlung'
)
ORDER BY TableName, IndexName;
*/
GO

PRINT '✓ Performance monitoring query ready';
PRINT '✓ All performance indexes created successfully!';
GO