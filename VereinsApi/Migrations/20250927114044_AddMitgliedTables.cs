using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMitgliedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Verein");

            migrationBuilder.EnsureSchema(
                name: "Mitglied");

            migrationBuilder.CreateTable(
                name: "Adresse",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VereinId = table.Column<int>(type: "INTEGER", nullable: true),
                    AdresseTypId = table.Column<int>(type: "INTEGER", nullable: true),
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
                    Latitude = table.Column<double>(type: "decimal(10,8)", nullable: true),
                    Longitude = table.Column<double>(type: "decimal(11,8)", nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IstStandard = table.Column<bool>(type: "INTEGER", nullable: true),
                    VereinId1 = table.Column<int>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adresse", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bankkonto",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VereinId = table.Column<int>(type: "INTEGER", nullable: false),
                    KontotypId = table.Column<int>(type: "INTEGER", nullable: true),
                    IBAN = table.Column<string>(type: "nvarchar(34)", maxLength: 34, nullable: false),
                    BIC = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Kontoinhaber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Bankname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    KontoNr = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    BLZ = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Beschreibung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IstStandard = table.Column<bool>(type: "INTEGER", nullable: true),
                    VereinId1 = table.Column<int>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Kurzname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Vereinsnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Steuernummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    RechtsformId = table.Column<int>(type: "INTEGER", nullable: true),
                    Gruendungsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Zweck = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AdresseId = table.Column<int>(type: "INTEGER", nullable: true),
                    HauptBankkontoId = table.Column<int>(type: "INTEGER", nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Webseite = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SocialMediaLinks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Vorstandsvorsitzender = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Geschaeftsfuehrer = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    VertreterEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Kontaktperson = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Mitgliederzahl = table.Column<int>(type: "INTEGER", nullable: true),
                    SatzungPfad = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LogoPfad = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ExterneReferenzId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Mandantencode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EPostEmpfangAdresse = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SEPA_GlaeubigerID = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UstIdNr = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ElektronischeSignaturKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VereinId = table.Column<int>(type: "INTEGER", nullable: false),
                    Mitgliedsnummer = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    MitgliedStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    MitgliedTypId = table.Column<int>(type: "INTEGER", nullable: false),
                    Vorname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nachname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GeschlechtId = table.Column<int>(type: "INTEGER", nullable: true),
                    Geburtsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Geburtsort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StaatsangehoerigkeitId = table.Column<int>(type: "INTEGER", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Mobiltelefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Eintrittsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Austrittsdatum = table.Column<DateTime>(type: "datetime", nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    BeitragBetrag = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BeitragWaehrungId = table.Column<int>(type: "INTEGER", nullable: true),
                    BeitragPeriodeCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BeitragZahlungsTag = table.Column<int>(type: "INTEGER", nullable: true),
                    BeitragZahlungstagTypCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BeitragIstPflicht = table.Column<bool>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: true),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true, defaultValue: true)
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
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VereinId = table.Column<int>(type: "INTEGER", nullable: false),
                    Titel = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Beschreibung = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Beginn = table.Column<DateTime>(type: "datetime", nullable: false),
                    Ende = table.Column<DateTime>(type: "datetime", nullable: true),
                    Preis = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    WaehrungId = table.Column<int>(type: "INTEGER", nullable: true),
                    Ort = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    NurFuerMitglieder = table.Column<bool>(type: "INTEGER", nullable: false),
                    MaxTeilnehmer = table.Column<int>(type: "INTEGER", nullable: true),
                    AnmeldeErforderlich = table.Column<bool>(type: "INTEGER", nullable: false),
                    VereinId1 = table.Column<int>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_Veranstaltung_Verein_VereinId1",
                        column: x => x.VereinId1,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MitgliedAdresse",
                schema: "Mitglied",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MitgliedId = table.Column<int>(type: "INTEGER", nullable: false),
                    AdresseTypId = table.Column<int>(type: "INTEGER", nullable: false),
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
                    IstStandard = table.Column<bool>(type: "INTEGER", nullable: true, defaultValue: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: true),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true, defaultValue: true)
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
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VereinId = table.Column<int>(type: "INTEGER", nullable: false),
                    MitgliedId = table.Column<int>(type: "INTEGER", nullable: false),
                    ParentMitgliedId = table.Column<int>(type: "INTEGER", nullable: false),
                    FamilienbeziehungTypId = table.Column<int>(type: "INTEGER", nullable: false),
                    MitgliedFamilieStatusId = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: true),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    Hinweis = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: true),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                name: "VeranstaltungAnmeldung",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VeranstaltungId = table.Column<int>(type: "INTEGER", nullable: false),
                    MitgliedId = table.Column<int>(type: "INTEGER", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Preis = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    WaehrungId = table.Column<int>(type: "INTEGER", nullable: true),
                    ZahlungStatusId = table.Column<int>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VeranstaltungBild",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VeranstaltungId = table.Column<int>(type: "INTEGER", nullable: false),
                    BildPfad = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Reihenfolge = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    Titel = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "INTEGER", nullable: true)
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
                name: "IX_Adresse_VereinId1",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId1");

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
                name: "IX_Bankkonto_VereinId1",
                schema: "Verein",
                table: "Bankkonto",
                column: "VereinId1");

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
                name: "IX_Veranstaltung_VereinId1",
                schema: "Verein",
                table: "Veranstaltung",
                column: "VereinId1");

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
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Adresse_Verein_VereinId1",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId1",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bankkonto_Verein_VereinId",
                schema: "Verein",
                table: "Bankkonto",
                column: "VereinId",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bankkonto_Verein_VereinId1",
                schema: "Verein",
                table: "Bankkonto",
                column: "VereinId1",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Adresse_Verein_VereinId",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.DropForeignKey(
                name: "FK_Adresse_Verein_VereinId1",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.DropForeignKey(
                name: "FK_Bankkonto_Verein_VereinId",
                schema: "Verein",
                table: "Bankkonto");

            migrationBuilder.DropForeignKey(
                name: "FK_Bankkonto_Verein_VereinId1",
                schema: "Verein",
                table: "Bankkonto");

            migrationBuilder.DropTable(
                name: "MitgliedAdresse",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "MitgliedFamilie",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "VeranstaltungAnmeldung",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "VeranstaltungBild",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Mitglied",
                schema: "Mitglied");

            migrationBuilder.DropTable(
                name: "Veranstaltung",
                schema: "Verein");

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
