-- =====================================================
-- BikeStore Pro - Supabase SQL Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- BIKES TABLE
-- =====================================================
create table public.bikes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null check (price > 0),
  image_url text not null,
  category text not null check (category in ('mountain', 'road', 'urban', 'electric')),
  in_stock boolean default true,
  frame text not null,
  wheels text not null,
  gears text not null,
  brakes text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bikes_updated_at
  before update on public.bikes
  for each row execute procedure public.update_updated_at();

-- =====================================================
-- ORDERS TABLE
-- =====================================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered')),
  total numeric(10,2) not null,
  created_at timestamptz default now()
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  bike_id uuid references public.bikes(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null
);

-- =====================================================
-- FAVORITES TABLE
-- =====================================================
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  bike_id uuid references public.bikes(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, bike_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Profiles: users can read own, admins can read all
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Bikes: anyone can read, only admins can insert/update/delete
alter table public.bikes enable row level security;

create policy "Anyone can view bikes"
  on public.bikes for select
  using (true);

create policy "Admins can insert bikes"
  on public.bikes for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update bikes"
  on public.bikes for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete bikes"
  on public.bikes for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders: users see own orders, admins see all
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Order items: follow order access
alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can insert order items"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

-- Favorites: users manage own
alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- =====================================================
-- SEED DATA (sample bikes)
-- =====================================================
insert into public.bikes (name, description, price, image_url, category, in_stock, frame, wheels, gears, brakes) values
  ('Trail Pro 3000', 'Conquer any trail with confidence. Full-suspension aluminum frame built for aggressive mountain riding.', 1899.99, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&h=400&fit=crop', 'mountain', true, 'Aluminum Full Suspension', '29" Tubeless Ready', 'Shimano Deore 12-speed', 'Hydraulic Disc Brakes'),
  ('Summit X', 'Built for extreme downhill and enduro riding. Carbon frame with 170mm travel.', 3499.99, 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&h=400&fit=crop', 'mountain', true, 'Carbon Fiber Full Suspension', '27.5" DH Ready', 'SRAM GX Eagle 12-speed', 'SRAM Code RSC 4-piston'),
  ('Aero Speed R7', 'Designed for competitive road cycling. Aerodynamic carbon frame for maximum speed.', 2799.99, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop', 'road', true, 'Aero Carbon Monocoque', '700c Carbon Clincher', 'Shimano Ultegra Di2', 'Shimano Ultegra Hydraulic Disc'),
  ('Endurance Elite', 'Perfect companion for long-distance rides. Comfortable geometry with compliance.', 2199.99, 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=400&fit=crop', 'road', true, 'Carbon Endurance Geometry', '700c Alloy Tubeless', 'Shimano 105 R7000 22-speed', 'Shimano 105 Hydraulic Disc'),
  ('City Glide', 'Navigate the city in style. Lightweight with integrated lights and fenders.', 899.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 'urban', true, 'Lightweight Aluminum Step-Through', '700c Puncture-Resistant', 'Shimano Nexus 8-speed Internal', 'Tektro Hydraulic Disc'),
  ('Commuter Pro', 'Ultimate commuter with belt drive and internal hub for zero maintenance.', 1299.99, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop', 'urban', true, 'Chromoly Steel', '700c Marathon Plus', 'Shimano Alfine 11-speed Internal', 'Shimano Hydraulic Disc'),
  ('Thunder E-Bike', 'Powerful 500W motor with 100km range makes every ride effortless.', 3299.99, 'https://images.unsplash.com/photo-1571188654248-7a89013e5f76?w=600&h=400&fit=crop', 'electric', true, 'Aluminum Integrated Battery', '29" E-Bike Rated', 'Shimano Deore 10-speed', 'Magura MT5 4-piston'),
  ('Urban Swift E', 'Sleek electric city bike. Hidden battery and whisper-quiet motor.', 2499.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop', 'electric', true, 'Carbon/Aluminum Hybrid', '700c City E-Rated', 'Enviolo Stepless CVT', 'Shimano XT Hydraulic Disc');
