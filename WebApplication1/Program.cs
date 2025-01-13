using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApplication1;
using WebApplication1.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:58899") // frontend 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure database context
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity API
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<DatabaseContext>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "your_issuer", // Zet een geldige issuer in
            ValidAudience = "your_audience", // Zet een geldige audience in
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("JouwGeheimeSleutelVoorDeWebsiteProject123")) // Gebruik een geheime sleutel
        };
    });

// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MedewerkerOnly", policy => policy.RequireRole("Medewerker"));
    options.AddPolicy("UserRoles", policy => policy.RequireRole("Particulier", "Zakelijk", "Medewerker"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MedewerkerOnly", policy => policy.RequireRole("Medewerker"));
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

// Use authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map controllers
app.MapControllers();
app.MapIdentityApi<User>();

// Run the app
app.Run();
