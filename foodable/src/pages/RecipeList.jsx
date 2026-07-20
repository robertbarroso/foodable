import { useState, useEffect } from "react";
import AddRecipe from "../components/AddRecipe";
import RecipeCard from "../components/RecipeCard";

export default function Recipe() {

  const [recipeList, setRecipeList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getRecipeFromUser() {
      try {
        const response = await fetch("http://localhost:5000/api/recipes")
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
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && <AddRecipe recipeList={recipeList} setRecipeList={setRecipeList}/>}
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
      {!isLoading && !recipeList.length && <h1>No recipes to display...</h1>}
    </div>
  );
  
}