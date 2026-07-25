import express from "express";
import supabase from "../supabase.js";

const authRouter = express.Router();

// ----- Sign Up -----
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, usernameSignUp, passwordSignUp } =
    req.body;

  try {
    // This will create a user within Supabase
    // This is NOT in the 'profiles' tab - yet.
    const { data, error } = await supabase.auth.signUp({
      email,
      password: passwordSignUp,
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    // Add the above to the profiles tab
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      username: usernameSignUp,
      email: email,
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
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, passwordSignIn } = req.body;

    console.log(email);
    console.log(passwordSignIn);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: passwordSignIn,
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: "ERROR: Failed to sign in",
      });
    }

    res.status(200).json({
      message: "RECIEVED: Sign in content from user!",
    });
  } catch (error) {
    console.error(error);
  }
});

export default authRouter;
