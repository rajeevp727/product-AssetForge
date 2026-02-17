# AssetForge

AssetForge is a modular digital asset & brand portfolio platform that allows businesses to manage brands, buyers, payments, and product access workflows from a single unified system.

The application is designed as a full‑stack solution with secure authentication, role‑based access control, domain‑based navigation handling, and a scalable API‑driven architecture.

---

## Tech Stack

**Backend**

* .NET Core Web API
* Entity Framework Core
* JWT Authentication
* PostgreSQL / SQL Server compatible schema design

**Frontend**

* React (Create React App)
* Axios API integration
* Responsive dashboard UI

**Security**

* BCrypt password hashing
* Access & temporary token validation
* Role‑based authorization

---

## Core Modules

### 1. Authentication & Authorization

* User registration and login
* JWT access tokens
* Temporary token validation for external domain redirects
* Role handling (User, Buyer, Admin)

### 2. Brand Management

Manage business brands and analytics.

Fields:

* Id
* Brand Name
* User Base
* Revenue
* Incorporation Date
* Website URL

API:

```
GET /api/Brands/GetAllBrands
```

### 3. Buyer Flow (Domain Redirect Handling)

When a buyer visits a brand domain:

1. System validates temporary token
2. Buyer is redirected back to AssetForge
3. CTA is shown only once
4. Visit tracking stored in database

### 4. Payments

* Payment records per user/brand
* Status tracking
* Subscription support ready

### 5. App Constants

Centralized configuration storage in database:

* Feature toggles
* Pricing
* CTA visibility rules

### 6. Roles

| Role  | Purpose                 |
| ----- | ----------------------- |
| User  | Normal platform user    |
| Buyer | External domain visitor |
| Admin | System management       |

---

## Project Structure

```
AssetForge
│
├── Backend
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── Domain
│   │   ├── Entities
│   │   └── Enums
│   ├── DTOs
│   ├── Middleware
│   └── Infrastructure
│
├── Frontend
│   ├── components
│   ├── pages
│   ├── services (axios api)
│   ├── utils
│   └── styles```

---

## Database Tables (High Level)

* Users
* Roles
* Brands
* Payments
* BuyerVisits
* AppConstants

---

## Getting Started

### 1. Clone Repository

```
git clone https://github.com/<your-repo>/assetforge.git
cd assetforge
```

### 2. Backend Setup

```
cd Backend

dotnet restore
dotnet ef database update
dotnet run
```

Backend runs on:

```
https://localhost:7099
```

---

### 3. Frontend Setup

```
cd Frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## Environment Variables

Create `appsettings.Development.json`:

```
{
  "Jwt": {
    "Key": "your-secret-key",
    "Issuer": "assetforge",
    "Audience": "assetforge-users",
    "ExpiryMinutes": 60
  }
}
```

---

## Security Practices

* Passwords stored using BCrypt hashing
* JWT validation middleware
* Temporary tokens expire automatically
* Buyer access limited to verified domain visits

---

## Screenshots

### Brands Dashboard

![Brands Dashboard](./screenshots/brands.png)

## Future Enhancements

* Subscription billing integration
* Multi‑tenant brand isolation
* Analytics dashboard
* Public brand marketplace
* Mobile application

---

## License

Private project — internal business usage only.
