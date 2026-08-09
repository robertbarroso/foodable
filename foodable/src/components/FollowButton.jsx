import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function FollowButton({ current_user_id, followed_user_id }) {
  const [isFollowing, setIsFollowing] = useState(false);

  // If the user id and followed id is the same, return null.
  if (current_user_id === followed_user_id) {
    return null;
  }

  // Handling the follow action
  async function handleFollow() {
    console.log(current_user_id);
    if (!current_user_id) {
      toast.error("Please sign in to follow.");
      return;
    }

    const access_token = localStorage.getItem("supabase_access_token");
    console.log("TOKEN:", access_token);

    if (!access_token) {
      console.error("ERROR: Missing token!");
      toast.error("Missing sign in token!");
      return;
    }
    try {
      // POST :: /api/follow
      // Sending the follow data to /api/follow
      const response = await fetch(`${API_URL}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          followed_id: followed_user_id,
        }),
      });

      if (!response.ok) {
        throw new Error("ERROR: Failed to follow the user");
      }

      setIsFollowing(true);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <button onClick={handleFollow}>
        {isFollowing ? "Following" : "Follow"}
      </button>
    </>
  );
}
