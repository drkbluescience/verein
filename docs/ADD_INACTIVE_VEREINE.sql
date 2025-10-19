-- =============================================
-- Aktif Olmayan Dernekler Ekleme Script'i
-- =============================================
-- Bu script mevcut dernekleri aktif olarak işaretler ve
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
-- Pasif Dernek 1: Kapatılmış Dernek
(
    N'Türkisch-Deutscher Sportverein Hamburg (Kapatıldı)',
    N'TDSV Hamburg',
    N'Spor ve kültürel faaliyetler - 2023''te kapatıldı',
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
    0,  -- DeletedFlag = false (soft delete değil, sadece pasif)
    GETDATE(),
    1
),
-- Pasif Dernek 2: Geçici Olarak Durdurulmuş
(
    N'Anadolu Kültür Derneği Frankfurt',
    N'AKD Frankfurt',
    N'Kültürel etkinlikler ve eğitim - Geçici olarak durduruldu',
    '+49 69 777777777',
    'info@akd-frankfurt.de',
    NULL,
    '2005-11-20',
    45,
    'VR 22222',
    '45/222/22222',
    N'Hasan Yıldız',
    N'Elif Şahin',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
),
-- Pasif Dernek 3: Birleşme Nedeniyle Kapatıldı
(
    N'Köln Türk Gençlik Birliği (Birleşti)',
    N'KTGB Köln',
    N'Gençlik faaliyetleri - 2024''te başka dernek ile birleşti',
    '+49 221 888888888',
    'eski@ktgb-koeln.de',
    NULL,
    '2010-03-05',
    0,
    'VR 33333',
    '50/333/33333',
    N'Emre Kara',
    N'Selin Aydın',
    0,  -- Aktiv = false
    0,
    GETDATE(),
    1
),
-- Pasif Dernek 4: Mali Sorunlar Nedeniyle Askıya Alındı
(
    N'Stuttgart Anadolu Kültür ve Sanat Derneği',
    N'SAKSD Stuttgart',
    N'Sanat ve kültür etkinlikleri - Mali sorunlar nedeniyle askıda',
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
-- Pasif Dernek 5: Yönetim Kurulu Eksikliği
(
    N'Düsseldorf Türk Toplumu Derneği',
    N'DTTD Düsseldorf',
    N'Sosyal ve kültürel faaliyetler - Yönetim kurulu eksikliği',
    '+49 211 666666666',
    'iletisim@dttd-duesseldorf.de',
    NULL,
    '2008-04-12',
    15,
    'VR 55555',
    '40/555/55555',
    N'Murat Demir',
    N'Gül Yılmaz',
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

