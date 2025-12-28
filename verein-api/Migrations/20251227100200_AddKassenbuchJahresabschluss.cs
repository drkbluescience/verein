using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddKassenbuchJahresabschluss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KassenbuchJahresabschluss",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    Jahr = table.Column<int>(type: "int", nullable: false),
                    KasseAnfangsbestand = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    KasseEndbestand = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BankAnfangsbestand = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BankEndbestand = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SparbuchEndbestand = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AbschlussDatum = table.Column<DateTime>(type: "date", nullable: false),
                    Geprueft = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    GeprueftVon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GeprueftAm = table.Column<DateTime>(type: "date", nullable: true),
                    Bemerkung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KassenbuchJahresabschluss", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KassenbuchJahresabschluss_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "UQ_Jahresabschluss_VereinJahr",
                schema: "Finanz",
                table: "KassenbuchJahresabschluss",
                columns: new[] { "VereinId", "Jahr" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KassenbuchJahresabschluss_Jahr",
                schema: "Finanz",
                table: "KassenbuchJahresabschluss",
                column: "Jahr");

            migrationBuilder.CreateIndex(
                name: "IX_KassenbuchJahresabschluss_Geprueft",
                schema: "Finanz",
                table: "KassenbuchJahresabschluss",
                column: "Geprueft");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KassenbuchJahresabschluss",
                schema: "Finanz");
        }
    }
}

