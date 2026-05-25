const menuData = [
  {
    category: "Cafés Clásicos",
    items: [
      {
        name: "Espresso simple",
        description: "Intenso, corto y directo.",
        price: 1500
      },
      {
        name: "Espresso doble",
        description: "Doble carga de café.",
        price: 2000
      },
      {
        name: "Americano",
        description: "Espresso suavizado con agua caliente.",
        price: 1800
      },
      {
        name: "Macchiato",
        description: "Espresso con un toque de leche.",
        price: 2200
      }
    ]
  },
  {
    category: "Cafés con Leche",
    items: [
      {
        name: "Flat White",
        description: "Café intenso con leche texturizada.",
        price: 2800
      },
      {
        name: "Latte clásico",
        description: "Suave, cremoso y equilibrado.",
        price: 2600
      },
      {
        name: "Capuccino",
        description: "Espuma, leche y espresso en balance.",
        price: 2700
      },
      {
        name: "Mocha",
        description: "Con chocolate amargo.",
        price: 3000
      }
    ]
  },
  {
    category: "Métodos de Filtrado",
    items: [
      {
        name: "V60",
        description: "Café de origen único.",
        price: 3200
      },
      {
        name: "Chemex",
        description: "Ideal para compartir. Rinde 2 tazas.",
        price: 4500
      },
      {
        name: "Aeropress",
        description: "Filtrado con cuerpo y carácter.",
        price: 3000
      }
    ]
  },
  {
    category: "Bebidas Frías",
    items: [
      {
        name: "Cold Brew",
        description: "Infusión fría, suave y refrescante.",
        price: 3200
      },
      {
        name: "Iced Latte",
        description: "Latte frío con hielo.",
        price: 3000
      },
      {
        name: "Affogato",
        description: "Espresso servido sobre helado.",
        price: 3500
      }
    ]
  },
  {
    category: "Pastelería Artesanal",
    items: [
      {
        name: "Croissant de manteca",
        description: "Hojaldrado, dorado y artesanal.",
        price: 1800
      },
      {
        name: "Muffin de arándanos",
        description: "Esponjoso y frutal.",
        price: 2200
      },
      {
        name: "Brownie con nueces",
        description: "Chocolate intenso con nueces.",
        price: 2500
      },
      {
        name: "Tarta de limón",
        description: "Dulce, ácida y cremosa.",
        price: 2800
      }
    ]
  }
];

const menuGrid = document.getElementById("menuGrid");
const categoryTabs = document.getElementById("categoryTabs");
const searchInput = document.getElementById("searchInput");
const orderCount = document.getElementById("orderCount");
const orderTotal = document.getElementById("orderTotal");
const selectedList = document.getElementById("selectedList");
const clearOrderBtn = document.getElementById("clearOrderBtn");

let activeCategory = "Todas";
let searchTerm = "";
let selectedItems = [];

function formatPrice(price) {
  return `$${price.toLocaleString("es-AR")}`;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createCategoryTabs() {
  const categories = ["Todas", ...menuData.map(section => section.category)];

  categoryTabs.innerHTML = categories
    .map(category => {
      const isActive = category === activeCategory ? "active" : "";

      return `
        <button class="${isActive}" type="button" data-category="${category}">
          ${category}
        </button>
      `;
    })
    .join("");

  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      createCategoryTabs();
      renderMenu();
    });
  });
}

function getFilteredMenu() {
  const normalizedSearch = normalizeText(searchTerm.trim());

  return menuData
    .filter(section => {
      return activeCategory === "Todas" || section.category === activeCategory;
    })
    .map(section => {
      const filteredItems = section.items.filter(item => {
        const itemText = normalizeText(`${item.name} ${item.description} ${section.category}`);
        return itemText.includes(normalizedSearch);
      });

      return {
        ...section,
        items: filteredItems
      };
    })
    .filter(section => section.items.length > 0);
}

function renderMenu() {
  const filteredMenu = getFilteredMenu();

  if (filteredMenu.length === 0) {
    menuGrid.innerHTML = `
      <div class="no-results">
        <h2>No encontramos eso</h2>
        <p>Probá buscar otra bebida o categoría.</p>
      </div>
    `;
    return;
  }

  menuGrid.innerHTML = filteredMenu
    .map(section => {
      const itemsHTML = section.items
        .map(item => {
          return `
            <article class="menu-item">
              <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
              </div>

              <div class="price-area">
                <span class="price">${formatPrice(item.price)}</span>
                <button 
                  class="add-btn" 
                  type="button"
                  data-name="${item.name}"
                  data-price="${item.price}"
                >
                  Agregar
                </button>
              </div>
            </article>
          `;
        })
        .join("");

      return `
        <section class="menu-section">
          <div class="section-header">
            <h2>${section.category}</h2>
            <span class="section-count">${section.items.length}</span>
          </div>

          ${itemsHTML}
        </section>
      `;
    })
    .join("");

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      addItem(button.dataset.name, Number(button.dataset.price));
    });
  });
}

function addItem(name, price) {
  const existingItem = selectedItems.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedItems.push({
      name,
      price,
      quantity: 1
    });
  }

  renderOrder();
}

function removeItem(name) {
  selectedItems = selectedItems
    .map(item => {
      if (item.name === name) {
        return {
          ...item,
          quantity: item.quantity - 1
        };
      }

      return item;
    })
    .filter(item => item.quantity > 0);

  renderOrder();
}

function renderOrder() {
  const totalQuantity = selectedItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  orderCount.textContent = totalQuantity === 1
    ? "1 producto"
    : `${totalQuantity} productos`;

  orderTotal.textContent = formatPrice(totalPrice);

  if (selectedItems.length === 0) {
    selectedList.classList.remove("show");
    selectedList.innerHTML = "";
    return;
  }

  selectedList.classList.add("show");

  selectedList.innerHTML = selectedItems
    .map(item => {
      return `
        <div class="selected-row">
          <span>${item.quantity}x ${item.name}</span>
          <div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
            <button type="button" data-remove="${item.name}">−</button>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      removeItem(button.dataset.remove);
    });
  });
}

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderMenu();
});

clearOrderBtn.addEventListener("click", () => {
  selectedItems = [];
  renderOrder();
});

createCategoryTabs();
renderMenu();
renderOrder();