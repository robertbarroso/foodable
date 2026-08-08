import express from "express";
import supabase from "../supabase.js";

const authRouter = express.Router();

// FETCH from Supabase 'posts'
authRouter.get("/", async (req, res) => {
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("*");

  if (postError) {
    console.error(postError);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }

  // FETCH recipe or grocery data for each post
  for (const post of postData) {
    if (post.recipe_list_id) {
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", post.recipe_list_id)
        .single();

      if (recipeError) {
        console.error(recipeError);
        continue;
      }

      post.recipe = recipeData;
    }

    if (post.grocery_list_id) {
      const { data: groceryData, error: groceryError } = await supabase
        .from("grocery_lists")
        .select("*")
        .eq("id", post.grocery_list_id)
        .single();

      if (groceryError) {
        console.error(groceryError);
        continue;
      }

      post.grocery = groceryData;
    }
  }

  return res.status(200).json(postData);
});

export default authRouter;
