// ===== Admin Panel JavaScript - Firebase Version =====
// This file extends admin.js with Firebase functionality
// It provides updated versions of functions that use Firebase instead of localStorage

// ===== Real-time Data Listeners =====
let categoriesUnsubscribe = null;
let productsUnsubscribe = null;
let ordersUnsubscribe = null;

// ===== Load Categories from Firebase (Real-time) =====
function initCategoriesListener() {
    console.log('Initializing categories listener...');
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    // Unsubscribe from previous listener if exists
    if (categoriesUnsubscribe) {
        categoriesUnsubscribe();
    }

    // Set up real-time listener
    categoriesUnsubscribe = listenToCategories((categories) => {
        console.log('Categories updated from Firebase:', categories.length);
        
        // Update localStorage as cache
        localStorage.setItem('AFRO_categories', JSON.stringify(categories));
        
        // Update UI
        renderCategories(categories);
        updateStats();
    });
}

// ===== Render Categories to Grid =====
function renderCategories(categories) {
    const categoriesGrid = document.getElementById('categoriesGrid');
    
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
                <p class="category-count">${category.count || 0} منتج</p>
                <div class="category-actions">
                    <button class="btn-edit" onclick="editCategory('${category.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        تعديل
                    </button>
                    <button class="btn-delete" onclick="deleteCategory('${category.id}')">
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
}

// ===== Load Products from Firebase (Real-time) =====
function initProductsListener() {
    console.log('Initializing products listener...');
    
    const productsTableBody = document.getElementById('productsTableBody');
    if (!productsTableBody) return;

    // Unsubscribe from previous listener if exists
    if (productsUnsubscribe) {
        productsUnsubscribe();
    }

    // Set up real-time listener
    productsUnsubscribe = listenToProducts((products) => {
        console.log('Products updated from Firebase:', products.length);
        
        // Update localStorage as cache
        localStorage.setItem('AFRO_products', JSON.stringify(products));
        
        // Update UI
        renderProducts(products);
        updateStats();
    });
}

// ===== Render Products to Table =====
function renderProducts(products) {
    const productsTableBody = document.getElementById('productsTableBody');
    
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
                    <button class="btn-icon edit" onclick="editProduct('${product.id}')" title="تعديل">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct('${product.id}')" title="حذف">
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

// ===== Load Orders from Firebase (Real-time) =====
function initOrdersListener() {
    console.log('Initializing orders listener...');
    
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;

    // Unsubscribe from previous listener if exists
    if (ordersUnsubscribe) {
        ordersUnsubscribe();
    }

    // Set up real-time listener
    ordersUnsubscribe = listenToOrders((orders) => {
        console.log('Orders updated from Firebase:', orders.length);
        
        // Update localStorage as cache
        localStorage.setItem('AFRO_orders', JSON.stringify(orders));
        
        // Update UI
        renderOrders(orders);
        updateStats();
    });
}

// ===== Render Orders to Table =====
function renderOrders(orders) {
    const ordersTableBody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--AFRO-nude);">لا توجد طلبات بعد</td></tr>';
        return;
    }

    ordersTableBody.innerHTML = orders.map(order => {
        const date = order.createdAt ? order.createdAt.toDate().toLocaleDateString('ar-EG') : new Date(order.date).toLocaleDateString('ar-EG');
        return `
        <tr>
            <td><strong style="color: var(--AFRO-gold);">${order.orderNumber}</strong></td>
            <td>${order.customer.fullName}</td>
            <td>${order.customer.phone}</td>
            <td>${order.customer.city}</td>
            <td><strong style="color: var(--AFRO-gold);">${order.total} EGP</strong></td>
            <td>${date}</td>
            <td>
                <button class="btn-icon view" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&apos;")})' title="عرض التفاصيل">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </td>
        </tr>
    `}).join('');
}

// ===== Updated Update Stats Function =====
async function updateStatsFromFirebase() {
    try {
        const products = await getProductsFromDB();
        const categories = await getCategoriesFromDB();
        const orders = await getOrdersFromDB();
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// ===== Handle Category Submit (Firebase Version) =====
async function handleCategorySubmitFirebase(e) {
    e.preventDefault();
    console.log('handleCategorySubmitFirebase called');

    const name = document.getElementById('categoryName').value;
    const nameEn = document.getElementById('categoryNameEn').value;
    const imageFile = document.getElementById('categoryImage').files[0];
    
    console.log('Form data:', { name, nameEn, hasImage: !!imageFile, isEdit: !!currentEditCategory });

    try {
        if (currentEditCategory) {
            // Edit existing category
            const categoryData = { name, nameEn };
            
            if (imageFile) {
                // Upload new image
                const imageUrl = await uploadImageToStorage(imageFile, 'categories');
                categoryData.image = imageUrl;
            } else {
                // Keep existing image
                const categories = await getCategoriesFromDB();
                const existingCategory = categories.find(c => c.id === currentEditCategory);
                if (existingCategory) {
                    categoryData.image = existingCategory.image;
                }
            }
            
            await updateCategoryInDB(currentEditCategory, categoryData);
            showNotification('تم تحديث القسم بنجاح! ✅');
        } else {
            // Add new category
            if (!imageFile) {
                showNotification('الرجاء اختيار صورة للقسم', 'error');
                return;
            }
            
            // Upload image
            const imageUrl = await uploadImageToStorage(imageFile, 'categories');
            
            const newCategory = {
                name,
                nameEn,
                image: imageUrl,
                count: 0
            };
            
            await addCategoryToDB(newCategory);
            showNotification('تم إضافة القسم بنجاح! ✅');
        }
        
        // Close modal and reset form
        document.getElementById('categoryModal').classList.remove('active');
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryImagePreview').innerHTML = '';
        currentEditCategory = null;
        
    } catch (error) {
        console.error('Error saving category:', error);
        showNotification('حدث خطأ أثناء حفظ القسم', 'error');
    }
}

// ===== Handle Product Submit (Firebase Version) =====
async function handleProductSubmitFirebase(e) {
    e.preventDefault();
    console.log('handleProductSubmitFirebase called');

    try {
        const name = document.getElementById('productName').value;
        const nameEn = document.getElementById('productNameEn').value;
        const categoryId = document.getElementById('productCategory').value;
        const price = parseInt(document.getElementById('productPrice').value);
        const description = document.getElementById('productDescription').value;
        const stock = parseInt(document.getElementById('productStock').value);
        const badge = document.getElementById('productBadge').value;
        const featured = document.getElementById('productFeatured').checked;
        
        // Get sizes
        const sizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
            .map(cb => cb.value);
        
        if (sizes.length === 0) {
            showNotification('الرجاء اختيار مقاس واحد على الأقل', 'error');
            return;
        }

        // Get category name
        const categories = await getCategoriesFromDB();
        const category = categories.find(c => c.id === categoryId);
        
        if (!category) {
            showNotification('القسم غير موجود', 'error');
            return;
        }

        const imageFiles = document.getElementById('productImages').files;
        
        let images = [];
        
        if (currentEditProduct) {
            // Edit mode - get existing images
            const products = await getProductsFromDB();
            const existingProduct = products.find(p => p.id === currentEditProduct);
            
            if (imageFiles.length > 0) {
                // Upload new images
                for (let file of imageFiles) {
                    const imageUrl = await uploadImageToStorage(file, 'products');
                    images.push(imageUrl);
                }
            } else {
                // Keep existing images
                images = existingProduct.images;
            }
            
            const productData = {
                name,
                nameEn,
                categoryId,
                category: category.name,
                price,
                description,
                stock,
                badge,
                sizes,
                images,
                featured
            };
            
            await updateProductInDB(currentEditProduct, productData);
            
            // Update category count if category changed
            if (existingProduct.categoryId !== categoryId) {
                category.count = (category.count || 0) + 1;
                await updateCategoryInDB(categoryId, { count: category.count });
                
                // Decrement old category count
                const oldCategory = categories.find(c => c.id === existingProduct.categoryId);
                if (oldCategory) {
                    oldCategory.count = Math.max(0, (oldCategory.count || 0) - 1);
                    await updateCategoryInDB(oldCategory.id, { count: oldCategory.count });
                }
            }
            
            showNotification('تم تحديث المنتج بنجاح! ✅');
        } else {
            // Add new product
            if (imageFiles.length === 0) {
                showNotification('الرجاء اختيار صورة واحدة على الأقل', 'error');
                return;
            }
            
            // Upload images
            for (let file of imageFiles) {
                const imageUrl = await uploadImageToStorage(file, 'products');
                images.push(imageUrl);
            }
            
            const newProduct = {
                name,
                nameEn,
                categoryId,
                category: category.name,
                price,
                description,
                stock,
                badge,
                sizes,
                images,
                featured
            };
            
            await addProductToDB(newProduct);
            
            // Update category count
            category.count = (category.count || 0) + 1;
            await updateCategoryInDB(categoryId, { count: category.count });
            
            showNotification('تم إضافة المنتج بنجاح! ✅');
        }
        
        // Close modal and reset form
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('productForm').reset();
        document.getElementById('productImagesPreview').innerHTML = '';
        currentEditProduct = null;
        
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('حدث خطأ أثناء حفظ المنتج', 'error');
    }
}

// ===== Delete Category (Firebase Version) =====
async function deleteCategoryFirebase(id) {
    console.log('deleteCategoryFirebase called with id:', id);
    
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع المنتجات المرتبطة به.')) {
        return;
    }
    
    try {
        // Get all products in this category
        const products = await getProductsFromDB();
        const categoryProducts = products.filter(p => p.categoryId === id);
        
        // Delete all products in this category
        for (const product of categoryProducts) {
            await deleteProductFromDB(product.id);
        }
        
        // Delete the category
        await deleteCategoryFromDB(id);
        
        showNotification('تم حذف القسم والمنتجات المرتبطة به بنجاح! ✅');
    } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('حدث خطأ أثناء حذف القسم', 'error');
    }
}

// ===== Delete Product (Firebase Version) =====
async function deleteProductFirebase(id) {
    console.log('deleteProductFirebase called with id:', id);
    
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        return;
    }
    
    try {
        // Get product to find its category
        const products = await getProductsFromDB();
        const product = products.find(p => p.id === id);
        
        if (product && product.categoryId) {
            // Update category count
            const categories = await getCategoriesFromDB();
            const category = categories.find(c => c.id === product.categoryId);
            if (category) {
                category.count = Math.max(0, (category.count || 0) - 1);
                await updateCategoryInDB(category.id, { count: category.count });
            }
        }
        
        // Delete product images from storage (optional)
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                try {
                    await deleteImageFromStorage(imageUrl);
                } catch (e) {
                    console.log('Could not delete image from storage:', e);
                }
            }
        }
        
        // Delete product
        await deleteProductFromDB(id);
        
        showNotification('تم حذف المنتج بنجاح! ✅');
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('حدث خطأ أثناء حذف المنتج', 'error');
    }
}

// ===== Edit Category (Firebase Version - updated for string IDs) =====
window.editCategory = async function(id) {
    console.log('editCategory called with id:', id);
    
    try {
        const categories = await getCategoriesFromDB();
        const category = categories.find(c => c.id === id);
        
        if (!category) {
            console.error('Category not found with id:', id);
            showNotification('القسم غير موجود', 'error');
            return;
        }
        
        currentEditCategory = id;
        document.getElementById('categoryModalTitle').textContent = 'تعديل القسم';
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryNameEn').value = category.nameEn;
        document.getElementById('categoryImagePreview').innerHTML = `<img src="${category.image}" class="preview-img">`;
        
        document.getElementById('categoryModal').classList.add('active');
    } catch (error) {
        console.error('Error loading category for edit:', error);
        showNotification('حدث خطأ أثناء تحميل بيانات القسم', 'error');
    }
};

// ===== Delete Category (Firebase Version - updated for string IDs) =====
window.deleteCategory = async function(id) {
    await deleteCategoryFirebase(id);
};

// ===== Edit Product (Firebase Version - updated for string IDs) =====
window.editProduct = async function(id) {
    console.log('editProduct called with id:', id);
    
    try {
        const products = await getProductsFromDB();
        const product = products.find(p => p.id === id);
        
        if (!product) {
            console.error('Product not found with id:', id);
            showNotification('المنتج غير موجود', 'error');
            return;
        }
        
        currentEditProduct = id;
        document.getElementById('productModalTitle').textContent = 'تعديل المنتج';
        document.getElementById('productName').value = product.name;
        document.getElementById('productNameEn').value = product.nameEn;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productBadge').value = product.badge || '';
        document.getElementById('productFeatured').checked = product.featured || false;
        
        // Load categories and select the product's category
        await loadCategoryOptions();
        document.getElementById('productCategory').value = product.categoryId;
        
        // Set sizes
        document.querySelectorAll('input[name="sizes"]').forEach(cb => {
            cb.checked = product.sizes.includes(cb.value);
        });
        
        // Show existing images
        document.getElementById('productImagesPreview').innerHTML = product.images.map(img => 
            `<img src="${img}" class="preview-img">`
        ).join('');
        
        document.getElementById('productModal').classList.add('active');
    } catch (error) {
        console.error('Error loading product for edit:', error);
        showNotification('حدث خطأ أثناء تحميل بيانات المنتج', 'error');
    }
};

// ===== Delete Product (Firebase Version - updated for string IDs) =====
window.deleteProduct = async function(id) {
    await deleteProductFirebase(id);
};

// ===== Load Category Options (Firebase Version) =====
async function loadCategoryOptionsFirebase() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;
    
    try {
        const categories = await getCategoriesFromDB();
        
        categorySelect.innerHTML = '<option value="">اختر القسم</option>';
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    } catch (error) {
        console.error('Error loading category options:', error);
    }
}

// ===== Override existing functions with Firebase versions =====
// These will be called instead of the original localStorage versions

// Store original functions
const originalLoadCategoriesAdmin = window.loadCategoriesAdmin;
const originalLoadProductsAdmin = window.loadProductsAdmin;
const originalLoadOrdersAdmin = window.loadOrdersAdmin;
const originalHandleCategorySubmit = window.handleCategorySubmit;
const originalHandleProductSubmit = window.handleProductSubmit;
const originalLoadCategoryOptions = window.loadCategoryOptions;

// Override with Firebase versions
window.loadCategoriesAdmin = function() {
    initCategoriesListener();
};

window.loadProductsAdmin = function() {
    initProductsListener();
};

window.loadOrdersAdmin = function() {
    initOrdersListener();
};

window.updateStats = function() {
    updateStatsFromFirebase();
};

// Override form submit handlers
document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.removeEventListener('submit', originalHandleCategorySubmit);
        categoryForm.addEventListener('submit', handleCategorySubmitFirebase);
    }
    
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.removeEventListener('submit', originalHandleProductSubmit);
        productForm.addEventListener('submit', handleProductSubmitFirebase);
    }
});

// Override loadCategoryOptions
window.loadCategoryOptions = loadCategoryOptionsFirebase;

console.log('✅ Admin Firebase module loaded - Firebase functionality enabled');
