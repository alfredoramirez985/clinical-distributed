# Auth API Documentation

## Base URL

```
http://localhost:3000/v1/auth
```

---

## POST /register

Creates a new user account and returns a JWT token.

### curl Example
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "name": "John Doe", "password": "securePassword123"}'
```

### Request

**Headers:**
| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

**Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | ✅ | Valid email address |
| `name` | `string` | ✅ | User's display name |
| `password` | `string` | ✅ | User's password |

**Example:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

### Responses

**201 Created** — User registered successfully
```json
{
  "message": "User registered",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-15T20:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**400 Bad Request** — Validation error or email already registered
```json
{
  "error": "Email already registered"
}
```

---

## POST /login

Authenticates a user and returns a JWT token.

### curl Example
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securePassword123"}'
```

### Request

**Headers:**
| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

**Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | ✅ | Valid email address |
| `password` | `string` | ✅ | User's password |

### Responses

**200 OK** — Login successful
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-15T20:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**401 Unauthorized** — Invalid credentials
```json
{
  "error": "Invalid email or password"
}
```

---

## GET /profile

Retrieves the profile of the currently authenticated user.

### curl Example
```bash
curl -X GET http://localhost:3000/v1/auth/profile \
  -H "Authorization: Bearer <your_token_here>"
```

### Request

**Headers:**
| Header | Value | Required | Description |
|---|---|---|---|
| `Authorization` | `Bearer <token>` | ✅ | JWT Token |

### Responses

**200 OK**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-15T20:00:00.000Z"
  }
}
```

**401 Unauthorized** — Missing or invalid token
```json
{
  "error": "Invalid token"
}
```

---

## POST /logout

Logs out the current user (acknowledges client-side token deletion).

### curl Example
```bash
curl -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer <your_token_here>"
```

### Request

**Headers:**
| Header | Value | Optional | Description |
|---|---|---|---|
| `Authorization` | `Bearer <token>` | ✓ | JWT Token |

### Responses

**200 OK**
```json
{
  "message": "Logged out successfully"
}
```

---

## POST /refresh

Refreshes an existing valid JWT token to extend its expiration.

### curl Example
```bash
curl -X POST http://localhost:3000/v1/auth/refresh \
  -H "Authorization: Bearer <your_token_here>"
```

### Request

**Headers:**
| Header | Value | Required | Description |
|---|---|---|---|
| `Authorization` | `Bearer <token>` | ✅ | JWT Token |

### Responses

**200 OK**
```json
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**401 Unauthorized** — Missing, invalid, or expired token
```json
{
  "error": "No token provided"
}
```

---

## POST /admin/upgrade-user

Upgrades or modifies another user's role. **Requires an active `admin` JWT.**

### curl Example
```bash
curl -X POST http://localhost:3000/v1/auth/admin/upgrade-user \
  -H "Authorization: Bearer <admin_token_here>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "550e8400-e29b-41d4-a716-446655440000", "role": "doctor"}'
```

### Request

**Headers:**
| Header | Value | Required | Description |
|---|---|---|---|
| `Authorization` | `Bearer <token>` | ✅ | Admin JWT Token |
| `Content-Type` | `application/json` | ✅ | |

**Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | ✅ | The ID of the user to upgrade |
| `role` | `enum` | ✅ | `"admin" \| "doctor" \| "invited"` |

### Responses

**200 OK**
```json
{
  "message": "User role upgraded successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "doctor_bob@example.com",
    "name": "Doctor Bob",
    "role": "doctor",
    "createdAt": "2026-03-15T22:00:00.000Z"
  }
}
```

**401 Unauthorized** — Token missing, or caller is not an `admin`
```json
{
  "error": "Forbidden: Admin privileges required"
}
```

**404 Not Found** — User ID does not exist
```json
{
  "error": "User not found"
}
```
