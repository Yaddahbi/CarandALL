using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class fixvoertuigmodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeschikbareDatums",
                table: "Voertuigen");

            migrationBuilder.DropColumn(
                name: "PrijsPerDag",
                table: "Voertuigen");

            migrationBuilder.AddColumn<decimal>(
                name: "Prijs",
                table: "Voertuigen",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prijs",
                table: "Voertuigen");

            migrationBuilder.AddColumn<string>(
                name: "BeschikbareDatums",
                table: "Voertuigen",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PrijsPerDag",
                table: "Voertuigen",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
