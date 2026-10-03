/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — SUPABASE CLIENT                    ║
 * ║  Initialises Supabase. Falls back to demo mode if       ║
 * ║  credentials are not configured.                        ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import CONFIG from './config.js';

let _supabase = null;
export let DEMO_MODE = true;

/**
 * Initialise the Supabase client. Safe to call multiple times.
 * Returns null in demo mode.
 */
export async function initSupabase() {
  if (_supabase) return _supabase;

  const { url, anonKey } = CONFIG.supabase;
  if (!url || !anonKey) {
    console.info('[BrewBloom] Supabase not configured → running in demo mode.');
    DEMO_MODE = true;
    ensureDemoSeedOrder();
    return null;
  }

  try {
    if (!window.supabase) throw new Error('Supabase CDN not loaded');
    _supabase = window.supabase.createClient(url, anonKey);
    DEMO_MODE = false;
    console.info('[BrewBloom] Supabase connected.');
    return _supabase;
  } catch (err) {
    console.warn('[BrewBloom] Supabase init failed → demo mode.', err.message);
    DEMO_MODE = true;
    ensureDemoSeedOrder();
    return null;
  }
}

export function getClient() { return _supabase; }

// ── ORDER FUNCTIONS ─────────────────────────────────────────

/**
 * Place a new order.
 * In demo mode: saves to localStorage and returns a fake order.
 */
export async function placeOrder(orderData) {
  if (DEMO_MODE) return placeDemoOrder(orderData);

  const sb = getClient();
  const { data, error } = await sb.from('orders').insert([orderData]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Get order by id and optional token.
 */
export async function getOrder(orderId, token) {
  if (DEMO_MODE) return getDemoOrder(orderId);

  const sb = getClient();
  let query = sb
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId);

  if (token) {
    query = query.eq('tracking_token', token);
  }

  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

/**
 * Subscribe to real-time driver location for an order.
 * Returns an unsubscribe function.
 */
export function subscribeToDriverLocation(orderId, onUpdate) {
  if (DEMO_MODE) return () => {};

  const sb = getClient();
  const channel = sb
    .channel(`driver-location-${orderId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'driver_locations',
      filter: `order_id=eq.${orderId}`,
    }, payload => onUpdate(payload.new))
    .subscribe();

  return () => sb.removeChannel(channel);
}

/**
 * Driver: push location update.
 */
export async function pushDriverLocation(orderId, lat, lng) {
  if (DEMO_MODE) return;
  const sb = getClient();
  await sb.from('driver_locations').upsert({ order_id: orderId, lat, lng, updated_at: new Date().toISOString() });
}

/**
 * Admin: get all orders.
 */
export async function getAdminOrders() {
  if (DEMO_MODE) return getDemoAdminOrders();
  const sb = getClient();
  const { data, error } = await sb
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Admin / Driver: update order status.
 */
export async function updateOrderStatus(orderId, status) {
  if (DEMO_MODE) return updateDemoOrderStatus(orderId, status);
  const sb = getClient();
  const { error } = await sb
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}

// ── DEMO MODE HELPERS & SEED DATA ───────────────────────────
const DEMO_ORDERS_KEY = 'bnb_demo_orders_v2';

function genOrderId() {
  return 'BNB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

function genToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function ensureDemoSeedOrder() {
  const existing = getDemoOrders();
  if (existing.length === 0) {
    const seedOrder = {
      id: 'BNB789DEMO',
      tracking_token: 'seed_demo_token',
      customer_name: 'Ananya Mukherjee',
      customer_phone: '9876543210',
      order_mode: 'delivery',
      delivery_address: 'Flat 4B, Riverside Heights, Near City Centre, Haldia - 721657',
      customer_lat: CONFIG.restaurant.lat + 0.016,
      customer_lng: CONFIG.restaurant.lng + 0.014,
      customer_distance_km: 2.8,
      special_instructions: 'Ring doorbell twice. Please include extra garlic dip.',
      payment_method: 'cod',
      subtotal: 670,
      tax_amount: 34,
      delivery_charge: 30,
      total_amount: 734,
      status: 'out_for_delivery',
      assigned_driver: 'Subhajit Das',
      items: [
        { id: 'paneer-tikka-pizza', name: 'Paneer Tikka Pizza', price: 360, qty: 1, emoji: '🧀' },
        { id: 'cappuccino', name: 'Cappuccino', price: 120, qty: 1, emoji: '☕' },
        { id: 'chocolate-lava-cake', name: 'Chocolate Lava Cake', price: 160, qty: 1, emoji: '🌋' },
        { id: 'masala-chai', name: 'Masala Chai', price: 70, qty: 1, emoji: '🍵' },
      ],
      is_demo: true,
      created_at: new Date(Date.now() - 22 * 60000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    existing.push(seedOrder);
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(existing));
  }
}

function placeDemoOrder(orderData) {
  const orderId = genOrderId();
  const token = genToken();
  const order = {
    ...orderData,
    id: orderId,
    tracking_token: token,
    status: 'received',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_demo: true,
  };
  const existing = getDemoOrders();
  existing.unshift(order);
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(existing));
  return order;
}

function getDemoOrder(orderId) {
  const orders = getDemoOrders();
  if (!orderId && orders.length > 0) return orders[0];
  return orders.find(o => o.id === orderId) || orders[0] || null;
}

function getDemoOrders() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getDemoAdminOrders() {
  ensureDemoSeedOrder();
  return getDemoOrders();
}

function updateDemoOrderStatus(orderId, status) {
  const orders = getDemoOrders();
  const o = orders.find(o => o.id === orderId);
  if (o) {
    o.status = status;
    o.updated_at = new Date().toISOString();
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  }
}
