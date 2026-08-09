// Incoming data represents either grocery list or recipe list.
// Objective:
//      Determine if the incoming data is either or and send to the approrpriate component.

import GroceryPost from "./GroceryPost";
import RecipePost from "./RecipePost";

export default function FeedItem({ incoming_data }) {
  // Error handling: If empty

  if (!incoming_data) {
    console.error(
      "ERROR: Incoming content for social post is null or undefined",
      incoming_data,
    );

    // Visual return
  }

  // If incoming is -> Recipe
  if (incoming_data.recipe) {
    return <RecipePost recipe_post={incoming_data} />;
  }
  // If incoming is -> Grocery List
  if (incoming_data.grocery) {
    return <GroceryPost grocery_post={incoming_data} />;
  }

  // If the shape is unrecognized, log and show a placeholder
  console.error(
    "ERROR: Unrecognized post shape for incoming_data",
    incoming_data,
  );
  return (
    <div id="error-return">
      <p>ERROR: Unable to render this post type.</p>
    </div>
  );
}
