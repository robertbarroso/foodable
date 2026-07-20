import DeleteRecipe from "./DeleteRecipe";

export default function RecipeCard({recipe, recipeList, setRecipeList}) {
    return (
    <div
        key={recipe.id}
        style={{
            border: "1px solid lightgray",
            padding: "10px",
            backgroundColor: "white",
            width: "400px",
        }}
        >
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        <h3>Macronutrients</h3>
        <ul>
            <li>Calories: {recipe.calories}</li>
            <li>Protein: {recipe.protein}g</li>
            <li>Carbs: {recipe.carbs}g</li>
            <li>Fat: {recipe.fat}g</li>
        </ul>
        <h3>Ingredients</h3>
        <ul>
            {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
                {ingredient.quantity} {ingredient.name} - $
                {ingredient.cost.toFixed(2)}
            </li>
            ))}
        </ul>
        <p>
            <strong>Total Ingredient Cost:</strong> $
            {recipe.ingredient_cost.toFixed(2)}
        </p>
        <h3>Instructions</h3>
        <ol>
            {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
            ))}
        </ol>
        <div>
            <DeleteRecipe id={recipe.id} recipeList={recipeList} setRecipeList={setRecipeList} />
        </div>
    </div>)
}