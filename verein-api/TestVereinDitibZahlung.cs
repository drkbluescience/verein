using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;

namespace VereinsApi;

public class TestVereinDitibZahlung
{
    public static async Task TestQuery(ApplicationDbContext context)
    {
        try
        {
            Console.WriteLine("Testing VereinDitibZahlung query...");
            
            var zahlungen = await context.VereinDitibZahlungen
                .Where(z => z.VereinId == 1)
                .ToListAsync();
            
            Console.WriteLine($"Found {zahlungen.Count} zahlungen");
            
            foreach (var z in zahlungen)
            {
                Console.WriteLine($"ID: {z.Id}, Betrag: {z.Betrag}, Periode: {z.Zahlungsperiode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}");
            Console.WriteLine($"Stack: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner: {ex.InnerException.Message}");
            }
        }
    }
}

