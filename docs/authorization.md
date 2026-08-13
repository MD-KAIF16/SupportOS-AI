# SupportOS AI — Role-Based Access Control (RBAC) & Security Policy

## 1. Role Hierarchy

SupportOS AI defines two main application roles:
- `admin`: Enterprise Tenant Administrator with full operational privileges over tenant Knowledge Base, Analytics, Support Ticket oversight, and team settings.
- `end_user` / `user`: Customer account with access restricted to AI Support Chat and My Tickets.

---

## 2. Authorization Boundaries

| Resource / Endpoint | Admin Role | Customer Role | Unauthenticated |
|---|---|---|---|
| `/admin/*` Routes | `200 OK` | `Redirect /customer/dashboard` | `Redirect /` |
| `/customer/*` Routes | `200 OK` | `200 OK` | `Redirect /` |
| `GET /documents/` | `200 OK` | `403 Forbidden` | `401 Unauthorized` |
| `POST /documents/upload` | `200 OK` | `403 Forbidden` | `401 Unauthorized` |
| `DELETE /documents/{id}` | `200 OK` | `403 Forbidden` | `401 Unauthorized` |
| `GET /api/analytics` | `200 OK` | `403 Forbidden` | `401 Unauthorized` |
| `GET /api/admin/dashboard` | `200 OK` | `403 Forbidden` | `401 Unauthorized` |
| `POST /chat` | `200 OK` | `200 OK` | `401 Unauthorized` |
| `POST /tickets/` | `200 OK` | `201 Created` | `401 Unauthorized` |

---

## 3. Backend Dependency Enforcement

Backend routes enforce roles using FastAPI dependency `require_role(["admin"])`:

```python
def require_role(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "").lower()
        if user_role not in [r.lower() for r in allowed_roles]:
            raise AuthorizationException(
                "You don't have permission to access this resource."
            )
        return current_user
    return role_checker
```
