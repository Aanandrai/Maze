# Maze Backend API

This is the backend API for the Maze application. It is built with Node.js, Express, and PostgreSQL.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
  - [Register User](#register-user)
  - [Register Captain](#register-captain)
- [Input Validation](#input-validation)
- [Error Handling](#error-handling)
- [Sample Requests & Responses](#sample-requests--responses)
- [Status Codes](#status-codes)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

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
ACCESS_TOKEN_SECRET_KEY=your_jwt_secret
```

---

## Database Structure

The backend uses a PostgreSQL database. The main tables are `users`, `captain`, and `vehicle`:

### users

| Column    | Type         | Constraints                                   |
|-----------|--------------|-----------------------------------------------|
| id        | SERIAL       | PRIMARY KEY                                   |
| firstname | VARCHAR(255) | NOT NULL, min length 3                        |
| lastname  | VARCHAR(255) | min length 3                                  |
| email     | VARCHAR(255) | NOT NULL, UNIQUE                              |
| password  | VARCHAR(255) | NOT NULL                                      |
| socketid  | VARCHAR(255) |                                               |

### captain

| Column    | Type         | Constraints                                   |
|-----------|--------------|-----------------------------------------------|
| id        | SERIAL       | PRIMARY KEY                                   |
| firstname | VARCHAR(255) | NOT NULL, min length 3                        |
| lastname  | VARCHAR(255) | min length 3                                  |
| email     | VARCHAR(255) | NOT NULL, UNIQUE                              |
| password  | VARCHAR(255) | NOT NULL                                      |
| socketId  | VARCHAR(255) |                                               |
| status    | TEXT         | NOT NULL, default 'inactive', enum            |
| latitude  | DOUBLE PRECISION |                                           |
| longitude | DOUBLE PRECISION |                                           |

### vehicle

| Column      | Type         | Constraints                                   |
|-------------|--------------|-----------------------------------------------|
| id          | SERIAL       | PRIMARY KEY                                   |
| captain_id  | INT          | REFERENCES captain(id) NOT NULL               |
| color       | VARCHAR(255) | NOT NULL, min length 3                        |
| plate       | VARCHAR(255) | NOT NULL, min length 4                        |
| capacity    | INT          | NOT NULL, min 1                               |
| vehicle_type| ENUM         | ('car', 'bike', 'auto')                       |

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
- `password` (string, required, min 5 chars)

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
  - Missing required fields or validation fails.
- **Status:** `409 Conflict`
  - Email already exists.
- **Status:** `500 Internal Server Error`
  - Unexpected server error.

---

### Register Captain

- **URL:** `/api/v1/captain/register`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Description:** Registers a new captain and their vehicle.

#### Request Body

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "captainpassword",
  "carInfo": {
    "color": "Red",
    "plate": "ABCD1234",
    "capacity": 4,
    "vehicle_type": "car"
  }
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars if provided)
- `email` (string, required, must be unique)
- `password` (string, required, min 5 chars)
- `carInfo.color` (string, required, min 3 chars)
- `carInfo.plate` (string, required, min 4 chars)
- `carInfo.capacity` (integer, required, min 1)
- `carInfo.vehicle_type` (string, required, one of: 'car', 'bike', 'auto')

#### Success Response

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "captain create Successfully",
    "data": {
      "id": 1,
      "firstname": "Jane",
      "lastname": "Smith",
      "email": "jane.smith@example.com",
      "carInfo": {
        "id": 1,
        "captain_id": 1,
        "color": "Red",
        "plate": "ABCD1234",
        "capacity": 4,
        "vehicle_type": "car"
      }
    },
    "success": true
  }
  ```

#### Error Responses

- **Status:** `401 Unauthorized`
  - Validation fails (Joi error message).
- **Status:** `409 Conflict`
  - Captain already exists.
- **Status:** `500 Internal Server Error`
  - Unexpected server error.

---

## Input Validation

Input validation is handled using [Joi](https://joi.dev/).

### User Registration Validation

```js
const userSchema = Joi.object({
  fullname: Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).optional(),
  }).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});
```

### Captain Registration Validation

```js
const captainSchema = Joi.object({
  fullname: Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).optional()
  }).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  status: Joi.string().valid('active','inactive','banned').optional(),
  carInfo: Joi.object({
    color: Joi.string().min(3).required(),
    plate: Joi.string().min(4).required(),
    capacity: Joi.number().min(1).required(),
    vehicle_type: Joi.string().valid('car','bike','auto').required()
  }).required()
});
```

If validation fails, a `400 Bad Request` or `401 Unauthorized` is returned with a descriptive message.

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

### Register Captain

**Request:**
```sh
curl -X POST http://localhost:3000/api/v1/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "Bob", "lastname": "Driver"},
    "email": "bob.driver@example.com",
    "password": "captainpass",
    "carInfo": {
      "color": "Blue",
      "plate": "XYZ9876",
      "capacity": 3,
      "vehicle_type": "auto"
    }
  }'
```

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "captain create Successfully",
  "data": {
    "id": 2,
    "firstname": "Bob",
    "lastname": "Driver",
    "email": "bob.driver@example.com",
    "carInfo": {
      "id": 2,
      "captain_id": 2,
      "color": "Blue",
      "plate": "XYZ9876",
      "capacity": 3,
      "vehicle_type": "auto"
    }
  },
  "success": true
}
```

---

## Status Codes

- `201 Created` – User registered successfully
- `200 OK` – Captain registered successfully
- `400 Bad Request` – Missing or invalid fields (user)
- `401 Unauthorized` – Validation error (captain)
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
      captain.controller.js
    db/
      createUserTable.js
      createCaptainTable.js
      dbConnect.js
    routes/
      user.routes.js
      captain.routes.js
    services/
      user.service.js
      captain.service.js
    utills/
      ApiError.js
      ApiResponse.js
      asyncHandler.js
    middlewares/
      inputUserValidater.js
      inputCaptainValidater.js
  package.json
  .gitignore
```

---

## Dependencies

- express
- pg
- joi
- bcrypt
- jsonwebtoken
- cookie-parser
- cors
- dotenv

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License