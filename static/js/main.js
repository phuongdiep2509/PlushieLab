/* ==========================================================================
   PlushieLab — Main Interactive Script
   ========================================================================== */

'use strict';

/* ──────────────────────────────────────────
   PRICING CONFIGURATION
────────────────────────────────────────── */
const PRICING = {
  base: 199000,
  embroidery: 35000,
  giftWrap: 25000
};

/* ──────────────────────────────────────────
   GLOBAL STATE
────────────────────────────────────────── */
const state = {
  wizardStep: 1,
  type: 'bear',
  typeName: 'Bear',
  typeIcon: '🐻',
  color: 'caramel',
  colorName: 'Caramel',
  colorHex: '#c8864a',
  accessories: {
    head: null,
    headPrice: 0,
    tops: null,
    topsPrice: 0,
    bottoms: null,
    bottomsPrice: 0,
    accessories: null,
    accessoriesPrice: 0
  },
  services: {
    embroidery: null,
    embroideryType: null, // 'name' | 'icon'
    embroideryPrice: 0,
    giftWrap: null,
    giftWrapPrice: 0
  }
};

let cart = [];

/* ──────────────────────────────────────────
   CART STORAGE & IMAGE HELPERS
────────────────────────────────────────── */
function getPlushieDefaultImage(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('bear') || t.includes('gấu')) return '/static/image/Original Bear.png';
  if (t.includes('bun') || t.includes('thỏ')) return '/static/image/Original Bunnie.png';
  if (t.includes('cat') || t.includes('mèo') || t.includes('kit')) return '/static/image/Original Kitten.png';
  if (t.includes('capy')) return '/static/image/Original Capy.png';
  return '/static/image/background.png';
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('plushielab_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Lỗi load cart từ localStorage:', e);
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('plushielab_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Lỗi save cart vào localStorage:', e);
  }
}

/* ──────────────────────────────────────────
   UTILITY FUNCTIONS
────────────────────────────────────────── */
function formatVND(amount) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--color-brown, #935a3a);
      color: #ffffff;
      padding: 12px 28px;
      border-radius: 30px;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2600);
}

/* ──────────────────────────────────────────
   CUSTOMIZATION WIZARD CONTROLLER
────────────────────────────────────────── */
function goToStep(stepNum) {
  if (stepNum < 1 || stepNum > 4) return;
  state.wizardStep = stepNum;

  // Update Progress Bar
  document.querySelectorAll('.wizard-progress-bar .progress-step').forEach(stepEl => {
    const s = parseInt(stepEl.dataset.step);
    stepEl.classList.remove('active', 'done');
    if (s === stepNum) stepEl.classList.add('active');
    else if (s < stepNum) stepEl.classList.add('done');
  });

  // Update Step Panels
  document.querySelectorAll('.wizard-step-panel').forEach(panel => {
    const p = parseInt(panel.dataset.step);
    panel.classList.toggle('active', p === stepNum);
  });

  // Update Side Arrow States
  const prevBtn = document.getElementById('wizard-arrow-prev');
  const nextBtn = document.getElementById('wizard-arrow-next');
  if (prevBtn) prevBtn.disabled = (stepNum === 1);
  if (nextBtn) nextBtn.disabled = (stepNum === 4);

  // If entering step 4, calculate and render order summary
  if (stepNum === 4) {
    renderOrderSummary();
  }

  // Smooth scroll to wizard
  const wizardContainer = document.querySelector('.design-wizard-container');
  if (wizardContainer) {
    wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function updatePreviewStage() {
  const badgeIcon = document.getElementById('preview-badge-icon');
  const badgeText = document.getElementById('preview-badge-text');
  const colorDot = document.getElementById('preview-color-dot');
  const colorName = document.getElementById('preview-color-name');
  const chipsContainer = document.getElementById('preview-chips-container');
  const previewImg = document.querySelector('.preview-base-img');

  if (badgeIcon) badgeIcon.textContent = state.typeIcon;
  if (badgeText) badgeText.textContent = state.typeName;
  if (colorDot) colorDot.style.backgroundColor = state.colorHex;
  if (colorName) colorName.textContent = state.colorName;

  if (previewImg) {
    previewImg.src = getPlushieDefaultImage(state.type);
    previewImg.alt = `Custom ${state.typeName}`;
  }

  if (chipsContainer) {
    const chips = [`Base: ${state.typeName}`, state.colorName];
    if (state.accessories.head) chips.push(`Head: ${state.accessories.head}`);
    if (state.accessories.tops) chips.push(`Tops: ${state.accessories.tops}`);
    if (state.accessories.bottoms) chips.push(`Bottoms: ${state.accessories.bottoms}`);
    if (state.accessories.accessories) chips.push(`Bag: ${state.accessories.accessories}`);
    if (state.services.embroidery) chips.push(`Thêu: ${state.services.embroidery}`);
    if (state.services.giftWrap) chips.push(`Gói: ${state.services.giftWrap}`);

    chipsContainer.innerHTML = chips.map(c => `<span class="chip-item">${c}</span>`).join('');
  }
}

function calculateCustomTotal() {
  let total = PRICING.base;
  total += state.accessories.headPrice;
  total += state.accessories.topsPrice;
  total += state.accessories.bottomsPrice;
  total += state.accessories.accessoriesPrice;
  total += state.services.embroideryPrice;
  total += state.services.giftWrapPrice;
  return total;
}

function renderOrderSummary() {
  const summaryType = document.getElementById('summary-type');
  const summaryColor = document.getElementById('summary-color');
  const summaryHead = document.getElementById('summary-head');
  const summaryTops = document.getElementById('summary-tops');
  const summaryBottoms = document.getElementById('summary-bottoms');
  const summaryAcc = document.getElementById('summary-accessories');
  const summaryTheu = document.getElementById('summary-theu');
  const summaryGoi = document.getElementById('summary-goi');
  const totalPriceEl = document.getElementById('summary-total-price');

  if (summaryType) summaryType.textContent = `${state.typeIcon} ${state.typeName}`;
  if (summaryColor) summaryColor.textContent = state.colorName;
  if (summaryHead) summaryHead.textContent = state.accessories.head || 'None';
  if (summaryTops) summaryTops.textContent = state.accessories.tops || 'None';
  if (summaryBottoms) summaryBottoms.textContent = state.accessories.bottoms || 'None';
  if (summaryAcc) summaryAcc.textContent = state.accessories.accessories || 'None';
  if (summaryTheu) summaryTheu.textContent = state.services.embroidery || 'None';
  if (summaryGoi) summaryGoi.textContent = state.services.giftWrap ? `Hộp ${state.services.giftWrap}` : 'None';

  const total = calculateCustomTotal();
  if (totalPriceEl) totalPriceEl.textContent = formatVND(total);
}

function initWizard() {
  if (!document.querySelector('.design-wizard-container')) return;

  // Arrow navigation
  const prevBtn = document.getElementById('wizard-arrow-prev');
  const nextBtn = document.getElementById('wizard-arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', () => goToStep(state.wizardStep - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToStep(state.wizardStep + 1));

  // Progress Bar click navigation
  document.querySelectorAll('.wizard-progress-bar .progress-step').forEach(stepEl => {
    stepEl.addEventListener('click', () => {
      const target = parseInt(stepEl.dataset.step);
      goToStep(target);
    });
  });

  // Step 1: Type Selection
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.type = card.dataset.value;
      state.typeName = card.dataset.name;
      state.typeIcon = card.dataset.icon;
      updatePreviewStage();
    });
  });

  // Step 1: Color Selection
  document.querySelectorAll('.color-selection-grid .color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-selection-grid .color-swatch-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.color = btn.dataset.value;
      state.colorHex = btn.dataset.color;
      state.colorName = btn.dataset.value.charAt(0).toUpperCase() + btn.dataset.value.slice(1);
      updatePreviewStage();
    });
  });

  // Step 2: Accessories Sidebar Tabs
  document.querySelectorAll('.acc-sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.acc-sidebar-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.acc-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.querySelector(`.acc-tab-panel[data-panel="${tab.dataset.tab}"]`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Step 2: Accessory Cards Selection
  document.querySelectorAll('.acc-item-card').forEach(item => {
    item.addEventListener('click', () => {
      const slot = item.dataset.slot; // head, tops, bottoms, accessories
      const parentGroup = item.closest('[data-group]');
      const isAlreadySelected = item.classList.contains('selected');

      if (isAlreadySelected) {
        // Deselect
        item.classList.remove('selected');
        state.accessories[slot] = null;
        state.accessories[slot + 'Price'] = 0;
      } else {
        if (parentGroup) {
          parentGroup.querySelectorAll('.acc-item-card').forEach(i => i.classList.remove('selected'));
        }
        item.classList.add('selected');
        state.accessories[slot] = item.dataset.value;
        state.accessories[slot + 'Price'] = parseInt(item.dataset.price) || 0;
      }
      updatePreviewStage();
    });
  });

  // Step 3: Embroidery Buttons
  const embInput = document.getElementById('embroidery-text-input');
  const btnAddName = document.getElementById('btn-submit-embroidery-name');
  const btnAddIcon = document.getElementById('btn-submit-embroidery-icon');

  if (btnAddName) {
    btnAddName.addEventListener('click', () => {
      const text = embInput ? embInput.value.trim() : '';
      if (!text) {
        showToast('Vui lòng nhập tên bạn muốn thêu ✏️');
        if (embInput) embInput.focus();
        return;
      }
      state.services.embroidery = `Tên: "${text}"`;
      state.services.embroideryType = 'name';
      state.services.embroideryPrice = PRICING.embroidery;
      btnAddName.classList.add('active');
      if (btnAddIcon) btnAddIcon.classList.remove('active');
      updatePreviewStage();
      showToast(`Đã thêm thêu tên: "${text}" ✨`);
    });
  }

  if (btnAddIcon) {
    btnAddIcon.addEventListener('click', () => {
      state.services.embroidery = 'Icon: ⭐ Ngôi sao';
      state.services.embroideryType = 'icon';
      state.services.embroideryPrice = PRICING.embroidery;
      btnAddIcon.classList.add('active');
      if (btnAddName) btnAddName.classList.remove('active');
      updatePreviewStage();
      showToast('Đã thêm thêu icon ngôi sao ⭐');
    });
  }

  // Step 3: Gift Wrap Swatches
  document.querySelectorAll('.giftwrap-options-grid .color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isSelected = btn.classList.contains('selected');
      document.querySelectorAll('.giftwrap-options-grid .color-swatch-btn').forEach(b => b.classList.remove('selected'));
      if (isSelected) {
        state.services.giftWrap = null;
        state.services.giftWrapPrice = 0;
      } else {
        btn.classList.add('selected');
        state.services.giftWrap = btn.dataset.value;
        state.services.giftWrapPrice = PRICING.giftWrap;
        showToast(`Đã chọn gói quà hộp ${btn.dataset.value} 🎁`);
      }
      updatePreviewStage();
    });
  });

  // Step 4: Buy Now Button
  const finalBuyBtn = document.getElementById('btn-final-buy-now');
  if (finalBuyBtn) {
    finalBuyBtn.addEventListener('click', () => {
      const customImg = getPlushieDefaultImage(state.type);
      const customTypeSuffix = (state.typeName || 'PLUSH').toUpperCase().replace(/\s+/g, '').slice(0, 4);
      const customId = `CUSTOM-${customTypeSuffix}-${Math.floor(100 + Math.random() * 900)}`;

      const customItem = {
        id: customId,
        name: `Custom Plushie (${state.typeName})`,
        price: calculateCustomTotal(),
        image: customImg,
        typeName: state.typeName,
        colorName: state.colorName,
        meta: `Màu: ${state.colorName} | Phụ kiện: ${[state.accessories.head, state.accessories.tops, state.accessories.bottoms, state.accessories.accessories].filter(Boolean).join(', ') || 'Cơ bản'} | ${state.services.embroidery || 'Không thêu'} | ${state.services.giftWrap ? 'Gói quà ' + state.services.giftWrap : 'Hộp tiêu chuẩn'}`,
        qty: 1
      };
      addToCart(customItem);
      openCartDrawer();
      showToast(`Đã thêm ${customItem.name} (${customItem.id}) vào giỏ hàng! 🛒`);
    });
  }

  // Set initial state
  goToStep(1);
  updatePreviewStage();
}

/* ──────────────────────────────────────────
   SHOPPING CART & CHECKOUT CONTROLLER
────────────────────────────────────────── */
function quickAddToCart(firstParam, price, type, color, image, id) {
  let item = {};

  if (typeof firstParam === 'object' && firstParam !== null) {
    item = { ...firstParam };
  } else {
    const nameOrId = firstParam;
    let matchedProduct = null;
    if (window.productsAPI && window.productsAPI.data && window.productsAPI.data.products) {
      matchedProduct = window.productsAPI.data.products.find(p => p.id === nameOrId || p.name === nameOrId);
    }

    const prodId = id || (matchedProduct ? matchedProduct.id : (typeof nameOrId === 'string' && nameOrId.startsWith('PROD-') ? nameOrId : 'PROD-' + Date.now().toString().slice(-6)));
    const prodName = (matchedProduct && nameOrId === matchedProduct.id) ? matchedProduct.name : (nameOrId || (matchedProduct ? matchedProduct.name : 'Plushie Toy'));
    const prodPrice = (price !== undefined && price !== null) ? price : (matchedProduct ? matchedProduct.basePrice : 199000);
    const prodType = type || (matchedProduct ? matchedProduct.typeName : 'Gấu bông');
    const prodColor = color || (matchedProduct ? matchedProduct.colorName : 'Tiêu chuẩn');
    const prodImage = image || (matchedProduct ? matchedProduct.image : getPlushieDefaultImage(prodType));

    item = {
      id: prodId,
      name: prodName,
      price: prodPrice,
      typeName: prodType,
      colorName: prodColor,
      image: prodImage,
      meta: `Loại: ${prodType} • Màu: ${prodColor}`,
      qty: 1
    };
  }

  if (!item.id) {
    item.id = 'PROD-' + Date.now().toString().slice(-6);
  }
  if (!item.image) {
    item.image = getPlushieDefaultImage(item.typeName || item.type);
  }
  if (!item.qty) {
    item.qty = 1;
  }
  if (!item.meta) {
    item.meta = `Loại: ${item.typeName || item.type || 'Gấu bông'} • Màu: ${item.colorName || item.color || 'Tiêu chuẩn'}`;
  }

  addToCart(item);
  openCartDrawer();
  showToast(`Đã thêm ${item.name} (${item.id}) vào giỏ hàng! 🛒`);
}

function addToCart(item) {
  // Tìm kiếm item trùng theo id và meta
  const existing = cart.find(i => (i.id === item.id) && (i.meta === item.meta));
  if (existing) {
    existing.qty += (item.qty || 1);
  } else {
    cart.push(item);
  }
  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCartToStorage();
  updateCartUI();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
}

function changeCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  }
  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge-count');
  const itemsContainer = document.getElementById('cart-items-list');
  const footer = document.getElementById('cart-footer');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.textContent = totalCount;

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <p>Giỏ hàng chưa có sản phẩm nào.</p>
        <a href="/design" class="btn-primary btn-sm" style="margin-top:12px;display:inline-block;">Thiết kế gấu ngay ✂️</a>
      </div>
    `;
    if (footer) footer.style.display = 'none';
  } else {
    let subtotal = 0;
    itemsContainer.innerHTML = cart.map((item, idx) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      const itemImage = item.image || getPlushieDefaultImage(item.typeName || item.type);
      return `
        <div class="cart-item-row">
          <img src="${itemImage}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null;this.src='/static/image/background.png';" />
          <div class="cart-item-details">
            <div class="cart-item-id-badge">${item.id}</div>
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-meta">${item.meta}</p>
            <div class="cart-item-bottom-row">
              <span class="cart-item-price">${formatVND(item.price)} x ${item.qty}</span>
              <button type="button" class="cart-item-remove" onclick="removeFromCart(${idx})" title="Xóa sản phẩm">Xóa ✕</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
    if (totalEl) totalEl.textContent = formatVND(subtotal);
    if (footer) footer.style.display = 'block';
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function submitOrder() {
  const name = document.getElementById('ship-name').value.trim();
  const phone = document.getElementById('ship-phone').value.trim();
  const addr = document.getElementById('ship-address').value.trim();

  if (!name || !phone || !addr) {
    showToast('Vui lòng điền đủ họ tên, SĐT và địa chỉ giao hàng! 📝');
    return;
  }

  const orderId = 'PLB-' + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Save order to localStorage for tracking page
  const orderData = {
    orderId: orderId,
    customerName: name,
    phone: phone,
    address: addr,
    items: cart,
    total: totalAmount,
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('latest_order', JSON.stringify(orderData));

  // Reset cart
  cart = [];
  saveCartToStorage();
  updateCartUI();
  closeCartDrawer();

  showToast(`Đặt hàng thành công! Mã đơn: ${orderId} 🎉`);

  setTimeout(() => {
    window.location.href = `/tracking?order=${orderId}`;
  }, 1600);
}

/* ──────────────────────────────────────────
   SEARCH & HEADER INTERACTION
────────────────────────────────────────── */
function toggleSearchBar() {
  const bar = document.getElementById('search-bar');
  if (bar) {
    const isShown = bar.style.display !== 'none';
    bar.style.display = isShown ? 'none' : 'block';
    if (!isShown) {
      const input = document.getElementById('quick-search-input');
      if (input) input.focus();
    }
  }
}

function handleQuickSearch() {
  const input = document.getElementById('quick-search-input');
  if (!input || !input.value.trim()) {
    showToast('Vui lòng nhập từ khóa tìm kiếm 🔍');
    return;
  }
  showToast(`Tìm kiếm cho: "${input.value.trim()}"`);
  setTimeout(() => {
    window.location.href = '/new-collection';
  }, 800);
}

/* ──────────────────────────────────────────
   TRACKING PAGE CONTROLLER
────────────────────────────────────────── */
function initTrackingPage() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const timeline = document.getElementById('tracking-timeline');
  const orderNumDisplay = document.getElementById('display-order-num');

  // Check URL query param for order
  const urlParams = new URLSearchParams(window.location.search);
  const orderParam = urlParams.get('order');

  if (orderParam && input) {
    input.value = orderParam;
    if (orderNumDisplay) orderNumDisplay.textContent = orderParam;
    if (timeline) timeline.style.display = 'block';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) {
        showToast('Vui lòng nhập mã đơn hàng của bạn 📦');
        return;
      }
      if (orderNumDisplay) orderNumDisplay.textContent = val;
      if (timeline) {
        timeline.style.display = 'block';
        timeline.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast(`Đã tìm thấy đơn hàng #${val} ✅`);
    });
  }
}

/* ──────────────────────────────────────────
   MOBILE DRAWER NAVIGATION
────────────────────────────────────────── */
function initMobileNavigation() {
  const menuBtn = document.getElementById('btn-mobile-menu');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (menuBtn && drawer && overlay) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  }
}

/* ──────────────────────────────────────────
   INIT ON DOM READY
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav
  initMobileNavigation();

  // Active Nav Link highlighting
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(link => {
    if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/')) {
      link.classList.add('active');
    }
  });

  // Cart Button
  const cartToggleBtn = document.getElementById('btn-cart-toggle');
  const cartCloseBtn = document.getElementById('btn-close-cart');
  const cartBackdrop = document.getElementById('cart-backdrop');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // Search Toggle
  const searchBtn = document.getElementById('btn-search-toggle');
  if (searchBtn) searchBtn.addEventListener('click', toggleSearchBar);

  // Initialize Page Modules
  loadCartFromStorage();
  initWizard();
  initTrackingPage();
  updateCartUI();
});
