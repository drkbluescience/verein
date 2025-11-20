using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddVereinDitibZahlungTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserType",
                schema: "Web",
                table: "PageNote");

            migrationBuilder.AddColumn<bool>(
                name: "IstWiederholend",
                schema: "Verein",
                table: "Veranstaltung",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WiederholungEnde",
                schema: "Verein",
                table: "Veranstaltung",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WiederholungInterval",
                schema: "Verein",
                table: "Veranstaltung",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WiederholungMonatTag",
                schema: "Verein",
                table: "Veranstaltung",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WiederholungTage",
                schema: "Verein",
                table: "Veranstaltung",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WiederholungTyp",
                schema: "Verein",
                table: "Veranstaltung",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                schema: "Web",
                table: "PageNote",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                schema: "Web",
                table: "PageNote",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "User",
                schema: "Web",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Vorname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nachname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime", nullable: true),
                    FailedLoginAttempts = table.Column<int>(type: "int", nullable: false),
                    LockoutEnd = table.Column<DateTime>(type: "datetime", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VereinDitibZahlung",
                schema: "Finanz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    Betrag = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WaehrungId = table.Column<int>(type: "int", nullable: false),
                    Zahlungsdatum = table.Column<DateTime>(type: "datetime", nullable: false),
                    Zahlungsperiode = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
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
                    table.PrimaryKey("PK_VereinDitibZahlung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VereinDitibZahlung_BankBuchung",
                        column: x => x.BankBuchungId,
                        principalSchema: "Finanz",
                        principalTable: "BankBuchung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_VereinDitibZahlung_Bankkonto",
                        column: x => x.BankkontoId,
                        principalSchema: "Verein",
                        principalTable: "Bankkonto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_VereinDitibZahlung_Verein",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VereinSatzung",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VereinId = table.Column<int>(type: "int", nullable: false),
                    DosyaPfad = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SatzungVom = table.Column<DateTime>(type: "datetime", nullable: false),
                    Aktif = table.Column<bool>(type: "bit", nullable: false),
                    Bemerkung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DosyaAdi = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DosyaBoyutu = table.Column<long>(type: "bigint", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VereinSatzung", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VereinSatzung_Verein_VereinId",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                schema: "Web",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MitgliedId = table.Column<int>(type: "int", nullable: true),
                    VereinId = table.Column<int>(type: "int", nullable: true),
                    GueltigVon = table.Column<DateTime>(type: "datetime", nullable: false),
                    GueltigBis = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Bemerkung = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRole", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRole_Mitglied_MitgliedId",
                        column: x => x.MitgliedId,
                        principalSchema: "Mitglied",
                        principalTable: "Mitglied",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserRole_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Web",
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRole_Verein_VereinId",
                        column: x => x.VereinId,
                        principalSchema: "Verein",
                        principalTable: "Verein",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_MitgliedId",
                schema: "Web",
                table: "UserRole",
                column: "MitgliedId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_UserId",
                schema: "Web",
                table: "UserRole",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_VereinId",
                schema: "Web",
                table: "UserRole",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_BankBuchungId",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                column: "BankBuchungId");

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_BankkontoId",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                column: "BankkontoId");

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_VereinId",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                column: "VereinId");

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_VereinId_Zahlungsperiode",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                columns: new[] { "VereinId", "Zahlungsperiode" });

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_Zahlungsdatum",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                column: "Zahlungsdatum");

            migrationBuilder.CreateIndex(
                name: "IX_VereinDitibZahlung_Zahlungsperiode",
                schema: "Finanz",
                table: "VereinDitibZahlung",
                column: "Zahlungsperiode");

            migrationBuilder.CreateIndex(
                name: "IX_VereinSatzung_VereinId",
                schema: "Verein",
                table: "VereinSatzung",
                column: "VereinId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserRole",
                schema: "Web");

            migrationBuilder.DropTable(
                name: "VereinDitibZahlung",
                schema: "Finanz");

            migrationBuilder.DropTable(
                name: "VereinSatzung",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "User",
                schema: "Web");

            migrationBuilder.DropColumn(
                name: "IstWiederholend",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.DropColumn(
                name: "WiederholungEnde",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.DropColumn(
                name: "WiederholungInterval",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.DropColumn(
                name: "WiederholungMonatTag",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.DropColumn(
                name: "WiederholungTage",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.DropColumn(
                name: "WiederholungTyp",
                schema: "Verein",
                table: "Veranstaltung");

            migrationBuilder.AlterColumn<int>(
                name: "ModifiedBy",
                schema: "Web",
                table: "PageNote",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                schema: "Web",
                table: "PageNote",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserType",
                schema: "Web",
                table: "PageNote",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
