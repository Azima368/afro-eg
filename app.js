// ===== Data Storage =====
const STORAGE_KEYS = {
    CATEGORIES: 'AFRO_categories',
    PRODUCTS: 'AFRO_products',
    CART: 'AFRO_cart',
    WISHLIST: 'AFRO_wishlist',
    USER: 'AFRO_user'
};

// Initialize default data - START WITH EMPTY DATA
function initializeDefaultData() {
    // Initialize empty categories if not exists
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
    }

    // Initialize empty products if not exists
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    }

    // Initialize empty cart if not exists
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }

    // Initialize empty wishlist if not exists
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
}

// ===== Helper Functions =====
function getCategories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
}

function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
}

function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartCount();
}

// Prevent rapid clicks
window.isAddingToCart = false;

function addToCart(productId, size = 'M') {
    // Prevent duplicate calls
    if (window.isAddingToCart) {
        console.log('Add to cart already in progress, ignoring duplicate click');
        return;
    }
    
    window.isAddingToCart = true;
    console.log(`addToCart called - productId: ${productId}, size: ${size}`);
    
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.log('Product not found!');
        window.isAddingToCart = false;
        return;
    }

    const cart = getCart();
    console.log('Current cart:', cart);
    
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
        console.log(`Updated existing item quantity to: ${existingItem.quantity}`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: size,
            quantity: 1
        });
        console.log('Added new item to cart');
    }

    console.log('Saving cart:', cart);
    saveCart(cart);
    showNotification('تمت الإضافة إلى السلة بنجاح!');
    
    // Reset after 500ms
    setTimeout(() => {
        window.isAddingToCart = false;
    }, 500);
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#D4AF37' : '#ff4444'};
        color: #1a1a1a;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 700;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Load Categories =====
function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) {
        console.log('categoriesGrid not found on this page');
        return;
    }

    // Read directly from localStorage to ensure fresh data
    const categoriesData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    
    console.log('🔄 Index page - Raw localStorage data:', categoriesData);
    console.log('🔄 Index page - Parsed categories:', categories.length, categories);

    if (categories.length === 0) {
        categoriesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 2rem; opacity: 0.3;">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3 style="color: var(--AFRO-gold); font-size: 2rem; margin-bottom: 1rem;">لا توجد أقسام بعد</h3>
                <p style="color: var(--AFRO-nude); font-size: 1.1rem; margin-bottom: 1rem;">قم بإضافة أقسام من لوحة الإدارة</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: var(--AFRO-gold); color: var(--AFRO-black); border: none; border-radius: 8px; cursor: pointer; margin: 10px;">
                    🔄 تحديث الصفحة
                </button>
            </div>
        `;
        return;
    }

    categoriesGrid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="window.location.href='products.html?category=${category.id}'">
            <img src="${category.image}" alt="${category.name}" class="category-image">
            <div class="category-info">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-count">${category.count} منتج</p>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ Index page - Rendered ${categories.length} categories`);
}

// ===== Load Featured Products =====
function loadFeaturedProducts() {
    const featuredSlider = document.getElementById('featuredSlider');
    if (!featuredSlider) return;

    const products = getProducts();
    const featuredProducts = products.filter(p => p.featured);

    if (featuredProducts.length === 0) {
        featuredSlider.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 2rem; opacity: 0.3;">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <h3 style="color: var(--AFRO-gold); font-size: 2rem; margin-bottom: 1rem;">لا توجد منتجات مميزة</h3>
                <p style="color: var(--AFRO-nude); font-size: 1.1rem; margin-bottom: 2rem;">قم بإضافة منتجات من لوحة الإدارة</p>
            </div>
        `;
        return;
    }

    featuredSlider.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
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
                    <button class="btn-secondary" onclick="window.location.href='product.html?id=${product.id}'" style="padding: 0.8rem; border-radius: 10px;">
                        عرض
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Wishlist Functions =====
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('تمت الإزالة من المفضلة');
    } else {
        wishlist.push(productId);
        showNotification('تمت الإضافة للمفضلة');
    }

    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
}

// ===== Navigation =====
function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Newsletter Form =====
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            showNotification('شكراً لاشتراكك! سنرسل لك آخر العروض على ' + email);
            newsletterForm.reset();
        });
    }
}

// ===== Secret Admin Access (Click Logo 5 Times) =====
let logoClickCount = 0;
let logoClickTimer = null;

function setupSecretAdminAccess() {
    const logo = document.querySelector('.nav-logo');

    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            logoClickCount++;

            // Clear previous timer
            if (logoClickTimer) {
                clearTimeout(logoClickTimer);
            }

            // Reset counter after 2 seconds
            logoClickTimer = setTimeout(() => {
                logoClickCount = 0;
            }, 2000);

            // If clicked 5 times, redirect to admin
            if (logoClickCount === 5) {
                logoClickCount = 0;
                showNotification('🔓 فتح لوحة الإدارة...');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 500);
            }
        });
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultData();
    updateCartCount();
    loadCategories();
    loadFeaturedProducts();
    setupNavigation();
    setupNewsletterForm();
    setupSecretAdminAccess();
    
});

// Listen for storage changes from other tabs (admin panel)
window.addEventListener('storage', (e) => {
    // Only update cart count, don't reload categories to avoid UI flickering
    if (e.key === STORAGE_KEYS.CART) {
        updateCartCount();
    }
    // Note: Categories reload removed to prevent flickering in admin panel
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
