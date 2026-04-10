// ===== Admin Panel JavaScript =====

// STORAGE_KEYS is defined in app.js which loads before this file
// If app.js fails to load, we'll use the backup getCategories/getProducts functions

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Backup helper functions (in case app.js is not loaded or fails)
// Use local STORAGE_KEYS_FALLBACK if global STORAGE_KEYS is not available
const STORAGE_KEYS_FALLBACK = {
    CATEGORIES: 'AFRO_categories',
    PRODUCTS: 'AFRO_products',
    CART: 'AFRO_cart',
    WISHLIST: 'AFRO_wishlist',
    USER: 'AFRO_user'
};

if (typeof getCategories !== 'function') {
    window.getCategories = function() {
        const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
        return JSON.parse(localStorage.getItem(keys.CATEGORIES) || '[]');
    };
}

if (typeof getProducts !== 'function') {
    window.getProducts = function() {
        const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
        return JSON.parse(localStorage.getItem(keys.PRODUCTS) || '[]');
    };
}

// Backup showNotification function (in case app.js is not loaded)
if (typeof showNotification !== 'function') {
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
            font-family: 'Tajawal', sans-serif;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s ease';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

let isAdminLoggedIn = false;
let currentEditCategory = null;
let currentEditProduct = null;

// ===== Initialize Admin Panel =====
function initAdminPanel() {
    checkAdminSession();
    setupAdminLogin();
    setupAdminLogout();
    setupNavigation();
    setupModals();
    loadAdminData();
}

// ===== Check Admin Session =====
function checkAdminSession() {
    const adminSession = sessionStorage.getItem('AFRO_admin_session');
    if (adminSession === 'active') {
        isAdminLoggedIn = true;
        showDashboard();
    }
}

// ===== Setup Admin Login =====
function setupAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginBtn = document.querySelector('#adminLoginForm button[type="submit"]');

    if (loginForm) {
        console.log('Login form found, attaching submit listener');
        
        loginForm.addEventListener('submit', function(e) {
            console.log('Form submit event triggered');
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Processing login...');

            const usernameInput = document.getElementById('adminUsername');
            const passwordInput = document.getElementById('adminPassword');
            
            if (!usernameInput || !passwordInput) {
                console.error('Username or password input not found!');
                showNotification('خطأ في النموذج - الرجاء تحديث الصفحة', 'error');
                return;
            }
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            console.log('Checking credentials for:', username);
            console.log('Expected:', ADMIN_CREDENTIALS.username, '/ Password entered:', password ? '****' : 'empty');

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                console.log('✅ Login successful!');
                isAdminLoggedIn = true;
                sessionStorage.setItem('AFRO_admin_session', 'active');
                showDashboard();
                showNotification('مرحباً بك في لوحة الإدارة! 🎉');
            } else {
                console.log('❌ Login failed - invalid credentials');
                showNotification('اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
                // Shake animation
                const card = document.querySelector('.admin-login-card');
                if (card) {
                    card.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 500);
                }
            }
        });
        
        // Also add click handler to button as backup
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                console.log('Login button clicked');
            });
        }
        
        console.log('Login form event listeners attached successfully');
    } else {
        console.error('❌ Login form not found!');
    }
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== Show Dashboard =====
function showDashboard() {
    console.log('🔄 showDashboard called - transitioning to dashboard...');
    
    const loginScreen = document.getElementById('adminLogin');
    const dashboard = document.getElementById('adminDashboard');
    
    console.log('Elements found:', { loginScreen: !!loginScreen, dashboard: !!dashboard });
    
    if (!loginScreen || !dashboard) {
        console.error('❌ Login or dashboard elements not found!');
        return;
    }
    
    // Hide login screen
    loginScreen.style.display = 'none';
    console.log('✅ Login screen hidden');
    
    // Show dashboard
    dashboard.style.display = 'grid';
    dashboard.style.visibility = 'visible';
    dashboard.style.opacity = '1';
    console.log('✅ Dashboard displayed');
    
    // Load data
    loadAdminData();
    console.log('✅ Admin data loaded');
}

// Manual login function for testing
window.manualLogin = function() {
    console.log('🔧 Manual login triggered');
    isAdminLoggedIn = true;
    sessionStorage.setItem('AFRO_admin_session', 'active');
    showDashboard();
    showNotification('تم تسجيل الدخول يدوياً! 🎉');
};

// Reset all data - clear categories, products, and orders
window.resetAllData = function() {
    if (!confirm('هل أنت متأكد من مسح جميع الأقسام والمنتجات؟\n\n⚠️ هذا الإجراء لا يمكن التراجع عنه!')) {
        return;
    }
    
    console.log('🗑️ Resetting all data...');
    
    const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
    
    // Clear all data
    localStorage.removeItem(keys.CATEGORIES);
    localStorage.removeItem(keys.PRODUCTS);
    localStorage.removeItem('AFRO_orders');
    
    // Re-initialize with empty arrays
    localStorage.setItem(keys.CATEGORIES, JSON.stringify([]));
    localStorage.setItem(keys.PRODUCTS, JSON.stringify([]));
    localStorage.setItem('AFRO_orders', JSON.stringify([]));
    
    // Reload the UI
    loadCategoriesAdmin();
    loadProductsAdmin();
    loadOrdersAdmin();
    updateStats();
    
    console.log('✅ All data has been reset');
    showNotification('تم مسح جميع البيانات بنجاح! 🗑️');
};

// Debug function to check data
window.debugData = function() {
    const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
    
    console.log('=== 🔍 DEBUG DATA ===');
    console.log('Storage Keys used:', keys);
    
    const catData = localStorage.getItem(keys.CATEGORIES);
    const prodData = localStorage.getItem(keys.PRODUCTS);
    const orderData = localStorage.getItem('AFRO_orders');
    
    console.log('Categories raw:', catData);
    console.log('Products raw:', prodData);
    console.log('Orders raw:', orderData);
    
    try {
        const categories = catData ? JSON.parse(catData) : [];
        const products = prodData ? JSON.parse(prodData) : [];
        const orders = orderData ? JSON.parse(orderData) : [];
        
        console.log('Categories parsed:', categories.length, categories);
        console.log('Products parsed:', products.length, products);
        console.log('Orders parsed:', orders.length, orders);
        
        return { categories, products, orders };
    } catch (e) {
        console.error('Error parsing data:', e);
        return null;
    }
};

// ===== Setup Admin Logout =====
function setupAdminLogout() {
    const logoutBtn = document.getElementById('adminLogout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                sessionStorage.removeItem('AFRO_admin_session');
                window.location.reload();
            }
        });
    }
}

// ===== Setup Navigation =====
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const section = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update active section
            document.querySelectorAll('.admin-section').forEach(sec => {
                sec.classList.remove('active');
            });
            document.getElementById(section + 'Section').classList.add('active');
        });
    });
}

// ===== Setup Modals =====
function setupModals() {
    // Category Modal
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const categoryForm = document.getElementById('categoryForm');

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            currentEditCategory = null;
            document.getElementById('categoryModalTitle').textContent = 'إضافة قسم جديد';
            categoryForm.reset();
            document.getElementById('categoryImagePreview').innerHTML = '';
            categoryModal.classList.add('active');
        });
    }

    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', () => {
            categoryModal.classList.remove('active');
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }

    // Product Modal
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const productForm = document.getElementById('productForm');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            currentEditProduct = null;
            document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
            productForm.reset();
            document.getElementById('productImagesPreview').innerHTML = '';
            loadCategoryOptions();
            productModal.classList.add('active');
        });
    }

    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => {
            productModal.classList.remove('active');
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Image previews
    const categoryImage = document.getElementById('categoryImage');
    if (categoryImage) {
        categoryImage.addEventListener('change', (e) => {
            previewSingleImage(e.target.files[0], 'categoryImagePreview');
        });
    }

    const productImages = document.getElementById('productImages');
    if (productImages) {
        productImages.addEventListener('change', (e) => {
            previewMultipleImages(e.target.files, 'productImagesPreview');
        });
    }

    // Order Modal
    const closeOrderModal = document.getElementById('closeOrderModal');
    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', () => {
            document.getElementById('orderModal').classList.remove('active');
        });
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
}

// ===== Load Admin Data =====
function loadAdminData() {
    updateStats();
    loadCategoriesAdmin();
    loadProductsAdmin();
    loadOrdersAdmin();
}

// ===== Update Stats =====
function updateStats() {
    const products = getProducts();
    const categories = getCategories();
    const orders = JSON.parse(localStorage.getItem('AFRO_orders') || '[]');
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
}

// ===== Load Categories (Admin) =====
function loadCategoriesAdmin() {
    console.log('loadCategoriesAdmin called');
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) {
        console.error('categoriesGrid element not found!');
        return;
    }

    const categories = getCategories();
    console.log('Categories loaded:', categories);

    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--AFRO-nude); padding: 3rem;">لا توجد أقسام بعد. قم بإضافة قسم جديد!</p>';
        return;
    }

    categoriesGrid.innerHTML = categories.map(category => `
        <div class="category-card">
            <img src="${category.image}" alt="${category.name}" class="category-image">
            <div class="category-content">
                <h3 class="category-title">${category.name}</h3>
                <p class="category-subtitle">${category.nameEn}</p>
                <p class="category-count">${category.count} منتج</p>
                <div class="category-actions">
                    <button class="btn-edit" onclick="editCategory(${category.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        تعديل
                    </button>
                    <button class="btn-delete" onclick="deleteCategory(${category.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`Rendered ${categories.length} categories to grid`);
}

// ===== Load Products (Admin) =====
function loadProductsAdmin() {
    const productsTableBody = document.getElementById('productsTableBody');
    if (!productsTableBody) return;

    const products = getProducts();

    if (products.length === 0) {
        productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--AFRO-nude);">لا توجد منتجات بعد. قم بإضافة منتج جديد!</td></tr>';
        return;
    }

    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.images[0]}" alt="${product.name}" class="product-image"></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td><strong style="color: var(--AFRO-gold);">${product.price} EGP</strong></td>
            <td>${product.stock}</td>
            <td>
                <div class="sizes-badge">
                    ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit" onclick="editProduct(${product.id})" title="تعديل">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct(${product.id})" title="حذف">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== Load Orders (Admin) =====
function loadOrdersAdmin() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;

    const orders = JSON.parse(localStorage.getItem('AFRO_orders') || '[]');

    if (orders.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--AFRO-nude);">لا توجد طلبات بعد</td></tr>';
        return;
    }

    ordersTableBody.innerHTML = orders.reverse().map(order => `
        <tr>
            <td><strong style="color: var(--AFRO-gold);">${order.orderNumber}</strong></td>
            <td>${order.customer.fullName}</td>
            <td>${order.customer.phone}</td>
            <td>${order.customer.city}</td>
            <td><strong style="color: var(--AFRO-gold);">${order.total} EGP</strong></td>
            <td>${new Date(order.date).toLocaleDateString('ar-EG')}</td>
            <td>
                <button class="btn-icon view" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&apos;")})' title="عرض التفاصيل">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== Handle Category Submit =====
function handleCategorySubmit(e) {
    e.preventDefault();
    console.log('handleCategorySubmit called');

    const categories = getCategories();
    const name = document.getElementById('categoryName').value;
    const nameEn = document.getElementById('categoryNameEn').value;
    const imageFile = document.getElementById('categoryImage').files[0];
    
    console.log('Form data:', { name, nameEn, hasImage: !!imageFile, isEdit: !!currentEditCategory });

    if (currentEditCategory) {
        // Edit existing category
        const category = categories.find(c => c.id === currentEditCategory);
        category.name = name;
        category.nameEn = nameEn;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                category.image = e.target.result;
                const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
                localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
                loadCategoriesAdmin();
                updateStats();
                showNotification('تم تحديث القسم بنجاح! ✅');
            };
            reader.readAsDataURL(imageFile);
        } else {
            const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
            localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
            loadCategoriesAdmin();
            updateStats();
            showNotification('تم تحديث القسم بنجاح! ✅');
        }
    } else {
        // Add new category
        if (!imageFile) {
            showNotification('الرجاء اختيار صورة للقسم', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const newCategory = {
                id: Date.now(),
                name: name,
                nameEn: nameEn,
                image: e.target.result,
                count: 0
            };
            
            console.log('📝 Creating new category:', newCategory);

            categories.push(newCategory);
            
            const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
            const saveData = JSON.stringify(categories);
            
            console.log('💾 Saving to localStorage key:', keys.CATEGORIES);
            console.log('💾 Data to save:', saveData);
            
            localStorage.setItem(keys.CATEGORIES, saveData);
            
            // Verify save worked
            const verifyData = localStorage.getItem(keys.CATEGORIES);
            console.log('✅ Verification - data in localStorage:', verifyData);
            console.log('✅ Category saved successfully! Total categories:', categories.length);
            
            loadCategoriesAdmin();
            updateStats();
            showNotification('تم إضافة القسم بنجاح! 🎉');
            console.log('✅ UI updated successfully');
        };
        reader.readAsDataURL(imageFile);
    }

    document.getElementById('categoryModal').classList.remove('active');
}

// ===== Handle Product Submit =====
function handleProductSubmit(e) {
    e.preventDefault();

    const products = getProducts();
    const categories = getCategories();

    const name = document.getElementById('productName').value;
    const nameEn = document.getElementById('productNameEn').value;
    const categoryId = parseInt(document.getElementById('productCategory').value);
    const price = parseInt(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const badge = document.getElementById('productBadge').value;
    const featured = document.getElementById('productFeatured').checked;

    const sizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked')).map(cb => cb.value);

    if (sizes.length === 0) {
        showNotification('الرجاء اختيار مقاس واحد على الأقل', 'error');
        return;
    }

    const imageFiles = document.getElementById('productImages').files;
    const category = categories.find(c => c.id === categoryId);

    const processProduct = (images) => {
        if (currentEditProduct) {
            // Edit existing product
            const product = products.find(p => p.id === currentEditProduct);
            const oldCategoryId = product.categoryId;

            product.name = name;
            product.nameEn = nameEn;
            product.categoryId = categoryId;
            product.category = category.name;
            product.price = price;
            product.description = description;
            product.stock = stock;
            product.badge = badge;
            product.featured = featured;
            product.sizes = sizes;

            if (images.length > 0) {
                product.images = images;
            }

            // Update category counts if category changed
            const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
            if (oldCategoryId !== categoryId) {
                const oldCategory = categories.find(c => c.id === oldCategoryId);
                if (oldCategory) oldCategory.count--;
                category.count++;
                localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
            }

            localStorage.setItem(keys.PRODUCTS, JSON.stringify(products));
            loadProductsAdmin();
            loadCategoriesAdmin();
            updateStats();
            showNotification('تم تحديث المنتج بنجاح! ✅');
        } else {
            // Add new product
            if (images.length === 0) {
                showNotification('الرجاء اختيار صورة واحدة على الأقل', 'error');
                return;
            }

            const newProduct = {
                id: Date.now(),
                name: name,
                nameEn: nameEn,
                categoryId: categoryId,
                category: category.name,
                price: price,
                description: description,
                images: images,
                sizes: sizes,
                stock: stock,
                featured: featured,
                badge: badge
            };

            products.push(newProduct);
            category.count++;

            const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
            localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
            localStorage.setItem(keys.PRODUCTS, JSON.stringify(products));
            loadProductsAdmin();
            loadCategoriesAdmin();
            updateStats();
            showNotification('تم إضافة المنتج بنجاح! 🎉');
        }

        document.getElementById('productModal').classList.remove('active');
    };

    if (imageFiles.length > 0) {
        const images = [];
        let processed = 0;

        Array.from(imageFiles).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                images.push(e.target.result);
                processed++;

                if (processed === imageFiles.length) {
                    processProduct(images);
                }
            };
            reader.readAsDataURL(file);
        });
    } else {
        processProduct([]);
    }
}

// ===== Edit Category =====
window.editCategory = function(id) {
    console.log('editCategory called with id:', id);
    
    // Convert id to number for proper comparison
    id = parseInt(id);
    
    const categories = getCategories();
    console.log('Available categories:', categories);
    
    const category = categories.find(c => c.id === id);

    if (!category) {
        console.error('Category not found with id:', id);
        return;
    }

    currentEditCategory = id;
    document.getElementById('categoryModalTitle').textContent = 'تعديل القسم';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryNameEn').value = category.nameEn;
    document.getElementById('categoryImagePreview').innerHTML = `<img src="${category.image}" class="preview-img">`;

    document.getElementById('categoryModal').classList.add('active');
}

// ===== Delete Category =====
window.deleteCategory = function(id) {
    console.log('deleteCategory called with id:', id);
    
    // Convert id to number for proper comparison
    id = parseInt(id);
    
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع المنتجات المرتبطة به.')) {
        console.log('Delete cancelled by user');
        return;
    }

    let categories = getCategories();
    let products = getProducts();
    
    console.log('Before delete - categories:', categories.length, 'products:', products.length);

    const keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
    
    // Delete products in this category
    products = products.filter(p => p.categoryId !== id);
    localStorage.setItem(keys.PRODUCTS, JSON.stringify(products));

    // Delete category
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
    
    console.log('After delete - categories:', categories.length);

    loadCategoriesAdmin();
    loadProductsAdmin();
    updateStats();
    showNotification('تم حذف القسم بنجاح!');
    
    console.log('Delete completed and UI updated');
}

// ===== Edit Product =====
window.editProduct = function(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) return;

    currentEditProduct = id;
    document.getElementById('productModalTitle').textContent = 'تعديل المنتج';
    document.getElementById('productName').value = product.name;
    document.getElementById('productNameEn').value = product.nameEn;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productBadge').value = product.badge || '';
    document.getElementById('productFeatured').checked = product.featured || false;

    loadCategoryOptions();
    document.getElementById('productCategory').value = product.categoryId;

    // Set sizes
    document.querySelectorAll('input[name="sizes"]').forEach(cb => {
        cb.checked = product.sizes.includes(cb.value);
    });

    // Show images
    const preview = document.getElementById('productImagesPreview');
    preview.innerHTML = product.images.map(img => `<img src="${img}" class="preview-img">`).join('');

    document.getElementById('productModal').classList.add('active');
}

// ===== Delete Product =====
window.deleteProduct = function(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    let products = getProducts();
    const product = products.find(p => p.id === id);

    products = products.filter(p => p.id !== id);
    let keys = typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : STORAGE_KEYS_FALLBACK;
    localStorage.setItem(keys.PRODUCTS, JSON.stringify(products));

    // Update category count
    const categories = getCategories();
    const category = categories.find(c => c.id === product.categoryId);
    if (category) {
        category.count--;
        localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories));
        loadCategoriesAdmin();
    }

    loadProductsAdmin();
    updateStats();
    showNotification('تم حذف المنتج بنجاح!');
}

// ===== View Order =====
window.viewOrder = function(order) {
    const orderDetails = document.getElementById('orderDetails');

    orderDetails.innerHTML = `
        <div class="order-section">
            <h4>معلومات العميل</h4>
            <div class="order-info-grid">
                <div class="order-info-item">
                    <span class="order-info-label">الاسم</span>
                    <span class="order-info-value">${order.customer.fullName}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">الهاتف</span>
                    <span class="order-info-value">${order.customer.phone}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">البريد الإلكتروني</span>
                    <span class="order-info-value">${order.customer.email}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">المدينة</span>
                    <span class="order-info-value">${order.customer.city}</span>
                </div>
                <div class="order-info-item" style="grid-column: 1 / -1;">
                    <span class="order-info-label">العنوان</span>
                    <span class="order-info-value">${order.customer.address}</span>
                </div>
            </div>
        </div>
        
        <div class="order-section">
            <h4>المنتجات</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.size}) × ${item.quantity}</span>
                        <span style="color: var(--AFRO-gold); font-weight: 700;">${item.price * item.quantity} EGP</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-total">
            <span>الإجمالي</span>
            <span>${order.total} EGP</span>
        </div>
        
        ${order.notes ? `
            <div class="order-section">
                <h4>ملاحظات</h4>
                <p style="color: var(--AFRO-nude);">${order.notes}</p>
            </div>
        ` : ''}
    `;

    document.getElementById('orderModal').classList.add('active');
}

// ===== Load Category Options =====
function loadCategoryOptions() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;

    const categories = getCategories();

    categorySelect.innerHTML = '<option value="">اختر القسم</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// ===== Preview Single Image =====
function previewSingleImage(file, containerId) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById(containerId).innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };
    reader.readAsDataURL(file);
}

// ===== Preview Multiple Images =====
function previewMultipleImages(files, containerId) {
    if (!files || files.length === 0) return;

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
});

// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    // Create mobile menu button
    const adminMain = document.querySelector('.admin-main');
    if (adminMain && !document.getElementById('mobileMenuToggle')) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.id = 'mobileMenuToggle';
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>القائمة</span>
        `;
        document.body.appendChild(menuButton);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);

        // Toggle sidebar
        const sidebar = document.querySelector('.admin-sidebar');
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close sidebar when clicking nav items on mobile
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const originalClick = item.onclick;
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    setTimeout(() => {
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                    }, 100);
                }
            });
        });
    }
});
