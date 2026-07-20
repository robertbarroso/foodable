import { useEffect, useState } from "react";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [selected_post, setSelectedPost] = useState(null);

  // When the page refreshes
  useEffect(() => {
    async function fetchAllSocialPosts() {
      try {
        const response = await fetch("http://localhost:5001/api/social-posts");
        const data = await response.json();

        console.log(data);

        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllSocialPosts();
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
                    <i>By {post.profiles?.username}</i>
                  </p>

                  <div className="pill-container">
                    <p className="pill-render likes-render">♥︎ {post.likes}</p>

                    <p className="pill-render tag-render">
                      {post.post_type === 1 ? "Recipe" : "Grocery"}
                    </p>
                  </div>
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
