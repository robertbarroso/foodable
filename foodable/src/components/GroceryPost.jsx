export default function GroceryPost({ grocery_post }) {
  // If there is no reciple post
  if (!grocery_post) {
    console.error("ERROR: No grocery post has been found!", grocery_post);
    return <p>No grocery post received.</p>;
  }

  return <pre>{JSON.stringify(grocery_post, null, 2)}</pre>;
}
