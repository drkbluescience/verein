/****** MIGRATION: ADD ORGANIZATION HIERARCHY ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID(N'[Verein].[Organization]', 'U') IS NULL
BEGIN
    CREATE TABLE [Verein].[Organization](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Created] [datetime] NOT NULL CONSTRAINT [DF_Organization_Created] DEFAULT (GETDATE()),
        [CreatedBy] [int] NULL,
        [Modified] [datetime] NULL,
        [ModifiedBy] [int] NULL,
        [DeletedFlag] [bit] NOT NULL CONSTRAINT [DF_Organization_DeletedFlag] DEFAULT ((0)),
        [Name] [nvarchar](200) NOT NULL,
        [OrgType] [nvarchar](20) NOT NULL,
        [ParentOrganizationId] [int] NULL,
        [FederationCode] [nvarchar](20) NULL,
        [Aktiv] [bit] NULL,
        CONSTRAINT [PK_Organization] PRIMARY KEY CLUSTERED ([Id] ASC)
    ) ON [PRIMARY];
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Organization_ParentNotSelf')
BEGIN
    ALTER TABLE [Verein].[Organization] WITH CHECK ADD CONSTRAINT [CK_Organization_ParentNotSelf]
    CHECK ([ParentOrganizationId] IS NULL OR [ParentOrganizationId] <> [Id]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Organization_ParentOrganization')
BEGIN
    ALTER TABLE [Verein].[Organization] WITH CHECK ADD CONSTRAINT [FK_Organization_ParentOrganization]
    FOREIGN KEY([ParentOrganizationId]) REFERENCES [Verein].[Organization]([Id]) ON DELETE NO ACTION;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Organization_ParentOrganizationId' AND object_id = OBJECT_ID(N'[Verein].[Organization]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Organization_ParentOrganizationId]
    ON [Verein].[Organization]([ParentOrganizationId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Organization_OrgType' AND object_id = OBJECT_ID(N'[Verein].[Organization]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Organization_OrgType]
    ON [Verein].[Organization]([OrgType]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Organization_FederationCode' AND object_id = OBJECT_ID(N'[Verein].[Organization]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Organization_FederationCode]
    ON [Verein].[Organization]([FederationCode]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Organization_DeletedFlag' AND object_id = OBJECT_ID(N'[Verein].[Organization]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Organization_DeletedFlag]
    ON [Verein].[Organization]([DeletedFlag]);
END
GO

IF COL_LENGTH('Verein.Verein', 'OrganizationId') IS NULL
BEGIN
    ALTER TABLE [Verein].[Verein]
    ADD [OrganizationId] [int] NULL;
END
GO

IF COL_LENGTH('Verein.Verein', 'OrganizationId') IS NOT NULL
BEGIN
    -- Drop existing index so column can be altered safely (recreated later)
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Verein_OrganizationId' AND object_id = OBJECT_ID(N'[Verein].[Verein]'))
    BEGIN
        DROP INDEX [IX_Verein_OrganizationId] ON [Verein].[Verein];
    END

    DECLARE @OrganizationMap TABLE (
        [OrganizationId] [int] NOT NULL,
        [VereinId] [int] NOT NULL
    );

    MERGE [Verein].[Organization] AS tgt
    USING (
        SELECT
            src.[Id] AS VereinId,
            src.[Name],
            'Verein' AS OrgType,
            NULL AS ParentOrganizationId,
            NULL AS FederationCode,
            COALESCE(src.[Aktiv], 1) AS Aktiv,
            COALESCE(src.[Created], GETDATE()) AS Created,
            src.[CreatedBy],
            src.[Modified],
            src.[ModifiedBy]
        FROM [Verein].[Verein] src
        WHERE src.[OrganizationId] IS NULL
    ) AS src
    ON 1 = 0
    WHEN NOT MATCHED THEN
        INSERT (
            [Name],
            [OrgType],
            [ParentOrganizationId],
            [FederationCode],
            [Aktiv],
            [DeletedFlag],
            [Created],
            [CreatedBy],
            [Modified],
            [ModifiedBy]
        )
        VALUES (
            src.[Name],
            src.[OrgType],
            src.[ParentOrganizationId],
            src.[FederationCode],
            src.[Aktiv],
            0,
            src.[Created],
            src.[CreatedBy],
            src.[Modified],
            src.[ModifiedBy]
        )
    OUTPUT inserted.[Id], src.[VereinId] INTO @OrganizationMap([OrganizationId], [VereinId]);

    UPDATE v
    SET v.[OrganizationId] = m.[OrganizationId]
    FROM [Verein].[Verein] v
    INNER JOIN @OrganizationMap m ON v.[Id] = m.[VereinId];
END
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[Verein].[Verein]') AND name = 'OrganizationId')
BEGIN
    IF EXISTS (SELECT 1 FROM [Verein].[Verein] WHERE [OrganizationId] IS NULL)
    BEGIN
        RAISERROR('OrganizationId backfill incomplete. Please resolve nulls before enforcing NOT NULL.', 16, 1);
    END
    ELSE
    BEGIN
        ALTER TABLE [Verein].[Verein]
        ALTER COLUMN [OrganizationId] [int] NOT NULL;
    END
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Verein_Organization')
BEGIN
    ALTER TABLE [Verein].[Verein] WITH CHECK ADD CONSTRAINT [FK_Verein_Organization]
    FOREIGN KEY([OrganizationId]) REFERENCES [Verein].[Organization]([Id]) ON DELETE NO ACTION;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Verein_OrganizationId' AND object_id = OBJECT_ID(N'[Verein].[Verein]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Verein_OrganizationId]
    ON [Verein].[Verein]([OrganizationId]);
END
GO
