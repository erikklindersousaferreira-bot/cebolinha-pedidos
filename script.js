// ===================================
// ESTADO DO CARRINHO
// ===================================
let cart = {}; // { itemId: quantidade }
let orderMode = "entrega"; // "entrega" | "retirada"

const allItems = [...MENU.pasteis, ...MENU.batatas, ...MENU.bebidas, ...MENU.sorvetes];

function getItemById(id) {
  return allItems.find((i) => i.id === id);
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
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
  return getCartEntries().reduce((sum, e) => sum + e.item.preco * e.qty, 0);
}

function getDeliveryFee() {
  if (orderMode === "retirada") return 0;
  const bairroSelect = document.getElementById("bairroSelect");
  const selected = BAIRROS.find((b) => b.nome === bairroSelect.value);
  return selected ? selected.taxa : 0;
}

function getTotalCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

// ===================================
// ATUALIZA TODA A UI DO CARRINHO
// ===================================
function updateCartUI() {
  const totalCount = getTotalCount();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  // Contadores topo + fab
  document.getElementById("cartCount").textContent = totalCount;
  document.getElementById("fabCount").textContent = totalCount;
  document.getElementById("fabTotal").textContent = formatPrice(total);

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

  if (entries.length === 0) {
    emptyMsg.style.display = "block";
    cartItemsEl.innerHTML = "";
    cartFooter.style.display = "none";
  } else {
    emptyMsg.style.display = "none";
    cartFooter.style.display = "block";
    cartItemsEl.innerHTML = entries
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

  let msg = `*NOVO PEDIDO - Cebolinha Pastéis & Batata*\n\n`;
  msg += `*Cliente:* ${name}\n`;
  msg += `*Telefone:* ${phone}\n\n`;
  msg += `*Itens:*\n`;
  entries.forEach((e) => {
    msg += `▫️ ${e.qty}x ${e.item.nome} — R$ ${formatPrice(e.item.preco * e.qty)}\n`;
  });
  msg += `\n*Subtotal:* R$ ${formatPrice(subtotal)}\n`;

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
