import FollowButton from "./FollowButton";
import { selectUser } from "../auth/UserContext.jsx";
import toast from "react-hot-toast";

export default function GroceryPost({ grocery_post }) {
  console.log("GROCERY OBJECT:", grocery_post.grocery);

  const { currentUser } = selectUser();
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
      <article className="grocery-post-header">
        <h3 id="post-title">{grocery_post.grocery.title}</h3>
        <div className="post-information-full">
          <p className="post-information-content">
            Created by <b>{grocery_post.profiles.username}</b>
            <FollowButton
              current_user_id={currentUser?.id}
              followed_user_id={grocery_post.user_id}
            />
            <button
              className="community-share-button"
              onClick={() => {
                const shareUrl = `${window.location.origin}/post/${grocery_post.post_id}`;

                navigator.clipboard.writeText(shareUrl);

                toast.success("Share link copied!");
              }}
            >
              Share
            </button>
          </p>
          <p className="post-information-content">
            Posted on <b>{groceryCreated}</b>
          </p>
        </div>
        <section className="grocery-content-container">
          <div className="grocery-list-render">
            {grocery_post.grocery.items?.map((item, index) => (
              <div className="grocery-card">
                <div className="grocery-index label-counter"> {index + 1} </div>
                <div className="grocery-content label-text-title">
                  {item.name}
                </div>
                {item.quantity !== null && (
                  <div className="info-design">{item.quantity}</div>
                )}
                {item.price !== null && (
                  <div className="grocery-price info-design">
                    ${item.price.toFixed(2)}
                  </div>
                )}
                {item.category !== null && (
                  <div className="info-design">{item.category}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
