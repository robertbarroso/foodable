import express from "express";
import supabase from "../supabase.js";

const authRouter = express.Router();

// FETCH from Supabase 'posts'
authRouter.get("/", async (req, res) => {
  const { data: postData } = await supabase
    .from("posts")
    .select("*")
    .eq("post_id", 3)
    .single();

  const { data: recipeData } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", postData.recipe_list_id)
    .single();

  postData.recipe = recipeData;

  return res.status(200).json(postData);
});

export default authRouter;
