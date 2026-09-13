document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  let currentFilter = "all";

  const productsGrid = document.getElementById("productsGrid");
  const filterPills = document.querySelectorAll(".filter-btn, .filter-pill, .pill");
  const cartBadge = document.getElementById("cartCount");
  
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsList = document.getElementById("cartItemsList");
  const totalPriceEl = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = "";

    const filtered = productsData.filter(item => {
      if (currentFilter === "all") return true;
      if (currentFilter === "available") return item.status === true;
      if (currentFilter === "passed") return item.status === false;
      return item.category === currentFilter;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.3rem; font-family: var(--font-serif); margin-bottom: 6px; color: var(--fawn-dark);">Không tìm thấy món đồ phù hợp ♡</p>
          <span style="font-size: 0.9rem;">Naby sẽ sớm cập nhật thêm các mẫu mới bạn nhé! 🦌 ୨ৎ</span>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      
      const isInCart = cart.some(c => c.id === product.id);

      card.innerHTML = `
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
          ${!product.status ? '<span class="badge-soldout">Sold out</span>' : '<span class="badge-available">Còn hàng</span>'}
        </div>
        <div class="product-title" title="${product.name}">${product.name}</div>
        <div class="product-size-condition">${product.size} · ${product.condition}</div>
        <div class="product-price">${formatMoney(product.price)}</div>
        <button class="btn-action-card ${product.status ? 'btn-add-cart' : 'btn-sold-out'}" 
                data-id="${product.id}" 
                ${!product.status ? 'disabled' : ''}>
          ${!product.status ? 'Sold out' : (isInCart ? '✓ Đã trong đơn' : '+ Add to cart')}
        </button>
      `;

      const addBtn = card.querySelector(".btn-add-cart");
      if (product.status && addBtn) {
        addBtn.addEventListener("click", () => {
          toggleCart(product);
        });
      }

      productsGrid.appendChild(card);
    });
  }

  function toggleCart(product) {
    const index = cart.findIndex(item => item.id === product.id);
    if (index > -1) {
      cart.splice(index, 1);
    } else {
      cart.push(product);
    }
    updateCartUI();
    renderProducts();
  }

  function updateCartUI() {
    if (cartBadge) {
      cartBadge.textContent = cart.length;
      cartBadge.style.transform = "scale(1.3)";
      setTimeout(() => { cartBadge.style.transform = "scale(1)"; }, 200);
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 8px; color: var(--fawn-dark);">Đơn của bạn đang trống</p>
          <p style="font-size: 0.88rem; line-height: 1.5;">Hãy dạo một vòng tủ đồ và bấm <strong>+ Add to cart</strong> để chọn món đồ yêu thích nhé ♡</p>
        </div>
      `;
      if (totalPriceEl) totalPriceEl.textContent = "0₫";
      return;
    }

    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price;
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <img class="cart-item-thumbnail" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.size} · ${item.condition}</div>
          <div class="cart-item-cost">${formatMoney(item.price)}</div>
        </div>
        <button class="btn-remove-item" data-id="${item.id}" title="Bỏ món này">✕</button>
      `;

      row.querySelector(".btn-remove-item").addEventListener("click", () => {
        toggleCart(item);
      });

      cartItemsList.appendChild(row);
    });

    if (totalPriceEl) {
      totalPriceEl.textContent = formatMoney(total);
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.dataset.filter || "all";
      renderProducts();
    });
  });

  if (openCartBtn && cartDrawer && cartOverlay) {
    openCartBtn.addEventListener("click", () => {
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("active");
    });
  }

  const closeCart = () => {
    if (cartDrawer) cartDrawer.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("active");
  };

  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Đơn của bạn đang trống, hãy chọn món đồ bạn yêu thích nhé ♡");
        return;
      }

      let message = "Chào Naby Coquette ♡ Mình muốn chốt các món này ạ:\n";
      cart.forEach((item, idx) => {
        message += `${idx + 1}. ${item.name} (${item.size}) - ${formatMoney(item.price)}\n`;
      });
      message += `👉 Tổng cộng: ${totalPriceEl ? totalPriceEl.textContent : "0₫"}\n`;
      message += "Shop kiểm tra và giữ đồ giúp mình với nhé ୨ৎ";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(() => {
          alert("Đã sao chép danh sách đơn! Bạn chỉ cần dán (Paste) vào tin nhắn Instagram cho Naby nhé 🎀");
          window.open("https://instagram.com/_naby.coquette", "_blank");
        }).catch(() => {
          prompt("Copy nội dung đơn bên dưới để nhắn qua Instagram shop nhé:", message);
          window.open("https://instagram.com/_naby.coquette", "_blank");
        });
      } else {
        prompt("Copy nội dung đơn bên dưới để nhắn qua Instagram shop nhé:", message);
        window.open("https://instagram.com/_naby.coquette", "_blank");
      }
    });
  }

  // Smooth active tab highlight on scroll
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 120;
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute("href"));
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  });

  // ====================================================
  // TÙY CHỈNH HERO BANNER TRÊN MÀN HÌNH ĐIỆN THOẠI
  // ====================================================
  function initMobileBannerControls() {
    const container = document.getElementById("heroBannerContainer");
    const img = document.getElementById("heroBannerImg");
    const btnZoom = document.getElementById("btnBannerZoom");
    const btnFit = document.getElementById("btnBannerFit");
    if (!container || !btnZoom || !btnFit || !img) return;

    btnZoom.addEventListener("click", (e) => {
      e.stopPropagation();
      container.classList.remove("mode-fit");
      btnZoom.classList.add("active");
      btnFit.classList.remove("active");
      img.style.objectPosition = "center";
    });

    btnFit.addEventListener("click", (e) => {
      e.stopPropagation();
      container.classList.add("mode-fit");
      btnFit.classList.add("active");
      btnZoom.classList.remove("active");
      img.style.objectPosition = "center";
    });

    // Cử chỉ vuốt/chạm lia ngang mượt mà ngắm toàn cảnh bức tranh trên điện thoại
    let startX = 0;
    let isTouching = false;
    let currentPos = 50;

    container.addEventListener("touchstart", (e) => {
      if (container.classList.contains("mode-fit")) return;
      startX = e.touches[0].clientX;
      isTouching = true;
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (!isTouching || container.classList.contains("mode-fit")) return;
      const deltaX = e.touches[0].clientX - startX;
      let newPos = currentPos - (deltaX / window.innerWidth) * 50;
      newPos = Math.max(15, Math.min(85, newPos));
      img.style.objectPosition = `${newPos}% center`;
    }, { passive: true });

    container.addEventListener("touchend", () => {
      if (!isTouching) return;
      isTouching = false;
      const match = img.style.objectPosition.match(/([\d.]+)%/);
      if (match) {
        currentPos = parseFloat(match[1]);
      }
    }, { passive: true });
  }

  renderProducts();
  updateCartUI();
  initMobileBannerControls();
});
