export default function GroceryPost({ grocery_post }) {
  // If there is no reciple post
  if (!grocery_post) {
    console.error("ERROR: No grocery post has been found!", grocery_post);
    return <p>No grocery post received.</p>;
  }

  return (
    <div id="post-card">
      <div id="post-header">
        <h3 className="post-title">{grocery_post.title} </h3>
        <p className="likes">{grocery_post.likes}</p>
      </div>
    </div>
  );
}
