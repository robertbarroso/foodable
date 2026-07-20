import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js";

const router = express.Router();

// GET: All current social posts
router.get("/", fakeAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles (username)");

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

export default router;
