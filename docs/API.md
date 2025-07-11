# API Documentation

## Authentication

### Login
```
POST /api/auth/login
```

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "fullName": "string",
    "role": {
      "id": "number",
      "name": "string"
    }
  }
}
```

## User Management

### Get Users
```
GET /api/users
```

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": "number",
      "email": "string",
      "fullName": "string",
      "role": {
        "id": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Create User
```
POST /api/users
```

Request body:
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "roleId": "number"
}
```

## Role Management

### Get Roles
```
GET /api/roles
```

### Create Role
```
POST /api/roles
```

Request body:
```json
{
  "name": "string",
  "description": "string",
  "permissions": ["number"]
}
```

## Menu Management

### Get Menus
```
GET /api/menus
```

### Create Menu
```
POST /api/menus
```

Request body:
```json
{
  "name": "string",
  "path": "string",
  "icon": "string",
  "parentId": "number|null",
  "order": "number"
}
```

## Error Responses

All endpoints may return these error responses:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Not enough permissions
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error
