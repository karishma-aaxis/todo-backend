import  express from 'express';


import {createTodo,getTodo,getToodoByID,updateTodo,updateToogleTodo,deleteTodo} from '../controllers/todo.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';  //add authenciate

import { authorize } from '../middlewares/authorize.middleware.js';


const route= express.Router();


// route.get("/",(req,res)=>{
//     res.send("Welcome to todo Page");
// })

route.use(authenticate);
// Creat TODO
route.post('/add',createTodo);

// Get all TODOs
route.get("/",getTodo);


//authoritize
route.get(
    "/admin-test",
    authorize("ADMIN"),
    (req,res)=>{
        res.json({
            success:true,
            message:"wlecome admin",

        });
    }


);




// Get TODO by ID
route.get("/:id",getToodoByID);

// Update TODO by ID
route.put("/:id",updateTodo);

// Toggle TODO Completion status by ID
route.patch("/:id/toggle",updateToogleTodo);

// delete TODo by ID
route.delete("/:id",deleteTodo);



export default route;