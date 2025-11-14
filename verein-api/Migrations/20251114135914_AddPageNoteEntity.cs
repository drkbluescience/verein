using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VereinsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPageNoteEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Adresse_Verein_VereinId1",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.DropIndex(
                name: "IX_Adresse_VereinId1",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.DropColumn(
                name: "VereinId1",
                schema: "Verein",
                table: "Adresse");

            migrationBuilder.EnsureSchema(
                name: "Web");

            migrationBuilder.CreateTable(
                name: "PageNote",
                schema: "Web",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PageTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EntityType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UserEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CompletedBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    AdminNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedFlag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageNote", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_Category",
                schema: "Web",
                table: "PageNote",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_Created",
                schema: "Web",
                table: "PageNote",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_DeletedFlag",
                schema: "Web",
                table: "PageNote",
                column: "DeletedFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_EntityType_EntityId",
                schema: "Web",
                table: "PageNote",
                columns: new[] { "EntityType", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_PageUrl",
                schema: "Web",
                table: "PageNote",
                column: "PageUrl");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_Priority",
                schema: "Web",
                table: "PageNote",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_Status",
                schema: "Web",
                table: "PageNote",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PageNote_UserEmail",
                schema: "Web",
                table: "PageNote",
                column: "UserEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PageNote",
                schema: "Web");

            migrationBuilder.AddColumn<int>(
                name: "VereinId1",
                schema: "Verein",
                table: "Adresse",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Adresse_VereinId1",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Adresse_Verein_VereinId1",
                schema: "Verein",
                table: "Adresse",
                column: "VereinId1",
                principalSchema: "Verein",
                principalTable: "Verein",
                principalColumn: "Id");
        }
    }
}
