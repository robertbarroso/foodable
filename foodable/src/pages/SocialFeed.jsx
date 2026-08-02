import { useEffect, useMemo, useState } from "react";
import FeedItem from "../components/FeedItem.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

function toPostFeedItem(post) {
  console.log(post);
  const postUsername = post.profiles.username;
  const postLikes = post.likes;
  let postKind = "";
  let postTitle = "";
  const postCreated = new Date(post.created_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // If post is a 'recipe'
  if (post.recipe) {
    postTitle = post.recipe.title;
    postKind = "recipe";

    // Otherwise, if post is a 'grocery'
  } else if (post.grocery) {
    postTitle = post.grocery.title;
    postKind = "grocery";
  }

  return {
    key: `post-${post.post_id}`,
    username: postUsername,
    likes: postLikes,
    kind: postKind,
    created: postCreated,
    title: postTitle,
    original: post,
  };
}

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    async function loadCommunity() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/social-posts`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load posts");
        }

        setPosts(data);
      } catch (error) {
        console.error(error);
        setActionError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCommunity();
  }, []);

  // React optimization - useMemo, for each post that comes from 'toPostFeedItem', add to posts
  // Returns: feedItems (array);
  const feedItems = useMemo(() => {
    return posts.map(toPostFeedItem);
  }, [posts]);

  function loadSelectedContent() {
    if (!selectedItem) {
      // If there is no social post alreadt loaded, show this.
      return (
        <div className="placeholder-social-post">
          <h3>Select a post</h3>

          <p>Select a recipe or grocery post from the feed.</p>
        </div>
      );
    }
    // Display content from 'FeedItem'. 'FeedItem' will accurately display the proper content formatted.
    return <FeedItem incoming_data={selectedItem} />;
  }

  return (
    <section className="content-container">
      <section id="post-list">
        <h3>Feed</h3>
        {loading && <p className="community-message">Loading posts...</p>}
        {actionError && (
          <p className="community-message community-message--error">
            {actionError}
          </p>
        )}

        {!loading &&
          feedItems.map((item) => {
            return (
              <div key={item.key}>
                <button
                  className="social-button-posts"
                  onClick={() => setSelectedItem(item.original)}
                >
                  <h3 className="post-title-render">{item.title}</h3>
                  <section className="post-info">
                    <p className="post-author-render">By {item.username}</p>
                    <p className="post-date-render">{item.created}</p>
                  </section>
                  <div className="pill-container">
                    <p className="pill-render likes-render">♥ {item.likes}</p>

                    <p className="pill-render tag-render">
                      {item.kind === "recipe" ? "Recipe" : "Grocery"}
                    </p>
                  </div>
                  <div className="post-divider"></div>
                </button>
              </div>
            );
          })}
      </section>

      <section id="content-view">{loadSelectedContent()}</section>
    </section>
  );
}
