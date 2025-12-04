/****** Object:  Database [VereinDB]    Script Date: 23.08.2025 - AZURE VERSION ******/
-- VereinDB Database - Azure SQL Database için uyarlanmış versiyon
-- Bu dosya APPLICATION_H_101.sql dosyasının Azure SQL için uyarlanmış versiyonudur
-- Değişiklikler:
-- 1. CREATE DATABASE komutu kaldırıldı (Azure Portal'dan oluşturulmalı)
-- 2. ALTER DATABASE komutları kaldırıldı (Azure tarafından yönetilir)
-- 3. USE komutu kaldırıldı (Azure SQL Database'de desteklenmez)
-- 4. Sadece schema, tablo, index, constraint komutları korundu

-- ÖNEMLİ: Azure SQL Database'de USE komutu desteklenmez!
-- Bu scripti çalıştırmadan ÖNCE VereinDB veritabanına bağlanın:
-- Server: Verein08112025.database.windows.net
-- Database: VereinDB
-- User: vereinsa





/****** Object:  Schema [Bank]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Bank]
GO
/****** Object:  Schema [Finanz]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Finanz]
GO
/****** Object:  Schema [Keytable]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Keytable]
GO
/****** Object:  Schema [Logs]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Logs]
GO
/****** Object:  Schema [Mitglied]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Mitglied]
GO
/****** Object:  Schema [Stammdaten]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Stammdaten]
GO
/****** Object:  Schema [Todesfall]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Todesfall]
GO
/****** Object:  Schema [Verein]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Verein]
GO
/****** Object:  Schema [Web]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Web]
GO
/****** Object:  Schema [Xbackups]    Script Date: 21.08.2025 13:03:24 ******/
CREATE SCHEMA [Xbackups]
GO
/****** Object:  Table [Finanz].[BankBuchung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[BankBuchung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[BankKontoId] [int] NOT NULL,
	[Buchungsdatum] [date] NOT NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Empfaenger] [nvarchar](100) NULL,
	[Verwendungszweck] [nvarchar](250) NULL,
	[Referenz] [nvarchar](100) NULL,
	[StatusId] [int] NOT NULL,
	[AngelegtAm] [datetime] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[MitgliedForderung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MitgliedForderung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[MitgliedId] [int] NOT NULL,
	[ZahlungTypId] [int] NOT NULL,
	[Forderungsnummer] [nvarchar](50) NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Jahr] [int] NULL,
	[Quartal] [int] NULL,
	[Monat] [int] NULL,
	[Faelligkeit] [date] NOT NULL,
	[Beschreibung] [nvarchar](250) NULL,
	[StatusId] [int] NOT NULL,
	[BezahltAm] [date] NULL,
 CONSTRAINT [PK__Mitglied__3214EC0737752A33] PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[MitgliedForderungZahlung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MitgliedForderungZahlung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[ForderungId] [int] NOT NULL,
	[ZahlungId] [int] NOT NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[MitgliedVorauszahlung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MitgliedVorauszahlung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[MitgliedId] [int] NOT NULL,
	[ZahlungId] [int] NOT NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Beschreibung] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[MitgliedZahlung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[MitgliedZahlung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[MitgliedId] [int] NOT NULL,
	[ForderungId] [int] NULL,
	[ZahlungTypId] [int] NOT NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Zahlungsdatum] [date] NOT NULL,
	[Zahlungsweg] [nvarchar](30) NULL,
	[BankkontoId] [int] NULL,
	[Referenz] [nvarchar](100) NULL,
	[Bemerkung] [nvarchar](250) NULL,
	[StatusId] [int] NOT NULL,
	[BankBuchungId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[VereinDitibZahlung]    Script Date: 18.11.2025 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[VereinDitibZahlung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Zahlungsdatum] [date] NOT NULL,
	[Zahlungsperiode] [nvarchar](7) NOT NULL,
	[Zahlungsweg] [nvarchar](30) NULL,
	[BankkontoId] [int] NULL,
	[Referenz] [nvarchar](100) NULL,
	[Bemerkung] [nvarchar](250) NULL,
	[StatusId] [int] NOT NULL,
	[BankBuchungId] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Finanz].[VeranstaltungZahlung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Finanz].[VeranstaltungZahlung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VeranstaltungId] [int] NOT NULL,
	[AnmeldungId] [int] NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Betrag] [decimal](18, 2) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Zahlungsdatum] [date] NOT NULL,
	[Zahlungsweg] [nvarchar](30) NULL,
	[Referenz] [nvarchar](100) NULL,
	[StatusId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[AdresseTyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AdresseTyp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[AdresseTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[AdresseTypUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AdresseTypId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[BeitragPeriode]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[BeitragPeriode](
	[Code] [nvarchar](20) NOT NULL,
	[Sort] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[BeitragPeriodeUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[BeitragPeriodeUebersetzung](
	[BeitragPeriodeCode] [nvarchar](20) NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[BeitragPeriodeCode] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[BeitragZahlungstagTyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[BeitragZahlungstagTyp](
	[Code] [nvarchar](20) NOT NULL,
	[Sort] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[BeitragZahlungstagTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[BeitragZahlungstagTypUebersetzung](
	[Code] [nvarchar](20) NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Code] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[FamilienbeziehungTyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[FamilienbeziehungTyp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[FamilienbeziehungTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[FamilienbeziehungTypUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FamilienbeziehungTypId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Forderungsart]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Forderungsart](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[ForderungsartUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ForderungsartUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ForderungsartId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Forderungsstatus]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Forderungsstatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[ForderungsstatusUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ForderungsstatusUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ForderungsstatusId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Geschlecht]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Geschlecht](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
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
/****** Object:  Table [Keytable].[GeschlechtUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[GeschlechtUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GeschlechtId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Kontotyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Kontotyp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[KontotypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[KontotypUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[KontotypId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[MitgliedFamilieStatus]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedFamilieStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[MitgliedFamilieStatusUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedFamilieStatusUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MitgliedFamilieStatusId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[MitgliedStatus]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[MitgliedStatusUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedStatusUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MitgliedStatusId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[MitgliedTyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedTyp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[MitgliedTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[MitgliedTypUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MitgliedTypId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Rechtsform]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Rechtsform](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[RechtsformUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[RechtsformUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RechtsformId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Staatsangehoerigkeit]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Staatsangehoerigkeit](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Iso2] [char](2) NOT NULL,
	[Iso3] [char](3) NOT NULL,
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
/****** Object:  Table [Keytable].[StaatsangehoerigkeitUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[StaatsangehoerigkeitUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StaatsangehoerigkeitId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[Waehrung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[Waehrung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
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
/****** Object:  Table [Keytable].[WaehrungUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[WaehrungUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[WaehrungId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[ZahlungStatus]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ZahlungStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
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
/****** Object:  Table [Keytable].[ZahlungStatusUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ZahlungStatusUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ZahlungStatusId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Keytable].[ZahlungTyp]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ZahlungTyp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](30) NOT NULL,
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
/****** Object:  Table [Keytable].[ZahlungTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Keytable].[ZahlungTypUebersetzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ZahlungTypId] [int] NOT NULL,
	[Sprache] [char](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Mitglied].[Mitglied]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[Mitglied](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[Mitgliedsnummer] [nvarchar](30) NOT NULL,
	[MitgliedStatusId] [int] NOT NULL,
	[MitgliedTypId] [int] NOT NULL,
	[Vorname] [nvarchar](100) NOT NULL,
	[Nachname] [nvarchar](100) NOT NULL,
	[GeschlechtId] [int] NULL,
	[Geburtsdatum] [date] NULL,
	[Geburtsort] [nvarchar](100) NULL,
	[StaatsangehoerigkeitId] [int] NULL,
	[Email] [nvarchar](100) NULL,
	[Telefon] [nvarchar](30) NULL,
	[Mobiltelefon] [nvarchar](30) NULL,
	[Eintrittsdatum] [date] NULL,
	[Austrittsdatum] [date] NULL,
	[Aktiv] [bit] NULL,
	[Bemerkung] [nvarchar](250) NULL,
	[BeitragBetrag] [decimal](18, 2) NULL,
	[BeitragWaehrungId] [int] NULL,
	[BeitragPeriodeCode] [nvarchar](20) NULL,
	[BeitragZahlungsTag] [int] NULL,
	[BeitragZahlungstagTypCode] [nvarchar](20) NULL,
	[BeitragIstPflicht] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Mitgliedsnummer] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Mitglied].[MitgliedAdresse]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[MitgliedAdresse](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[MitgliedId] [int] NOT NULL,
	[AdresseTypId] [int] NOT NULL,
	[Strasse] [nvarchar](100) NULL,
	[Hausnummer] [nvarchar](10) NULL,
	[Adresszusatz] [nvarchar](100) NULL,
	[PLZ] [nvarchar](10) NULL,
	[Ort] [nvarchar](100) NULL,
	[Stadtteil] [nvarchar](50) NULL,
	[Bundesland] [nvarchar](50) NULL,
	[Land] [nvarchar](50) NULL,
	[Postfach] [nvarchar](30) NULL,
	[Telefonnummer] [nvarchar](30) NULL,
	[EMail] [nvarchar](100) NULL,
	[Hinweis] [nvarchar](250) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[GueltigVon] [date] NULL,
	[GueltigBis] [date] NULL,
	[IstStandard] [bit] NULL,
	[Aktiv] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Mitglied].[MitgliedFamilie]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Mitglied].[MitgliedFamilie](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[MitgliedId] [int] NOT NULL,
	[ParentMitgliedId] [int] NOT NULL,
	[FamilienbeziehungTypId] [int] NOT NULL,
	[MitgliedFamilieStatusId] [int] NOT NULL,
	[GueltigVon] [date] NULL,
	[GueltigBis] [date] NULL,
	[Hinweis] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_MitgliedFamilie] UNIQUE NONCLUSTERED 
(
	[VereinId] ASC,
	[MitgliedId] ASC,
	[ParentMitgliedId] ASC,
	[FamilienbeziehungTypId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[Adresse]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Adresse](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NULL,
	[AdresseTypId] [int] NULL,
	[Strasse] [nvarchar](100) NULL,
	[Hausnummer] [nvarchar](10) NULL,
	[Adresszusatz] [nvarchar](100) NULL,
	[PLZ] [nvarchar](10) NULL,
	[Ort] [nvarchar](100) NULL,
	[Stadtteil] [nvarchar](50) NULL,
	[Bundesland] [nvarchar](50) NULL,
	[Land] [nvarchar](50) NULL,
	[Postfach] [nvarchar](30) NULL,
	[Telefonnummer] [nvarchar](30) NULL,
	[Faxnummer] [nvarchar](30) NULL,
	[EMail] [nvarchar](100) NULL,
	[Kontaktperson] [nvarchar](100) NULL,
	[Hinweis] [nvarchar](250) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[GueltigVon] [date] NULL,
	[GueltigBis] [date] NULL,
	[Aktiv] [bit] NULL,
	[IstStandard] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[Bankkonto]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Bankkonto](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[KontotypId] [int] NULL,
	[IBAN] [nvarchar](34) NOT NULL,
	[BIC] [nvarchar](20) NULL,
	[Kontoinhaber] [nvarchar](100) NULL,
	[Bankname] [nvarchar](100) NULL,
	[KontoNr] [nvarchar](30) NULL,
	[BLZ] [nvarchar](15) NULL,
	[Beschreibung] [nvarchar](250) NULL,
	[Aktiv] [bit] NULL,
	[GueltigVon] [date] NULL,
	[GueltigBis] [date] NULL,
	[IstStandard] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[Veranstaltung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Veranstaltung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[Titel] [nvarchar](200) NOT NULL,
	[Beschreibung] [nvarchar](1000) NULL,
	[Beginn] [datetime] NOT NULL,
	[Ende] [datetime] NULL,
	[Preis] [decimal](18, 2) NULL,
	[WaehrungId] [int] NULL,
	[Ort] [nvarchar](250) NULL,
	[NurFuerMitglieder] [bit] NOT NULL,
	[MaxTeilnehmer] [int] NULL,
	[AnmeldeErforderlich] [bit] NOT NULL,
	[Aktiv] [bit] NULL,
	-- Recurring Event Fields
	[IstWiederholend] [bit] NULL DEFAULT 0,
	[WiederholungTyp] [nvarchar](20) NULL,
	[WiederholungInterval] [int] NULL DEFAULT 1,
	[WiederholungEnde] [date] NULL,
	[WiederholungTage] [nvarchar](50) NULL,
	[WiederholungMonatTag] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[VeranstaltungAnmeldung]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[VeranstaltungAnmeldung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[Aktiv] [bit] NULL DEFAULT 1,
	[VeranstaltungId] [int] NOT NULL,
	[MitgliedId] [int] NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Telefon] [nvarchar](30) NULL,
	[Status] [nvarchar](20) NULL,
	[Bemerkung] [nvarchar](250) NULL,
	[Preis] [decimal](18, 2) NULL,
	[WaehrungId] [int] NULL,
	[ZahlungStatusId] [int] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[VeranstaltungBild]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[VeranstaltungBild](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VeranstaltungId] [int] NOT NULL,
	[BildPfad] [nvarchar](500) NOT NULL,
	[Reihenfolge] [int] NOT NULL,
	[Titel] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[Verein]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[Verein](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Kurzname] [nvarchar](50) NULL,
	[Vereinsnummer] [nvarchar](30) NULL,
	[Steuernummer] [nvarchar](30) NULL,
	[RechtsformId] [int] NULL,
	[Gruendungsdatum] [date] NULL,
	[Zweck] [nvarchar](500) NULL,
	[AdresseId] [int] NULL,
	[HauptBankkontoId] [int] NULL,
	[Telefon] [nvarchar](30) NULL,
	[Fax] [nvarchar](30) NULL,
	[Email] [nvarchar](100) NULL,
	[Webseite] [nvarchar](200) NULL,
	[SocialMediaLinks] [nvarchar](500) NULL,
	[Vorstandsvorsitzender] [nvarchar](100) NULL,
	[Geschaeftsfuehrer] [nvarchar](100) NULL,
	[VertreterEmail] [nvarchar](100) NULL,
	[Kontaktperson] [nvarchar](100) NULL,
	[Mitgliederzahl] [int] NULL,
	[SatzungPfad] [nvarchar](200) NULL,
	[LogoPfad] [nvarchar](200) NULL,
	[ExterneReferenzId] [nvarchar](50) NULL,
	[Mandantencode] [nvarchar](50) NULL,
	[EPostEmpfangAdresse] [nvarchar](100) NULL,
	[SEPA_GlaeubigerID] [nvarchar](50) NULL,
	[UstIdNr] [nvarchar](30) NULL,
	[ElektronischeSignaturKey] [nvarchar](100) NULL,
	[Aktiv] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[RechtlicheDaten]    Script Date: 21.08.2025 13:03:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[RechtlicheDaten](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[RegistergerichtName] [nvarchar](200) NULL,
	[RegistergerichtNummer] [nvarchar](50) NULL,
	[RegistergerichtOrt] [nvarchar](100) NULL,
	[RegistergerichtEintragungsdatum] [date] NULL,
	[FinanzamtName] [nvarchar](200) NULL,
	[FinanzamtNummer] [nvarchar](50) NULL,
	[FinanzamtOrt] [nvarchar](100) NULL,
	[Steuerpflichtig] [bit] NULL,
	[Steuerbefreit] [bit] NULL,
	[GemeinnuetzigAnerkannt] [bit] NULL,
	[GemeinnuetzigkeitBis] [date] NULL,
	[SteuererklaerungPfad] [nvarchar](500) NULL,
	[SteuererklaerungJahr] [int] NULL,
	[SteuerbefreiungPfad] [nvarchar](500) NULL,
	[GemeinnuetzigkeitsbescheidPfad] [nvarchar](500) NULL,
	[RegisterauszugPfad] [nvarchar](500) NULL,
	[Bemerkung] [nvarchar](1000) NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Verein].[VereinSatzung]    Script Date: 17.11.2025 - Statute Version Control ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Verein].[VereinSatzung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL,
	[VereinId] [int] NOT NULL,
	[DosyaPfad] [nvarchar](500) NOT NULL,
	[SatzungVom] [date] NOT NULL,
	[Aktiv] [bit] NOT NULL DEFAULT 1,
	[Bemerkung] [nvarchar](500) NULL,
	[DosyaAdi] [nvarchar](200) NULL,
	[DosyaBoyutu] [bigint] NULL,
PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_FamilienbeziehungTyp_Code]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_FamilienbeziehungTyp_Code] ON [Keytable].[FamilienbeziehungTyp]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_FamilienbeziehungTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_FamilienbeziehungTypUebersetzung] ON [Keytable].[FamilienbeziehungTypUebersetzung]
(
	[FamilienbeziehungTypId] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Geschlecht_Code]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Geschlecht_Code] ON [Keytable].[Geschlecht]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_GeschlechtUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_GeschlechtUebersetzung] ON [Keytable].[GeschlechtUebersetzung]
(
	[GeschlechtId] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_MitgliedStatus_Code]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MitgliedStatus_Code] ON [Keytable].[MitgliedStatus]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_MitgliedStatusUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MitgliedStatusUebersetzung] ON [Keytable].[MitgliedStatusUebersetzung]
(
	[MitgliedStatusId] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_MitgliedTyp_Code]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MitgliedTyp_Code] ON [Keytable].[MitgliedTyp]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_MitgliedTypUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MitgliedTypUebersetzung] ON [Keytable].[MitgliedTypUebersetzung]
(
	[MitgliedTypId] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Rechtsform_Code]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Rechtsform_Code] ON [Keytable].[Rechtsform]
(
	[Code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_RechtsformUebersetzung]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_RechtsformUebersetzung] ON [Keytable].[RechtsformUebersetzung]
(
	[RechtsformId] ASC,
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Staatsangehoerigkeit_Iso2]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Staatsangehoerigkeit_Iso2] ON [Keytable].[Staatsangehoerigkeit]
(
	[Iso2] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Staatsangehoerigkeit_Iso3]    Script Date: 21.08.2025 13:03:24 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Staatsangehoerigkeit_Iso3] ON [Keytable].[Staatsangehoerigkeit]
(
	[Iso3] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_StaatsangehoerigkeitUebersetzung_Sprache]    Script Date: 21.08.2025 13:03:24 ******/
CREATE NONCLUSTERED INDEX [IX_StaatsangehoerigkeitUebersetzung_Sprache] ON [Keytable].[StaatsangehoerigkeitUebersetzung]
(
	[Sprache] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Mitglied_MitgliedStatusId]    Script Date: 21.08.2025 13:03:24 ******/
CREATE NONCLUSTERED INDEX [IX_Mitglied_MitgliedStatusId] ON [Mitglied].[Mitglied]
(
	[MitgliedStatusId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Mitglied_MitgliedTypId]    Script Date: 21.08.2025 13:03:24 ******/
CREATE NONCLUSTERED INDEX [IX_Mitglied_MitgliedTypId] ON [Mitglied].[Mitglied]
(
	[MitgliedTypId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Mitglied_StaatsangehoerigkeitId]    Script Date: 21.08.2025 13:03:24 ******/
CREATE NONCLUSTERED INDEX [IX_Mitglied_StaatsangehoerigkeitId] ON [Mitglied].[Mitglied]
(
	[StaatsangehoerigkeitId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [Finanz].[BankBuchung] ADD  DEFAULT ((1)) FOR [WaehrungId]
GO
ALTER TABLE [Finanz].[BankBuchung] ADD  DEFAULT ((1)) FOR [StatusId]
GO
ALTER TABLE [Finanz].[BankBuchung] ADD  DEFAULT (getdate()) FOR [AngelegtAm]
GO
ALTER TABLE [Finanz].[MitgliedForderung] ADD  CONSTRAINT [DF__MitgliedF__Waehr__15DA3E5D]  DEFAULT ((1)) FOR [WaehrungId]
GO
ALTER TABLE [Finanz].[MitgliedForderung] ADD  CONSTRAINT [DF__MitgliedF__Statu__16CE6296]  DEFAULT ((1)) FOR [StatusId]
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung] ADD  DEFAULT ((1)) FOR [WaehrungId]
GO
ALTER TABLE [Finanz].[MitgliedZahlung] ADD  DEFAULT ((1)) FOR [WaehrungId]
GO
ALTER TABLE [Finanz].[MitgliedZahlung] ADD  DEFAULT ((1)) FOR [StatusId]
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung] ADD  DEFAULT ((1)) FOR [StatusId]
GO
ALTER TABLE [Mitglied].[Mitglied] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Mitglied].[MitgliedAdresse] ADD  DEFAULT ((0)) FOR [IstStandard]
GO
ALTER TABLE [Mitglied].[MitgliedAdresse] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Mitglied].[MitgliedFamilie] ADD  DEFAULT ((1)) FOR [MitgliedFamilieStatusId]
GO
ALTER TABLE [Verein].[Adresse] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Verein].[Adresse] ADD  DEFAULT ((0)) FOR [IstStandard]
GO
ALTER TABLE [Verein].[Bankkonto] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Verein].[Bankkonto] ADD  DEFAULT ((0)) FOR [IstStandard]
GO
ALTER TABLE [Verein].[Veranstaltung] ADD  DEFAULT ((1)) FOR [NurFuerMitglieder]
GO
ALTER TABLE [Verein].[Veranstaltung] ADD  DEFAULT ((0)) FOR [AnmeldeErforderlich]
GO
ALTER TABLE [Verein].[Veranstaltung] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Verein].[VeranstaltungBild] ADD  DEFAULT ((1)) FOR [Reihenfolge]
GO
ALTER TABLE [Verein].[Verein] ADD  DEFAULT ((1)) FOR [Aktiv]
GO
ALTER TABLE [Finanz].[BankBuchung]  WITH CHECK ADD FOREIGN KEY([BankKontoId])
REFERENCES [Verein].[Bankkonto] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung]  WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung]  WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedF__Mitgl__18B6AB08] FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] CHECK CONSTRAINT [FK__MitgliedF__Mitgl__18B6AB08]
GO
ALTER TABLE [Finanz].[MitgliedForderung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedF__Statu__1B9317B3] FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] CHECK CONSTRAINT [FK__MitgliedF__Statu__1B9317B3]
GO
ALTER TABLE [Finanz].[MitgliedForderung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedF__Verei__17C286CF] FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] CHECK CONSTRAINT [FK__MitgliedF__Verei__17C286CF]
GO
ALTER TABLE [Finanz].[MitgliedForderung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedF__Waehr__1A9EF37A] FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] CHECK CONSTRAINT [FK__MitgliedF__Waehr__1A9EF37A]
GO
ALTER TABLE [Finanz].[MitgliedForderung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedF__Zahlu__19AACF41] FOREIGN KEY([ZahlungTypId])
REFERENCES [Keytable].[ZahlungTyp] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] CHECK CONSTRAINT [FK__MitgliedF__Zahlu__19AACF41]
GO
ALTER TABLE [Finanz].[MitgliedForderungZahlung]  WITH CHECK ADD FOREIGN KEY([ForderungId])
REFERENCES [Finanz].[MitgliedForderung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderungZahlung]  WITH CHECK ADD FOREIGN KEY([ZahlungId])
REFERENCES [Finanz].[MitgliedZahlung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung]  WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung]  WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung]  WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung]  WITH CHECK ADD FOREIGN KEY([ZahlungId])
REFERENCES [Finanz].[MitgliedZahlung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD  CONSTRAINT [FK__MitgliedZ__Forde__2BC97F7C] FOREIGN KEY([ForderungId])
REFERENCES [Finanz].[MitgliedForderung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] CHECK CONSTRAINT [FK__MitgliedZ__Forde__2BC97F7C]
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung]  WITH CHECK ADD FOREIGN KEY([ZahlungTypId])
REFERENCES [Keytable].[ZahlungTyp] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung]  WITH CHECK ADD FOREIGN KEY([AnmeldungId])
REFERENCES [Verein].[VeranstaltungAnmeldung] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung]  WITH CHECK ADD FOREIGN KEY([VeranstaltungId])
REFERENCES [Verein].[Veranstaltung] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung]  WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Keytable].[AdresseTypUebersetzung]  WITH CHECK ADD FOREIGN KEY([AdresseTypId])
REFERENCES [Keytable].[AdresseTyp] ([Id])
GO
ALTER TABLE [Keytable].[FamilienbeziehungTypUebersetzung]  WITH CHECK ADD FOREIGN KEY([FamilienbeziehungTypId])
REFERENCES [Keytable].[FamilienbeziehungTyp] ([Id])
GO
ALTER TABLE [Keytable].[ForderungsartUebersetzung]  WITH CHECK ADD  CONSTRAINT [FK_ForderungsartUebersetzung_Forderungsart] FOREIGN KEY([ForderungsartId])
REFERENCES [Keytable].[Forderungsart] ([Id])
GO
ALTER TABLE [Keytable].[ForderungsartUebersetzung] CHECK CONSTRAINT [FK_ForderungsartUebersetzung_Forderungsart]
GO
ALTER TABLE [Keytable].[ForderungsstatusUebersetzung]  WITH CHECK ADD  CONSTRAINT [FK_ForderungsstatusUebersetzung_Forderungsstatus] FOREIGN KEY([ForderungsstatusId])
REFERENCES [Keytable].[Forderungsstatus] ([Id])
GO
ALTER TABLE [Keytable].[ForderungsstatusUebersetzung] CHECK CONSTRAINT [FK_ForderungsstatusUebersetzung_Forderungsstatus]
GO
ALTER TABLE [Keytable].[GeschlechtUebersetzung]  WITH CHECK ADD FOREIGN KEY([GeschlechtId])
REFERENCES [Keytable].[Geschlecht] ([Id])
GO
ALTER TABLE [Keytable].[KontotypUebersetzung]  WITH CHECK ADD FOREIGN KEY([KontotypId])
REFERENCES [Keytable].[Kontotyp] ([Id])
GO
ALTER TABLE [Keytable].[MitgliedFamilieStatusUebersetzung]  WITH CHECK ADD FOREIGN KEY([MitgliedFamilieStatusId])
REFERENCES [Keytable].[MitgliedFamilieStatus] ([Id])
GO
ALTER TABLE [Keytable].[MitgliedStatusUebersetzung]  WITH CHECK ADD FOREIGN KEY([MitgliedStatusId])
REFERENCES [Keytable].[MitgliedStatus] ([Id])
GO
ALTER TABLE [Keytable].[MitgliedTypUebersetzung]  WITH CHECK ADD FOREIGN KEY([MitgliedTypId])
REFERENCES [Keytable].[MitgliedTyp] ([Id])
GO
ALTER TABLE [Keytable].[RechtsformUebersetzung]  WITH CHECK ADD FOREIGN KEY([RechtsformId])
REFERENCES [Keytable].[Rechtsform] ([Id])
GO
ALTER TABLE [Keytable].[StaatsangehoerigkeitUebersetzung]  WITH CHECK ADD FOREIGN KEY([StaatsangehoerigkeitId])
REFERENCES [Keytable].[Staatsangehoerigkeit] ([Id])
GO
ALTER TABLE [Keytable].[WaehrungUebersetzung]  WITH CHECK ADD  CONSTRAINT [FK_WaehrungUebersetzung_Waehrung] FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Keytable].[WaehrungUebersetzung] CHECK CONSTRAINT [FK_WaehrungUebersetzung_Waehrung]
GO
ALTER TABLE [Keytable].[ZahlungStatusUebersetzung]  WITH CHECK ADD FOREIGN KEY([ZahlungStatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Keytable].[ZahlungTypUebersetzung]  WITH CHECK ADD FOREIGN KEY([ZahlungTypId])
REFERENCES [Keytable].[ZahlungTyp] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD FOREIGN KEY([BeitragZahlungstagTypCode])
REFERENCES [Keytable].[BeitragZahlungstagTyp] ([Code])
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD  CONSTRAINT [FK_Mitglied_Geschlecht] FOREIGN KEY([GeschlechtId])
REFERENCES [Keytable].[Geschlecht] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT [FK_Mitglied_Geschlecht]
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD  CONSTRAINT [FK_Mitglied_MitgliedStatus] FOREIGN KEY([MitgliedStatusId])
REFERENCES [Keytable].[MitgliedStatus] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT [FK_Mitglied_MitgliedStatus]
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD  CONSTRAINT [FK_Mitglied_MitgliedTyp] FOREIGN KEY([MitgliedTypId])
REFERENCES [Keytable].[MitgliedTyp] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT [FK_Mitglied_MitgliedTyp]
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD  CONSTRAINT [FK_Mitglied_Staatsangehoerigkeit] FOREIGN KEY([StaatsangehoerigkeitId])
REFERENCES [Keytable].[Staatsangehoerigkeit] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT [FK_Mitglied_Staatsangehoerigkeit]
GO
ALTER TABLE [Mitglied].[Mitglied]  WITH CHECK ADD  CONSTRAINT [FK_Mitglied_Verein] FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Mitglied].[Mitglied] CHECK CONSTRAINT [FK_Mitglied_Verein]
GO
ALTER TABLE [Mitglied].[MitgliedAdresse]  WITH CHECK ADD FOREIGN KEY([AdresseTypId])
REFERENCES [Keytable].[AdresseTyp] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedAdresse]  WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedFamilie]  WITH CHECK ADD FOREIGN KEY([FamilienbeziehungTypId])
REFERENCES [Keytable].[FamilienbeziehungTyp] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedFamilie]  WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedFamilie]  WITH CHECK ADD FOREIGN KEY([MitgliedFamilieStatusId])
REFERENCES [Keytable].[MitgliedFamilieStatus] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedFamilie]  WITH CHECK ADD FOREIGN KEY([ParentMitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Mitglied].[MitgliedFamilie]  WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Verein].[Veranstaltung]  WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Verein].[VeranstaltungAnmeldung]  WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Verein].[VeranstaltungAnmeldung]  WITH CHECK ADD FOREIGN KEY([VeranstaltungId])
REFERENCES [Verein].[Veranstaltung] ([Id])
GO
ALTER TABLE [Verein].[VeranstaltungBild]  WITH CHECK ADD FOREIGN KEY([VeranstaltungId])
REFERENCES [Verein].[Veranstaltung] ([Id])
GO
ALTER TABLE [Verein].[Verein]  WITH CHECK ADD  CONSTRAINT [FK_Verein_Rechtsform] FOREIGN KEY([RechtsformId])
REFERENCES [Keytable].[Rechtsform] ([Id])
GO
ALTER TABLE [Verein].[Verein] CHECK CONSTRAINT [FK_Verein_Rechtsform]
GO

-- Finanz Schema Foreign Keys
-- BankBuchung FK constraints
ALTER TABLE [Finanz].[BankBuchung] WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung] WITH CHECK ADD FOREIGN KEY([BankKontoId])
REFERENCES [Verein].[Bankkonto] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[BankBuchung] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO

-- MitgliedForderung FK constraints
ALTER TABLE [Finanz].[MitgliedForderung] WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] WITH CHECK ADD FOREIGN KEY([ZahlungTypId])
REFERENCES [Keytable].[ZahlungTyp] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderung] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO

-- MitgliedZahlung FK constraints
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([ZahlungTypId])
REFERENCES [Keytable].[ZahlungTyp] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([ForderungId])
REFERENCES [Finanz].[MitgliedForderung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([BankkontoId])
REFERENCES [Verein].[Bankkonto] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedZahlung] WITH CHECK ADD FOREIGN KEY([BankBuchungId])
REFERENCES [Finanz].[BankBuchung] ([Id])
GO

-- VereinDitibZahlung FK constraints
ALTER TABLE [Finanz].[VereinDitibZahlung] WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[VereinDitibZahlung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[VereinDitibZahlung] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO
ALTER TABLE [Finanz].[VereinDitibZahlung] WITH CHECK ADD FOREIGN KEY([BankkontoId])
REFERENCES [Verein].[Bankkonto] ([Id])
GO
ALTER TABLE [Finanz].[VereinDitibZahlung] WITH CHECK ADD FOREIGN KEY([BankBuchungId])
REFERENCES [Finanz].[BankBuchung] ([Id])
GO

-- MitgliedForderungZahlung FK constraints
ALTER TABLE [Finanz].[MitgliedForderungZahlung] WITH CHECK ADD FOREIGN KEY([ForderungId])
REFERENCES [Finanz].[MitgliedForderung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedForderungZahlung] WITH CHECK ADD FOREIGN KEY([ZahlungId])
REFERENCES [Finanz].[MitgliedZahlung] ([Id])
GO

-- MitgliedVorauszahlung FK constraints
ALTER TABLE [Finanz].[MitgliedVorauszahlung] WITH CHECK ADD FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung] WITH CHECK ADD FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung] WITH CHECK ADD FOREIGN KEY([ZahlungId])
REFERENCES [Finanz].[MitgliedZahlung] ([Id])
GO
ALTER TABLE [Finanz].[MitgliedVorauszahlung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO

-- VeranstaltungZahlung FK constraints
ALTER TABLE [Finanz].[VeranstaltungZahlung] WITH CHECK ADD FOREIGN KEY([VeranstaltungId])
REFERENCES [Verein].[Veranstaltung] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung] WITH CHECK ADD FOREIGN KEY([AnmeldungId])
REFERENCES [Verein].[VeranstaltungAnmeldung] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung] WITH CHECK ADD FOREIGN KEY([WaehrungId])
REFERENCES [Keytable].[Waehrung] ([Id])
GO
ALTER TABLE [Finanz].[VeranstaltungZahlung] WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [Keytable].[ZahlungStatus] ([Id])
GO

-- RechtlicheDaten FK constraints
ALTER TABLE [Verein].[RechtlicheDaten] WITH CHECK ADD CONSTRAINT [FK_RechtlicheDaten_Verein]
FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Verein].[RechtlicheDaten] CHECK CONSTRAINT [FK_RechtlicheDaten_Verein]
GO

-- RechtlicheDaten Indexes
CREATE NONCLUSTERED INDEX [IX_RechtlicheDaten_VereinId] ON [Verein].[RechtlicheDaten]
(
	[VereinId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_RechtlicheDaten_DeletedFlag] ON [Verein].[RechtlicheDaten]
(
	[DeletedFlag] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_RechtlicheDaten_VereinId_Unique] ON [Verein].[RechtlicheDaten]
(
	[VereinId] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- VereinSatzung FK constraints
ALTER TABLE [Verein].[VereinSatzung] WITH CHECK ADD CONSTRAINT [FK_VereinSatzung_Verein]
FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Verein].[VereinSatzung] CHECK CONSTRAINT [FK_VereinSatzung_Verein]
GO

-- VereinSatzung Indexes
CREATE NONCLUSTERED INDEX [IX_VereinSatzung_VereinId] ON [Verein].[VereinSatzung]
(
	[VereinId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_VereinSatzung_DeletedFlag] ON [Verein].[VereinSatzung]
(
	[DeletedFlag] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_VereinSatzung_Aktiv] ON [Verein].[VereinSatzung]
(
	[Aktiv] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO


-- =============================================
-- WEB SCHEMA TABLES - AUTHENTICATION & AUTHORIZATION
-- =============================================

/****** Object:  Table [Web].[User]    Script Date: 14.11.2025 - User Authentication Table ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Web].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DeletedFlag] [bit] NULL DEFAULT 0,

	-- Authentication
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NULL,  -- Nullable: Password system will be added later

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

PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[Email] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Web].[UserRole]    Script Date: 14.11.2025 - User Role Assignment Table ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[RoleType] [nvarchar](20) NOT NULL,  -- 'admin', 'dernek', 'mitglied'

	-- Optional References (Nullable - allows non-member managers)
	[MitgliedId] [int] NULL,
	[VereinId] [int] NULL,

	-- Validity Period
	[GueltigVon] [date] NOT NULL DEFAULT GETDATE(),
	[GueltigBis] [date] NULL,  -- NULL = unlimited

	-- Status
	[IsActive] [bit] NOT NULL DEFAULT 1,

	-- Notes
	[Bemerkung] [nvarchar](250) NULL,

PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [Web].[PageNote]    Script Date: 14.11.2025 - Development Feedback System ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Web].[PageNote](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Created] [datetime] NULL,
	[CreatedBy] [nvarchar](256) NULL,
	[Modified] [datetime] NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[DeletedFlag] [bit] NOT NULL DEFAULT 0,

	-- Page Information
	[PageUrl] [nvarchar](500) NOT NULL,
	[PageTitle] [nvarchar](200) NULL,
	[EntityType] [nvarchar](50) NULL,
	[EntityId] [int] NULL,

	-- Note Content
	[Title] [nvarchar](200) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[Category] [nvarchar](50) NOT NULL DEFAULT 'General',
	[Priority] [nvarchar](50) NOT NULL DEFAULT 'Medium',

	-- User Information
	[UserEmail] [nvarchar](256) NOT NULL,
	[UserName] [nvarchar](200) NULL,

	-- Status Information
	[Status] [nvarchar](50) NOT NULL DEFAULT 'Pending',
	[CompletedBy] [nvarchar](256) NULL,
	[CompletedAt] [datetime] NULL,
	[AdminNotes] [nvarchar](max) NULL,

	-- Additional Status
	[Aktiv] [bit] NOT NULL DEFAULT 1,
	[UserType] [nvarchar](50) NULL,

PRIMARY KEY CLUSTERED
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- FOREIGN KEY CONSTRAINTS - WEB SCHEMA
-- =============================================

-- UserRole FK to User
ALTER TABLE [Web].[UserRole] WITH CHECK ADD CONSTRAINT [FK_UserRole_User]
FOREIGN KEY([UserId])
REFERENCES [Web].[User] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Web].[UserRole] CHECK CONSTRAINT [FK_UserRole_User]
GO

-- UserRole FK to Mitglied (Nullable)
ALTER TABLE [Web].[UserRole] WITH CHECK ADD CONSTRAINT [FK_UserRole_Mitglied]
FOREIGN KEY([MitgliedId])
REFERENCES [Mitglied].[Mitglied] ([Id])
GO
ALTER TABLE [Web].[UserRole] CHECK CONSTRAINT [FK_UserRole_Mitglied]
GO

-- UserRole FK to Verein (Nullable)
ALTER TABLE [Web].[UserRole] WITH CHECK ADD CONSTRAINT [FK_UserRole_Verein]
FOREIGN KEY([VereinId])
REFERENCES [Verein].[Verein] ([Id])
GO
ALTER TABLE [Web].[UserRole] CHECK CONSTRAINT [FK_UserRole_Verein]
GO

-- =============================================
-- CHECK CONSTRAINTS - WEB SCHEMA
-- =============================================

-- UserRole RoleType constraint
ALTER TABLE [Web].[UserRole] WITH CHECK ADD CONSTRAINT [CK_UserRole_RoleType]
CHECK ([RoleType] IN ('admin', 'dernek', 'mitglied'))
GO
ALTER TABLE [Web].[UserRole] CHECK CONSTRAINT [CK_UserRole_RoleType]
GO

-- =============================================
-- INDEXES - WEB SCHEMA
-- =============================================

-- User Indexes
CREATE NONCLUSTERED INDEX [IX_User_Email] ON [Web].[User]
(
	[Email] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_User_DeletedFlag] ON [Web].[User]
(
	[DeletedFlag] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_User_IsActive] ON [Web].[User]
(
	[IsActive] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- UserRole Indexes
CREATE NONCLUSTERED INDEX [IX_UserRole_UserId] ON [Web].[UserRole]
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_UserRole_MitgliedId] ON [Web].[UserRole]
(
	[MitgliedId] ASC
)
WHERE [MitgliedId] IS NOT NULL
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_UserRole_VereinId] ON [Web].[UserRole]
(
	[VereinId] ASC
)
WHERE [VereinId] IS NOT NULL
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_UserRole_RoleType] ON [Web].[UserRole]
(
	[RoleType] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_UserRole_IsActive] ON [Web].[UserRole]
(
	[IsActive] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Composite index for active roles lookup
CREATE NONCLUSTERED INDEX [IX_UserRole_UserId_IsActive_RoleType] ON [Web].[UserRole]
(
	[UserId] ASC,
	[IsActive] ASC,
	[RoleType] ASC
)
WHERE [DeletedFlag] = 0 AND [IsActive] = 1
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- PageNote Indexes
CREATE NONCLUSTERED INDEX [IX_PageNote_UserEmail] ON [Web].[PageNote]
(
	[UserEmail] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_Status] ON [Web].[PageNote]
(
	[Status] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_EntityType_EntityId] ON [Web].[PageNote]
(
	[EntityType] ASC,
	[EntityId] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_PageUrl] ON [Web].[PageNote]
(
	[PageUrl] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_DeletedFlag] ON [Web].[PageNote]
(
	[DeletedFlag] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_Category] ON [Web].[PageNote]
(
	[Category] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_Priority] ON [Web].[PageNote]
(
	[Priority] ASC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PageNote_Created] ON [Web].[PageNote]
(
	[Created] DESC
)
WHERE [DeletedFlag] = 0
WITH (STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO


-- =============================================
-- MIGRATION: ADD RECURRING EVENT COLUMNS
-- =============================================
-- Date: 2025-01-17
-- Description: Adds recurring event support to Veranstaltung table
-- This section ensures recurring columns exist even if running on existing database
-- =============================================

PRINT '========================================';
PRINT 'Checking Recurring Event Columns...';
PRINT '========================================';
GO

-- Check and add IstWiederholend column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'IstWiederholend')
BEGIN
    PRINT 'Adding column: IstWiederholend...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [IstWiederholend] [bit] NULL DEFAULT 0;
    PRINT '✓ IstWiederholend added';
END
ELSE
BEGIN
    PRINT '✓ IstWiederholend already exists';
END
GO

-- Check and add WiederholungTyp column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'WiederholungTyp')
BEGIN
    PRINT 'Adding column: WiederholungTyp...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [WiederholungTyp] [nvarchar](20) NULL;
    PRINT '✓ WiederholungTyp added';
END
ELSE
BEGIN
    PRINT '✓ WiederholungTyp already exists';
END
GO

-- Check and add WiederholungInterval column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'WiederholungInterval')
BEGIN
    PRINT 'Adding column: WiederholungInterval...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [WiederholungInterval] [int] NULL DEFAULT 1;
    PRINT '✓ WiederholungInterval added';
END
ELSE
BEGIN
    PRINT '✓ WiederholungInterval already exists';
END
GO

-- Check and add WiederholungEnde column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'WiederholungEnde')
BEGIN
    PRINT 'Adding column: WiederholungEnde...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [WiederholungEnde] [date] NULL;
    PRINT '✓ WiederholungEnde added';
END
ELSE
BEGIN
    PRINT '✓ WiederholungEnde already exists';
END
GO

-- Check and add WiederholungTage column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'WiederholungTage')
BEGIN
    PRINT 'Adding column: WiederholungTage...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [WiederholungTage] [nvarchar](50) NULL;
    PRINT '✓ WiederholungTage added';
END
ELSE
BEGIN
    PRINT '✓ WiederholungTage already exists';
END
GO

-- Check and add WiederholungMonatTag column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Veranstaltung]') AND name = 'WiederholungMonatTag')
BEGIN
    PRINT 'Adding column: WiederholungMonatTag...';
    ALTER TABLE [Verein].[Veranstaltung]
    ADD [WiederholungMonatTag] [int] NULL;
    PRINT '✓ WiederholungMonatTag added';
END
ELSE
BEGIN
    PRINT '✓ WiederholungMonatTag already exists';
END
GO

PRINT '';
PRINT '========================================';
PRINT 'Recurring Event Columns Check Complete!';
PRINT '========================================';
PRINT '';

-- Verify all columns exist
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'Verein'
    AND TABLE_NAME = 'Veranstaltung'
    AND COLUMN_NAME IN (
        'IstWiederholend',
        'WiederholungTyp',
        'WiederholungInterval',
        'WiederholungEnde',
        'WiederholungTage',
        'WiederholungMonatTag'
    )
ORDER BY ORDINAL_POSITION;
GO

PRINT '✓ All recurring event columns verified!';
GO

-- =============================================
-- BRIEF SCHEMA - MEKTUP/MESAJ SİSTEMİ
-- =============================================

/****** Object:  Schema [Brief] ******/
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Brief')
BEGIN
    EXEC('CREATE SCHEMA [Brief]');
END
GO

/****** Object:  Table [Brief].[BriefVorlage] - Letter Templates ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Brief].[BriefVorlage](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [VereinId] [int] NOT NULL,
    [Name] [nvarchar](150) NOT NULL,
    [Beschreibung] [nvarchar](500) NULL,
    [Betreff] [nvarchar](200) NOT NULL,
    [Inhalt] [nvarchar](max) NOT NULL,
    [Kategorie] [nvarchar](50) NULL,
    [LogoPosition] [nvarchar](20) NULL DEFAULT 'top',
    [Schriftart] [nvarchar](50) NULL DEFAULT 'Arial',
    [Schriftgroesse] [int] NULL DEFAULT 14,
    [IstSystemvorlage] [bit] NULL DEFAULT 0,
    [IstAktiv] [bit] NULL DEFAULT 1,
    [Created] [datetime] NULL DEFAULT GETDATE(),
    [CreatedBy] [int] NULL,
    [Modified] [datetime] NULL,
    [ModifiedBy] [int] NULL,
    [DeletedFlag] [bit] NULL DEFAULT 0,
    [Aktiv] [bit] NULL DEFAULT 1,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [Brief].[Brief] - Letter Drafts ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Brief].[Brief](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [VereinId] [int] NOT NULL,
    [VorlageId] [int] NULL,
    [Titel] [nvarchar](200) NOT NULL,
    [Betreff] [nvarchar](200) NOT NULL,
    [Inhalt] [nvarchar](max) NOT NULL,
    [LogoUrl] [nvarchar](500) NULL,
    [LogoPosition] [nvarchar](20) NULL DEFAULT 'top',
    [Schriftart] [nvarchar](50) NULL DEFAULT 'Arial',
    [Schriftgroesse] [int] NULL DEFAULT 14,
    [Status] [nvarchar](20) NULL DEFAULT 'Entwurf',
    [SelectedMitgliedIds] [nvarchar](max) NULL,
    [Created] [datetime] NULL DEFAULT GETDATE(),
    [CreatedBy] [int] NULL,
    [Modified] [datetime] NULL,
    [ModifiedBy] [int] NULL,
    [DeletedFlag] [bit] NULL DEFAULT 0,
    [Aktiv] [bit] NULL DEFAULT 1,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [Brief].[Nachricht] - Sent Messages ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Brief].[Nachricht](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [BriefId] [int] NOT NULL,
    [VereinId] [int] NOT NULL,
    [MitgliedId] [int] NOT NULL,
    [Betreff] [nvarchar](200) NOT NULL,
    [Inhalt] [nvarchar](max) NOT NULL,
    [LogoUrl] [nvarchar](500) NULL,
    [IstGelesen] [bit] NULL DEFAULT 0,
    [GelesenDatum] [datetime] NULL,
    [GesendetDatum] [datetime] NULL DEFAULT GETDATE(),
    [DeletedFlag] [bit] NULL DEFAULT 0,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- BRIEF SCHEMA - FOREIGN KEY CONSTRAINTS
-- =============================================
ALTER TABLE [Brief].[BriefVorlage] WITH CHECK ADD CONSTRAINT [FK_BriefVorlage_Verein]
FOREIGN KEY([VereinId]) REFERENCES [Verein].[Verein] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [Brief].[Brief] WITH CHECK ADD CONSTRAINT [FK_Brief_Verein]
FOREIGN KEY([VereinId]) REFERENCES [Verein].[Verein] ([Id]) ON DELETE NO ACTION
GO

ALTER TABLE [Brief].[Brief] WITH CHECK ADD CONSTRAINT [FK_Brief_Vorlage]
FOREIGN KEY([VorlageId]) REFERENCES [Brief].[BriefVorlage] ([Id]) ON DELETE NO ACTION
GO

ALTER TABLE [Brief].[Nachricht] WITH CHECK ADD CONSTRAINT [FK_Nachricht_Brief]
FOREIGN KEY([BriefId]) REFERENCES [Brief].[Brief] ([Id]) ON DELETE NO ACTION
GO

ALTER TABLE [Brief].[Nachricht] WITH CHECK ADD CONSTRAINT [FK_Nachricht_Verein]
FOREIGN KEY([VereinId]) REFERENCES [Verein].[Verein] ([Id]) ON DELETE NO ACTION
GO

ALTER TABLE [Brief].[Nachricht] WITH CHECK ADD CONSTRAINT [FK_Nachricht_Mitglied]
FOREIGN KEY([MitgliedId]) REFERENCES [Mitglied].[Mitglied] ([Id]) ON DELETE NO ACTION
GO

-- =============================================
-- BRIEF SCHEMA - INDEXES
-- =============================================
CREATE NONCLUSTERED INDEX [IX_BriefVorlage_VereinId] ON [Brief].[BriefVorlage]([VereinId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_BriefVorlage_Kategorie] ON [Brief].[BriefVorlage]([Kategorie]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_BriefVorlage_IstAktiv] ON [Brief].[BriefVorlage]([IstAktiv]) WHERE [DeletedFlag] = 0
GO

CREATE NONCLUSTERED INDEX [IX_Brief_VereinId] ON [Brief].[Brief]([VereinId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Brief_VorlageId] ON [Brief].[Brief]([VorlageId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Brief_Status] ON [Brief].[Brief]([Status]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Brief_Created] ON [Brief].[Brief]([Created] DESC) WHERE [DeletedFlag] = 0
GO

CREATE NONCLUSTERED INDEX [IX_Nachricht_BriefId] ON [Brief].[Nachricht]([BriefId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Nachricht_VereinId] ON [Brief].[Nachricht]([VereinId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Nachricht_MitgliedId] ON [Brief].[Nachricht]([MitgliedId]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Nachricht_IstGelesen] ON [Brief].[Nachricht]([IstGelesen]) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Nachricht_GesendetDatum] ON [Brief].[Nachricht]([GesendetDatum] DESC) WHERE [DeletedFlag] = 0
GO
CREATE NONCLUSTERED INDEX [IX_Nachricht_MitgliedInbox] ON [Brief].[Nachricht]([MitgliedId], [DeletedFlag], [GesendetDatum] DESC)
GO

PRINT '✓ Brief schema and tables created successfully!';
GO
