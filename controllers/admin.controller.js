import User from "../models/user.model.js";
import Todo from "../models/todo.model.js";
import { asyncHandler } from "../middlewares/asynchandler.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

//Admin  will get all todos
export const getAllTodosAdmin = asyncHandler(async (req, res) => {
  const { search, sort, page = 1, limit = 10 } = req.query;
  // base Query
  let query = {};
  // search Bu title
  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }
  // sorting
  let sortOption = {};

  if (sort === "asc") {
    sortOption.createdAt = 1;
  } else {
    sortOption.createdAt = -1;
  }
  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const todosadm = await Todo.find(query)
    .populate("user", "name email role") // popluate- automically fetches details from user collection
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  const totalTodos = await Todo.countDocuments(query);

  return res.status(200).json({
    success: true,
    total: totalTodos,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalTodos / limitNumber),
    data: todosadm,
  });
});

// Admin -get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  // cget user
  const users = await userModel.find().select("-password"); //-password-it will not show password
  return res.status(200).json({
    success: true,
    total: users.length,
    data: users,
  });
});

// Admin- get users by ID
export const getUserByIDAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // if id not correct
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

  // get user y id
  const userid = await User.findById(id).select("-password");

  // if not found
  if (!userid) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  // if found
  return res.status(200).json({
    success: true,
    data: userid,
  });
});

// Change user role
export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // if not user/admin --somebody else
  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  }

  // update role
  const userupdate = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }, //it will give new update data
  ).select(":password");

  //if user not found
  if (!userupdate) {
    return res.status(404).josn({
      success: false,
      message: "User not found",
    });
  }
  // if user found
  return res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: userupdate,
  });
});

// Block user
export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  // block the user
  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked },
    { new: true },
  ).select("-password");

  // if user found
  if (!blockUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // if user found
  return res.status(200).json({
    success: true,
    message: `User ${isBlocked ? "blocked" : "unblocked"} sucessfully`,
    data: blockUser,
  });
});

//Admin-Delete any todo
export const deleteAnyTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todoDelete = await Todo.findByIdAndDelete(id);

  // if not found
  if (!todoDelete) {
    return res.status(404).json({
      success: false,
      message: "Tod not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todo Deleted successfully",
    data: todoDelete,
  });
});

// Dashboard staus
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const totalTodos = await Todo.countDocuments();

  const completedTodos = await Todo.countDocuments({
    isCompleted: true,
  });
  const pendingTodos = await Todo.countDocuments({
    isCompleted: false,
  });
  return res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalTodos,
      completedTodos,
      pendingTodos,
    },
  });
});
