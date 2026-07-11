import { supabase } from "./supabase.js";

// Temporary dev fallback until Supabase Auth is added.
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? DEV_USER_ID;
}

export async function listGroceryLists() {
  const userId = await getCurrentUserId();

  let query = supabase
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
    .order("updated_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getGroceryList(listId) {
  const userId = await getCurrentUserId();

  let query = supabase
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
    .eq("id", listId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grocery list not found");
  }

  return data;
}

export async function createGroceryList({ title, budget_estimate = null, is_public = false }) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("grocery_lists")
    .insert({
      user_id: userId,
      title,
      is_public,
      budget_estimate,
    })
    .select("id, title, is_public, budget_estimate, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createGroceryListItem(listId, { name, quantity = null, category = null, price = null }) {
  const { data, error } = await supabase
    .from("grocery_list_items")
    .insert({
      list_id: listId,
      name,
      quantity,
      category,
      price,
    })
    .select("id, name, quantity, category, price, is_purchased, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateGroceryListItem(itemId, updates) {
  const { data, error } = await supabase
    .from("grocery_list_items")
    .update(updates)
    .eq("id", itemId)
    .select("id, name, quantity, category, price, is_purchased, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteGroceryList(listId) {
  const userId = await getCurrentUserId();

  let query = supabase
    .from("grocery_lists")
    .delete()
    .eq("id", listId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.select("id").maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grocery list not found");
  }

  return data;
}
