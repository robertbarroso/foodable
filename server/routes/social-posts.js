import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js";

const router = express.Router();

router.use(fakeAuth);

// GET: All current social posts
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles (username)")
      .order("created_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    for (const post of data) {
      if (post.recipe_list_id) {
        const { data: recipeData } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", post.recipe_list_id)
          .single();

        post.recipe = recipeData;
      }

      if (post.grocery_list_id) {
        // Get Grocery List
        const { data: groceryData } = await supabase
          .from("grocery_lists")
          .select("*")
          .eq("id", post.grocery_list_id)
          .single();

        // Get Grocery Items
        const { data: groceryItems } = await supabase
          .from("grocery_list_items")
          .select("*")
          .eq("list_id", post.grocery_list_id);

        groceryData.items = groceryItems;

        post.grocery = groceryData;
      }
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "ERROR: Server error",
    });
  }
});

// Heart a post. For grocery posts, first heart also copies the list to the user.

// RECIPES: When 'is_public' is set to true

// GROCERIES: When 'is_public' is set to true

export default router;
