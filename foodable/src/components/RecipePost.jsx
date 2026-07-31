export default function RecipePost({ recipe_post }) {
  if (!recipe_post) {
    return <p>No recipe post received.</p>;
  }

  return (
    <div id="post-card">
      <p>Post ID: {recipe_post.post_id}</p>
      <p>Recipe ID: {recipe_post.recipe_list_id}</p>
    </div>
  );
}
