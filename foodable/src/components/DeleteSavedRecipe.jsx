import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function DeleteSavedRecipe({id, postId, savedRecipeList, setSavedRecipeList}) {
    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/recipes/saved/${postId}`,
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
                setSavedRecipeList(savedRecipeList.filter((item) => item.posts.recipes.id !== id))
                toast.success("Saved recipe successfully removed!");
            }

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong... Please try again.");
        }
    }

    return <button className="recipe-delete-button" onClick={() => handleDelete(postId)}>Remove Saved Recipe</button>
}