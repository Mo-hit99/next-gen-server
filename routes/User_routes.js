import express from "express";
import dotenv from "dotenv";
import {
  get_allData,
  getById_data,
  getMonthlyUserCounts,
  googleLogin,
  UserCreateData,
  UserDeleteDate,
  userForgotPassword,
  userLogin,
  UserQuery,
  userRestPassword,
  UserUpdateData,
  verificationOtp,
} from "../controller/User_controller.js";

dotenv.config();

export const User_route = express.Router();

// get all user data
User_route.get("/users/api/user", get_allData);

// Define the route for getting monthly user counts
User_route.get('/users/monthlyUserData', getMonthlyUserCounts);
// get user data by Id
User_route.get("/users/api/user/:id", getById_data);

// update user data
User_route.put("/users/api/user/:id", UserUpdateData);

// delete user data
User_route.delete("/users/api/user/:id", UserDeleteDate);

// create user data register
User_route.post("/users/signup", UserCreateData);

// user login
User_route.post("/users/login", userLogin);

// verification otp
User_route.post('/users/verification-Otp',verificationOtp)

// forgot-password
User_route.post("/users/forgot-password", userForgotPassword);

// rest-password
User_route.post("/users/reset-password/:token", userRestPassword);

// google login
User_route.get("/users/auth/google", googleLogin);

// user client query feedback

User_route.post('/users/client/query',UserQuery)