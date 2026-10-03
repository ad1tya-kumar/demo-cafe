-- ══════════════════════════════════════════════════════════
-- BREW & BLOOM CAFÉ — SUPABASE DATABASE SCHEMA
-- Execute this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ══════════════════════════════════════════════════════════

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  tracking_token TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_mode TEXT NOT NULL DEFAULT 'delivery', -- 'delivery' | 'takeaway' | 'dinein'
  delivery_address TEXT NOT NULL,
  customer_lat NUMERIC,
  customer_lng NUMERIC,
  customer_distance_km NUMERIC DEFAULT 0,
  special_instructions TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod', -- 'cod' | 'upi'
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  delivery_charge NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'received', -- 'received' | 'preparing' | 'ready' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled'
  assigned_driver TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  emoji TEXT
);

-- 3. DRIVER LOCATIONS TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS public.driver_locations (
  order_id TEXT PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  speed NUMERIC,
  accuracy NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR ANONYMOUS CUSTOMERS & AUTHENTICATED STAFF
-- Allow anyone to create an order
CREATE POLICY "Allow public order insertion"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view an order with valid ID
CREATE POLICY "Allow public order lookup"
  ON public.orders FOR SELECT
  USING (true);

-- Allow updates (orders & status)
CREATE POLICY "Allow order status updates"
  ON public.orders FOR UPDATE
  USING (true);

-- Allow order items public insert/select
CREATE POLICY "Allow public order items"
  ON public.order_items FOR ALL
  USING (true);

-- Allow driver locations upsert and reading
CREATE POLICY "Allow driver location broadcast"
  ON public.driver_locations FOR ALL
  USING (true);

-- 6. ENABLE REALTIME
-- Enables live driver movement on customer's map!
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
