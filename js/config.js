/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — CENTRAL CONFIGURATION              ║
 * ║  Edit this file to customise your café platform.        ║
 * ╚══════════════════════════════════════════════════════════╝
 */

/**
 * ════════════════════════════════════════════════════════════════
 * 📱 RESTAURANT WHATSAPP CONFIGURATION (SINGLE EDITABLE VARIABLE)
 * ════════════════════════════════════════════════════════════════
 * Enter the café owner's WhatsApp number below.
 * Format: Country code + Mobile number (digits only, no '+', spaces, or dashes).
 * Example for India: '919876543210'
 * ⚠️ Replace this placeholder with the café's actual WhatsApp number.
 */
export const RESTAURANT_WHATSAPP_NUMBER = '917280959126'; // ← EDIT THIS VARIABLE

const CONFIG = {

  /* ── CAFÉ IDENTITY ─────────────────────────────────────── */
  cafe: {
    name:        'Brew & Bloom Café',
    tagline:     'Good Coffee. Slow Moments. Beautiful Days.',
    address:     '[Sample Address], Near City Center, Haldia, West Bengal – 721657',
    city:        'Haldia, West Bengal',
    phone:       '+91 98765 43210',
    email:       'hello@brewandbloom.in',
    whatsapp:    RESTAURANT_WHATSAPP_NUMBER, // Links to the single variable above
    instagram:   '#',
    facebook:    '#',
  },

  /* ── RESTAURANT LOCATION ───────────────────────────────── */
  // ⚠️ Haldia café GPS coordinates.
  restaurant: {
    lat:  22.0667,
    lng:  88.0686,
    name: 'Brew & Bloom Café',
    address: '[Sample Address], Haldia, WB',
  },

  /* ── DELIVERY SETTINGS ─────────────────────────────────── */
  delivery: {
    radiusKm:        10,     // Max delivery radius in km
    baseCharge:      30,     // ₹ base delivery charge
    perKmCharge:     5,      // ₹ per km beyond 3km
    freeAbove:       500,    // ₹ order total for free delivery
    freeRadiusKm:    3,      // km within which delivery is free (if order >= freeAbove)
    minOrderAmount:  100,    // ₹ minimum order
    estimatedMinBase: 30,    // minutes base prep + short delivery
    perKmMinutes:     3,     // additional minutes per km
  },

  /* ── TAXES ─────────────────────────────────────────────── */
  tax: {
    gstPercent: 5,   // % GST applied on food subtotal (set 0 to disable)
  },

  /* ── OPENING HOURS ─────────────────────────────────────── */
  hours: {
    'Mon–Fri': { open: '08:00', close: '21:00' },
    'Saturday': { open: '08:00', close: '22:00' },
    'Sunday':   { open: '09:00', close: '20:00' },
  },

  /* ── PAYMENT ────────────────────────────────────────────── */
  payment: {
    codEnabled: true,
    upiEnabled: true,
  },

  /* ── MAP ────────────────────────────────────────────────── */
  map: {
    defaultZoom: 14,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },

};

// Freeze so nothing accidentally mutates config
Object.freeze(CONFIG);
Object.freeze(CONFIG.cafe);
Object.freeze(CONFIG.restaurant);
Object.freeze(CONFIG.delivery);
Object.freeze(CONFIG.tax);
Object.freeze(CONFIG.payment);
Object.freeze(CONFIG.map);

export default CONFIG;
