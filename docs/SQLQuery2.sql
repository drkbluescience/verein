-- =============================================
-- Aktif Olmayan Dernekler Ekleme Script'i
-- =============================================
-- Bu script mevcut dernekleri aktif olarak iþaretler ve
-- test için aktif olmayan dernekler ekler.
-- =============================================

USE [VEREIN];
GO

PRINT N'==============================================';
PRINT N'Aktif Olmayan Dernekler Ekleme Scripti';
PRINT N'==============================================';
PRINT N'';

-- =============================================
-- 1. Mevcut Dernekleri Aktif Olarak Isaretle
-- =============================================

PRINT N'1. Mevcut dernekler aktif olarak isaretleniyor...';

UPDATE [Verein].[Verein]
SET Aktiv = 1,
    Modified = GETDATE(),
    ModifiedBy = 1
WHERE Aktiv IS NULL OR Aktiv = 0;

DECLARE @UpdatedCount INT = @@ROWCOUNT;
PRINT N'  OK ' + CAST(@UpdatedCount AS NVARCHAR(10)) + N' dernek aktif olarak isaretlendi';
PRINT N'';

-- =============================================
-- 2. Aktif Olmayan Dernekler Ekle
-- =============================================

PRINT N'2. Aktif olmayan dernekler ekleniyor...';

INSERT INTO [Verein].[Verein] (
    Name, Kurzname, Zweck, Telefon, Email, Webseite,
    Gruendungsdatum, Mitgliederzahl, Vereinsnummer, Steuernummer,
    Vorstandsvorsitzender, Kontaktperson,
    Aktiv, DeletedFlag, Created, CreatedBy
) VALUES
-- Pasif Dernek 1: Kapatýlmýþ Dernek
(
    N'Türkisch-Deutscher Sportverein Hamburg (Kapatýldý)',
    N'TDSV Hamburg',
    N'Spor ve kültürel faaliyetler - 2023''te kapatýldý',
    '+49 40 555555555',
    'archiv@tdsv-hamburg.de',
    'https://www.tdsv-hamburg.de',
    '1998-06-10',
    0,
    'VR 11111',
    '22/111/11111',
    N'Ali Çelik',
    N'Zeynep Arslan',
    0,  -- Aktiv = false
    0,  -- DeletedFlag = false (soft delete deðil, sadece pasif)
    GETDATE(),
    1
),
-- Pasif Dernek 2: Geçici Olarak Durdurulmuþ
(
    N'Anadolu Kültür Derneði Frankfurt',
    N'AKD Frankfurt',
    N'Kültürel etkinlikler ve eðitim - Geçici olarak durduruldu',
    '+49 69 777777777',
    'info@akd-frankfurt.de',
    NULL,
    '2005-11-20',
    45,
    'VR 22222',
    '45/222/22222',
    N'Hasan Yýldýz',
    N'Elif Þahin',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
),
-- Pasif Dernek 3: Birleþme Nedeniyle Kapatýldý
(
    N'Köln Türk Gençlik Birliði (Birleþti)',
    N'KTGB Köln',
    N'Gençlik faaliyetleri - 2024''te baþka dernek ile birleþti',
    '+49 221 888888888',
    'eski@ktgb-koeln.de',
    NULL,
    '2010-03-05',
    0,
    'VR 33333',
    '50/333/33333',
    N'Emre Kara',
    N'Selin Aydýn',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
),
-- Pasif Dernek 4: Mali Sorunlar Nedeniyle Askýya Alýndý
(
    N'Stuttgart Anadolu Kültür ve Sanat Derneði',
    N'SAKSD Stuttgart',
    N'Sanat ve kültür etkinlikleri - Mali sorunlar nedeniyle askýda',
    '+49 711 999999999',
    'muhasebe@saksd-stuttgart.de',
    'https://www.saksd-stuttgart.de',
    '2012-09-18',
    28,
    'VR 44444',
    '70/444/44444',
    N'Kemal Öztürk',
    N'Aylin Koç',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
),
-- Pasif Dernek 5: Yönetim Kurulu Eksikliði
(
    N'Düsseldorf Türk Toplumu Derneði',
    N'DTTD Düsseldorf',
    N'Sosyal ve kültürel faaliyetler - Yönetim kurulu eksikliði',
    '+49 211 666666666',
    'iletisim@dttd-duesseldorf.de',
    NULL,
    '2008-04-12',
    15,
    'VR 55555',
    '40/555/55555',
    N'Murat Demir',
    N'Gül Yýlmaz',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
);

DECLARE @InsertedCount INT = @@ROWCOUNT;
PRINT N'  OK ' + CAST(@InsertedCount AS NVARCHAR(10)) + N' aktif olmayan dernek eklendi';
PRINT N'';

-- =============================================
-- 3. Ozet Bilgiler
-- =============================================

PRINT N'==============================================';
PRINT N'Ozet Bilgiler';
PRINT N'==============================================';

DECLARE @TotalVereine INT = (SELECT COUNT(*) FROM [Verein].[Verein] WHERE DeletedFlag = 0);
DECLARE @ActiveVereine INT = (SELECT COUNT(*) FROM [Verein].[Verein] WHERE DeletedFlag = 0 AND Aktiv = 1);
DECLARE @InactiveVereine INT = (SELECT COUNT(*) FROM [Verein].[Verein] WHERE DeletedFlag = 0 AND (Aktiv = 0 OR Aktiv IS NULL));

PRINT N'Toplam Dernek Sayisi: ' + CAST(@TotalVereine AS NVARCHAR(10));
PRINT N'Aktif Dernek Sayisi: ' + CAST(@ActiveVereine AS NVARCHAR(10));
PRINT N'Pasif Dernek Sayisi: ' + CAST(@InactiveVereine AS NVARCHAR(10));
PRINT N'';

-- =============================================
-- 4. Kontrol Sorgulari
-- =============================================

PRINT N'==============================================';
PRINT N'Aktif Dernekler';
PRINT N'==============================================';

SELECT
    Id,
    Name,
    Kurzname,
    Email,
    Mitgliederzahl,
    CASE WHEN Aktiv = 1 THEN N'Aktif' ELSE N'Pasif' END AS Status
FROM [Verein].[Verein]
WHERE DeletedFlag = 0 AND Aktiv = 1
ORDER BY Name;

PRINT N'';
PRINT N'==============================================';
PRINT N'Pasif Dernekler';
PRINT N'==============================================';

SELECT
    Id,
    Name,
    Kurzname,
    Email,
    Mitgliederzahl,
    CASE WHEN Aktiv = 1 THEN N'Aktif' ELSE N'Pasif' END AS Status
FROM [Verein].[Verein]
WHERE DeletedFlag = 0 AND (Aktiv = 0 OR Aktiv IS NULL)
ORDER BY Name;

PRINT N'';
PRINT N'==============================================';
PRINT N'Script basariyla tamamlandi!';
PRINT N'==============================================';
GO

