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
        const response = await fetch(`${API_URL}/recipes`, {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("supabase_access_token")}`
          },
        })
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
    >
      <h1 
        className="page-title" 
        style={{
          padding: "20px",
          textAlign: "center"
      }}>Recipes</h1>

      {isLoading && <h3 style={{textAlign: "center", width: "100%"}}>Loading...</h3>}
      {!isLoading && <div style={{
        textAlign: "center"
      }}>
        <button
          className="recipe-ai-button"
          type="button"
          onClick={() => setShowAICreation(true)}
          style={{
            
          }}
        >
          Create Recipe with AI
        </button>
        <button className="recipe-add-button" onClick={() => setIsOpen(true)}>Add New Recipe +</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <AddRecipe recipeList={recipeList} setRecipeList={setRecipeList} setIsOpen={setIsOpen} />
        </Modal>
      </div>}
      <>
        {!isLoading && recipeList.length > 0 && 
          <>
            <h2 style={{textAlign: "center", width: "100%"}}>My Recipes</h2>
            <div className="recipe-list"
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
            </div>
          </>
        }
      </>
      {!isLoading && !recipeList.length && (
        <h3 style={{textAlign: "center", width: "100%"}}>No recipes to display... Start by adding some!</h3>
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