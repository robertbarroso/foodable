import { useState, useEffect } from "react";

export default function Recipe() {

  const [recipeList, setRecipeList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getRecipeFromUser() {
      try {
        const response = await fetch("http://localhost:5000/api/recipes")
        const data = await response.json()
        
        setRecipeList(data);
        setIsLoading(false);

      } catch (error) {
        console.error(error);
      }
    }
    getRecipeFromUser()
  }, [])


  return (
    <div 
      className="background"
      style={{
        backgroundColor: "#f5f5f5"
      }}
    >
      <h1 
        className="page-title" 
        style={{
          padding: "20px"
      }}>Recipes</h1>
      {!isLoading ? <div className="recipe-list">
        {recipeList.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: "1px solid lightgray",
              padding: "10px",
              backgroundColor: "white"
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
          </div>
        ))}
      </div> : <h1>Loading...</h1>}
    </div>
  );
  
}