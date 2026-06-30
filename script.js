// ===================================
// ESTADO DO CARRINHO
// ===================================
// cart: para itens SEM adicionais (batatas, sorvetes, água, sucos) -> { itemId: quantidade }
// cartLines: para pastéis COM adicionais -> [{ lineId, itemId, addonIds: [], qty }]
// cartDrinks: para refrigerantes COM sabor -> [{ lineId, itemId, sabor, qty }]
let cart = {};
let cartLines = [];
let cartDrinks = [];
let orderMode = "entrega"; // "entrega" | "retirada"
let nextLineId = 1;

// Categorias que usam o modal de adicionais
const ADDON_CATEGORIES = ["pasteis"];
const ADDON_PRICE = 3.00;

// Itens de bebida que exigem escolha de sabor (refrigerantes com SABORES_REFRIGERANTE definido)
function needsFlavor(itemId) {
  return Object.prototype.hasOwnProperty.call(SABORES_REFRIGERANTE, itemId);
}

const allItems = [...MENU.pasteis, ...MENU.batatas, ...MENU.bebidas, ...MENU.sorvetes];

function getItemById(id) {
  return allItems.find((i) => i.id === id);
}

function getAddonById(id) {
  return ADICIONAIS_PASTEL.find((addon) => addon.id === id);
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

function categoryOf(itemId) {
  for (const key of Object.keys(MENU)) {
    if (MENU[key].some((i) => i.id === itemId)) return key;
  }
  return null;
}

// ===================================
// NAVEGAÇÃO ENTRE TELAS (Home / Itens da categoria)
// ===================================
const CAT_LABELS = {
  pasteis: { nome: "Pastéis", sub: "Todos R$ 3,00 a mais para qualquer adicional" },
  batatas: { nome: "Batatas", sub: "" },
  bebidas: { nome: "Bebidas", sub: "" },
  sorvetes: { nome: "Sorvetes", sub: "" },
};

function openCategory(catKey) {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("itemsScreen").style.display = "block";
  document.getElementById("screenTitle").textContent = CAT_LABELS[catKey].nome;
  document.getElementById("screenSub").textContent = CAT_LABELS[catKey].sub;
  renderCategory(catKey);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function goHome() {
  document.getElementById("itemsScreen").style.display = "none";
  document.getElementById("homeScreen").style.display = "block";
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll(".cat-card").forEach((card) => {
  card.addEventListener("click", () => openCategory(card.dataset.cat));
});

document.getElementById("backBtn").addEventListener("click", goHome);

// ===================================
// RENDER DO CARDÁPIO (itens da categoria atual)
// ===================================
function renderCategory(catKey) {
  const grid = document.getElementById("itemsGrid");
  grid.innerHTML = "";
  MENU[catKey].forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.id = `card-${item.id}`;
    card.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${item.nome}</div>
        <div class="item-preco">R$ ${formatPrice(item.preco)}</div>
      </div>
      <div class="item-action"></div>
    `;
    grid.appendChild(card);
    renderItemAction(item.id);
  });
}

function renderItemAction(itemId) {
  const card = document.getElementById(`card-${itemId}`);
  if (!card) return;
  const actionSlot = card.querySelector(".item-action");
  const isAddonCategory = ADDON_CATEGORIES.includes(categoryOf(itemId));

  if (isAddonCategory) {
    const totalQty = cartLines.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0);

    if (totalQty === 0) {
      actionSlot.innerHTML = `<button class="item-add-btn" onclick="addPastel(${itemId})">Adicionar</button>`;
    } else {
      actionSlot.innerHTML = `
        <div class="item-qty-control">
          <button class="qty-btn" onclick="removePastel(${itemId})">−</button>
          <span class="qty-val">${totalQty}</span>
          <button class="qty-btn" onclick="addPastel(${itemId})">+</button>
        </div>
      `;
    }
    return;
  }

  if (needsFlavor(itemId)) {
    const totalQty = cartDrinks.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0);

    if (totalQty === 0) {
      actionSlot.innerHTML = `<button class="item-add-btn" onclick="openFlavorModal(${itemId})">Adicionar</button>`;
    } else {
      actionSlot.innerHTML = `
        <div class="item-qty-control">
          <button class="qty-btn" onclick="removeDrink(${itemId})">−</button>
          <span class="qty-val">${totalQty}</span>
          <button class="qty-btn" onclick="openFlavorModal(${itemId})">+</button>
        </div>
      `;
    }
    return;
  }

  const qty = cart[itemId] || 0;

  if (qty === 0) {
    actionSlot.innerHTML = `<button class="item-add-btn" onclick="addItem(${itemId})">Adicionar</button>`;
  } else {
    actionSlot.innerHTML = `
      <div class="item-qty-control">
        <button class="qty-btn" onclick="removeItem(${itemId})">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" onclick="addItem(${itemId})">+</button>
      </div>
    `;
  }
}

// Encontra (ou cria) a linha "base" sem adicionais para um pastel
function getOrCreateBaseLine(itemId) {
  let line = cartLines.find((l) => l.itemId === itemId && l.addonIds.length === 0);
  if (!line) {
    line = { lineId: nextLineId++, itemId, addonIds: [], qty: 0 };
    cartLines.push(line);
  }
  return line;
}

function addPastel(itemId) {
  const line = getOrCreateBaseLine(itemId);
  const isFirstUnit = line.qty === 0;
  line.qty += 1;

  renderItemAction(itemId);
  updateCartUI();

  if (isFirstUnit) {
    showAddonSuggestion(itemId, line.lineId);
  }
}

function removePastel(itemId) {
  // Remove primeiro da linha base; se não houver, remove da última linha com adicional
  const lines = cartLines.filter((l) => l.itemId === itemId);
  if (lines.length === 0) return;

  const baseLine = lines.find((l) => l.addonIds.length === 0 && l.qty > 0);
  const targetLine = baseLine || lines[lines.length - 1];

  targetLine.qty -= 1;
  if (targetLine.qty <= 0) {
    cartLines = cartLines.filter((l) => l.lineId !== targetLine.lineId);
  }

  renderItemAction(itemId);
  updateCartUI();
}

function showAddonSuggestion(itemId, lineId) {
  const item = getItemById(itemId);
  const suggestion = document.getElementById("addonSuggestion");
  document.getElementById("addonSuggestionTitle").textContent = `Pastel de ${item.nome} adicionado`;
  suggestionLineId = lineId;

  suggestion.classList.add("visible");
  clearTimeout(suggestionTimer);
  suggestionTimer = setTimeout(hideAddonSuggestion, 7000);
}

function hideAddonSuggestion() {
  document.getElementById("addonSuggestion").classList.remove("visible");
  suggestionLineId = null;
  clearTimeout(suggestionTimer);
}

// ===================================
// MODAL DE ADICIONAIS (pastéis)
// ===================================
let currentAddonItemId = null;
let currentAddonLineId = null;
let suggestionLineId = null;
let suggestionTimer = null;
let selectedAddons = new Set();

function openAddonsModal(itemId, lineId = null) {
  currentAddonItemId = itemId;
  currentAddonLineId = lineId;
  selectedAddons = new Set();

  const item = getItemById(itemId);
  document.getElementById("addonsItemName").textContent = `Pastel de ${item.nome}`;

  // Remove da lista qualquer sabor que já esteja presente no nome do pastel base
  // (ex: pastel "Carne, Queijo e Catupiry" não pode ganhar adicional "Carne" nem "Queijo" nem "Catupiry")
  const nomeNormalizado = item.nome.toLowerCase();
  const adicionaisDisponiveis = ADICIONAIS_PASTEL.filter(
    (addon) => !nomeNormalizado.includes(addon.nome.toLowerCase())
  );

  const listEl = document.getElementById("addonsList");
  listEl.innerHTML = adicionaisDisponiveis
    .map(
      (addon) => `
      <div class="addon-option" data-addon-id="${addon.id}" onclick="toggleAddon('${addon.id}')">
        <span class="addon-option-name">${addon.nome}</span>
        <div class="addon-option-right">
          <span class="addon-option-price">+ R$ ${formatPrice(ADDON_PRICE)}</span>
          <div class="addon-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  updateAddonsTotal();

  document.getElementById("addonsModal").classList.add("open");
  document.getElementById("addonsOverlay").classList.add("visible");
  document.body.classList.add("modal-open");
}

function closeAddonsModal() {
  document.getElementById("addonsModal").classList.remove("open");
  document.getElementById("addonsOverlay").classList.remove("visible");
  document.body.classList.remove("modal-open");
  currentAddonItemId = null;
  currentAddonLineId = null;
}

function toggleAddon(addonId) {
  if (selectedAddons.has(addonId)) {
    selectedAddons.delete(addonId);
  } else {
    selectedAddons.add(addonId);
  }
  const optionEl = document.querySelector(`.addon-option[data-addon-id="${addonId}"]`);
  optionEl.classList.toggle("selected");
  updateAddonsTotal();
}

function updateAddonsTotal() {
  const baseItem = getItemById(currentAddonItemId);
  const total = baseItem.preco + selectedAddons.size * ADDON_PRICE;
  document.getElementById("addonsItemTotal").textContent = `R$ ${formatPrice(total)}`;
  document.getElementById("addonsConfirmBtn").textContent =
    selectedAddons.size === 0 ? "Adicionar sem adicional" : "Adicionar ao pedido";
}

document.getElementById("closeAddonsBtn").addEventListener("click", closeAddonsModal);
document.getElementById("addonsOverlay").addEventListener("click", closeAddonsModal);
document.getElementById("dismissAddonSuggestion").addEventListener("click", hideAddonSuggestion);
document.getElementById("openSuggestedAddons").addEventListener("click", () => {
  const line = cartLines.find((cartLine) => cartLine.lineId === suggestionLineId);
  if (!line) {
    hideAddonSuggestion();
    return;
  }

  hideAddonSuggestion();
  openAddonsModal(line.itemId, line.lineId);
});

document.getElementById("addonsConfirmBtn").addEventListener("click", () => {
  const addonIds = Array.from(selectedAddons);
  const targetLine = cartLines.find((line) => line.lineId === currentAddonLineId);

  if (targetLine && targetLine.addonIds.length === 0 && targetLine.qty > 0) {
    // Linha base (sem adicional): separa 1 unidade para a nova configuração
    targetLine.qty -= 1;

    if (addonIds.length > 0) {
      cartLines.push({
        lineId: nextLineId++,
        itemId: currentAddonItemId,
        addonIds,
        qty: 1,
      });
    } else {
      // Sem adicional selecionado: devolve a unidade para a linha base
      targetLine.qty += 1;
    }

    if (targetLine.qty <= 0) {
      cartLines = cartLines.filter((l) => l.lineId !== targetLine.lineId);
    }
  } else if (targetLine) {
    // Editando uma linha que já tinha adicionais
    targetLine.addonIds = addonIds;
  } else {
    cartLines.push({
      lineId: nextLineId++,
      itemId: currentAddonItemId,
      addonIds,
      qty: 1,
    });
  }

  renderItemAction(currentAddonItemId);
  updateCartUI();
  closeAddonsModal();
});

function getLinePrice(line) {
  const baseItem = getItemById(line.itemId);
  return (baseItem.preco + line.addonIds.length * ADDON_PRICE) * line.qty;
}

function getLineLabel(line) {
  const baseItem = getItemById(line.itemId);
  if (line.addonIds.length === 0) return baseItem.nome;
  const addonNames = line.addonIds.map((id) => getAddonById(id).nome);
  return `${baseItem.nome} + ${addonNames.join(" + ")}`;
}

// Versão usada no carrinho lateral, com prefixo "Pastel de" para deixar claro a categoria
function getLineLabelForCart(line) {
  return `Pastel de ${getLineLabel(line)}`;
}

function removeLine(lineId) {
  cartLines = cartLines.filter((l) => l.lineId !== lineId);
  updateCartUI();
  // Atualiza o botão na tela de produtos se ainda estiver visível
  const allPastelIds = MENU.pasteis.map((p) => p.id);
  allPastelIds.forEach((id) => renderItemAction(id));
}

function incrementLine(lineId) {
  const line = cartLines.find((l) => l.lineId === lineId);
  if (line) line.qty += 1;
  updateCartUI();
  if (line) renderItemAction(line.itemId);
}

function decrementLine(lineId) {
  const line = cartLines.find((l) => l.lineId === lineId);
  if (!line) return;
  const itemId = line.itemId;
  line.qty -= 1;
  if (line.qty <= 0) {
    removeLine(lineId);
    return;
  }
  updateCartUI();
  renderItemAction(itemId);
}

// ===================================
// MODAL DE ESCOLHA DE SABOR (refrigerantes)
// ===================================
let currentFlavorItemId = null;

function openFlavorModal(itemId) {
  currentFlavorItemId = itemId;
  const item = getItemById(itemId);
  document.getElementById("flavorItemName").textContent = item.nome;

  const sabores = SABORES_REFRIGERANTE[itemId] || [];
  const listEl = document.getElementById("flavorList");
  listEl.innerHTML = sabores
    .map(
      (sabor) => `
      <div class="addon-option" onclick="confirmFlavor('${sabor.replace(/'/g, "\\'")}')">
        <span class="addon-option-name">${sabor}</span>
      </div>
    `
    )
    .join("");

  document.getElementById("flavorModal").classList.add("open");
  document.getElementById("flavorOverlay").classList.add("visible");
  document.body.classList.add("modal-open");
}

function closeFlavorModal() {
  document.getElementById("flavorModal").classList.remove("open");
  document.getElementById("flavorOverlay").classList.remove("visible");
  document.body.classList.remove("modal-open");
  currentFlavorItemId = null;
}

document.getElementById("closeFlavorBtn").addEventListener("click", closeFlavorModal);
document.getElementById("flavorOverlay").addEventListener("click", closeFlavorModal);

function confirmFlavor(sabor) {
  const itemId = currentFlavorItemId;
  let line = cartDrinks.find((l) => l.itemId === itemId && l.sabor === sabor);
  if (line) {
    line.qty += 1;
  } else {
    cartDrinks.push({ lineId: nextLineId++, itemId, sabor, qty: 1 });
  }
  closeFlavorModal();
  renderItemAction(itemId);
  updateCartUI();
}

function removeDrink(itemId) {
  const lines = cartDrinks.filter((l) => l.itemId === itemId);
  if (lines.length === 0) return;
  const targetLine = lines[lines.length - 1];
  targetLine.qty -= 1;
  if (targetLine.qty <= 0) {
    cartDrinks = cartDrinks.filter((l) => l.lineId !== targetLine.lineId);
  }
  renderItemAction(itemId);
  updateCartUI();
}

function removeDrinkLine(lineId) {
  cartDrinks = cartDrinks.filter((l) => l.lineId !== lineId);
  updateCartUI();
  const line = cartDrinks.find((l) => l.lineId === lineId);
  // Atualiza o botão na tela de produtos para todos os itens de bebida (caso esteja visível)
  Object.keys(SABORES_REFRIGERANTE).forEach((id) => renderItemAction(Number(id)));
}

function incrementDrinkLine(lineId) {
  const line = cartDrinks.find((l) => l.lineId === lineId);
  if (line) line.qty += 1;
  updateCartUI();
  if (line) renderItemAction(line.itemId);
}

function decrementDrinkLine(lineId) {
  const line = cartDrinks.find((l) => l.lineId === lineId);
  if (!line) return;
  const itemId = line.itemId;
  line.qty -= 1;
  if (line.qty <= 0) {
    cartDrinks = cartDrinks.filter((l) => l.lineId !== lineId);
  }
  updateCartUI();
  renderItemAction(itemId);
}

function getDrinkLinePrice(line) {
  const baseItem = getItemById(line.itemId);
  return baseItem.preco * line.qty;
}

function getDrinkLineLabel(line) {
  const baseItem = getItemById(line.itemId);
  return `${baseItem.nome} - ${line.sabor}`;
}

// ===================================
// AÇÕES DO CARRINHO
// ===================================
function addItem(itemId) {
  cart[itemId] = (cart[itemId] || 0) + 1;
  renderItemAction(itemId);
  updateCartUI();
}

function removeItem(itemId) {
  if (!cart[itemId]) return;
  cart[itemId] -= 1;
  if (cart[itemId] <= 0) delete cart[itemId];
  renderItemAction(itemId);
  updateCartUI();
}

function getCartEntries() {
  return Object.entries(cart).map(([id, qty]) => ({
    item: getItemById(Number(id)),
    qty,
  }));
}

function getSubtotal() {
  const simpleTotal = getCartEntries().reduce((sum, e) => sum + e.item.preco * e.qty, 0);
  const linesTotal = cartLines.reduce((sum, line) => sum + getLinePrice(line), 0);
  const drinksTotal = cartDrinks.reduce((sum, line) => sum + getDrinkLinePrice(line), 0);
  return simpleTotal + linesTotal + drinksTotal;
}

function getDeliveryFee() {
  if (orderMode === "retirada") return 0;
  const bairroSelect = document.getElementById("bairroSelect");
  const selected = BAIRROS.find((b) => b.nome === bairroSelect.value);
  return selected ? selected.taxa : 0;
}

function getTotalCount() {
  const simpleCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const linesCount = cartLines.reduce((sum, line) => sum + line.qty, 0);
  const drinksCount = cartDrinks.reduce((sum, line) => sum + line.qty, 0);
  return simpleCount + linesCount + drinksCount;
}

// ===================================
// ATUALIZA TODA A UI DO CARRINHO
// ===================================
let lastTotalCount = 0;

function updateCartUI() {
  const totalCount = getTotalCount();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  // Contadores topo + fab
  const cartCountEl = document.getElementById("cartCount");
  cartCountEl.textContent = totalCount;
  document.getElementById("fabCount").textContent = totalCount;
  document.getElementById("fabTotal").textContent = formatPrice(total);

  if (totalCount !== lastTotalCount && totalCount > 0) {
    cartCountEl.classList.remove("bump");
    // força reflow para reiniciar a animação
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add("bump");
  }
  lastTotalCount = totalCount;

  // FAB visível só se tiver item e drawer fechado
  const fab = document.getElementById("fabCart");
  if (totalCount > 0) {
    fab.classList.add("visible");
  } else {
    fab.classList.remove("visible");
  }

  // Lista de itens no drawer
  const cartItemsEl = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("emptyCartMsg");
  const cartFooter = document.getElementById("cartFooter");
  const entries = getCartEntries();
  const hasAnyItem = entries.length > 0 || cartLines.length > 0 || cartDrinks.length > 0;

  if (!hasAnyItem) {
    emptyMsg.style.display = "block";
    cartItemsEl.innerHTML = "";
    cartFooter.style.display = "none";
  } else {
    emptyMsg.style.display = "none";
    cartFooter.style.display = "block";

    const simpleHtml = entries
      .map(
        (e) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${e.qty}x ${e.item.nome}</div>
            <div class="cart-item-price">R$ ${formatPrice(e.item.preco * e.qty)}</div>
          </div>
          <div class="item-qty-control">
            <button class="qty-btn" onclick="removeItem(${e.item.id})">−</button>
            <span class="qty-val">${e.qty}</span>
            <button class="qty-btn" onclick="addItem(${e.item.id})">+</button>
          </div>
        </div>
      `
      )
      .join("");

    const linesHtml = cartLines
      .map(
        (line) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${line.qty}x ${getLineLabelForCart(line)}</div>
            <div class="cart-item-price">R$ ${formatPrice(getLinePrice(line))}</div>
          </div>
          <div class="item-qty-control">
            <button class="qty-btn" onclick="decrementLine(${line.lineId})">−</button>
            <span class="qty-val">${line.qty}</span>
            <button class="qty-btn" onclick="incrementLine(${line.lineId})">+</button>
          </div>
        </div>
      `
      )
      .join("");

    const drinksHtml = cartDrinks
      .map(
        (line) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${line.qty}x ${getDrinkLineLabel(line)}</div>
            <div class="cart-item-price">R$ ${formatPrice(getDrinkLinePrice(line))}</div>
          </div>
          <div class="item-qty-control">
            <button class="qty-btn" onclick="decrementDrinkLine(${line.lineId})">−</button>
            <span class="qty-val">${line.qty}</span>
            <button class="qty-btn" onclick="incrementDrinkLine(${line.lineId})">+</button>
          </div>
        </div>
      `
      )
      .join("");

    cartItemsEl.innerHTML = linesHtml + drinksHtml + simpleHtml;
  }

  // Resumo de valores
  document.getElementById("sumSubtotal").textContent = `R$ ${formatPrice(subtotal)}`;
  document.getElementById("sumDelivery").textContent = `R$ ${formatPrice(deliveryFee)}`;
  document.getElementById("sumTotal").textContent = `R$ ${formatPrice(total)}`;
  document.getElementById("sumDeliveryRow").style.display = orderMode === "retirada" ? "none" : "flex";

  validateConfirmButton();
}

// ===================================
// DRAWER OPEN / CLOSE
// ===================================
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("visible");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
}

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("fabCart").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);

// ===================================
// TOGGLE ENTREGA / RETIRADA
// ===================================
document.querySelectorAll(".toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    orderMode = btn.dataset.mode;
    document.getElementById("deliveryFields").style.display = orderMode === "retirada" ? "none" : "block";
    updateCartUI();
  });
});

// ===================================
// POPULA SELECT DE BAIRROS
// ===================================
function populateBairros() {
  const select = document.getElementById("bairroSelect");
  BAIRROS.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b.nome;
    opt.textContent = `${b.nome} — Taxa R$ ${formatPrice(b.taxa)}`;
    select.appendChild(opt);
  });
}

document.getElementById("bairroSelect").addEventListener("change", updateCartUI);

// ===================================
// VALIDAÇÃO DO BOTÃO CONFIRMAR
// ===================================
function validateConfirmButton() {
  const btn = document.getElementById("confirmBtn");
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const bairro = document.getElementById("bairroSelect").value;
  const address = document.getElementById("custAddress").value.trim();

  let valid = name.length > 0 && phone.length > 0 && getTotalCount() > 0;
  if (orderMode === "entrega") {
    valid = valid && bairro.length > 0 && address.length > 0;
  }
  btn.disabled = !valid;
}

["custName", "custPhone", "custAddress"].forEach((id) => {
  document.getElementById(id).addEventListener("input", validateConfirmButton);
});

// ===================================
// MONTAGEM DA MENSAGEM E ENVIO WHATSAPP
// ===================================
function buildWhatsappMessage() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const note = document.getElementById("custNote").value.trim();
  const payment = document.getElementById("paySelect").value;
  const bairro = document.getElementById("bairroSelect").value;
  const address = document.getElementById("custAddress").value.trim();

  const entries = getCartEntries();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  let msg = `*NOVO PEDIDO - Cebolinha Pastéis & Batatas*\n\n`;
  msg += `*Cliente:* ${name}\n`;
  msg += `*Telefone:* ${phone}\n\n`;

  // Agrupa cartLines (pasteis com possiveis adicionais) e entries (batatas/bebidas/sorvetes) por categoria
  const CATEGORY_TITLES = {
    pasteis: "Pastéis",
    batatas: "Batatas",
    bebidas: "Bebidas",
    sorvetes: "Sorvetes",
  };

  const groupedLines = {};
  cartLines.forEach((line) => {
    const cat = categoryOf(line.itemId);
    if (!groupedLines[cat]) groupedLines[cat] = [];
    groupedLines[cat].push(`▫️ ${line.qty}x ${getLineLabel(line)} — R$ ${formatPrice(getLinePrice(line))}`);
  });

  entries.forEach((e) => {
    const cat = categoryOf(e.item.id);
    if (!groupedLines[cat]) groupedLines[cat] = [];
    groupedLines[cat].push(`▫️ ${e.qty}x ${e.item.nome} — R$ ${formatPrice(e.item.preco * e.qty)}`);
  });

  cartDrinks.forEach((line) => {
    const cat = categoryOf(line.itemId);
    if (!groupedLines[cat]) groupedLines[cat] = [];
    groupedLines[cat].push(`▫️ ${line.qty}x ${getDrinkLineLabel(line)} — R$ ${formatPrice(getDrinkLinePrice(line))}`);
  });

  Object.keys(CATEGORY_TITLES).forEach((catKey) => {
    if (groupedLines[catKey] && groupedLines[catKey].length > 0) {
      msg += `*${CATEGORY_TITLES[catKey]}:*\n`;
      msg += groupedLines[catKey].join("\n") + "\n\n";
    }
  });

  msg += `*Subtotal:* R$ ${formatPrice(subtotal)}\n`;

  if (orderMode === "entrega") {
    msg += `*Taxa de entrega (${bairro}):* R$ ${formatPrice(deliveryFee)}\n`;
  } else {
    msg += `*Retirada no local*\n`;
  }

  msg += `*TOTAL:* R$ ${formatPrice(total)}\n\n`;

  if (orderMode === "entrega") {
    msg += `*Endereço:* ${address} - ${bairro}\n\n`;
  }

  msg += `*Pagamento:* ${payment}\n`;

  if (payment === "Pix") {
    msg += `\n*Dados para Pix:*\n`;
    msg += `Nome: ${PIX_INFO.nome}\n`;
    msg += `Banco: ${PIX_INFO.banco}\n`;
    msg += `Chave Pix: ${PIX_INFO.chave}\n`;
  }

  if (note) {
    msg += `\n*Observação:* ${note}\n`;
  }

  return msg;
}

document.getElementById("confirmBtn").addEventListener("click", () => {
  const message = buildWhatsappMessage();
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank");
});

// ===================================
// INIT
// ===================================
populateBairros();
updateCartUI();
