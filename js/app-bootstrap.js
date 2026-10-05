/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — SELF-CONTAINED BOOTSTRAP                   ║
 * ║  Zero ES-module dependencies. Works on GitHub Pages as-is.     ║
 * ║  This script is the guaranteed fallback that powers:            ║
 * ║    • Rendering the full menu with Add to Cart buttons           ║
 * ║    • Cart state via localStorage (bnb_cart_v2 — same key)      ║
 * ║    • WhatsApp checkout redirect                                  ║
 * ║    • Hamburger menu, smooth scroll, cart drawer                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     CONFIGURATION — single place to change number / prices
  ───────────────────────────────────────────────────────────── */
  var WA_NUMBER      = '917280959126'; // ← change only this
  var STORAGE_KEY    = 'bnb_cart_v2';  // same key as cart.js
  var GST_PERCENT    = 5;
  var DELIVERY_BASE  = 30;
  var FREE_ABOVE     = 500;

  /* ─────────────────────────────────────────────────────────────
     MENU DATA — mirrors js/menu-data.js exactly
  ───────────────────────────────────────────────────────────── */
  var CATEGORIES = [
    { id: 'all',      label: 'All Items',       emoji: '🍽️' },
    { id: 'coffee',   label: 'Coffee',          emoji: '☕' },
    { id: 'tea',      label: 'Tea',             emoji: '🍵' },
    { id: 'cold',     label: 'Cold Beverages',  emoji: '🥤' },
    { id: 'bites',    label: 'Quick Bites',     emoji: '🥪' },
    { id: 'pizza',    label: 'Pizza & Pasta',   emoji: '🍕' },
    { id: 'desserts', label: 'Desserts',        emoji: '🍰' },
  ];

  var MENU_ITEMS = [
    // ── COFFEE ─────────────────────────────────────────────
    { id:'espresso',         name:'Espresso',            category:'coffee',   price:80,  emoji:'☕', tags:['veg'],                      desc:'Rich, bold single-origin double shot with a velvety golden crema', img:'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80' },
    { id:'cappuccino',       name:'Cappuccino',           category:'coffee',   price:120, emoji:'☕', tags:['veg','bestseller'],          desc:'Espresso with silky steamed milk and a thick, cloud-like foam dusting', img:'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80' },
    { id:'cafe-latte',       name:'Café Latte',           category:'coffee',   price:130, emoji:'☕', tags:['veg'],                      desc:'Smooth espresso stretched with creamy steamed milk and artisan latte art', img:'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80' },
    { id:'americano',        name:'Americano',            category:'coffee',   price:100, emoji:'☕', tags:['veg'],                      desc:'Double espresso pulled over hot water for a crisp, intense roast profile', img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80' },
    { id:'mocha',            name:'Mocha',                category:'coffee',   price:150, emoji:'🍫', tags:['veg','bestseller'],          desc:'Espresso with rich Dutch cocoa, steamed milk, and whipped cream crown', img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80' },
    { id:'caramel-macchiato',name:'Caramel Macchiato',   category:'coffee',   price:160, emoji:'🌸', tags:['veg','bestseller'],          desc:'Steamed milk stained with espresso, vanilla bean syrup & salted caramel', img:'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80' },
    { id:'cold-coffee',      name:'Cold Coffee',          category:'coffee',   price:140, emoji:'🧊', tags:['veg'],                      desc:'Thick, creamy chilled espresso blended with vanilla ice cream and milk', img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80' },
    // ── TEA ──────────────────────────────────────────────────
    { id:'masala-chai',      name:'Masala Chai',          category:'tea',      price:70,  emoji:'🍵', tags:['veg','bestseller'],          desc:'Handcrafted kadak tea infused with Assam leaves, ginger, cloves & cardamom', img:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
    { id:'ginger-tea',       name:'Ginger Tea',           category:'tea',      price:70,  emoji:'🫚', tags:['veg'],                      desc:'Crushed organic ginger root brewed hot with fresh milk and organic jaggery', img:'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80' },
    { id:'green-tea',        name:'Green Tea',            category:'tea',      price:90,  emoji:'🌿', tags:['veg'],                      desc:'Whole leaf Darjeeling green tea rich in antioxidants with a soothing herbal finish', img:'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80' },
    { id:'lemon-tea',        name:'Lemon Tea',            category:'tea',      price:80,  emoji:'🍋', tags:['veg'],                      desc:'Clarified spiced black tea with fresh squeezed Kolkata lemon & wild honey', img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80' },
    { id:'iced-tea',         name:'Iced Tea',             category:'tea',      price:110, emoji:'🧊', tags:['veg'],                      desc:'Peach & lemon brewed tea poured over cracked ice with sprigs of fresh mint', img:'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=80' },
    // ── COLD BEVERAGES ────────────────────────────────────────
    { id:'iced-latte',       name:'Iced Latte',           category:'cold',     price:150, emoji:'🥤', tags:['veg'],                      desc:'Bold espresso poured over cold milk and ice cubes for a smooth, refreshing sip', img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80' },
    { id:'chocolate-frappe', name:'Chocolate Frappe',     category:'cold',     price:170, emoji:'🍫', tags:['veg','bestseller'],          desc:'Dark Belgian chocolate ganache blended with crushed ice and chocolate drizzle', img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
    { id:'oreo-shake',       name:'Oreo Shake',           category:'cold',     price:180, emoji:'🥛', tags:['veg','bestseller'],          desc:'Creamy vanilla ice cream shake blended with whole crunchy Oreo cookies', img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
    { id:'strawberry-smoothie',name:'Strawberry Smoothie',category:'cold',     price:160, emoji:'🍓', tags:['veg'],                      desc:'Plump Mahabaleshwar strawberries blended with creamy Greek yogurt & honey', img:'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80' },
    { id:'mango-shake',      name:'Mango Shake',          category:'cold',     price:160, emoji:'🥭', tags:['veg','bestseller'],          desc:'Pure Alphonso mango pulp churned with chilled whole milk and pistachios', img:'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80' },
    { id:'lime-soda',        name:'Fresh Lime Soda',      category:'cold',     price:90,  emoji:'🍹', tags:['veg'],                      desc:'Fizzy sparkling soda with fresh squeezed key lime, black salt and mint', img:'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
    // ── QUICK BITES ───────────────────────────────────────────
    { id:'veg-sandwich',     name:'Veg Sandwich',         category:'bites',    price:130, emoji:'🥪', tags:['veg'],                      desc:'Crisp cucumber, tomatoes, cheddar cheese and coriander mint chutney on sourdough', img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
    { id:'cheese-sandwich',  name:'Cheese Sandwich',      category:'bites',    price:150, emoji:'🧀', tags:['veg','bestseller'],          desc:'Melted cheddar, mozzarella and gouda pressed until golden brown and gooey', img:'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&auto=format&fit=crop&q=80' },
    { id:'paneer-sandwich',  name:'Grilled Paneer Sandwich',category:'bites',  price:180, emoji:'🥙', tags:['veg','bestseller'],          desc:'Tandoori marinated cottage cheese, crunchy bell peppers and chipotle mayo', img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80' },
    { id:'french-fries',     name:'French Fries',         category:'bites',    price:120, emoji:'🍟', tags:['veg'],                      desc:'Golden salted shoestring potatoes served crisp with garlic aioli & ketchup', img:'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80' },
    { id:'peri-peri-fries',  name:'Peri-Peri Fries',      category:'bites',    price:140, emoji:'🌶️',tags:['veg','bestseller'],          desc:'Hot crispy potato fries dusted with fiery African bird-eye chilli blend', img:'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&auto=format&fit=crop&q=80' },
    { id:'garlic-bread',     name:'Garlic Bread',         category:'bites',    price:110, emoji:'🥖', tags:['veg'],                      desc:'Warm toasted French baguette topped with roasted garlic butter and oregano', img:'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&auto=format&fit=crop&q=80' },
    { id:'veg-burger',       name:'Veg Burger',           category:'bites',    price:160, emoji:'🍔', tags:['veg','bestseller'],          desc:'Crispy herb potato patty, molten cheese slice, lettuce, pickles & signature sauce', img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80' },
    // ── PIZZA & PASTA ─────────────────────────────────────────
    { id:'margherita-pizza', name:'Margherita Pizza',     category:'pizza',    price:280, emoji:'🍕', tags:['veg'],                      desc:'Handcrafted thin crust with crushed tomato, buffalo mozzarella & sweet basil', img:'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80' },
    { id:'farmhouse-pizza',  name:'Farmhouse Pizza',      category:'pizza',    price:320, emoji:'🌾', tags:['veg','bestseller'],          desc:'Crisp capsicum, red onions, mushrooms, juicy corn & extra stringy cheese', img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
    { id:'paneer-tikka-pizza',name:'Paneer Tikka Pizza',  category:'pizza',    price:360, emoji:'🧀', tags:['veg','bestseller'],          desc:'Smoky clay-oven paneer, charred bell peppers and spiced makhani reduction', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80' },
    { id:'white-sauce-pasta',name:'White Sauce Pasta',    category:'pizza',    price:240, emoji:'🍝', tags:['veg'],                      desc:'Penne tossed in silky parmesan alfredo sauce, sautéed mushrooms & broccoli', img:'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=600&auto=format&fit=crop&q=80' },
    { id:'red-sauce-pasta',  name:'Red Sauce Pasta',      category:'pizza',    price:220, emoji:'🍅', tags:['veg'],                      desc:'Al dente penne bathed in spicy arrabbiata tomato sauce, garlic oil & parsley', img:'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80' },
    // ── DESSERTS ──────────────────────────────────────────────
    { id:'chocolate-brownie',name:'Chocolate Brownie',    category:'desserts', price:110, emoji:'🍫', tags:['veg','bestseller'],          desc:'Dense, gooey dark chocolate fudge brownie with roasted walnuts and sea salt', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' },
    { id:'chocolate-lava-cake',name:'Chocolate Lava Cake',category:'desserts', price:160, emoji:'🌋', tags:['veg','bestseller'],          desc:'Decadent chocolate cake with a molten, streaming liquid chocolate centre', img:'https://images.unsplash.com/photo-1617305855058-336d24456869?w=600&auto=format&fit=crop&q=80' },
    { id:'blueberry-muffin', name:'Blueberry Muffin',     category:'desserts', price:100, emoji:'🫐', tags:['veg'],                      desc:'Fluffy golden muffin bursting with wild blueberries and a sweet turbinado crust', img:'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80' },
    { id:'cheesecake',       name:'Cheesecake',           category:'desserts', price:180, emoji:'🎂', tags:['veg','bestseller'],          desc:'Classic creamy Philadelphia style baked cheesecake on a buttery biscuit base', img:'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&auto=format&fit=crop&q=80' },
    { id:'chocolate-pastry', name:'Chocolate Pastry',     category:'desserts', price:130, emoji:'🍰', tags:['veg'],                      desc:'Delicate chocolate sponge layered with silken ganache and mirror glaze', img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
  ];

  /* ─────────────────────────────────────────────────────────────
     CART ENGINE — localStorage, no modules
  ───────────────────────────────────────────────────────────── */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e) { return []; }
  }
  function saveCart(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch(e) {}
  }

  var _cart = loadCart();
  var _subs = [];

  function notifyAll() {
    var snap = buildSnapshot();
    _subs.forEach(function(fn) { try { fn(snap); } catch(e) {} });
  }

  function buildSnapshot() {
    var subtotal = _cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
    var itemCount = _cart.reduce(function(s,i){ return s + i.qty; }, 0);
    var deliveryCharge = 0;
    if (subtotal > 0) {
      deliveryCharge = subtotal >= FREE_ABOVE ? 0 : DELIVERY_BASE;
    }
    var gstAmount = Math.round(subtotal * GST_PERCENT / 100);
    var total = subtotal + deliveryCharge + gstAmount;
    return { items: JSON.parse(JSON.stringify(_cart)), itemCount: itemCount, subtotal: subtotal, deliveryCharge: deliveryCharge, gstAmount: gstAmount, total: total };
  }

  function cartAdd(itemId) {
    var product = MENU_ITEMS.find(function(p){ return p.id === itemId; });
    if (!product) return;
    var existing = _cart.find(function(i){ return i.id === itemId; });
    if (existing) { existing.qty += 1; }
    else { _cart.push({ id: itemId, name: product.name, price: product.price, qty: 1, emoji: product.emoji }); }
    saveCart(_cart);
    notifyAll();
  }

  function cartDecrease(itemId) {
    var idx = _cart.findIndex(function(i){ return i.id === itemId; });
    if (idx === -1) return;
    _cart[idx].qty -= 1;
    if (_cart[idx].qty <= 0) _cart.splice(idx, 1);
    saveCart(_cart);
    notifyAll();
  }

  function cartRemove(itemId) {
    _cart = _cart.filter(function(i){ return i.id !== itemId; });
    saveCart(_cart);
    notifyAll();
  }

  function cartClear() {
    _cart = [];
    saveCart(_cart);
    notifyAll();
  }

  function cartQty(itemId) {
    var found = _cart.find(function(i){ return i.id === itemId; });
    return found ? found.qty : 0;
  }

  function onCartChange(fn) { _subs.push(fn); }

  /* ─────────────────────────────────────────────────────────────
     APP STATE
  ───────────────────────────────────────────────────────────── */
  var appState = {
    category: 'all',
    search: '',
    vegOnly: false,
    sort: 'default',
    deliveryMode: 'delivery',
    customerDistKm: 2.5,
  };

  /* ─────────────────────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ───────────────────────────────────────────────────────────── */
  function showToast(msg, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.setAttribute('role', 'status');
    toast.innerHTML = (type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ ') + msg;
    container.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 3500);
  }

  /* ─────────────────────────────────────────────────────────────
     MENU RENDERING
  ───────────────────────────────────────────────────────────── */
  function getFilteredItems() {
    var list = MENU_ITEMS;
    if (appState.category && appState.category !== 'all') {
      list = list.filter(function(i){ return i.category === appState.category; });
    }
    if (appState.vegOnly) {
      list = list.filter(function(i){ return i.tags.indexOf('veg') !== -1; });
    }
    if (appState.search && appState.search.trim()) {
      var q = appState.search.toLowerCase().trim();
      list = list.filter(function(i){
        return i.name.toLowerCase().indexOf(q) !== -1 ||
               i.desc.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (appState.sort === 'price-low') { list = list.slice().sort(function(a,b){ return a.price - b.price; }); }
    else if (appState.sort === 'price-high') { list = list.slice().sort(function(a,b){ return b.price - a.price; }); }
    return list;
  }

  function renderMenu() {
    var grid = document.getElementById('menuGrid');
    if (!grid) return;

    var items = getFilteredItems();

    if (!items.length) {
      grid.innerHTML = '<div class="menu-empty-state"><p>No items match your search. Try a different filter!</p></div>';
      return;
    }

    grid.innerHTML = items.map(function(item) {
      var qty = cartQty(item.id);
      var isBest = item.tags.indexOf('bestseller') !== -1;
      var btnHtml = qty > 0
        ? '<div class="qty-counter">' +
            '<button class="qty-btn btn-minus" data-id="' + item.id + '" aria-label="Decrease">−</button>' +
            '<span class="qty-val">' + qty + '</span>' +
            '<button class="qty-btn btn-plus" data-id="' + item.id + '" aria-label="Increase">+</button>' +
          '</div>'
        : '<button class="add-btn" data-id="' + item.id + '" aria-label="Add ' + item.name + ' to cart">' +
            '<span>+</span><span>Add</span>' +
          '</button>';

      return '<article class="food-card" data-id="' + item.id + '">' +
        '<div class="food-card-media">' +
          '<img src="' + item.img + '" alt="' + item.name + '" class="food-card-img" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<div class="food-card-badges">' +
            '<span class="badge-veg" title="Vegetarian"><span class="veg-icon-badge"><span class="veg-icon-dot"></span></span></span>' +
            (isBest ? '<span class="badge-bestseller">⭐ Bestseller</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="food-card-body">' +
          '<h3 class="food-card-title">' + item.name + '</h3>' +
          '<p class="food-card-desc">' + item.desc + '</p>' +
          '<div class="food-card-footer">' +
            '<span class="food-card-price">₹' + item.price + '</span>' +
            '<div class="food-card-action">' + btnHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    // Attach Add to Cart events
    grid.querySelectorAll('.add-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        cartAdd(id);
        var item = MENU_ITEMS.find(function(p){ return p.id === id; });
        showToast('Added ' + (item ? item.name : 'item') + ' to cart! 🛒', 'success');
        bumpBadge();
      });
    });
    grid.querySelectorAll('.btn-plus').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartAdd(btn.getAttribute('data-id'));
      });
    });
    grid.querySelectorAll('.btn-minus').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDecrease(btn.getAttribute('data-id'));
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     CATEGORY CHIPS
  ───────────────────────────────────────────────────────────── */
  function renderCategoryChips() {
    var container = document.getElementById('categoryChips');
    if (!container) return;
    container.innerHTML = CATEGORIES.map(function(cat) {
      var active = cat.id === appState.category ? ' active' : '';
      return '<button class="category-chip' + active + '" data-cat="' + cat.id + '">' +
               cat.emoji + ' ' + cat.label +
             '</button>';
    }).join('');
    container.querySelectorAll('.category-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        appState.category = btn.getAttribute('data-cat');
        container.querySelectorAll('.category-chip').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        renderMenu();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     MENU CONTROLS (search, veg toggle, sort)
  ───────────────────────────────────────────────────────────── */
  function initMenuControls() {
    var searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        appState.search = e.target.value;
        renderMenu();
      });
    }

    var vegToggle = document.getElementById('vegOnlyToggle');
    if (vegToggle) {
      vegToggle.addEventListener('change', function() {
        appState.vegOnly = vegToggle.checked;
        renderMenu();
      });
    }

    var sortSelect = document.getElementById('menuSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        appState.sort = sortSelect.value;
        renderMenu();
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     CART BADGE
  ───────────────────────────────────────────────────────────── */
  function bumpBadge() {
    var badge = document.getElementById('navCartBadge');
    if (!badge) return;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }

  /* ─────────────────────────────────────────────────────────────
     CART DRAWER UI
  ───────────────────────────────────────────────────────────── */
  function updateCartDrawer(snap) {
    // Update badge
    var badge = document.getElementById('navCartBadge');
    if (badge) badge.textContent = snap.itemCount;

    // Update totals
    var sub = document.getElementById('cartDrawerSubtotal');
    var tax = document.getElementById('cartDrawerTax');
    var del = document.getElementById('cartDrawerDelivery');
    var tot = document.getElementById('cartDrawerTotal');
    if (sub) sub.textContent = '₹' + snap.subtotal;
    if (tax) tax.textContent = '₹' + snap.gstAmount;
    if (del) del.textContent = snap.deliveryCharge === 0 ? 'FREE' : '₹' + snap.deliveryCharge;
    if (tot) tot.textContent = '₹' + snap.total;

    // Update items container
    var itemsContainer = document.getElementById('cartDrawerItems');
    if (!itemsContainer) return;
    if (!snap.items.length) {
      itemsContainer.innerHTML = '<div class="cart-empty-state">' +
        '<span class="cart-empty-icon">☕</span>' +
        '<h4>Your Cart is Empty</h4>' +
        '<p style="font-size:0.85rem; margin-top:0.4rem;">Explore our specialty coffees, wood-fired pizzas and desserts!</p>' +
      '</div>';
      return;
    }
    itemsContainer.innerHTML = snap.items.map(function(item) {
      return '<div class="cart-item-row">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + (item.emoji || '🍽️') + ' ' + item.name + '</div>' +
          '<div class="cart-item-price">₹' + item.price + ' × ' + item.qty + ' = ₹' + (item.price * item.qty) + '</div>' +
          '<span class="cart-item-remove" data-id="' + item.id + '">Remove</span>' +
        '</div>' +
        '<div class="qty-counter">' +
          '<button class="qty-btn cart-btn-minus" data-id="' + item.id + '">−</button>' +
          '<span class="qty-val">' + item.qty + '</span>' +
          '<button class="qty-btn cart-btn-plus" data-id="' + item.id + '">+</button>' +
        '</div>' +
      '</div>';
    }).join('');

    itemsContainer.querySelectorAll('.cart-btn-plus').forEach(function(btn) {
      btn.addEventListener('click', function(){ cartAdd(btn.getAttribute('data-id')); });
    });
    itemsContainer.querySelectorAll('.cart-btn-minus').forEach(function(btn) {
      btn.addEventListener('click', function(){ cartDecrease(btn.getAttribute('data-id')); });
    });
    itemsContainer.querySelectorAll('.cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function(){
        cartRemove(btn.getAttribute('data-id'));
        showToast('Item removed from cart', 'info');
      });
    });

    // Re-render menu to update qty counters on food cards
    renderMenu();
  }

  function initCartDrawer() {
    var openBtn     = document.getElementById('openCartBtn');
    var closeBtn    = document.getElementById('closeCartBtn');
    var backdrop    = document.getElementById('cartDrawerBackdrop');
    var drawer      = document.getElementById('cartDrawer');
    var proceedBtn  = document.getElementById('proceedCheckoutBtn');

    function openDrawer(e) {
      if (e) e.preventDefault();
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (openBtn)   openBtn.addEventListener('click', openDrawer);
    if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
    if (backdrop)  backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) closeDrawer();
    });

    if (proceedBtn) {
      proceedBtn.addEventListener('click', function() {
        var snap = buildSnapshot();
        if (!snap.itemCount) {
          showToast('Your cart is empty! Add some delicious dishes first.', 'error');
          return;
        }
        closeDrawer();
        openCheckoutModal();
      });
    }

    // Subscribe: update drawer and menu on every cart change
    onCartChange(function(snap) {
      updateCartDrawer(snap);
    });

    // Initial render
    updateCartDrawer(buildSnapshot());
  }

  /* ─────────────────────────────────────────────────────────────
     CHECKOUT MODAL
  ───────────────────────────────────────────────────────────── */
  function openCheckoutModal() {
    var modal = document.getElementById('checkoutModal');
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    updateCheckoutSummary();
  }

  function closeCheckoutModal() {
    var modal = document.getElementById('checkoutModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
  }

  function updateCheckoutSummary() {
    var isDelivery = appState.deliveryMode === 'delivery';
    var snap = buildSnapshot();
    var subtotal = snap.subtotal;
    var deliveryFee = isDelivery ? snap.deliveryCharge : 0;
    var gst = snap.gstAmount;
    var total = isDelivery ? snap.total : (subtotal + gst);

    function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
    setEl('checkoutSubtotal', '₹' + subtotal);
    setEl('checkoutDeliveryFee', isDelivery ? (deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee) : '—');
    setEl('checkoutGst', '₹' + gst);
    setEl('checkoutTotal', '₹' + total);

    // Order items list
    var list = document.getElementById('checkoutItemsList');
    if (list) {
      list.innerHTML = snap.items.map(function(i){
        return '<div style="display:flex;justify-content:space-between;font-size:0.9rem;padding:0.3rem 0;border-bottom:1px dashed rgba(0,0,0,0.08);">' +
          '<span>' + (i.emoji || '🍽️') + ' ' + i.name + ' × ' + i.qty + '</span>' +
          '<span>₹' + (i.price * i.qty) + '</span>' +
        '</div>';
      }).join('') || '<p style="color:#666;font-size:0.85rem;">No items</p>';
    }
  }

  function initCheckoutModal() {
    var closeBtn    = document.getElementById('closeCheckoutBtn');
    var modeButtons = document.querySelectorAll('.delivery-mode-btn');
    var form        = document.getElementById('checkoutForm');

    if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);

    modeButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        modeButtons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        appState.deliveryMode = btn.getAttribute('data-mode') || 'delivery';

        // Show/hide delivery fields
        var deliveryFields = document.getElementById('deliveryAddressFields');
        var dineInFields   = document.getElementById('dineInFields');
        if (deliveryFields) deliveryFields.style.display = appState.deliveryMode === 'delivery' ? 'block' : 'none';
        if (dineInFields)   dineInFields.style.display   = appState.deliveryMode === 'dinein'   ? 'block' : 'none';

        updateCheckoutSummary();
      });
    });

    // Payment radio card styling
    document.querySelectorAll('input[name="paymentMethod"]').forEach(function(input) {
      input.addEventListener('change', function() {
        document.querySelectorAll('.payment-card-option').forEach(function(card){ card.classList.remove('active'); });
        var parent = input.closest('.payment-card-option');
        if (parent) parent.classList.add('active');
      });
    });

    // Form submit → WhatsApp
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleWhatsAppOrder();
      });
    }

    // Handle address field live validation removal
    ['custName','custPhone','custAddress','custLocality','custPin'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function(){ el.classList.remove('invalid'); });
    });

    // Done button in WhatsApp sent dialog
    var doneBtn = document.getElementById('dialogDoneBtn');
    if (doneBtn) {
      doneBtn.addEventListener('click', function() {
        cartClear();
        closeCheckoutModal();
        var checkoutForm = document.getElementById('checkoutForm');
        var waDialog     = document.getElementById('whatsappSentDialog');
        if (checkoutForm) checkoutForm.style.display = 'block';
        if (waDialog)     waDialog.style.display = 'none';
      });
    }

    onCartChange(function(){ updateCheckoutSummary(); });
  }

  /* ─────────────────────────────────────────────────────────────
     WHATSAPP ORDER SUBMISSION
  ───────────────────────────────────────────────────────────── */
  function handleWhatsAppOrder() {
    var isDelivery = appState.deliveryMode === 'delivery';
    var snap = buildSnapshot();

    if (!snap.itemCount) {
      showToast('Your cart is empty! Please add items before placing an order.', 'error');
      return;
    }

    // Read form fields
    var nameInput  = document.getElementById('custName');
    var phoneInput = document.getElementById('custPhone');
    var addrInput  = document.getElementById('custAddress');
    var localInput = document.getElementById('custLocality');
    var pinInput   = document.getElementById('custPin');
    var landmarkInput  = document.getElementById('custLandmark');
    var tableInput     = document.getElementById('custTable');
    var notesInput     = document.getElementById('custNotes');
    var paymentInput   = document.querySelector('input[name="paymentMethod"]:checked');

    var nameVal    = nameInput  ? nameInput.value.trim()  : '';
    var rawPhone   = phoneInput ? phoneInput.value.trim() : '';
    var phoneVal   = rawPhone.replace(/\D/g, '');
    var paymentMethod = paymentInput ? paymentInput.value : 'Cash on Delivery';

    var isValid = true;

    if (!nameVal) { if (nameInput) nameInput.classList.add('invalid'); isValid = false; }
    else           { if (nameInput) nameInput.classList.remove('invalid'); }

    if (!/^[6-9]\d{9}$/.test(phoneVal)) { if (phoneInput) phoneInput.classList.add('invalid'); isValid = false; }
    else                                  { if (phoneInput) phoneInput.classList.remove('invalid'); }

    if (isDelivery) {
      var addrVal  = addrInput  ? addrInput.value.trim()  : '';
      var localVal = localInput ? localInput.value.trim() : '';
      var pinVal   = pinInput   ? pinInput.value.trim()   : '';
      if (!addrVal)  { if (addrInput)  addrInput.classList.add('invalid');  isValid = false; }
      else            { if (addrInput)  addrInput.classList.remove('invalid'); }
      if (!localVal) { if (localInput) localInput.classList.add('invalid'); isValid = false; }
      else            { if (localInput) localInput.classList.remove('invalid'); }
      if (!/^\d{6}$/.test(pinVal)) { if (pinInput) pinInput.classList.add('invalid'); isValid = false; }
      else                          { if (pinInput) pinInput.classList.remove('invalid'); }
    }

    if (!isValid) {
      showToast('Please fill in all required fields highlighted in red.', 'error');
      return;
    }

    // Validate WhatsApp number
    if (!WA_NUMBER || WA_NUMBER.length < 10) {
      showToast('WhatsApp number is not configured in app-bootstrap.js.', 'error');
      return;
    }

    // Disable button
    var confirmBtn     = document.getElementById('confirmOrderBtn');
    var confirmBtnText = document.getElementById('confirmOrderBtnText');
    if (confirmBtn) { confirmBtn.disabled = true; }
    if (confirmBtnText) confirmBtnText.textContent = 'Preparing WhatsApp message...';

    // Generate 4-digit order reference
    var orderRef = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    var subtotal    = snap.subtotal;
    var deliveryFee = isDelivery ? snap.deliveryCharge : 0;
    var totalAmount = isDelivery ? snap.total : (subtotal + snap.gstAmount);

    // Save to localStorage for order tracking
    localStorage.setItem('bnb_last_order_id', orderRef);
    localStorage.setItem('bnb_last_order_data', JSON.stringify({
      orderId: orderRef,
      items: snap.items.map(function(i){ return { name: i.name, qty: i.qty, price: i.price, emoji: i.emoji }; }),
      subtotal: subtotal,
      deliveryCharge: deliveryFee,
      gstAmount: snap.gstAmount,
      total: totalAmount,
      orderType: appState.deliveryMode,
      customerName: nameVal,
      customerPhone: phoneVal,
      timestamp: new Date().toISOString(),
      status: 'received'
    }));

    // Build WhatsApp message
    var msg = "Hello Brew & Bloom Café! I'd like to place an order.\n\n";
    msg += "ORDER DETAILS\n";
    msg += "Order ID: " + orderRef + "\n\n";
    msg += "Items:\n";
    snap.items.forEach(function(item, index) {
      msg += (index + 1) + ". " + item.name + " x " + item.qty + " = ₹" + (item.price * item.qty) + "\n";
    });
    msg += "\nSubtotal: ₹" + subtotal + "\n";
    if (isDelivery) {
      msg += "Delivery Fee: " + (deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee) + "\n";
    }
    msg += "Total Amount: ₹" + totalAmount + "\n\n";

    var orderTypeLabel = isDelivery ? 'Home Delivery' : (appState.deliveryMode === 'takeaway' ? 'Takeaway' : 'Dine-In');
    msg += "ORDER TYPE: " + orderTypeLabel + "\n\n";
    msg += "CUSTOMER DETAILS\n";
    msg += "Name: " + nameVal + "\n";
    msg += "Phone: " + phoneVal + "\n";

    var landmarkVal = landmarkInput ? landmarkInput.value.trim() : '';
    var notesVal    = notesInput    ? notesInput.value.trim()    : '';
    var tableVal    = tableInput    ? tableInput.value.trim()    : '';

    if (isDelivery) {
      var fullAddr = addrInput.value.trim() + ', ' + localInput.value.trim() + ', Haldia - ' + pinInput.value.trim();
      msg += "Delivery Address: " + fullAddr + "\n";
      if (landmarkVal) msg += "Landmark: " + landmarkVal + "\n";
      if (notesVal)    msg += "Delivery Instructions: " + notesVal + "\n";
    } else if (appState.deliveryMode === 'takeaway') {
      if (notesVal) msg += "Pickup Instructions: " + notesVal + "\n";
    } else if (appState.deliveryMode === 'dinein') {
      if (tableVal) msg += "Table / Seating Info: " + tableVal + "\n";
      if (notesVal) msg += "Dine-In Instructions: " + notesVal + "\n";
    }

    msg += "\nPAYMENT METHOD: " + paymentMethod + "\n\n";
    msg += "Please confirm my order and estimated delivery time. Thank you!";

    var waUrl = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);

    // Open WhatsApp
    var waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');

    // If popup blocked (mobile), try reopening via link
    if (!waWindow || waWindow.closed) {
      setTimeout(function() {
        var reopenLink = document.getElementById('dialogReopenWaLink');
        if (reopenLink) { reopenLink.href = waUrl; reopenLink.click(); }
        else { window.location.href = waUrl; }
      }, 150);
    }

    // Show success dialog
    var checkoutForm = document.getElementById('checkoutForm');
    var waDialog     = document.getElementById('whatsappSentDialog');
    if (checkoutForm && waDialog) {
      checkoutForm.style.display = 'none';
      waDialog.style.display = 'block';
      var dialogOrderId = document.getElementById('dialogOrderId');
      if (dialogOrderId) dialogOrderId.textContent = 'Order ID: ' + orderRef;
      var dialogReopenLink = document.getElementById('dialogReopenWaLink');
      if (dialogReopenLink) dialogReopenLink.href = waUrl;
    }

    showToast('WhatsApp launched! Press Send in WhatsApp to confirm your order.', 'info');

    if (confirmBtn) { confirmBtn.disabled = false; }
    if (confirmBtnText) confirmBtnText.textContent = 'Place Order on WhatsApp';
  }

  /* ─────────────────────────────────────────────────────────────
     NAVBAR — hamburger + sticky + WhatsApp links
  ───────────────────────────────────────────────────────────── */
  function initNavbar() {
    var navbar    = document.getElementById('navbar');
    var ham       = document.getElementById('hamburger');
    var navLinks  = document.getElementById('navLinks');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
      if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 60);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    if (ham && navLinks) {
      ham.addEventListener('click', function() {
        var open = ham.classList.toggle('open');
        navLinks.classList.toggle('open', open);
      });
      navLinks.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
          ham.classList.remove('open');
          navLinks.classList.remove('open');
        });
      });
    }

    if (backToTop) {
      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Wire WhatsApp links
    var waHref = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent("Hello Brew & Bloom Café! I'd like to place an order.");
    document.querySelectorAll('.whatsapp-order').forEach(function(el) {
      el.href = waHref;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ─────────────────────────────────────────────────────────────
     BESTSELLERS SECTION — "Add to Cart" buttons in static HTML
  ───────────────────────────────────────────────────────────── */
  function initBestsellerButtons() {
    document.querySelectorAll('.add-to-cart-direct[data-item-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-item-id');
        cartAdd(id);
        var item = MENU_ITEMS.find(function(p){ return p.id === id; });
        showToast('Added ' + (item ? item.name : 'item') + ' to cart! 🛒', 'success');
        bumpBadge();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     MAIN INIT
  ───────────────────────────────────────────────────────────── */
  function init() {
    console.log('%c☕ Brew & Bloom — Bootstrap Loaded', 'color:#FF7629;font-weight:bold;font-size:15px;');
    initNavbar();
    renderCategoryChips();
    renderMenu();
    initMenuControls();
    initCartDrawer();
    initCheckoutModal();
    initBestsellerButtons();
    console.log('%c✅ All event listeners attached. Cart and WhatsApp checkout ready.', 'color:#27AE60;font-weight:600;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); // DOM already ready
  }

})();
