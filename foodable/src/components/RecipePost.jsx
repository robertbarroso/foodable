import FollowButton from "./FollowButton";
import { selectUser } from "../auth/UserContext.jsx";
import { useState } from "react";

export default function RecipePost({ recipe_post }) {
  const [actionError, setActionError] = useState(null);
  const [isFollowing, setIsFollowing] = useState();

  const { currentUser } = selectUser();
  if (!recipe_post) {
    console.error("ERROR: No recipe post has been found!", recipe_post);
    return <p>No recipe post received.</p>;
  }

  // When someone follow, add to the 'follows' table - same way as likes
  async function handleFollow(post_id) {
    if (!currentUser?.id) {
      setActionError("Please sign in to follow.");
      return;
    }

    const access_token = localStorage.getItem("supabase_access_token");

    if (!access_token) {
      console.error("ERROR: Missing token! (follow)");
      setActionError("Missing sign in token!");
      return;
    }

    setActionError(null);

    // Update to show if followed or not

    const response = await fetch(`${API_URL}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
  }

  const recipeCreated = new Date(recipe_post.created_date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <>
      <article recipe-post-header>
        <h3 id="post-title">{recipe_post.recipe.title}</h3>
        <section className="post-information-full">
          <p className="post-information-content post-username">
            Created by <b>{recipe_post.profiles.username}</b>
            <FollowButton
              current_user_id={currentUser?.id}
              followed_user_id={recipe_post.user_id}
            />
          </p>
          <p className="post-information-content">
            Posted on <b>{recipeCreated}</b>
          </p>
        </section>
        <section id="recipe-macros">
          <div className="recipe-macro-container">
            <div className="recipe-macro-title">Calories</div>
            <div className="recipe-macro-value">
              {recipe_post.recipe.calories}
            </div>
          </div>
          <div className="recipe-macro-container">
            <div className="recipe-macro-title">Protein</div>
            <div className="recipe-macro-value">
              {recipe_post.recipe.protein}g
            </div>
          </div>
          <div className="recipe-macro-container">
            <div className="recipe-macro-title">Carbs</div>
            <div className="recipe-macro-value">
              {recipe_post.recipe.carbs}g
            </div>
          </div>
          <div className="recipe-macro-container">
            <div className="recipe-macro-title">Fat</div>
            <div className="recipe-macro-value">{recipe_post.recipe.fat}g</div>
          </div>
        </section>
        <section id="recipe-content-container">
          <section id="recipe-main-instructions">
            <h2 className="post-sub-title">Instructions</h2>
            <div className="recipe-instructions-render">
              {recipe_post.recipe.instructions.map((instruction, index) => (
                <div className="instruction-card">
                  <div className="label-counter">{index + 1}</div>
                  <div className="instruction-content">{instruction}</div>
                </div>
              ))}
            </div>
          </section>
          <section id="recipe-main-ingredients">
            <div className="ingredient-main-container">
              <h2 className="post-sub-title">Ingredients</h2>
              {recipe_post.recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-container">
                  <div className="ingredient-title">
                    <p className="label-text-title">• {ingredient.name} </p>
                  </div>
                  <div className="ingredient-info">
                    <p className="info-design">{ingredient.quantity}</p>
                    <p className="info-design">${ingredient.cost.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="recipe-total-cost-container">
                <div className="ingredient-text-title">Total Cost</div>

                <div className="recipe-total-cost-value">
                  ${recipe_post.recipe.ingredient_cost.toFixed(2)}
                </div>
              </div>
            </div>
          </section>
        </section>
      </article>
    </>
  );
}
