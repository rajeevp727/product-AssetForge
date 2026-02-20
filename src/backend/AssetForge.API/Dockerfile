FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy solution + all project files first (cache restore)
COPY ../AssetForge.API/AssetForge.API.csproj AssetForge.API/
COPY ../AssetForge.Application/AssetForge.Application.csproj AssetForge.Application/
COPY ../AssetForge.Domain/AssetForge.Domain.csproj AssetForge.Domain/
COPY ../AssetForge.Infrastructure/AssetForge.Infrastructure.csproj AssetForge.Infrastructure/

RUN dotnet restore AssetForge.API/AssetForge.API.csproj

# copy everything else
COPY .. .

WORKDIR /src/AssetForge.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "AssetForge.API.dll"]