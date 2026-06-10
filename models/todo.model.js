import mongoose from "mongoose"; //models connected to db as well

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required"],
      trim: true,
      // minlength:3  //min 3char is required..otherwsie through error
    },
    description: {
      type: String,
      default: "",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // user file store user id
      ref: "User",
      required: true,
    },
  },

  { timestamps: true },
); //schema  - used for validation and structure defined

export default mongoose.model("Todo", todoSchema); //model--it will connect with actual db
