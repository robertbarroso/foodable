# Grocery List API

The React frontend calls the Express API, and only the Express server accesses
the grocery tables in Supabase.

## Setup

1. Run `docs/schema.sql` in the Supabase SQL Editor.
2. Copy `server/.env.example` to `server/.env` and add the Supabase URL and
   service-role key.
3. Copy `foodable/.env.example` to `foodable/.env`. Set `VITE_API_URL` if the
   Express API is not running at `http://localhost:5000/api`.
4. Start the Express server from `server/`, then start Vite from `foodable/`.

Never put the Supabase service-role key in a `VITE_` environment variable.

## Endpoints

All endpoints currently use the server's `fakeAuth` middleware. Each database
operation filters by that user's ID.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/groceries` | List the current user's grocery lists |
| `GET` | `/api/groceries/:listId` | Get one owned list with its items |
| `POST` | `/api/groceries` | Create a grocery list |
| `PATCH` | `/api/groceries/:listId` | Update title, visibility, or budget |
| `DELETE` | `/api/groceries/:listId` | Delete an owned list |
| `POST` | `/api/groceries/:listId/items` | Add an item to an owned list |
| `PATCH` | `/api/groceries/:listId/items/:itemId` | Update an owned list item |
| `DELETE` | `/api/groceries/:listId/items/:itemId` | Delete an owned list item |

Errors use this shape:

```json
{ "error": "Human-readable error message" }
```

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
