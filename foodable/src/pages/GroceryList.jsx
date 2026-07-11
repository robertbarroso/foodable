import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createGroceryList,
  createGroceryListItem,
  deleteGroceryList,
  getGroceryList,
  listGroceryLists,
  updateGroceryListItem,
} from "../services/groceryLists.js";
import "./GroceryList.css";

function formatBudget(value) {
  if (value == null) return "No budget set";
  return `$${Number(value).toFixed(2)}`;
}

function countRemaining(items = []) {
  return items.filter((item) => !item.is_purchased).length;
}

function groupItemsByCategory(items = []) {
  const groups = new Map();

  for (const item of items) {
    const category = item.category?.trim() || "Other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(item);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    })
    .map(([category, categoryItems]) => ({
      category,
      items: categoryItems.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function GroceryList() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemError, setItemError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [quickAddName, setQuickAddName] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPurchased, setShowPurchased] = useState(true);

  const loadLists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listGroceryLists();
      setLists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSelectedList = useCallback(async (listId) => {
    const list = await getGroceryList(listId);
    setSelectedList(list);
    return list;
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const items = selectedList?.grocery_list_items ?? [];
  const toBuy = useMemo(() => items.filter((item) => !item.is_purchased), [items]);
  const purchased = useMemo(() => items.filter((item) => item.is_purchased), [items]);
  const toBuyGroups = useMemo(() => groupItemsByCategory(toBuy), [toBuy]);

  async function handleSelectList(listId) {
    setError(null);
    setItemError(null);
    setConfirmDelete(false);
    setQuickAddName("");

    try {
      await refreshSelectedList(listId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateList(event) {
    event?.preventDefault();

    const title = newListTitle.trim();
    if (!title) {
      setError("List name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const created = await createGroceryList({ title });
      setNewListTitle("");
      setIsCreating(false);
      await loadLists();
      setSelectedList({ ...created, grocery_list_items: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function handleCancelCreate() {
    setIsCreating(false);
    setNewListTitle("");
    setError(null);
  }

  async function handleDeleteList() {
    if (!selectedList) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setError(null);

    try {
      await deleteGroceryList(selectedList.id);
      setSelectedList(null);
      setConfirmDelete(false);
      await loadLists();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleQuickAdd(event) {
    event.preventDefault();

    if (!selectedList) return;

    const name = quickAddName.trim();
    if (!name) {
      setItemError("Type an item name to add it");
      return;
    }

    setAddingItem(true);
    setItemError(null);

    try {
      await createGroceryListItem(selectedList.id, { name });
      setQuickAddName("");
      await refreshSelectedList(selectedList.id);
      await loadLists();
    } catch (err) {
      setItemError(err.message);
    } finally {
      setAddingItem(false);
    }
  }

  async function handleTogglePurchased(item) {
    if (!selectedList) return;

    setItemError(null);

    try {
      await updateGroceryListItem(item.id, { is_purchased: !item.is_purchased });
      await refreshSelectedList(selectedList.id);
      await loadLists();
    } catch (err) {
      setItemError(err.message);
    }
  }

  function renderItemRow(item) {
    return (
      <li key={item.id}>
        <button
          type="button"
          className={`grocery-item-row${item.is_purchased ? " grocery-item-row--done" : ""}`}
          onClick={() => handleTogglePurchased(item)}
        >
          <span className="grocery-item-row__check" aria-hidden="true">
            {item.is_purchased ? "✓" : ""}
          </span>
          <span className="grocery-item-row__body">
            <span className="grocery-item-row__name">{item.name}</span>
            {item.quantity && <span className="grocery-item-row__qty">{item.quantity}</span>}
          </span>
        </button>
      </li>
    );
  }

  return (
    <section className="grocery-page">
      <aside className="grocery-sidebar">
        <div className="grocery-sidebar__header">
          <h2>Lists</h2>
          <button
            type="button"
            className="grocery-button grocery-button--primary grocery-button--compact"
            onClick={() => setIsCreating(true)}
          >
            + New
          </button>
        </div>

        {loading && <p className="grocery-message">Loading lists...</p>}
        {error && !isCreating && <p className="grocery-message grocery-message--error">{error}</p>}

        {!loading && lists.length === 0 && (
          <p className="grocery-message">No lists yet. Tap + New to start.</p>
        )}

        <ul className="grocery-list-menu">
          {lists.map((list) => {
            const remaining = countRemaining(list.grocery_list_items);
            return (
              <li key={list.id}>
                <button
                  type="button"
                  className={`grocery-list-menu__item${
                    selectedList?.id === list.id ? " grocery-list-menu__item--active" : ""
                  }`}
                  onClick={() => handleSelectList(list.id)}
                >
                  <span className="grocery-list-menu__row">
                    <span className="grocery-list-menu__title">{list.title}</span>
                    {remaining > 0 && <span className="grocery-list-menu__badge">{remaining}</span>}
                  </span>
                  <span className="grocery-list-menu__meta">
                    {list.is_public ? "Shared" : "Private"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="grocery-content">
        {!selectedList ? (
          <div className="grocery-empty">
            <h2>Pick a list</h2>
            <p>Add items as you think of them — like Our Groceries.</p>
          </div>
        ) : (
          <>
            <header className="grocery-content__header">
              <div>
                <h2>{selectedList.title}</h2>
                <p className="grocery-content__subtitle">
                  {toBuy.length} to get · {purchased.length} in cart · {formatBudget(selectedList.budget_estimate)}
                </p>
              </div>
              <div className="grocery-content__actions">
                {confirmDelete ? (
                  <>
                    <span className="grocery-confirm-text">Delete list?</span>
                    <button type="button" className="grocery-button grocery-button--danger" onClick={handleDeleteList}>
                      Delete
                    </button>
                    <button type="button" className="grocery-button" onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="grocery-button grocery-button--danger" onClick={handleDeleteList}>
                    Delete
                  </button>
                )}
              </div>
            </header>

            <form className="grocery-quick-add" onSubmit={handleQuickAdd}>
              <input
                type="text"
                className="grocery-quick-add__input"
                placeholder="Add an item..."
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="grocery-button grocery-button--primary" disabled={addingItem}>
                {addingItem ? "..." : "Add"}
              </button>
            </form>

            {itemError && <p className="grocery-message grocery-message--error">{itemError}</p>}

            <div className="grocery-items">
              {items.length === 0 ? (
                <p className="grocery-message grocery-message--center">
                  Your list is empty. Type above and press Add.
                </p>
              ) : (
                <>
                  {toBuy.length === 0 ? (
                    <p className="grocery-message grocery-message--center">All done! Everything is in your cart.</p>
                  ) : (
                    toBuyGroups.map((group) => (
                      <section key={group.category} className="grocery-category">
                        <h3 className="grocery-category__title">{group.category}</h3>
                        <ul className="grocery-items__list">{group.items.map(renderItemRow)}</ul>
                      </section>
                    ))
                  )}

                  {purchased.length > 0 && (
                    <section className="grocery-category grocery-category--purchased">
                      <button
                        type="button"
                        className="grocery-category__toggle"
                        onClick={() => setShowPurchased((value) => !value)}
                      >
                        In cart ({purchased.length}) {showPurchased ? "▾" : "▸"}
                      </button>
                      {showPurchased && (
                        <ul className="grocery-items__list">{purchased.map(renderItemRow)}</ul>
                      )}
                    </section>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {isCreating && (
        <div className="grocery-modal-backdrop" onClick={handleCancelCreate}>
          <div
            className="grocery-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="new-list-title"
          >
            <h3 id="new-list-title" className="grocery-modal__title">New list</h3>
            <p className="grocery-modal__hint">Name your shopping list — e.g. Costco, Weekly, Party</p>
            <form className="grocery-modal__form" onSubmit={handleCreateList}>
              <input
                type="text"
                className="grocery-modal__input"
                placeholder="List name"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                autoFocus
              />
              {error && <p className="grocery-message grocery-message--error">{error}</p>}
              <div className="grocery-modal__actions">
                <button type="button" className="grocery-button" onClick={handleCancelCreate} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="grocery-button grocery-button--primary" disabled={creating}>
                  {creating ? "Creating..." : "Create list"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default GroceryList;
