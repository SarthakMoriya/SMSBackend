import bcrypt from "bcryptjs";
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

    console.log(existingUserRes);
    // Hash the password
    const hashedPassword = await bcrypt.compare(
      password,
      existingUserRes.body.password
    );
    if (!hashedPassword) {
      throw new Error("Invalid credentials");
    }

    // Respond with the new user data
    return res.status(200).json({
      ...existingUserRes.body,
      password: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
