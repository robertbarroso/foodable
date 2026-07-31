export default function RecipePost({ recipe_post }) {
  if (!recipe_post) {
    console.error("ERROR: No recipe post has been found!", recipe_post);
    return <p>No recipe post received.</p>;
  }

  return <pre>{JSON.stringify(recipe_post, null, 2)}</pre>;
}
