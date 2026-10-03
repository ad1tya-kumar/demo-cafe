/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BREW & BLOOM CAFÉ — COMPLETE MENU DATA                 ║
 * ║  High-resolution food photography, pricing, categories, ║
 * ║  and vegetarian / bestseller badges.                    ║
 * ╚══════════════════════════════════════════════════════════╝
 */

export const CATEGORIES = [
  { id: 'all',      label: 'All Items',        emoji: '🍽️' },
  { id: 'coffee',   label: 'Coffee',           emoji: '☕' },
  { id: 'tea',      label: 'Tea',              emoji: '🍵' },
  { id: 'cold',     label: 'Cold Beverages',   emoji: '🥤' },
  { id: 'bites',    label: 'Quick Bites',      emoji: '🥪' },
  { id: 'pizza',    label: 'Pizza & Pasta',    emoji: '🍕' },
  { id: 'desserts', label: 'Desserts',         emoji: '🍰' },
];

// Curated Category Banners with title, subtitle, and photography
export const CATEGORY_BANNERS = {
  pizza: {
    title: 'Artisan Wood-Fired Pizzas',
    subtitle: 'Hand-stretched dough, San Marzano tomato sauce & melted mozzarella',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
    tag: 'Fresh from the Oven',
    cta: 'Explore Pizzas'
  },
  pasta: {
    title: 'Silky Handcrafted Pastas',
    subtitle: 'Authentic Italian style with rich sauces, roasted garlic & herbs',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=1200&auto=format&fit=crop&q=80',
    tag: 'Chef Specials',
    cta: 'Explore Pastas'
  },
  smoothies: {
    title: 'Chilled Frappes & Fruit Smoothies',
    subtitle: 'Blended with fresh seasonal fruits, creamy milk, and rich flavors',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=1200&auto=format&fit=crop&q=80',
    tag: 'Cool & Refreshing',
    cta: 'Explore Coolers'
  },
  desserts: {
    title: 'Decadent In-House Desserts',
    subtitle: 'Baked fresh daily with Belgian chocolate, berries & pure butter',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
    tag: 'Sweet Moments',
    cta: 'Explore Sweets'
  }
};

export const MENU_ITEMS = [
  // ── COFFEE ─────────────────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'coffee',
    price: 80,
    description: 'Rich, bold single-origin double shot with a velvety golden crema',
    tags: ['veg'],
    emoji: '☕',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'coffee',
    price: 120,
    description: 'Espresso with silky steamed milk and a thick, cloud-like foam dusting',
    tags: ['veg', 'bestseller'],
    emoji: '☕',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'cafe-latte',
    name: 'Café Latte',
    category: 'coffee',
    price: 130,
    description: 'Smooth espresso stretched with creamy steamed milk and artisan latte art',
    tags: ['veg'],
    emoji: '☕',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'coffee',
    price: 100,
    description: 'Double espresso pulled over hot water for a crisp, intense roast profile',
    tags: ['veg'],
    emoji: '☕',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'mocha',
    name: 'Mocha',
    category: 'coffee',
    price: 150,
    description: 'Espresso with rich Dutch cocoa, steamed milk, and whipped cream crown',
    tags: ['veg', 'bestseller'],
    emoji: '🍫',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    category: 'coffee',
    price: 160,
    description: 'Steamed milk stained with espresso, vanilla bean syrup & salted caramel',
    tags: ['veg', 'bestseller'],
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    category: 'coffee',
    price: 140,
    description: 'Thick, creamy chilled espresso blended with vanilla ice cream and milk',
    tags: ['veg'],
    emoji: '🧊',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // ── TEA ────────────────────────────────────────────────
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    category: 'tea',
    price: 70,
    description: 'Handcrafted kadak tea infused with Assam leaves, ginger, cloves & cardamom',
    tags: ['veg', 'bestseller'],
    emoji: '🍵',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'ginger-tea',
    name: 'Ginger Tea',
    category: 'tea',
    price: 70,
    description: 'Crushed organic ginger root brewed hot with fresh milk and organic jaggery',
    tags: ['veg'],
    emoji: '🫚',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'green-tea',
    name: 'Green Tea',
    category: 'tea',
    price: 90,
    description: 'Whole leaf Darjeeling green tea rich in antioxidants with a soothing herbal finish',
    tags: ['veg'],
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'lemon-tea',
    name: 'Lemon Tea',
    category: 'tea',
    price: 80,
    description: 'Clarified spiced black tea with fresh squeezed Kolkata lemon & wild honey',
    tags: ['veg'],
    emoji: '🍋',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    category: 'tea',
    price: 110,
    description: 'Peach & lemon brewed tea poured over cracked ice with sprigs of fresh mint',
    tags: ['veg'],
    emoji: '🧊',
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // ── COLD BEVERAGES ─────────────────────────────────────
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    category: 'cold',
    price: 150,
    description: 'Bold espresso poured over cold milk and ice cubes for a smooth, refreshing sip',
    tags: ['veg'],
    emoji: '🥤',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'chocolate-frappe',
    name: 'Chocolate Frappe',
    category: 'cold',
    price: 170,
    description: 'Dark Belgian chocolate ganache blended with crushed ice and chocolate drizzle',
    tags: ['veg', 'bestseller'],
    emoji: '🍫',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'oreo-shake',
    name: 'Oreo Shake',
    category: 'cold',
    price: 180,
    description: 'Creamy vanilla ice cream shake blended with whole crunchy Oreo cookies',
    tags: ['veg', 'bestseller'],
    emoji: '🥛',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'strawberry-smoothie',
    name: 'Strawberry Smoothie',
    category: 'cold',
    price: 160,
    description: 'Plump Mahabaleshwar strawberries blended with creamy Greek yogurt & honey',
    tags: ['veg'],
    emoji: '🍓',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'mango-shake',
    name: 'Mango Shake',
    category: 'cold',
    price: 160,
    description: 'Pure Alphonso mango pulp churned with chilled whole milk and pistachios',
    tags: ['veg', 'bestseller'],
    emoji: '🥭',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'lime-soda',
    name: 'Fresh Lime Soda',
    category: 'cold',
    price: 90,
    description: 'Fizzy sparkling soda with fresh squeezed key lime, black salt and mint',
    tags: ['veg'],
    emoji: '🍹',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // ── QUICK BITES ────────────────────────────────────────
  {
    id: 'veg-sandwich',
    name: 'Veg Sandwich',
    category: 'bites',
    price: 130,
    description: 'Crisp cucumber, tomatoes, cheddar cheese and coriander mint chutney on sourdough',
    tags: ['veg'],
    emoji: '🥪',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'cheese-sandwich',
    name: 'Cheese Sandwich',
    category: 'bites',
    price: 150,
    description: 'Melted cheddar, mozzarella and gouda pressed until golden brown and gooey',
    tags: ['veg', 'bestseller'],
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'paneer-sandwich',
    name: 'Grilled Paneer Sandwich',
    category: 'bites',
    price: 180,
    description: 'Tandoori marinated cottage cheese, crunchy bell peppers, onions and chipotle mayo',
    tags: ['veg', 'bestseller'],
    emoji: '🥙',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    category: 'bites',
    price: 120,
    description: 'Golden salted shoestring potatoes served crisp with garlic aioli & ketchup',
    tags: ['veg'],
    emoji: '🍟',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'peri-peri-fries',
    name: 'Peri-Peri Fries',
    category: 'bites',
    price: 140,
    description: 'Hot crispy potato fries dusted with fiery African bird-eye chilli blend',
    tags: ['veg', 'spicy', 'bestseller'],
    emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    category: 'bites',
    price: 110,
    description: 'Warm toasted French baguette topped with roasted garlic butter and oregano',
    tags: ['veg'],
    emoji: '🥖',
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'veg-burger',
    name: 'Veg Burger',
    category: 'bites',
    price: 160,
    description: 'Crispy herb potato patty, molten cheese slice, lettuce, pickles & signature sauce',
    tags: ['veg', 'bestseller'],
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // ── PIZZA AND PASTA ────────────────────────────────────
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    category: 'pizza',
    price: 280,
    description: 'Handcrafted thin crust with crushed tomato, buffalo mozzarella & sweet basil',
    tags: ['veg'],
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'farmhouse-pizza',
    name: 'Farmhouse Pizza',
    category: 'pizza',
    price: 320,
    description: 'Crisp capsicum, red onions, mushrooms, juicy corn & extra stringy cheese',
    tags: ['veg', 'bestseller'],
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'paneer-tikka-pizza',
    name: 'Paneer Tikka Pizza',
    category: 'pizza',
    price: 360,
    description: 'Smoky clay-oven paneer, charred bell peppers, coriander and spiced makhani reduction',
    tags: ['veg', 'bestseller', 'spicy'],
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    category: 'pizza',
    price: 240,
    description: 'Penne tossed in silky parmesan alfredo sauce, sautéed button mushrooms & broccoli',
    tags: ['veg'],
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'red-sauce-pasta',
    name: 'Red Sauce Pasta',
    category: 'pizza',
    price: 220,
    description: 'Al dente penne bathed in spicy arrabbiata tomato sauce, garlic oil & fresh parsley',
    tags: ['veg', 'spicy'],
    emoji: '🍅',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // ── DESSERTS ───────────────────────────────────────────
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    category: 'desserts',
    price: 110,
    description: 'Dense, gooey dark chocolate fudge brownie with roasted walnuts and sea salt',
    tags: ['veg', 'bestseller'],
    emoji: '🍫',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    category: 'desserts',
    price: 160,
    description: 'Decadent chocolate cake with a molten, streaming liquid chocolate centre',
    tags: ['veg', 'bestseller'],
    emoji: '🌋',
    image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'blueberry-muffin',
    name: 'Blueberry Muffin',
    category: 'desserts',
    price: 100,
    description: 'Fluffy golden muffin bursting with wild blueberries and a sweet turbinado crust',
    tags: ['veg'],
    emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake',
    category: 'desserts',
    price: 180,
    description: 'Classic creamy Philadelphia style baked cheesecake on a buttery biscuit base',
    tags: ['veg', 'bestseller'],
    emoji: '🎂',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'chocolate-pastry',
    name: 'Chocolate Pastry',
    category: 'desserts',
    price: 130,
    description: 'Delicate chocolate sponge layered with silken ganache and mirror glaze',
    tags: ['veg'],
    emoji: '🍰',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
];

export function getItemsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return MENU_ITEMS;
  return MENU_ITEMS.filter(i => i.category === categoryId);
}

export function searchAndFilterItems({ query = '', category = 'all', sort = 'default', vegOnly = false }) {
  let list = MENU_ITEMS;

  if (category && category !== 'all') {
    list = list.filter(i => i.category === category);
  }

  if (vegOnly) {
    list = list.filter(i => i.tags.includes('veg'));
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sort === 'bestseller') {
    list = [...list].sort((a, b) => (b.tags.includes('bestseller') ? 1 : 0) - (a.tags.includes('bestseller') ? 1 : 0));
  }

  return list;
}

export function getItemById(id) {
  return MENU_ITEMS.find(i => i.id === id) || null;
}
