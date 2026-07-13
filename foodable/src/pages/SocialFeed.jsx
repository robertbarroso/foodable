import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";

function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [selected_post, setSelectedPost] = useState(null);

  // When the page refreshes
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select(`
    *,
    author:profiles!posts_user_id_fkey (
      username
    )
  `);

      // If something goes wrong, send error
      if (error) {
        console.error(error);
        return;
      }

      setPosts(data);
      console.log(JSON.stringify(data, null, 2));
    };

    fetchPosts();
  }, []);

  function loadSelectedContent() {
    return selected_post ? (
      <div className="content-post-render">
        <h2>{selected_post.title} </h2>
        <br></br>
        <p>{selected_post.content}</p>
      </div>
    ) : (
      <div className="placeholder-social-post">
        <h3>Select a post</h3>
        <p>To see shared community posts, select a post.</p>
      </div>
    );
  }

  return (
    <>
      <section className="content-container">
        <section id="post-list">
          <h2>Community</h2>
          {posts.map((post) => {
            return (
              <div key={post.post_id}>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                  }}
                  className="social-button-posts"
                >
                  <h4>{post.title} </h4>
                  <p className="post-author-render">
                    By {post.author?.username}
                  </p>

                  <p className="likes-render"> ♥︎ {post.likes} </p>
                </button>
              </div>
            );
          })}
        </section>
        <section id="content-view">{loadSelectedContent()}</section>
      </section>
    </>
  );
}

export default SocialFeed;
