# Maze Backend API

This is the backend API for the Maze application. It is built with Node.js, Express, and PostgreSQL.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
  - [Register User](#register-user)
- [Error Handling](#error-handling)
- [Sample Requests & Responses](#sample-requests--responses)
- [Status Codes](#status-codes)
- [Project Structure](#project-structure)

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Set up your `.env` file** (see [Environment Variables](#environment-variables)).

3. **Start the server:**
   ```sh
   npm run dev
   ```
   or
   ```sh
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=3000
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

---

## Database Structure

The backend uses a PostgreSQL database. The main table is `users`:

| Column    | Type         | Constraints                                   |
|-----------|--------------|-----------------------------------------------|
| id        | SERIAL       | PRIMARY KEY                                   |
| firstname | VARCHAR(255) | NOT NULL, min length 3                        |
| lastname  | VARCHAR(255) | min length 3                                  |
| email     | VARCHAR(255) | NOT NULL, UNIQUE                              |
| password  | VARCHAR(255) | NOT NULL                                      |
| socketid  | VARCHAR(255) |                                               |

---

## API Endpoints

### Register User

- **URL:** `/api/v1/user/register`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Description:** Registers a new user.

#### Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars if provided)
- `email` (string, required, must be unique)
- `password` (string, required)

#### Success Response

- **Status:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "message": "User created successful",
    "data": {
      "id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com"
    },
    "success": true
  }
  ```

#### Error Responses

- **Status:** `400 Bad Request`
  - Missing required fields.
  ```json
  {
    "statusCode": 400,
    "success": false,
    "message": "Name ,email or password can not be empty"
  }
  ```

- **Status:** `409 Conflict`
  - Email already exists.
  ```json
  {
    "statusCode": 409,
    "success": false,
    "message": "User already exist or dublicate email"
  }
  ```

- **Status:** `500 Internal Server Error`
  - Unexpected server error.
  ```json
  {
    "statusCode": 500,
    "success": false,
    "message": "something went wrong"
  }
  ```

---

## Error Handling

All errors return a JSON response with:
- `statusCode`: HTTP status code
- `success`: false
- `message`: Error message

---

## Sample Requests & Responses

### Register User

**Request:**
```sh
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "Alice", "lastname": "Smith"},
    "email": "alice@example.com",
    "password": "securepassword"
  }'
```

**Success Response:**
```json
{
  "statusCode": 201,
  "message": "User created successful",
  "data": {
    "id": 2,
    "firstname": "Alice",
    "lastname": "Smith",
    "email": "alice@example.com"
  },
  "success": true
}
```

---

## Status Codes

- `201 Created` – User registered successfully
- `400 Bad Request` – Missing or invalid fields
- `409 Conflict` – Email already exists
- `500 Internal Server Error` – Unexpected error

---

## Project Structure

```
Backend/
  src/
    app.js
    index.js
    controllers/
      user.controller.js
    db/
      createUserTable.js
      dbConnect.js
    routes/
      user.routes.js
    services/
      user.service.js
    utills/
      ApiError.js
      ApiResponse.js
      asyncHandler.js
  package.json
  .gitignore
```

---