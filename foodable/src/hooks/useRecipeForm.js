import { useState } from "react";

export default function useRecipeForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientQuantity, setIngredientQuantity] = useState("");
    const [ingredientCost, setIngredientCost] = useState("");
    const [instruction, setInstruction] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);

    const addIngredient = () => {

        if (ingredientName.length > 0 && ingredientQuantity > 0 && ingredientCost > 0){
            setIngredients([
                ...ingredients,
                {
                    name: ingredientName,
                    quantity: ingredientQuantity,
                    cost: Number(ingredientCost)
                }
            ])
    
            setIngredientName("")
            setIngredientQuantity("")
            setIngredientCost("")
        }
    }

    const removeIngredient = (index) => {
        setIngredients(
            ingredients.filter((_, i) => i !== index)
        )
    }


    const addInstruction = () => {
        if (instruction.length > 0) {   
            setInstructions([...instructions, instruction])
            setInstruction("")
        }
    }

    const removeInstruction = (index) => {
        setInstructions(
            instructions.filter((_, i) => i !== index)
        )
    }

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setIngredientName("");
        setIngredientQuantity("");
        setIngredientCost("");
        setInstruction("");
        setIsPublic(false);

        setIngredients([]);
        setInstructions([]);
    };

    const totalIngredientCost = ingredients.reduce((sum, ingredient) => sum + ingredient.cost, 0)

    const loadRecipe = (recipe) => {
        setTitle(recipe.title ?? "");
        setDescription(recipe.description ?? "");
        setCalories(recipe.calories ?? "");
        setProtein(recipe.protein ?? "");
        setCarbs(recipe.carbs ?? "");
        setFat(recipe.fat ?? "");
        setIsPublic(recipe.is_public ?? false);

        setIngredients(recipe.ingredients ?? []);
        setInstructions(recipe.instructions ?? []);
    };

    return {
        title, setTitle,
        description, setDescription,
        calories, setCalories,
        protein, setProtein,
        carbs, setCarbs,
        fat, setFat,
        ingredientName, setIngredientName,
        ingredientQuantity, setIngredientQuantity,
        ingredientCost, setIngredientCost,
        instruction, setInstruction,
        isPublic, setIsPublic,
        ingredients,
        instructions,
        addIngredient,
        removeIngredient,
        addInstruction,
        removeInstruction,
        resetForm,
        totalIngredientCost,
        loadRecipe
    };
}