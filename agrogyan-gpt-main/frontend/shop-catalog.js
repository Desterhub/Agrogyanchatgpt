function initShopFallbackCatalog() {
    if (document.body?.dataset?.page !== "shop") return;

    const productGrid = document.getElementById("shopProductGrid");
    const categoryGrid = document.getElementById("shopCategoryGrid");
    if (!productGrid || !categoryGrid) return;

    const shouldRescueRender = !productGrid.children.length && !categoryGrid.children.length;
    if (!shouldRescueRender) return;

    const images = {
        seed: [
            "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/5503204/pexels-photo-5503204.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        fertilizer: [
            "https://images.pexels.com/photos/6231818/pexels-photo-6231818.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/6231786/pexels-photo-6231786.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        nutrition: [
            "https://images.pexels.com/photos/4505160/pexels-photo-4505160.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/7728075/pexels-photo-7728075.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        protection: [
            "https://images.pexels.com/photos/6231666/pexels-photo-6231666.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        irrigation: [
            "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/162625/tractor-farm-machine-agriculture-162625.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        machinery: [
            "https://images.pexels.com/photos/162625/tractor-farm-machine-agriculture-162625.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        animal: [
            "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=900"
        ],
        garden: [
            "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=900",
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=900"
        ]
    };

    const categories = [
        ["seed", "Seeds"], ["fertilizer", "Fertilizers"], ["nutrition", "Crop Nutrition"], ["protection", "Crop Protection"],
        ["irrigation", "Irrigation"], ["machinery", "Farm Machinery"], ["animal", "Animal Husbandry"], ["garden", "Garden Tools"]
    ];

    const crops = ["Tomato", "Brinjal", "Cucumber", "Chilli", "Okra", "Cauliflower", "Cabbage", "Onion", "Paddy", "Wheat", "Cotton", "Mustard"];
    const brands = ["Syngenta", "VNR", "Namdhari", "Seminis", "UPL", "Bayer", "IFFCO", "Multiplex", "Jain", "KisanKraft"];
    const templates = {
        seed: ["Hybrid Seeds", "Premium Seeds", "F1 Hybrid Seeds"],
        fertilizer: ["Growth Booster", "NPK Mix", "Field Grade"],
        nutrition: ["Micronutrient Mix", "Bio Stimulant", "Soil Booster"],
        protection: ["Fungicide", "Insecticide", "Herbicide"],
        irrigation: ["Drip Kit", "Sprayer Set", "Pipe Pack"],
        machinery: ["Battery Sprayer", "Weeder Tool", "Farm Kit"],
        animal: ["Feed Mix", "Mineral Pack", "Care Tonic"],
        garden: ["Garden Kit", "Potting Pack", "Home Grow Set"]
    };
    const units = {
        seed: ["10 gms", "50 gms", "250 gms", "3500 seeds"],
        fertilizer: ["25 kg bag", "45 kg bag", "50 kg bag"],
        nutrition: ["500 ml", "1 ltr", "5 kg"],
        protection: ["250 ml", "500 ml", "1 ltr"],
        irrigation: ["unit", "starter set", "100 m"],
        machinery: ["unit", "kit", "set"],
        animal: ["1 ltr", "5 kg", "30 kg bag"],
        garden: ["unit", "pack", "combo pack"]
    };

    const catalog = [];
    let productIndex = 0;
    categories.forEach(([category]) => {
        for (let i = 0; i < 14; i += 1) {
            const crop = crops[(productIndex + i) % crops.length];
            const brand = brands[(productIndex + i) % brands.length];
            const template = templates[category][i % templates[category].length];
            const unit = units[category][i % units[category].length];
            const price = 120 + ((productIndex + i) % 18) * 90 + (category === "irrigation" || category === "machinery" ? 1200 : 0);
            const originalPrice = Math.round(price * (1.22 + ((productIndex + i) % 4) * 0.08));
            catalog.push({
                id: `${category}-${crop.toLowerCase()}-${i}`,
                category,
                name: `${crop} ${template}`,
                brand,
                seller: brand,
                price,
                originalPrice,
                rating: (4.1 + ((productIndex + i) % 5) * 0.1).toFixed(1),
                reviews: 20 + ((productIndex + i) * 13),
                delivery: `${1 + ((productIndex + i) % 4)} days`,
                image: images[category][i % images[category].length],
                unit,
                description: `${crop} focused ${template.toLowerCase()} for practical farm use.`,
                sizes: [unit]
            });
        }
        productIndex += 14;
    });

    const formatCurrency = (value) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;
    const getCart = () => typeof window.readAgroJson === "function" ? window.readAgroJson("agroSmartCart", []) : [];
    const saveCart = (cart) => localStorage.setItem("agroSmartCart", JSON.stringify(cart));
    const saveCatalogCache = () => localStorage.setItem("agroShopProductCache", JSON.stringify(catalog));
    const getCartQty = (productId) => getCart().find((item) => item.id === productId)?.qty || 0;
    const getCartStats = () => {
        const cart = getCart();
        let count = 0;
        let total = 0;
        cart.forEach((item) => {
            const product = catalog.find((entry) => entry.id === item.id);
            if (!product) return;
            count += item.qty;
            total += product.price * item.qty;
        });
        return { count, total };
    };
    const getFilters = () => ({
        category: document.getElementById("shopCategoryFilter")?.value || "all",
        search: (document.getElementById("shopSearchInput")?.value || "").trim().toLowerCase()
    });

    function renderStats() {
        const crop = localStorage.getItem("crop_name") || "Mixed farm";
        const land = localStorage.getItem("land_size") || "Add land size";
        const { count, total } = getCartStats();
        const setText = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.innerText = value;
        };

        setText("shopPrimaryCrop", crop);
        setText("shopLandNeed", land);
        setText("shopCartCount", String(count));
        setText("shopCartItemCount", String(count));
        setText("shopCartTotal", formatCurrency(total));
        setText("shopTopSignal", count ? `${count} item${count === 1 ? "" : "s"} in cart` : "Products are ready to browse");
        setText("shopTopSignalNote", count ? `Cart total is ${formatCurrency(total)}. Open Cart when ready.` : "Products are already visible below. Use filters only if you want to narrow them.");
    }

    function renderCategories() {
        categoryGrid.innerHTML = categories.map(([key, label], index) => `
            <button class="shop-category-card" type="button" onclick="shopFallbackSelectCategory('${key}')">
                <span class="shop-category-art" style="background-image:url('${images[key][index % images[key].length]}')"></span>
                <span>${label}</span>
            </button>
        `).join("");
    }

    function renderRecommendations(filteredProducts) {
        const recommendationList = document.getElementById("shopRecommendationList");
        const bundlePreview = document.getElementById("shopBundlePreview");
        const flowHelp = document.getElementById("shopFlowHelp");
        const picks = filteredProducts.slice(0, 3);
        if (recommendationList) {
            recommendationList.innerHTML = picks.map((product) => `
                <div class="timeline-item">
                    <h4>${product.name}</h4>
                    <p>${product.brand} | ${formatCurrency(product.price)} | ${product.delivery}</p>
                </div>
            `).join("");
        }
        if (bundlePreview) {
            const bundleTotal = picks.reduce((sum, item) => sum + item.price, 0);
            bundlePreview.innerHTML = `
                <div class="timeline-item">
                    <h4>Starter bundle</h4>
                    <p>${picks.map((item) => item.name).join(", ")}</p>
                    <p>Total: <strong>${formatCurrency(bundleTotal)}</strong></p>
                </div>
            `;
        }
        if (flowHelp) {
            flowHelp.innerHTML = [
                "Step 1: Products are visible by default.",
                "Step 2: Use category or search only if you want fewer products.",
                "Step 3: Click Add to cart on any product.",
                "Step 4: Open Cart to review total and quantity.",
                "Step 5: Go to Checkout to complete your order."
            ].map((text) => `<div class="timeline-item"><p>${text}</p></div>`).join("");
        }
    }

    function renderProducts() {
        const filters = getFilters();
        const results = catalog.filter((product) => {
            const byCategory = filters.category === "all" || product.category === filters.category;
            const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
            const bySearch = !filters.search || haystack.includes(filters.search);
            return byCategory && bySearch;
        });

        const filterResult = document.getElementById("shopFilterResult");
        const filterHelp = document.getElementById("shopFilterHelp");
        const emptyState = document.getElementById("shopEmptyState");

        if (filterResult) filterResult.innerText = `${results.length} visible products`;
        if (filterHelp) {
            filterHelp.innerHTML = `
                <div class="timeline-item">
                    <h4>How to use this shop</h4>
                    <p>Products are already visible on load. Category and search are optional filters.</p>
                </div>
            `;
        }
        if (emptyState) {
            emptyState.innerHTML = results.length ? "" : `<div class="timeline-item"><p>No products match this filter. Press View all to reset.</p></div>`;
        }

        productGrid.innerHTML = results.map((product, index) => {
            const discount = Math.max(8, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100));
            const qty = getCartQty(product.id);
            return `
                <article class="shop-product-card marketplace-product-card">
                    <div class="shop-deal-badge">${discount}% OFF</div>
                    <button class="shop-wishlist-btn" type="button">♡</button>
                    <div class="shop-product-image" style="background-image: linear-gradient(180deg, rgba(15, 33, 18, 0.06), rgba(15, 33, 18, 0.22)), url('${product.image}')"></div>
                    <div class="shop-rating-row"><span class="shop-rating-pill">${product.rating} ★ | ${product.reviews}</span></div>
                    <div class="shop-product-head">
                        <div>
                            <span class="shop-category-pill">${product.category}</span>
                            <h4>${product.name}</h4>
                        </div>
                    </div>
                    <p class="shop-product-brand">${product.brand}</p>
                    <p class="shop-product-copy">${product.description}</p>
                    <div class="shop-price-stack">
                        <strong>${formatCurrency(product.price)}</strong>
                        <span class="shop-original-price">${formatCurrency(product.originalPrice)}</span>
                    </div>
                    <div class="shop-save-note">Save ${formatCurrency(product.originalPrice - product.price)}</div>
                    <div class="shop-product-meta">
                        <span>${product.unit}</span>
                        <span>${product.delivery}</span>
                    </div>
                    <div class="shop-size-row">
                        <span>Size</span>
                        <select class="shop-size-select"><option>${product.unit}</option></select>
                    </div>
                    <div class="shop-seller-row"><span>Seller: <strong>${product.seller}</strong></span></div>
                    <div class="section-header shop-card-actions">
                        <button class="nav-btn" type="button" onclick="shopFallbackOpenProduct('${product.id}')">View details</button>
                        <button class="primary-btn" type="button" onclick="shopFallbackAddToCart('${product.id}')">${qty ? `Add more (${qty})` : "Add to cart"}</button>
                        <span class="badge-chip ${qty ? "active" : ""}">${qty} in cart</span>
                    </div>
                </article>
            `;
        }).join("");

        renderRecommendations(results);
        renderStats();
    }

    window.shopFallbackSelectCategory = (category) => {
        const categoryInput = document.getElementById("shopCategoryFilter");
        if (categoryInput) categoryInput.value = category;
        renderProducts();
    };

    window.shopFallbackFilter = () => renderProducts();

    window.shopFallbackAddToCart = (productId) => {
        const cart = getCart();
        const existing = cart.find((item) => item.id === productId);
        if (existing) existing.qty += 1;
        else cart.push({ id: productId, qty: 1 });
        saveCart(cart);
        renderProducts();
    };

    window.shopFallbackOpenProduct = (productId) => {
        const product = catalog.find((item) => item.id === productId);
        const modal = document.getElementById("shopProductModal");
        if (!product || !modal) return;
        const setHtml = (id, html) => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = html;
        };
        const title = document.getElementById("shopModalTitle");
        const image = document.getElementById("shopModalImage");
        const button = document.getElementById("shopModalAddButton");
        if (title) title.innerText = product.name;
        if (image) image.style.backgroundImage = `linear-gradient(180deg, rgba(15, 33, 18, 0.08), rgba(15, 33, 18, 0.22)), url('${product.image}')`;
        setHtml("shopModalMeta", `<span>${product.category}</span><span>${product.brand}</span><span>${product.unit}</span><span>${formatCurrency(product.price)}</span>`);
        setHtml("shopModalDescription", `<div class="timeline-item"><h4>About product</h4><p>${product.description}</p></div>`);
        setHtml("shopModalAdvice", `<div class="timeline-item"><h4>Seller</h4><p>${product.seller}</p></div><div class="timeline-item"><h4>Delivery</h4><p>${product.delivery}</p></div>`);
        if (button) button.onclick = () => window.shopFallbackAddToCart(product.id);
        modal.classList.remove("hidden");
    };

    const closeButton = document.querySelector("#shopProductModal .nav-btn");
    if (closeButton) closeButton.onclick = () => document.getElementById("shopProductModal")?.classList.add("hidden");
    document.getElementById("shopCategoryFilter")?.addEventListener("change", renderProducts);
    document.getElementById("shopSearchInput")?.addEventListener("input", renderProducts);

    saveCatalogCache();
    renderCategories();
    renderProducts();
}

function initCartCheckoutFallback() {
    const page = document.body?.dataset?.page;
    if (!["cart", "checkout"].includes(page)) return;

    const cart = typeof window.readAgroJson === "function" ? window.readAgroJson("agroSmartCart", []) : [];
    const catalog = typeof window.readAgroJson === "function" ? window.readAgroJson("agroShopProductCache", []) : [];
    if (!cart.length || !catalog.length) return;

    const items = cart.map((item) => {
        const product = catalog.find((entry) => entry.id === item.id);
        if (!product) return null;
        return { ...product, qty: item.qty, total: product.price * item.qty };
    }).filter(Boolean);

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.total, 0);
    const formatCurrency = (value) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;

    if (page === "cart") {
        const itemsHost = document.getElementById("cartPageItems");
        const summaryHost = document.getElementById("cartSummaryBody");
        const heroTotal = document.getElementById("cartHeroTotal");
        const heroCount = document.getElementById("cartHeroCount");
        if (!itemsHost || itemsHost.children.length) return;

        if (heroTotal) heroTotal.innerText = formatCurrency(total);
        if (heroCount) heroCount.innerText = `${count} item${count === 1 ? "" : "s"} selected`;
        itemsHost.innerHTML = items.map((item) => `
            <article class="cart-page-item">
                <div class="cart-page-image" style="background-image: linear-gradient(180deg, rgba(15, 33, 18, 0.06), rgba(15, 33, 18, 0.22)), url('${item.image}')"></div>
                <div class="cart-page-copy">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <p>Seller: <strong>${item.seller}</strong></p>
                    <p>${item.unit} | ${item.delivery}</p>
                </div>
                <div class="cart-page-side">
                    <strong>${formatCurrency(item.price)}</strong>
                    <div class="badge-chip active">${item.qty} qty</div>
                    <div class="badge-chip active">${formatCurrency(item.total)}</div>
                </div>
            </article>
        `).join("");
        if (summaryHost) {
            summaryHost.innerHTML = `
                <div class="timeline-item"><h4>Items total</h4><p>${count} item${count === 1 ? "" : "s"}</p></div>
                <div class="timeline-item"><h4>Subtotal</h4><p>${formatCurrency(total)}</p></div>
                <div class="timeline-item"><h4>Delivery</h4><p>Free standard delivery</p></div>
                <div class="timeline-item"><h4>Final total</h4><p><strong>${formatCurrency(total)}</strong></p></div>
            `;
        }
    }

    if (page === "checkout") {
        const orderItems = document.getElementById("checkoutOrderItems");
        const summaryBody = document.getElementById("checkoutSummaryBody");
        const heroTotal = document.getElementById("checkoutHeroTotal");
        const heroCount = document.getElementById("checkoutHeroCount");
        if (!orderItems || orderItems.children.length) return;

        if (heroTotal) heroTotal.innerText = formatCurrency(total);
        if (heroCount) heroCount.innerText = `${count} item${count === 1 ? "" : "s"}`;
        orderItems.innerHTML = items.map((item) => `
            <article class="checkout-order-item">
                <div class="checkout-order-image" style="background-image: linear-gradient(180deg, rgba(15, 33, 18, 0.08), rgba(15, 33, 18, 0.2)), url('${item.image}')"></div>
                <div class="checkout-order-copy">
                    <h4>${item.name}</h4>
                    <p>${item.qty} x ${item.unit}</p>
                    <p>Seller: <strong>${item.seller}</strong></p>
                </div>
                <strong>${formatCurrency(item.total)}</strong>
            </article>
        `).join("");
        if (summaryBody) {
            summaryBody.innerHTML = `
                <div class="timeline-item"><h4>Subtotal</h4><p>${formatCurrency(total)}</p></div>
                <div class="timeline-item"><h4>Shipping</h4><p>Free standard delivery</p></div>
                <div class="timeline-item"><h4>Payable total</h4><p><strong>${formatCurrency(total)}</strong></p></div>
            `;
        }
    }
}

window.initShopFallbackCatalog = initShopFallbackCatalog;
window.initCartCheckoutFallback = initCartCheckoutFallback;

window.addEventListener("load", () => {
    setTimeout(initShopFallbackCatalog, 600);
    setTimeout(initCartCheckoutFallback, 900);
});
