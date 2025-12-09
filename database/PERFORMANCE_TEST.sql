-- =============================================
-- PERFORMANCE TEST SCRIPT
-- =============================================
-- Date: 2025-12-08
-- Description: Test query performance after optimization

PRINT 'Starting performance tests...';
GO

-- Test 1: Member Finance Summary Query (Most Critical)
PRINT 'Test 1: Member Finance Summary Query';
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

-- Test with a sample member ID (change as needed)
DECLARE @testMitgliedId INT = 1;
DECLARE @startTime DATETIME2;
DECLARE @endTime DATETIME2;

SET @startTime = SYSDATETIME();

-- This is the exact query from GetMitgliedFinanzSummaryAsync
SELECT 
    mf.MitgliedId,
    COUNT(mf.Id) as TotalForderungen,
    SUM(mf.Betrag) as TotalForderungBetrag,
    SUM(CASE WHEN mf.StatusId = 1 THEN mf.Betrag ELSE 0 END) as TotalBezahlt,
    SUM(CASE WHEN mf.StatusId = 2 THEN mf.Betrag ELSE 0 END) as TotalOffen,
    SUM(CASE WHEN mf.StatusId = 2 AND mf.Faelligkeit < CAST(GETDATE() AS DATE) THEN mf.Betrag ELSE 0 END) as TotalUeberfaellig,
    COUNT(mz.Id) as TotalZahlungen,
    SUM(mz.Betrag) as TotalZahlungBetrag,
    COUNT(vz.Id) as TotalVeranstaltungZahlungen,
    SUM(vz.Betrag) as TotalVeranstaltungBetrag
FROM Finanz.MitgliedForderung mf
LEFT JOIN Finanz.MitgliedZahlung mz ON mf.MitgliedId = mz.MitgliedId AND mz.DeletedFlag = 0
LEFT JOIN Finanz.VeranstaltungZahlung vz ON mf.MitgliedId = vz.MitgliedId AND vz.DeletedFlag = 0
WHERE mf.MitgliedId = @testMitgliedId AND mf.DeletedFlag = 0
GROUP BY mf.MitgliedId;

SET @endTime = SYSDATETIME();

PRINT 'Query Execution Time: ' + CAST(DATEDIFF(MILLISECOND, @startTime, @endTime) AS VARCHAR) + ' ms';
PRINT 'Logical Reads: ' + CAST(@@ROWCOUNT AS VARCHAR);
GO

-- Test 2: Payment History with Pagination
PRINT 'Test 2: Payment History with Pagination';
SET @startTime = SYSDATETIME();

-- Simulate pagination query
SELECT TOP 20
    mz.Id,
    mz.Betrag,
    mz.Zahlungsdatum,
    mz.Zahlungsweg,
    mz.Referenz,
    mz.Bemerkung
FROM Finanz.MitgliedZahlung mz
WHERE mz.MitgliedId = @testMitgliedId AND mz.DeletedFlag = 0
ORDER BY mz.Zahlungsdatum DESC;

SET @endTime = SYSDATETIME();

PRINT 'Payment Query Execution Time: ' + CAST(DATEDIFF(MILLISECOND, @startTime, @endTime) AS VARCHAR) + ' ms';
GO

-- Test 3: Index Usage Check
PRINT 'Test 3: Index Usage Analysis';

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
    s.last_user_lookup,
    s.system_seeks,
    s.system_scans,
    s.system_lookups
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE i.name LIKE 'IX_%' AND OBJECT_NAME(i.object_id) IN (
    'MitgliedForderung', 'MitgliedZahlung', 'VeranstaltungZahlung', 
    'Mitglied', 'Veranstaltung', 'Verein', 'Bankkonto', 'BankBuchung', 'VereinDitibZahlung'
)
ORDER BY TableName, IndexName;
GO

-- Test 4: Missing Indexes Check
PRINT 'Test 4: Missing Indexes Analysis';

SELECT 
    OBJECT_NAME(s.object_id) AS TableName,
    s.total_logical_reads,
    s.total_logical_writes,
    s.total_physical_reads,
    s.total_elapsed_time,
    s.total_elapsed_time / 1000.0 AS TotalElapsedSeconds,
    CASE 
        WHEN s.total_elapsed_time > 0 
        THEN (s.total_logical_reads * 8.0 / 1024.0) / (s.total_elapsed_time / 1000.0)
        ELSE 0 
    END AS LogicalReadsPerSecond
FROM sys.dm_db_index_usage_stats s
WHERE OBJECT_NAME(s.object_id) IN (
    'MitgliedForderung', 'MitgliedZahlung', 'VeranstaltungZahlung', 
    'Mitglied', 'Veranstaltung', 'Verein', 'Bankkonto', 'BankBuchung', 'VereinDitibZahlung'
)
AND s.total_elapsed_time > 0
ORDER BY s.total_elapsed_time DESC;
GO

-- Test 5: Fragmentation Check
PRINT 'Test 5: Index Fragmentation Analysis';

SELECT 
    OBJECT_NAME(ind.object_id) AS TableName,
    ind.name AS IndexName,
    index_type_desc AS IndexType,
    avg_fragmentation_in_percent,
    page_count,
    fragment_count,
    forwarded_record_count
FROM sys.dm_db_index_physical_stats (DATABASE_ID) AS ind
INNER JOIN sys.indexes AS i ON ind.object_id = i.object_id AND ind.index_id = i.index_id
WHERE OBJECT_NAME(ind.object_id) IN (
    'MitgliedForderung', 'MitgliedZahlung', 'VeranstaltungZahlung', 
    'Mitglied', 'Veranstaltung', 'Verein', 'Bankkonto', 'BankBuchung', 'VereinDitibZahlung'
)
AND ind.avg_fragmentation_in_percent > 5.0 -- Show indexes with >5% fragmentation
ORDER BY avg_fragmentation_in_percent DESC;
GO

PRINT '';
PRINT '========================================';
PRINT 'Performance tests completed!';
PRINT '========================================';
PRINT '';
PRINT 'Results Analysis:';
PRINT '1. Check query execution times - should be <100ms for optimized queries';
PRINT '2. Index usage should show seeks instead of scans';
PRINT '3. Fragmentation should be <10% for optimal performance';
PRINT '4. Logical reads should be minimized';
PRINT '';
GO

-- Reset statistics
SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO