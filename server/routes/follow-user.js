import express from "express";
import { supabaseService } from "../supabase.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// POST: Add both users_id and follower_id into 'follow'
router.post("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { followed_id } = req.body;
  console.log({
    user_id,
    followed_id,
  });
  try {
    const { data, error } = await supabaseService
      .from("follow")
      .insert({
        user_id,
        followed_id,
      })
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "ERROR: Failed to add follow to db",
    });
  }
});

// GET: To check and see if the user is already following
router.get("/check/:followed_id", requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { followed_id } = req.params;

  try {
    const { data, error } = await supabaseService
      .from("follow")
      .select("*")
      .eq("user_id", user_id)
      .eq("followed_id", followed_id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      isFollowing: !!data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "ERROR: Failed to check follow status",
    });
  }
});

// DELETE: When a signed in user "unfollows" someone
router.delete("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { followed_id } = req.body;
  console.log({
    user_id,
    followed_id,
  });
  try {
    const { data, error } = await supabaseService
      .from("follow")
      .delete()
      .eq("user_id", user_id)
      .eq("followed_id", followed_id)
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "ERROR: Failed to add follow to db",
    });
  }
});

export default router;
