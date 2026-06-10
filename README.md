# Todo Backend API



A Node.js, Express.js, and MongoDB backend for a Todo application with JWT Authentication and Role-Based Authorization.



## Features



* User Registration & Login

* JWT Authentication

* Protected Routes

* Role-Based Authorization

* Admin Access Control

* Todo CRUD Operations

* MongoDB Integration



## Tech Stack



* Node.js

* Express.js

* MongoDB

* Mongoose

* JWT (jsonwebtoken)

* bcryptjs



## Installation



```bash

npm install

```



## Environment Variables



Create a `.env` file:



```env

PORT=3001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

```



## Run the Server



```bash

npm run dev

```



Server URL:



```text

http://localhost:3001

```



## API Routes



### Authentication



* POST `/api/auth/register`

* POST `/api/auth/login`



### Todos



* GET `/api/todos`

* POST `/api/todos`

* PUT `/api/todos/:id`

* DELETE `/api/todos/:id`



### Admin



* Admin-only protected routes

* User Management



## Security



* Password Hashing (bcryptjs)

* JWT Authentication

* Role-Based Authorization



## Author



Karishma
