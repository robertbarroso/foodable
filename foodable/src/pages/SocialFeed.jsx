import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";

function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error(error);
        return;
      }

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <h1>Community</h1>
      <section className="content-container">
        <section id="post-list">
          <h2>Posts</h2>
          {posts.map((post) => {
            return (
              <div key={post.id}>
                <h3>{post.title} </h3>
                <p>{post.content}</p>
                <p> Likes: {post.likes} </p>
              </div>
            );
          })}
        </section>
        <section id="content-view">
          <h2>Content</h2>
        </section>
      </section>
    </>
  );
}

export default SocialFeed;
