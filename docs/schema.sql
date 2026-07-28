-- Run in Supabase SQL Editor for the Foodable grocery list feature.

create table if not exists grocery_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  is_public boolean not null default false,
  budget_estimate numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists grocery_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references grocery_lists(id) on delete cascade,
  name text not null,
  quantity text,
  category text,
  price numeric(10, 2),
  is_purchased boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists grocery_lists_user_id_idx on grocery_lists(user_id);
create index if not exists grocery_list_items_list_id_idx on grocery_list_items(list_id);

-- Keep updated_at current on row changes.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists grocery_lists_set_updated_at on grocery_lists;
create trigger grocery_lists_set_updated_at
before update on grocery_lists
for each row execute function set_updated_at();

drop trigger if exists grocery_list_items_set_updated_at on grocery_list_items;
create trigger grocery_list_items_set_updated_at
before update on grocery_list_items
for each row execute function set_updated_at();

-- TODO: replace dev policies with auth.uid() checks once Supabase Auth is wired up.
alter table grocery_lists enable row level security;
alter table grocery_list_items enable row level security;

create policy "dev allow all on grocery_lists"
  on grocery_lists for all
  using (true) with check (true);

create policy "dev allow all on grocery_list_items"
  on grocery_list_items for all
  using (true) with check (true);

-- Community grocery share: link posts to grocery lists + one heart per user.
alter table if exists posts
  add column if not exists grocery_list_id uuid references grocery_lists(id) on delete cascade;

create unique index if not exists posts_grocery_list_id_uidx
  on posts (grocery_list_id)
  where grocery_list_id is not null;

create table if not exists post_likes (
  user_id uuid not null,
  post_id bigint not null references posts(post_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table post_likes enable row level security;

drop policy if exists "dev allow all on post_likes" on post_likes;
create policy "dev allow all on post_likes"
  on post_likes for all
  using (true) with check (true);
