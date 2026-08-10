import express from "express";
import { supabaseService } from "../supabase.js";
import requireAuth from "../middleware/requireAuth.js";
import { copyPublicListForUser } from "../utils/groceryPublic.js";

const router = express.Router();

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
    // Check if the post has already been liked (for the toggle)
    // If data is empty, then it has not been liked, otherwise it has been.
    const { data: proof_of_liked, error: error_with_like_toggle } =
      await supabaseService
        .from("post_likes")
        .select("*")
        .eq("user_id", user_id)
        .eq("post_id", post_id);

    // If error with toggle
    if (error_with_like_toggle) {
      return res.status(400).json({
        success: false,
        error: "ERROR: Failed to like with toggle feature.",
      });
    }

    if (proof_of_liked.length > 0) {
      // If there is content, then the like exists, simply remove
      const { error: failed_to_delete } = await supabaseService
        .from("post_likes")
        .delete()
        .eq("user_id", user_id)
        .eq("post_id", post_id);

      // Failed to unlike from db
      if (failed_to_delete) {
        console.error("ERROR: Failed to unlike post");

        res.status(400).json({
          success: false,
          error: "ERROR: Failed to unlike post, and subsequent removal from db",
        });
      }

      // Grab the post (for reducing like count)
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
      // ADDED: Some math to prevent negative numbers.
      const { error: post_error_update_likes } = await supabaseService
        .from("posts")
        .update({
          likes: Math.max(0, (post_row_data.likes ?? 0) - 1),
        })
        .eq("post_id", post_id);

      // If the increment failes
      if (post_error_update_likes) {
        return res.status(400).json({
          success: false,
          error: "ERROR: Failed to decrement the likes by 1",
        });
      }
    }

    // If the data is empty, then add since post isnt there
    if (proof_of_liked.length === 0) {
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
          .select("likes, grocery_list_id")
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

      // Grocery posts: save a private copy for the liking user.
      let copiedList = null;
      if (post_row_data.grocery_list_id) {
        const copyResult = await copyPublicListForUser(
          post_row_data.grocery_list_id,
          user_id,
        );
        if (copyResult.data) {
          copiedList = {
            id: copyResult.data.id,
            title: copyResult.data.title,
          };
        } else if (copyResult.error) {
          console.error(
            "ERROR: Failed to copy grocery list on like",
            copyResult.error,
          );
        }
      }

      return res.status(200).json({
        success: true,
        user_id,
        post_id,
        copiedList,
      });
    }
    res.status(200).json({
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

// GET: To help create a shareable link
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
    const { data: post, error } = await supabaseService
      .from("posts")
      .select("*, profiles(username)")
      .eq("post_id", post_id)
      .single();

    if (error) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.recipe_list_id) {
      const { data: recipeData } = await supabaseService
        .from("recipes")
        .select("*")
        .eq("id", post.recipe_list_id)
        .single();

      post.recipe = recipeData;
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

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });
  }
});
``;

export default router;
