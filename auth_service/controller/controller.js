import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  checkExistingUser,
  checkExistingUserLogin,
  createUser,
} from "../db/dbQueries.js";

export const signup = async (req, res) => {
  const { name, password, email, secretKey } = req.body;

  try {
    // Check if the email already exists
    const existingUserRes = await checkExistingUser(email);
    if (!existingUserRes.unique) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await createUser(email, hashedPassword, secretKey, name);

    // Respond with the new user data
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
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
      return res.statu(404).json({
        status: "Unauthorized",
        code: 400,
        message: "Invalid token or Expired Token",
      });
    }

    let { iat, exp, teacherId } = jwt.verify(token, process.env.JWT_SECRET);
    if (iat < exp) {
      return res.status(200).json({
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
    let code = error.code || 500;
    let message = error.message || "Internal Server Error";
    let status = error.status || "fail";
    return res.status(code).json({ message, code, status });
  }
};
