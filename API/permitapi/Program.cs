using Data.DbEntities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Data;
using permitapi;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using contract;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
.AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PermitAccountDbContext>(options =>
options.UseSqlServer(connectionString));
var mappingConfig = new MapperConfiguration(mc =>
                                {
                                    mc.AddProfile(new MappingProfile());
                                    //mc.AddProfile(new ServiceEntityMapper());
                                });
            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    // 1️⃣ Authority (used to discover signing keys and issuer config)
    options.Authority = "https://login.microsoftonline.com/bfbb9a2b-6d99-4e78-b3c7-95005d555c8b";

    // 2️⃣ Token validation
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,           // ❌ Skip checking the token's issuer
        ValidateAudience = false,         // ❌ Skip checking the audience
        ValidateLifetime = false,         // ❌ Skip expiry check
        ValidateIssuerSigningKey = false, // ❌ Skip signature check
        SignatureValidator = (token, parameters) =>
        {
            var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(token);
            return jwt; // Just parse and return the token without validating it
        }
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Optional: log token or context here
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var jwt = context.SecurityToken as System.IdentityModel.Tokens.Jwt.JwtSecurityToken;

          
            if (jwt != null && context.Principal.Identity is ClaimsIdentity identity)
            {
                if (!identity.Claims.Any())
                {
                    var claims = jwt.Claims;
                    identity.AddClaims(claims);
                }
            }

            return Task.CompletedTask;
        }
    };
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();


builder.Services.AddAuthorization();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(builder => builder
                                .AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader());
}



app.UseHttpsRedirection();
app.UseAuthentication(); // 👈 This is missing!
app.UseAuthorization();
app.MapControllers();
app.Run();
