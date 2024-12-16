using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Models
{
    public class User : IdentityUser
    {
        public string Naam { get; set; }
        public string Adres { get; set; }
    }
}
