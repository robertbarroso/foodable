export default function RecipePost({ recipe_post }) {
  // If there is no reciple post
  if (!recipe_post) {
    console.error("ERROR: No reciple post has been found!", recipe_post);
    return <p>No recipe post received.</p>;
  }

  return (
    <div id="post-card">
      <div id="post-header">
        <h3 className="post-title">{recipe_post.title} </h3>
        <p className="likes">{recipe_post.likes}</p>
      </div>
    </div>
  );
}
