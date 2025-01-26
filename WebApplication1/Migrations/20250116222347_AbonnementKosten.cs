using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AbonnementKosten : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Schades",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Beschrijving",
                table: "Schades",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "BedrijfsDomein",
                table: "Abonnementen",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AbonnementType",
                table: "Abonnementen",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<decimal>(
                name: "KostenPerMaand",
                table: "Abonnementen",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "LaatstGewijzigdOp",
                table: "Abonnementen",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ToekomstigAbonnementType",
                table: "Abonnementen",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ToekomstigeKosten",
                table: "Abonnementen",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WijzigingIngangsdatum",
                table: "Abonnementen",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Schades_VoertuigId",
                table: "Schades",
                column: "VoertuigId");

            migrationBuilder.AddForeignKey(
                name: "FK_Schades_Voertuigen_VoertuigId",
                table: "Schades",
                column: "VoertuigId",
                principalTable: "Voertuigen",
                principalColumn: "VoertuigId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schades_Voertuigen_VoertuigId",
                table: "Schades");

            migrationBuilder.DropIndex(
                name: "IX_Schades_VoertuigId",
                table: "Schades");

            migrationBuilder.DropColumn(
                name: "KostenPerMaand",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "LaatstGewijzigdOp",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "ToekomstigAbonnementType",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "ToekomstigeKosten",
                table: "Abonnementen");

            migrationBuilder.DropColumn(
                name: "WijzigingIngangsdatum",
                table: "Abonnementen");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Schades",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Beschrijving",
                table: "Schades",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "BedrijfsDomein",
                table: "Abonnementen",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "AbonnementType",
                table: "Abonnementen",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
