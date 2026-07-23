import express from "express";

const authRouter = express.Router();

// ----- Sign Up -----
authRouter.post("/signup", (req, res) => {
  console.log("RECIEVED: User information for: sign up");
  console.log(req.body);

  res.status(200).json({
    message: "RECIEVED: Sign up content from user!",
  });
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
