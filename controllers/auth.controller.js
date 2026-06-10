import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; //for hidding password
import { asyncHandler } from "../middlewares/asynchandler.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // for debug
  console.log("Entered register controller");
  // for input
  console.log("Request  body received:", req.body);

  //Validition
  console.log("Checking required fields");
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All Fields are required",
    });
  }
  console.log("Validation passed");

  //Check existing USer
  // 2. Before operation
  console.log("Before DB Query");
  console.log(" Checking existing user");
  const existingUser = await User.findOne({ email });

  // 3. After operation
  console.log("After DB Query");
  console.log("Existing User:", existingUser);
  if (existingUser) {
    return res.status(400).json({
      succes: false,
      message: "Email already registered",
    });
  }

  //Hash password
  console.log(" before Hashing password");
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(" after Password hashed");

  //Creat user
  console.log(" before Creating user in MongoDB");
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log("after User created:", newUser);

  // Prepare response
  const responseData = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  console.log("Response Data:", responseData);
  // 4. Before response

  console.log("Sending 201 response");
  return res.status(201).json({
    success: true,
    message: "User registered sucessfully",
    data: responseData,
  });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  console.log("Entered login controller");

  const { email, password } = req.body;
  //    input
  console.log("Request  body received:", req.body); //for debug

  //Validition
  console.log("Checking required fields");
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email ansd password are required",
    });
  }
  console.log("Validation passed");

  // find user
  // 2. Before operation
  console.log("Before DB Query");
  console.log(" Checking existing user");
  const userLogin = await User.findOne({ email });
  // 3. After operation
  console.log("After DB Query");

  // if user not found
  if (!userLogin) {
    console.log("User not found");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  console.log("User found:", userLogin.email);
  //Compare pasword
  console.log("Comparing password");
  const isPasswordMatched = await bcrypt.compare(password, userLogin.password);

  if (!isPasswordMatched) {
    console.log("Password mismatch");
    return res.status(401).json({
      success: false,
      message: "Invalid creditonals",
    });
  }
  console.log("Password matched");

  // JwT token-creation-->decoded payload(req.user)
  // access token
  console.log("creation of  Acess token  ");
  const accessToken = jwt.sign(
    {
      id: userLogin._id,
      role: userLogin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  console.log(" Acess token created   ", accessToken.length);
  // Refresh token  /stores in mongodb
  console.log("creation of  Refresh token  ");
  const refreshToken = jwt.sign(
    {
      id: userLogin._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
  console.log(" refresh token created sucessfully  ", refreshToken.length);

  //save refresh token
  console.log("refresh Token success fully save in db");
  userLogin.refreshToken = refreshToken;
  await userLogin.save();

  const responseData = {
    id: userLogin._id,
    name: userLogin.name,
    email: userLogin.email,
    role: userLogin.role,
    accessToken,
    refreshToken,
  };
  // 4. Before response
  console.log("Response Data:", responseData);
  console.log("login sucessful");
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: responseData,
  });
});

// refresh token -to new token
export const refresHToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // if not found
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refersh token required",
    });
  }
  //  verify token
  const refreshTokenValue = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET, //contains-{id,iat,exp}
  );

  // find user
  const userToken = await User.findById(refreshTokenValue.id);

  // comprefer tefersh token  //user refersh-token and db refersh token
  if (!userToken || userToken.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Invlaid refresh token",
    });
  }

  // Generate new acess toekn
  const newAccessToken = jwt.sign(
    {
      id: userToken._id,
      role: userToken.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m",
    },
  );

  return res.status(200).json({
    success: true,
    accesSToken: newAccessToken,
  });
});

//Logout
export const logout = asyncHandler(async (req, res) => {
  // safety check
  //If there is no logged-in user,returns Unauthorized.
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  console.log(req.user);
  // find user id
  const userIDlogout = await User.findById(req.user.id);

  //if user not found
  if (!userIDlogout) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  //make refershtoken empty-clear refresh
  userIDlogout.refreshToken = null;
  await userIDlogout.save();

  console.log("USER:", req.user);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

//forget password
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //  check email
  const userforget = await User.findOne({ email });

  // if email not found
  if (!userforget) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  //generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  //save token in db
  userforget.resetPasswordToken = resetToken;

  //Expires after in 18 minus
  userforget.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await userforget.save();

  return res.status(200).json({
    success: true,
    message: "Reset token generated",
    resetToken,
  });
});

//reset password
export const resetPasswrd = asyncHandler(async (req, res) => {
  const { resToken, newPassword } = req.body;

  console.log(req.body);
  console.log(resToken);
  console.log(newPassword);

  // validate input
  if (!resToken || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and new passowrd are required",
    });
  }
  console.log("BODY:", req.body);
  console.log("TOKEN:", resToken);

  //  Find user by token and check expiry
  const userReset = await User.findOne({
    resetPasswordToken: resToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  // Token invalid or expired
  if (!userReset) {
    return res.status(404).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update passowrd
  userReset.password = hashedPassword;

  // Clear reset fields
  userReset.resetPasswordToken = null;
  userReset.resetPasswordExpires = null;

  await userReset.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});
