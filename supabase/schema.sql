-- ─── AURA Jewellery — Full Database Schema ───────────────────────────────────
-- Paste this entire file into: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── 2. Enum ───────────────────────────────────────────────────────────────────
create type order_status as enum ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');


-- ── 3. Profiles (extends Supabase auth.users) ─────────────────────────────────
-- Supabase manages passwords + JWT; we just store extra profile fields here
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 4. Products ───────────────────────────────────────────────────────────────
create table if not exists public.products (
  id          text        primary key default gen_random_uuid()::text,
  name        text        not null,
  slug        text        not null unique,
  description text        not null,
  price       integer     not null,        -- in paise (₹3499 = 349900)
  images      text[]      not null default '{}',
  category    text        not null,        -- ring | cuff | pendant | set
  stock       integer     not null default 100,
  featured    boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ── 5. Carts ──────────────────────────────────────────────────────────────────
create table if not exists public.carts (
  id          text        primary key default gen_random_uuid()::text,
  user_id     uuid        not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.cart_items (
  id          text        primary key default gen_random_uuid()::text,
  cart_id     text        not null references public.carts(id) on delete cascade,
  product_id  text        not null references public.products(id) on delete cascade,
  quantity    integer     not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(cart_id, product_id)              -- one row per product per cart
);


-- ── 6. Orders ─────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                    text         primary key default gen_random_uuid()::text,
  user_id               uuid         not null references auth.users(id) on delete cascade,
  status                order_status not null default 'PENDING',
  total                 integer      not null,   -- in paise
  razorpay_order_id     text         unique,
  razorpay_payment_id   text,
  razorpay_signature    text,
  created_at            timestamptz  not null default now(),
  updated_at            timestamptz  not null default now()
);

create table if not exists public.order_items (
  id                text    primary key default gen_random_uuid()::text,
  order_id          text    not null references public.orders(id) on delete cascade,
  product_id        text    not null references public.products(id) on delete restrict,
  quantity          integer not null check (quantity > 0),
  price_at_purchase integer not null    -- snapshot of price at time of purchase
);


-- ── 7. Row Level Security (RLS) ───────────────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.products    enable row level security;
alter table public.carts       enable row level security;
alter table public.cart_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Products: everyone can read, only service role can write
create policy "Products are publicly readable"
  on public.products for select using (true);

-- Carts: users can only access their own cart
create policy "Users can manage own cart"
  on public.carts for all using (auth.uid() = user_id);
create policy "Users can manage own cart items"
  on public.cart_items for all using (
    cart_id in (select id from public.carts where user_id = auth.uid())
  );

-- Orders: users can only see their own orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Users can view own order items"
  on public.order_items for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );
