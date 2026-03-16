# Auth API Documentation

## Base URL

```
http://localhost:3000/v1/auth
```

---

## POST /register

Creates a new user account and returns a JWT token.

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
