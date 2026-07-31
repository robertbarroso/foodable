import express from "express";
// import supabase from "../supabase.js";

const authRouter = express.Router();

// Send TEST to FeedItem
authRouter.get("/", async (req, res) => {
  const test_recipe = {
    idx: 0,
    id: "032c4305-ef19-4c71-9969-1ca210a10400",
    user_id: "4cf6e045-fa38-4019-9d25-5d0075962464",
    created_at: "2026-07-13 06:16:42.812135+00",
    updated_at: "2026-07-13 06:16:42.812135+00",
    title: "Avocado Toast",
    description:
      "Whole grain toast topped with smashed avocado and cherry tomatoes.",
    calories: 340,
    protein: 9,
    carbs: 32,
    fat: 18,
    ingredient_cost: "3.2",
    ingredients:
      '[{"cost": 0.8, "name": "Whole Grain Bread", "quantity": "2 slices"}, {"cost": 1.5, "name": "Avocado", "quantity": "1 medium"}, {"cost": 0.9, "name": "Cherry Tomatoes", "quantity": "1/2 cup"}]',
    instructions:
      '["Toast the bread until golden.", "Mash the avocado with a fork.", "Spread the avocado evenly on the toast.", "Top with sliced cherry tomatoes.", "Season with salt and pepper before serving."]',
    is_public: false,
  };
  const test_post = {
    idx: 5,
    post_id: 10,
    title: "Avocado Toast Recipe!",
    created_date: "2026-07-31 17:00:29+00",
    content: "Example description",
    likes: 115,
    user_id: "4cf6e045-fa38-4019-9d25-5d0075962464",
    post_type: 1,
    grocery_list_id: null,
    recipe_list_id: "032c4305-ef19-4c71-9969-1ca210a10400",
    recipe: test_recipe,
  };

  res.status(200).json(test_post);
});

export default authRouter;
