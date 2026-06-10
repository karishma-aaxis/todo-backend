import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    console.log("Authenticate middleware started");
    // reads header
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }
    //extract token
    const token = authHeader.split(" ")[1];
    console.log(" Extracted TOKEN:", token);

    //verify token -jwt checks valid?,expired?,tampered?(someone has changed the token data  after  created)
    //The server verifies the signature using JWT_SECRET and  if valid then extracts the payload.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded);

    // find user from db
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpires",
    );
    // check user exists
    if (!user) {
      console.log("user not exists in db");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found in db");
    console.log("USER FROM DB:", user);
    console.log("isBlocked value:", user.isBlocked);
    // check block user
    if (user.isBlocked) {
      console.log("User Blocked cannot seen");
      return res.status(403).json({
        success: false,
        message: "Account blocked by admin",
      });
    }
    console.log("User is active");

    // attch user
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
    };
    console.log("User attached to req.user:", req.user);
    console.log("Authentication successful");
    next();
  } catch (error) {
    console.log("Authentication failed");
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
