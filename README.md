# SecureAuth

SecureAuth is a complete MERN authentication application with a monochrome React interface, cookie-based JWT sessions, MongoDB persistence, email verification, password reset, profile settings, CSRF protection, and security headers.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB local instance or MongoDB Atlas
- Optional SMTP credentials for email delivery

## Install

```powershell
cd "d:\wev dev raj\Secure Auth\client"
npm install
cd ..\server
npm install
```

## Environment

Copy `server/.env.example` to `server/.env` and configure it:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/secureauth
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
COOKIE_SECRET=replace-with-a-random-secret-at-least-32-characters
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=SecureAuth <no-reply@example.com>
```

The client can copy `client/.env.example` to `client/.env` if a non-default API URL is required.

### MongoDB

Start a local MongoDB service, or create an Atlas cluster and set `MONGODB_URI` to the Atlas connection string.

### SMTP

Configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, and `EMAIL_FROM`. With SMTP credentials absent, the application remains usable but reports email delivery as not configured. It never falsely claims that email was sent.

## Run locally

Open two terminals:

```powershell
cd "d:\wev dev raj\Secure Auth\server"
pm run dev
```

```powershell
cd "d:\wev dev raj\Secure Auth\client"
pm run dev
```

Open `http://localhost:5173`.

## Test and build

```powershell
cd "d:\wev dev raj\Secure Auth\server"
npm test

cd ..\client
npm run build
npm run lint
```

## API

All protected requests require the `auth_token` HTTP-only cookie. State-changing requests also require the `X-CSRF-Token` header matching the readable `csrf_token` cookie.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Create session |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/me` | Restore session user |
| POST | `/api/auth/forgot-password` | Request reset link |
| POST | `/api/auth/reset-password` | Consume reset token |
| POST | `/api/auth/verify-email` | Consume verification token |
| POST | `/api/auth/resend-verification` | Send another verification email |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/users/profile` | Read profile |
| PATCH | `/api/users/profile` | Update permitted profile fields |

## Security

Passwords use bcrypt with 12 rounds. Verification and reset tokens are cryptographically random and stored only as SHA-256 hashes. Reset and verification tokens expire, and reset tokens are removed after use. JWTs are stored in HTTP-only cookies with configurable remember-me lifetime. Helmet, CORS allowlisting, JSON limits, validation, authentication middleware, CSRF checks, and rate limiting are enabled. Profile updates allow only `fullName`.

## Troubleshooting

- MongoDB connection refused: verify MongoDB is running or replace `MONGODB_URI` with a valid Atlas URI.
- CORS failure: set `CLIENT_URL` exactly to the frontend origin.
- Email links missing: configure SMTP variables and inspect server logs for SMTP failures.
- CSRF 403: ensure the frontend uses `withCredentials: true` and sends `X-CSRF-Token` for POST/PATCH requests.
