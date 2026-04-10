// ===== Cart Page JavaScript =====

let cart = [];
let discount = 0;
const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 0; // Free shipping

// Valid coupon codes
const COUPONS = {
    'AFRO10': 10, // 10% discount
    'AFRO20': 20, // 20% discount
    'WELCOME': 15  // 15% discount
};

// ===== Initialize Cart Page =====
function initCartPage() {
    cart = getCart();
    loadCartItems();
    updateOrderSummary();
    setupCartControls();
}

// ===== Load Cart Items =====
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const cartLayout = document.getElementById('cartLayout');

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        document.getElementById('orderSummary').style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCart.style.display = 'none';
    document.getElementById('orderSummary').style.display = 'block';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-meta">
                    <span>المقاس: <strong>${item.size}</strong></span>
                    <span>السعر: <strong>${item.price} EGP</strong></span>
                </div>
                <p class="cart-item-price">${item.price * item.quantity} EGP</p>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="cart-qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button class="cart-qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeItem(${index})">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Prevent rapid quantity updates
let isUpdatingQuantity = false;

// ===== Update Quantity =====
function updateQuantity(index, change) {
    // Prevent duplicate calls
    if (isUpdatingQuantity) {
        console.log('Quantity update already in progress, ignoring duplicate click');
        return;
    }
    
    isUpdatingQuantity = true;
    console.log(`updateQuantity called - index: ${index}, change: ${change}, current qty: ${cart[index].quantity}`);
    
    cart[index].quantity += change;

    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    console.log(`New quantity: ${cart[index].quantity}`);
    
    saveCart(cart);
    loadCartItems();
    updateOrderSummary();
    
    // Reset after 300ms
    setTimeout(() => {
        isUpdatingQuantity = false;
    }, 300);
}

// ===== Remove Item =====
function removeItem(index) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        cart.splice(index, 1);
        saveCart(cart);
        loadCartItems();
        updateOrderSummary();
        showNotification('تم حذف المنتج من السلة');
    }
}

// ===== Update Order Summary =====
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + shipping - discountAmount;

    document.getElementById('subtotal').textContent = `${subtotal} EGP`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'مجاني' : `${shipping} EGP`;
    document.getElementById('total').textContent = `${total} EGP`;

    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-${discountAmount} EGP`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

// ===== Setup Cart Controls =====
function setupCartControls() {
    // Apply coupon
    const applyCouponBtn = document.getElementById('applyCoupon');
    const couponInput = document.getElementById('couponInput');

    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();

            if (COUPONS[code]) {
                discount = COUPONS[code];
                updateOrderSummary();
                showNotification(`تم تطبيق كود الخصم! خصم ${discount}%`);
                couponInput.value = '';
            } else {
                showNotification('كود الخصم غير صحيح', 'error');
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckoutModal);
    }

    // Close modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('checkoutModal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// ===== Open Checkout Modal =====
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }

    const modal = document.getElementById('checkoutModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update modal summary
    const modalSummaryItems = document.getElementById('modalSummaryItems');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + shipping - discountAmount;

    modalSummaryItems.innerHTML = `
        <div class="summary-item">
            <span>المجموع الفرعي</span>
            <span>${subtotal} EGP</span>
        </div>
        <div class="summary-item">
            <span>الشحن</span>
            <span>${shipping === 0 ? 'مجاني' : shipping + ' EGP'}</span>
        </div>
        ${discount > 0 ? `
            <div class="summary-item" style="color: #4ade80;">
                <span>الخصم (${discount}%)</span>
                <span>-${discountAmount} EGP</span>
            </div>
        ` : ''}
    `;

    document.getElementById('modalTotal').textContent = `${total} EGP`;
}

// ===== Handle Checkout =====
function handleCheckout(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const orderData = {
        orderNumber: 'FRV' + Date.now(),
        customer: {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            zipCode: formData.get('zipCode')
        },
        payment: formData.get('payment'),
        notes: formData.get('notes'),
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: discount,
        total: calculateTotal(),
        date: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('AFRO_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('AFRO_orders', JSON.stringify(orders));

    // Clear cart
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    cart = [];
    discount = 0;

    // Close checkout modal
    document.getElementById('checkoutModal').classList.remove('active');

    // Show success modal
    showSuccessModal(orderData.orderNumber);
}

// ===== Calculate Total =====
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping - discountAmount;
}

// ===== Show Success Modal =====
function showSuccessModal(orderNumber) {
    const successModal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    successModal.classList.add('active');

    // Update cart count
    updateCartCount();

    // Confetti effect (optional)
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 100);
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
});
