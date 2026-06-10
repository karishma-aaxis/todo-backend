import express from "express";

import {registerUser,loginUser,refresHToken,logout,forgetPassword, resetPasswrd} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";


const router=express.Router();

console.log(" route hit");

// regiester api
router.post("/register",registerUser);



//lgoin api
router.post("/login",loginUser);

// refresh token api
router.post("/refresh-token",refresHToken);

// logut
router.post("/logout",authenticate,logout);

// forget password
router.post("/forget-password",forgetPassword);

// reset password
router.post("/reset-password",resetPasswrd);


export default router;