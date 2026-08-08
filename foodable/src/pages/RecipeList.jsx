import { useState, useEffect } from "react";
import AddRecipe from "../components/AddRecipe";
import RecipeCard from "../components/RecipeCard";
import AICreationModal from "../components/AICreationModal";
import Modal from "../components/Modal";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function Recipe() {

  const [recipeList, setRecipeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAICreation, setShowAICreation] = useState(false);
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function getRecipeFromUser() {
      try {
        const response = await fetch(`${API_URL}/recipes`)
        const data = await response.json()
        
        console.log(data)
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

       {!isLoading && (
        <button
          type="button"
          onClick={() => setShowAICreation(true)}
        >
          Create Recipe with AI
        </button>
      )}

      {isLoading && <h1>Loading...</h1>}
      {!isLoading && <>
        <button onClick={() => setIsOpen(true)}>Add New Recipe +</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <AddRecipe recipeList={recipeList} setRecipeList={setRecipeList} setIsOpen={setIsOpen} />
        </Modal>
      </>}
      {!isLoading && recipeList.length > 0 && <div className="recipe-list"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        padding: "10px"
      }}>
        {recipeList.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} recipeList={recipeList} setRecipeList={setRecipeList}/>
        ))}
      </div>}
      {!isLoading && !recipeList.length && (
        <h1>No recipes to display...</h1>
      )}
      
      {showAICreation && (
        <AICreationModal
          mode="recipe"
          onClose={() => setShowAICreation(false)}
          onCreated={(recipe) => {
            console.log(recipe);

            // AI RECIPE SAVE INTEGRATION
            setRecipeList((currentRecipes) => [
              ...currentRecipes,
              recipe,
            ]);

            setShowAICreation(false);
          }}
        />
      )}
    </div>
  );
}