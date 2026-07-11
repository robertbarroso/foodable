# Grocery List — Supabase Service

The grocery list feature lives in the team frontend at `foodable/src/services/groceryLists.js` and calls Supabase directly (same pattern as `SocialFeed`).

## Setup

1. Run `docs/schema.sql` in the Supabase SQL Editor.
2. Copy `foodable/.env.example` to `foodable/.env` and add your project URL + anon key.

## Service functions

| Function | Description |
|----------|-------------|
| `listGroceryLists()` | Fetch user's lists (newest first) |
| `getGroceryList(id)` | Fetch one list with items |
| `createGroceryList({ title, budget_estimate, is_public })` | Create a list (requires auth) |
| `deleteGroceryList(id)` | Delete a list |

## Database tables

- `grocery_lists` — id, user_id, title, is_public, budget_estimate, timestamps
- `grocery_list_items` — id, list_id, name, quantity, category, price, is_purchased, timestamps

See [schema.sql](schema.sql) for full DDL.

## AI import shape (for Julian's chatbot)

```json
{
  "title": "Weekly Vegetarian — ~$80",
  "budget_estimate": 80,
  "items": [
    { "name": "Rice", "quantity": "2 lbs", "category": "Grains", "price": 3.5 }
  ]
}
```

Import will be wired once list + item creation from the chatbot is integrated.

## Page route

`/groceries` → `foodable/src/pages/GroceryList.jsx`
