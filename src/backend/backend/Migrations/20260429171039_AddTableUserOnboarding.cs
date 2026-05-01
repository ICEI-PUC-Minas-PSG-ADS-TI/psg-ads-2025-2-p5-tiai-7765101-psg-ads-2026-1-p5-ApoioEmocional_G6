using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTableUserOnboarding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CurrentyStatus",
                table: "UserOnboardings",
                newName: "CurrentStatus");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "UserOnboardings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_UserOnboardings_UserId",
                table: "UserOnboardings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserOnboardings_Users_UserId",
                table: "UserOnboardings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserOnboardings_Users_UserId",
                table: "UserOnboardings");

            migrationBuilder.DropIndex(
                name: "IX_UserOnboardings_UserId",
                table: "UserOnboardings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserOnboardings");

            migrationBuilder.RenameColumn(
                name: "CurrentStatus",
                table: "UserOnboardings",
                newName: "CurrentyStatus");
        }
    }
}
