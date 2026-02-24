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
using System.IdentityModel.Tokens.Jwt;
using Serilog;


var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();

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
builder.Services.AddDbContext<permit_account_serviceContext>(options =>
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
var mappingConfig = new MapperConfiguration(mc =>
                                {
                                    mc.AddProfile(new MappingProfile());
                                    //mc.AddProfile(new ServiceEntityMapper());
                                });
            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = false,

            // This makes sure the handler accepts the token
            SignatureValidator = (token, parameters) =>
            {
                
                var handler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
                var jsonToken = handler.ReadJsonWebToken(token);
                return jsonToken;
            }
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("AUTH FAILED: " + context.Exception);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var claims = context.Principal.Claims.Select(c => $"{c.Type}={c.Value}");
                Console.WriteLine("TOKEN VALIDATED. Claims: " + string.Join(", ", claims));
                return Task.CompletedTask;
            }
        };
    });


    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();


    builder.Services.AddAuthorization();
    var app = builder.Build();
    app.UseSerilogRequestLogging(); 

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