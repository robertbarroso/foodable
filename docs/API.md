# Grocery List API

The React frontend calls the Express API, and only the Express server accesses
the grocery tables in Supabase.

## Setup

1. Run `docs/schema.sql` in the Supabase SQL Editor.
2. If `posts` already exists, also run
   `docs/migrations/community_grocery_share.sql` (adds `posts.grocery_list_id`
   and `post_likes`).
3. Copy `server/.env.example` to `server/.env` and add the Supabase URL and
   service-role key.
4. Copy `foodable/.env.example` to `foodable/.env`. Set `VITE_API_URL` if the
   Express API is not running at `http://localhost:5001/api`.
5. Start the Express server from `server/`, then start Vite from `foodable/`.

Never put the Supabase service-role key in a `VITE_` environment variable.

## Endpoints

All endpoints currently use the server's `fakeAuth` middleware. Owned-list
operations filter by that user's ID. Public read endpoints return any list with
`is_public = true` (still behind `fakeAuth` for now).

**Product rule:** users copy/save shared grocery lists only from Community by
hearting. Marking a list Public in Grocery Settings makes it appear on
Community via `GET /api/groceries/public`. After
`docs/migrations/community_grocery_share.sql` is applied, visibility changes
also create/remove a linked Community `posts` row for likes tracking.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/groceries` | List the current user's grocery lists |
| `GET` | `/api/groceries/public` | List all public grocery lists |
| `GET` | `/api/groceries/public/:listId` | Get one public list with its items |
| `POST` | `/api/groceries/public/:listId/copy` | Copy a public list (used by Community heart) |
| `GET` | `/api/groceries/:listId` | Get one owned list with its items |
| `POST` | `/api/groceries` | Create a grocery list |
| `PATCH` | `/api/groceries/:listId` | Update title, visibility, or budget |
| `DELETE` | `/api/groceries/:listId` | Delete an owned list |
| `POST` | `/api/groceries/:listId/items` | Add an item to an owned list |
| `PATCH` | `/api/groceries/:listId/items/:itemId` | Update an owned list item |
| `DELETE` | `/api/groceries/:listId/items/:itemId` | Delete an owned list item |
| `GET` | `/api/social-posts` | List Community posts |
| `POST` | `/api/social-posts/:postId/heart` | Heart a post; grocery posts also copy the list once per user |

Heart response shape:

```json
{
  "post": { "post_id": 1, "likes": 26, "grocery_list_id": "..." },
  "copiedList": { "id": "...", "title": "Copy of Weekly" },
  "alreadyHearted": false
}
```

Errors use this shape:

```json
{ "error": "Human-readable error message" }
```

## Database tables

- `grocery_lists` — id, user_id, title, is_public, budget_estimate, timestamps
- `grocery_list_items` — id, list_id, name, quantity, category, price, is_purchased, timestamps
- `posts.grocery_list_id` — optional link from a Community grocery post to a list
- `post_likes` — one heart per user per post

See [schema.sql](schema.sql) and [migrations/community_grocery_share.sql](migrations/community_grocery_share.sql).

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

## Page routes

- `/groceries` → `foodable/src/pages/GroceryList.jsx` (Settings → Public shares the list)
- Community → `foodable/src/pages/SocialFeed.jsx` (shows shared groceries + heart to save)
