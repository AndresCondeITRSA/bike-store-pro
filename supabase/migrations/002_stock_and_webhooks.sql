-- =====================================================
-- Migration: Add stock column + auto-decrement trigger
-- =====================================================

-- =====================================================
-- ADD STOCK COLUMN TO BIKES
-- =====================================================
alter table public.bikes add column if not exists stock integer not null default 10;

-- Update in_stock based on stock value
create or replace function public.sync_in_stock()
returns trigger as $$
begin
  new.in_stock = (new.stock > 0);
  return new;
end;
$$ language plpgsql;

drop trigger if exists bikes_sync_in_stock on public.bikes;
create trigger bikes_sync_in_stock
  before insert or update of stock on public.bikes
  for each row execute procedure public.sync_in_stock();

-- Set initial stock for existing bikes
update public.bikes set stock = 10 where in_stock = true;
update public.bikes set stock = 0 where in_stock = false;

-- =====================================================
-- TRIGGER: Decrement stock directly in SQL on order_items insert
-- No HTTP call needed — runs pure SQL
-- =====================================================
create or replace function public.handle_stock_decrement()
returns trigger as $$
begin
  update public.bikes
  set stock = greatest(0, stock - new.quantity)
  where id = new.bike_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_item_inserted on public.order_items;
create trigger on_order_item_inserted
  after insert on public.order_items
  for each row execute procedure public.handle_stock_decrement();

-- =====================================================
-- CLEANUP: Remove old HTTP-based triggers if they exist
-- =====================================================
drop trigger if exists on_order_confirmed on public.orders;
drop function if exists public.handle_order_item_inserted();
drop function if exists public.handle_order_confirmed();
