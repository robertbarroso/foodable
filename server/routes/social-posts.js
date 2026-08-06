import express from "express";
import { supabaseService } from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js";
//import { selectUser } from "../../foodable/src/auth/UserContext.jsx";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

//const currentUser = selectUser();

router.use(fakeAuth);

// GET: All current social posts
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseService
      .from("posts")
      .select("*, profiles (username)")
      .order("created_date", { ascending: false });

    if (error) {
      console.error("ERROR: Failed to fetch from Supabase");
      return res.status(400).json({
        error: error.message,
      });
    }
    for (const post of data) {
      if (post.recipe_list_id) {
        const { data: recipeData, error: recipeError } = await supabaseService
          .from("recipes")
          .select("*")
          .eq("id", post.recipe_list_id)
          .single();

        if (recipeError) {
          console.error(
            `ERROR: Failed to attach recipe for post ${post.post_id}: ${recipeError.message}`,
          );
        }

        post.recipe = recipeData;

        console.log("Recipe attached:", post.post_id);
      }

      if (post.grocery_list_id) {
        const { data: groceryData } = await supabaseService
          .from("grocery_lists")
          .select("*")
          .eq("id", post.grocery_list_id)
          .single();

        const { data: groceryItems } = await supabaseService
          .from("grocery_list_items")
          .select("*")
          .eq("list_id", post.grocery_list_id);

        groceryData.items = groceryItems;
        post.grocery = groceryData;
      }
    }
    console.log(JSON.stringify(data, null, 2));
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "ERROR: Server error",
    });
  }
});

// Heart a post. For grocery posts, first heart also copies the list to the user.

router.post("/:post_id/like", requireAuth, async (req, res) => {
  const post_id = req.params.post_id;

  // Comes from requireAuth
  const user_id = req.user.id;

  try {
    const { error } = await supabaseService.from("post_likes").insert({
      user_id,
      post_id,
    });

    if (error) {
      console.error("ERROR: Failed to save the liked post!");
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Grab the post
    const { data: post_row_data, error: post_fetch_error } =
      await supabaseService
        .from("posts")
        .select("likes")
        .eq("post_id", post_id)
        .single();
    // If the fetch failes
    if (post_fetch_error) {
      console.error("ERROR: Failed to fetch current post (for likes)");
      return res.status(400).json({
        success: false,
        error: "ERROR: Failed to fetch post likes",
      });
    }

    // Update the post
    const { error: post_error_update_likes } = await supabaseService
      .from("posts")
      .update({ likes: (post_row_data.likes ?? 0) + 1 })
      .eq("post_id", post_id);
    // If the increment failes
    if (post_error_update_likes) {
      return res.status(400).json({
        success: false,
        error: "ERROR: Failed to increment the likes by 1",
      });
    }

    return res.status(200).json({
      success: true,
      user_id,
      post_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
    });
  }
});

export default router;
