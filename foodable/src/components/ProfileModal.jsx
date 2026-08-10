import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export default function ProfileModal({ onClose, setSelectedItem }) {
  const [profileData, setProfileData] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadFollowing() {
    const access_token = localStorage.getItem("supabase_access_token");

    const response = await fetch(
      `${API_URL}/profile/${profileData.profile.id}/following`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const data = await response.json();

    setFollowingUsers(data);
    setShowFollowing(true);
  }

  async function loadProfile(userId = null) {
    const access_token = localStorage.getItem("supabase_access_token");

    const url = userId
      ? `${API_URL}/profile/${userId}`
      : `${API_URL}/profile/me`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();
    console.log("FOLLOWING USERS:", data);
    setProfileData(data);
  }

  if (!profileData) {
    return <div>Loading Profile...</div>;
  }

  return (
    <div className="profile-modal">
      <div className="profile-card">
        <button onClick={onClose}>X</button>
        <h2>{profileData.profile.username}</h2>
        <p>Followers: {profileData.followers}</p>
        <button onClick={loadFollowing}>
          Following: {profileData.following}
        </button>
        {showFollowing && (
          <div>
            <h3>Following</h3>

            {followingUsers.map((user) => (
              <button
                key={user.followed_id}
                className="following-user-button"
                onClick={() => {
                  loadProfile(user.followed_id);
                  setShowFollowing(false);
                }}
              >
                {user.profiles.username}
              </button>
            ))}
          </div>
        )}

        <hr />
        <div className="profile-columns">
          <section>
            <h3>Recipes</h3>

            {profileData.recipePosts.map((post) => (
              <button
                key={post.post_id}
                onClick={() => {
                  setSelectedItem(post);
                  onClose();
                  console.log("PROFILE POST:", post);
                }}
              >
                {post.recipes?.title}
              </button>
            ))}
          </section>

          <section>
            <h3>Groceries</h3>

            {profileData.groceryPosts.map((post) => (
              <button
                key={post.post_id}
                onClick={() => {
                  console.log("PROFILE CLICK:", post);
                  setSelectedItem(post);
                  onClose();
                }}
              >
                {post.grocery_lists?.title}
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
