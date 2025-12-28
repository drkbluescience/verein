using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddFiBuKonto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FiBuKonto",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nummer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Bezeichnung = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BezeichnungTR = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Bereich = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Typ = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Hauptbereich = table.Column<string>(type: "char(1)", maxLength: 1, nullable: true),
                    HauptbereichName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ZahlungTypId = table.Column<int>(type: "int", nullable: true),
                    Reihenfolge = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsAktiv = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FiBuKonto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FiBuKonto_ZahlungTyp",
                        column: x => x.ZahlungTypId,
                        principalSchema: "Keytable",
                        principalTable: "ZahlungTyp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "UQ_FiBuKonto_Nummer",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "Nummer",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FiBuKonto_Hauptbereich",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "Hauptbereich");

            migrationBuilder.CreateIndex(
                name: "IX_FiBuKonto_Bereich",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "Bereich");

            migrationBuilder.CreateIndex(
                name: "IX_FiBuKonto_Typ",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "Typ");

            migrationBuilder.CreateIndex(
                name: "IX_FiBuKonto_IsAktiv",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "IsAktiv");

            migrationBuilder.CreateIndex(
                name: "IX_FiBuKonto_ZahlungTypId",
                schema: "Finanz",
                table: "FiBuKonto",
                column: "ZahlungTypId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FiBuKonto",
                schema: "Finanz");
        }
    }
}

