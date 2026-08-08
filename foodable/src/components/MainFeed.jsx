import FeedItem from "./FeedItem";
import SocialSearch from "./SocialSearch";
import { useEffect, useState } from "react";

export default function MainFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  // We need to fetch the incoming data from the backend
  useEffect(() => {
    // Await from the backend
    async function retrievePosts() {
      const postResponse = await fetch("http://localhost:5001/test/test_post/");

      const postData = await postResponse.json();

      setFeedItems(postData);
    }

    retrievePosts();
  }, []);

  // Filter posts based on search
  const filteredPosts = feedItems.filter((post) => {
    const search = searchText.toLowerCase().trim();

    // If there is no search, show everything
    if (search === "") {
      return true;
    }

    // If the post is a recipe
    if (post.recipe) {
      return post.recipe.title.toLowerCase().includes(search);
    }

    // If the post is a grocery list
    if (post.grocery) {
      return post.grocery.title.toLowerCase().includes(search);
    }

    return false;
  });

  // If there is nothing in feedItems, set to loading
  if (feedItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SocialSearch searchText={searchText} setSearchText={setSearchText} />

      <div className="feed">
        {filteredPosts.map((post) => (
          <FeedItem key={post.post_id} incoming_data={post} />
        ))}
      </div>
    </>
  );
}
