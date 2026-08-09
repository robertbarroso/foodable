import express from "express";
import { supabaseService } from "../supabase.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// POST: Add both users_id and follower_id into 'follow'
router.post("/", requireAuth, async (req, res) => {
  console.log("DEBUG: Follow route reached (start)");
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

export default router;
