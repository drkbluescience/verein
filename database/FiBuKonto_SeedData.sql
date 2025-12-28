-- =============================================
-- FiBuKonto (Kontenplan) Seed Data
-- Based on easyFiBu Excel (SKR-49 Standard)
-- =============================================

-- Clear existing data
DELETE FROM [Finanz].[FiBuKonto];
DBCC CHECKIDENT ('[Finanz].[FiBuKonto]', RESEED, 0);

-- =============================================
-- A - IDEELLER BEREICH (Ana Faaliyet Alanı)
-- =============================================

-- A: EINNAHMEN (Gelirler)
INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
('2110', 'Beiträge', 'Aidatlar', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 10, 1, GETUTCDATE()),
('2115', 'Aufnahmegebühren', 'Üyelik Kabul Ücretleri', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 20, 1, GETUTCDATE()),
('2120', 'Spenden ohne Zuwendungsbescheid', 'Belgesiz Bağışlar', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 30, 1, GETUTCDATE()),
('2125', 'Spenden mit Zuwendungsbescheid', 'Belgeli Bağışlar', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 40, 1, GETUTCDATE()),
('2130', 'Geldbußen', 'Para Cezaları', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 50, 1, GETUTCDATE()),
('2135', 'Zuschüsse', 'Destekler/Hibeler', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 60, 1, GETUTCDATE()),
('2170', 'Sonstige Einnahmen (ideal)', 'Diğer Gelirler (ideal)', 'KASSE_BANK', 'EINNAHMEN', 'A', 'Ideeller Bereich', 70, 1, GETUTCDATE()),

-- A: AUSGABEN (Giderler)
('3110', 'Personalkosten', 'Personel Giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 110, 1, GETUTCDATE()),
('3115', 'Aufwandsentschädigung', 'Harcırah/Tazminatlar', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 120, 1, GETUTCDATE()),
('3120', 'Miete/Pacht', 'Kira', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 130, 1, GETUTCDATE()),
('3125', 'Nebenkosten', 'Yan Giderler', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 140, 1, GETUTCDATE()),
('3130', 'Versicherungen', 'Sigortalar', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 150, 1, GETUTCDATE()),
('3135', 'Telefon / Internet', 'Telefon / İnternet', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 160, 1, GETUTCDATE()),
('3140', 'Bürokosten', 'Büro Giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 170, 1, GETUTCDATE()),
('3145', 'Beiträge an DİTİB', 'DİTİB Aidatları', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 180, 1, GETUTCDATE()),
('3150', 'Zinsen (ideal)', 'Faizler (ideal)', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 190, 1, GETUTCDATE()),
('3155', 'Abschreibungen (ideal)', 'Amortismanlar (ideal)', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 200, 1, GETUTCDATE()),
('3160', 'Instandhaltung / Reparaturen', 'Bakım / Onarım', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 210, 1, GETUTCDATE()),
('3165', 'Sonstige Kosten (ideal)', 'Diğer Giderler (ideal)', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 220, 1, GETUTCDATE()),
('3170', 'Investitionen', 'Yatırımlar', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 230, 1, GETUTCDATE()),
('3175', 'Darlehenstilgung', 'Kredi Geri Ödemeleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 240, 1, GETUTCDATE()),
('3180', 'Veranstaltungskosten', 'Etkinlik Giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 250, 1, GETUTCDATE()),
('3185', 'Reisekosten', 'Seyahat Giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 260, 1, GETUTCDATE()),
('3190', 'Bewirtungskosten', 'İkram Giderleri', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 270, 1, GETUTCDATE()),
('3195', 'Durchlaufende Gelder (Spenden)', 'Transit Paralar (Bağışlar)', 'KASSE_BANK', 'AUSGABEN', 'A', 'Ideeller Bereich', 280, 1, GETUTCDATE());

-- =============================================
-- B - VERMÖGENSVERWALTUNG (Varlık Yönetimi)
-- =============================================

INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
-- B: EINNAHMEN
('2210', 'Mieteinnahmen', 'Kira Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'B', 'Vermögensverwaltung', 310, 1, GETUTCDATE()),
('2215', 'Pachteinnahmen', 'Kiralama Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'B', 'Vermögensverwaltung', 320, 1, GETUTCDATE()),
('2220', 'Zinseinnahmen', 'Faiz Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'B', 'Vermögensverwaltung', 330, 1, GETUTCDATE()),
('2270', 'Sonstige Einnahmen (Vermögen)', 'Diğer Gelirler (Varlık)', 'KASSE_BANK', 'EINNAHMEN', 'B', 'Vermögensverwaltung', 340, 1, GETUTCDATE()),

-- B: AUSGABEN
('3210', 'Nebenkosten (Vermietung)', 'Yan Giderler (Kiralama)', 'KASSE_BANK', 'AUSGABEN', 'B', 'Vermögensverwaltung', 410, 1, GETUTCDATE()),
('3215', 'Instandhaltung (Vermögen)', 'Bakım (Varlık)', 'KASSE_BANK', 'AUSGABEN', 'B', 'Vermögensverwaltung', 420, 1, GETUTCDATE()),
('3220', 'Abschreibungen (Vermögen)', 'Amortismanlar (Varlık)', 'KASSE_BANK', 'AUSGABEN', 'B', 'Vermögensverwaltung', 430, 1, GETUTCDATE()),
('3265', 'Sonstige Kosten (Vermögen)', 'Diğer Giderler (Varlık)', 'KASSE_BANK', 'AUSGABEN', 'B', 'Vermögensverwaltung', 440, 1, GETUTCDATE());

-- =============================================
-- C - ZWECKBETRIEB (Amaca Uygun İşletme)
-- =============================================

INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
-- C: EINNAHMEN
('2310', 'Kursgebühren', 'Kurs Ücretleri', 'KASSE_BANK', 'EINNAHMEN', 'C', 'Zweckbetrieb', 510, 1, GETUTCDATE()),
('2315', 'Teilnahmegebühren', 'Katılım Ücretleri', 'KASSE_BANK', 'EINNAHMEN', 'C', 'Zweckbetrieb', 520, 1, GETUTCDATE()),
('2320', 'Seminar-/Konferenzeinnahmen', 'Seminer/Konferans Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'C', 'Zweckbetrieb', 530, 1, GETUTCDATE()),
('2370', 'Sonstige Einnahmen (Zweck)', 'Diğer Gelirler (Zweck)', 'KASSE_BANK', 'EINNAHMEN', 'C', 'Zweckbetrieb', 540, 1, GETUTCDATE()),

-- C: AUSGABEN
('3310', 'Dozentenhonorar', 'Eğitmen Ücretleri', 'KASSE_BANK', 'AUSGABEN', 'C', 'Zweckbetrieb', 610, 1, GETUTCDATE()),
('3315', 'Materialkosten', 'Malzeme Giderleri', 'KASSE_BANK', 'AUSGABEN', 'C', 'Zweckbetrieb', 620, 1, GETUTCDATE()),
('3320', 'Raummiete (Zweck)', 'Mekan Kirası (Zweck)', 'KASSE_BANK', 'AUSGABEN', 'C', 'Zweckbetrieb', 630, 1, GETUTCDATE()),
('3365', 'Sonstige Kosten (Zweck)', 'Diğer Giderler (Zweck)', 'KASSE_BANK', 'AUSGABEN', 'C', 'Zweckbetrieb', 640, 1, GETUTCDATE());

-- =============================================
-- D - GESCHÄFTSBETRIEB (Ticari İşletme)
-- =============================================

INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
-- D: EINNAHMEN
('2410', 'Erlöse Speisen/Getränke', 'Yemek/İçecek Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'D', 'Geschäftsbetrieb', 710, 1, GETUTCDATE()),
('2415', 'Warenverkauf', 'Mal Satışı', 'KASSE_BANK', 'EINNAHMEN', 'D', 'Geschäftsbetrieb', 720, 1, GETUTCDATE()),
('2420', 'Werbeeinnahmen', 'Reklam Gelirleri', 'KASSE_BANK', 'EINNAHMEN', 'D', 'Geschäftsbetrieb', 730, 1, GETUTCDATE()),
('2470', 'Sonstige Einnahmen (Geschäft)', 'Diğer Gelirler (Ticari)', 'KASSE_BANK', 'EINNAHMEN', 'D', 'Geschäftsbetrieb', 740, 1, GETUTCDATE()),

-- D: AUSGABEN
('3410', 'Wareneinkauf', 'Mal Alışı', 'KASSE_BANK', 'AUSGABEN', 'D', 'Geschäftsbetrieb', 810, 1, GETUTCDATE()),
('3415', 'Personalkosten (Geschäft)', 'Personel Giderleri (Ticari)', 'KASSE_BANK', 'AUSGABEN', 'D', 'Geschäftsbetrieb', 820, 1, GETUTCDATE()),
('3420', 'Betriebskosten', 'İşletme Giderleri', 'KASSE_BANK', 'AUSGABEN', 'D', 'Geschäftsbetrieb', 830, 1, GETUTCDATE()),
('3465', 'Sonstige Kosten (Geschäft)', 'Diğer Giderler (Ticari)', 'KASSE_BANK', 'AUSGABEN', 'D', 'Geschäftsbetrieb', 840, 1, GETUTCDATE());

-- =============================================
-- TRANSIT HESAPLAR (Durchlaufende Posten)
-- =============================================

INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
('GTU', 'Geld-Transit-Umbuchung', 'Para Transit Aktarımı', 'KASSE_BANK', 'EIN_AUSG', NULL, NULL, 900, 1, GETUTCDATE()),
('KTB', 'Kasse an Bank', 'Kasadan Bankaya', 'KASSE_BANK', 'EIN_AUSG', NULL, NULL, 910, 1, GETUTCDATE()),
('BTK', 'Bank an Kasse', 'Bankadan Kasaya', 'KASSE_BANK', 'EIN_AUSG', NULL, NULL, 920, 1, GETUTCDATE()),
('DLG', 'Durchlaufende Gelder Eingang', 'Transit Para Girişi', 'KASSE_BANK', 'EINNAHMEN', NULL, NULL, 930, 1, GETUTCDATE()),
('DLA', 'Durchlaufende Gelder Ausgang', 'Transit Para Çıkışı', 'KASSE_BANK', 'AUSGABEN', NULL, NULL, 940, 1, GETUTCDATE());

-- =============================================
-- ÖZEL HESAPLAR
-- =============================================

INSERT INTO [Finanz].[FiBuKonto] (Nummer, Bezeichnung, BezeichnungTR, Bereich, Typ, Hauptbereich, HauptbereichName, Reihenfolge, IsAktiv, Created)
VALUES
('ANF', 'Anfangsbestand', 'Açılış Bakiyesi', 'KASSE_BANK', 'EINNAHMEN', NULL, NULL, 1, 1, GETUTCDATE()),
('END', 'Endbestand', 'Kapanış Bakiyesi', 'KASSE_BANK', 'AUSGABEN', NULL, NULL, 999, 1, GETUTCDATE());

-- Verify inserted data
SELECT COUNT(*) AS TotalAccounts FROM [Finanz].[FiBuKonto];
SELECT Hauptbereich, COUNT(*) AS AccountCount FROM [Finanz].[FiBuKonto] GROUP BY Hauptbereich;

