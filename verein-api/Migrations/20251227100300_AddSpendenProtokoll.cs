using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddSpendenProtokoll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SpendenProtokoll",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    Datum = table.Column<DateTime>(type: "date", nullable: false),
                    Zweck = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ZweckKategorie = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Protokollant = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Zeuge1Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Zeuge1Unterschrift = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Zeuge2Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Zeuge2Unterschrift = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Zeuge3Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Zeuge3Unterschrift = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    KassenbuchId = table.Column<int>(type: "int", nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpendenProtokoll", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpendenProtokoll_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SpendenProtokoll_Kassenbuch",
                        column: x => x.KassenbuchId,
                        principalSchema: "Finanz",
                        principalTable: "Kassenbuch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SpendenProtokollDetail",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpendenProtokollId = table.Column<int>(type: "int", nullable: false),
                    Wert = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Anzahl = table.Column<int>(type: "int", nullable: false),
                    Summe = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpendenProtokollDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpendenProtokollDetail_SpendenProtokoll",
                        column: x => x.SpendenProtokollId,
                        principalSchema: "Finanz",
                        principalTable: "SpendenProtokoll",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // SpendenProtokoll indexes
            migrationBuilder.CreateIndex(
                name: "IX_SpendenProtokoll_VereinDatum",
                schema: "Finanz",
                table: "SpendenProtokoll",
                columns: new[] { "VereinId", "Datum" });

            migrationBuilder.CreateIndex(
                name: "IX_SpendenProtokoll_ZweckKategorie",
                schema: "Finanz",
                table: "SpendenProtokoll",
                column: "ZweckKategorie");

            migrationBuilder.CreateIndex(
                name: "IX_SpendenProtokoll_KassenbuchId",
                schema: "Finanz",
                table: "SpendenProtokoll",
                column: "KassenbuchId");

            // SpendenProtokollDetail indexes
            migrationBuilder.CreateIndex(
                name: "IX_SpendenProtokollDetail_SpendenProtokollId",
                schema: "Finanz",
                table: "SpendenProtokollDetail",
                column: "SpendenProtokollId");

            migrationBuilder.CreateIndex(
                name: "IX_SpendenProtokollDetail_Wert",
                schema: "Finanz",
                table: "SpendenProtokollDetail",
                column: "Wert");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpendenProtokollDetail",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "SpendenProtokoll",
                schema: "Finanz");
        }
    }
}

