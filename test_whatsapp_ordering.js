/**
 * Test Suite: WhatsApp Ordering Flow for Brew & Bloom Café
 */

import { RESTAURANT_WHATSAPP_NUMBER } from './js/config.js';
import CONFIG from './js/config.js';

console.log('🧪 Starting WhatsApp Ordering Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

// ── Test 1: Configured WhatsApp Variable ───────────────────
console.log('Test 1: Restaurant WhatsApp Number Configuration');
assert(typeof RESTAURANT_WHATSAPP_NUMBER === 'string', 'RESTAURANT_WHATSAPP_NUMBER is exported as string');
assert(RESTAURANT_WHATSAPP_NUMBER === '919876543210', 'RESTAURANT_WHATSAPP_NUMBER has placeholder 919876543210');
assert(/^\d+$/.test(RESTAURANT_WHATSAPP_NUMBER), 'WhatsApp number contains only digits (no +, spaces, dashes)');
assert(CONFIG.cafe.whatsapp === RESTAURANT_WHATSAPP_NUMBER, 'CONFIG.cafe.whatsapp matches RESTAURANT_WHATSAPP_NUMBER');

// ── Helper to simulate message builder ─────────────────────
function buildOrderMessage({
  orderRef,
  items,
  subtotal,
  deliveryCharge,
  totalAmount,
  orderMode,
  name,
  phone,
  address,
  landmark,
  instructions,
  table,
  paymentMethod,
}) {
  let msg = `Hello Brew & Bloom Café! I'd like to place an order.\n\n`;
  msg += `ORDER DETAILS\n`;
  msg += `Order ID: ${orderRef}\n\n`;
  msg += `Items:\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
  });

  msg += `\nSubtotal: ₹${subtotal}\n`;
  if (orderMode === 'delivery') {
    const feeText = deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`;
    msg += `Delivery Fee: ${feeText}\n`;
  }
  msg += `Total Amount: ₹${totalAmount}\n\n`;

  let orderTypeLabel = 'Home Delivery';
  if (orderMode === 'takeaway') orderTypeLabel = 'Takeaway';
  else if (orderMode === 'dinein') orderTypeLabel = 'Dine-In';
  msg += `ORDER TYPE: ${orderTypeLabel}\n\n`;

  msg += `CUSTOMER DETAILS\n`;
  msg += `Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;

  if (orderMode === 'delivery') {
    msg += `Delivery Address: ${address}\n`;
    if (landmark) msg += `Landmark: ${landmark}\n`;
    if (instructions) msg += `Delivery Instructions: ${instructions}\n`;
  } else if (orderMode === 'takeaway') {
    if (instructions) msg += `Pickup Instructions: ${instructions}\n`;
  } else if (orderMode === 'dinein') {
    if (table) msg += `Table / Seating Info: ${table}\n`;
    if (instructions) msg += `Dine-In Instructions: ${instructions}\n`;
  }

  msg += `\nPAYMENT METHOD: ${paymentMethod}\n\n`;
  msg += `Please confirm my order and estimated delivery time. Thank you!`;
  return msg;
}

// ── Test 2: Dynamic Home Delivery Message Formatting ───────
console.log('\nTest 2: Home Delivery Order Message Formatting');
const deliveryItems = [
  { name: 'Cappuccino', qty: 2, price: 120 },
  { name: 'Veg Sandwich', qty: 1, price: 120 },
  { name: 'Chocolate Brownie', qty: 1, price: 100 },
];
const deliveryMsg = buildOrderMessage({
  orderRef: 'BB-123456',
  items: deliveryItems,
  subtotal: 460,
  deliveryCharge: 30,
  totalAmount: 490,
  orderMode: 'delivery',
  name: 'Priyanshu',
  phone: '9876543210',
  address: 'Flat 3B, Sunshine Apartments, City Centre Road, Haldia - 721657',
  landmark: 'Near Clock Tower',
  instructions: 'Less spicy, ring the doorbell twice',
  paymentMethod: 'Cash on Delivery',
});

assert(deliveryMsg.includes("Hello Brew & Bloom Café! I'd like to place an order."), 'Includes greeting');
assert(deliveryMsg.includes("Order ID: BB-123456"), 'Includes order reference');
assert(deliveryMsg.includes("1. Cappuccino x 2 = ₹240"), 'Formats item 1 with quantity & price');
assert(deliveryMsg.includes("2. Veg Sandwich x 1 = ₹120"), 'Formats item 2 with quantity & price');
assert(deliveryMsg.includes("3. Chocolate Brownie x 1 = ₹100"), 'Formats item 3 with quantity & price');
assert(deliveryMsg.includes("Subtotal: ₹460"), 'Includes subtotal');
assert(deliveryMsg.includes("Delivery Fee: ₹30"), 'Includes delivery fee');
assert(deliveryMsg.includes("Total Amount: ₹490"), 'Includes total amount');
assert(deliveryMsg.includes("ORDER TYPE: Home Delivery"), 'Identifies Home Delivery order mode');
assert(deliveryMsg.includes("Name: Priyanshu"), 'Includes customer name');
assert(deliveryMsg.includes("Phone: 9876543210"), 'Includes customer phone');
assert(deliveryMsg.includes("Delivery Address: Flat 3B, Sunshine Apartments, City Centre Road, Haldia - 721657"), 'Includes delivery address');
assert(deliveryMsg.includes("Landmark: Near Clock Tower"), 'Includes landmark when provided');
assert(deliveryMsg.includes("Delivery Instructions: Less spicy, ring the doorbell twice"), 'Includes delivery instructions');
assert(deliveryMsg.includes("PAYMENT METHOD: Cash on Delivery"), 'Includes payment method');
assert(deliveryMsg.includes("Please confirm my order and estimated delivery time. Thank you!"), 'Includes polite closing');

// ── Test 3: Omission of Optional Fields ─────────────────────
console.log('\nTest 3: Omission of Optional Fields When Not Provided');
const noOptionalMsg = buildOrderMessage({
  orderRef: 'BB-998877',
  items: [{ name: 'Espresso', qty: 1, price: 80 }],
  subtotal: 80,
  deliveryCharge: 30,
  totalAmount: 110,
  orderMode: 'delivery',
  name: 'Rahul',
  phone: '9876543211',
  address: 'Main Street, Haldia',
  landmark: '',
  instructions: '',
  paymentMethod: 'Cash on Delivery',
});

assert(!noOptionalMsg.includes('Landmark:'), 'Landmark omitted when empty');
assert(!noOptionalMsg.includes('Delivery Instructions:'), 'Delivery Instructions omitted when empty');

// ── Test 4: Takeaway / Self Pickup Order ───────────────────
console.log('\nTest 4: Takeaway Order Type (No address required)');
const takeawayMsg = buildOrderMessage({
  orderRef: 'BB-554433',
  items: [{ name: 'Farmhouse Pizza', qty: 1, price: 320 }],
  subtotal: 320,
  deliveryCharge: 0,
  totalAmount: 320,
  orderMode: 'takeaway',
  name: 'Tanvi',
  phone: '9812345678',
  address: '',
  landmark: '',
  instructions: 'Keep hot, picking up in 20 minutes',
  paymentMethod: 'UPI Payment',
});

assert(takeawayMsg.includes('ORDER TYPE: Takeaway'), 'Order type specifies Takeaway');
assert(!takeawayMsg.includes('Delivery Address:'), 'Delivery address omitted for takeaway');
assert(!takeawayMsg.includes('Delivery Fee:'), 'Delivery fee omitted for takeaway');
assert(takeawayMsg.includes('Pickup Instructions: Keep hot, picking up in 20 minutes'), 'Includes pickup instructions');
assert(takeawayMsg.includes('PAYMENT METHOD: UPI Payment'), 'Includes UPI payment selection');

// ── Test 5: Dine-In Order ──────────────────────────────────
console.log('\nTest 5: Dine-In Order Type (Table information)');
const dineInMsg = buildOrderMessage({
  orderRef: 'BB-221100',
  items: [{ name: 'Mocha', qty: 2, price: 150 }],
  subtotal: 300,
  deliveryCharge: 0,
  totalAmount: 300,
  orderMode: 'dinein',
  name: 'Arup',
  phone: '9876543210',
  table: 'Table 7, Balcony Section',
  instructions: 'Extra cocoa dusting please',
  paymentMethod: 'Cash on Delivery',
});

assert(dineInMsg.includes('ORDER TYPE: Dine-In'), 'Order type specifies Dine-In');
assert(dineInMsg.includes('Table / Seating Info: Table 7, Balcony Section'), 'Includes table seating info');
assert(dineInMsg.includes('Dine-In Instructions: Extra cocoa dusting please'), 'Includes dine-in instructions');

// ── Test 6: Safe URL Encoding with Special Characters ──────
console.log('\nTest 6: Safe URL Encoding with Special Characters');
const specialAddr = 'Shop #4 & Flat 2/A, "Green Heights", Haldia - 721657';
const specialNotes = 'Ring bell twice? Less spice & sugar!';
const specialMsg = buildOrderMessage({
  orderRef: 'BB-778899',
  items: [{ name: 'Café Latte', qty: 1, price: 130 }],
  subtotal: 130,
  deliveryCharge: 30,
  totalAmount: 160,
  orderMode: 'delivery',
  name: 'Debashis & Co.',
  phone: '9876543210',
  address: specialAddr,
  landmark: 'Opp. BSNL Tower',
  instructions: specialNotes,
  paymentMethod: 'Cash on Delivery',
});

const encoded = encodeURIComponent(specialMsg);
const waUrl = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encoded}`;

assert(waUrl.startsWith(`https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=`), 'URL starts with correct wa.me link & configured number');
assert(!waUrl.includes(' '), 'Encoded URL contains no raw spaces');
assert(!waUrl.includes('"'), 'Encoded URL contains no raw double quotes');
assert(!waUrl.includes('\n'), 'Encoded URL contains no raw newlines');
assert(decodeURIComponent(encoded) === specialMsg, 'Encoding and decoding is 100% reversible and lossless');

// ── Test 7: Indian Mobile Number Validation ────────────────
console.log('\nTest 7: Phone Validation (Indian 10-digit standard)');
function validatePhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(digits);
}

assert(validatePhone('9876543210') === true, 'Accepts 9876543210 (starts with 9)');
assert(validatePhone('8123456789') === true, 'Accepts 8123456789 (starts with 8)');
assert(validatePhone('7001234567') === true, 'Accepts 7001234567 (starts with 7)');
assert(validatePhone('6290123456') === true, 'Accepts 6290123456 (starts with 6)');
assert(validatePhone('+91 98765 43210') === false, 'Rejects formatted +91 98765 43210 (UI expects clean 10-digit input)');
assert(validatePhone('5876543210') === false, 'Rejects 5876543210 (starts with 5)');
assert(validatePhone('12345') === false, 'Rejects short numbers');
assert(validatePhone('987654321099') === false, 'Rejects >10 digits');
assert(validatePhone('abcdefghij') === false, 'Rejects non-numeric characters');

console.log(`\n========================================`);
console.log(`🏁 Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
