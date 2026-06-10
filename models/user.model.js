import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, //space remove
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isBlocked: {
      type: Boolean,
      default: false, //false can login //true -user is blocked
    },
    refreshToken: {
      type: String,
      default: null, //null-dont provide a refresh token
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
); //schema  - used for validation and structure defined

export default mongoose.model("User", userSchema); //model--it will connect with actual db
