# Smart Leads — API Documentation

Base URL (local): `http://localhost:5000/api`

All authenticated routes require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST /auth/register
Register a new user.

**Request Body**
```json
{
  "name": "string (2-50 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "role": "admin | sales (optional, default: sales)"
}
```

**Success 201**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "sales" },
    "token": "eyJ..."
  }
}
```

**Error 409** — email already in use  
**Error 400** — validation errors

---

### POST /auth/login
Login with existing credentials.

**Request Body**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success 200**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "admin" },
    "token": "eyJ..."
  }
}
```

**Error 401** — invalid credentials

---

### GET /auth/me
Get the currently authenticated user.

**Success 200**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "email": "...", "role": "admin" }
}
```

---

## Leads

### GET /leads
List leads with optional filters. Paginated (10 per page by default).

**Query Parameters**

| Param  | Type   | Values                          | Default  |
|--------|--------|---------------------------------|----------|
| status | string | New, Contacted, Qualified, Lost | —        |
| source | string | Website, Instagram, Referral    | —        |
| search | string | any                             | —        |
| sort   | string | latest, oldest                  | latest   |
| page   | number | ≥1                              | 1        |
| limit  | number | 1–100                           | 10       |

**Success 200**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Met at conference",
      "createdBy": { "_id": "...", "name": "Admin", "email": "admin@example.com" },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /leads/stats
Get aggregated statistics.

**Success 200**
```json
{
  "success": true,
  "data": {
    "overview": { "total": 42, "New": 10, "Contacted": 15, "Qualified": 12, "Lost": 5 },
    "bySource": [
      { "_id": "Website", "count": 20 },
      { "_id": "Instagram", "count": 15 },
      { "_id": "Referral", "count": 7 }
    ]
  }
}
```

---

### GET /leads/export
Export leads as CSV. Accepts same filters as GET /leads (except page/limit).

**Response** — `text/csv` file download named `leads.csv`

---

### GET /leads/:id
Get a single lead by ID.

**Success 200** — single lead object  
**Error 404** — lead not found  
**Error 403** — sales user trying to access another user's lead  
**Error 400** — invalid MongoDB ID

---

### POST /leads
Create a new lead.

**Request Body**
```json
{
  "name": "string (2-100 chars, required)",
  "email": "string (valid email, required)",
  "status": "New | Contacted | Qualified | Lost (optional, default: New)",
  "source": "Website | Instagram | Referral (required)",
  "notes": "string (max 500 chars, optional)"
}
```

**Success 201** — created lead object

---

### PUT /leads/:id
Update an existing lead. All fields are optional.

**Request Body** — same fields as POST (all optional)

**Success 200** — updated lead object  
**Error 403** — sales user updating another user's lead  
**Error 404** — lead not found

---

### DELETE /leads/:id
Delete a lead. **Admin only.**

**Success 200**
```json
{ "success": true, "message": "Lead deleted successfully." }
```

**Error 403** — not an admin  
**Error 404** — lead not found

---

## Standard Error Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

## HTTP Status Codes Used

| Code | Meaning                |
|------|------------------------|
| 200  | OK                     |
| 201  | Created                |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not Found              |
| 409  | Conflict (duplicate)   |
| 429  | Too Many Requests (rate limited) |
| 500  | Internal Server Error  |
