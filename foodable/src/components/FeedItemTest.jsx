import FeedItem from "./FeedItem";
import { useEffect, useState } from "react";

export default function FeedItemTest() {
  const [feedItem, setFeedItem] = useState(null);
  // If there is nothign in feedItem, set to loading

  // We need to fetch the incoming data from the backend
  useEffect(() => {
    // Await from the backend
    async function retrieveTestPost() {
      const postResponse = await fetch("http://localhost:5001/test/test_post/");

      const postData = await postResponse.json();

      setFeedItem(postData);
    }

    retrieveTestPost();
  }, []);
  if (!feedItem) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <FeedItem incoming_data={feedItem} />
    </>
  );
}
