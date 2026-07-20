
export default function DeleteRecipe({id, recipeList, setRecipeList}) {

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/recipes/${id}`,
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

    return <button onClick={() => handleDelete(id)}>Delete Recipe</button>
}