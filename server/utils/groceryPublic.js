import supabase from "../supabase.js";

export async function findPublicList(listId) {
  return supabase
    .from("grocery_lists")
    .select(
      `
      id,
      user_id,
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
    `,
    )
    .eq("id", listId)
    .eq("is_public", true)
    .maybeSingle();
}

export async function copyPublicListForUser(listId, userId) {
  const { data: sourceList, error: sourceError } = await findPublicList(listId);

  if (sourceError) {
    return { error: sourceError, status: 500 };
  }

  if (!sourceList) {
    return { error: { message: "Public grocery list not found" }, status: 404 };
  }

  const copyTitle = sourceList.title.startsWith("Copy of ")
    ? sourceList.title
    : `Copy of ${sourceList.title}`;

  const { data: newList, error: createError } = await supabase
    .from("grocery_lists")
    .insert({
      user_id: userId,
      title: copyTitle,
      is_public: false,
      budget_estimate: sourceList.budget_estimate,
    })
    .select("id, title, is_public, budget_estimate, created_at, updated_at")
    .single();

  if (createError) {
    return { error: createError, status: 500 };
  }

  const sourceItems = sourceList.grocery_list_items ?? [];

  if (sourceItems.length > 0) {
    const { error: itemsError } = await supabase
      .from("grocery_list_items")
      .insert(
        sourceItems.map((item) => ({
          list_id: newList.id,
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          price: item.price,
          is_purchased: false,
        })),
      );

    if (itemsError) {
      await supabase.from("grocery_lists").delete().eq("id", newList.id);
      return { error: itemsError, status: 500 };
    }
  }

  const { data: copiedList, error: loadError } = await supabase
    .from("grocery_lists")
    .select(
      `
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
    `,
    )
    .eq("id", newList.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (loadError) {
    return { error: loadError, status: 500 };
  }

  return { data: copiedList, status: 201 };
}

export async function publishGroceryListToCommunity(list, userId) {
  const payload = {
    user_id: userId,
    post_type: 2,
    grocery_list_id: list.id,
    likes: 0,
  };

  const { data: existing, error: findError } = await supabase
    .from("posts")
    .select("post_id, likes")
    .eq("grocery_list_id", list.id)
    .maybeSingle();

  if (findError) {
    return { error: findError };
  }

  if (existing) {
    const { data, error } = await supabase
      .from("posts")
      .update({
        user_id: payload.user_id,
        post_type: payload.post_type,
      })
      .eq("post_id", existing.post_id)
      .select("*")
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select("*")
    .single();
  return { data, error };
}

export async function unpublishGroceryListFromCommunity(listId) {
  return supabase.from("posts").delete().eq("grocery_list_id", listId);
}
