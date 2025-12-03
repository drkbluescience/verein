-- =====================================================
-- Brief Vorlagen Seed Data Script
-- Hazır mektup şablonları
-- =====================================================

USE VereinDB;
GO

-- Tüm dernekler için sistem şablonları ekle
-- Her dernek için şablonları çoğaltmak için cursor kullan

DECLARE @VereinId INT;
DECLARE @VereinName NVARCHAR(200);

DECLARE verein_cursor CURSOR FOR 
SELECT Id, Name FROM Verein.Verein WHERE DeletedFlag = 0;

OPEN verein_cursor;
FETCH NEXT FROM verein_cursor INTO @VereinId, @VereinName;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Şablonların zaten var olup olmadığını kontrol et
    IF NOT EXISTS (SELECT 1 FROM Brief.BriefVorlage WHERE VereinId = @VereinId AND IstSystemvorlage = 1)
    BEGIN
        -- 1. Hoş Geldiniz Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId, 
                N'Hoş Geldiniz', 
                N'Yeni üyeler için karşılama mektubu',
                N'{{vereinName}} Ailesine Hoş Geldiniz!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesine hoş geldiniz!</p><p>Üyelik numaranız: <strong>{{mitgliedsnummer}}</strong></p><p>Derneğimize katıldığınız için çok mutluyuz. Birlikte güzel işler başaracağımıza inanıyoruz.</p><p>Sorularınız için bizimle iletişime geçebilirsiniz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Willkommen',
                1);

        -- 2. Aidat Hatırlatma Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Aidat Hatırlatması',
                N'Üyelik aidatı ödeme hatırlatması',
                N'Aidat Ödeme Hatırlatması',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} üyelik aidatınızı hatırlatmak isteriz.</p><p>Ödenmemiş aidat tutarı: <strong>{{beitragBetrag}}</strong></p><p>Lütfen aidatınızı en kısa sürede ödeyiniz.</p><p>Sorularınız için bizimle iletişime geçebilirsiniz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Zahlung',
                1);

        -- 3. Teşekkür (Ödeme) Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Ödeme Teşekkür',
                N'Ödeme sonrası teşekkür mektubu',
                N'Ödemeniz İçin Teşekkürler',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>Ödemeniz başarıyla alınmıştır.</p><p>{{vereinName}} adına teşekkür ederiz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Zahlung',
                1);

        -- 4. Etkinlik Daveti Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Etkinlik Daveti',
                N'Genel etkinlik davet mektubu',
                N'Etkinliğimize Davetlisiniz!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} olarak düzenleyeceğimiz etkinliğe sizi davet ediyoruz.</p><p>Katılımınızı bekliyoruz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Einladung',
                1);

        -- 5. Toplantı Daveti Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Toplantı Daveti',
                N'Genel kurul veya toplantı daveti',
                N'Toplantı Daveti',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} toplantısına katılmanızı rica ederiz.</p><p>Katılımınız bizim için önemlidir.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Einladung',
                1);

        -- 6. Yeni Yıl Kutlaması Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Yeni Yıl Kutlaması',
                N'Yılbaşı kutlama mesajı',
                N'Yeni Yılınız Kutlu Olsun!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesi olarak yeni yılınızı en içten dileklerimizle kutlarız.</p><p>Yeni yılın sizlere ve ailenize sağlık, mutluluk ve başarı getirmesini temenni ediyoruz.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Feiertag',
                1);

        -- 7. Bayram Kutlaması Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Bayram Kutlaması',
                N'Dini ve milli bayram kutlamaları',
                N'Bayramınız Kutlu Olsun!',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} ailesi olarak bayramınızı en içten dileklerimizle kutlarız.</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Feiertag',
                1);

        -- 8. Genel Duyuru Şablonu
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Genel Duyuru',
                N'Genel bilgilendirme mektubu',
                N'Önemli Duyuru',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p>{{vereinName}} olarak sizlere önemli bir duyuru iletmek istiyoruz.</p><p>[Duyuru içeriğini buraya yazın]</p><p>Saygılarımızla,<br/>Yönetim Kurulu</p>',
                N'Allgemein',
                1);

        -- 9. Boş Şablon
        INSERT INTO Brief.BriefVorlage (VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie, IstSystemvorlage)
        VALUES (@VereinId,
                N'Boş Şablon',
                N'Sadece logo ve başlık içeren boş şablon',
                N'Konu',
                N'<p>Sayın {{vorname}} {{nachname}},</p><p></p><p>Saygılarımızla,<br/>{{vereinName}}<br/>Yönetim Kurulu</p>',
                N'Allgemein',
                1);

        PRINT 'Şablonlar eklendi: ' + @VereinName;
    END

    FETCH NEXT FROM verein_cursor INTO @VereinId, @VereinName;
END

CLOSE verein_cursor;
DEALLOCATE verein_cursor;

PRINT '✅ Brief Vorlagen seed data inserted successfully!';
GO

