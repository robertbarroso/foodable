import { useEffect, useMemo, useState } from "react";
import {
  copyPublicGroceryList,
  getPublicGroceryList,
  listPublicGroceryLists,
} from "../services/groceryLists.js";
import FeedItemTest from "../components/FeedItemTest.jsx";
import RecipePost from "../components/RecipePost.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

function formatBudget(value) {
  if (value == null) return "No budget set";
  return `$${Number(value).toFixed(2)}`;
}

function toGroceryFeedItem(list) {
  const itemCount = list.grocery_list_items?.length ?? 0;
  return {
    key: `grocery-${list.id}`,
    kind: "grocery",
    id: list.id,
    title: list.title,
    content: formatBudget(list.budget_estimate),
    likes: list.likes ?? 0,
    grocery_list_id: list.id,
    itemCount,
    budget_estimate: list.budget_estimate,
    author: "Shared grocery list",
  };
}

function toPostFeedItem(post) {
  const isGrocery = post.post_type !== 1;
  return {
    key: `post-${post.post_id}`,
    kind: isGrocery ? "grocery-post" : "recipe",
    id: post.post_id,
    post_id: post.post_id,
    title: post.title,
    content: post.content,
    likes: post.likes ?? 0,
    grocery_list_id: post.grocery_list_id ?? null,
    author: post.profiles?.username ?? "Unknown",
    post_type: post.post_type,
  };
}

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [groceryPreview, setGroceryPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [heartingKey, setHeartingKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunity() {
      setLoading(true);
      setActionError(null);

      try {
        const [postsResponse, lists] = await Promise.all([
          fetch(`${API_URL}/social-posts`).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Could not load community posts");
            }
            return data;
          }),
          listPublicGroceryLists(),
        ]);

        setPosts(postsResponse);
        setPublicLists(lists);
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
    const linkedListIds = new Set(
      posts
        .filter((post) => post.grocery_list_id)
        .map((post) => post.grocery_list_id),
    );

    const recipeAndLinkedPosts = posts
      .filter((post) => post.post_type === 1 || post.grocery_list_id)
      .map(toPostFeedItem);

    const sharedGroceryLists = publicLists
      .filter((list) => !linkedListIds.has(list.id))
      .map(toGroceryFeedItem);

    return [...sharedGroceryLists, ...recipeAndLinkedPosts];
  }, [posts, publicLists]);

  useEffect(() => {
    async function loadGroceryPreview() {
      if (!selectedItem?.grocery_list_id) {
        setGroceryPreview(null);
        return;
      }

      setPreviewLoading(true);
      setActionError(null);

      try {
        const list = await getPublicGroceryList(selectedItem.grocery_list_id);
        setGroceryPreview(list);
      } catch (error) {
        setGroceryPreview(null);
        setActionError(error.message);
      } finally {
        setPreviewLoading(false);
      }
    }

    loadGroceryPreview();
  }, [selectedItem]);

  async function handleHeart(item, event) {
    event.stopPropagation();
    setHeartingKey(item.key);
    setActionError(null);
    setActionMessage(null);

    try {
      if (item.kind === "grocery") {
        const copiedList = await copyPublicGroceryList(item.grocery_list_id);
        setActionMessage(`Saved "${copiedList.title}" to your grocery lists.`);
        return;
      }

      const response = await fetch(
        `${API_URL}/social-posts/${item.post_id}/heart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not heart this post");
      }

      setPosts((current) =>
        current.map((entry) =>
          entry.post_id === item.post_id ? { ...entry, ...data.post } : entry,
        ),
      );

      if (selectedItem?.post_id === item.post_id) {
        setSelectedItem((current) => ({
          ...current,
          likes: data.post?.likes ?? current.likes,
          grocery_list_id:
            data.post?.grocery_list_id ?? current.grocery_list_id,
        }));
      }

      if (data.alreadyHearted) {
        setActionMessage(
          item.grocery_list_id
            ? "You already saved this grocery list."
            : "You already hearted this post.",
        );
      } else if (data.copiedList) {
        setActionMessage(
          `Saved "${data.copiedList.title}" to your grocery lists.`,
        );
      } else {
        setActionMessage("Thanks for the heart!");
      }
    } catch (error) {
      setActionError(error.message);
    } finally {
      setHeartingKey(null);
    }
  }

  function loadSelectedContent() {
    if (!selectedItem) {
      return (
        <div className="placeholder-social-post">
          <h3>Select a post</h3>
          <p>Shared grocery lists and recipes appear here.</p>
        </div>
      );
    }

    const isGrocery = selectedItem.kind !== "recipe";

    return (
      <div className="content-post-render">
        <h2>{selectedItem.title}</h2>
        <p className="post-author-render">
          <i>By {selectedItem.author}</i>
        </p>
        <p>{selectedItem.content}</p>

        {isGrocery && selectedItem.grocery_list_id && (
          <div className="community-grocery-preview">
            <h3>Grocery list preview</h3>
            {previewLoading && <p>Loading list items...</p>}
            {!previewLoading && groceryPreview && (
              <>
                <p>
                  {(groceryPreview.grocery_list_items ?? []).length} items ·{" "}
                  {formatBudget(groceryPreview.budget_estimate)}
                </p>
                <ul className="community-grocery-preview__items">
                  {(groceryPreview.grocery_list_items ?? []).length === 0 ? (
                    <li>This shared list has no items yet.</li>
                  ) : (
                    (groceryPreview.grocery_list_items ?? []).map((item) => (
                      <li key={item.id}>
                        {item.name}
                        {item.quantity ? ` (${item.quantity})` : ""}
                      </li>
                    ))
                  )}
                </ul>
                <p className="community-grocery-preview__hint">
                  Heart this list to save a copy to your grocery lists.
                </p>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="community-heart-button"
          onClick={(event) => handleHeart(selectedItem, event)}
          disabled={heartingKey === selectedItem.key}
        >
          {heartingKey === selectedItem.key
            ? "Saving..."
            : `♥︎ Heart${isGrocery ? " & save list" : ""}`}
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="content-container">
        <section id="post-list">
          <h2>Community</h2>
          {loading && <p className="community-message">Loading community...</p>}
          {actionError && (
            <p className="community-message community-message--error">
              {actionError}
            </p>
          )}
          {actionMessage && (
            <p className="community-message">{actionMessage}</p>
          )}
          {!loading && feedItems.length === 0 && (
            <p className="community-message">
              No shared posts yet. Mark a grocery list as Public in Settings to
              share it here.
            </p>
          )}
          {feedItems.map((item) => {
            return (
              <div key={item.key}>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setActionMessage(null);
                    setActionError(null);
                  }}
                  className="social-button-posts"
                >
                  <h4>{item.title}</h4>
                  <p className="post-author-render">
                    <i>By {item.author}</i>
                  </p>

                  <div className="pill-container">
                    <button
                      type="button"
                      className="pill-render likes-render community-heart-pill"
                      onClick={(event) => handleHeart(item, event)}
                      disabled={heartingKey === item.key}
                      aria-label={`Heart ${item.title}`}
                    >
                      ♥︎ {item.likes}
                    </button>

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
      <FeedItemTest />
    </>
  );
}
