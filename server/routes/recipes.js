import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js"

const recipesRouter = express.Router();

// Get all recipes from a user
recipesRouter.get("/", fakeAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("user_id", userId)


        if (error) {
            return res.status(400).json({
                error: error.message
        })
    }

    res.json(data)

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        })
    }
});

// Add a recipe for a user's account
recipesRouter.post("/", fakeAuth, async (req, res) => {
    try {
        const userId = req.user.id;

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
            is_public
        } = req.body;


        const { data, error } = await supabase
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
                    is_public
                }
            ])
            .select()


        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }


        res.status(201).json(data[0]);

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        })
    }
});

// updates a user's recipe
recipesRouter.patch("/:id", fakeAuth, async (req, res) => {
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
            is_public
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
                is_public
            })
            .eq("id", recipeId)
            .eq("user_id", userId)
            .select();

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                error: "Recipe not found"
            });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }
});

// Delete a user's recipe
recipesRouter.delete("/:id", fakeAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        console.log(recipeId)

        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq("id", recipeId)
            .eq("user_id", userId)
        
        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }

        res.json({
            message: "Recipe successfully deleted."
        })

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        })
    }
})


export default recipesRouter;