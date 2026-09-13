/**
 * NABY COQUETTE - MULTI-PAGE APPLICATION CORE JS
 * Hỗ trợ 3 trang: index.html (Tủ đồ), about.html (About us), orders.html (Đơn của bạn)
 * Đồng bộ giỏ hàng qua localStorage
 */

document.addEventListener("DOMContentLoaded", () => {
  // ====================================================
  // 1. QUẢN LÝ GIỎ HÀNG PERSISTENT (LOCALSTORAGE)
  // ====================================================
  const STORAGE_KEY = "naby_coquette_cart";

  const getCart = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateCartBadge(cart.length);
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng vào localStorage:", e);
    }
  };

  let cart = getCart();

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  // Cập nhật huy hiệu số lượng trên thanh navbar
  function updateCartBadge(count) {
    const cartBadge = document.getElementById("cartCount");
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.transform = "scale(1.25)";
      setTimeout(() => {
        cartBadge.style.transform = "scale(1)";
      }, 200);
    }
  }

  updateCartBadge(cart.length);

  // Hiển thị thông báo Toast nhanh
  function showToast(message) {
    const toast = document.getElementById("toastNotification");
    const toastMsg = document.getElementById("toastMessage");
    if (!toast) return;

    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // ====================================================
  // 2. LOGIC TRANG TỦ ĐỒ NABY (INDEX.HTML)
  // ====================================================
  const productsGrid = document.getElementById("productsGrid");
  const filterPills = document.querySelectorAll(".filter-btn, .filter-pill");

  if (productsGrid && typeof productsData !== "undefined") {
    let currentFilter = "all";

    function renderProducts() {
      productsGrid.innerHTML = "";

      const filtered = productsData.filter((item) => {
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

      filtered.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const isInCart = cart.some((c) => c.id === product.id);

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
            const index = cart.findIndex((item) => item.id === product.id);
            if (index > -1) {
              cart.splice(index, 1);
              saveCart(cart);
              showToast(`Đã bỏ "${product.name}" khỏi Đơn của bạn ♡`);
            } else {
              cart.push(product);
              saveCart(cart);
              showToast(`Đã thêm "${product.name}" vào Đơn của bạn 🎀`);
            }
            renderProducts();
          });
        }

        productsGrid.appendChild(card);
      });
    }

    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        currentFilter = pill.dataset.filter || "all";
        renderProducts();
      });
    });

    renderProducts();
  }

  // ====================================================
  // 3. LOGIC TRANG ĐƠN CỦA BẠN (ORDERS.HTML)
  // ====================================================
  const ordersWithItems = document.getElementById("ordersWithItems");
  const ordersEmptyState = document.getElementById("ordersEmptyState");
  const ordersListContainer = document.getElementById("ordersListContainer");
  const ordersTotalPrice = document.getElementById("ordersTotalPrice");
  const summaryCount = document.getElementById("summaryCount");
  const ordersItemsCount = document.getElementById("ordersItemsCount");
  const btnClearCart = document.getElementById("btnClearCart");
  const btnPageCheckout = document.getElementById("btnPageCheckout");

  if (ordersWithItems && ordersEmptyState) {
    function renderOrdersPage() {
      cart = getCart();

      if (cart.length === 0) {
        ordersWithItems.style.display = "none";
        ordersEmptyState.style.display = "block";
        updateCartBadge(0);
        return;
      }

      ordersWithItems.style.display = "grid";
      ordersEmptyState.style.display = "none";
      updateCartBadge(cart.length);

      if (ordersItemsCount) ordersItemsCount.textContent = cart.length;
      if (summaryCount) summaryCount.textContent = cart.length;

      if (ordersListContainer) {
        ordersListContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
          total += item.price;
          const row = document.createElement("div");
          row.className = "order-item-row";
          row.innerHTML = `
            <img class="order-item-thumb" src="${item.image}" alt="${item.name}">
            <div class="order-item-detail">
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-specs">${item.category.toUpperCase()} · ${item.size} · ${item.condition}</div>
              <div class="order-item-price-val">${formatMoney(item.price)}</div>
            </div>
            <button class="btn-remove-item" data-index="${index}" title="Bỏ món này">✕ Bỏ món</button>
          `;

          row.querySelector(".btn-remove-item").addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart(cart);
            renderOrdersPage();
          });

          ordersListContainer.appendChild(row);
        });

        if (ordersTotalPrice) {
          ordersTotalPrice.textContent = formatMoney(total);
        }
      }
    }

    if (btnClearCart) {
      btnClearCart.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa tất cả món đồ trong đơn không ♡?")) {
          cart = [];
          saveCart(cart);
          renderOrdersPage();
        }
      });
    }

    if (btnPageCheckout) {
      btnPageCheckout.addEventListener("click", () => {
        cart = getCart();
        if (cart.length === 0) {
          alert("Đơn của bạn đang trống ♡ Hãy chọn món đồ yêu thích trước nhé!");
          return;
        }

        const nameInput = document.getElementById("custName");
        const contactInput = document.getElementById("custContact");
        const noteInput = document.getElementById("custNote");

        const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Khách thương của Naby";
        const contact = contactInput && contactInput.value.trim() ? contactInput.value.trim() : "(Chưa cung cấp)";
        const note = noteInput && noteInput.value.trim() ? noteInput.value.trim() : "(Không có)";

        let message = `Chào Naby Coquette ♡ Mình muốn chốt các món này ạ:\n`;
        message += `──────────────────\n`;
        cart.forEach((item, idx) => {
          message += `${idx + 1}. ${item.name} (${item.size}) - ${formatMoney(item.price)}\n`;
        });
        message += `──────────────────\n`;
        message += `👉 Tổng cộng: ${ordersTotalPrice ? ordersTotalPrice.textContent : "0₫"}\n`;
        message += `🌸 Tên mình: ${name}\n`;
        message += `💌 Instagram / SĐT: ${contact}\n`;
        if (note !== "(Không có)") {
          message += `📝 Lời nhắn: ${note}\n`;
        }
        message += `Shop kiểm tra và giữ đồ giúp mình với nhé ୨ৎ`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(message).then(() => {
            alert("🎀 Đã sao chép nội dung đơn hàng!\n\nNaby đang mở tin nhắn Instagram để bạn dán (Paste) vào chat nhé ♡");
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

    renderOrdersPage();
  }

  // ====================================================
  // 4. TÙY CHỈNH HERO BANNER TRÊN MÀN HÌNH ĐIỆN THOẠI
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

  initMobileBannerControls();
});
