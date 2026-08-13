# SupportOS AI — Authentication Architecture Specification

## 1. Overview

SupportOS AI uses a hybrid authentication model combining **Supabase Auth** (credential storage & password hashing) with **Backend JWT Issuance** (HS256 claims with `user_id`, `email`, `role`, and `tenant_id`).

---

## 2. Authentication Flows

### 2.1 Sign In Flow
1. User submits email & password on `/` or `/login`.
2. Frontend calls `POST /api/auth/login`.
3. Backend verifies credentials against Supabase Auth (`supabase.auth.sign_in_with_password`).
4. Backend queries `public.users` table for the user's role and `tenant_id`.
5. Backend signs a HS256 JWT access token containing claims:
   ```json
   {
     "sub": "user-uuid",
     "email": "user@example.com",
     "role": "admin" | "end_user",
     "tenant_id": "tenant-uuid"
   }
   ```
6. Frontend `AuthContext` stores token in `localStorage` and routes user based on role:
   - Admin $\rightarrow$ `/admin/dashboard`
   - Customer $\rightarrow$ `/customer/dashboard`

### 2.2 Customer Self-Registration Flow
1. Customer submits full name, email, and password on `/signup` or register tab.
2. Frontend calls `POST /api/auth/register`.
3. Backend creates user credentials in Supabase Auth (`supabase.auth.sign_up`).
4. **Security Enforcement**: Backend forces `role = "end_user"` (Customer). Self-registering as `admin` is hard-blocked on the backend.
5. User profile record is created in `public.users` table with default tenant association.
6. Backend logs in the user immediately and returns the JWT session.

### 2.3 Password Recovery Flow
1. User requests password reset via `POST /api/auth/forgot-password`.
2. Backend calls `supabase.auth.reset_password_for_email` with configured frontend callback URL.
3. Supabase emails user a secure recovery link.

---

## 3. Session Restoration & Expiration
- Upon page reload, `AuthContext` reads saved token from `localStorage`.
- Calls `GET /api/user/me` with `Authorization: Bearer <token>` to validate token signature and expiration with backend.
- If expired or invalid, session is cleared cleanly without unhandled UI errors.
