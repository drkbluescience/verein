using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddForderungsartAndForderungsstatusToMitgliedForderung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "VeranstaltungZahlung");

            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedZahlung");

            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedVorauszahlung");

            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedForderungZahlung");

            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedForderung");

            migrationBuilder.DropColumn(
                name: "Aktiv",
                schema: "Finanz",
                table: "BankBuchung");

            migrationBuilder.EnsureSchema(
                name: "Keytable");

            migrationBuilder.AddColumn<int>(
                name: "ForderungsartId",
                schema: "Finanz",
                table: "MitgliedForderung",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ForderungsstatusId",
                schema: "Finanz",
                table: "MitgliedForderung",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AdresseTyp",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdresseTyp", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BeitragPeriode",
                schema: "Keytable",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Sort = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BeitragPeriode", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "BeitragZahlungstagTyp",
                schema: "Keytable",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Sort = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BeitragZahlungstagTyp", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "FamilienbeziehungTyp",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilienbeziehungTyp", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Forderungsart",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forderungsart", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Forderungsstatus",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forderungsstatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Geschlecht",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Geschlecht", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kontotyp",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kontotyp", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedFamilieStatus",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedFamilieStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedStatus",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedTyp",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedTyp", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rechtsform",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rechtsform", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Staatsangehoerigkeit",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Iso2 = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Iso3 = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staatsangehoerigkeit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Waehrung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Waehrung", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ZahlungStatus",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahlungStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ZahlungTyp",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahlungTyp", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdresseTypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdresseTypId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdresseTypUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdresseTypUebersetzung_AdresseTyp_AdresseTypId",
                        column: x => x.AdresseTypId,
                        principalSchema: "Keytable",
                        principalTable: "AdresseTyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BeitragPeriodeUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    BeitragPeriodeCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BeitragPeriodeUebersetzung", x => new { x.BeitragPeriodeCode, x.Sprache });
                    table.ForeignKey(
                        name: "FK_BeitragPeriodeUebersetzung_BeitragPeriode_BeitragPeriodeCode",
                        column: x => x.BeitragPeriodeCode,
                        principalSchema: "Keytable",
                        principalTable: "BeitragPeriode",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BeitragZahlungstagTypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BeitragZahlungstagTypUebersetzung", x => new { x.Code, x.Sprache });
                    table.ForeignKey(
                        name: "FK_BeitragZahlungstagTypUebersetzung_BeitragZahlungstagTyp_Code",
                        column: x => x.Code,
                        principalSchema: "Keytable",
                        principalTable: "BeitragZahlungstagTyp",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilienbeziehungTypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilienbeziehungTypId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilienbeziehungTypUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilienbeziehungTypUebersetzung_FamilienbeziehungTyp_FamilienbeziehungTypId",
                        column: x => x.FamilienbeziehungTypId,
                        principalSchema: "Keytable",
                        principalTable: "FamilienbeziehungTyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ForderungsartUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ForderungsartId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForderungsartUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ForderungsartUebersetzung_Forderungsart_ForderungsartId",
                        column: x => x.ForderungsartId,
                        principalSchema: "Keytable",
                        principalTable: "Forderungsart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ForderungsstatusUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ForderungsstatusId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForderungsstatusUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ForderungsstatusUebersetzung_Forderungsstatus_ForderungsstatusId",
                        column: x => x.ForderungsstatusId,
                        principalSchema: "Keytable",
                        principalTable: "Forderungsstatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GeschlechtUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GeschlechtId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeschlechtUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GeschlechtUebersetzung_Geschlecht_GeschlechtId",
                        column: x => x.GeschlechtId,
                        principalSchema: "Keytable",
                        principalTable: "Geschlecht",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KontotypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KontotypId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KontotypUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KontotypUebersetzung_Kontotyp_KontotypId",
                        column: x => x.KontotypId,
                        principalSchema: "Keytable",
                        principalTable: "Kontotyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedFamilieStatusUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MitgliedFamilieStatusId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedFamilieStatusUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedFamilieStatusUebersetzung_MitgliedFamilieStatus_MitgliedFamilieStatusId",
                        column: x => x.MitgliedFamilieStatusId,
                        principalSchema: "Keytable",
                        principalTable: "MitgliedFamilieStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedStatusUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MitgliedStatusId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedStatusUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedStatusUebersetzung_MitgliedStatus_MitgliedStatusId",
                        column: x => x.MitgliedStatusId,
                        principalSchema: "Keytable",
                        principalTable: "MitgliedStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MitgliedTypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MitgliedTypId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitgliedTypUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitgliedTypUebersetzung_MitgliedTyp_MitgliedTypId",
                        column: x => x.MitgliedTypId,
                        principalSchema: "Keytable",
                        principalTable: "MitgliedTyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RechtsformUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RechtsformId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RechtsformUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RechtsformUebersetzung_Rechtsform_RechtsformId",
                        column: x => x.RechtsformId,
                        principalSchema: "Keytable",
                        principalTable: "Rechtsform",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StaatsangehoerigkeitUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaatsangehoerigkeitId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaatsangehoerigkeitUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaatsangehoerigkeitUebersetzung_Staatsangehoerigkeit_StaatsangehoerigkeitId",
                        column: x => x.StaatsangehoerigkeitId,
                        principalSchema: "Keytable",
                        principalTable: "Staatsangehoerigkeit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WaehrungUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaehrungUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WaehrungUebersetzung_Waehrung_WaehrungId",
                        column: x => x.WaehrungId,
                        principalSchema: "Keytable",
                        principalTable: "Waehrung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZahlungStatusUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ZahlungStatusId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahlungStatusUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahlungStatusUebersetzung_ZahlungStatus_ZahlungStatusId",
                        column: x => x.ZahlungStatusId,
                        principalSchema: "Keytable",
                        principalTable: "ZahlungStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZahlungTypUebersetzung",
                schema: "Keytable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ZahlungTypId = table.Column<int>(type: "int", nullable: false),
                    Sprache = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahlungTypUebersetzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahlungTypUebersetzung_ZahlungTyp_ZahlungTypId",
                        column: x => x.ZahlungTypId,
                        principalSchema: "Keytable",
                        principalTable: "ZahlungTyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdresseTyp_Code_Unique",
                schema: "Keytable",
                table: "AdresseTyp",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdresseTypUebersetzung_AdresseTypId_Sprache_Unique",
                schema: "Keytable",
                table: "AdresseTypUebersetzung",
                columns: new[] { "AdresseTypId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BeitragPeriode_Sort",
                schema: "Keytable",
                table: "BeitragPeriode",
                column: "Sort");

            migrationBuilder.CreateIndex(
                name: "IX_BeitragZahlungstagTyp_Sort",
                schema: "Keytable",
                table: "BeitragZahlungstagTyp",
                column: "Sort");

            migrationBuilder.CreateIndex(
                name: "IX_FamilienbeziehungTyp_Code_Unique",
                schema: "Keytable",
                table: "FamilienbeziehungTyp",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FamilienbeziehungTypUebersetzung_FamilienbeziehungTypId_Sprache_Unique",
                schema: "Keytable",
                table: "FamilienbeziehungTypUebersetzung",
                columns: new[] { "FamilienbeziehungTypId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Forderungsart_Code_Unique",
                schema: "Keytable",
                table: "Forderungsart",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ForderungsartUebersetzung_ForderungsartId_Sprache_Unique",
                schema: "Keytable",
                table: "ForderungsartUebersetzung",
                columns: new[] { "ForderungsartId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Forderungsstatus_Code_Unique",
                schema: "Keytable",
                table: "Forderungsstatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ForderungsstatusUebersetzung_ForderungsstatusId_Sprache_Unique",
                schema: "Keytable",
                table: "ForderungsstatusUebersetzung",
                columns: new[] { "ForderungsstatusId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Geschlecht_Code_Unique",
                schema: "Keytable",
                table: "Geschlecht",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GeschlechtUebersetzung_GeschlechtId_Sprache_Unique",
                schema: "Keytable",
                table: "GeschlechtUebersetzung",
                columns: new[] { "GeschlechtId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kontotyp_Code_Unique",
                schema: "Keytable",
                table: "Kontotyp",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KontotypUebersetzung_KontotypId_Sprache_Unique",
                schema: "Keytable",
                table: "KontotypUebersetzung",
                columns: new[] { "KontotypId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilieStatus_Code_Unique",
                schema: "Keytable",
                table: "MitgliedFamilieStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedFamilieStatusUebersetzung_MitgliedFamilieStatusId_Sprache_Unique",
                schema: "Keytable",
                table: "MitgliedFamilieStatusUebersetzung",
                columns: new[] { "MitgliedFamilieStatusId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedStatus_Code_Unique",
                schema: "Keytable",
                table: "MitgliedStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedStatusUebersetzung_MitgliedStatusId_Sprache_Unique",
                schema: "Keytable",
                table: "MitgliedStatusUebersetzung",
                columns: new[] { "MitgliedStatusId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedTyp_Code_Unique",
                schema: "Keytable",
                table: "MitgliedTyp",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MitgliedTypUebersetzung_MitgliedTypId_Sprache_Unique",
                schema: "Keytable",
                table: "MitgliedTypUebersetzung",
                columns: new[] { "MitgliedTypId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rechtsform_Code_Unique",
                schema: "Keytable",
                table: "Rechtsform",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RechtsformUebersetzung_RechtsformId_Sprache_Unique",
                schema: "Keytable",
                table: "RechtsformUebersetzung",
                columns: new[] { "RechtsformId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staatsangehoerigkeit_Iso2_Unique",
                schema: "Keytable",
                table: "Staatsangehoerigkeit",
                column: "Iso2",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staatsangehoerigkeit_Iso3_Unique",
                schema: "Keytable",
                table: "Staatsangehoerigkeit",
                column: "Iso3",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaatsangehoerigkeitUebersetzung_StaatsangehoerigkeitId_Sprache_Unique",
                schema: "Keytable",
                table: "StaatsangehoerigkeitUebersetzung",
                columns: new[] { "StaatsangehoerigkeitId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Waehrung_Code_Unique",
                schema: "Keytable",
                table: "Waehrung",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WaehrungUebersetzung_WaehrungId_Sprache_Unique",
                schema: "Keytable",
                table: "WaehrungUebersetzung",
                columns: new[] { "WaehrungId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahlungStatus_Code_Unique",
                schema: "Keytable",
                table: "ZahlungStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahlungStatusUebersetzung_ZahlungStatusId_Sprache_Unique",
                schema: "Keytable",
                table: "ZahlungStatusUebersetzung",
                columns: new[] { "ZahlungStatusId", "Sprache" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahlungTyp_Code_Unique",
                schema: "Keytable",
                table: "ZahlungTyp",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahlungTypUebersetzung_ZahlungTypId_Sprache_Unique",
                schema: "Keytable",
                table: "ZahlungTypUebersetzung",
                columns: new[] { "ZahlungTypId", "Sprache" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdresseTypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "BeitragPeriodeUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "BeitragZahlungstagTypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "FamilienbeziehungTypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ForderungsartUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ForderungsstatusUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "GeschlechtUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "KontotypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedFamilieStatusUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedStatusUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedTypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "RechtsformUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "StaatsangehoerigkeitUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "WaehrungUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ZahlungStatusUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ZahlungTypUebersetzung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "AdresseTyp",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "BeitragPeriode",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "BeitragZahlungstagTyp",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "FamilienbeziehungTyp",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Forderungsart",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Forderungsstatus",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Geschlecht",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Kontotyp",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedFamilieStatus",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedStatus",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "MitgliedTyp",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Rechtsform",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Staatsangehoerigkeit",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "Waehrung",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ZahlungStatus",
                schema: "Keytable");

            migrationBuilder.DropTable(
                name: "ZahlungTyp",
                schema: "Keytable");

            migrationBuilder.DropColumn(
                name: "ForderungsartId",
                schema: "Finanz",
                table: "MitgliedForderung");

            migrationBuilder.DropColumn(
                name: "ForderungsstatusId",
                schema: "Finanz",
                table: "MitgliedForderung");

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "VeranstaltungZahlung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedZahlung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedVorauszahlung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedForderungZahlung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "MitgliedForderung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                schema: "Finanz",
                table: "BankBuchung",
                type: "bit",
                nullable: true);
        }
    }
}
