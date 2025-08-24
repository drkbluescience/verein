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

            migrationBuilder.CreateTable(
                name: "Association",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AssociationNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    TaxNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    LegalFormId = table.Column<int>(type: "INTEGER", nullable: true),
                    FoundingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Purpose = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MainAddressId = table.Column<int>(type: "INTEGER", nullable: true),
                    MainBankAccountId = table.Column<int>(type: "INTEGER", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Website = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SocialMediaLinks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ChairmanName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ManagerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RepresentativeEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ContactPersonName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MemberCount = table.Column<int>(type: "INTEGER", nullable: true),
                    StatutePath = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LogoPath = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ExternalReferenceId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ClientCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EPostReceiveAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SEPACreditorId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    VATNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ElectronicSignatureKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Association", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Association_AssociationNumber",
                schema: "Verein",
                table: "Association",
                column: "AssociationNumber",
                unique: true,
                filter: "[AssociationNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Association_ClientCode",
                schema: "Verein",
                table: "Association",
                column: "ClientCode",
                unique: true,
                filter: "[ClientCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Association_Email",
                schema: "Verein",
                table: "Association",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Association_IsActive",
                schema: "Verein",
                table: "Association",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Association_IsActive_IsDeleted",
                schema: "Verein",
                table: "Association",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Association_IsDeleted",
                schema: "Verein",
                table: "Association",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Association_Name",
                schema: "Verein",
                table: "Association",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Association",
                schema: "Verein");
        }
    }
}
