-- =============================================
-- EASYFIBU FIBU KONTO SEED DATA
-- =============================================
-- SKR-49 standardına uygun hesap planı
-- 75+ hesap kodu ile tam muhasebe sistemi
-- =============================================

PRINT '========================================';
PRINT 'Adding FiBuKonto Seed Data...';
PRINT '========================================';
GO

-- Ana Faaliyet Alanı (A) - Ideeller Bereich
INSERT INTO [Finanz].[FiBuKonto] ([Nummer], [Bezeichnung], [BezeichnungTR], [Bereich], [Typ], [Hauptbereich], [HauptbereichName], [ZahlungTypId], [Reihenfolge], [IsAktiv]) VALUES
('1000', 'Aktive Rechnungsabgrenzung', 'Aktif Karşılaştırma Hesapları', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1000, 1),
('1100', 'Kasse', 'Kasa', 'Kasse', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1100, 1),
('1200', 'Bank Girokonto', 'Banka Hesabı', 'Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1200, 1),
('1300', 'Forderungen aus Lieferungen und Leistungen', 'Alacaklar', 'Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1300, 1),
('1400', 'Sonstige Vermögensgegenstände', 'Diğer Varlıklar', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1400, 1),
('1500', 'Aktive latente Steuern', 'Aktif Gecikmiş Vergiler', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1500, 0),
('1600', 'Aktive Rechnungsabgrenzung', 'Aktif Karşılaştırma', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 1600, 1),
('2000', 'Eigenkapital', 'Öz Sermaye', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 2000, 1),
('2100', 'Gewinnrücklagen', 'Kâr Yedekleri', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 2100, 1),
('2110', 'Mitgliedsbeiträge', 'Üyelik Aidatları', 'Bank', 'Einnahmen', 'A', 'Ideeller Bereich', 1, 2110, 1),
('2200', 'Spenden', 'Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', 2, 2200, 1),
('2300', 'Zuschüsse', 'Subvansiyonlar', 'Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 2300, 1),
('2400', 'Sonstige betriebliche Erträge', 'Diğer İşletme Gelirleri', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 2400, 1),
('2500', 'Personalaufwand', 'Personel Giderleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2500, 1),
('2550', 'Sozialversicherungsbeiträge', 'Sosyal Güv. Primleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2550, 1),
('2551', 'Löhne & Gehälter-Minijob', 'Mini İş Maaşları', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2551, 1),
('2600', 'Raumkosten', 'Mekan Giderleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2600, 1),
('2610', 'Miete', 'Kira', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2610, 1),
('2620', 'Heizung', 'Isınma', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2620, 1),
('2630', 'Strom, Gas, Wasser', 'Elektrik, Gaz, Su', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2630, 1),
('2640', 'Reinigung', 'Temizlik', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2640, 1),
('2650', 'Instandhaltung', 'Bakım Onarım', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2650, 1),
('2660', 'Büromaterial', 'Ofis Malzemeleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2660, 1),
('2663', 'Strom-Gas-Wasser', 'Elektrik-Gaz-Su', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2663, 1),
('2670', 'Telefon, Internet', 'Telefon, İnternet', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2670, 1),
('2680', 'Versicherungen', 'Sigortalar', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2680, 1),
('2690', 'Sonstige Verwaltungskosten', 'Diğer Yönetim Giderleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2690, 1),
('2700', 'Abschreibungen auf Sachanlagen', 'Sabit Varlık Amortismanları', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2700, 1),
('2710', 'Abschreibungen auf immaterielle Vermögensgegenstände', 'Maddi Olmayan Varlık Amortismanları', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2710, 1),
('2720', 'Zinsaufwendungen', 'Faiz Giderleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2720, 1),
('2730', 'Sonstige betriebliche Aufwendungen', 'Diğer İşletme Giderleri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2730, 1),
('2740', 'Steuern', 'Vergiler', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2740, 1),
('2750', 'Beiträge an Verbände', 'Birlik Aidatları', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2750, 1),
('2752', 'Beiträge an DITIB-Bundesverband', 'DITIB Merkez Aidatları', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2752, 1),
('2800', 'Forschung und Entwicklung', 'Ar-Ge', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2800, 0),
('2900', 'Sonstige periodenfremde Aufwendungen', 'Diğer Dönem Dışı Giderler', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 2900, 0),
('3000', 'Umsatzerlöse', 'Satış Gelirleri', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3000, 1),
('3100', 'Bestandsveränderungen', 'Stok Değişimleri', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 3100, 0),
('3200', 'Sonstige betriebliche Erträge', 'Diğer İşletme Gelirleri', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3200, 1),
('3220', 'Erhaltene Spenden', 'Alınan Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', 2, 3220, 1),
('3226', 'Spendenbox/Spendensammlungen', 'Bağış Kutusu', 'Kasse', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3226, 1),
('3230', 'Spenden von Mitgliedern', 'Üyelerden Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3230, 1),
('3240', 'Spenden von Nichtmitgliedern', 'Üye Olmayanlardan Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3240, 1),
('3250', 'Spenden von Unternehmen', 'Şirketlerden Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3250, 1),
('3260', 'Spenden von Stiftungen', 'Vakıflardan Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3260, 1),
('3270', 'Spenden von öffentlichen Stellen', 'Kamu Kurumlarından Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3270, 1),
('3280', 'Spenden von Kirchen', 'Kiliselerden Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3280, 0),
('3290', 'Spenden von sonstigen Organisationen', 'Diğer Kuruluşlardan Bağışlar', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3290, 1),
('3300', 'Zinserträge', 'Faiz Gelirleri', 'Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3300, 1),
('3400', 'Erträge aus dem Abgang von Vermögensgegenständen', 'Varlık Satış Gelirleri', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3400, 1),
('3500', 'Periodenfremde Erträge', 'Dönem Dışı Gelirler', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3500, 0),
('3600', 'Außerordentliche Erträge', 'Olağanüstü Gelirler', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3600, 0),
('3700', 'Steuern auf Erträge', 'Gelir Vergileri', 'Bank', 'Ausgaben', 'A', 'Ideeller Bereich', NULL, 3700, 0),
('3800', 'Sonstige Erträge', 'Diğer Gelirler', 'Kasse/Bank', 'Einnahmen', 'A', 'Ideeller Bereich', NULL, 3800, 1),
('3900', 'Jahresüberschuss', 'Yıllık Kâr', 'Kasse/Bank', 'Ein.-Ausg.', 'A', 'Ideeller Bereich', NULL, 3900, 1),

-- Varlık Yönetimi (B) - Vermögensverwaltung
('4000', 'Grundstücke und Gebäude', 'Arsa ve Binalar', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4000, 0),
('4100', 'Maschinen und technische Anlagen', 'Makine ve Teknik Ekipmanlar', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4100, 0),
('4110', 'Miet- und Pachterträge', 'Kira Gelirleri', 'Bank', 'Einnahmen', 'B', 'Vermögensverwaltung', NULL, 4110, 1),
('4200', 'Fahrzeuge', 'Taşıtlar', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4200, 0),
('4300', 'Betriebs- und Geschäftsausstattung', 'İşletme ve İşletme Donanımı', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4300, 0),
('4400', 'Geleistete Anzahlungen', 'Yapılan Avans Ödemeler', 'Kasse/Bank', 'Ausgaben', 'B', 'Vermögensverwaltung', NULL, 4400, 0),
('4500', 'Wertpapiere', 'Değerli Kağıtlar', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4500, 0),
('4600', 'Beteiligungen', 'İştirakler', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4600, 0),
('4700', 'Darlehen', 'Krediler', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4700, 0),
('4800', 'Sonstige Finanzanlagen', 'Diğer Finansal Yatırımlar', 'Kasse/Bank', 'Ein.-Ausg.', 'B', 'Vermögensverwaltung', NULL, 4800, 0),
('4900', 'Abschreibungen auf Finanzanlagen', 'Finansal Yatırım Amortismanları', 'Bank', 'Ausgaben', 'B', 'Vermögensverwaltung', NULL, 4900, 0),

-- Amaca Uygun İşletme (C) - Zweckbetrieb
('5000', 'Umsatzerlöse', 'Satış Gelirleri', 'Kasse/Bank', 'Einnahmen', 'C', 'Zweckbetrieb', NULL, 5000, 1),
('5100', 'Bestandsveränderungen', 'Stok Değişimleri', 'Kasse/Bank', 'Ein.-Ausg.', 'C', 'Zweckbetrieb', NULL, 5100, 0),
('5200', 'Sonstige betriebliche Erträge', 'Diğer İşletme Gelirleri', 'Kasse/Bank', 'Einnahmen', 'C', 'Zweckbetrieb', NULL, 5200, 1),
('5300', 'Materialaufwand', 'Malzeme Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5300, 1),
('5400', 'Personalaufwand', 'Personel Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5400, 1),
('5500', 'Abschreibungen auf Sachanlagen', 'Sabit Varlık Amortismanları', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5500, 1),
('5600', 'Sonstige betriebliche Aufwendungen', 'Diğer İşletme Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5600, 1),
('5700', 'Zinsaufwendungen', 'Faiz Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5700, 0),
('5800', 'Steuern auf Erträge', 'Gelir Vergileri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 5800, 0),
('5900', 'Jahresüberschuss', 'Yıllık Kâr', 'Kasse/Bank', 'Ein.-Ausg.', 'C', 'Zweckbetrieb', NULL, 5900, 1),
('6000', 'Verwaltungsaufwand', 'Yönetim Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6000, 1),
('6100', 'Vertriebsaufwand', 'Satış Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6100, 1),
('6200', 'Forschung und Entwicklung', 'Ar-Ge', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6200, 0),
('6300', 'Sonstige betriebliche Aufwendungen', 'Diğer İşletme Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6300, 1),
('6400', 'Zinsaufwendungen', 'Faiz Giderleri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6400, 0),
('6500', 'Steuern auf Erträge', 'Gelir Vergileri', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6500, 0),
('6505', 'Einnahmen aus Kursen', 'Kurs Gelirleri', 'Bank', 'Einnahmen', 'C', 'Zweckbetrieb', NULL, 6505, 1),
('6510', 'Eintrittsgelder', 'Giriş Ücretleri', 'Kasse/Bank', 'Einnahmen', 'C', 'Zweckbetrieb', 3, 6510, 1),
('6600', 'Periodenfremde Aufwendungen', 'Dönem Dışı Giderler', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6600, 0),
('6700', 'Außerordentliche Aufwendungen', 'Olağanüstü Giderler', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6700, 0),
('6800', 'Sonstige Aufwendungen', 'Diğer Giderler', 'Bank', 'Ausgaben', 'C', 'Zweckbetrieb', NULL, 6800, 1),
('6900', 'Jahresfehlbetrag', 'Yıllık Zarar', 'Kasse/Bank', 'Ein.-Ausg.', 'C', 'Zweckbetrieb', NULL, 6900, 1),

-- Ticari İşletme (D) - Geschäftsbetrieb
('7000', 'Umsatzerlöse', 'Satış Gelirleri', 'Kasse/Bank', 'Einnahmen', 'D', 'Geschäftsbetrieb', NULL, 7000, 1),
('7100', 'Bestandsveränderungen', 'Stok Değişimleri', 'Kasse/Bank', 'Ein.-Ausg.', 'D', 'Geschäftsbetrieb', NULL, 7100, 0),
('7200', 'Sonstige betriebliche Erträge', 'Diğer İşletme Gelirleri', 'Kasse/Bank', 'Einnahmen', 'D', 'Geschäftsbetrieb', NULL, 7200, 1),
('7300', 'Materialaufwand', 'Malzeme Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7300, 1),
('7400', 'Personalaufwand', 'Personel Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7400, 1),
('7500', 'Abschreibungen auf Sachanlagen', 'Sabit Varlık Amortismanları', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7500, 1),
('7600', 'Sonstige betriebliche Aufwendungen', 'Diğer İşletme Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7600, 1),
('7700', 'Zinsaufwendungen', 'Faiz Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7700, 0),
('7800', 'Steuern auf Erträge', 'Gelir Vergileri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 7800, 0),
('7900', 'Jahresüberschuss', 'Yıllık Kâr', 'Kasse/Bank', 'Ein.-Ausg.', 'D', 'Geschäftsbetrieb', NULL, 7900, 1),
('8000', 'Verwaltungsaufwand', 'Yönetim Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8000, 1),
('8100', 'Vertriebsaufwand', 'Satış Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8100, 1),
('8200', 'Forschung und Entwicklung', 'Ar-Ge', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8200, 0),
('8300', 'Sonstige betriebliche Aufwendungen', 'Diğer İşletme Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8300, 1),
('8400', 'Zinsaufwendungen', 'Faiz Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8400, 0),
('8500', 'Steuern auf Erträge', 'Gelir Vergileri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8500, 0),
('8600', 'Periodenfremde Aufwendungen', 'Dönem Dışı Giderler', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8600, 0),
('8700', 'Außerordentliche Aufwendungen', 'Olağanüstü Giderler', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8700, 0),
('8800', 'Sonstige Aufwendungen', 'Diğer Giderler', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8800, 1),
('8900', 'Jahresfehlbetrag', 'Yıllık Zarar', 'Kasse/Bank', 'Ein.-Ausg.', 'D', 'Geschäftsbetrieb', NULL, 8900, 1),
('8000', 'Verwaltungsaufwand', 'Yönetim Giderleri', 'Bank', 'Ausgaben', 'D', 'Geschäftsbetrieb', NULL, 8000, 1),
('8032', 'Verkaufserlöse Gemeinde und Kinderfest', 'Kermes Satışları', 'Kasse', 'Einnahmen', 'D', 'Geschäftsbetrieb', NULL, 8032, 1),

-- Transit Hesaplar (9xxx Serisi)
('9000', 'Durchlaufende Posten', 'Transit Hesaplar', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9000, 1),
('9010', 'Spenden an DITIB Landesverband=Durchlaufend', 'DITIB Eyalet Birliği Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9010, 1),
('9020', 'Spenden an DITIB Regionalverband=Durchlaufend', 'DITIB Bölge Birliği Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9020, 1),
('9030', 'Spenden an DITIB Gemeinden=Durchlaufend', 'DITIB Camileri Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9030, 1),
('9040', 'Spenden an DITIB Gemeinde=vom eigene Bestand', 'Kendi Bütçesinden Camiye', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9040, 1),
('9050', 'Spenden an andere Organisationen=Durchlaufend', 'Diğer Kuruluşlar Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9050, 1),
('9060', 'Spenden an andere Organisationen=vom eigene Bestand', 'Kendi Bütçesinden Diğerleri', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9060, 1),
('9070', 'Spenden an DITIB Ausland=Durchlaufend', 'DITIB Yurtdışı Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9070, 1),
('9080', 'Spenden an DITIB Ausland=vom eigene Bestand', 'Kendi Bütçesinden Yurtdışı', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9080, 1),
('9090', 'Spenden an DITIB International=Durchlaufend', 'DITIB Uluslararası Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9090, 1),
('9091', 'Kurban=Durchlaufend', 'Kurban Bağışları', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9091, 1),
('9092', 'Zekat-Fitre=Durchlaufend', 'Zekat ve Fitre', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9092, 1),
('9093', 'Spenden an DITIB Gemeinden=Durchlaufend', 'Diğer Camilere', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9093, 1),
('9094', 'Spenden an DITIB Gemeinde=vom eigene Bestand', 'Kendi Bütçesinden', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9094, 1),
('9095', 'Spenden an DITIB Regional=Durchlaufend', 'DITIB Bölge', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9095, 1),
('9096', 'Spenden an DITIB Köln=Durchlaufend', 'DITIB Köln Transit', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9096, 1),
('9097', 'Spenden an DITIB Landes-/Regionalverband', 'DITIB Eyalet/Bölge', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9097, 1),
('9098', 'Spenden an DITIB Bundesverband=Durchlaufend', 'DITIB Merkez', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9098, 1),
('9099', 'Spenden an DITIB International=Durchlaufend', 'DITIB Uluslararası', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transit', NULL, 9099, 1),

-- Özel Transfer Kodları
('GTU', 'Geldübertrag/Umbuchung', 'Para Transferi', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transfer', NULL, 9999, 1),
('GTX', 'Geldtransfer extern', 'Dış Para Transferi', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transfer', NULL, 9998, 1),
('KTB', 'Kassatransfer Bank', 'Kasadan Bankaya', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transfer', NULL, 9997, 1),
('BTK', 'Banktransfer Kasse', 'Bankadan Kasaya', 'Kasse/Bank', 'Ein.-Ausg.', '-', 'Transfer', NULL, 9996, 1);

PRINT '✓ FiBuKonto seed data added successfully!';
PRINT 'Total records added: ' + CAST(@@ROWCOUNT AS NVARCHAR(10));
GO

-- Verify seed data
SELECT 
    COUNT(*) AS TotalAccounts,
    COUNT(CASE WHEN Hauptbereich = 'A' THEN 1 END) AS IdeellerBereich,
    COUNT(CASE WHEN Hauptbereich = 'B' THEN 1 END) AS Vermoegensverwaltung,
    COUNT(CASE WHEN Hauptbereich = 'C' THEN 1 END) AS Zweckbetrieb,
    COUNT(CASE WHEN Hauptbereich = 'D' THEN 1 END) AS Geschaeftsbetrieb,
    COUNT(CASE WHEN Hauptbereich = '-' THEN 1 END) AS Transit,
    COUNT(CASE WHEN IsAktiv = 1 THEN 1 END) AS ActiveAccounts
FROM Finanz.FiBuKonto
WHERE DeletedFlag = 0;
GO

PRINT '✓ FiBuKonto seed data verification complete!';
GO
