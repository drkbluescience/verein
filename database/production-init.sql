-- Verein Application Production Database Initialization Script
-- Üye Finans Sayfası Production Veritabanı Başlangıç Script'i

-- Create database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'VereinDB')
BEGIN
    CREATE DATABASE VereinDB;
    PRINT 'VereinDB database created successfully.';
END
ELSE
BEGIN
    PRINT 'VereinDB database already exists.';
END

GO

-- Use the database
USE VereinDB;
GO

-- Create schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'production')
BEGIN
    EXEC('CREATE SCHEMA production');
    PRINT 'Production schema created successfully.';
END
GO

-- Create performance monitoring tables
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PerformanceMetrics')
BEGIN
    CREATE TABLE production.PerformanceMetrics (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        MetricName NVARCHAR(100) NOT NULL,
        MetricValue DECIMAL(18,4) NOT NULL,
        MetricUnit NVARCHAR(50) NULL,
        Timestamp DATETIME2 DEFAULT GETUTCDATE(),
        Endpoint NVARCHAR(200) NULL,
        UserId INT NULL,
        AdditionalData NVARCHAR(MAX) NULL
    );
    
    CREATE INDEX IX_PerformanceMetrics_Timestamp ON production.PerformanceMetrics(Timestamp);
    CREATE INDEX IX_PerformanceMetrics_MetricName ON production.PerformanceMetrics(MetricName);
    
    PRINT 'PerformanceMetrics table created successfully.';
END
GO

-- Create error logging table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ErrorLogs')
BEGIN
    CREATE TABLE production.ErrorLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ErrorMessage NVARCHAR(MAX) NOT NULL,
        StackTrace NVARCHAR(MAX) NULL,
        Endpoint NVARCHAR(200) NULL,
        RequestMethod NVARCHAR(10) NULL,
        UserId INT NULL,
        Timestamp DATETIME2 DEFAULT GETUTCDATE(),
        Severity NVARCHAR(20) DEFAULT 'Error',
        UserAgent NVARCHAR(500) NULL,
        IPAddress NVARCHAR(45) NULL
    );
    
    CREATE INDEX IX_ErrorLogs_Timestamp ON production.ErrorLogs(Timestamp);
    CREATE INDEX IX_ErrorLogs_Severity ON production.ErrorLogs(Severity);
    
    PRINT 'ErrorLogs table created successfully.';
END
GO

-- Create audit log table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
BEGIN
    CREATE TABLE production.AuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Action NVARCHAR(100) NOT NULL,
        TableName NVARCHAR(100) NULL,
        RecordId INT NULL,
        OldValues NVARCHAR(MAX) NULL,
        NewValues NVARCHAR(MAX) NULL,
        UserId INT NULL,
        Timestamp DATETIME2 DEFAULT GETUTCDATE(),
        IPAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(500) NULL
    );
    
    CREATE INDEX IX_AuditLogs_Timestamp ON production.AuditLogs(Timestamp);
    CREATE INDEX IX_AuditLogs_Action ON production.AuditLogs(Action);
    CREATE INDEX IX_AuditLogs_TableName ON production.AuditLogs(TableName);
    
    PRINT 'AuditLogs table created successfully.';
END
GO

-- Create cache statistics table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CacheStatistics')
BEGIN
    CREATE TABLE production.CacheStatistics (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CacheKey NVARCHAR(200) NOT NULL,
        CacheHit BIT NOT NULL,
        CacheSize INT NULL,
        Timestamp DATETIME2 DEFAULT GETUTCDATE(),
        ExpirationTime DATETIME2 NULL,
        UserId INT NULL
    );
    
    CREATE INDEX IX_CacheStatistics_Timestamp ON production.CacheStatistics(Timestamp);
    CREATE INDEX IX_CacheStatistics_CacheKey ON production.CacheStatistics(CacheKey);
    
    PRINT 'CacheStatistics table created successfully.';
END
GO

-- Create user session tracking table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserSessions')
BEGIN
    CREATE TABLE production.UserSessions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        SessionToken NVARCHAR(500) NOT NULL,
        StartTime DATETIME2 DEFAULT GETUTCDATE(),
        LastActivity DATETIME2 DEFAULT GETUTCDATE(),
        IPAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(500) NULL,
        IsActive BIT DEFAULT 1,
        LogoutTime DATETIME2 NULL
    );
    
    CREATE INDEX IX_UserSessions_UserId ON production.UserSessions(UserId);
    CREATE INDEX IX_UserSessions_SessionToken ON production.UserSessions(SessionToken);
    CREATE INDEX IX_UserSessions_LastActivity ON production.UserSessions(LastActivity);
    
    PRINT 'UserSessions table created successfully.';
END
GO

-- Create stored procedures for performance monitoring
IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_LogPerformanceMetric')
BEGIN
    EXEC('
    CREATE PROCEDURE production.sp_LogPerformanceMetric
        @MetricName NVARCHAR(100),
        @MetricValue DECIMAL(18,4),
        @MetricUnit NVARCHAR(50) = NULL,
        @Endpoint NVARCHAR(200) = NULL,
        @UserId INT = NULL,
        @AdditionalData NVARCHAR(MAX) = NULL
    AS
    BEGIN
        SET NOCOUNT ON;
        
        INSERT INTO production.PerformanceMetrics (
            MetricName, MetricValue, MetricUnit, Endpoint, UserId, AdditionalData
        )
        VALUES (
            @MetricName, @MetricValue, @MetricUnit, @Endpoint, @UserId, @AdditionalData
        );
    END
    ');
    
    PRINT 'sp_LogPerformanceMetric stored procedure created successfully.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_LogError')
BEGIN
    EXEC('
    CREATE PROCEDURE production.sp_LogError
        @ErrorMessage NVARCHAR(MAX),
        @StackTrace NVARCHAR(MAX) = NULL,
        @Endpoint NVARCHAR(200) = NULL,
        @RequestMethod NVARCHAR(10) = NULL,
        @UserId INT = NULL,
        @Severity NVARCHAR(20) = ''Error'',
        @UserAgent NVARCHAR(500) = NULL,
        @IPAddress NVARCHAR(45) = NULL
    AS
    BEGIN
        SET NOCOUNT ON;
        
        INSERT INTO production.ErrorLogs (
            ErrorMessage, StackTrace, Endpoint, RequestMethod, UserId, Severity, UserAgent, IPAddress
        )
        VALUES (
            @ErrorMessage, @StackTrace, @Endpoint, @RequestMethod, @UserId, @Severity, @UserAgent, @IPAddress
        );
    END
    ');
    
    PRINT 'sp_LogError stored procedure created successfully.';
END
GO

-- Create functions for performance analytics
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'fn_GetAverageResponseTime' AND type = 'FN')
BEGIN
    EXEC('
    CREATE FUNCTION production.fn_GetAverageResponseTime(
        @StartTime DATETIME2,
        @EndTime DATETIME2,
        @Endpoint NVARCHAR(200) = NULL
    )
    RETURNS DECIMAL(18,4)
    AS
    BEGIN
        DECLARE @AvgResponseTime DECIMAL(18,4);
        
        IF @Endpoint IS NOT NULL
        BEGIN
            SELECT @AvgResponseTime = AVG(MetricValue)
            FROM production.PerformanceMetrics
            WHERE MetricName = ''ResponseTime''
            AND Timestamp BETWEEN @StartTime AND @EndTime
            AND Endpoint = @Endpoint;
        END
        ELSE
        BEGIN
            SELECT @AvgResponseTime = AVG(MetricValue)
            FROM production.PerformanceMetrics
            WHERE MetricName = ''ResponseTime''
            AND Timestamp BETWEEN @StartTime AND @EndTime;
        END
        
        RETURN ISNULL(@AvgResponseTime, 0);
    END
    ');
    
    PRINT 'fn_GetAverageResponseTime function created successfully.';
END
GO

-- Create views for monitoring dashboards
IF NOT EXISTS (SELECT * FROM sys.views WHERE name = 'vw_PerformanceSummary')
BEGIN
    EXEC('
    CREATE VIEW production.vw_PerformanceSummary
    AS
    SELECT 
        MetricName,
        Endpoint,
        COUNT(*) AS RequestCount,
        AVG(MetricValue) AS AverageValue,
        MIN(MetricValue) AS MinValue,
        MAX(MetricValue) AS MaxValue,
        MAX(Timestamp) AS LastRecorded
    FROM production.PerformanceMetrics
    WHERE Timestamp >= DATEADD(HOUR, -24, GETUTCDATE())
    GROUP BY MetricName, Endpoint;
    ');
    
    PRINT 'vw_PerformanceSummary view created successfully.';
END
GO

-- Create cleanup job for old logs
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_CleanupOldLogs' AND type = 'P')
BEGIN
    EXEC('
    CREATE PROCEDURE production.sp_CleanupOldLogs
        @RetentionDays INT = 30
    AS
    BEGIN
        SET NOCOUNT ON;
        
        DECLARE @CutoffDate DATETIME2 = DATEADD(DAY, -@RetentionDays, GETUTCDATE());
        
        -- Clean old performance metrics
        DELETE FROM production.PerformanceMetrics
        WHERE Timestamp < @CutoffDate;
        
        -- Clean old error logs
        DELETE FROM production.ErrorLogs
        WHERE Timestamp < @CutoffDate;
        
        -- Clean old audit logs
        DELETE FROM production.AuditLogs
        WHERE Timestamp < @CutoffDate;
        
        -- Clean old cache statistics
        DELETE FROM production.CacheStatistics
        WHERE Timestamp < @CutoffDate;
        
        -- Clean old user sessions
        DELETE FROM production.UserSessions
        WHERE LastActivity < @CutoffDate;
        
        PRINT CONCAT(''Old logs older than '', @RetentionDays, '' days cleaned up successfully.'');
    END
    ');
    
    PRINT 'sp_CleanupOldLogs stored procedure created successfully.';
END
GO

-- Apply performance indexes
PRINT 'Applying performance indexes...';

-- Check if performance indexes exist and apply them
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MitgliedForderung_MitgliedId_Status')
BEGIN
    PRINT 'Applying performance indexes from PERFORMANCE_INDEXES.sql...';
    -- Note: This will be applied separately during deployment
END
GO

-- Create database user for application if not exists
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'verein_app')
BEGIN
    CREATE USER verein_app FOR LOGIN verein_app;
    ALTER ROLE db_datareader ADD MEMBER verein_app;
    ALTER ROLE db_datawriter ADD MEMBER verein_app;
    ALTER ROLE db_ddladmin ADD MEMBER verein_app;
    
    -- Grant execute permissions on production stored procedures
    GRANT EXECUTE ON SCHEMA::production TO verein_app;
    
    PRINT 'Application user created successfully.';
END
GO

-- Set database options for performance
ALTER DATABASE VereinDB SET AUTO_CLOSE OFF;
ALTER DATABASE VereinDB SET AUTO_SHRINK OFF;
ALTER DATABASE VereinDB SET RECOVERY FULL;
ALTER DATABASE VereinDB SET PAGE_VERIFY CHECKSUM;
GO

PRINT 'Production database initialization completed successfully.';
PRINT 'Database: VereinDB';
PRINT 'User: verein_app';
PRINT 'Retention: 30 days for logs';
PRINT 'Monitoring: Enabled';