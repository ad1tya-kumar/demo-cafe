/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — MAIN APPLICATION ENGINE            ║
 * ║  Handles menu rendering, category filtering, search,    ║
 * ║  shopping cart drawer, checkout modal, Leaflet map,     ║
 * ║  and order placement.                                   ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import CONFIG, { RESTAURANT_WHATSAPP_NUMBER } from './js/config.js';
import { CATEGORIES, CATEGORY_BANNERS, MENU_ITEMS, searchAndFilterItems, getItemById } from './js/menu-data.js';
import { addItem, decreaseItem, removeItem, clearCart, subscribe as subscribeCart, getQty, getSnapshot, estimateDeliveryTime } from './js/cart.js';
import { initSupabase, placeOrder, DEMO_MODE } from './js/supabase-client.js';

// Application State
const state = {
  currentCategory: 'all',
  searchQuery: '',
  sortOrder: 'default',
  vegOnly: false,
  deliveryMode: 'delivery', // 'delivery' | 'takeaway' | 'dinein'
  customerLat: CONFIG.restaurant.lat,
  customerLng: CONFIG.restaurant.lng,
  customerDistanceKm: 2.5, // default reasonable distance in Haldia
  checkoutMap: null,
  checkoutUserMarker: null,
  checkoutRouteLayer: null,
};

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION ENGINE
   ══════════════════════════════════════════════════════════ */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');

  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ══════════════════════════════════════════════════════════
   WHATSAPP ORDERING LINK
   ══════════════════════════════════════════════════════════ */
function initWhatsAppLinks() {
  document.querySelectorAll('.whatsapp-order').forEach((el) => {
    const item = el.dataset.item || 'specialty coffee & food';
    const msg = encodeURIComponent(
      `Hi! I would like to order or enquire about ${item} at Brew & Bloom Café, Haldia. ☕`
    );
    const link = `https://wa.me/${CONFIG.cafe.whatsapp}?text=${msg}`;

    if (el.tagName === 'A') {
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.addEventListener('click', () => window.open(link, '_blank', 'noopener,noreferrer'));
    }
  });
}

/* ══════════════════════════════════════════════════════════
   MENU RENDERING & FILTERING
   ══════════════════════════════════════════════════════════ */
function renderCategoryChips() {
  const container = document.getElementById('categoryChipsContainer');
  if (!container) return;

  container.innerHTML = CATEGORIES.map((cat) => `
    <button class="chip-btn ${cat.id === state.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
      <span>${cat.emoji}</span>
      <span>${cat.label}</span>
    </button>
  `).join('');

  container.querySelectorAll('.chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentCategory = btn.dataset.cat;
      renderCategoryChips();
      renderMenuGrid();
    });
  });
}

function renderMenuGrid() {
  const grid = document.getElementById('menuGridContainer');
  if (!grid) return;

  const items = searchAndFilterItems({
    query: state.searchQuery,
    category: state.currentCategory,
    sort: state.sortOrder,
    vegOnly: state.vegOnly,
  });

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-menu-alert">
        <span class="empty-menu-icon">🍽️</span>
        <h3>No matching items found</h3>
        <p style="color:var(--text-muted); margin-top:0.3rem;">Try searching for another dish or clear filters.</p>
        <button class="btn btn-sm btn-primary" id="resetMenuFilterBtn" style="margin-top:1rem;">View All Items</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetMenuFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.currentCategory = 'all';
        state.searchQuery = '';
        state.vegOnly = false;
        const searchInput = document.getElementById('menuSearchInput');
        if (searchInput) searchInput.value = '';
        const vegToggle = document.getElementById('vegOnlyToggle');
        if (vegToggle) vegToggle.checked = false;
        renderCategoryChips();
        renderMenuGrid();
      });
    }
    return;
  }

  grid.innerHTML = items.map((item) => {
    const qty = getQty(item.id);
    const isVeg = item.tags.includes('veg');
    const isBestseller = item.tags.includes('bestseller');

    const buttonHtml = qty > 0
      ? `
        <div class="qty-counter">
          <button class="qty-btn btn-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn btn-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      `
      : `
        <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">
          <span>+</span>
          <span>Add</span>
        </button>
      `;

    return `
      <article class="food-card" data-id="${item.id}">
        <div class="food-card-media">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80';" />`
            : `<div class="food-card-fallback">${item.emoji}</div>`
          }
          <div class="food-card-badges">
            ${isVeg ? `<span class="badge-veg" title="Vegetarian"><span class="veg-icon-badge"><span class="veg-icon-dot"></span></span></span>` : `<span></span>`}
            ${isBestseller ? `<span class="badge-bestseller">⭐ Bestseller</span>` : `<span></span>`}
          </div>
        </div>

        <div class="food-card-body">
          <h3 class="food-card-title">${item.name}</h3>
          <p class="food-card-desc">${item.description}</p>
          <div class="food-card-footer">
            <span class="food-card-price">₹${item.price}</span>
            <div class="food-card-action">
              ${buttonHtml}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach button events
  grid.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      addItem(id);
      const item = getItemById(id);
      showToast(`Added ${item?.name || 'item'} to cart!`, 'success');
      animateNavCartBadge();
    });
  });

  grid.querySelectorAll('.btn-plus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addItem(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.btn-minus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      decreaseItem(btn.dataset.id);
    });
  });
}

function initMenuControls() {
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderMenuGrid();
    });
  }

  const sortSelect = document.getElementById('menuSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortOrder = e.target.value;
      renderMenuGrid();
    });
  }

  const vegToggle = document.getElementById('vegOnlyToggle');
  if (vegToggle) {
    vegToggle.addEventListener('change', (e) => {
      state.vegOnly = e.target.checked;
      renderMenuGrid();
    });
  }

  // Promotional Banner Card click handlers
  document.querySelectorAll('.promo-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const cat = card.dataset.category;
      if (cat) {
        state.currentCategory = cat;
        renderCategoryChips();
        renderMenuGrid();
      }
    });
  });

  // Direct add-to-cart in Bestsellers section
  document.querySelectorAll('.add-to-cart-direct').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addItem(id);
      const item = getItemById(id);
      showToast(`Added ${item?.name || 'item'} to cart!`, 'success');
      animateNavCartBadge();
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SHOPPING CART DRAWER
   ══════════════════════════════════════════════════════════ */
function initCartDrawer() {
  const openBtn = document.getElementById('openCartBtn');
  const footerCartLink = document.getElementById('footerCartLink');
  const closeBtn = document.getElementById('closeCartBtn');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const drawer = document.getElementById('cartDrawer');
  const proceedBtn = document.getElementById('proceedCheckoutBtn');

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (footerCartLink) footerCartLink.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      const snapshot = getSnapshot(state.customerDistanceKm);
      if (snapshot.itemCount === 0) {
        showToast('Your cart is empty! Add some delicious dishes first.', 'error');
        return;
      }
      closeDrawer();
      openCheckoutModal();
    });
  }

  // Subscribe to Cart updates
  subscribeCart((snapshot) => {
    updateCartUI(snapshot);
    renderMenuGrid(); // updates quantity counters on menu cards
  });
}

function updateCartUI(snapshot) {
  // Update Navbar Badge
  const badge = document.getElementById('navCartBadge');
  if (badge) {
    badge.textContent = snapshot.itemCount;
  }

  // Drawer items
  const itemsContainer = document.getElementById('cartDrawerItems');
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  const taxEl = document.getElementById('cartDrawerTax');
  const deliveryEl = document.getElementById('cartDrawerDelivery');
  const totalEl = document.getElementById('cartDrawerTotal');

  if (subtotalEl) subtotalEl.textContent = `₹${snapshot.subtotal}`;
  if (taxEl) taxEl.textContent = `₹${snapshot.gstAmount}`;
  if (deliveryEl) deliveryEl.textContent = snapshot.deliveryCharge === 0 ? 'FREE' : `₹${snapshot.deliveryCharge}`;
  if (totalEl) totalEl.textContent = `₹${snapshot.total}`;

  if (!itemsContainer) return;

  if (snapshot.items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <span class="cart-empty-icon">☕</span>
        <h4>Your Cart is Empty</h4>
        <p style="font-size:0.85rem; margin-top:0.4rem;">Explore our specialty coffees, wood-fired pizzas and desserts!</p>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = `
    ${snapshot.items.map((item) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.emoji || '🍽️'} ${item.name}</div>
          <div class="cart-item-price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</div>
          <span class="cart-item-remove" data-id="${item.id}">Remove</span>
        </div>
        <div class="qty-counter">
          <button class="qty-btn cart-btn-minus" data-id="${item.id}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn cart-btn-plus" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('')}

    <div style="margin-top:1rem;">
      <label class="form-label" for="cartSpecialInstructions">Special Cooking / Packing Note</label>
      <textarea id="cartSpecialInstructions" class="cart-special-instructions" placeholder="e.g. Extra napkins, less sugar, packed separately..."></textarea>
    </div>
  `;

  // Attach cart drawer item events
  itemsContainer.querySelectorAll('.cart-btn-plus').forEach((btn) => {
    btn.addEventListener('click', () => addItem(btn.dataset.id));
  });

  itemsContainer.querySelectorAll('.cart-btn-minus').forEach((btn) => {
    btn.addEventListener('click', () => decreaseItem(btn.dataset.id));
  });

  itemsContainer.querySelectorAll('.cart-item-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeItem(btn.dataset.id);
      showToast('Item removed from cart', 'info');
    });
  });
}

function animateNavCartBadge() {
  const badge = document.getElementById('navCartBadge');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth; // trigger reflow
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT MODAL & LOCATION LEAFLET ENGINE
   ══════════════════════════════════════════════════════════ */
function openCheckoutModal() {
  const modal = document.getElementById('checkoutModalBackdrop');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Ensure checkout form is active and dialog is hidden
  const checkoutForm = document.getElementById('checkoutForm');
  const waDialog = document.getElementById('whatsappSentDialog');
  if (checkoutForm) checkoutForm.style.display = 'block';
  if (waDialog) waDialog.style.display = 'none';

  const confirmBtn = document.getElementById('confirmOrderBtn');
  const confirmBtnText = document.getElementById('confirmOrderBtnText');
  if (confirmBtn) confirmBtn.disabled = false;
  if (confirmBtnText) confirmBtnText.textContent = 'Place Order on WhatsApp';

  updateCheckoutSummary();
  initCheckoutMap();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModalBackdrop');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateCheckoutSummary() {
  const dist = state.deliveryMode === 'delivery' ? state.customerDistanceKm : 0;
  const snapshot = getSnapshot(dist);

  const subtotalEl = document.getElementById('chkSummarySubtotal');
  const taxEl = document.getElementById('chkSummaryTax');
  const deliveryEl = document.getElementById('chkSummaryDelivery');
  const totalEl = document.getElementById('chkSummaryTotal');

  if (subtotalEl) subtotalEl.textContent = `₹${snapshot.subtotal}`;
  if (taxEl) taxEl.textContent = `₹${snapshot.gstAmount}`;

  if (deliveryEl) {
    if (state.deliveryMode !== 'delivery') {
      deliveryEl.textContent = '₹0 (Self/Dine-in)';
    } else {
      deliveryEl.textContent = snapshot.deliveryCharge === 0 ? 'FREE' : `₹${snapshot.deliveryCharge}`;
    }
  }

  const finalTotal = state.deliveryMode === 'delivery'
    ? snapshot.total
    : snapshot.subtotal + snapshot.gstAmount;

  if (totalEl) totalEl.textContent = `₹${finalTotal}`;
}

function initCheckoutWorkflow() {
  const closeBtn = document.getElementById('closeCheckoutBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);

  // Delivery mode switcher
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.deliveryMode = btn.dataset.mode;

      const mapContainer = document.getElementById('checkoutMapContainer');
      const distBadge = document.getElementById('mapDistanceBadge');
      const locRow = document.getElementById('locationPickerRow');
      const addrGroup = document.getElementById('addressFieldGroup');
      const locGroup = document.getElementById('localityFieldGroup');
      const landmarkGroup = document.getElementById('landmarkFieldGroup');
      const pinGroup = document.getElementById('pincodeFieldGroup');
      const tableGroup = document.getElementById('tableFieldGroup');

      if (state.deliveryMode === 'delivery') {
        if (mapContainer) mapContainer.style.display = 'block';
        if (distBadge) distBadge.style.display = 'flex';
        if (locRow) locRow.style.display = 'flex';
        if (addrGroup) addrGroup.style.display = 'block';
        if (locGroup) locGroup.style.display = 'block';
        if (landmarkGroup) landmarkGroup.style.display = 'block';
        if (pinGroup) pinGroup.style.display = 'block';
        if (tableGroup) tableGroup.style.display = 'none';
        if (state.checkoutMap) state.checkoutMap.invalidateSize();
      } else if (state.deliveryMode === 'takeaway') {
        if (mapContainer) mapContainer.style.display = 'none';
        if (distBadge) distBadge.style.display = 'none';
        if (locRow) locRow.style.display = 'none';
        if (addrGroup) addrGroup.style.display = 'none';
        if (locGroup) locGroup.style.display = 'none';
        if (landmarkGroup) landmarkGroup.style.display = 'none';
        if (pinGroup) pinGroup.style.display = 'none';
        if (tableGroup) tableGroup.style.display = 'none';
      } else if (state.deliveryMode === 'dinein') {
        if (mapContainer) mapContainer.style.display = 'none';
        if (distBadge) distBadge.style.display = 'none';
        if (locRow) locRow.style.display = 'none';
        if (addrGroup) addrGroup.style.display = 'none';
        if (locGroup) locGroup.style.display = 'none';
        if (landmarkGroup) landmarkGroup.style.display = 'none';
        if (pinGroup) pinGroup.style.display = 'none';
        if (tableGroup) tableGroup.style.display = 'block';
      }

      updateCheckoutSummary();
    });
  });

  // Geolocation trigger
  const btnGeo = document.getElementById('btnUseGeolocation');
  if (btnGeo) {
    btnGeo.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', 'error');
        return;
      }
      showToast('Requesting GPS location...', 'info');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.customerLat = pos.coords.latitude;
          state.customerLng = pos.coords.longitude;
          updateCheckoutLocation(state.customerLat, state.customerLng, 'GPS Location Detected');
          showToast('GPS location updated!', 'success');
        },
        (err) => {
          showToast('Could not get GPS location. Please enter your address manually.', 'error');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Payment radio card styling
  document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.payment-card-option').forEach((card) => card.classList.remove('active'));
      input.closest('.payment-card-option').classList.add('active');
    });
  });

  // Remove invalid styling on user typing
  ['custName', 'custPhone', 'custAddress', 'custLocality', 'custPin'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  // Done button in WhatsApp Sent Dialog
  document.getElementById('dialogDoneBtn')?.addEventListener('click', () => {
    clearCart();
    closeCheckoutModal();
    const checkoutForm = document.getElementById('checkoutForm');
    const waDialog = document.getElementById('whatsappSentDialog');
    if (checkoutForm) checkoutForm.style.display = 'block';
    if (waDialog) waDialog.style.display = 'none';
  });

  // Form submission
  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', handleOrderSubmit);
  }
}

/* ══════════════════════════════════════════════════════════
   LEAFLET MAP INTEGRATION (Checkout)
   ══════════════════════════════════════════════════════════ */
function initCheckoutMap() {
  const mapElement = document.getElementById('checkoutLeafletMap');
  if (!mapElement || typeof L === 'undefined') return;

  if (state.checkoutMap) {
    setTimeout(() => state.checkoutMap.invalidateSize(), 200);
    return;
  }

  const cafeLat = CONFIG.restaurant.lat;
  const cafeLng = CONFIG.restaurant.lng;

  state.checkoutMap = L.map('checkoutLeafletMap').setView([cafeLat, cafeLng], 13);

  L.tileLayer(CONFIG.map.tileUrl, {
    attribution: CONFIG.map.tileAttribution,
    maxZoom: 18,
  }).addTo(state.checkoutMap);

  // Café restaurant marker
  const cafeIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: '<div style="background:#073B32; color:#FFF8EC; padding:6px 10px; border-radius:100px; font-weight:800; font-size:12px; border:2px solid #FFC247; box-shadow:0 3px 10px rgba(0,0,0,0.3);">☕ Brew & Bloom</div>',
    iconSize: [110, 32],
    iconAnchor: [55, 16],
  });

  L.marker([cafeLat, cafeLng], { icon: cafeIcon })
    .addTo(state.checkoutMap)
    .bindPopup('<b>Brew & Bloom Café</b><br />Kitchen & Roastry, Haldia');

  // Customer marker draggable
  const userIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: '<div style="background:#FF7629; color:#FFFFFF; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; border:3px solid #FFFFFF; box-shadow:0 3px 10px rgba(0,0,0,0.4);">📍</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  // Default customer position ~2 km north-east in Haldia
  state.customerLat = cafeLat + 0.015;
  state.customerLng = cafeLng + 0.012;

  state.checkoutUserMarker = L.marker([state.customerLat, state.customerLng], {
    icon: userIcon,
    draggable: true,
  }).addTo(state.checkoutMap);

  state.checkoutUserMarker.on('dragend', (e) => {
    const latlng = e.target.getLatLng();
    state.customerLat = latlng.lat;
    state.customerLng = latlng.lng;
    updateCheckoutLocation(latlng.lat, latlng.lng, 'Adjusted via map pin');
  });

  updateCheckoutLocation(state.customerLat, state.customerLng);
}

function updateCheckoutLocation(lat, lng, note = '') {
  const cafeLat = CONFIG.restaurant.lat;
  const cafeLng = CONFIG.restaurant.lng;

  if (state.checkoutUserMarker) {
    state.checkoutUserMarker.setLatLng([lat, lng]);
  }

  // Calculate straight-line distance
  const dLat = (lat - cafeLat) * (Math.PI / 180);
  const dLng = (lng - cafeLng) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(cafeLat * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistanceKm = Math.round(6371 * c * 10) / 10;

  // Road distance is typically ~1.25x straight line
  const approxRoadDistanceKm = Math.round(straightDistanceKm * 1.25 * 10) / 10;
  state.customerDistanceKm = approxRoadDistanceKm;

  // Update distance badge
  const distEl = document.getElementById('mapDistanceText');
  const etaEl = document.getElementById('mapEtaText');
  const etaMins = estimateDeliveryTime(approxRoadDistanceKm);

  if (distEl) {
    if (approxRoadDistanceKm > CONFIG.delivery.radiusKm) {
      distEl.innerHTML = `<span style="color:#E74C3C;">⚠️ Outside delivery radius (${approxRoadDistanceKm} km > ${CONFIG.delivery.radiusKm} km). Please choose Self Pickup.</span>`;
    } else {
      distEl.innerHTML = `🛵 Distance: <strong>${approxRoadDistanceKm} km</strong> (Approx. road route)`;
    }
  }

  if (etaEl) {
    etaEl.textContent = `Est. ETA: ~${etaMins} mins`;
  }

  // Draw / update straight line or route
  if (state.checkoutMap) {
    if (state.checkoutRouteLayer) {
      state.checkoutMap.removeLayer(state.checkoutRouteLayer);
    }
    state.checkoutRouteLayer = L.polyline([[cafeLat, cafeLng], [lat, lng]], {
      color: '#FF7629',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.85,
    }).addTo(state.checkoutMap);

    state.checkoutMap.fitBounds([[cafeLat, cafeLng], [lat, lng]], { padding: [40, 40] });
  }

  updateCheckoutSummary();
}

/* ══════════════════════════════════════════════════════════
   ORDER SUBMISSION WORKFLOW
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   ORDER SUBMISSION WORKFLOW — DIRECT WHATSAPP ORDERING
   ══════════════════════════════════════════════════════════ */
async function handleOrderSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const addrInput = document.getElementById('custAddress');
  const localInput = document.getElementById('custLocality');
  const landmarkInput = document.getElementById('custLandmark');
  const pinInput = document.getElementById('custPin');
  const tableInput = document.getElementById('custTable');
  const notesInput = document.getElementById('custNotes');
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'Cash on Delivery';

  const confirmBtn = document.getElementById('confirmOrderBtn');
  const confirmBtnText = document.getElementById('confirmOrderBtnText');
  const checkoutForm = document.getElementById('checkoutForm');
  const waDialog = document.getElementById('whatsappSentDialog');

  // 1. Validate that the cart contains at least one item
  const isDelivery = state.deliveryMode === 'delivery';
  const snapshot = getSnapshot(isDelivery ? state.customerDistanceKm : 0);

  if (!snapshot.items || snapshot.items.length === 0) {
    showToast('Your cart is empty! Please add items before placing an order.', 'error');
    return;
  }

  // 2. Validate customer contact information
  let isValid = true;

  const nameVal = nameInput ? nameInput.value.trim() : '';
  if (!nameVal) {
    if (nameInput) nameInput.classList.add('invalid');
    isValid = false;
  } else {
    if (nameInput) nameInput.classList.remove('invalid');
  }

  // Indian mobile validation (10 digits starting with 6-9)
  const rawPhone = phoneInput ? phoneInput.value.trim() : '';
  const phoneVal = rawPhone.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(phoneVal)) {
    if (phoneInput) phoneInput.classList.add('invalid');
    isValid = false;
  } else {
    if (phoneInput) phoneInput.classList.remove('invalid');
  }

  // 3. Validate delivery address fields only if Home Delivery
  if (isDelivery) {
    const addrVal = addrInput ? addrInput.value.trim() : '';
    if (!addrVal) {
      if (addrInput) addrInput.classList.add('invalid');
      isValid = false;
    } else {
      if (addrInput) addrInput.classList.remove('invalid');
    }

    const localVal = localInput ? localInput.value.trim() : '';
    if (!localVal) {
      if (localInput) localInput.classList.add('invalid');
      isValid = false;
    } else {
      if (localInput) localInput.classList.remove('invalid');
    }

    const pinVal = pinInput ? pinInput.value.trim() : '';
    if (!/^\d{6}$/.test(pinVal)) {
      if (pinInput) pinInput.classList.add('invalid');
      isValid = false;
    } else {
      if (pinInput) pinInput.classList.remove('invalid');
    }

    // Distance radius validation
    if (state.customerDistanceKm > CONFIG.delivery.radiusKm) {
      showToast(`Delivery is only available within ${CONFIG.delivery.radiusKm} km. Please select Takeaway or Dine-in.`, 'error');
      return;
    }
  }

  // Keep customer on checkout page if required fields are missing
  if (!isValid) {
    showToast('Please fill in all required fields highlighted in red.', 'error');
    return;
  }

  // 4. Verify the restaurant WhatsApp number is configured
  const waNumber = (CONFIG.cafe && CONFIG.cafe.whatsapp)
    ? String(CONFIG.cafe.whatsapp).replace(/\D/g, '')
    : String(RESTAURANT_WHATSAPP_NUMBER || '').replace(/\D/g, '');

  if (!waNumber || waNumber.length < 10) {
    showToast('The restaurant WhatsApp number has not been configured in js/config.js.', 'error');
    return;
  }

  // 5. Prevent accidental repeated clicks & display loading state
  if (confirmBtn) {
    confirmBtn.disabled = true;
    if (confirmBtnText) confirmBtnText.textContent = 'Preparing WhatsApp message...';
  }

  // 6. Generate unique order reference (e.g. BB-123456)
  const orderRef = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

  // Save Order ID to localStorage for tracking page lookup
  localStorage.setItem('bnb_last_order_id', orderRef);
  localStorage.setItem('bnb_last_order_data', JSON.stringify({
    orderId: orderRef,
    items: snapshot.items.map(i => ({ name: i.name, qty: i.qty, price: i.price, emoji: i.emoji })),
    subtotal: snapshot.subtotal,
    deliveryCharge: isDelivery ? snapshot.deliveryCharge : 0,
    gstAmount: snapshot.gstAmount,
    total: isDelivery ? snapshot.total : (snapshot.subtotal + snapshot.gstAmount),
    orderType: state.deliveryMode,
    customerName: nameVal,
    customerPhone: phoneVal,
    timestamp: new Date().toISOString(),
    status: 'received'
  }));

  // 7. Calculate totals
  const subtotal = snapshot.subtotal;
  const deliveryFee = isDelivery ? snapshot.deliveryCharge : 0;
  const totalAmount = isDelivery ? snapshot.total : (subtotal + snapshot.gstAmount);

  // 8. Build dynamic order message
  let msg = `Hello Brew & Bloom Café! I'd like to place an order.\n\n`;
  msg += `ORDER DETAILS\n`;
  msg += `Order ID: ${orderRef}\n\n`;
  msg += `Items:\n`;

  snapshot.items.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
  });

  msg += `\nSubtotal: ₹${subtotal}\n`;
  if (isDelivery) {
    const deliveryFeeLabel = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    msg += `Delivery Fee: ${deliveryFeeLabel}\n`;
  }
  msg += `Total Amount: ₹${totalAmount}\n\n`;

  // Order Type
  let orderTypeLabel = 'Home Delivery';
  if (state.deliveryMode === 'takeaway') orderTypeLabel = 'Takeaway';
  else if (state.deliveryMode === 'dinein') orderTypeLabel = 'Dine-In';
  msg += `ORDER TYPE: ${orderTypeLabel}\n\n`;

  // Customer Details
  msg += `CUSTOMER DETAILS\n`;
  msg += `Name: ${nameVal}\n`;
  msg += `Phone: ${phoneVal}\n`;

  const landmarkVal = landmarkInput?.value.trim();
  const notesVal = notesInput?.value.trim();
  const tableVal = tableInput?.value.trim();

  if (isDelivery) {
    const fullAddress = `${addrInput.value.trim()}, ${localInput.value.trim()}, Haldia - ${pinInput.value.trim()}`;
    msg += `Delivery Address: ${fullAddress}\n`;
    if (landmarkVal) {
      msg += `Landmark: ${landmarkVal}\n`;
    }
    if (notesVal) {
      msg += `Delivery Instructions: ${notesVal}\n`;
    }
  } else if (state.deliveryMode === 'takeaway') {
    if (notesVal) {
      msg += `Pickup Instructions: ${notesVal}\n`;
    }
  } else if (state.deliveryMode === 'dinein') {
    if (tableVal) {
      msg += `Table / Seating Info: ${tableVal}\n`;
    }
    if (notesVal) {
      msg += `Dine-In Instructions: ${notesVal}\n`;
    }
  }

  // Payment method
  msg += `\nPAYMENT METHOD: ${paymentMethod}\n\n`;
  msg += `Please confirm my order and estimated delivery time. Thank you!`;

  // 9. Safely encode URI component and construct wa.me URL
  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

  // 10. Open WhatsApp conversation
  const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');

  // If window.open was blocked by mobile browser popup blockers, clicking the reopen link works directly
  if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
    setTimeout(() => {
      const reopenLink = document.getElementById('dialogReopenWaLink');
      if (reopenLink) reopenLink.click();
    }, 150);
  }

  // 11. Display honest feedback dialog in the modal without claiming order is confirmed yet
  if (checkoutForm && waDialog) {
    checkoutForm.style.display = 'none';
    waDialog.style.display = 'block';

    const dialogOrderId = document.getElementById('dialogOrderId');
    if (dialogOrderId) dialogOrderId.textContent = `Order ID: ${orderRef}`;

    const dialogReopenLink = document.getElementById('dialogReopenWaLink');
    if (dialogReopenLink) dialogReopenLink.href = waUrl;
  }

  showToast('WhatsApp launched! Please press Send in WhatsApp to confirm.', 'info');

  // Reset button state
  if (confirmBtn) {
    confirmBtn.disabled = false;
    if (confirmBtnText) confirmBtnText.textContent = 'Place Order on WhatsApp';
  }
}

/* ══════════════════════════════════════════════════════════
   HALDIA CAFÉ LOCATION MAP (Section)
   ══════════════════════════════════════════════════════════ */
function initLocationMap() {
  const mapEl = document.getElementById('locationLeafletMap');
  if (!mapEl || typeof L === 'undefined') return;

  const lat = CONFIG.restaurant.lat;
  const lng = CONFIG.restaurant.lng;

  const map = L.map('locationLeafletMap', { scrollWheelZoom: false }).setView([lat, lng], 14);

  L.tileLayer(CONFIG.map.tileUrl, {
    attribution: CONFIG.map.tileAttribution,
    maxZoom: 18,
  }).addTo(map);

  const customCafeIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background:#073B32; color:#FFF8EC; padding:8px 14px; border-radius:100px; font-weight:800; font-size:13px; border:2px solid #FFC247; box-shadow:0 4px 16px rgba(0,0,0,0.35); display:inline-flex; align-items:center; gap:6px;">
        <span>☕</span>
        <span>Brew &amp; Bloom Café</span>
      </div>
    `,
    iconSize: [170, 36],
    iconAnchor: [85, 18],
  });

  L.marker([lat, lng], { icon: customCafeIcon })
    .addTo(map)
    .bindPopup(`
      <div style="font-family:'Inter',sans-serif; padding:4px;">
        <h4 style="margin:0 0 4px; color:#073B32; font-family:'Playfair Display',serif;">Brew &amp; Bloom Café</h4>
        <p style="margin:0 0 6px; font-size:12px; color:#52605C;">Haldia, West Bengal</p>
        <p style="margin:0; font-size:12px; font-weight:bold; color:#FF7629;">Open Today: 8:00 AM – 9:00 PM</p>
      </div>
    `)
    .openPopup();
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION & UI INTERACTION
   ══════════════════════════════════════════════════════════ */
function initNavbarAndScroll() {
  const navbar = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');

  // Sticky nav on scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }
  }, { passive: true });

  // Hamburger toggle
  if (ham && navLinks) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      navLinks.classList.toggle('open', open);
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        ham.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ══════════════════════════════════════════════════════════
   APP INITIALIZATION
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Supabase backend (or fallback to demo mode).
  // Wrapped in try/catch so any failure doesn't block cart, menu, or checkout.
  try {
    await initSupabase();
  } catch (err) {
    console.warn('[BrewBloom] initSupabase threw unexpectedly, continuing in demo mode.', err);
  }

  initNavbarAndScroll();
  initWhatsAppLinks();
  renderCategoryChips();
  renderMenuGrid();
  initMenuControls();
  initCartDrawer();
  initCheckoutWorkflow();
  initLocationMap();

  console.log('%c☕ Brew & Bloom Café Online Platform Loaded', 'color:#FF7629; font-weight:bold; font-size:16px;');
  console.log(`%cRunning in ${DEMO_MODE ? 'Demo LocalStorage Mode' : 'Connected Supabase Mode'}`, 'color:#27AE60; font-weight:600;');
});
