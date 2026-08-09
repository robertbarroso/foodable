import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function DeleteRecipe({id, recipeList, setRecipeList}) {

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/recipes/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("supabase_access_token")}`
                    },
                }
            )
            const data = await response.json()

            if (response.ok) {
                setRecipeList(recipeList.filter((recipe) => recipe.id !== id))
                toast.success("Recipe successfully deleted!");
            }

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong... Please try again.");
        }
    }

    return <button className="recipe-delete-button" onClick={() => handleDelete(id)}>Delete Recipe</button>
}