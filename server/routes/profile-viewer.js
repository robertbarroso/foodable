import express from "express";
import { supabaseService } from "../supabase.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// GET: Retrieve all of the information about the CURRENT signed in user.
router.get("/me", requireAuth, async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1: Get basic user information, like username, name, joined
    const { data: profileData, error: profileError } = await supabaseService
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: profile information",
      });
    }

    // 2: Get the number of followers
    const { count: followerCount, error: followerError } = await supabaseService
      .from("follow")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("followed_id", user_id);

    if (followerError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: follower information",
      });
    }

    // 3: Get the number of following
    const { count: followingCount, error: followingError } =
      await supabaseService
        .from("follow")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user_id);

    if (followingError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: following information",
      });
    }

    // 4: Retrieve all published recipes and grocery lists
    const { data: publishedPosts, error: postsError } = await supabaseService
      .from("posts")
      .select(
        `
      *,
      profiles(*),
      recipes(*),
      grocery_lists(*)
    `,
      )
      .eq("user_id", user_id);

    if (postsError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: post information",
      });
    }

    // Hydrate grocery items
    for (const post of publishedPosts) {
      if (post.grocery_lists) {
        const { data: groceryItems } = await supabaseService
          .from("grocery_list_items")
          .select("*")
          .eq("list_id", post.grocery_lists.id);

        post.grocery_lists.items = groceryItems;
      }
    }

    const recipePosts = publishedPosts
      .filter((post) => post.post_type === 1)
      .map((post) => ({
        ...post,
        recipe: post.recipes,
      }));

    const groceryPosts = publishedPosts
      .filter((post) => post.post_type === 2)
      .map((post) => ({
        ...post,
        grocery: post.grocery_lists,
      }));

    // Final return
    return res.status(200).json({
      profile: profileData,
      followers: followerCount ?? 0,
      following: followingCount ?? 0,
      recipePosts: recipePosts ?? [],
      groceryPosts: groceryPosts ?? [],
    });
  } catch (error) {
    return res.status(500).json({
      error: "ERROR: Failed to load user data",
    });
  }
});

// GET: Retrieve all of the followers that the user (signed in) has
router.get("/:user_id/following", requireAuth, async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const { data: userFollowers, error: userFollowersError } =
      await supabaseService
        .from("follow")
        .select(
          `
        followed_id,
        profiles!follow_followed_id_fkey (
          id,
          username
        )
      `,
        )
        .eq("user_id", user_id);

    if (userFollowersError) {
      return res.status(400).json({
        error: userFollowersError.message,
      });
    }

    console.log("FOLLOWING:", userFollowers);

    return res.status(200).json(userFollowers);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load following list",
    });
  }
});

// GET: Retrieve all of the information about the PROFILE of the user we wish to see (that is not the signed in user).

router.get("/:user_id", requireAuth, async (req, res) => {
  const user_id = req.params.user_id;

  try {
    // 1: Get basic user information, like username, name, joined
    const { data: profileData, error: profileError } = await supabaseService
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: profile information",
      });
    }

    // 2: Get the number of followers
    const { count: followerCount, error: followerError } = await supabaseService
      .from("follow")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("followed_id", user_id);

    if (followerError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: follower information",
      });
    }

    // 3: Get the number of following
    const { count: followingCount, error: followingError } =
      await supabaseService
        .from("follow")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user_id);

    if (followingError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: following information",
      });
    }

    // 4: Retrieve all published recipes and grocery lists
    const { data: publishedPosts, error: postsError } = await supabaseService
      .from("posts")
      .select(
        `
      *,
      profiles(*),
      recipes(*),
      grocery_lists(*)
    `,
      )
      .eq("user_id", user_id);

    if (postsError) {
      return res.status(400).json({
        error: "ERROR: Failed to retrieve: post information",
      });
    }

    const recipePosts = publishedPosts
      .filter((post) => post.post_type === 1)
      .map((post) => ({
        ...post,
        recipe: post.recipes,
      }));

    const groceryPosts = publishedPosts
      .filter((post) => post.post_type === 2)
      .map((post) => ({
        ...post,
        grocery: post.grocery_lists,
      }));
    // Final return
    return res.status(200).json({
      profile: profileData,
      followers: followerCount ?? 0,
      following: followingCount ?? 0,
      recipePosts: recipePosts ?? [],
      groceryPosts: groceryPosts ?? [],
    });
  } catch (error) {
    return res.status(500).json({
      error: "ERROR: Failed to load user data",
    });
  }
});

export default router;
