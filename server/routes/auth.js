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

    // Error checking for if no signup.
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Add the above to the profiles tab
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      username: usernameSignUp,
      email: email,
    });

    console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: profileError.message,
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
      email,
      password: passwordSignIn,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "ERROR: Failed to sign in",
      });
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id);
    //.single();

    console.log("USER ID:", data.user.id);

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: profileError.message,
      });
    }

    return res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error(error);
  }
});

export default authRouter;
