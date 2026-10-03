/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — CART ENGINE                        ║
 * ║  Handles cart state, localStorage persistence,          ║
 * ║  delivery fee and tax calculation.                       ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import CONFIG from './config.js';
import { getItemById } from './menu-data.js';

const STORAGE_KEY = 'bnb_cart_v2';

/** @returns {CartItem[]} */
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ── Internal reactive state ────────────────────────────────
let _items = loadCart();
const _listeners = new Set();

function notify() {
  _listeners.forEach(fn => fn(getSnapshot()));
}

// ── Public API ─────────────────────────────────────────────

/**
 * Subscribe to cart changes.
 * @param {(snapshot: CartSnapshot) => void} fn
 * @returns {() => void} unsubscribe
 */
export function subscribe(fn) {
  _listeners.add(fn);
  fn(getSnapshot()); // immediate call with current state
  return () => _listeners.delete(fn);
}

/** Add one unit of item (by id) to cart. */
export function addItem(itemId) {
  const product = getItemById(itemId);
  if (!product || !product.available) return false;

  const existing = _items.find(i => i.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    _items.push({ id: itemId, name: product.name, price: product.price, qty: 1, emoji: product.emoji });
  }
  saveCart(_items);
  notify();
  return true;
}

/** Decrease quantity by 1; removes item if qty reaches 0. */
export function decreaseItem(itemId) {
  const idx = _items.findIndex(i => i.id === itemId);
  if (idx === -1) return;
  _items[idx].qty -= 1;
  if (_items[idx].qty <= 0) _items.splice(idx, 1);
  saveCart(_items);
  notify();
}

/** Remove item entirely. */
export function removeItem(itemId) {
  _items = _items.filter(i => i.id !== itemId);
  saveCart(_items);
  notify();
}

/** Clear all items. */
export function clearCart() {
  _items = [];
  saveCart(_items);
  notify();
}

/**
 * Get quantity of a specific item in cart.
 * @param {string} itemId
 * @returns {number}
 */
export function getQty(itemId) {
  return _items.find(i => i.id === itemId)?.qty ?? 0;
}

/**
 * Build a full snapshot with all calculated totals.
 * @param {number} [deliveryDistanceKm=0]
 * @returns {CartSnapshot}
 */
export function getSnapshot(deliveryDistanceKm = 0) {
  const items = structuredClone(_items);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const d = CONFIG.delivery;
  let deliveryCharge = 0;

  if (subtotal > 0) {
    if (subtotal >= d.freeAbove && deliveryDistanceKm <= d.freeRadiusKm) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = d.baseCharge;
      if (deliveryDistanceKm > d.freeRadiusKm) {
        deliveryCharge += Math.ceil(deliveryDistanceKm - d.freeRadiusKm) * d.perKmCharge;
      }
    }
  }

  const gstAmount   = Math.round(subtotal * CONFIG.tax.gstPercent / 100);
  const total       = subtotal + deliveryCharge + gstAmount;

  return { items, itemCount, subtotal, deliveryCharge, gstAmount, total, gstPercent: CONFIG.tax.gstPercent };
}

/**
 * Estimate delivery time (minutes) given distance in km.
 * @param {number} distanceKm
 * @returns {number} minutes
 */
export function estimateDeliveryTime(distanceKm) {
  return CONFIG.delivery.estimatedMinBase + Math.ceil(distanceKm * CONFIG.delivery.perKmMinutes);
}
