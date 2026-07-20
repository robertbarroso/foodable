# foodable

> Foodable is a web application designed to help users discover healthy, affordable food options from local stores. The platform leverages large language models (LLMs) to provide detailed nutritional information on products, assisting users in making informed choices. Users can create and manage personal grocery lists, find and share recipes with the community, and even use an AI-powered chatbot to generate grocery lists automatically.

## Repository layout

```
foodable/                 # repo root
├── foodable/             # React + Vite app (team frontend)
│   ├── src/
│   │   ├── components/   # NavBar, AppRouter, etc.
│   │   ├── pages/        # GroceryList, SocialFeed, AIChatbot, RecipeList
│   │   └── services/     # supabase.js, groceryLists.js
│   └── package.json
├── docs/                 # Schema and feature docs
├── README.md
└── STANDARDS.md
```

## Quick start

### 1. Install dependencies

Requires **Node.js 20+** (Vite 8).

```bash
cd foodable
npm install

cd ../server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
cd ../server
cp .env.example .env
```

Add the frontend configuration to `foodable/.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_API_URL=http://localhost:5000/api
```

Add server-only Supabase credentials to `server/.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

Never expose the service-role key in a `VITE_` variable.

### 3. Create database tables

Run `docs/schema.sql` in the [Supabase SQL Editor](https://supabase.com/dashboard).

### 4. Run the app

```bash
cd server
npm run dev
```

In a second terminal:

```bash
cd foodable
npm run dev
```

Open http://localhost:5173 — use `/groceries` for the grocery list page.

## Grocery list docs

- Service + setup: [docs/API.md](docs/API.md)
- Database schema: [docs/schema.sql](docs/schema.sql)

## Objectives

The primary objective of Foodable is to simplify the process of finding healthy, affordable foods while leveraging the power of AI to assist users in making better dietary choices. It aims to provide users with a convenient platform where they can:

- Easily discover nutritious and budget-friendly products in their local area.
- Access real-time nutritional information powered by AI for informed decision-making.
- Create, customize, and manage grocery lists that are aligned with their health goals and shopping preferences.
- Share recipes and grocery lists within a community, fostering a collaborative and educational environment around food and nutrition.
- Integrate AI to automate routine tasks, like generating grocery lists, reducing the time spent on meal planning and shopping.
- Build a social network where users can engage with others through public profiles, sharing, following, and interacting with like-minded individuals.

## Motivations

The motivations for developing Foodable stem from the growing need for healthier eating habits and the challenges people face in finding nutritious, cost-effective options. Rising food prices, complex nutritional labels, and time constraints make it difficult for individuals and families to maintain balanced diets.
