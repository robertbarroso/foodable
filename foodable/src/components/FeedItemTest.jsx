import FeedItem from "./FeedItem";

export default function FeedItemTest() {
  const recipePost = {
    post_id: 1,
    recipe_list_id: "recipe123",
    grocery_list_id: null,
  };

  const groceryPost = {
    post_id: 2,
    recipe_list_id: null,
    grocery_list_id: "grocery456",
  };

  return (
    <>
      <FeedItem incoming_data={recipePost} />
      <FeedItem incoming_data={groceryPost} />
    </>
  );
}
