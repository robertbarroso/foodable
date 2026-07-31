import { useEffect, useMemo, useState } from "react";
import FeedItem from "../components/FeedItem.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

function toPostFeedItem(post) {
  const isGrocery = post.post_type !== 1;

  return {
    ...post,

    key: `post-${post.post_id}`,
    id: post.post_id,

    kind: isGrocery ? "grocery-post" : "recipe",

    author: post.profiles?.username ?? "Unknown",
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

  const feedItems = useMemo(() => {
    return posts.map(toPostFeedItem);
  }, [posts]);

  function loadSelectedContent() {
    if (!selectedItem) {
      return (
        <div className="placeholder-social-post">
          <h3>Select a post</h3>

          <p>Select a recipe or grocery post from the feed.</p>
        </div>
      );
    }

    return <FeedItem incoming_data={selectedItem} />;
  }

  return (
    <section className="content-container">
      <section id="post-list">
        <h2>Community</h2>

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
                  onClick={() => setSelectedItem(item)}
                >
                  <h4>{item.title}</h4>

                  <p className="post-author-render">
                    <i>By {item.author}</i>
                  </p>

                  <div className="pill-container">
                    <p className="pill-render likes-render">♥ {item.likes}</p>

                    <p className="pill-render tag-render">
                      {item.kind === "recipe" ? "Recipe" : "Grocery"}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
      </section>

      <section id="content-view">{loadSelectedContent()}</section>
    </section>
  );
}
