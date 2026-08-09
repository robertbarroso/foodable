const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function DeleteRecipe({id, recipeList, setRecipeList}) {

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/recipes/${id}`,
                {
                    method: "DELETE"
                }
            )
            const data = await response.json()
        
            console.log(data)

            if (response.ok) {
                setRecipeList(recipeList.filter((recipe) => recipe.id !== id))
            }

        } catch (error) {
            console.error(error)
        }
    }

    return <button className="recipe-delete-button" onClick={() => handleDelete(id)}>Delete Recipe</button>
}