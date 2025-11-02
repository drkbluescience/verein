using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Verein");

            migrationBuilder.EnsureSchema(
                name: "Finanz");

            migrationBuilder.EnsureSchema(
                name: "Mitglied");

            migrationBuilder.CreateTable(
                name: "Adresse",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: true),
                    AdresseTypId = table.Column<int>(type: "int", nullable: true),
                    Strasse = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Hausnummer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Adresszusatz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PLZ = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Ort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Stadtteil = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Bundesland = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Land = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Deutschland"),
                    Postfach = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Telefonnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Faxnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    EMail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Kontaktperson = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Hinweis = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,8)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(11,8)", nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IstStandard = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adresse", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BankBuchung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    BankKontoId = table.Column<int>(type: "int", nullable: false),
                    Buchungsdatum = table.Column<DateTime>(type: "datetime", nullable: false),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Empfaenger = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Verwendungszweck = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Referenz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    AngelegtAm = table.Column<DateTime>(type: "datetime", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankBuchung", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bankkonto",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    KontotypId = table.Column<int>(type: "int", nullable: true),
                    IBAN = table.Column<string>(type: "nvarchar(34)", maxLength: 34, nullable: false),
                    BIC = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Kontoinhaber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Bankname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    KontoNr = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    BLZ = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Beschreibung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IstStandard = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bankkonto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Verein",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Kurzname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Vereinsnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Steuernummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    RechtsformId = table.Column<int>(type: "int", nullable: true),
                    Gruendungsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Zweck = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AdresseId = table.Column<int>(type: "int", nullable: true),
                    HauptBankkontoId = table.Column<int>(type: "int", nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Webseite = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SocialMediaLinks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Vorstandsvorsitzender = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Geschaeftsfuehrer = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    VertreterEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Kontaktperson = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Mitgliederzahl = table.Column<int>(type: "int", nullable: true),
                    SatzungPfad = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LogoPfad = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ExterneReferenzId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Mandantencode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EPostEmpfangAdresse = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SEPA_GlaeubigerID = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UstIdNr = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ElektronischeSignaturKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Verein", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Verein_Adresse_AdresseId",
                        column: x => x.AdresseId,
                        principalSchema: "Verein",
                        principalTable: "Adresse",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Verein_Bankkonto_HauptBankkontoId",
                        column: x => x.HauptBankkontoId,
                        principalSchema: "Verein",
                        principalTable: "Bankkonto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Mitglied",
                schema: "Mitglied",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    Mitgliedsnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    MitgliedStatusId = table.Column<int>(type: "int", nullable: false),
                    MitgliedTypId = table.Column<int>(type: "int", nullable: false),
                    Vorname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nachname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GeschlechtId = table.Column<int>(type: "int", nullable: true),
                    Geburtsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Geburtsort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StaatsangehoerigkeitId = table.Column<int>(type: "int", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Mobiltelefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Eintrittsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Austrittsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    BeitragBetrag = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BeitragWaehrungId = table.Column<int>(type: "int", nullable: true),
                    BeitragPeriodeCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BeitragZahlungsTag = table.Column<int>(type: "int", nullable: true),
                    BeitragZahlungstagTypCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BeitragIstPflicht = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mitglied", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mitglied_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Veranstaltung",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    Titel = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Beschreibung = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Beginn = table.Column<DateTime>(type: "datetime", nullable: false),
                    Ende = table.Column<DateTime>(type: "datetime", nullable: true),
                    Preis = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    WaehrungId = table.Column<int>(type: "int", nullable: true),
                    Ort = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    NurFuerMitglieder = table.Column<bool>(type: "bit", nullable: false),
                    MaxTeilnehmer = table.Column<int>(type: "int", nullable: true),
                    AnmeldeErforderlich = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Veranstaltung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Veranstaltung_Verein_VereinId",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedAdresse",
                schema: "Mitglied",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MitgliedId = table.Column<int>(type: "int", nullable: false),
                    AdresseTypId = table.Column<int>(type: "int", nullable: false),
                    Strasse = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Hausnummer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Adresszusatz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PLZ = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Ort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Stadtteil = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Bundesland = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Land = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Postfach = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Telefonnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    EMail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Hinweis = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IstStandard = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedAdresse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedAdresse_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedFamilie",
                schema: "Mitglied",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: false),
                    ParentMitgliedId = table.Column<int>(type: "int", nullable: false),
                    FamilienbeziehungTypId = table.Column<int>(type: "int", nullable: false),
                    MitgliedFamilieStatusId = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    Hinweis = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedFamilie", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedFamilie_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedFamilie_ParentMitglied",
                        column: x => x.ParentMitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedFamilie_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedForderung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: false),
                    ZahlungTypId = table.Column<int>(type: "int", nullable: false),
                    Forderungsnummer = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Jahr = table.Column<int>(type: "int", nullable: true),
                    Quartal = table.Column<int>(type: "int", nullable: true),
                    Monat = table.Column<int>(type: "int", nullable: true),
                    Faelligkeit = table.Column<DateTime>(type: "datetime", nullable: false),
                    Beschreibung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    BezahltAm = table.Column<DateTime>(type: "datetime", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedForderung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedForderung_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedForderung_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VeranstaltungAnmeldung",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true),
                    VeranstaltungId = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Preis = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    WaehrungId = table.Column<int>(type: "int", nullable: true),
                    ZahlungStatusId = table.Column<int>(type: "int", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VeranstaltungAnmeldung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VeranstaltungAnmeldung_Mitglied_MitgliedId",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_VeranstaltungAnmeldung_Veranstaltung_VeranstaltungId",
                        column: x => x.VeranstaltungId,
                        principalSchema: "Verein",
                        principalTable: "Veranstaltung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VeranstaltungBild",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VeranstaltungId = table.Column<int>(type: "int", nullable: false),
                    BildPfad = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Reihenfolge = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    Titel = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VeranstaltungBild", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VeranstaltungBild_Veranstaltung_VeranstaltungId",
                        column: x => x.VeranstaltungId,
                        principalSchema: "Verein",
                        principalTable: "Veranstaltung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedZahlung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: false),
                    ForderungId = table.Column<int>(type: "int", nullable: true),
                    ZahlungTypId = table.Column<int>(type: "int", nullable: false),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Zahlungsdatum = table.Column<DateTime>(type: "datetime", nullable: false),
                    Zahlungsweg = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    BankkontoId = table.Column<int>(type: "int", nullable: true),
                    Referenz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    BankBuchungId = table.Column<int>(type: "int", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedZahlung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedZahlung_BankBuchung",
                        column: x => x.BankBuchungId,
                        principalSchema: "Finanz",
                        principalTable: "BankBuchung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MitgliedZahlung_Bankkonto",
                        column: x => x.BankkontoId,
                        principalSchema: "Verein",
                        principalTable: "Bankkonto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MitgliedZahlung_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedZahlung_MitgliedForderung",
                        column: x => x.ForderungId,
                        principalSchema: "Finanz",
                        principalTable: "MitgliedForderung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MitgliedZahlung_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VeranstaltungZahlung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VeranstaltungId = table.Column<int>(type: "int", nullable: false),
                    AnmeldungId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Zahlungsdatum = table.Column<DateTime>(type: "datetime", nullable: false),
                    Zahlungsweg = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Referenz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VeranstaltungZahlung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VeranstaltungZahlung_Veranstaltung",
                        column: x => x.VeranstaltungId,
                        principalSchema: "Verein",
                        principalTable: "Veranstaltung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VeranstaltungZahlung_VeranstaltungAnmeldung",
                        column: x => x.AnmeldungId,
                        principalSchema: "Verein",
                        principalTable: "VeranstaltungAnmeldung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedForderungZahlung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ForderungId = table.Column<int>(type: "int", nullable: false),
                    ZahlungId = table.Column<int>(type: "int", nullable: false),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedForderungZahlung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedForderungZahlung_MitgliedForderung",
                        column: x => x.ForderungId,
                        principalSchema: "Finanz",
                        principalTable: "MitgliedForderung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MitgliedForderungZahlung_MitgliedZahlung",
                        column: x => x.ZahlungId,
                        principalSchema: "Finanz",
                        principalTable: "MitgliedZahlung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedVorauszahlung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: false),
                    ZahlungId = table.Column<int>(type: "int", nullable: false),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Beschreibung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedVorauszahlung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedVorauszahlung_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedVorauszahlung_MitgliedZahlung",
                        column: x => x.ZahlungId,
                        principalSchema: "Finanz",
                        principalTable: "MitgliedZahlung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MitgliedVorauszahlung_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Adresse_DeletedFlag",
                schema: "Verein",
                table: "Adresse",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Adresse_Ort",
                schema: "Verein",
                table: "Adresse",
                column: "Ort");

            migrationBuilder.CreateIndex(
                name: "IX_Adresse_PLZ",
                schema: "Verein",
                table: "Adresse",
                column: "PLZ");

            migrationBuilder.CreateIndex(
                name: "IX_Adresse_VereinId",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_BankBuchung_BankKontoId",
                schema: "Finanz",
                table: "BankBuchung",
                column: "BankKontoId");

            migrationBuilder.CreateIndex(
                name: "IX_BankBuchung_Buchungsdatum",
                schema: "Finanz",
                table: "BankBuchung",
                column: "Buchungsdatum");

            migrationBuilder.CreateIndex(
                name: "IX_BankBuchung_DeletedFlag",
                schema: "Finanz",
                table: "BankBuchung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_BankBuchung_StatusId",
                schema: "Finanz",
                table: "BankBuchung",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_BankBuchung_VereinId",
                schema: "Finanz",
                table: "BankBuchung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_Bankkonto_DeletedFlag",
                schema: "Verein",
                table: "Bankkonto",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Bankkonto_IBAN",
                schema: "Verein",
                table: "Bankkonto",
                column: "IBAN",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bankkonto_IstStandard",
                schema: "Verein",
                table: "Bankkonto",
                column: "IstStandard");

            migrationBuilder.CreateIndex(
                name: "IX_Bankkonto_VereinId",
                schema: "Verein",
                table: "Bankkonto",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_DeletedFlag",
                schema: "Mitglied",
                table: "Mitglied",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_Email",
                schema: "Mitglied",
                table: "Mitglied",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_Mitgliedsnummer",
                schema: "Mitglied",
                table: "Mitglied",
                column: "Mitgliedsnummer",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_MitgliedStatusId",
                schema: "Mitglied",
                table: "Mitglied",
                column: "MitgliedStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_MitgliedTypId",
                schema: "Mitglied",
                table: "Mitglied",
                column: "MitgliedTypId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_Name",
                schema: "Mitglied",
                table: "Mitglied",
                columns: new[] { "Nachname", "Vorname" });

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_StaatsangehoerigkeitId",
                schema: "Mitglied",
                table: "Mitglied",
                column: "StaatsangehoerigkeitId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitglied_VereinId",
                schema: "Mitglied",
                table: "Mitglied",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_AdresseTypId",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "AdresseTypId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_DeletedFlag",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_IstStandard",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "IstStandard");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_MitgliedId",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_MitgliedId_IstStandard",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                columns: new[] { "MitgliedId", "IstStandard" });

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_Ort",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "Ort");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedAdresse_PLZ",
                schema: "Mitglied",
                table: "MitgliedAdresse",
                column: "PLZ");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_DeletedFlag",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_FamilienbeziehungTypId",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "FamilienbeziehungTypId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_MitgliedFamilieStatusId",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "MitgliedFamilieStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_MitgliedId",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_ParentMitgliedId",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "ParentMitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilie_VereinId",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "UQ_MitgliedFamilie",
                schema: "Mitglied",
                table: "MitgliedFamilie",
                columns: new[] { "VereinId", "MitgliedId", "ParentMitgliedId", "FamilienbeziehungTypId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_DeletedFlag",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_Faelligkeit",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "Faelligkeit");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_Forderungsnummer",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "Forderungsnummer");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_JahrMonat",
                schema: "Finanz",
                table: "MitgliedForderung",
                columns: new[] { "Jahr", "Monat" });

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_MitgliedId",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_StatusId",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderung_VereinId",
                schema: "Finanz",
                table: "MitgliedForderung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderungZahlung_DeletedFlag",
                schema: "Finanz",
                table: "MitgliedForderungZahlung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderungZahlung_ForderungId",
                schema: "Finanz",
                table: "MitgliedForderungZahlung",
                column: "ForderungId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderungZahlung_ForderungId_ZahlungId",
                schema: "Finanz",
                table: "MitgliedForderungZahlung",
                columns: new[] { "ForderungId", "ZahlungId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedForderungZahlung_ZahlungId",
                schema: "Finanz",
                table: "MitgliedForderungZahlung",
                column: "ZahlungId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedVorauszahlung_DeletedFlag",
                schema: "Finanz",
                table: "MitgliedVorauszahlung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedVorauszahlung_MitgliedId",
                schema: "Finanz",
                table: "MitgliedVorauszahlung",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedVorauszahlung_VereinId",
                schema: "Finanz",
                table: "MitgliedVorauszahlung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedVorauszahlung_ZahlungId",
                schema: "Finanz",
                table: "MitgliedVorauszahlung",
                column: "ZahlungId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_BankBuchungId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "BankBuchungId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_BankkontoId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "BankkontoId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_DeletedFlag",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_ForderungId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "ForderungId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_MitgliedId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_StatusId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_VereinId",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedZahlung_Zahlungsdatum",
                schema: "Finanz",
                table: "MitgliedZahlung",
                column: "Zahlungsdatum");

            migrationBuilder.CreateIndex(
                name: "IX_Veranstaltung_Aktiv",
                schema: "Verein",
                table: "Veranstaltung",
                column: "Aktiv");

            migrationBuilder.CreateIndex(
                name: "IX_Veranstaltung_DeletedFlag",
                schema: "Verein",
                table: "Veranstaltung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Veranstaltung_Startdatum",
                schema: "Verein",
                table: "Veranstaltung",
                column: "Beginn");

            migrationBuilder.CreateIndex(
                name: "IX_Veranstaltung_Titel",
                schema: "Verein",
                table: "Veranstaltung",
                column: "Titel");

            migrationBuilder.CreateIndex(
                name: "IX_Veranstaltung_VereinId",
                schema: "Verein",
                table: "Veranstaltung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungAnmeldung_DeletedFlag",
                schema: "Verein",
                table: "VeranstaltungAnmeldung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungAnmeldung_Email",
                schema: "Verein",
                table: "VeranstaltungAnmeldung",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungAnmeldung_MitgliedId",
                schema: "Verein",
                table: "VeranstaltungAnmeldung",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungAnmeldung_Status",
                schema: "Verein",
                table: "VeranstaltungAnmeldung",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungAnmeldung_VeranstaltungId",
                schema: "Verein",
                table: "VeranstaltungAnmeldung",
                column: "VeranstaltungId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungBild_DeletedFlag",
                schema: "Verein",
                table: "VeranstaltungBild",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungBild_Reihenfolge",
                schema: "Verein",
                table: "VeranstaltungBild",
                column: "Reihenfolge");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungBild_VeranstaltungId",
                schema: "Verein",
                table: "VeranstaltungBild",
                column: "VeranstaltungId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungZahlung_AnmeldungId",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                column: "AnmeldungId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungZahlung_DeletedFlag",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungZahlung_StatusId",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungZahlung_VeranstaltungId",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                column: "VeranstaltungId");

            migrationBuilder.CreateIndex(
                name: "IX_VeranstaltungZahlung_Zahlungsdatum",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                column: "Zahlungsdatum");

            migrationBuilder.CreateIndex(
                name: "IX_Verein_AdresseId",
                schema: "Verein",
                table: "Verein",
                column: "AdresseId");

            migrationBuilder.CreateIndex(
                name: "IX_Verein_DeletedFlag",
                schema: "Verein",
                table: "Verein",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Verein_Email",
                schema: "Verein",
                table: "Verein",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Verein_HauptBankkontoId",
                schema: "Verein",
                table: "Verein",
                column: "HauptBankkontoId");

            migrationBuilder.CreateIndex(
                name: "IX_Verein_Name",
                schema: "Verein",
                table: "Verein",
                column: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_Adresse_Verein_VereinId",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BankBuchung_Bankkonto",
                schema: "Finanz",
                table: "BankBuchung",
                column: "BankKontoId",
                principalSchema: "Verein",
                principalTable: "Bankkonto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BankBuchung_Verein",
                schema: "Finanz",
                table: "BankBuchung",
                column: "VereinId",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bankkonto_Verein_VereinId",
                schema: "Verein",
                table: "Bankkonto",
                column: "VereinId",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Adresse_Verein_VereinId",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.DropForeignKey(
                name: "FK_Bankkonto_Verein_VereinId",
                schema: "Verein",
                table: "Bankkonto");

            migrationBuilder.DropTable(
                name: "MitgliedAdresse",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "MitgliedFamilie",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "MitgliedForderungZahlung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "MitgliedVorauszahlung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "VeranstaltungBild",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "VeranstaltungZahlung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "MitgliedZahlung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "VeranstaltungAnmeldung",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "BankBuchung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "MitgliedForderung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "Veranstaltung",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Mitglied",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "Verein",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Adresse",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Bankkonto",
                schema: "Verein");
        }
    }
}
