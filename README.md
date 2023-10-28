# Introduction :-

### Name : CRUD APPLICATION
### URL : https://crud-application-ss8x.onrender.com/
### Github : https://github.com/NAFIZ009/CRUD_APPLICATION
### Description : Our API server is built using Express.js and MySQL, incorporating all necessary CRUD (Create, Read, Update, Delete) endpoints for managing user information. It follows industry best practices for performance and maintainability, adhering to RESTful principles for efficient and standardized operations.

# Key Features:

### 1.User Data Management: Our server provides endpoints for creating, retrieving, updating, and deleting user information.
### 2.Security Measures: Implements best security practices, including data validation.
### 3.Fast and Responsive: The server is optimized for speed, ensuring quick response times and efficient database queries.
### 4.Scalable Architecture: Designed to support scalability by implementing a modular and easily extensible codebase.

# Technologies Used:

### Express.js: Used as the server framework, enabling efficient route handling and middleware integration.
### MySQL: Employed as the database to manage user data, ensuring relational database functionality.
### Best Practices: Follows RESTful API practices, error handling, validation, and appropriate HTTP status codes.


# Database Schema:

### 1.id: Auto-generated integer (11) Primary Key
### 2.name: String (up to 50 characters)
### 3.email: String (up to 50 characters)
### 4.phone: String (up to 50 characters)
### 5.age: Integer (11)
### 6.profession: String (up to 50 characters)

# API Endpoints:

### Response Data Format: JSON

### GET /users: Retrieve user information.With optional parameters (/users?column=value) specific user information can be retrieved.Response object format:
### {status:success/failed,result:{...Retrieved data}}

### POST /users/create: Create a new user.To create a new user, the user object must be passed within the request body.The object format:
### {name:string(not null),email:string(not null),phone:string(not null),age:integer(optional),profession:string(optional)}
### response object format:
### {status:success/failed,result:{...created data}}

### PATCH /users/update: Update user information.To update a user, the updated object must be passed within the request body.The object format:
### {id:value,update:{column:value,...}}
### response object format:
### {status:success/failed,result:{...updated data}}

### DELETE /users/delete: Delete a user by ID.(/users?id=value).Response object format:
### {status:success/failed,message:string}

# Future Scope:
### Our system aims to evolve further, incorporating additional features, such as user authentication, role-based access control, and performance optimization, to enhance user data management.
