import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asynchandler.js";

//create Todo-post api
export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  //Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is requrieed",
    });
  }

  const todo = await Todo.create({
    title,
    description,
    user: req.user.id, //used-.lgoin user  id stores in mongodb
  });

  return res.status(201).json({
    success: true,
    message: "Todo created sucessfully",
    data: todo,
  });
});

//Get All- Todo get api
export const getTodo = asyncHandler(async (req, res) => {
  console.log(req.user);
  //query Params
  const { search, sort, page = 1, limit = 10 } = req.query; // this all comes from query param

  //base query
  let query = {};

  //search By title
  if (search) {
    query.title = { $regex: search, $options: "i" }; // i --for case sensitive,regex--> is used use match pattern of text
  }
  // For Sorting
  let sortOption = {};
  if (sort === "asc")
    sortOption.createdAt = 1; // 1 for asecneding order
  else sortOption.createdAt = -1; //-1 descending order----->this is Deault

  //Paginatioon
  const skip = (page - 1) * limit;
  query.user = req.user.id; //used-.lgoin user  id storesin mongodb
  const todos = await Todo.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const totolTodos = await Todo.countDocuments(query); //used id while fetching todo user id we cand other user id can't be seen eg -only user A's see cand can't  seeuser B data

  return res.status(200).json({
    success: true,
    message: "Todo Fetched sucessfully",
    total: totolTodos,
    page: Number(page),
    limit: Number(limit),
    data: todos,
  });
});

// Get Todo by ID
export const getToodoByID = asyncHandler(async (req, res) => {
  const { id } = req.params; // take id from req.param
  //Valiadtio id based on mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Todo Id",
    });
  }
  const todoID = await Todo.findOne({
    _id: id,
    user: req.user.id,
  });

  //   if todo is not find
  if (!todoID) {
    return res.status(404).json({
      success: false,
      message: "Todo is not Found ",
    });
  }
  //if todo found
  return res.status(200).json({
    success: true,
    message: "Todo Fetched  sucessfully",
    data: todoID,
  });
});

//Update todo by id-get api
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  //Valid id based on mongoose

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Todo Id",
    });
  }
  //Valid inout
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is requrieed",
    });
  }

  //Update todo
  const todoUpd = await Todo.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id,
    },

    { title, description },
    {
      returnDocument: "after",
      runValidators: true,
    }, //return update documents
  );

  if (!todoUpd) {
    return res.status(404).json({
      success: false,
      message: "Todo is not Found ",
    });
  }
  //if todo found
  return res.status(200).json({
    success: true,
    message: "Todo Updated sucessfully",
    data: todoUpd,
  });
});

//Toggle todo by Id-Patch  API
export const updateToogleTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //Valid id based on mongoose

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Todo Id",
    });
  }
  //Get current todo
  const todoToggle = await Todo.findOne({ _id: id, user: req.user.id });

  //if todo not found
  if (!todoToggle) {
    return res.status(404).json({
      success: false,
      message: "Todo is not Found ",
    });
  }
  //Flip the  isCompleted filled
  todoToggle.isCompleted = !todoToggle.isCompleted;
  await todoToggle.save();

  return res.status(200).json({
    success: true,
    message: "Todo toggled s sucessfully",
    data: todoToggle,
  });
});

// Delete TODO by ID-Delelte API
export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //Valid id based on mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Todo Id",
    });
  }

  //Delete Todo
  const todoDel = await Todo.findOneAndDelete({ _id: id, user: req.user.id });

  //if tod not found
  if (!todoDel) {
    return res.status(404).json({
      success: false,
      message: "Todo is not Found ",
    });
  }
  //if todo found then deleted msg
  return res.status(200).json({
    success: true,
    message: "Todo tDeleted sucessfully",
    data: todoDel,
  });
});
