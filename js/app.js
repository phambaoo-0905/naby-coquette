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
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
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
  // 2. LOGIC TRANG TỦ ĐỒ NABY (INDEX.HTML) & MODAL CHI TIẾT
  // ====================================================
  const productsGrid = document.getElementById("productsGrid");
  const filterPills = document.querySelectorAll(".filter-btn, .filter-pill");

  // DOM elements của Modal
  const productModal = document.getElementById("productModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalMainImg = document.getElementById("modalMainImg");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalImgCounter = document.getElementById("modalImgCounter");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");
  const zoomLevelText = document.getElementById("zoomLevelText");
  const modalThumbnailsStrip = document.getElementById("modalThumbnailsStrip");
  const modalProductTitle = document.getElementById("modalProductTitle");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalSpecsBlock = document.getElementById("modalSpecsBlock");
  const modalContactBtn = document.getElementById("modalContactBtn");

  const IG_URL = "https://instagram.com/_naby.coquette";

  // Hàm hỗ trợ sao chép tin nhắn chốt đơn vào bộ nhớ tạm
  function copyOrderMessage(productName, price) {
    const text = `Chào Naby, mình muốn chốt món "${productName}" (${formatMoney(price)}) ạ ♡`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  // Quản lý trạng thái hiển thị Modal
  let currentModalImages = [];
  let currentImgIndex = 0;
  let currentZoom = 1;
  let currentProduct = null;

  function updateModalZoom() {
    if (modalMainImg) {
      modalMainImg.style.transform = `scale(${currentZoom})`;
    }
    if (zoomLevelText) {
      zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  function showModalImage(index) {
    if (!currentModalImages || currentModalImages.length === 0) return;
    if (index < 0) index = currentModalImages.length - 1;
    if (index >= currentModalImages.length) index = 0;
    currentImgIndex = index;

    if (modalMainImg) {
      modalMainImg.src = currentModalImages[currentImgIndex];
      modalMainImg.alt = currentProduct ? currentProduct.name : "Naby Product";
    }

    if (modalImgCounter) {
      modalImgCounter.textContent = `${currentImgIndex + 1}/${currentModalImages.length}`;
    }

    currentZoom = 1;
    updateModalZoom();

    // Cập nhật thumbnail đang chọn
    if (modalThumbnailsStrip) {
      const thumbs = modalThumbnailsStrip.querySelectorAll(".modal-thumb-img");
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentImgIndex);
      });
    }
  }

  function openProductModal(product) {
    if (!productModal) return;
    currentProduct = product;
    currentModalImages = (product.images && product.images.length > 0) ? product.images : [product.image];
    currentImgIndex = 0;

    if (modalProductTitle) modalProductTitle.textContent = product.name;
    if (modalProductPrice) modalProductPrice.textContent = formatMoney(product.price);

    // Hiển thị thông số chi tiết (specs)
    if (modalSpecsBlock) {
      modalSpecsBlock.innerHTML = "";
      const specsList = (product.specs && product.specs.length > 0) ? product.specs : [
        `✧ ${product.size}`,
        product.condition
      ];
      specsList.forEach((spec) => {
        const p = document.createElement("p");
        p.className = "modal-spec-item";
        p.textContent = spec;
        modalSpecsBlock.appendChild(p);
      });
    }

    // Nút "Liên hệ Naby" chuyển sang Instagram
    if (modalContactBtn) {
      modalContactBtn.href = IG_URL;
      modalContactBtn.onclick = () => {
        copyOrderMessage(product.name, product.price);
        showToast(`Đã lưu lời nhắn chốt "${product.name}", chuyển sang Instagram Naby ♡`);
      };
    }

    // Tạo thanh ảnh thu nhỏ (Thumbnails)
    if (modalThumbnailsStrip) {
      modalThumbnailsStrip.innerHTML = "";
      if (currentModalImages.length > 1) {
        modalThumbnailsStrip.style.display = "flex";
        currentModalImages.forEach((imgSrc, idx) => {
          const thumb = document.createElement("img");
          thumb.className = "modal-thumb-img" + (idx === 0 ? " active" : "");
          thumb.src = imgSrc;
          thumb.alt = `${product.name} ${idx + 1}`;
          thumb.addEventListener("click", () => showModalImage(idx));
          modalThumbnailsStrip.appendChild(thumb);
        });
      } else {
        modalThumbnailsStrip.style.display = "none";
      }
    }

    // Ẩn/hiện các nút prev/next và đếm số nếu chỉ có 1 ảnh
    const hasMultipleImages = currentModalImages.length > 1;
    if (modalPrevBtn) modalPrevBtn.style.display = hasMultipleImages ? "flex" : "none";
    if (modalNextBtn) modalNextBtn.style.display = hasMultipleImages ? "flex" : "none";
    if (modalImgCounter) modalImgCounter.style.display = hasMultipleImages ? "block" : "none";

    showModalImage(0);

    productModal.classList.add("active");
    productModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove("active");
    productModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentZoom = 1;
    updateModalZoom();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProductModal);
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }
  if (modalPrevBtn) modalPrevBtn.addEventListener("click", () => showModalImage(currentImgIndex - 1));
  if (modalNextBtn) modalNextBtn.addEventListener("click", () => showModalImage(currentImgIndex + 1));

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      currentZoom = Math.min(currentZoom + 0.25, 2.5);
      updateModalZoom();
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      currentZoom = Math.max(currentZoom - 0.25, 0.75);
      updateModalZoom();
    });
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", () => {
      currentZoom = 1;
      updateModalZoom();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!productModal || !productModal.classList.contains("active")) return;
    if (e.key === "Escape") closeProductModal();
    if (e.key === "ArrowLeft") showModalImage(currentImgIndex - 1);
    if (e.key === "ArrowRight") showModalImage(currentImgIndex + 1);
  });

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
        card.setAttribute("data-id", product.id);

        const specsHtml = (product.specs && product.specs.length > 0)
          ? product.specs.map(s => `<p class="spec-item">${s}</p>`).join("")
          : `<p class="spec-item">✧ ${product.size}</p><p class="spec-item">${product.condition}</p>`;

        card.innerHTML = `
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
            <span class="product-status-pill ${product.status ? 'status-available' : 'status-sold'}">
              ${product.status ? 'Còn hàng' : 'Đã pass'}
            </span>
            <button class="btn-view-photos" type="button" aria-label="Xem ảnh">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Xem ảnh</span>
            </button>
          </div>
          <div class="product-card-body">
            <div class="product-name-price-row">
              <h3 class="product-card-title">${product.name}</h3>
              <span class="product-card-price">${formatMoney(product.price)}</span>
            </div>
            <div class="product-specs-list">
              ${specsHtml}
            </div>
            <div class="product-card-action">
              <a href="${IG_URL}" target="_blank" rel="noopener noreferrer" class="link-order-ig">
                Chốt qua Instagram ↗
              </a>
            </div>
          </div>
        `;

        // Sự kiện click nút Chốt qua Instagram: copy text và mở Instagram (không kích hoạt modal)
        const igLink = card.querySelector(".link-order-ig");
        if (igLink) {
          igLink.addEventListener("click", (e) => {
            e.stopPropagation();
            copyOrderMessage(product.name, product.price);
            showToast(`Đã lưu lời nhắn chốt "${product.name}", chuyển sang Instagram Naby ♡`);
          });
        }

        // Sự kiện click vào thẻ sản phẩm hoặc nút "Xem ảnh" -> Mở Modal chuẩn Ảnh 2
        card.addEventListener("click", () => {
          openProductModal(product);
        });

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
