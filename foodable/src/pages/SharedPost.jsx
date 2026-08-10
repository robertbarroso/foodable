import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FeedItem from "../components/FeedItem";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function SharedPostPage() {
  const { postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  async function loadPost() {
    try {
      const response = await fetch(`${API_URL}/social-posts/${postId}`);

      const data = await response.json();

      setPostData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!postData) {
    return <p>Post not found.</p>;
  }

  return (
    <section className="shared-post-container content-container">
      <FeedItem incoming_data={postData} />
    </section>
  );
}
