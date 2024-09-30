import express from "express";
import dotenv from "dotenv";
import {
  get_allData,
  googleLogin,
  UserCreateData,
  UserDeleteDate,
  userForgotPassword,
  userLogin,
  userRestPassword,
  UserUpdateData,
  verificationOtp,
} from "../controller/controller.js";

dotenv.config();

export const User_route = express.Router();

// get all user data
User_route.get("/api/user", get_allData);

// get user data by Id
// User_route.get("/:id", getById_data);

// update user data
User_route.patch("/api/user/:id", UserUpdateData);

// delete user data
User_route.delete("/api/user/:id", UserDeleteDate);

// create user data register
User_route.post("/signup", UserCreateData);

// user login
User_route.post("/login", userLogin);

// verification otp
User_route.post('/verification-Otp',verificationOtp)
// forgot-password

User_route.post("/forgot-password", userForgotPassword);

// rest-password
User_route.post("/reset-password/:token", userRestPassword);

// google login
User_route.get("/auth/google", googleLogin);
