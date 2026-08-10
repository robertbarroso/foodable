import { useState } from "react";
import DeleteRecipe from "./DeleteRecipe";
import Modal from "./Modal";
import EditRecipe from "./EditRecipe";
import DeleteSavedRecipe from "./DeleteSavedRecipe";

export default function RecipeCard({ recipe, recipeList, setRecipeList, savedRecipeList, setSavedRecipeList ,isUser, postId=null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (<>
    <div
      key={recipe.id}
      className="recipe-card"
      style={{
        border: "1px solid #dfe7e2",
        borderRadius: "14px",
        padding: "20px",
        backgroundColor: "#ffffff",
        width: "400px",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      <h2>{recipe.title}</h2>
      {!postId && (recipe.is_public ? <p>(Shared)</p> : <p>(Private)</p>)}
      {recipe?.description ? <p>{recipe.description}</p> : null}
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
        {recipe?.ingredient_cost ? recipe.ingredient_cost.toFixed(2) : null}
      </p>
      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <div className="recipe-card-actions">
        {isUser && <>
          <button className="recipe-edit-button" onClick={() => setIsOpen(true)}>
            Edit Recipe
          </button>
          <DeleteRecipe
            id={recipe.id}
            recipeList={recipeList}
            setRecipeList={setRecipeList}
          />
        </>}
        {!isUser && 
          <DeleteSavedRecipe 
            id={recipe.id}
            postId={postId}
            savedRecipeList={savedRecipeList}
            setSavedRecipeList={setSavedRecipeList}
          />
        }
      </div>
    </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <EditRecipe
          recipe={recipe}
          recipeList={recipeList}
          setRecipeList={setRecipeList}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </>
  );
}
