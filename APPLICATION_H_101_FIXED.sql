/****** Object:  Database [VEREIN]    Script Date: 23.08.2025 - FIXED VERSION ******/
-- VEREIN Database - Düzeltilmiş ve Tamamlanmış Versiyon
-- Bu dosya APPLICATION_H_101.sql dosyasının düzeltilmiş versiyonudur
-- Düzeltilen sorunlar:
-- 1. Naming convention standardizasyonu (İngilizce kolonlar)
-- 2. Eksik tablo tanımları tamamlandı
-- 3. Foreign key ilişkileri eklendi
-- 4. Performans indexleri eklendi
-- 5. Eksik tablolar eklendi (Audit, Log, vb.)

CREATE DATABASE [VEREIN]  (EDITION = 'Standard', SERVICE_OBJECTIVE = 'ElasticPool', MAXSIZE = 250 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS, LEDGER = OFF;
GO
ALTER DATABASE [VEREIN] SET COMPATIBILITY_LEVEL = 160
GO
ALTER DATABASE [VEREIN] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [VEREIN] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [VEREIN] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [VEREIN] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [VEREIN] SET ARITHABORT OFF 
GO
ALTER DATABASE [VEREIN] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [VEREIN] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [VEREIN] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [VEREIN] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [VEREIN] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [VEREIN] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [VEREIN] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [VEREIN] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [VEREIN] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [VEREIN] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [VEREIN] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [VEREIN] SET  MULTI_USER 
GO
ALTER DATABASE [VEREIN] SET ENCRYPTION ON
GO
ALTER DATABASE [VEREIN] SET QUERY_STORE = ON
GO
ALTER DATABASE [VEREIN] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 100, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/*** Die Skripts für datenbankweit gültige Konfigurationen in Azure müssen innerhalb der Zieldatenbankverbindung ausgeführt werden. ***/
GO
-- ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
GO

-- =============================================
-- SCHEMA CREATION
-- =============================================

/****** Object:  Schema [Bank]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Bank]
GO
/****** Object:  Schema [Finanz]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Finanz]
GO
/****** Object:  Schema [Keytable]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Keytable]
GO
/****** Object:  Schema [Logs]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Logs]
GO
/****** Object:  Schema [Mitglied]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Mitglied]
GO
/****** Object:  Schema [Stammdaten]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Stammdaten]
GO
/****** Object:  Schema [Todesfall]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Todesfall]
GO
/****** Object:  Schema [Verein]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Verein]
GO
/****** Object:  Schema [Web]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Web]
GO
/****** Object:  Schema [Xbackups]    Script Date: 23.08.2025 ******/
CREATE SCHEMA [Xbackups]
GO

-- =============================================
-- AUDIT AND LOG TABLES (Yeni Eklenen)
-- =============================================

/****** Object:  Table [Logs].[AuditLog]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logs].[AuditLog](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[TableName] [nvarchar](100) NOT NULL,
	[RecordId] [int] NOT NULL,
	[Action] [nvarchar](10) NOT NULL, -- INSERT, UPDATE, DELETE
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[UserId] [int] NULL,
	[UserName] [nvarchar](100) NULL,
	[Timestamp] [datetime2] NOT NULL DEFAULT GETDATE(),
	[IPAddress] [nvarchar](45) NULL,
	[UserAgent] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [Logs].[SystemLog]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logs].[SystemLog](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Level] [nvarchar](10) NOT NULL, -- INFO, WARN, ERROR, DEBUG
	[Message] [nvarchar](max) NOT NULL,
	[Exception] [nvarchar](max) NULL,
	[Source] [nvarchar](100) NULL,
	[UserId] [int] NULL,
	[Timestamp] [datetime2] NOT NULL DEFAULT GETDATE(),
	[Properties] [nvarchar](max) NULL, -- JSON format
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- KEYTABLE TABLES (Düzeltilmiş Naming Convention)
-- =============================================

/****** Object:  Table [Keytable].[AddressType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AddressType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[AddressTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AddressTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AddressTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[AddressTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ContributionPeriod]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ContributionPeriod](
	[Code] [nvarchar](20) NOT NULL,
	[SortOrder] [int] NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[MonthsCount] [int] NULL, -- Kaç aylık periyot (1=Aylık, 3=Üç aylık, 12=Yıllık)
PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ContributionPeriodTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ContributionPeriodTranslation](
	[ContributionPeriodCode] [nvarchar](20) NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[Description] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[ContributionPeriodCode] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ContributionPaymentDayType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ContributionPaymentDayType](
	[Code] [nvarchar](20) NOT NULL,
	[SortOrder] [int] NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ContributionPaymentDayTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ContributionPaymentDayTypeTranslation](
	[Code] [nvarchar](20) NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[Description] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Code] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[FamilyRelationType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[FamilyRelationType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[FamilyRelationTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[FamilyRelationTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FamilyRelationTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[FamilyRelationTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ClaimType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ClaimType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ClaimTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ClaimTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClaimTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[ClaimTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ClaimStatus]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ClaimStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[IsFinalStatus] [bit] NOT NULL DEFAULT 0, -- Son durum mu (ödendi, iptal edildi vb.)
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[ClaimStatusTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ClaimStatusTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClaimStatusId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[ClaimStatusId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[Gender]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Gender](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[GenderTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[GenderTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GenderId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[GenderId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[AccountType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AccountType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[AccountTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AccountTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[AccountTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberFamilyStatus]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberFamilyStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberFamilyStatusTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberFamilyStatusTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MemberFamilyStatusId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[MemberFamilyStatusId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberStatus]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[IsDefaultStatus] [bit] NOT NULL DEFAULT 0, -- Varsayılan durum mu
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberStatusTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberStatusTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MemberStatusId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[MemberStatusId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[HasContributionObligation] [bit] NOT NULL DEFAULT 1, -- Aidat yükümlülüğü var mı
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[MemberTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MemberTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MemberTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[MemberTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[LegalForm]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[LegalForm](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[LegalFormTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[LegalFormTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[LegalFormId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[LegalFormId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[Nationality]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Nationality](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Iso2] [char](2) NOT NULL,
	[Iso3] [char](3) NOT NULL,
	[NumericCode] [int] NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Iso3] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Iso2] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[NationalityTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[NationalityTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NationalityId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[OfficialName] [nvarchar](150) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[NationalityId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[Currency]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Currency](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[Symbol] [nvarchar](5) NULL,
	[DecimalPlaces] [int] NOT NULL DEFAULT 2,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[IsBaseCurrency] [bit] NOT NULL DEFAULT 0, -- Ana para birimi mi
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[CurrencyTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[CurrencyTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CurrencyId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[CurrencyId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[PaymentStatus]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[PaymentStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[IsFinalStatus] [bit] NOT NULL DEFAULT 0, -- Son durum mu
	[IsSuccessStatus] [bit] NOT NULL DEFAULT 0, -- Başarılı durum mu
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[PaymentStatusTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[PaymentStatusTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PaymentStatusId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[PaymentStatusId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[PaymentType]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[PaymentType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](30) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[RequiresBankAccount] [bit] NOT NULL DEFAULT 0, -- Banka hesabı gerektirir mi
	[IsAutomaticPayment] [bit] NOT NULL DEFAULT 0, -- Otomatik ödeme mi
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[PaymentTypeTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[PaymentTypeTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PaymentTypeId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[PaymentTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- MAIN BUSINESS TABLES (Düzeltilmiş Naming Convention)
-- =============================================

/****** Object:  Table [Verein].[Association]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Association](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[Name] [nvarchar](200) NOT NULL,
	[ShortName] [nvarchar](50) NULL,
	[AssociationNumber] [nvarchar](30) NULL,
	[TaxNumber] [nvarchar](30) NULL,
	[LegalFormId] [int] NULL,
	[FoundingDate] [date] NULL,
	[Purpose] [nvarchar](500) NULL,
	[MainAddressId] [int] NULL,
	[MainBankAccountId] [int] NULL,
	[Phone] [nvarchar](30) NULL,
	[Fax] [nvarchar](30) NULL,
	[Email] [nvarchar](100) NULL,
	[Website] [nvarchar](200) NULL,
	[SocialMediaLinks] [nvarchar](500) NULL,
	[ChairmanName] [nvarchar](100) NULL,
	[ManagerName] [nvarchar](100) NULL,
	[RepresentativeEmail] [nvarchar](100) NULL,
	[ContactPersonName] [nvarchar](100) NULL,
	[MemberCount] [int] NULL,
	[StatutePath] [nvarchar](200) NULL,
	[LogoPath] [nvarchar](200) NULL,
	[ExternalReferenceId] [nvarchar](50) NULL,
	[ClientCode] [nvarchar](50) NULL,
	[EPostReceiveAddress] [nvarchar](100) NULL,
	[SEPACreditorId] [nvarchar](50) NULL,
	[VATNumber] [nvarchar](30) NULL,
	[ElectronicSignatureKey] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Verein].[Address]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Address](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NULL,
	[AddressTypeId] [int] NULL,
	[Street] [nvarchar](100) NULL,
	[HouseNumber] [nvarchar](10) NULL,
	[AddressAddition] [nvarchar](100) NULL,
	[PostalCode] [nvarchar](10) NULL,
	[City] [nvarchar](100) NULL,
	[District] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[POBox] [nvarchar](30) NULL,
	[PhoneNumber] [nvarchar](30) NULL,
	[FaxNumber] [nvarchar](30) NULL,
	[Email] [nvarchar](100) NULL,
	[ContactPerson] [nvarchar](100) NULL,
	[Notes] [nvarchar](250) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[ValidFrom] [date] NULL,
	[ValidTo] [date] NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[IsDefault] [bit] NOT NULL DEFAULT 0,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Verein].[BankAccount]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[BankAccount](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[AccountTypeId] [int] NULL,
	[IBAN] [nvarchar](34) NOT NULL,
	[BIC] [nvarchar](20) NULL,
	[AccountHolder] [nvarchar](100) NULL,
	[BankName] [nvarchar](100) NULL,
	[AccountNumber] [nvarchar](30) NULL,
	[BankCode] [nvarchar](15) NULL,
	[Description] [nvarchar](250) NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[ValidFrom] [date] NULL,
	[ValidTo] [date] NULL,
	[IsDefault] [bit] NOT NULL DEFAULT 0,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Mitglied].[Member]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[Member](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberNumber] [nvarchar](30) NOT NULL,
	[MemberStatusId] [int] NOT NULL,
	[MemberTypeId] [int] NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[GenderId] [int] NULL,
	[DateOfBirth] [date] NULL,
	[PlaceOfBirth] [nvarchar](100) NULL,
	[NationalityId] [int] NULL,
	[Email] [nvarchar](100) NULL,
	[Phone] [nvarchar](30) NULL,
	[MobilePhone] [nvarchar](30) NULL,
	[JoinDate] [date] NULL,
	[LeaveDate] [date] NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[Notes] [nvarchar](250) NULL,
	[ContributionAmount] [decimal](18, 2) NULL,
	[ContributionCurrencyId] [int] NULL,
	[ContributionPeriodCode] [nvarchar](20) NULL,
	[ContributionPaymentDay] [int] NULL,
	[ContributionPaymentDayTypeCode] [nvarchar](20) NULL,
	[HasContributionObligation] [bit] NULL,
	[ProfileImagePath] [nvarchar](500) NULL,
	[PreferredLanguage] [char](2) NULL DEFAULT 'de',
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[AssociationId] ASC,
	[MemberNumber] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Mitglied].[MemberAddress]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[MemberAddress](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[MemberId] [int] NOT NULL,
	[AddressTypeId] [int] NOT NULL,
	[Street] [nvarchar](100) NULL,
	[HouseNumber] [nvarchar](10) NULL,
	[AddressAddition] [nvarchar](100) NULL,
	[PostalCode] [nvarchar](10) NULL,
	[City] [nvarchar](100) NULL,
	[District] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[POBox] [nvarchar](30) NULL,
	[PhoneNumber] [nvarchar](30) NULL,
	[Email] [nvarchar](100) NULL,
	[Notes] [nvarchar](250) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[ValidFrom] [date] NULL,
	[ValidTo] [date] NULL,
	[IsDefault] [bit] NOT NULL DEFAULT 0,
	[IsActive] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Mitglied].[MemberFamily]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[MemberFamily](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberId] [int] NOT NULL,
	[ParentMemberId] [int] NOT NULL,
	[FamilyRelationTypeId] [int] NOT NULL,
	[MemberFamilyStatusId] [int] NOT NULL,
	[ValidFrom] [date] NULL,
	[ValidTo] [date] NULL,
	[Notes] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_MemberFamily] UNIQUE NONCLUSTERED
(
	[AssociationId] ASC,
	[MemberId] ASC,
	[ParentMemberId] ASC,
	[FamilyRelationTypeId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Verein].[Event]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Event](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](1000) NULL,
	[StartDateTime] [datetime2] NOT NULL,
	[EndDateTime] [datetime2] NULL,
	[Price] [decimal](18, 2) NULL,
	[CurrencyId] [int] NULL,
	[Location] [nvarchar](250) NULL,
	[OnlyForMembers] [bit] NOT NULL DEFAULT 1,
	[MaxParticipants] [int] NULL,
	[RegistrationRequired] [bit] NOT NULL DEFAULT 0,
	[RegistrationDeadline] [datetime2] NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[CategoryId] [int] NULL, -- Etkinlik kategorisi için
	[OrganizerName] [nvarchar](100) NULL,
	[OrganizerEmail] [nvarchar](100) NULL,
	[OrganizerPhone] [nvarchar](30) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Verein].[EventRegistration]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[EventRegistration](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[EventId] [int] NOT NULL,
	[MemberId] [int] NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Phone] [nvarchar](30) NULL,
	[Status] [nvarchar](20) NULL,
	[Notes] [nvarchar](250) NULL,
	[Price] [decimal](18, 2) NULL,
	[CurrencyId] [int] NULL,
	[PaymentStatusId] [int] NULL,
	[RegistrationDate] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CancellationDate] [datetime2] NULL,
	[ParticipantCount] [int] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- FINANCE TABLES (Düzeltilmiş Naming Convention)
-- =============================================

/****** Object:  Table [Finanz].[BankTransaction]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[BankTransaction](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[BankAccountId] [int] NOT NULL,
	[TransactionDate] [date] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[CurrencyId] [int] NOT NULL DEFAULT 1,
	[Recipient] [nvarchar](100) NULL,
	[Purpose] [nvarchar](250) NULL,
	[Reference] [nvarchar](100) NULL,
	[StatusId] [int] NOT NULL DEFAULT 1,
	[ImportedAt] [datetime2] NULL,
	[TransactionType] [nvarchar](20) NULL, -- DEBIT, CREDIT
	[BankReference] [nvarchar](100) NULL,
	[ValueDate] [date] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Finanz].[MemberClaim]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MemberClaim](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberId] [int] NOT NULL,
	[PaymentTypeId] [int] NOT NULL,
	[ClaimNumber] [nvarchar](50) NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[CurrencyId] [int] NOT NULL DEFAULT 1,
	[Year] [int] NULL,
	[Quarter] [int] NULL,
	[Month] [int] NULL,
	[DueDate] [date] NOT NULL,
	[Description] [nvarchar](250) NULL,
	[StatusId] [int] NOT NULL DEFAULT 1,
	[PaidDate] [date] NULL,
	[ClaimTypeId] [int] NULL, -- Alacak türü (aidat, etkinlik ücreti, vb.)
	[IsRecurring] [bit] NOT NULL DEFAULT 0, -- Tekrarlayan alacak mı
	[ParentClaimId] [int] NULL, -- Ana alacak (tekrarlayan alacaklar için)
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Finanz].[MemberPayment]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MemberPayment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberId] [int] NOT NULL,
	[ClaimId] [int] NULL,
	[PaymentTypeId] [int] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[CurrencyId] [int] NOT NULL DEFAULT 1,
	[PaymentDate] [date] NOT NULL,
	[PaymentMethod] [nvarchar](30) NULL,
	[BankAccountId] [int] NULL,
	[Reference] [nvarchar](100) NULL,
	[Notes] [nvarchar](250) NULL,
	[StatusId] [int] NOT NULL DEFAULT 1,
	[BankTransactionId] [int] NULL,
	[PaymentNumber] [nvarchar](50) NULL,
	[ProcessedDate] [datetime2] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Finanz].[MemberClaimPayment]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MemberClaimPayment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[ClaimId] [int] NOT NULL,
	[PaymentId] [int] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[AllocationDate] [datetime2] NOT NULL DEFAULT GETDATE(),
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Finanz].[MemberAdvancePayment]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MemberAdvancePayment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberId] [int] NOT NULL,
	[PaymentId] [int] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[CurrencyId] [int] NOT NULL DEFAULT 1,
	[Description] [nvarchar](250) NULL,
	[RemainingAmount] [decimal](18, 2) NOT NULL,
	[IsFullyUsed] [bit] NOT NULL DEFAULT 0,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Finanz].[EventPayment]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[EventPayment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[EventId] [int] NOT NULL,
	[RegistrationId] [int] NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[CurrencyId] [int] NOT NULL DEFAULT 1,
	[PaymentDate] [date] NOT NULL,
	[PaymentMethod] [nvarchar](30) NULL,
	[Reference] [nvarchar](100) NULL,
	[StatusId] [int] NOT NULL DEFAULT 1,
	[PaymentNumber] [nvarchar](50) NULL,
	[ProcessedDate] [datetime2] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- ADDITIONAL TABLES (Eksik Tablolar)
-- =============================================

/****** Object:  Table [Verein].[EventImage]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[EventImage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[EventId] [int] NOT NULL,
	[ImagePath] [nvarchar](500) NOT NULL,
	[SortOrder] [int] NOT NULL DEFAULT 1,
	[Title] [nvarchar](100) NULL,
	[Description] [nvarchar](250) NULL,
	[IsMainImage] [bit] NOT NULL DEFAULT 0,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[EventCategory]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[EventCategory](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[SortOrder] [int] NULL,
	[Color] [nvarchar](7) NULL, -- Hex color code
	[Icon] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Keytable].[EventCategoryTranslation]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[EventCategoryTranslation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EventCategoryId] [int] NOT NULL,
	[Language] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[EventCategoryId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Web].[User]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Web].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT 0,
	[AssociationId] [int] NOT NULL,
	[MemberId] [int] NULL,
	[Username] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[PasswordSalt] [nvarchar](255) NOT NULL,
	[FirstName] [nvarchar](100) NULL,
	[LastName] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
	[IsEmailConfirmed] [bit] NOT NULL DEFAULT 0,
	[EmailConfirmationToken] [nvarchar](255) NULL,
	[PasswordResetToken] [nvarchar](255) NULL,
	[PasswordResetTokenExpiry] [datetime2] NULL,
	[LastLoginDate] [datetime2] NULL,
	[FailedLoginAttempts] [int] NOT NULL DEFAULT 0,
	[LockoutEndDate] [datetime2] NULL,
	[PreferredLanguage] [char](2) NOT NULL DEFAULT 'de',
	[TimeZone] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Username] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Email] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Web].[UserRole]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Web].[UserRole](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
	[AssignedDate] [datetime2] NOT NULL DEFAULT GETDATE(),
	[AssignedBy] [int] NULL,
	[IsActive] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[UserId] ASC,
	[RoleName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Stammdaten].[Configuration]    Script Date: 23.08.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Stammdaten].[Configuration](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AssociationId] [int] NULL,
	[Key] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[DataType] [nvarchar](20) NOT NULL DEFAULT 'string', -- string, int, bool, decimal, json
	[Category] [nvarchar](50) NULL,
	[Description] [nvarchar](250) NULL,
	[IsSystemConfig] [bit] NOT NULL DEFAULT 0,
	[IsEncrypted] [bit] NOT NULL DEFAULT 0,
	[Created] [datetime2] NOT NULL DEFAULT GETDATE(),
	[CreatedBy] [int] NULL,
	[Modified] [datetime2] NULL,
	[ModifiedBy] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[AssociationId] ASC,
	[Key] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- DEFAULT VALUES
-- =============================================

-- Default values for various tables
ALTER TABLE [Finanz].[BankTransaction] ADD DEFAULT (1) FOR [CurrencyId]
GO
ALTER TABLE [Finanz].[BankTransaction] ADD DEFAULT (1) FOR [StatusId]
GO
ALTER TABLE [Finanz].[MemberClaim] ADD DEFAULT (1) FOR [CurrencyId]
GO
ALTER TABLE [Finanz].[MemberClaim] ADD DEFAULT (1) FOR [StatusId]
GO
ALTER TABLE [Finanz].[MemberAdvancePayment] ADD DEFAULT (1) FOR [CurrencyId]
GO
ALTER TABLE [Finanz].[MemberPayment] ADD DEFAULT (1) FOR [CurrencyId]
GO
ALTER TABLE [Finanz].[MemberPayment] ADD DEFAULT (1) FOR [StatusId]
GO
ALTER TABLE [Finanz].[EventPayment] ADD DEFAULT (1) FOR [StatusId]
GO
ALTER TABLE [Mitglied].[Member] ADD DEFAULT (1) FOR [IsActive]
GO
ALTER TABLE [Mitglied].[MemberAddress] ADD DEFAULT (0) FOR [IsDefault]
GO
ALTER TABLE [Mitglied].[MemberAddress] ADD DEFAULT (1) FOR [IsActive]
GO
ALTER TABLE [Mitglied].[MemberFamily] ADD DEFAULT (1) FOR [MemberFamilyStatusId]
GO
ALTER TABLE [Verein].[Address] ADD DEFAULT (1) FOR [IsActive]
GO
ALTER TABLE [Verein].[Address] ADD DEFAULT (0) FOR [IsDefault]
GO
ALTER TABLE [Verein].[BankAccount] ADD DEFAULT (1) FOR [IsActive]
GO
ALTER TABLE [Verein].[BankAccount] ADD DEFAULT (0) FOR [IsDefault]
GO
ALTER TABLE [Verein].[Event] ADD DEFAULT (1) FOR [OnlyForMembers]
GO
ALTER TABLE [Verein].[Event] ADD DEFAULT (0) FOR [RegistrationRequired]
GO
ALTER TABLE [Verein].[Event] ADD DEFAULT (1) FOR [IsActive]
GO
ALTER TABLE [Verein].[EventImage] ADD DEFAULT (1) FOR [SortOrder]
GO
ALTER TABLE [Verein].[Association] ADD DEFAULT (1) FOR [IsActive]
GO

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

-- Keytable Translation Foreign Keys
ALTER TABLE [Keytable].[AddressTypeTranslation] WITH CHECK ADD FOREIGN KEY([AddressTypeId])
REFERENCES [Keytable].[AddressType] ([Id])
GO

ALTER TABLE [Keytable].[ContributionPeriodTranslation] WITH CHECK ADD FOREIGN KEY([ContributionPeriodCode])
REFERENCES [Keytable].[ContributionPeriod] ([Code])
GO

ALTER TABLE [Keytable].[ContributionPaymentDayTypeTranslation] WITH CHECK ADD FOREIGN KEY([Code])
REFERENCES [Keytable].[ContributionPaymentDayType] ([Code])
GO

ALTER TABLE [Keytable].[FamilyRelationTypeTranslation] WITH CHECK ADD FOREIGN KEY([FamilyRelationTypeId])
REFERENCES [Keytable].[FamilyRelationType] ([Id])
GO

ALTER TABLE [Keytable].[ClaimTypeTranslation] WITH CHECK ADD FOREIGN KEY([ClaimTypeId])
REFERENCES [Keytable].[ClaimType] ([Id])
GO

ALTER TABLE [Keytable].[ClaimStatusTranslation] WITH CHECK ADD FOREIGN KEY([ClaimStatusId])
REFERENCES [Keytable].[ClaimStatus] ([Id])
GO

ALTER TABLE [Keytable].[GenderTranslation] WITH CHECK ADD FOREIGN KEY([GenderId])
REFERENCES [Keytable].[Gender] ([Id])
GO

ALTER TABLE [Keytable].[AccountTypeTranslation] WITH CHECK ADD FOREIGN KEY([AccountTypeId])
REFERENCES [Keytable].[AccountType] ([Id])
GO

ALTER TABLE [Keytable].[MemberFamilyStatusTranslation] WITH CHECK ADD FOREIGN KEY([MemberFamilyStatusId])
REFERENCES [Keytable].[MemberFamilyStatus] ([Id])
GO

ALTER TABLE [Keytable].[MemberStatusTranslation] WITH CHECK ADD FOREIGN KEY([MemberStatusId])
REFERENCES [Keytable].[MemberStatus] ([Id])
GO

ALTER TABLE [Keytable].[MemberTypeTranslation] WITH CHECK ADD FOREIGN KEY([MemberTypeId])
REFERENCES [Keytable].[MemberType] ([Id])
GO

ALTER TABLE [Keytable].[LegalFormTranslation] WITH CHECK ADD FOREIGN KEY([LegalFormId])
REFERENCES [Keytable].[LegalForm] ([Id])
GO

ALTER TABLE [Keytable].[NationalityTranslation] WITH CHECK ADD FOREIGN KEY([NationalityId])
REFERENCES [Keytable].[Nationality] ([Id])
GO

ALTER TABLE [Keytable].[CurrencyTranslation] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Keytable].[PaymentStatusTranslation] WITH CHECK ADD FOREIGN KEY([PaymentStatusId])
REFERENCES [Keytable].[PaymentStatus] ([Id])
GO

ALTER TABLE [Keytable].[PaymentTypeTranslation] WITH CHECK ADD FOREIGN KEY([PaymentTypeId])
REFERENCES [Keytable].[PaymentType] ([Id])
GO

ALTER TABLE [Keytable].[EventCategoryTranslation] WITH CHECK ADD FOREIGN KEY([EventCategoryId])
REFERENCES [Keytable].[EventCategory] ([Id])
GO

-- Association and Address Foreign Keys
ALTER TABLE [Verein].[Association] WITH CHECK ADD CONSTRAINT [FK_Association_LegalForm] FOREIGN KEY([LegalFormId])
REFERENCES [Keytable].[LegalForm] ([Id])
GO

ALTER TABLE [Verein].[Address] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Verein].[Address] WITH CHECK ADD FOREIGN KEY([AddressTypeId])
REFERENCES [Keytable].[AddressType] ([Id])
GO

ALTER TABLE [Verein].[BankAccount] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Verein].[BankAccount] WITH CHECK ADD FOREIGN KEY([AccountTypeId])
REFERENCES [Keytable].[AccountType] ([Id])
GO

-- Member Foreign Keys
ALTER TABLE [Mitglied].[Member] WITH CHECK ADD FOREIGN KEY([ContributionPaymentDayTypeCode])
REFERENCES [Keytable].[ContributionPaymentDayType] ([Code])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_Gender] FOREIGN KEY([GenderId])
REFERENCES [Keytable].[Gender] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_MemberStatus] FOREIGN KEY([MemberStatusId])
REFERENCES [Keytable].[MemberStatus] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_MemberType] FOREIGN KEY([MemberTypeId])
REFERENCES [Keytable].[MemberType] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_Nationality] FOREIGN KEY([NationalityId])
REFERENCES [Keytable].[Nationality] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_Association] FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_ContributionCurrency] FOREIGN KEY([ContributionCurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Mitglied].[Member] WITH CHECK ADD CONSTRAINT [FK_Member_ContributionPeriod] FOREIGN KEY([ContributionPeriodCode])
REFERENCES [Keytable].[ContributionPeriod] ([Code])
GO

ALTER TABLE [Mitglied].[MemberAddress] WITH CHECK ADD FOREIGN KEY([AddressTypeId])
REFERENCES [Keytable].[AddressType] ([Id])
GO

ALTER TABLE [Mitglied].[MemberAddress] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Mitglied].[MemberFamily] WITH CHECK ADD FOREIGN KEY([FamilyRelationTypeId])
REFERENCES [Keytable].[FamilyRelationType] ([Id])
GO

ALTER TABLE [Mitglied].[MemberFamily] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Mitglied].[MemberFamily] WITH CHECK ADD FOREIGN KEY([MemberFamilyStatusId])
REFERENCES [Keytable].[MemberFamilyStatus] ([Id])
GO

ALTER TABLE [Mitglied].[MemberFamily] WITH CHECK ADD FOREIGN KEY([ParentMemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Mitglied].[MemberFamily] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

-- Event Foreign Keys
ALTER TABLE [Verein].[Event] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Verein].[Event] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Verein].[Event] WITH CHECK ADD FOREIGN KEY([CategoryId])
REFERENCES [Keytable].[EventCategory] ([Id])
GO

ALTER TABLE [Verein].[EventRegistration] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Verein].[EventRegistration] WITH CHECK ADD FOREIGN KEY([EventId])
REFERENCES [Verein].[Event] ([Id])
GO

ALTER TABLE [Verein].[EventRegistration] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Verein].[EventRegistration] WITH CHECK ADD FOREIGN KEY([PaymentStatusId])
REFERENCES [Keytable].[PaymentStatus] ([Id])
GO

ALTER TABLE [Verein].[EventImage] WITH CHECK ADD FOREIGN KEY([EventId])
REFERENCES [Verein].[Event] ([Id])
GO

-- Finance Foreign Keys
ALTER TABLE [Finanz].[BankTransaction] WITH CHECK ADD FOREIGN KEY([BankAccountId])
REFERENCES [Verein].[BankAccount] ([Id])
GO

ALTER TABLE [Finanz].[BankTransaction] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[PaymentStatus] ([Id])
GO

ALTER TABLE [Finanz].[BankTransaction] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Finanz].[BankTransaction] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_Member] FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_Status] FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ClaimStatus] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_Association] FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_Currency] FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_PaymentType] FOREIGN KEY([PaymentTypeId])
REFERENCES [Keytable].[PaymentType] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_ClaimType] FOREIGN KEY([ClaimTypeId])
REFERENCES [Keytable].[ClaimType] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaim] WITH CHECK ADD CONSTRAINT [FK_MemberClaim_ParentClaim] FOREIGN KEY([ParentClaimId])
REFERENCES [Finanz].[MemberClaim] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaimPayment] WITH CHECK ADD FOREIGN KEY([ClaimId])
REFERENCES [Finanz].[MemberClaim] ([Id])
GO

ALTER TABLE [Finanz].[MemberClaimPayment] WITH CHECK ADD FOREIGN KEY([PaymentId])
REFERENCES [Finanz].[MemberPayment] ([Id])
GO

ALTER TABLE [Finanz].[MemberAdvancePayment] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Finanz].[MemberAdvancePayment] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Finanz].[MemberAdvancePayment] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Finanz].[MemberAdvancePayment] WITH CHECK ADD FOREIGN KEY([PaymentId])
REFERENCES [Finanz].[MemberPayment] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD CONSTRAINT [FK_MemberPayment_Claim] FOREIGN KEY([ClaimId])
REFERENCES [Finanz].[MemberClaim] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[PaymentStatus] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([PaymentTypeId])
REFERENCES [Keytable].[PaymentType] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([BankAccountId])
REFERENCES [Verein].[BankAccount] ([Id])
GO

ALTER TABLE [Finanz].[MemberPayment] WITH CHECK ADD FOREIGN KEY([BankTransactionId])
REFERENCES [Finanz].[BankTransaction] ([Id])
GO

ALTER TABLE [Finanz].[EventPayment] WITH CHECK ADD FOREIGN KEY([RegistrationId])
REFERENCES [Verein].[EventRegistration] ([Id])
GO

ALTER TABLE [Finanz].[EventPayment] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[PaymentStatus] ([Id])
GO

ALTER TABLE [Finanz].[EventPayment] WITH CHECK ADD FOREIGN KEY([EventId])
REFERENCES [Verein].[Event] ([Id])
GO

ALTER TABLE [Finanz].[EventPayment] WITH CHECK ADD FOREIGN KEY([CurrencyId])
REFERENCES [Keytable].[Currency] ([Id])
GO

-- Web User Foreign Keys
ALTER TABLE [Web].[User] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

ALTER TABLE [Web].[User] WITH CHECK ADD FOREIGN KEY([MemberId])
REFERENCES [Mitglied].[Member] ([Id])
GO

ALTER TABLE [Web].[UserRole] WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [Web].[User] ([Id])
GO

ALTER TABLE [Web].[UserRole] WITH CHECK ADD FOREIGN KEY([AssignedBy])
REFERENCES [Web].[User] ([Id])
GO

-- Configuration Foreign Keys
ALTER TABLE [Stammdaten].[Configuration] WITH CHECK ADD FOREIGN KEY([AssociationId])
REFERENCES [Verein].[Association] ([Id])
GO

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Keytable Indexes
SET ANSI_PADDING ON
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_FamilyRelationType_Code] ON [Keytable].[FamilyRelationType]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_FamilyRelationTypeTranslation] ON [Keytable].[FamilyRelationTypeTranslation]
(
	[FamilyRelationTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_Gender_Code] ON [Keytable].[Gender]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_GenderTranslation] ON [Keytable].[GenderTranslation]
(
	[GenderId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberStatus_Code] ON [Keytable].[MemberStatus]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberStatusTranslation] ON [Keytable].[MemberStatusTranslation]
(
	[MemberStatusId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberType_Code] ON [Keytable].[MemberType]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberTypeTranslation] ON [Keytable].[MemberTypeTranslation]
(
	[MemberTypeId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_LegalForm_Code] ON [Keytable].[LegalForm]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_LegalFormTranslation] ON [Keytable].[LegalFormTranslation]
(
	[LegalFormId] ASC,
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_Nationality_Iso2] ON [Keytable].[Nationality]
(
	[Iso2] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_Nationality_Iso3] ON [Keytable].[Nationality]
(
	[Iso3] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_NationalityTranslation_Language] ON [Keytable].[NationalityTranslation]
(
	[Language] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Member Indexes
CREATE NONCLUSTERED INDEX [IX_Member_MemberStatusId] ON [Mitglied].[Member]
(
	[MemberStatusId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_MemberTypeId] ON [Mitglied].[Member]
(
	[MemberTypeId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_NationalityId] ON [Mitglied].[Member]
(
	[NationalityId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_AssociationId] ON [Mitglied].[Member]
(
	[AssociationId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_Email] ON [Mitglied].[Member]
(
	[Email] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_IsActive] ON [Mitglied].[Member]
(
	[IsActive] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Member_LastName_FirstName] ON [Mitglied].[Member]
(
	[LastName] ASC,
	[FirstName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Finance Indexes
CREATE NONCLUSTERED INDEX [IX_BankTransaction_AssociationId] ON [Finanz].[BankTransaction]
(
	[AssociationId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_BankTransaction_TransactionDate] ON [Finanz].[BankTransaction]
(
	[TransactionDate] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_MemberClaim_MemberId] ON [Finanz].[MemberClaim]
(
	[MemberId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_MemberClaim_DueDate] ON [Finanz].[MemberClaim]
(
	[DueDate] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_MemberPayment_MemberId] ON [Finanz].[MemberPayment]
(
	[MemberId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_MemberPayment_PaymentDate] ON [Finanz].[MemberPayment]
(
	[PaymentDate] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Event Indexes
CREATE NONCLUSTERED INDEX [IX_Event_AssociationId] ON [Verein].[Event]
(
	[AssociationId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_Event_StartDateTime] ON [Verein].[Event]
(
	[StartDateTime] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_EventRegistration_EventId] ON [Verein].[EventRegistration]
(
	[EventId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Audit Log Indexes
CREATE NONCLUSTERED INDEX [IX_AuditLog_TableName] ON [Logs].[AuditLog]
(
	[TableName] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_AuditLog_Timestamp] ON [Logs].[AuditLog]
(
	[Timestamp] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_SystemLog_Level] ON [Logs].[SystemLog]
(
	[Level] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_SystemLog_Timestamp] ON [Logs].[SystemLog]
(
	[Timestamp] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Web User Indexes
CREATE NONCLUSTERED INDEX [IX_User_AssociationId] ON [Web].[User]
(
	[AssociationId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_User_IsActive] ON [Web].[User]
(
	[IsActive] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

SET ANSI_PADDING OFF
GO

-- =============================================
-- FINAL DATABASE SETTINGS
-- =============================================

ALTER DATABASE [VEREIN] SET READ_WRITE
GO
