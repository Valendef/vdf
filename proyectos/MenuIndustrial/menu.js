const CONFIG = {
  brand: "Café   ",
  hours: "  8AM<br>  9PM",  
  instagramUser: "@IndutrialCOFFEE",
  instagramUrl: "https://www.instagram.com"
};

const menuData = [
  {
    category: "Cafés Clásicos",
    items: [
      { name: "Espresso simple", price: 1500, desc: "Corto, intenso y directo." },
      { name: "Espresso doble", price: 2000, desc: "Doble shot para más cuerpo." },
      { name: "Americano", price: 1800, desc: "Espresso con agua caliente." },
      { name: "Macchiato", price: 2200, desc: "Espresso marcado con leche." },
      { name: "Cortado", price: 2000, desc: "Clásico argentino con leche." }
    ]
  },
  {
    category: "Cafés con Leche",
    items: [
      { name: "Flat White", price: 2800, desc: "Textura cremosa y sabor intenso." },
      { name: "Latte clásico", price: 2600, desc: "Suave, equilibrado y espumoso." },
      { name: "Latte vainilla / caramelo", price: 2900, desc: "Latte con syrup a elección." },
      { name: "Capuccino con cacao", price: 2700, desc: "Espuma, cacao y café." },
      { name: "Mocha chocolate amargo", price: 3000, desc: "Café con chocolate intenso." }
    ]
  },
  {
    category: "Métodos de Filtrado",
    items: [
      { name: "V60 origen único", price: 3200, desc: "Filtrado limpio y aromático." },
      { name: "Chemex 2 tazas", price: 4500, desc: "Ideal para compartir." },
      { name: "Aeropress", price: 3000, desc: "Cuerpo medio y sabor redondo." },
      { name: "French Press", price: 2800, desc: "Textura densa y notas profundas." }
    ]
  },
  {
    category: "Bebidas Frías",
    items: [
      { name: "Cold Brew", price: 3200, desc: "Extracción fría, suave y fresca." },
      { name: "Iced Latte", price: 3000, desc: "Latte frío con hielo." },
      { name: "Frappé moka", price: 3500, desc: "Café, hielo y chocolate." },
      { name: "Affogato", price: 3500, desc: "Espresso sobre helado." },
      { name: "Té helado de frutos rojos", price: 2500, desc: "Frutal, fresco y liviano." }
    ]
  },
  {
    category: "Especialidades de Autor",
    items: [
      { name: "Latte con leche de almendras", price: 3200, desc: "Opción vegetal y cremosa." },
      { name: "Matcha Latte", price: 3500, desc: "Matcha suave con leche." },
      { name: "Golden Milk", price: 3200, desc: "Cúrcuma, jengibre y leche vegetal." },
      { name: "Chai Latte especiado", price: 3000, desc: "Té especiado con leche." }
    ]
  },
  {
    category: "Pastelería Artesanal",
    items: [
      { name: "Croissant de manteca", price: 1800, desc: "Hojaldrado y dorado." },
      { name: "Medialuna rellena de dulce de leche", price: 2000, desc: "Clásica, dulce y potente." },
      { name: "Muffin de arándanos", price: 2200, desc: "Esponjoso con fruta." },
      { name: "Brownie con nueces", price: 2500, desc: "Húmedo, intenso y crocante." },
      { name: "Tarta de limón", price: 2800, desc: "Ácida, dulce y cremosa." },
      { name: "Carrot Cake con frosting", price: 3000, desc: "Especiada con crema." }
    ]
  },
  {
    category: "Opciones Saladas",
    items: [
      { name: "Sandwich de jamón y queso", price: 2200, desc: "Simple, rico y rendidor." },
      { name: "Tostado de pollo y palta", price: 2800, desc: "Pollo, palta y pan crocante." },
      { name: "Bagel con salmón y cream cheese", price: 3500, desc: "Fresco, salado y cremoso." },
      { name: "Quiche de espinaca y queso", price: 3000, desc: "Porción artesanal caliente." },
      { name: "Focaccia con tomates secos y oliva", price: 2700, desc: "Masa aireada estilo italiano." }
    ]
  }
];

const state = {
  activeCategory: "all",
  search: "",
  cart: new Map()
};

const els = {
  brandName: document.getElementById("brandName"),
  openHours: document.getElementById("openHours"),
  instagramLink: document.getElementById("instagramLink"),
  categoryNav: document.getElementById("categoryNav"),
  menuGrid: document.getElementById("menuGrid"),
  searchInput: document.getElementById("searchInput"),
  cartCount: document.getElementById("cartCount"),
  openCart: document.getElementById("openCart"),
  closeCart: document.getElementById("closeCart"),
  cartDrawer: document.getElementById("cartDrawer"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
  cartList: document.getElementById("cartList"),
  cartTotal: document.getElementById("cartTotal"),
  clearCart: document.getElementById("clearCart"),
  sendOrder: document.getElementById("sendOrder"),
  toast: document.getElementById("toast")
};

const money = (value) => `$${Number(value).toLocaleString("es-AR")}`;

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function boot() {
  els.brandName.textContent = CONFIG.brand.toUpperCase();
  els.openHours.innerHTML = CONFIG.hours;
  els.instagramLink.textContent = CONFIG.instagramUser;
  els.instagramLink.href = CONFIG.instagramUrl;

  renderCategories();
  renderMenu();
  bindEvents();
  updateCart();
}

function renderCategories() {
  const buttons = [
    `<button class="cat-btn active" data-category="all" type="button">Todo</button>`,
    ...menuData.map(
      (section) => `<button class="cat-btn" data-category="${slugify(section.category)}" type="button">${section.category}</button>`
    )
  ];

  els.categoryNav.innerHTML = buttons.join("");
}

function renderMenu() {
  const query = state.search.trim().toLowerCase();

  const sections = menuData
    .map((section) => {
      const sectionSlug = slugify(section.category);
      const categoryMatches = state.activeCategory === "all" || state.activeCategory === sectionSlug;
      if (!categoryMatches) return null;

      const items = section.items.filter((item) => {
        const haystack = `${section.category} ${item.name} ${item.desc}`.toLowerCase();
        return haystack.includes(query);
      });

      if (!items.length) return null;

      return { ...section, items };
    })
    .filter(Boolean);

  if (!sections.length) {
    els.menuGrid.innerHTML = `<div class="empty">No encontramos productos con esa búsqueda.</div>`;
    return;
  }

  const html = sections
    .map((section, index) => {
      const sectionHtml = `
        <section class="menu-section" id="${slugify(section.category)}">
          <h2 class="section-title">${section.category}</h2>
          <div class="items">
            ${section.items.map(itemTemplate).join("")}
          </div>
        </section>
      `;

      const shouldInsertPoster = index === 1 || index === 4;
      if (!shouldInsertPoster) return sectionHtml;

      const poster = index === 1
        ? `<aside class="poster"><strong>TAKE<br>AWAY</strong><span>Pedí, pasá y retiralo sin esperar.</span></aside>`
        : `<aside class="poster light"><strong>DM<br>ORDERS</strong><span>Armá tu pedido y escribinos por Instagram.</span></aside>`;

      return `${sectionHtml}${poster}`;
    })
    .join("");

  els.menuGrid.innerHTML = html;
}

function itemTemplate(item) {
  const id = slugify(item.name);

  return `
    <article class="menu-item">
      <div class="item-main">
        <div class="item-line">
          <span class="item-name">${item.name}</span>
          <span class="dots"></span>
          <span class="price">${money(item.price)}</span>
        </div>
        <p class="desc">${item.desc}</p>
      </div>
      <button class="add-btn" type="button" data-id="${id}" aria-label="Agregar ${item.name}">+</button>
    </article>
  `;
}

function findItemById(id) {
  for (const section of menuData) {
    const item = section.items.find((product) => slugify(product.name) === id);
    if (item) return { ...item, id, category: section.category };
  }

  return null;
}

function addToCart(id) {
  const item = findItemById(id);
  if (!item) return;

  const current = state.cart.get(id);

  if (current) {
    current.qty += 1;
    state.cart.set(id, current);
  } else {
    state.cart.set(id, { ...item, qty: 1 });
  }

  updateCart();
  showToast(`${item.name} agregado al pedido.`);
}

function updateQuantity(id, delta) {
  const item = state.cart.get(id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, item);
  }

  updateCart();
}

function updateCart() {
  const items = [...state.cart.values()];
  const count = items.reduce((acc, item) => acc + item.qty, 0);
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  els.cartCount.textContent = count;
  els.cartTotal.textContent = money(total);

  if (!items.length) {
    els.cartList.innerHTML = `<p class="empty">Todavía no agregaste productos.</p>`;
    return;
  }

  els.cartList.innerHTML = items
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item-top">
            <span>${item.name}</span>
            <span>${money(item.price * item.qty)}</span>
          </div>
          <div class="qty-row">
            <small>${money(item.price)} c/u</small>
            <div class="qty-controls">
              <button class="qty-btn" type="button" data-action="dec" data-id="${item.id}">−</button>
              <strong>${item.qty}</strong>
              <button class="qty-btn" type="button" data-action="inc" data-id="${item.id}">+</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function openDrawer() {
  els.cartDrawer.classList.add("open");
  els.drawerBackdrop.classList.add("show");
}

function closeDrawer() {
  els.cartDrawer.classList.remove("open");
  els.drawerBackdrop.classList.remove("show");
}

function buildOrderText() {
  const items = [...state.cart.values()];
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!items.length) return "";

  const lines = items.map((item) => `• ${item.qty}x ${item.name} — ${money(item.price * item.qty)}`);

  return `Hola! Quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}`;
}

async function copyOrderAndOpenInstagram() {
  const text = buildOrderText();

  if (!text) {
    showToast("Primero agregá algo al pedido.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Pedido copiado. Pegalo por DM en Instagram.");
  } catch (error) {
    showToast("No se pudo copiar. Igual abrimos Instagram.");
  }

  window.open(CONFIG.instagramUrl, "_blank", "noopener,noreferrer");
}

let toastTimer;

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderMenu();
  });

  els.categoryNav.addEventListener("click", (event) => {
    const btn = event.target.closest(".cat-btn");
    if (!btn) return;

    state.activeCategory = btn.dataset.category;
    document.querySelectorAll(".cat-btn").forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");
    renderMenu();
  });

  els.menuGrid.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-btn");
    if (!addBtn) return;

    addToCart(addBtn.dataset.id);
  });

  els.openCart.addEventListener("click", openDrawer);
  els.closeCart.addEventListener("click", closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);

  els.cartList.addEventListener("click", (event) => {
    const btn = event.target.closest(".qty-btn");
    if (!btn) return;

    const delta = btn.dataset.action === "inc" ? 1 : -1;
    updateQuantity(btn.dataset.id, delta);
  });

  els.clearCart.addEventListener("click", () => {
    state.cart.clear();
    updateCart();
    showToast("Pedido vacío.");
  });

  els.sendOrder.addEventListener("click", copyOrderAndOpenInstagram);
}

boot();
