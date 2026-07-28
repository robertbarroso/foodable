alter table posts
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
