using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VereinsApi.Data.Configurations;
using VereinsApi.Data.Configurations.Keytable;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data;

/// <summary>
/// Application database context for Verein API
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    #region DbSets

    /// <summary>
    /// Vereine table
    /// </summary>
    public DbSet<Verein> Vereine { get; set; }

    /// <summary>
    /// Adressen table
    /// </summary>
    public DbSet<Adresse> Adressen { get; set; }

    /// <summary>
    /// Bankkonten table
    /// </summary>
    public DbSet<Bankkonto> Bankkonten { get; set; }

    /// <summary>
    /// Veranstaltungen table
    /// </summary>
    public DbSet<Veranstaltung> Veranstaltungen { get; set; }

    /// <summary>
    /// Veranstaltung Anmeldungen table
    /// </summary>
    public DbSet<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; }

    /// <summary>
    /// Veranstaltung Bilder table
    /// </summary>
    public DbSet<VeranstaltungBild> VeranstaltungBilder { get; set; }

    /// <summary>
    /// Mitglieder table
    /// </summary>
    public DbSet<Mitglied> Mitglieder { get; set; }

    /// <summary>
    /// Mitglied Adressen table
    /// </summary>
    public DbSet<MitgliedAdresse> MitgliedAdressen { get; set; }

    /// <summary>
    /// Mitglied Familie table
    /// </summary>
    public DbSet<MitgliedFamilie> MitgliedFamilien { get; set; }

    /// <summary>
    /// Bank Buchungen table (Finanz schema)
    /// </summary>
    public DbSet<BankBuchung> BankBuchungen { get; set; }

    /// <summary>
    /// Mitglied Forderungen table (Finanz schema)
    /// </summary>
    public DbSet<MitgliedForderung> MitgliedForderungen { get; set; }

    /// <summary>
    /// Mitglied Zahlungen table (Finanz schema)
    /// </summary>
    public DbSet<MitgliedZahlung> MitgliedZahlungen { get; set; }

    /// <summary>
    /// Mitglied Forderung Zahlungen table (Finanz schema)
    /// </summary>
    public DbSet<MitgliedForderungZahlung> MitgliedForderungZahlungen { get; set; }

    /// <summary>
    /// Mitglied Vorauszahlungen table (Finanz schema)
    /// </summary>
    public DbSet<MitgliedVorauszahlung> MitgliedVorauszahlungen { get; set; }

    /// <summary>
    /// Veranstaltung Zahlungen table (Finanz schema)
    /// </summary>
    public DbSet<VeranstaltungZahlung> VeranstaltungZahlungen { get; set; }

    /// <summary>
    /// Verein DITIB Zahlungen table (Finanz schema)
    /// </summary>
    public DbSet<VereinDitibZahlung> VereinDitibZahlungen { get; set; }

    /// <summary>
    /// FiBuKonto table (Finanz schema) - Chart of Accounts (Kontenplan)
    /// </summary>
    public DbSet<FiBuKonto> FiBuKonten { get; set; }

    /// <summary>
    /// Kassenbuch table (Finanz schema) - Cash Book
    /// </summary>
    public DbSet<Kassenbuch> Kassenbuecher { get; set; }

    /// <summary>
    /// KassenbuchJahresabschluss table (Finanz schema) - Year-End Closing
    /// </summary>
    public DbSet<KassenbuchJahresabschluss> KassenbuchJahresabschluesse { get; set; }

    /// <summary>
    /// SpendenProtokoll table (Finanz schema) - Donation Protocols
    /// </summary>
    public DbSet<SpendenProtokoll> SpendenProtokolle { get; set; }

    /// <summary>
    /// SpendenProtokollDetail table (Finanz schema) - Donation counting details
    /// </summary>
    public DbSet<SpendenProtokollDetail> SpendenProtokollDetails { get; set; }

    /// <summary>
    /// DurchlaufendePosten table (Finanz schema) - Transit items
    /// </summary>
    public DbSet<DurchlaufendePosten> DurchlaufendePosten { get; set; }

    /// <summary>
    /// RechtlicheDaten table (Verein schema)
    /// </summary>
    public DbSet<RechtlicheDaten> RechtlicheDaten { get; set; }

    /// <summary>
    /// VereinSatzung table (Verein schema) - Statute versions
    /// </summary>
    public DbSet<VereinSatzung> VereinSatzungen { get; set; }

    /// <summary>
    /// PageNotes table (Web schema)
    /// </summary>
    public DbSet<PageNote> PageNotes { get; set; }

    /// <summary>
    /// Users table (Web schema) - Authentication
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// UserRoles table (Web schema) - Authorization
    /// </summary>
    public DbSet<UserRole> UserRoles { get; set; }

    #endregion

    #region Brief DbSets

    /// <summary>
    /// BriefVorlagen table (Brief schema) - Letter templates
    /// </summary>
    public DbSet<BriefVorlage> BriefVorlagen { get; set; }

    /// <summary>
    /// Briefe table (Brief schema) - Letter drafts
    /// </summary>
    public DbSet<Brief> Briefe { get; set; }

    /// <summary>
    /// Nachrichten table (Brief schema) - Sent messages
    /// </summary>
    public DbSet<Nachricht> Nachrichten { get; set; }

    #endregion

    #region Keytable DbSets

    /// <summary>
    /// Geschlecht (Gender) lookup table
    /// </summary>
    public DbSet<Geschlecht> Geschlechter { get; set; }

    /// <summary>
    /// Geschlecht translations
    /// </summary>
    public DbSet<GeschlechtUebersetzung> GeschlechtUebersetzungen { get; set; }

    /// <summary>
    /// MitgliedStatus (Member Status) lookup table
    /// </summary>
    public DbSet<MitgliedStatus> MitgliedStatuse { get; set; }

    /// <summary>
    /// MitgliedStatus translations
    /// </summary>
    public DbSet<MitgliedStatusUebersetzung> MitgliedStatusUebersetzungen { get; set; }

    /// <summary>
    /// MitgliedTyp (Member Type) lookup table
    /// </summary>
    public DbSet<MitgliedTyp> MitgliedTypen { get; set; }

    /// <summary>
    /// MitgliedTyp translations
    /// </summary>
    public DbSet<MitgliedTypUebersetzung> MitgliedTypUebersetzungen { get; set; }

    /// <summary>
    /// FamilienbeziehungTyp (Family Relationship Type) lookup table
    /// </summary>
    public DbSet<FamilienbeziehungTyp> FamilienbeziehungTypen { get; set; }

    /// <summary>
    /// FamilienbeziehungTyp translations
    /// </summary>
    public DbSet<FamilienbeziehungTypUebersetzung> FamilienbeziehungTypUebersetzungen { get; set; }

    /// <summary>
    /// ZahlungTyp (Payment Type) lookup table
    /// </summary>
    public DbSet<ZahlungTyp> ZahlungTypen { get; set; }

    /// <summary>
    /// ZahlungTyp translations
    /// </summary>
    public DbSet<ZahlungTypUebersetzung> ZahlungTypUebersetzungen { get; set; }

    /// <summary>
    /// ZahlungStatus (Payment Status) lookup table
    /// </summary>
    public DbSet<ZahlungStatus> ZahlungStatuse { get; set; }

    /// <summary>
    /// ZahlungStatus translations
    /// </summary>
    public DbSet<ZahlungStatusUebersetzung> ZahlungStatusUebersetzungen { get; set; }

    /// <summary>
    /// Forderungsart (Claim Type) lookup table
    /// </summary>
    public DbSet<Forderungsart> Forderungsarten { get; set; }

    /// <summary>
    /// Forderungsart translations
    /// </summary>
    public DbSet<ForderungsartUebersetzung> ForderungsartUebersetzungen { get; set; }

    /// <summary>
    /// Forderungsstatus (Claim Status) lookup table
    /// </summary>
    public DbSet<Forderungsstatus> Forderungsstatuse { get; set; }

    /// <summary>
    /// Forderungsstatus translations
    /// </summary>
    public DbSet<ForderungsstatusUebersetzung> ForderungsstatusUebersetzungen { get; set; }

    /// <summary>
    /// Waehrung (Currency) lookup table
    /// </summary>
    public DbSet<Waehrung> Waehrungen { get; set; }

    /// <summary>
    /// Waehrung translations
    /// </summary>
    public DbSet<WaehrungUebersetzung> WaehrungUebersetzungen { get; set; }

    /// <summary>
    /// Rechtsform (Legal Form) lookup table
    /// </summary>
    public DbSet<Rechtsform> Rechtsformen { get; set; }

    /// <summary>
    /// Rechtsform translations
    /// </summary>
    public DbSet<RechtsformUebersetzung> RechtsformUebersetzungen { get; set; }

    /// <summary>
    /// AdresseTyp (Address Type) lookup table
    /// </summary>
    public DbSet<AdresseTyp> AdresseTypen { get; set; }

    /// <summary>
    /// AdresseTyp translations
    /// </summary>
    public DbSet<AdresseTypUebersetzung> AdresseTypUebersetzungen { get; set; }

    /// <summary>
    /// Kontotyp (Account Type) lookup table
    /// </summary>
    public DbSet<Kontotyp> Kontotypen { get; set; }

    /// <summary>
    /// Kontotyp translations
    /// </summary>
    public DbSet<KontotypUebersetzung> KontotypUebersetzungen { get; set; }

    /// <summary>
    /// MitgliedFamilieStatus (Family Member Status) lookup table
    /// </summary>
    public DbSet<MitgliedFamilieStatus> MitgliedFamilieStatuse { get; set; }

    /// <summary>
    /// MitgliedFamilieStatus translations
    /// </summary>
    public DbSet<MitgliedFamilieStatusUebersetzung> MitgliedFamilieStatusUebersetzungen { get; set; }

    /// <summary>
    /// Staatsangehoerigkeit (Nationality) lookup table
    /// </summary>
    public DbSet<Staatsangehoerigkeit> Staatsangehoerigkeiten { get; set; }

    /// <summary>
    /// Staatsangehoerigkeit translations
    /// </summary>
    public DbSet<StaatsangehoerigkeitUebersetzung> StaatsangehoerigkeitUebersetzungen { get; set; }

    /// <summary>
    /// BeitragPeriode (Contribution Period) lookup table
    /// </summary>
    public DbSet<BeitragPeriode> BeitragPerioden { get; set; }

    /// <summary>
    /// BeitragPeriode translations
    /// </summary>
    public DbSet<BeitragPeriodeUebersetzung> BeitragPeriodeUebersetzungen { get; set; }

    /// <summary>
    /// BeitragZahlungstagTyp (Contribution Payment Day Type) lookup table
    /// </summary>
    public DbSet<BeitragZahlungstagTyp> BeitragZahlungstagTypen { get; set; }

    /// <summary>
    /// BeitragZahlungstagTyp translations
    /// </summary>
    public DbSet<BeitragZahlungstagTypUebersetzung> BeitragZahlungstagTypUebersetzungen { get; set; }

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new VereinConfiguration());
        modelBuilder.ApplyConfiguration(new RechtlicheDatenConfiguration());
        modelBuilder.ApplyConfiguration(new AdresseConfiguration());
        modelBuilder.ApplyConfiguration(new BankkontoConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungAnmeldungConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungBildConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedAdresseConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedFamilieConfiguration());

        // Apply Finanz entity configurations
        modelBuilder.ApplyConfiguration(new BankBuchungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedForderungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedZahlungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedForderungZahlungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedVorauszahlungConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungZahlungConfiguration());
        modelBuilder.ApplyConfiguration(new VereinDitibZahlungConfiguration());
        modelBuilder.ApplyConfiguration(new FiBuKontoConfiguration());
        modelBuilder.ApplyConfiguration(new KassenbuchConfiguration());
        modelBuilder.ApplyConfiguration(new KassenbuchJahresabschlussConfiguration());
        modelBuilder.ApplyConfiguration(new SpendenProtokollConfiguration());
        modelBuilder.ApplyConfiguration(new SpendenProtokollDetailConfiguration());
        modelBuilder.ApplyConfiguration(new DurchlaufendePostenConfiguration());
        modelBuilder.ApplyConfiguration(new VereinSatzungConfiguration());

        // Apply Keytable entity configurations
        modelBuilder.ApplyConfiguration(new GeschlechtConfiguration());
        modelBuilder.ApplyConfiguration(new GeschlechtUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedStatusConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedStatusUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedTypConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedTypUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new FamilienbeziehungTypConfiguration());
        modelBuilder.ApplyConfiguration(new FamilienbeziehungTypUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new ZahlungTypConfiguration());
        modelBuilder.ApplyConfiguration(new ZahlungTypUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new ZahlungStatusConfiguration());
        modelBuilder.ApplyConfiguration(new ZahlungStatusUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new ForderungsartConfiguration());
        modelBuilder.ApplyConfiguration(new ForderungsartUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new ForderungsstatusConfiguration());
        modelBuilder.ApplyConfiguration(new ForderungsstatusUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new WaehrungConfiguration());
        modelBuilder.ApplyConfiguration(new WaehrungUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new RechtsformConfiguration());
        modelBuilder.ApplyConfiguration(new RechtsformUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new AdresseTypConfiguration());
        modelBuilder.ApplyConfiguration(new AdresseTypUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new KontotypConfiguration());
        modelBuilder.ApplyConfiguration(new KontotypUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedFamilieStatusConfiguration());
        modelBuilder.ApplyConfiguration(new MitgliedFamilieStatusUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new StaatsangehoerigkeitConfiguration());
        modelBuilder.ApplyConfiguration(new StaatsangehoerigkeitUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new BeitragPeriodeConfiguration());
        modelBuilder.ApplyConfiguration(new BeitragPeriodeUebersetzungConfiguration());
        modelBuilder.ApplyConfiguration(new BeitragZahlungstagTypConfiguration());
        modelBuilder.ApplyConfiguration(new BeitragZahlungstagTypUebersetzungConfiguration());

        // Apply Web entity configurations
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new PageNoteConfiguration());

        // Apply Brief entity configurations
        modelBuilder.ApplyConfiguration(new BriefVorlageConfiguration());
        modelBuilder.ApplyConfiguration(new BriefConfiguration());
        modelBuilder.ApplyConfiguration(new NachrichtConfiguration());

        // Apply global query filters for soft delete
        ApplyGlobalQueryFilters(modelBuilder);

        // Configure database schema
        ConfigureSchema(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // This will be overridden by DI configuration in Program.cs
            // Fallback to Azure SQL Server if not configured
            optionsBuilder.UseSqlServer("Server=Verein08112025.database.windows.net;Database=VereinDB;User Id=vereinsa;Password=]L1iGfZJ*34iw9;TrustServerCertificate=true;MultipleActiveResultSets=true;Encrypt=true;");
        }

        // Suppress migration warnings for development
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update audit fields before saving
        UpdateAuditFields();
        
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        // Update audit fields before saving
        UpdateAuditFields();
        
        return base.SaveChanges();
    }

    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries<AuditableEntity>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Created = DateTime.UtcNow;
                    entry.Entity.DeletedFlag = false;

                    // Only set Aktiv for entities that have this column in database
                    // Finanz tables don't use Aktiv column - they use DeletedFlag for soft delete
                    // MitgliedFamilie, VeranstaltungAnmeldung, VeranstaltungBild also don't have Aktiv column
                    // Brief entities don't have Aktiv column
                    // FiBuKonto uses IsAktiv instead of Aktiv
                    if (entry.Entity is not BankBuchung
                        && entry.Entity is not MitgliedForderung
                        && entry.Entity is not MitgliedForderungZahlung
                        && entry.Entity is not MitgliedZahlung
                        && entry.Entity is not MitgliedVorauszahlung
                        && entry.Entity is not VeranstaltungZahlung
                        && entry.Entity is not MitgliedFamilie
                        && entry.Entity is not VeranstaltungAnmeldung
                        && entry.Entity is not VeranstaltungBild
                        && entry.Entity is not Brief
                        && entry.Entity is not BriefVorlage
                        && entry.Entity is not FiBuKonto
                        && entry.Entity is not Kassenbuch
                        && entry.Entity is not KassenbuchJahresabschluss
                        && entry.Entity is not SpendenProtokoll
                        && entry.Entity is not DurchlaufendePosten)
                    {
                        entry.Entity.Aktiv = true;
                    }
                    break;

                case EntityState.Modified:
                    entry.Entity.Modified = DateTime.UtcNow;
                    // Prevent modification of Created field
                    entry.Property(e => e.Created).IsModified = false;
                    break;
            }
        }
    }

    private void ApplyGlobalQueryFilters(ModelBuilder modelBuilder)
    {
        // Apply global query filter to exclude soft-deleted entities by default
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(AuditableEntity.DeletedFlag));
                var filter = Expression.Lambda(Expression.Equal(property, Expression.Constant(false, typeof(bool?))), parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
            }
        }
    }

    private void ConfigureSchema(ModelBuilder modelBuilder)
    {
        // Set default schema
        modelBuilder.HasDefaultSchema("Verein");

        // Configure decimal precision globally
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }

        // Configure datetime for DateTime properties (Almanca SQL dosyasına uygun)
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
        {
            property.SetColumnType("datetime");
        }
    }
}
