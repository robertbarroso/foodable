import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js";
import { copyPublicListForUser } from "../utils/groceryPublic.js";

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

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "ERROR: Server error",
    });
  }
});

// Heart a post. For grocery posts, first heart also copies the list to the user.
router.post("/:postId/heart", async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("post_id", postId)
      .maybeSingle();

    if (postError) {
      return res.status(500).json({ error: postError.message });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { error: likeError } = await supabase.from("post_likes").insert({
      user_id: req.user.id,
      post_id: postId,
    });

    if (likeError) {
      // Unique violation = already hearted
      if (likeError.code === "23505") {
        return res.status(200).json({
          post,
          copiedList: null,
          alreadyHearted: true,
        });
      }

      return res.status(500).json({ error: likeError.message });
    }

    const nextLikes = (post.likes ?? 0) + 1;
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({ likes: nextLikes })
      .eq("post_id", postId)
      .select("*, profiles (username)")
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    let copiedList = null;

    if (post.grocery_list_id) {
      const copyResult = await copyPublicListForUser(
        post.grocery_list_id,
        req.user.id,
      );
      if (copyResult.error) {
        return res
          .status(copyResult.status)
          .json({ error: copyResult.error.message });
      }
      copiedList = copyResult.data;
    }

    return res.status(200).json({
      post: updatedPost,
      copiedList,
      alreadyHearted: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERROR: Server error" });
  }
});

// RECIPES: When 'is_public' is set to true

// GROCERIES: When 'is_public' is set to true

export default router;
