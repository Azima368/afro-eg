// ===== Product Details Page JavaScript =====

// Use existing PRODUCT_STORAGE_KEYS from app.js or create local one
const PRODUCT_STORAGE_KEYS = window.STORAGE_KEYS || {
    CATEGORIES: 'AFRO_categories',
    PRODUCTS: 'AFRO_products',
    CART: 'AFRO_cart',
    WISHLIST: 'AFRO_wishlist',
    USER: 'AFRO_user'
};

// Backup helper functions if app.js not loaded
if (typeof getProducts !== 'function') {
    window.getProducts = function() {
        return JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEYS.PRODUCTS) || '[]');
    };
}

if (typeof getCart !== 'function') {
    window.getCart = function() {
        return JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEYS.CART) || '[]');
    };
}

if (typeof saveCart !== 'function') {
    window.saveCart = function(cart) {
        localStorage.setItem(PRODUCT_STORAGE_KEYS.CART, JSON.stringify(cart));
    };
}

if (typeof showNotification !== 'function') {
    window.showNotification = function(message, type = 'success') {
        console.log(`Notification: ${message}`);
        alert(message);
    };
}

let currentProduct = null;
let selectedSize = null;
let quantity = 1;

// ===== Initialize Product Page =====
function initProductPage() {
    console.log('🔄 initProductPage called');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    console.log('📦 Product ID from URL:', productId);

    if (!productId) {
        console.log('❌ No product ID found, redirecting...');
        window.location.href = 'products.html';
        return;
    }

    const products = getProducts();
    console.log('📋 All products loaded:', products.length, products);
    
    currentProduct = products.find(p => p.id === productId);
    console.log('🔍 Found product:', currentProduct);

    if (!currentProduct) {
        console.log('❌ Product not found, redirecting...');
        window.location.href = 'products.html';
        return;
    }

    console.log('✅ Loading product details...');
    loadProductDetails();
    setupProductControls();
}

// ===== Load Product Details =====
function loadProductDetails() {
    console.log('📋 Loading product details for:', currentProduct.name);
    console.log('🖼️ Product images:', currentProduct.images);
    console.log('📏 Product sizes:', currentProduct.sizes);
    
    // Check if elements exist
    const breadcrumb = document.getElementById('breadcrumbProduct');
    const category = document.getElementById('productCategory');
    const title = document.getElementById('productTitle');
    const price = document.getElementById('productPrice');
    const description = document.getElementById('productDescription');
    const stock = document.getElementById('stockCount');
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.getElementById('thumbnails');
    const sizeButtons = document.getElementById('sizeButtons');
    
    console.log('Elements found:', { breadcrumb, category, title, price, description, stock, mainImage, thumbnails, sizeButtons });

    if (!mainImage || !thumbnails) {
        console.error('❌ Image elements not found!');
        return;
    }

    // Update breadcrumb
    if (breadcrumb) breadcrumb.textContent = currentProduct.name;

    // Update product info
    if (category) category.textContent = currentProduct.category;
    if (title) title.textContent = currentProduct.name;
    if (price) price.textContent = currentProduct.price;
    if (description) description.textContent = currentProduct.description;
    if (stock) stock.textContent = currentProduct.stock;

    // Load main image
    if (currentProduct.images && currentProduct.images.length > 0) {
        mainImage.src = currentProduct.images[0];
        mainImage.alt = currentProduct.name;
        console.log('✅ Main image loaded:', currentProduct.images[0]);
    } else {
        console.error('❌ No images found for product!');
        mainImage.src = 'placeholder.jpg';
    }

    // Load thumbnails
    if (currentProduct.images && currentProduct.images.length > 0) {
        thumbnails.innerHTML = currentProduct.images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', ${index})">
                <img src="${image}" alt="${currentProduct.name}">
            </div>
        `).join('');
        console.log('✅ Thumbnails loaded:', currentProduct.images.length);
    }

    // Load size buttons
    if (sizeButtons && currentProduct.sizes && currentProduct.sizes.length > 0) {
        sizeButtons.innerHTML = currentProduct.sizes.map(size => `
            <button class="size-btn" onclick="selectSize('${size}')">${size}</button>
        `).join('');
        console.log('✅ Size buttons loaded:', currentProduct.sizes.length);
        
        // Select first size by default
        selectSize(currentProduct.sizes[0]);
    } else {
        console.error('❌ No sizes found or size buttons container missing!');
    }

    // Check if in wishlist
    const wishlist = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEYS.WISHLIST) || '[]');
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlist.includes(currentProduct.id)) {
        wishlistBtn.classList.add('active');
    }
}

// ===== Change Main Image =====
function changeMainImage(imageSrc, index) {
    document.getElementById('mainImage').src = imageSrc;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// ===== Select Size =====
function selectSize(size) {
    selectedSize = size;

    // Update active size button
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === size);
    });
}

// ===== Setup Product Controls =====
let controlsInitialized = false;

function setupProductControls() {
    // Prevent duplicate initialization
    if (controlsInitialized) {
        console.log('⚠️ Controls already initialized, skipping...');
        return;
    }
    controlsInitialized = true;
    
    console.log('🔧 Setting up product controls...');
    
    // Quantity controls
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    
    console.log('Elements found:', { decreaseBtn, increaseBtn, quantityInput });

    if (!decreaseBtn || !increaseBtn || !quantityInput) {
        console.error('❌ Quantity controls not found!');
        return;
    }

    decreaseBtn.addEventListener('click', () => {
        console.log('Decrease clicked, current quantity:', quantity);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            console.log('Quantity decreased to:', quantity);
        }
    });

    increaseBtn.addEventListener('click', () => {
        console.log('Increase clicked, current quantity:', quantity, 'stock:', currentProduct?.stock);
        if (quantity < currentProduct.stock) {
            quantity++;
            quantityInput.value = quantity;
            console.log('Quantity increased to:', quantity);
        }
    });

    // Add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    console.log('🛒 Add to cart button:', addToCartBtn);
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            console.log('🛒 Add to cart clicked, selectedSize:', selectedSize);
            if (!selectedSize) {
                showNotification('الرجاء اختيار المقاس أولاً', 'error');
                return;
            }

            addToCartWithQuantity(currentProduct.id, selectedSize, quantity);
        });
    } else {
        console.error('❌ Add to cart button not found!');
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            toggleWishlist(currentProduct.id);
            wishlistBtn.classList.toggle('active');
        });
    }
    
    console.log('✅ Product controls setup complete');
}

// ===== Add to Cart with Quantity =====
function addToCartWithQuantity(productId, size, qty) {
    console.log(`🛒 addToCartWithQuantity called - productId: ${productId}, size: ${size}, qty: ${qty}`);
    
    // Use shared isAddingToCart from app.js or create local one
    if (typeof window.isAddingToCart === 'undefined') {
        window.isAddingToCart = false;
    }
    
    // Prevent duplicate calls
    if (window.isAddingToCart) {
        console.log('Add to cart already in progress, ignoring duplicate click');
        return;
    }
    
    window.isAddingToCart = true;
    
    const products = getProducts();
    console.log('📦 Products loaded:', products.length);
    
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.log('❌ Product not found!');
        window.isAddingToCart = false;
        return;
    }
    
    console.log('✅ Found product:', product.name);

    const cart = getCart();
    console.log('🛒 Current cart:', cart);
    
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += qty;
        console.log('📈 Updated existing item quantity to:', existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: size,
            quantity: qty
        });
        console.log('➕ Added new item to cart');
    }

    console.log('💾 Saving cart:', cart);
    saveCart(cart);
    showNotification(`تمت إضافة ${qty} قطعة إلى السلة بنجاح!`);
    
    // Reset after 500ms
    setTimeout(() => {
        window.isAddingToCart = false;
    }, 500);
}

// Make functions globally available BEFORE DOMContentLoaded
window.initProductPage = initProductPage;
window.selectSize = selectSize;
window.changeMainImage = changeMainImage;
window.addToCartWithQuantity = addToCartWithQuantity;

// ===== Initialize on Page Load =====
// Expose initProductPage globally for inline script
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded fired, calling initProductPage...');
    if (typeof initProductPage === 'function') {
        initProductPage();
    } else {
        console.error('❌ initProductPage is not a function!');
    }
});
