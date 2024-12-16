using Microsoft.AspNetCore.Identity;

namespace WebApplication1
{
    public class RoleInitializer
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Particulier", "ZakelijkeHuurder", "Wagenparkbeheerder", "BackofficeMedewerker", "FrontofficeMedewerker", "Admin" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}


