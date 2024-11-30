import { userModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import axios from "axios";
import nodemailer from "nodemailer";
import { oauth2client } from "../utils/googleConfig.js";
import { optTemplate } from "../template/template.js";
import { updatePassworDTemplate } from "../template/updatepasswordsucessfully.js";
import { clientQueryTemplate } from "../template/clientQueryTemplate.js";
import { TeamEmailSender } from "../utils/TeamEmail.js";

dotenv.config();

// expire date jwt
const Max_age = 3 * 24 * 60 * 60;

// otp generate function
function generateOtp() {
  let otp = "";
  otp = Math.floor(Math.random() * 9000 + 1000).toString();
  return otp;
}
// create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SIGNATURE, {
    expiresIn: Max_age * 100,
  });
};

// get all data
export const get_allData = async (req, res) => {
  try {
    const user_data = await userModel.find();
    // Create a safe object for the response
    const safeUsers = user_data.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      image: user.image,
      phone: user.phone,
      address: user.address,
      optionalAddress: user.optionalAddress,
      officeAddress: user.officeAddress,
      optionalOfficeAddress: user.optionalOfficeAddress,
    }));
    res.status(200).json(safeUsers);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// Function to aggregate users by month and year
export const getMonthlyUserCounts = async (req, res) => {
  try {
    const totalUser = await userModel.countDocuments();
    const user_data = await userModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          userCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ]);

    // Format data for frontend: "YYYY-MM" format
    const formattedData = user_data.map((data) => ({
      month: `${data._id.year}-${String(data._id.month).padStart(2, "0")}`,
      userCount: data.userCount,
    }));

    res.status(200).json({ formattedData, totalUser }); // Send formatted data
  } catch (error) {
    console.error("Error fetching monthly user count data:", error);
    res.status(500).json({ error: "Failed to fetch monthly user data" });
  }
};

// get by id data
export const getById_data = async (req, res) => {
  try {
    const id = req.params.id;
    const User_data = await userModel.findById(id);
    const safeUser = {
      _id: User_data._id,
      email: User_data.email,
      name: User_data.name,
      createdAt: User_data.createdAt,
      image: User_data.image,
      phone: User_data.phone,
      address: User_data.address,
      optionalAddress: User_data.optionalAddress,
      officeAddress: User_data.officeAddress,
      optionalOfficeAddress: User_data.optionalOfficeAddress,
    };
    res.status(200).json(safeUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update user data
export const UserUpdateData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      optionalAddress,
      officeAddress,
      phone,
      optionalOfficeAddress,
    } = req.body;
    if (
      !name &&
      !address &&
      !optionalAddress &&
      !officeAddress &&
      !optionalOfficeAddress &&
      !phone
    ) {
      return res.status(404).json({ message: "all fields must be filled" });
    }
    const updateUser = await userModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        address,
        optionalAddress,
        officeAddress,
        optionalOfficeAddress,
        phone,
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json("User detail updated");
    console.log("User detail updated");
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// delete user data
export const UserDeleteDate = async (req, res) => {
  try {
    const { id } = req.params;
    const delete_data = await userModel.findOneAndDelete({ _id: id });
    res.status(200).json(delete_data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
// signup user
export const UserCreateData = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const otp = generateOtp();
    const user = await userModel.signup(name, email, password, otp);
    const token = createToken(user._id);
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODE_MAIL_ID,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    let mailOptions = {
      from: `"NextGenClothes.com" <${process.env.NODE_MAIL_ID}>`,
      to: `${user.email}`,
      subject: "verification Email",
      html: optTemplate(user.name, otp),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// verification otp
export const verificationOtp = async (req, res) => {
  try {
    const { code } = req.body;

    // Validate of the OTP code
    if (!code) {
      return res.status(400).json({ message: "OTP code is required" });
    }

    const user = await userModel.findOne({ otp: code });

    if (!user) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear the OTP after successful verification
    await user.save();

    console.log(`User verified: ${user.isVerified}`);
    res
      .status(200)
      .json({ status: "Success", message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
};

// UserLogin
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// forgot-password
export const userForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.forgotPassword(email);
    if (!user) {
      return res.send({ Status: "user not existed" });
    }
    // const token = createToken(user._id);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGNATURE, {
      expiresIn: "10m",
    });
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODE_MAIL_ID,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    let mailOptions = {
      from: `"NextGen.com" <${process.env.NODE_MAIL_ID}>`,
      to: `${user.email}`,
      subject: "Reset your Password",
      html: `<p>Reset Your Password
             Click on the following link to reset your password:
             ${process.env.CLIENT_HTTP_LINK + "/reset-password/" + token},
             The link will expire in 10 minutes.</p>
             If you didn't request a password reset, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// rest-password
export const userRestPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "At least one lowercase letter.",
        message1:"At least one uppercase letter.",message2:"At least one digit.",message3:'At least one digit.,characters at least 8 characters long.'});
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SIGNATURE);
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    let user = await userModel.findByIdAndUpdate(
      { _id: decodedToken._id },
      { password: hash }
    );
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }
    await user.save();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODE_MAIL_ID,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    let mailOptions = {
      from: `"NextGen.com" <${process.env.NODE_MAIL_ID}>`,
      to: `${user.email}`,
      subject: "Reset your Password",
      html: updatePassworDTemplate(user.name,'NextGenClothes')
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
    res.send({ Status: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// google login
export const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `${process.env.GOOGLE_AUTH_LINK + googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        image: picture,
      });
    }
    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SIGNATURE, {
      expiresIn: "12h",
    });
    return res.status(200).json({ message: "Success", token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

// client query 
export const UserQuery = async (req,res)=>{
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {email,query} = req.body;
    if(!email || !query){
      return res.status(400).json({message:'Fields not be Empty!'})
    }
    if(!emailRegex.test(email)){
      return res.status(400).json({message:'invalid Email!'})
    }
    if(!query){
      return res.status(400).json({message:'invalid Query!'})
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODE_MAIL_ID,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });
  
  let mailOptions = {
    from: `"NextGen.com" <${process.env.NODE_MAIL_ID}>`,
    to: `${email}`,
    subject: "Client Query",
    html: clientQueryTemplate(email,query)
  };
  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.send({ Status: "Success" });
    }
  });
  if(email || query){
    TeamEmailSender(email,query)
  }
  res.status(201).json({message:"Success"});
} catch (error) {
  console.log(error)
  res.status(501).json(error);
}
}
