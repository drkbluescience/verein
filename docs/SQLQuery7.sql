-- Fatma Özkan var mý?
SELECT * FROM [Mitglied].[Mitglied] 
WHERE Email = 'fatma.ozkan@email.com' AND DeletedFlag = 0;

-- Aile verileri var mý?
SELECT mf.*, 
       m1.Vorname + ' ' + m1.Nachname AS Mitglied,
       m2.Vorname + ' ' + m2.Nachname AS Parent
FROM [Mitglied].[MitgliedFamilie] mf
LEFT JOIN [Mitglied].[Mitglied] m1 ON mf.MitgliedId = m1.Id
LEFT JOIN [Mitglied].[Mitglied] m2 ON mf.ParentMitgliedId = m2.Id
WHERE m1.Email = 'fatma.ozkan@email.com' 
   OR m2.Email = 'fatma.ozkan@email.com';