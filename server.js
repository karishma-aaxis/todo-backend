// Import dependencies
import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Connect to DBs
connectDB();

// Routes
app.use("/api/todos", todoRoutes);

// Routes of register
app.use("/api/auth", authRoutes);

// Debug
console.log("Server started");
console.log("Auth routes mounted at /api/auth");

//Admin
app.use("/api/admin", adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

//Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server  is running on http://localhost:${PORT}`);
});
