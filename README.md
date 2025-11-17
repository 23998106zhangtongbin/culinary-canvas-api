# CulinaryCanvas API
A secure, structured API for managing personal recipe collections, built with Express.js, Mongoose (for MongoDB data modeling), and JWT authentication. This API follows the Model-View-Controller (MVC) pattern and implements robust user authentication/authorization to ensure users only access and modify their own recipes.


## 1. Project Overview
This API powers "CulinaryCanvas", a platform where users can:
- Register and log in to secure accounts
- Create, view, update, and delete their personal recipes
- Ensure data privacy (only the recipe author can modify/delete their recipes)
- Receive clear error messages for invalid requests or unauthorized actions


## 2. Tech Stack
| Category               | Tools/Libraries                                                                 |
|-------------------------|---------------------------------------------------------------------------------|
| Backend Framework       | Express.js (lightweight, flexible Node.js framework for building APIs)          |
| Database                | MongoDB (NoSQL database) + Mongoose (ODM for schema validation and data modeling)|
| Authentication          | JSON Web Tokens (JWT) + bcryptjs (password hashing)                             |
| Error Handling          | Custom middleware for centralized error formatting and routing errors           |
| Cross-Origin Requests   | cors (enables safe cross-origin API calls)                                      |
| Environment Variables   | dotenv (manages sensitive config like database URIs and JWT secrets)             |
| Development Tooling     | nodemon (auto-restarts server on code changes)                                  |


## 3. Prerequisites
Before running the API, ensure you have the following installed/configured:
- **Node.js** (v14.x or higher) + **npm** (v6.x or higher) – download from [nodejs.org](https://nodejs.org/)
- **MongoDB** – choose one option:
  - Local MongoDB: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (cloud): Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (recommended for easy access)
- A code editor (e.g., Visual Studio Code)


## 4. Installation & Setup
Follow these steps to run the API locally:

### Step 1: Clone the Repository
```bash
# Clone the GitHub repo (replace with your repo URL)
git clone https://github.com/[your-username]/CulinaryCanvas-API.git

# Navigate into the project folder
cd CulinaryCanvas-API
```

### Step 2: Install Dependencies
Install all required npm packages:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the **root directory** of the project (this file is ignored by Git via `.gitignore` to protect sensitive data). Add the following variables:
```env
# Server Port (default to 5000 if not specified)
PORT=5000

# MongoDB Connection String (replace with your local/Atlas URI)
# For local MongoDB: mongodb://localhost:27017/culinarycanvas
# For MongoDB Atlas: mongodb+srv://zhangtongbin:qcmdGqJiXitXb8Ly@cluster0.idibza8.mongodb.net/?appName=Cluster0

# JWT Secret (custom string for signing JWT tokens – use a random, secure value)
JWT_SECRET=zhangzhangzhang999

# JWT Expiration (e.g., 30d = 30 days, 1h = 1 hour)
JWT_EXPIRE=7d
```

### Step 4: Start the Server
Use one of the following commands to start the API:
```bash
# Development mode (uses nodemon to auto-restart on code changes)
npm run dev

# Production mode (uses node directly)
npm start
```

Once started, the API will run at: `http://localhost:5000`  
You’ll see logs in the terminal confirming:
- "Server running on port 5000" (or your custom port)
- "MongoDB Connected: [connection host]" (confirms database connection)


## 5. API Endpoints
All endpoints return JSON responses. Protected routes require a valid JWT token in the request headers (see "Testing Protected Routes" below).

### 5.1 Authentication Endpoints
| Method | Endpoint               | Description                  | Request Body (JSON)                          | Success Response (200/201)                  |
|--------|------------------------|------------------------------|-----------------------------------------------|-----------------------------------------------|
| POST   | `/api/users/register`  | Register a new user          | `{ "username": "johndoe", "email": "john@example.com", "password": "secure123" }` | `{ "success": true, "token": "your-jwt-token" }` |
| POST   | `/api/users/login`     | Log in an existing user      | `{ "email": "john@example.com", "password": "secure123" }` | `{ "success": true, "token": "your-jwt-token" }` |

### 5.2 Recipe Endpoints (Protected)
These endpoints require a JWT token (from login/register) to access.

| Method | Endpoint               | Description                                  | Request Body (JSON)                                                                 | Success Response (200/201)                                  |
|--------|------------------------|----------------------------------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------------|
| POST   | `/api/recipes`         | Create a new recipe (linked to logged-in user) | `{ "title": "Tomato Pasta", "ingredients": ["Pasta", "Tomato Sauce", "Garlic"], "instructions": "Boil pasta, mix with sauce.", "prepTime": 20 }` | `{ "success": true, "data": { "title": "Tomato Pasta", ... } }` |
| GET    | `/api/recipes`         | Get all recipes of the logged-in user        | None                                                                                | `{ "success": true, "count": 2, "data": [ {recipe1}, {recipe2} ] }` |
| PUT    | `/api/recipes/:id`     | Update a recipe (only the author can do this) | `{ "title": "Creamy Tomato Pasta", "prepTime": 25 }` (partial updates allowed)     | `{ "success": true, "data": { "title": "Creamy Tomato Pasta", ... } }` |
| DELETE | `/api/recipes/:id`     | Delete a recipe (only the author can do this) | None                                                                                | `{ "success": true, "data": {} }`                             |


## 6. Testing the API
Use a tool like **Postman**, **Thunder Client** (VS Code extension), or **curl** to test the endpoints. Below is a step-by-step example with Thunder Client (free VS Code extension):

### Step 1: Install Thunder Client
1. Open VS Code → Go to "Extensions" → Search for "Thunder Client" → Install.
2. Click the Thunder Client icon in the VS Code sidebar to open the tool.

### Step 2: Register a User
1. Click "New Request" → Set method to `POST` → Enter URL: `http://localhost:5000/api/users/register`.
2. Go to the "Body" tab → Select "JSON" → Paste the request body:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "test1234"
   }
   ```
3. Click "Send" → You’ll get a `201 Created` response with a JWT token. Copy this token (you’ll need it for protected routes).

### Step 3: Test a Protected Route (e.g., Create Recipe)
1. Create a new `POST` request → URL: `http://localhost:5000/api/recipes`.
2. Go to the "Headers" tab → Add a new header:
   - Key: `Authorization`
   - Value: `Bearer [your-jwt-token]` (replace `[your-jwt-token]` with the token from registration/login)
3. Go to the "Body" tab → Paste the recipe data:
   ```json
   {
     "title": "Chocolate Chip Cookies",
     "ingredients": ["Flour", "Sugar", "Chocolate Chips", "Butter"],
     "instructions": "Mix ingredients, bake at 350°F for 10 minutes.",
     "prepTime": 30
   }
   ```
4. Click "Send" → You’ll get a `201 Created` response with the new recipe data.


## 7. Error Handling
The API returns consistent error responses with clear messages and appropriate HTTP status codes:

| Status Code | Scenario                                  | Example Error Response                                  |
|-------------|-------------------------------------------|---------------------------------------------------------|
| 400         | Invalid input (e.g., missing required fields) | `{ "success": false, "error": "Please add a recipe title" }` |
| 401         | Unauthorized (no token or invalid token)  | `{ "success": false, "error": "Not authorized to access this route" }` |
| 403         | Forbidden (trying to modify others’ recipes) | `{ "success": false, "error": "Not authorized to update this recipe" }` |
| 404         | Resource not found (e.g., invalid recipe ID) | `{ "success": false, "error": "Recipe not found" }`     |
| 409         | Duplicate data (e.g., existing email)     | `{ "success": false, "error": "Duplicate field value entered" }` |
| 500         | Server error (e.g., database connection issue) | `{ "success": false, "error": "Server Error" }`         |


## 8. Project Structure
The API follows the MVC pattern for clean, maintainable code:
```
CulinaryCanvas-API/
├── config/                # Configuration files
│   └── db.js              # MongoDB connection setup
├── controllers/           # Business logic for endpoints
│   ├── userController.js  # User registration/login logic
│   └── recipeController.js# Recipe CRUD logic
├── middleware/            # Custom middleware
│   ├── authMiddleware.js  # JWT verification for protected routes
│   └── errorMiddleware.js # Centralized error handling
├── models/                # Mongoose schemas (data models)
│   ├── User.js            # User model (username, email, hashed password)
│   └── Recipe.js          # Recipe model (title, ingredients, author reference)
├── routes/                # API route definitions
│   ├── userRoutes.js      # Authentication routes (/api/users)
│   └── recipeRoutes.js    # Recipe routes (/api/recipes)
├── .env                   # Environment variables (ignored by Git)
├── .gitignore             # Files/folders to exclude from Git
├── package.json           # Project dependencies and scripts
├── server.js              # Entry point (starts server, loads config)
└── README.md              # Project documentation (you’re reading this!)
```