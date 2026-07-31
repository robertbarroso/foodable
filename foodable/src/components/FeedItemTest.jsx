import FeedItem from "./FeedItem";

export default function FeedItemTest() {
  const recipePost = {
    post_id: 1,
    title: "Example Post",
    created_date: "2026-07-10T11:38:13",
    content:
      "This is example text of a post. This text is coming from Supabase - not hardcoded! :D",
    likes: 25,
    user_id: "4cf6e045-fa38-4019-9d25-5d0075962464",
    post_type: 2,
    grocery_list_id: null,
    recipe_list_id: "recipe123",
  };

  const groceryPost = {
    post_id: 2,
    recipe_list_id: null,
    title: "Example Grocery Title",
    likes: 24,
    grocery_list_id: "grocery456",
  };

  return (
    <>
      <FeedItem incoming_data={recipePost} />
      <FeedItem incoming_data={groceryPost} />
    </>
  );
}
