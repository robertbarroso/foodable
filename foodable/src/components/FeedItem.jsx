// Incoming data represents either grocery list or recipe list.
// Objective:
//      Determine if the incoming data is either or and send to the approrpriate component.

import GroceryPost from "./GroceryPost";
import RecipePost from "./RecipePost";

export default function FeedItem({ incoming_data }) {
  // Error handling: If empty
  if (!incoming_data) {
    // Console report
    console.error(
      "ERROR: Incoming content for social post is null or undefined",
      incoming_data,
    );

    // Visual return
    return (
      <div id="error-return">
        <p>ERROR: Unable to load incoming content</p>
      </div>
    );
  }

  // If incoming is -> Recipe
  if (incoming_data.recipe_list_id) {
    return <RecipePost recipe_post={incoming_data} />;
  }
  // If incoming is -> Grocery List
  if (incoming_data.grocery_list_id) {
    return <GroceryPost grocery_post={incoming_data} />;
  }
}
