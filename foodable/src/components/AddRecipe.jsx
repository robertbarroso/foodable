import useRecipeForm from "../hooks/useRecipeForm";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function AddRecipe({recipeList, setRecipeList, setIsOpen}) {

    // Taken from custom hook to compartamentalize add recipe and edit recipe
    const {
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
    } = useRecipeForm();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const toastId = toast.loading("Adding Recipe...")

        try {
            const recipe = {
                title,
                description,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                ingredient_cost: totalIngredientCost,
                ingredients,
                instructions,
                is_public: isPublic
            }

            const response = await fetch(`${API_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("supabase_access_token")}`
                },
                body: JSON.stringify(recipe)
            })

            const data = await response.json()

            setRecipeList([...recipeList, data.recipe])
            setIsOpen(false)
            resetForm()

            toast.success("Recipe successfully created!", {id: toastId});
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong... Please try again.", {id: toastId});
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <h2>Add Recipe</h2>

            <input
                type="text"
                placeholder="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Recipe Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
            />
            <input
                type="number"
                placeholder="Protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
            />
            <input
                type="number"
                placeholder="Carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
            />
            <input
                type="number"
                placeholder="Fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
            />

            <h3>Ingredient</h3>
            <input
                type="text"
                placeholder="Name"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Quantity"
                value={ingredientQuantity}
                onChange={(e) => setIngredientQuantity(e.target.value)}
            />
            <input
                type="number"
                step="0.01"
                placeholder="Cost"
                value={ingredientCost}
                onChange={(e) => setIngredientCost(e.target.value)}
            />
            <button type="button" onClick={addIngredient}>
                Add Ingredient
            </button>
            <ul>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.quantity} {ingredient.name} - ${ingredient.cost.toFixed(2)}

                        <button type="button" onClick={() => removeIngredient(index)}>Remove </button>
                    </li>
                ))}
            </ul>

            <p>Total Cost: ${totalIngredientCost.toFixed(2)}</p>

            <h3>Instruction</h3>
            <ol>
                {instructions.map((instruction, index) => (
                    <li key={index}>
                        {instruction}

                        <button type="button" onClick={() => removeInstruction(index)}>Remove</button>
                    </li>
                ))}
            </ol>
            <input
                type="text"
                placeholder="Instruction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
            />
            <button type="button" onClick={addInstruction}>
                Add Instruction
            </button>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Make Recipe Public
                </label>
            </div>
            <div>
                <button type="submit">Add Recipe</button>
            </div>
        </form>
    </>
}