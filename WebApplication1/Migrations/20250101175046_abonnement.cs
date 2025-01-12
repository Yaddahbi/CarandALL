using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class abonnement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Abonnementen_Bedrijven_BedrijfId",
                table: "Abonnementen");

            migrationBuilder.DropIndex(
                name: "IX_Abonnementen_BedrijfId",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "Einddatum",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "Kosten",
                table: "Abonnementen");

            migrationBuilder.RenameColumn(
                name: "Startdatum",
                table: "Abonnementen",
                newName: "AangemaaktOp");

            migrationBuilder.RenameColumn(
                name: "BedrijfId",
                table: "Abonnementen",
                newName: "MaxMedewerkers");

            migrationBuilder.RenameColumn(
                name: "AbonnementId",
                table: "Abonnementen",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "AbonnementId",
                table: "Bedrijven",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BedrijfsAbonnementId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BedrijfsDomein",
                table: "Abonnementen",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Bedrijven_AbonnementId",
                table: "Bedrijven",
                column: "AbonnementId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_BedrijfsAbonnementId",
                table: "AspNetUsers",
                column: "BedrijfsAbonnementId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Abonnementen_BedrijfsAbonnementId",
                table: "AspNetUsers",
                column: "BedrijfsAbonnementId",
                principalTable: "Abonnementen",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bedrijven_Abonnementen_AbonnementId",
                table: "Bedrijven",
                column: "AbonnementId",
                principalTable: "Abonnementen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Abonnementen_BedrijfsAbonnementId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Bedrijven_Abonnementen_AbonnementId",
                table: "Bedrijven");

            migrationBuilder.DropIndex(
                name: "IX_Bedrijven_AbonnementId",
                table: "Bedrijven");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_BedrijfsAbonnementId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AbonnementId",
                table: "Bedrijven");

            migrationBuilder.DropColumn(
                name: "BedrijfsAbonnementId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "BedrijfsDomein",
                table: "Abonnementen");

            migrationBuilder.RenameColumn(
                name: "MaxMedewerkers",
                table: "Abonnementen",
                newName: "BedrijfId");

            migrationBuilder.RenameColumn(
                name: "AangemaaktOp",
                table: "Abonnementen",
                newName: "Startdatum");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Abonnementen",
                newName: "AbonnementId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Einddatum",
                table: "Abonnementen",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Kosten",
                table: "Abonnementen",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Abonnementen_BedrijfId",
                table: "Abonnementen",
                column: "BedrijfId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Abonnementen_Bedrijven_BedrijfId",
                table: "Abonnementen",
                column: "BedrijfId",
                principalTable: "Bedrijven",
                principalColumn: "BedrijfId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
