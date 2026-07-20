import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";
import usersRouter from "./routes/users.js";
import groceriesRouter from "./routes/groceries.js";
import socialPostsRouter from "./routes/social-posts.js";

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(morgan("dev")); // Request logger middleware (pretty cool!)
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/users", usersRouter);
app.use("/api/groceries", groceriesRouter);
app.use("/api/social-posts", socialPostsRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}!`);
});
