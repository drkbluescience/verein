using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddKassenbuch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kassenbuch",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    BelegNr = table.Column<int>(type: "int", nullable: false),
                    BelegDatum = table.Column<DateTime>(type: "date", nullable: false),
                    FiBuNummer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Verwendungszweck = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    EinnahmeKasse = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AusgabeKasse = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EinnahmeBank = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AusgabeBank = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Jahr = table.Column<int>(type: "int", nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: true),
                    MitgliedZahlungId = table.Column<int>(type: "int", nullable: true),
                    BankBuchungId = table.Column<int>(type: "int", nullable: true),
                    Zahlungsweg = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kassenbuch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kassenbuch_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Kassenbuch_FiBuKonto",
                        column: x => x.FiBuNummer,
                        principalSchema: "Finanz",
                        principalTable: "FiBuKonto",
                        principalColumn: "Nummer",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Kassenbuch_Mitglied",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Kassenbuch_MitgliedZahlung",
                        column: x => x.MitgliedZahlungId,
                        principalSchema: "Finanz",
                        principalTable: "MitgliedZahlung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Kassenbuch_BankBuchung",
                        column: x => x.BankBuchungId,
                        principalSchema: "Finanz",
                        principalTable: "BankBuchung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kassenbuch_VereinJahr",
                schema: "Finanz",
                table: "Kassenbuch",
                columns: new[] { "VereinId", "Jahr" });

            migrationBuilder.CreateIndex(
                name: "IX_Kassenbuch_FiBuNummer",
                schema: "Finanz",
                table: "Kassenbuch",
                column: "FiBuNummer");

            migrationBuilder.CreateIndex(
                name: "UQ_Kassenbuch_BelegNr",
                schema: "Finanz",
                table: "Kassenbuch",
                columns: new[] { "VereinId", "Jahr", "BelegNr" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kassenbuch_BelegDatum",
                schema: "Finanz",
                table: "Kassenbuch",
                column: "BelegDatum");

            migrationBuilder.CreateIndex(
                name: "IX_Kassenbuch_MitgliedId",
                schema: "Finanz",
                table: "Kassenbuch",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_Kassenbuch_DeletedFlag",
                schema: "Finanz",
                table: "Kassenbuch",
                column: "DeletedFlag");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kassenbuch",
                schema: "Finanz");
        }
    }
}

