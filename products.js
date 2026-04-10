// ===== Products Page JavaScript =====

let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    categories: [],
    sizes: [],
    minPrice: null,
    maxPrice: null,
    sort: 'default'
};

// ===== Initialize Products Page =====
function initProductsPage() {
    allProducts = getProducts();
    filteredProducts = [...allProducts];

    loadCategoryFilters();
    loadProducts();
    setupFilterListeners();
    setupMobileFilters();

    // Check for category parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    if (categoryId) {
        const checkbox = document.querySelector(`input[name="category"][value="${categoryId}"]`);
        if (checkbox) {
            checkbox.checked = true;
            currentFilters.categories.push(parseInt(categoryId));
            applyFilters();
        }
    }
}

// ===== Load Category Filters =====
function loadCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    const categories = getCategories();

    categoryFilters.innerHTML = categories.map(category => `
        <label class="filter-checkbox">
            <input type="checkbox" name="category" value="${category.id}">
            <span>${category.name}</span>
        </label>
    `).join('');
}

// ===== Load Products =====
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const noProducts = document.getElementById('noProducts');

    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        productsCount.textContent = 'لا توجد منتجات';
        return;
    }

    productsGrid.style.display = 'grid';
    noProducts.style.display = 'none';
    productsCount.textContent = `عرض ${filteredProducts.length} منتج`;

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" onclick="window.location.href='product.html?id=${product.id}'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id}); event.stopPropagation();">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">
                    <span class="currency">EGP</span>${product.price}
                </p>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        أضف للسلة
                    </button>
                    <button class="btn-secondary" onclick="window.location.href='product.html?id=${product.id}'" style="padding: 0.8rem; border-radius: 10px; flex: 0.5;">
                        عرض
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Setup Filter Listeners =====
function setupFilterListeners() {
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const categoryId = parseInt(e.target.value);
            if (e.target.checked) {
                currentFilters.categories.push(categoryId);
            } else {
                currentFilters.categories = currentFilters.categories.filter(id => id !== categoryId);
            }
            applyFilters();
        });
    });

    // Size filters
    document.querySelectorAll('input[name="size"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const size = e.target.value;
            if (e.target.checked) {
                currentFilters.sizes.push(size);
            } else {
                currentFilters.sizes = currentFilters.sizes.filter(s => s !== size);
            }
            applyFilters();
        });
    });

    // Price filter
    const applyPriceBtn = document.getElementById('applyPrice');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;

            currentFilters.minPrice = minPrice ? parseInt(minPrice) : null;
            currentFilters.maxPrice = maxPrice ? parseInt(maxPrice) : null;

            applyFilters();
        });
    }

    // Sort filter
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            applyFilters();
        });
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// ===== Apply Filters =====
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0) {
            if (!currentFilters.categories.includes(product.categoryId)) {
                return false;
            }
        }

        // Size filter
        if (currentFilters.sizes.length > 0) {
            const hasSize = currentFilters.sizes.some(size => product.sizes.includes(size));
            if (!hasSize) {
                return false;
            }
        }

        // Price filter
        if (currentFilters.minPrice !== null && product.price < currentFilters.minPrice) {
            return false;
        }
        if (currentFilters.maxPrice !== null && product.price > currentFilters.maxPrice) {
            return false;
        }

        return true;
    });

    // Apply sorting
    switch (currentFilters.sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            break;
        default:
            // Keep default order
            break;
    }

    loadProducts();
}

// ===== Clear All Filters =====
function clearAllFilters() {
    // Reset filters object
    currentFilters = {
        categories: [],
        sizes: [],
        minPrice: null,
        maxPrice: null,
        sort: 'default'
    };

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear price inputs
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';

    // Reset sort select
    document.getElementById('sortSelect').value = 'default';

    // Reapply filters (which will show all products)
    applyFilters();
}

// ===== Setup Mobile Filters =====
function setupMobileFilters() {
    const toggleFiltersBtn = document.getElementById('toggleFilters');
    const filtersSidebar = document.querySelector('.filters-sidebar');

    if (!toggleFiltersBtn || !filtersSidebar) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);

    toggleFiltersBtn.addEventListener('click', () => {
        filtersSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    overlay.addEventListener('click', () => {
        filtersSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

