    // Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const sections = $$("[data-section]");
const toTop = $("#toTop");
const searchInput = $("#searchInput");
const clearSearchBtn = $("#clearSearch");
const emptyState = $("#emptyState");
const btnExpandAll = $("#btnExpandAll");

// --- Accordion (open/close per section)
function setSectionOpen(section, open) {
  section.classList.toggle("is-open", open);
  const btn = $("[data-toggle]", section);
  if (btn) btn.textContent = open ? "CERRAR" : "ABRIR";
}

sections.forEach((section) => {
  // Default: closed on mobile, open first one
  // (podés cambiar a "true" para abrir todo por defecto)
  setSectionOpen(section, false);

  const toggleBtn = $("[data-toggle]", section);
  toggleBtn?.addEventListener("click", () => {
    const isOpen = section.classList.contains("is-open");
    setSectionOpen(section, !isOpen);
  });
});

// Open first section by default
if (sections[0]) setSectionOpen(sections[0], true);

// Expand all / collapse all
let allOpen = false;
btnExpandAll?.addEventListener("click", () => {
  allOpen = !allOpen;
  sections.forEach((s) => setSectionOpen(s, allOpen));
  btnExpandAll.textContent = allOpen ? "CERRAR TODO" : "ABRIR TODO";
});

// --- Search (filters items across all sections)
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim();
}

function applySearch(queryRaw) {
  const query = normalize(queryRaw);

  let totalVisible = 0;

  sections.forEach((section) => {
    const items = $$(".item", section);
    let sectionHasVisible = false;

    items.forEach((item) => {
      const name = normalize(item.dataset.name || "");
      const tags = normalize(item.dataset.tags || "");
      const match = !query || name.includes(query) || tags.includes(query);

      item.hidden = !match;
      if (match) {
        sectionHasVisible = true;
        totalVisible++;
      }
    });

    // If searching: auto-open sections with matches, close ones without
    if (query) {
      setSectionOpen(section, sectionHasVisible);
    }
  });

  emptyState.hidden = totalVisible !== 0 || !query;
}

searchInput?.addEventListener("input", (e) => applySearch(e.target.value));

clearSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";
  applySearch("");
  // restore initial state (first open, others closed)
  sections.forEach((s, idx) => setSectionOpen(s, idx === 0));
  searchInput.focus();
});

// --- Back to top
window.addEventListener("scroll", () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  toTop.classList.toggle("show", y > 600);
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
