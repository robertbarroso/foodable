import express from "express";
import supabase from "../supabase.js";
import requireAuth from "../middleware/requireAuth.js";

const recipesRouter = express.Router();

// Get all recipes from a user
recipesRouter.get("/", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

recipesRouter.get("/saved", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("post_likes")
      .select(`
        post_id,
        posts (
          recipe_list_id,
          recipes (*)
        )
      `)
      .eq("user_id", userId);

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    const recipesWithPostId = data.filter((item) => item.posts.recipes != null)

    res.json(recipesWithPostId);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

// Add a recipe for a user's account
recipesRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(userId)

    const {
      title,
      description,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      instructions,
      ingredient_cost,
      is_public,
    } = req.body;

    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .insert([
        {
          user_id: userId,
          title,
          description,
          calories,
          protein,
          carbs,
          fat,
          ingredients,
          instructions,
          ingredient_cost,
          is_public,
        },
      ])
      .select()
      .single();

    if (recipeError) {
      return res.status(400).json({
        error: recipeError.message,
      });
    }

    // Create post if recipe is public
    if (is_public === true) {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            user_id: userId,
            post_type: 1,
            likes: 0,
            recipe_list_id: recipeData.id,
          }
        ])
        .select()
        .single();
        
      if (postError) {
        return res.status(400).json({
          error: postError.message,
        });
      }

      return res.status(201).json({
        recipe: recipeData,
        post: postData
      })
    }

    // Private recipe
    return res.status(201).json({
      recipe: recipeData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

// updates a user's recipe
recipesRouter.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const {
      title,
      description,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      instructions,
      ingredient_cost,
      is_public,
    } = req.body;

    const { data, error } = await supabase
      .from("recipes")
      .update({
        title,
        description,
        calories,
        protein,
        carbs,
        fat,
        ingredients,
        instructions,
        ingredient_cost,
        is_public,
      })
      .eq("id", recipeId)
      .eq("user_id", userId)
      .select()

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    if (data[0].is_public === true) {
      const { data: existingPostData, error: existingPostError } = await supabase
        .from("posts")
        .select("post_id")
        .eq("recipe_list_id", recipeId)
        .eq("user_id", userId)

        if (existingPostError) {
          return res.status(400).json({
            error: existingPostError.message
          })
        }

        // No post exists, create a new post
        if (existingPostData.length === 0) {
          const { data: postData, error: postError } = await supabase
            .from("posts")
            .insert({
              user_id: userId,
              post_type: 1,
              likes: 0,
              recipe_list_id: recipeId
            })

          if (postError) {
            return res.status(400).json({
              error: postError.message
            })
          }
        }
      } else {
        const { error: postError } = await supabase
          .from("posts")
          .delete()
          .eq("recipe_list_id", recipeId)
          .eq("user_id", userId)

        if (postError) {
          return res.status(400).json({
            error: postError.message
          })
        }
      }

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

// Delete a user's recipe
recipesRouter.delete("/:id", requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

    // Delete post first if it exists
    const { error: postError } = await supabase
      .from("posts")
      .delete()
      .eq("recipe_list_id", recipeId)
      .eq("user_id", userId)

    if (postError) {
      return res.status(400).json({
        error: postError.message
      })
    }

    // Then delete the recipe after
    const { error: recipeError } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId)
      .eq("user_id", userId);

    if (recipeError) {
      return res.status(400).json({
        recipeError: error.message,
      });
    }

    res.json({
      message: "Recipe successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

// Delete a user's saved recipe
recipesRouter.delete("/saved/:postId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    // Delete post likes first
    const { error: postLikesError } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)

    if (postLikesError) {
      return res.status(400).json({
        error: postLikesError.message
      })
    }

    const { error: decrementError } = await supabase.rpc(
      "decrement_post_likes",
      {
        post_id_input: postId,
      }
    );

    res.json({
      message: "Recipe removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});


export default recipesRouter;
