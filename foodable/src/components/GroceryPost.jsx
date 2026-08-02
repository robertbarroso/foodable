export default function GroceryPost({ grocery_post }) {
  // If there is no reciple post
  if (!grocery_post) {
    console.error("ERROR: No grocery post has been found!", grocery_post);
    return <p>No grocery post received.</p>;
  }
  const groceryCreated = new Date(grocery_post.created_date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
  return (
    <>
      <article grocery-post-header>
        <h3 id="post-title">{grocery_post.grocery.title}</h3>
        <div className="post-information-full">
          <p className="pill-render-post likes-render post-information-content">
            ♥ {grocery_post.likes}
          </p>
          <p className="post-information-content">
            Created by <b>{grocery_post.profiles.username}</b>
          </p>
          <p className="post-information-content">
            Posted on: <b>{groceryCreated}</b>
          </p>
        </div>
      </article>
    </>
  );
}
