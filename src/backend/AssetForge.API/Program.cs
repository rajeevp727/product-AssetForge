using AssetForge.Application.Features;
using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Domain.Enums;
using AssetForge.Infrastructure;
using AssetForge.Infrastructure.Persistence;
using AssetForge.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<GetAllBrandsHandler>();
builder.Services.AddScoped<IJwtRepository, JwtRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("react",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var jwt = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            ValidIssuer = jwt!.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),

            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role
        };


        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();

                context.Response.ContentType = "application/json";

                var isAuthenticated = context.HttpContext.User?.Identity?.IsAuthenticated ?? false;

                if (isAuthenticated)
                {
                    // Logged in but wrong role
                    context.Response.StatusCode = 403;

                    var role = context.HttpContext.User?.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

                    await context.Response.WriteAsync($$"""
            {
                "error": "You are logged in as '{{role}}'. This feature requires Admin or Buyer access."
            }
            """);
                }
                else
                {
                    // No token / invalid token
                    context.Response.StatusCode = 401;

                    await context.Response.WriteAsync("""
            {
                "error": "Authentication required. Please login to continue."
            }
            """);
                }
            },

            OnForbidden = async context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";

                var role = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

                await context.Response.WriteAsync($$"""
        {
            "error": "Access denied for role '{{role}}'. Contact admin if you need access."
        }
        """);
            }
        };

    });

builder.Services.ConfigureHttpJsonOptions(options =>
{

    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});



builder.Services.AddSwaggerGen(Options =>
{
    Options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AssetForge.API",
        Version = "v1"
    });

    Options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: {token}"
    });
    Options.OperationFilter<AuthOperationFilter>();
});


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AssetForge API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();

app.UseCors("react");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
