import express from "express";
import supabase from "../supabase.js";

const authRouter = express.Router();

// ----- Sign Up -----
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, usernameSignUp, passwordSignUp } =
    req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: passwordSignUp,
    });

    console.log("SUPABASE DATA:");
    console.log(data);

    console.log("SUPABASE ERROR:");
    console.log(error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ----- Sign In -----
authRouter.post("/signin", (req, res) => {
  console.log("RECIEVED: User information for: sign in");
  console.log(req.body);

  res.status(200).json({
    message: "RECIEVED: Sign in content from user!",
  });
});

export default authRouter;
