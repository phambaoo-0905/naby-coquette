document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  let currentFilter = "all";

  const productsGrid = document.getElementById("productsGrid");
  const filterPills = document.querySelectorAll(".filter-pill, .pill");
  const cartBadge = document.getElementById("cartCount");
  
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsList = document.getElementById("cartItemsList");
  const totalPriceEl = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const floatingMascot = document.getElementById("floatingMascot");
  const mascotToast = document.getElementById("mascotToast");
  const heroFawnMascot = document.getElementById("heroFawnMascot");

  let toastTimer = null;

  const mascotGreetings = [
    "Bé nai chúc bạn một ngày dịu dàng như chiếc váy xinh ♡ 🦌 ୨ৎ",
    "Thấy món đồ nào ưng ý, cứ nhấn Thêm đơn để Naby giữ đồ cho bạn nhé! 🎀",
    "Đồ vintage mỗi mẫu chỉ có 1 chiếc duy nhất thôi đó ạ! 🌸",
    "Naby gói ghém sự dịu dàng này và gửi đến bạn nha ♡ 🦌"
  ];

  function showMascotToast(text, duration = 3500) {
    if (!mascotToast) return;
    mascotToast.innerHTML = text;
    mascotToast.classList.add("show");
    
    if (floatingMascot) {
      const mascotImg = floatingMascot.querySelector(".floating-mascot-fawn");
      if (mascotImg) {
        mascotImg.style.animation = "mascot-bounce 0.6s ease";
        setTimeout(() => {
          mascotImg.style.animation = "mascot-wiggle 5s ease-in-out infinite";
        }, 600);
      }
    }

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      mascotToast.classList.remove("show");
    }, duration);
  }

  if (floatingMascot) {
    floatingMascot.addEventListener("click", () => {
      const randMsg = mascotGreetings[Math.floor(Math.random() * mascotGreetings.length)];
      showMascotToast(randMsg);
    });
  }

  if (heroFawnMascot) {
    heroFawnMascot.addEventListener("click", () => {
      showMascotToast("Bé nai nằm ngủ ngoan chờ bạn ghé chơi tủ đồ Naby ♡ 🦌 ୨ৎ");
    });
  }

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
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--fawn-brown);">
          <img src="assets/elements/fawn_lying.png" style="width:100px; opacity:0.8; margin-bottom:12px;">
          <p style="font-size: 1.25rem; font-family: var(--font-serif); margin-bottom: 6px;">Hiện chưa có món đồ nào trong mục này ♡</p>
          <span style="font-size: 0.9rem; opacity: 0.8;">Naby sẽ sớm cập nhật thêm các mẫu mới bạn nhé! 🦌 ୨ৎ</span>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      
      const isInCart = cart.some(c => c.id === product.id);

      card.innerHTML = `
        <div class="product-img-box">
          <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="stock-tag ${product.status ? "" : "sold-out"}">
            ${product.status ? "Còn hàng 🦌" : "Đã pass ♡"}
          </span>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-meta">${product.size} • ${product.condition}</div>
          <div class="product-bottom">
            <span class="product-price">${formatMoney(product.price)}</span>
            <button class="add-order-btn ${!product.status ? "disabled" : ""}" 
                    data-id="${product.id}" 
                    ${!product.status ? "disabled" : ""}>
              ${!product.status ? "Hết đồ" : (isInCart ? "✓ Đã chọn" : "+ Thêm đơn")}
            </button>
          </div>
        </div>
      `;

      const addBtn = card.querySelector(".add-order-btn");
      if (product.status && addBtn) {
        addBtn.addEventListener("click", () => {
          toggleCart(product);
          if (!isInCart) {
            showMascotToast(`Bé nai đã thêm <b>${product.name}</b> vào đơn cho bạn rồi nhé ♡ 🦌 ୨ৎ`);
          }
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
        <div style="text-align: center; padding: 50px 20px; color: var(--fawn-brown);">
          <img src="assets/elements/fawn_lying.png" alt="Bé nai" style="width:130px; margin-bottom:12px; filter: drop-shadow(0 4px 10px rgba(90,60,44,0.15));">
          <p style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 6px; color: var(--fawn-dark);">Đơn của bạn đang trống</p>
          <p style="font-size: 0.86rem; opacity: 0.85;">Dạo quanh tủ đồ và chọn chiếc áo xinh bạn yêu thích nhé ♡</p>
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
      row.className = "cart-item";
      row.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-detail">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatMoney(item.price)} <span style="font-size:0.75rem; color:#8c7365; font-weight:normal;">(${item.size})</span></div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" title="Bỏ món này">✕</button>
      `;

      row.querySelector(".remove-item-btn").addEventListener("click", () => {
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

  renderProducts();
  updateCartUI();
});
