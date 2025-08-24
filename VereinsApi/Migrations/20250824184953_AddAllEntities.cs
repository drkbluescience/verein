using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAllEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Address",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Street = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    HouseNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    PostalCode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    City = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, defaultValue: "Deutschland"),
                    AddressType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BankAccount",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BankName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    IBAN = table.Column<string>(type: "TEXT", maxLength: 34, nullable: true),
                    BIC = table.Column<string>(type: "TEXT", maxLength: 11, nullable: true),
                    AccountHolder = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    AccountType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankAccount", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LegalForm",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ShortName = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegalForm", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Member",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MemberNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MembershipType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Active"),
                    AddressId = table.Column<int>(type: "INTEGER", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Member", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Member_Address_AddressId",
                        column: x => x.AddressId,
                        principalSchema: "Verein",
                        principalTable: "Address",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AssociationMember",
                schema: "Verein",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AssociationId = table.Column<int>(type: "INTEGER", nullable: false),
                    MemberId = table.Column<int>(type: "INTEGER", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LeaveDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssociationMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssociationMember_Association_AssociationId",
                        column: x => x.AssociationId,
                        principalSchema: "Verein",
                        principalTable: "Association",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssociationMember_Member_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "Verein",
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Association_LegalFormId",
                schema: "Verein",
                table: "Association",
                column: "LegalFormId");

            migrationBuilder.CreateIndex(
                name: "IX_Association_MainAddressId",
                schema: "Verein",
                table: "Association",
                column: "MainAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Association_MainBankAccountId",
                schema: "Verein",
                table: "Association",
                column: "MainBankAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_AddressType",
                schema: "Verein",
                table: "Address",
                column: "AddressType");

            migrationBuilder.CreateIndex(
                name: "IX_Address_City",
                schema: "Verein",
                table: "Address",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Address_IsActive",
                schema: "Verein",
                table: "Address",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Address_IsActive_IsDeleted",
                schema: "Verein",
                table: "Address",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Address_IsDeleted",
                schema: "Verein",
                table: "Address",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Address_PostalCode",
                schema: "Verein",
                table: "Address",
                column: "PostalCode");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_AssociationId",
                schema: "Verein",
                table: "AssociationMember",
                column: "AssociationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_AssociationId_MemberId",
                schema: "Verein",
                table: "AssociationMember",
                columns: new[] { "AssociationId", "MemberId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_IsActive",
                schema: "Verein",
                table: "AssociationMember",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_IsActive_IsDeleted",
                schema: "Verein",
                table: "AssociationMember",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_IsDeleted",
                schema: "Verein",
                table: "AssociationMember",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_MemberId",
                schema: "Verein",
                table: "AssociationMember",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationMember_Role",
                schema: "Verein",
                table: "AssociationMember",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_AccountType",
                schema: "Verein",
                table: "BankAccount",
                column: "AccountType");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_BankName",
                schema: "Verein",
                table: "BankAccount",
                column: "BankName");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_IBAN",
                schema: "Verein",
                table: "BankAccount",
                column: "IBAN",
                unique: true,
                filter: "[IBAN] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_IsActive",
                schema: "Verein",
                table: "BankAccount",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_IsActive_IsDeleted",
                schema: "Verein",
                table: "BankAccount",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_IsDeleted",
                schema: "Verein",
                table: "BankAccount",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LegalForm_IsActive",
                schema: "Verein",
                table: "LegalForm",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LegalForm_IsActive_IsDeleted",
                schema: "Verein",
                table: "LegalForm",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LegalForm_IsDeleted",
                schema: "Verein",
                table: "LegalForm",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LegalForm_Name",
                schema: "Verein",
                table: "LegalForm",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LegalForm_ShortName",
                schema: "Verein",
                table: "LegalForm",
                column: "ShortName",
                unique: true,
                filter: "[ShortName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Member_AddressId",
                schema: "Verein",
                table: "Member",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Member_Email",
                schema: "Verein",
                table: "Member",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Member_IsActive",
                schema: "Verein",
                table: "Member",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Member_IsActive_IsDeleted",
                schema: "Verein",
                table: "Member",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Member_IsDeleted",
                schema: "Verein",
                table: "Member",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Member_LastName",
                schema: "Verein",
                table: "Member",
                column: "LastName");

            migrationBuilder.CreateIndex(
                name: "IX_Member_MemberNumber",
                schema: "Verein",
                table: "Member",
                column: "MemberNumber",
                unique: true,
                filter: "[MemberNumber] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Association_Address_MainAddressId",
                schema: "Verein",
                table: "Association",
                column: "MainAddressId",
                principalSchema: "Verein",
                principalTable: "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Association_BankAccount_MainBankAccountId",
                schema: "Verein",
                table: "Association",
                column: "MainBankAccountId",
                principalSchema: "Verein",
                principalTable: "BankAccount",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Association_LegalForm_LegalFormId",
                schema: "Verein",
                table: "Association",
                column: "LegalFormId",
                principalSchema: "Verein",
                principalTable: "LegalForm",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Association_Address_MainAddressId",
                schema: "Verein",
                table: "Association");

            migrationBuilder.DropForeignKey(
                name: "FK_Association_BankAccount_MainBankAccountId",
                schema: "Verein",
                table: "Association");

            migrationBuilder.DropForeignKey(
                name: "FK_Association_LegalForm_LegalFormId",
                schema: "Verein",
                table: "Association");

            migrationBuilder.DropTable(
                name: "AssociationMember",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "BankAccount",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "LegalForm",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Member",
                schema: "Verein");

            migrationBuilder.DropTable(
                name: "Address",
                schema: "Verein");

            migrationBuilder.DropIndex(
                name: "IX_Association_LegalFormId",
                schema: "Verein",
                table: "Association");

            migrationBuilder.DropIndex(
                name: "IX_Association_MainAddressId",
                schema: "Verein",
                table: "Association");

            migrationBuilder.DropIndex(
                name: "IX_Association_MainBankAccountId",
                schema: "Verein",
                table: "Association");
        }
    }
}
