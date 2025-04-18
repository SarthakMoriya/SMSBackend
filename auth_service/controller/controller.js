import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  checkExistingUser,
  checkExistingUserLogin,
  createUser,
  findUserById,
  updateUserPasswordById,
} from "../db/dbQueries.js";
import { errorResponse, successResponse } from "../utils/helper.js";

export const signup = async (req, res) => {
  const { username, password, email, secretKey } = req.body;

  try {
    // Check if the email already exists
    const existingUserRes = await checkExistingUser(email);
    if (!existingUserRes.unique) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await createUser(
      email,
      hashedPassword,
      secretKey,
      username
    );

    // Respond with the new user data
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    let code = error.code || 500;
    let message = error.message || "Internal server error";
    let status = error.status || "fail";
    return res.status(code).json({ code, status, message });
  }
};
export const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    // Check if the account  exists
    const existingUserRes = await checkExistingUserLogin(email);

    // Hash the password
    const hashedPassword = await bcrypt.compare(
      password,
      existingUserRes.body.password
    );
    if (!hashedPassword) {
      throw new Error("Invalid credentials");
    }
    let token = jwt.sign(
      { teacherId: existingUserRes.body.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );
    // Respond with the new user data
    return res.status(200).json({
      ...existingUserRes.body,
      password: null,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const verifyToken = async (req, res) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      throw new Error({
        status: "Unauthorized",
        code: 400,
        message: "Invalid token or Expired Token",
      });
    }

    let { iat, exp, teacherId } = jwt.verify(token, process.env.JWT_SECRET);
    if (iat < exp) {
      return successResponse(res, {
        message: "Authentication Success",
        code: 200,
        status: "success",
        body: teacherId,
      });
    } else {
      throw new Error({
        message: "Expired Session",
        status: "fail",
        code: 500,
      });
    }
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword)
      return errorResponse(res, {
        message: "Missing or invalid params",
        code: 400,
      });

    let user = await findUserById(id);
    let { password } = user.body[0];

    let isCorrectPassword = await bcrypt.compare(oldPassword, password);
    if (!isCorrectPassword)
      return errorResponse(res, {
        message: "Invalid password",
        code: 400,
      });

    let hashedPassword = await bcrypt.hash(newPassword, 10);

    let updatePassword = await updateUserPasswordById(id, hashedPassword);

    return successResponse(res, updatePassword);
  } catch (error) {
    return errorResponse(res, error);
  }
};
