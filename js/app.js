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

  // Chuyển thẳng về trang Instagram của shop (không copy, mở trực tiếp)
  function redirectToInstagram() {
    window.open("https://instagram.com/_naby.coquette", "_blank");
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
    const INITIAL_DISPLAY_COUNT = 8;
    let displayedCount = INITIAL_DISPLAY_COUNT;

    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const btnLoadMore = document.getElementById("btnLoadMore");
    const loadMoreCount = document.getElementById("loadMoreCount");

    function renderProducts() {
      productsGrid.innerHTML = "";

      let list = [...productsData];

      if (currentSort === "cheap") {
        list.sort((a, b) => a.price - b.price);
      } else if (currentSort === "expensive") {
        list.sort((a, b) => b.price - a.price);
      } else if (currentSort === "available") {
        list = list.filter((item) => item.status === true);
      }

      if (list.length === 0) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <p style="font-size: 1.3rem; font-family: var(--font-serif); margin-bottom: 6px; color: var(--fawn-dark);">Không tìm thấy món đồ phù hợp ♡</p>
            <span style="font-size: 0.9rem;">Naby sẽ sớm cập nhật thêm các mẫu mới bạn nhé! 🦌 ୨ৎ</span>
          </div>
        `;
        if (loadMoreContainer) loadMoreContainer.style.display = "none";
        return;
      }

      // Chỉ hiển thị tối đa displayedCount (mặc định 8 card)
      const visibleItems = list.slice(0, displayedCount);

      visibleItems.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", product.id);

        card.innerHTML = `
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
            <!-- Hiệu ứng chấm pastel nhỏ dịu dàng phủ lên ảnh chuẩn coquette -->
            <div class="card-dots-overlay" aria-hidden="true"></div>
            <div class="card-top-deco-badge" title="Naby Coquette Little Favorite">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
          <div class="product-info-wrap">
            <div class="product-card-name" title="${product.name}">${product.name}</div>
            <div class="product-card-price">${formatMoney(product.price)}</div>

            <!-- Nút CTA Mua ngay dẫn thẳng trực tiếp qua Instagram -->
            <a href="https://instagram.com/_naby.coquette" target="_blank" rel="noopener noreferrer" class="btn-card-buy-now" onclick="event.stopPropagation();">
              <span>Mua ngay</span>
              <span class="btn-buy-icon">♡</span>
            </a>

            <!-- Họa tiết linh vật nai & thỏ size nhỏ, giảm opacity theo đúng yêu cầu -->
            <div class="card-mascot-watermark">
              <img src="assets/elements/fawn_lying.png" alt="Naby Fawn" class="mascot-mini-fawn">
              <img src="assets/elements/bunny_mascot.png" alt="Naby Bunny" class="mascot-mini-bunny">
            </div>
          </div>
        `;

        // Khi ấn Mua ngay: Chuyển thẳng về trang Instagram của Naby (ngăn modal mở)
        const btnBuyNow = card.querySelector(".btn-card-buy-now");
        if (btnBuyNow) {
          btnBuyNow.addEventListener("click", (e) => {
            e.stopPropagation();
          });
        }

        // Khi click vào vùng khác của card: Mở modal popup chi tiết
        card.addEventListener("click", () => {
          openProductModal(product);
        });

        productsGrid.appendChild(card);
      });

      // Cập nhật trạng thái nút "Xem thêm"
      if (loadMoreContainer && btnLoadMore) {
        const remaining = list.length - displayedCount;
        if (remaining > 0) {
          loadMoreContainer.style.display = "flex";
          if (loadMoreCount) {
            loadMoreCount.textContent = `(+${remaining})`;
          }
        } else {
          loadMoreContainer.style.display = "none";
        }
      }
    }

    if (btnLoadMore) {
      btnLoadMore.addEventListener("click", () => {
        displayedCount += 8; // Hiện thêm 8 món tiếp theo
        renderProducts();
      });
    }

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
  // 4. TRA CỨU ĐƠN HÀNG QUA GOOGLE SHEETS (ORDER LOOKUP)
  // ====================================================

  /**
   * URL của Google Apps Script Web App.
   * Thay thế chuỗi bên dưới bằng URL thực sau khi deploy Apps Script.
   * Hướng dẫn deploy ở file: google-apps-script/Code.gs
   */
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqaBK0rW0CnTCatCJC3mMYFO2xjj9_bB5dH8Ig7OgjA4OgCjQSmfJT5pLkVQW8BVDK/exec";

  const orderLookupInput = document.getElementById("orderLookupInput");
  const btnOrderSearch = document.getElementById("btnOrderSearch");
  const orderLookupFeedback = document.getElementById("orderLookupFeedback");
  const orderResultsSection = document.getElementById("orderResultsSection");
  const orderResultsHandle = document.getElementById("orderResultsHandle");
  const orderResultsList = document.getElementById("orderResultsList");
  const btnOrderClear = document.getElementById("btnOrderClear");

  // Chỉ chạy nếu đang ở trang orders.html
  if (btnOrderSearch && orderLookupInput) {

    /** Hiển thị trạng thái phản hồi bên dưới ô tìm kiếm */
    function setLookupFeedback(type, html) {
      if (!orderLookupFeedback) return;
      orderLookupFeedback.className = "order-lookup-feedback";
      if (type) orderLookupFeedback.classList.add(type);
      orderLookupFeedback.innerHTML = html;
    }

    /** Map trạng thái đơn sang vị trí thanh tiến trình và CSS class */
    function getProgressState(status) {
      const s = (status || "").toLowerCase().trim();
      // Bước: 0 = Đã chốt, 1 = Đang giao, 2 = Đã nhận
      if (s.includes("đang giao") || s.includes("dang giao") || s.includes("shipping")) {
        return 1;
      }
      if (s.includes("đã nhận") || s.includes("da nhan") || s.includes("done") || s.includes("hoàn thành") || s.includes("hoan thanh")) {
        return 2;
      }
      // Mặc định: Đã chốt
      return 0;
    }

    /** Map trạng thái sang CSS pill class */
    function getStatusPillClass(status) {
      const s = (status || "").toLowerCase().trim();
      if (s.includes("đang giao") || s.includes("dang giao")) return "status-dang-giao";
      if (s.includes("đã nhận") || s.includes("da nhan") || s.includes("done") || s.includes("hoan thanh")) return "status-da-nhan";
      return "status-da-chot";
    }

    /**
     * Render một card đơn hàng từ object data:
     * { order_id, instagram_handle, order_date, status, items, shipping_fee, spx_tracking_code }
     * items: mảng [{name, payment}] hoặc chuỗi "TênMón|TT,TênMón2|TT"
     */
    function renderOrderCard(order) {
      const card = document.createElement("div");
      card.className = "order-result-card";

      const progressIdx = getProgressState(order.status);
      const steps = [
        { label: "Đã chốt", icon: "✓" },
        { label: "Đang giao", icon: "📦" },
        { label: "Đã nhận", icon: "🎀" },
      ];

      const progressHTML = steps.map((step, i) => {
        let cls = "";
        if (i < progressIdx) cls = "done";
        else if (i === progressIdx) cls = "active";
        return `
          <div class="progress-step ${cls}">
            <div class="progress-dot">${i <= progressIdx ? (i < progressIdx ? "✓" : step.icon) : ""}</div>
            <span class="progress-label">${step.label}</span>
          </div>
        `;
      }).join("");

      // Parse items (string "Tên|TT,Tên2|TT" hoặc mảng JS)
      let parsedItems = [];
      if (Array.isArray(order.items)) {
        parsedItems = order.items;
      } else if (typeof order.items === "string" && order.items.trim()) {
        parsedItems = order.items.split(",").map(raw => {
          const parts = raw.trim().split("|");
          return { name: (parts[0] || "").trim(), payment: (parts[1] || "").trim() };
        }).filter(it => it.name);
      }

      const itemsHTML = parsedItems.length > 0
        ? parsedItems.map(it => {
            const isPaid = (it.payment || "").toLowerCase().includes("đã") || (it.payment || "").toLowerCase().includes("paid");
            return `
              <div class="order-result-item-row">
                <span class="order-result-item-name">${it.name}</span>
                <span class="order-result-item-payment ${isPaid ? 'paid' : 'unpaid'}">${it.payment || "Chưa TT"}</span>
              </div>
            `;
          }).join("")
        : `<div class="order-result-item-row"><span class="order-result-item-name" style="color:var(--text-muted)">Không có thông tin sản phẩm</span></div>`;

      // Phí ship
      const shippingFee = order.shipping_fee
        ? new Intl.NumberFormat("vi-VN").format(Number(order.shipping_fee)) + "₫"
        : "—";

      // Nút SPX
      const spxCode = (order.spx_tracking_code || "").trim();
      const spxBtn = spxCode
        ? `<a href="https://spx.vn/tracking?trackingId=${encodeURIComponent(spxCode)}" target="_blank" rel="noopener noreferrer" class="btn-spx-track">
             📦 Theo dõi trên SPX
           </a>`
        : `<span class="btn-spx-track no-tracking">📦 Chưa có mã vận đơn</span>`;

      const pillClass = getStatusPillClass(order.status);

      card.innerHTML = `
        <div class="order-result-card-header">
          <div>
            <div class="order-result-id">${order.order_id || "—"}</div>
            <div class="order-result-date">Ngày đặt: ${order.order_date || "—"}</div>
          </div>
          <span class="order-status-pill ${pillClass}">${order.status || "Đã chốt"}</span>
        </div>

        <div class="order-progress-bar">
          ${progressHTML}
        </div>

        <div class="order-result-items-title">Sản phẩm</div>
        <div class="order-result-items-list">
          ${itemsHTML}
        </div>

        <div class="order-result-footer">
          <div class="order-shipping-info">
            Phí ship: <strong>${shippingFee}</strong>
          </div>
          ${spxBtn}
        </div>
      `;

      return card;
    }

    /** Thực hiện tra cứu đơn hàng */
    async function searchOrders(handle) {
      if (!handle) return;

      // Hiển thị loading
      setLookupFeedback("loading", `<div class="lookup-spinner"></div> Đang tìm kiếm đơn hàng...`);
      if (btnOrderSearch) btnOrderSearch.disabled = true;

      // Ẩn kết quả cũ
      if (orderResultsSection) orderResultsSection.classList.remove("visible");

      try {
        const cleanHandle = handle.replace(/^@/, "").trim();
        const url = `${APPS_SCRIPT_URL}?handle=${encodeURIComponent(cleanHandle)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.error) {
          setLookupFeedback("error", `⚠️ ${data.error}`);
          return;
        }

        const orders = Array.isArray(data) ? data : (data.orders || []);

        if (orders.length === 0) {
          setLookupFeedback("", `🔍 Không tìm thấy đơn hàng nào với tên "<strong>@${cleanHandle}</strong>".<br><span style="font-size:0.82rem">Hãy kiểm tra lại tên Instagram hoặc nhắn Naby qua Instagram để được hỗ trợ nhé ♡</span>`);
          return;
        }

        // Hiển thị kết quả
        setLookupFeedback("", "");
        if (orderResultsHandle) orderResultsHandle.textContent = `@${cleanHandle}`;
        if (orderResultsList) {
          orderResultsList.innerHTML = "";
          orders.forEach(order => {
            orderResultsList.appendChild(renderOrderCard(order));
          });
        }
        if (orderResultsSection) orderResultsSection.classList.add("visible");

        // Cuộn xuống kết quả
        setTimeout(() => {
          if (orderResultsSection) {
            orderResultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);

      } catch (err) {
        console.error("Lỗi tra cứu đơn hàng:", err);
        setLookupFeedback("error", `⚠️ Không thể kết nối đến hệ thống. Hãy thử lại sau ít phút hoặc nhắn Naby qua Instagram nhé ♡`);
      } finally {
        if (btnOrderSearch) btnOrderSearch.disabled = false;
      }
    }

    // Gán sự kiện nút Tìm
    btnOrderSearch.addEventListener("click", () => {
      const handle = orderLookupInput.value.trim();
      if (!handle) {
        setLookupFeedback("error", "⚠️ Bạn chưa nhập tên Instagram nhé ♡");
        orderLookupInput.focus();
        return;
      }
      searchOrders(handle);
    });

    // Enter để tìm
    orderLookupInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btnOrderSearch.click();
    });

    // Nút "Tìm lại" — xóa kết quả và focus lại input
    if (btnOrderClear) {
      btnOrderClear.addEventListener("click", () => {
        if (orderResultsSection) orderResultsSection.classList.remove("visible");
        if (orderResultsList) orderResultsList.innerHTML = "";
        setLookupFeedback("", "");
        if (orderLookupInput) {
          orderLookupInput.value = "";
          orderLookupInput.focus();
        }
      });
    }
  }
});

