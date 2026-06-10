import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getAllTodosAdmin ,getAllUsers,getUserByIDAdmin ,changeUserRole,blockUser,deleteAnyTodo,getDashboardStats} from "../controllers/admin.controller.js";


const route= express.Router();


route.use(authenticate);
route.use(authorize("ADMIN"));



// Admin api

//get all data through admin 
route.get("/all-todos",getAllTodosAdmin)


// admin api-for get users data
route.get("/users",getAllUsers);

//admin api for get user by id
route.get("/users/:id",getUserByIDAdmin);


// admin api -change roel
route.patch("/users/:id/role",changeUserRole);


// admin api- blocke user
route.patch("/users/:id/block",blockUser);


// admin api dashboard
route.get("/stats",getDashboardStats);


// /admin api-delete user
route.delete("/users/delete/:id",deleteAnyTodo);


export default route;