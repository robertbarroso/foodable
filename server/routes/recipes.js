import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js"

const router = express.Router();

router.get("/", fakeAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("user_id", userId);


        if (error) {
            return res.status(400).json({
                error: error.message
        });
    }

    res.json(data);

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }
});


export default router;