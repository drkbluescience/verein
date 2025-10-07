using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Enums;

namespace VereinsApi.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await context.Vereine.AnyAsync())
        {
            return; // Data already seeded
        }

        // Seed Vereine (Associations)
        var vereine = new List<Verein>
        {
            new Verein
            {
                Name = "Türkisch-Deutscher Kulturverein München",
                Kurzname = "TDKV München",
                Zweck = "Kultureller Austausch und Integration in München",
                Telefon = "+49 89 123456789",
                Email = "info@tdkv-muenchen.de",
                Webseite = "https://www.tdkv-muenchen.de",
                Gruendungsdatum = new DateTime(1985, 3, 15),
                Mitgliederzahl = 245,
                Vereinsnummer = "VR 12345",
                Steuernummer = "143/123/45678",
                Vorstandsvorsitzender = "Ahmet Yılmaz",
                Kontaktperson = "Fatma Özkan"
            },
            new Verein
            {
                Name = "Deutsch-Türkische Freundschaft Berlin",
                Kurzname = "DTF Berlin",
                Zweck = "Förderung der deutsch-türkischen Freundschaft",
                Telefon = "+49 30 987654321",
                Email = "kontakt@dtf-berlin.de",
                Webseite = "https://www.dtf-berlin.de",
                Gruendungsdatum = new DateTime(1992, 8, 22),
                Mitgliederzahl = 189,
                Vereinsnummer = "VR 67890",
                Steuernummer = "27/456/78901",
                Vorstandsvorsitzender = "Mehmet Demir",
                Kontaktperson = "Ayşe Kaya"
            }
        };

        await context.Vereine.AddRangeAsync(vereine);
        await context.SaveChangesAsync();

        // Seed Mitglieder (Members)
        var mitglieder = new List<Mitglied>
        {
            // München Verein Members
            new Mitglied
            {
                VereinId = vereine[0].Id,
                Mitgliedsnummer = "M001",
                MitgliedStatusId = 1, // Aktiv
                MitgliedTypId = 1, // Vollmitglied
                Vorname = "Ahmet",
                Nachname = "Yılmaz",
                Email = "ahmet.yilmaz@email.com",
                Telefon = "+49 89 111111111",
                Geburtsdatum = new DateTime(1975, 5, 12),
                Eintrittsdatum = new DateTime(2020, 1, 15)
            },
            new Mitglied
            {
                VereinId = vereine[0].Id,
                Mitgliedsnummer = "M002",
                MitgliedStatusId = 1, // Aktiv
                MitgliedTypId = 1, // Vollmitglied
                Vorname = "Fatma",
                Nachname = "Özkan",
                Email = "fatma.ozkan@email.com",
                Telefon = "+49 89 222222222",
                Geburtsdatum = new DateTime(1982, 9, 8),
                Eintrittsdatum = new DateTime(2021, 3, 10)
            },
            new Mitglied
            {
                VereinId = vereine[0].Id,
                Mitgliedsnummer = "M003",
                MitgliedStatusId = 1, // Aktiv
                MitgliedTypId = 1, // Vollmitglied
                Vorname = "Can",
                Nachname = "Schmidt",
                Email = "can.schmidt@email.com",
                Telefon = "+49 89 333333333",
                Geburtsdatum = new DateTime(1990, 12, 3),
                Eintrittsdatum = new DateTime(2022, 6, 20)
            },
            // Berlin Verein Members
            new Mitglied
            {
                VereinId = vereine[1].Id,
                Mitgliedsnummer = "B001",
                MitgliedStatusId = 1, // Aktiv
                MitgliedTypId = 1, // Vollmitglied
                Vorname = "Mehmet",
                Nachname = "Demir",
                Email = "mehmet.demir@email.com",
                Telefon = "+49 30 444444444",
                Geburtsdatum = new DateTime(1968, 7, 25),
                Eintrittsdatum = new DateTime(2019, 11, 5)
            },
            new Mitglied
            {
                VereinId = vereine[1].Id,
                Mitgliedsnummer = "B002",
                MitgliedStatusId = 1, // Aktiv
                MitgliedTypId = 1, // Vollmitglied
                Vorname = "Ayşe",
                Nachname = "Kaya",
                Email = "ayse.kaya@email.com",
                Telefon = "+49 30 555555555",
                Geburtsdatum = new DateTime(1985, 2, 14),
                Eintrittsdatum = new DateTime(2020, 4, 18)
            }
        };

        await context.Mitglieder.AddRangeAsync(mitglieder);
        await context.SaveChangesAsync();

        // Seed Veranstaltungen (Events)
        var veranstaltungen = new List<Veranstaltung>
        {
            new Veranstaltung
            {
                VereinId = vereine[0].Id,
                Titel = "Türkischer Kulturabend",
                Beschreibung = "Ein Abend voller türkischer Kultur mit traditioneller Musik, Tanz und Küche",
                Startdatum = DateTime.Now.AddDays(15),
                Enddatum = DateTime.Now.AddDays(15).AddHours(4),
                Preis = 25.00m
            },
            new Veranstaltung
            {
                VereinId = vereine[0].Id,
                Titel = "Deutsch-Türkisches Fußballturnier",
                Beschreibung = "Freundschaftliches Fußballturnier zwischen deutschen und türkischen Teams",
                Startdatum = DateTime.Now.AddDays(30),
                Enddatum = DateTime.Now.AddDays(30).AddHours(6),
                Preis = 10.00m
            },
            new Veranstaltung
            {
                VereinId = vereine[1].Id,
                Titel = "Integrationsseminar",
                Beschreibung = "Workshop über Integration und interkulturelle Kommunikation",
                Startdatum = DateTime.Now.AddDays(-10),
                Enddatum = DateTime.Now.AddDays(-10).AddHours(3),
                Preis = 0.00m
            },
            new Veranstaltung
            {
                VereinId = vereine[1].Id,
                Titel = "Ramadan Iftar Abend",
                Beschreibung = "Gemeinsames Fastenbrechen während des Ramadan",
                Startdatum = DateTime.Now.AddDays(45),
                Enddatum = DateTime.Now.AddDays(45).AddHours(3),
                Preis = 15.00m
            }
        };

        await context.Veranstaltungen.AddRangeAsync(veranstaltungen);
        await context.SaveChangesAsync();
    }
}
