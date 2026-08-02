export default function RecipePost({ recipe_post }) {
  if (!recipe_post) {
    console.error("ERROR: No recipe post has been found!", recipe_post);
    return <p>No recipe post received.</p>;
  }

  console.log(recipe_post);

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
          <p className="pill-render-post likes-render post-information-content">
            ♥ {recipe_post.likes}
          </p>
          <p className="post-information-content">
            Created by <b>{recipe_post.profiles.username}</b>
          </p>
          <p className="post-information-content">
            Posted on <b>{recipeCreated}</b>
          </p>
        </section>
        <section id="recipe-macros"></section>
      </article>
    </>
  );
}
