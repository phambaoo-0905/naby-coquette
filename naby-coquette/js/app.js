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
  // 2. LOGIC TRANG TỦ ĐỒ NABY (INDEX.HTML) - CHUẨN ẢNH 1 & ẢNH 2
  // ====================================================
  const productsGrid = document.getElementById("productsGrid");
  const filterPills = document.querySelectorAll(".filter-btn, .filter-pill");

  // Các phần tử của Modal Chi tiết (Ảnh 2)
  const productModal = document.getElementById("productModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalMainImg = document.getElementById("modalMainImg");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalZoomIn = document.getElementById("modalZoomIn");
  const modalZoomOut = document.getElementById("modalZoomOut");
  const modalZoomReset = document.getElementById("modalZoomReset");
  const modalZoomVal = document.getElementById("modalZoomVal");
  const modalImgCounter = document.getElementById("modalImgCounter");
  const modalProdTitle = document.getElementById("modalProdTitle");
  const modalProdPrice = document.getElementById("modalProdPrice");
  const btnContactNaby = document.getElementById("btnContactNaby");
  const modalThumbsRow = document.getElementById("modalThumbsRow");
  const modalSpecsBox = document.getElementById("modalSpecsBox");

  let activeProduct = null;
  let activeImgIndex = 0;
  let activeZoom = 1;

  // Mở Instagram & sao chép nội dung chốt đơn
  function redirectToInstagram(product) {
    const message = `Chào Naby Coquette ♡ Mình muốn chốt món này ạ:\n🎀 ${product.name} (${product.size || "Freesize"})\n💰 Giá: ${formatMoney(product.price)}\nNaby tư vấn và giữ đồ giúp mình nhé ୨ৎ`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        showToast(`🎀 Đã sao chép "${product.name}"! Naby đang mở Instagram nàng nhé ♡`);
      }).catch(() => {
        showToast(`Đang chuyển đến Instagram @_naby.coquette ♡`);
      });
    } else {
      showToast(`Đang chuyển đến Instagram @_naby.coquette ♡`);
    }

    setTimeout(() => {
      window.open("https://instagram.com/_naby.coquette", "_blank");
    }, 450);
  }

  // Cập nhật hiển thị ảnh trong modal
  function updateModalGallery() {
    if (!activeProduct) return;
    const images = activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images : [activeProduct.image];

    if (activeImgIndex >= images.length) activeImgIndex = 0;
    if (activeImgIndex < 0) activeImgIndex = images.length - 1;

    modalMainImg.src = images[activeImgIndex];
    modalMainImg.alt = activeProduct.name;
    modalImgCounter.textContent = `${activeImgIndex + 1} / ${images.length}`;

    // Reset zoom
    activeZoom = 1;
    modalMainImg.style.transform = "scale(1)";
    if (modalZoomVal) modalZoomVal.textContent = "100%";

    // Cập nhật trạng thái thumbnail active
    if (modalThumbsRow) {
      const thumbs = modalThumbsRow.querySelectorAll(".modal-thumb");
      thumbs.forEach((t, i) => {
        if (i === activeImgIndex) {
          t.classList.add("active");
        } else {
          t.classList.remove("active");
        }
      });
    }

    // Ẩn / hiện nút điều hướng nếu chỉ có 1 ảnh
    if (images.length <= 1) {
      modalPrevBtn.style.display = "none";
      modalNextBtn.style.display = "none";
    } else {
      modalPrevBtn.style.display = "flex";
      modalNextBtn.style.display = "flex";
    }
  }

  // Mở Modal Chi tiết sản phẩm (Ảnh 2)
  function openProductModal(product) {
    activeProduct = product;
    activeImgIndex = 0;

    if (modalProdTitle) modalProdTitle.textContent = product.name;
    if (modalProdPrice) modalProdPrice.textContent = formatMoney(product.price);

    // Hiển thị chi tiết thông số món đồ trong popup theo yêu cầu
    if (modalSpecsBox) {
      modalSpecsBox.innerHTML = "";
      const specs = product.specs && product.specs.length > 0
        ? product.specs
        : [`✧ ${product.size}`, product.condition];
      specs.forEach(s => {
        const row = document.createElement("div");
        row.className = "modal-spec-row";
        row.innerHTML = `<span class="spec-bullet">✧</span> <span>${s.replace(/^✧\s*/, '')}</span>`;
        modalSpecsBox.appendChild(row);
      });
    }

    // Tạo danh sách ảnh thumbnails
    if (modalThumbsRow) {
      modalThumbsRow.innerHTML = "";
      const images = product.images && product.images.length > 0 ? product.images : [product.image];
      images.forEach((imgUrl, idx) => {
        const thumb = document.createElement("img");
        thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
        thumb.src = imgUrl;
        thumb.alt = `${product.name} ${idx + 1}`;
        thumb.addEventListener("click", (e) => {
          e.stopPropagation();
          activeImgIndex = idx;
          updateModalGallery();
        });
        modalThumbsRow.appendChild(thumb);
      });
    }

    updateModalGallery();

    if (productModal) {
      productModal.style.display = "flex";
      requestAnimationFrame(() => {
        productModal.classList.add("show");
        productModal.setAttribute("aria-hidden", "false");
      });
      document.body.style.overflow = "hidden";
    }
  }

  // Đóng Modal
  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove("show");
    productModal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      productModal.style.display = "none";
      document.body.style.overflow = "";
      activeProduct = null;
    }, 250);
  }

  // Gán sự kiện Modal Controls
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProductModal);
  }

  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal && productModal.classList.contains("show")) {
      closeProductModal();
    }
  });

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      activeImgIndex--;
      updateModalGallery();
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      activeImgIndex++;
      updateModalGallery();
    });
  }

  // Zoom controls
  if (modalZoomIn) {
    modalZoomIn.addEventListener("click", (e) => {
      e.stopPropagation();
      activeZoom = Math.min(activeZoom + 0.25, 2.5);
      modalMainImg.style.transform = `scale(${activeZoom})`;
      if (modalZoomVal) modalZoomVal.textContent = `${Math.round(activeZoom * 100)}%`;
    });
  }

  if (modalZoomOut) {
    modalZoomOut.addEventListener("click", (e) => {
      e.stopPropagation();
      activeZoom = Math.max(activeZoom - 0.25, 0.75);
      modalMainImg.style.transform = `scale(${activeZoom})`;
      if (modalZoomVal) modalZoomVal.textContent = `${Math.round(activeZoom * 100)}%`;
    });
  }

  if (modalZoomReset) {
    modalZoomReset.addEventListener("click", (e) => {
      e.stopPropagation();
      activeZoom = 1;
      modalMainImg.style.transform = "scale(1)";
      if (modalZoomVal) modalZoomVal.textContent = "100%";
    });
  }

  // Nút "Liên hệ Naby" trong Modal (duy nhất 1 ô theo yêu cầu người dùng)
  if (btnContactNaby) {
    btnContactNaby.addEventListener("click", (e) => {
      e.stopPropagation();
      if (activeProduct) {
        redirectToInstagram(activeProduct);
      }
    });
  }

  // Render danh sách Card sản phẩm (Ảnh 1)
  if (productsGrid && typeof productsData !== "undefined") {
    let currentSort = "newest";

    function renderProducts() {
      productsGrid.innerHTML = "";

      let list = [...productsData];

      if (currentSort === "cheap") {
        list.sort((a, b) => a.price - b.price);
      } else if (currentSort === "expensive") {
        list.sort((a, b) => b.price - a.price);
      } else if (currentSort === "available") {
        list = list.filter((item) => item.status === true);
      } else {
        // "newest" hoặc mặc định: giữ nguyên thứ tự ban đầu
      }

      if (list.length === 0) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <p style="font-size: 1.3rem; font-family: var(--font-serif); margin-bottom: 6px; color: var(--fawn-dark);">Không tìm thấy món đồ phù hợp ♡</p>
            <span style="font-size: 0.9rem;">Naby sẽ sớm cập nhật thêm các mẫu mới bạn nhé! 🦌 ୨ৎ</span>
          </div>
        `;
        return;
      }

      list.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", product.id);

        card.innerHTML = `
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
            ${!product.status ? '<span class="card-status-badge sold-out">Đã pass</span>' : '<span class="card-status-badge available">Còn hàng</span>'}
            <div class="card-top-deco-badge" title="Naby Coquette Little Favorite">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
          <div class="product-info-wrap">
            <div class="product-card-name" title="${product.name}">${product.name}</div>
            <div class="product-card-price">${formatMoney(product.price)}</div>

            <!-- Họa tiết linh vật nai & thỏ size nhỏ, giảm opacity theo đúng yêu cầu -->
            <div class="card-mascot-watermark">
              <img src="assets/elements/fawn_lying.png" alt="Naby Fawn" class="mascot-mini-fawn">
              <img src="assets/elements/bunny_mascot.png" alt="Naby Bunny" class="mascot-mini-bunny">
            </div>
          </div>
        `;

        // Khi click vào card: Mở modal popup chi tiết (Ảnh 2)
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
        currentSort = pill.dataset.sort || pill.dataset.filter || "newest";
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
});
