import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function FollowButton({ current_user_id, followed_user_id }) {
  const [isFollowing, setIsFollowing] = useState(false);

  // If the user id and followed id is the same, return null.
  if (current_user_id === followed_user_id) {
    return null;
  }

  async function checkFollowStatus() {
    const access_token = localStorage.getItem("supabase_access_token");

    const response = await fetch(
      `${API_URL}/follow/check/${followed_user_id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const data = await response.json();

    setIsFollowing(data.isFollowing);
  }

  useEffect(() => {
    if (current_user_id) {
      checkFollowStatus();
    }
  }, [current_user_id, followed_user_id]);

  // Handling the follow action
  // Handling the follow action
  async function handleFollow() {
    console.log(current_user_id);

    if (!current_user_id) {
      toast.error("Please sign in to follow.");
      return;
    }

    const access_token = localStorage.getItem("supabase_access_token");

    if (!access_token) {
      console.error("ERROR: Missing token!");
      toast.error("Missing sign in token!");
      return;
    }

    try {
      // User is already following -> UNFOLLOW
      if (isFollowing) {
        const response = await fetch(`${API_URL}/follow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            followed_id: followed_user_id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow user");
        }

        setIsFollowing(false);
        toast.success("Unfollowed user!");

        return;
      }

      // User is not following -> FOLLOW
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
        throw new Error("Failed to follow user");
      }

      setIsFollowing(true);
      toast.success("User followed!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to complete follow action.");
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
