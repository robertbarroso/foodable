import { useState } from "react";

export default function AddRecipe({recipeList, setRecipeList}) {

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

    const totalIngredientCost = ingredients.reduce((sum, ingredient) => sum + ingredient.cost, 0)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const recipe = {
                title,
                description,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                ingredientCost: totalIngredientCost,
                ingredients,
                instructions
            }

            const response = await fetch("http://localhost:5000/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipe)
            })

            const data = await response.json()
            console.log(data);

            setRecipeList([...recipeList, data])
        } catch (error) {
            console.error(error)
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
                <button type="submit">Add Recipe</button>
            </div>
        </form>
    </>
}