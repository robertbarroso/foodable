import express from "express";
import supabase from "../supabase.js";
import fakeAuth from "../utils/fakeAuth.js";

const groceriesRouter = express.Router();

groceriesRouter.use(fakeAuth);

function normalizeNullableText(value) {
  if (value == null || value === "") return null;
  return String(value).trim() || null;
}

function normalizeNullablePrice(value) {
  if (value == null || value === "") return null;

  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : NaN;
}

async function findOwnedList(listId, userId) {
  return supabase
    .from("grocery_lists")
    .select("id")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();
}

async function requireOwnedList(req, res) {
  const { data: list, error } = await findOwnedList(req.params.listId, req.user.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return null;
  }

  if (!list) {
    res.status(404).json({ error: "Grocery list not found" });
    return null;
  }

  return list;
}

groceriesRouter.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("grocery_lists")
    .select(`
      id,
      title,
      is_public,
      budget_estimate,
      created_at,
      updated_at,
      grocery_list_items ( is_purchased )
    `)
    .eq("user_id", req.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

groceriesRouter.get("/:listId", async (req, res) => {
  const { data, error } = await supabase
    .from("grocery_lists")
    .select(`
      id,
      title,
      is_public,
      budget_estimate,
      created_at,
      updated_at,
      grocery_list_items (
        id,
        name,
        quantity,
        category,
        price,
        is_purchased,
        created_at,
        updated_at
      )
    `)
    .eq("id", req.params.listId)
    .eq("user_id", req.user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Grocery list not found" });
  }

  return res.json(data);
});

groceriesRouter.post("/", async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const budgetEstimate = normalizeNullablePrice(req.body.budget_estimate);
  const isPublic = req.body.is_public ?? false;

  if (!title) {
    return res.status(400).json({ error: "List name is required" });
  }

  if (Number.isNaN(budgetEstimate)) {
    return res.status(400).json({ error: "Budget estimate must be a non-negative number" });
  }

  if (typeof isPublic !== "boolean") {
    return res.status(400).json({ error: "is_public must be a boolean" });
  }

  const { data, error } = await supabase
    .from("grocery_lists")
    .insert({
      user_id: req.user.id,
      title,
      is_public: isPublic,
      budget_estimate: budgetEstimate,
    })
    .select("id, title, is_public, budget_estimate, created_at, updated_at")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

groceriesRouter.patch("/:listId", async (req, res) => {
  const updates = {};

  if ("title" in req.body) {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      return res.status(400).json({ error: "List name is required" });
    }
    updates.title = title;
  }

  if ("is_public" in req.body) {
    if (typeof req.body.is_public !== "boolean") {
      return res.status(400).json({ error: "is_public must be a boolean" });
    }
    updates.is_public = req.body.is_public;
  }

  if ("budget_estimate" in req.body) {
    const budgetEstimate = normalizeNullablePrice(req.body.budget_estimate);
    if (Number.isNaN(budgetEstimate)) {
      return res.status(400).json({ error: "Budget estimate must be a non-negative number" });
    }
    updates.budget_estimate = budgetEstimate;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid list fields were provided" });
  }

  const { data, error } = await supabase
    .from("grocery_lists")
    .update(updates)
    .eq("id", req.params.listId)
    .eq("user_id", req.user.id)
    .select("id, title, is_public, budget_estimate, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Grocery list not found" });
  }

  return res.json(data);
});

groceriesRouter.delete("/:listId", async (req, res) => {
  const { data, error } = await supabase
    .from("grocery_lists")
    .delete()
    .eq("id", req.params.listId)
    .eq("user_id", req.user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Grocery list not found" });
  }

  return res.json(data);
});

groceriesRouter.post("/:listId/items", async (req, res) => {
  if (!(await requireOwnedList(req, res))) return;

  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const price = normalizeNullablePrice(req.body.price);

  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }

  if (Number.isNaN(price)) {
    return res.status(400).json({ error: "Price must be a non-negative number" });
  }

  const { data, error } = await supabase
    .from("grocery_list_items")
    .insert({
      list_id: req.params.listId,
      name,
      quantity: normalizeNullableText(req.body.quantity),
      category: normalizeNullableText(req.body.category),
      price,
    })
    .select("id, name, quantity, category, price, is_purchased, created_at, updated_at")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

groceriesRouter.patch("/:listId/items/:itemId", async (req, res) => {
  if (!(await requireOwnedList(req, res))) return;

  const updates = {};

  if ("name" in req.body) {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      return res.status(400).json({ error: "Item name is required" });
    }
    updates.name = name;
  }

  if ("quantity" in req.body) {
    updates.quantity = normalizeNullableText(req.body.quantity);
  }

  if ("category" in req.body) {
    updates.category = normalizeNullableText(req.body.category);
  }

  if ("price" in req.body) {
    const price = normalizeNullablePrice(req.body.price);
    if (Number.isNaN(price)) {
      return res.status(400).json({ error: "Price must be a non-negative number" });
    }
    updates.price = price;
  }

  if ("is_purchased" in req.body) {
    if (typeof req.body.is_purchased !== "boolean") {
      return res.status(400).json({ error: "is_purchased must be a boolean" });
    }
    updates.is_purchased = req.body.is_purchased;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid item fields were provided" });
  }

  const { data, error } = await supabase
    .from("grocery_list_items")
    .update(updates)
    .eq("id", req.params.itemId)
    .eq("list_id", req.params.listId)
    .select("id, name, quantity, category, price, is_purchased, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Grocery list item not found" });
  }

  return res.json(data);
});

groceriesRouter.delete("/:listId/items/:itemId", async (req, res) => {
  if (!(await requireOwnedList(req, res))) return;

  const { data, error } = await supabase
    .from("grocery_list_items")
    .delete()
    .eq("id", req.params.itemId)
    .eq("list_id", req.params.listId)
    .select("id")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Grocery list item not found" });
  }

  return res.json(data);
});

export default groceriesRouter;