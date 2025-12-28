using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDurchlaufendePosten : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DurchlaufendePosten",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    FiBuNummer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Bezeichnung = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    EinnahmenDatum = table.Column<DateTime>(type: "date", nullable: false),
                    EinnahmenBetrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AusgabenDatum = table.Column<DateTime>(type: "date", nullable: true),
                    AusgabenBetrag = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Empfaenger = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Referenz = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "OFFEN"),
                    KassenbuchEinnahmeId = table.Column<int>(type: "int", nullable: true),
                    KassenbuchAusgabeId = table.Column<int>(type: "int", nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DurchlaufendePosten", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DurchlaufendePosten_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DurchlaufendePosten_FiBuKonto",
                        column: x => x.FiBuNummer,
                        principalSchema: "Finanz",
                        principalTable: "FiBuKonto",
                        principalColumn: "Nummer",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DurchlaufendePosten_KassenbuchEinnahme",
                        column: x => x.KassenbuchEinnahmeId,
                        principalSchema: "Finanz",
                        principalTable: "Kassenbuch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DurchlaufendePosten_KassenbuchAusgabe",
                        column: x => x.KassenbuchAusgabeId,
                        principalSchema: "Finanz",
                        principalTable: "Kassenbuch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DurchlaufendePosten_VereinDatum",
                schema: "Finanz",
                table: "DurchlaufendePosten",
                columns: new[] { "VereinId", "EinnahmenDatum" });

            migrationBuilder.CreateIndex(
                name: "IX_DurchlaufendePosten_FiBuNummer",
                schema: "Finanz",
                table: "DurchlaufendePosten",
                column: "FiBuNummer");

            migrationBuilder.CreateIndex(
                name: "IX_DurchlaufendePosten_Status",
                schema: "Finanz",
                table: "DurchlaufendePosten",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DurchlaufendePosten",
                schema: "Finanz");
        }
    }
}

