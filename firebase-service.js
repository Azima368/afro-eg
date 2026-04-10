// ===== Firebase Service Functions =====
// This file provides functions to interact with Firebase Firestore and Storage

const DB_COLLECTIONS = {
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
    ORDERS: 'orders'
};

// ===== Categories Functions =====

/**
 * Get all categories from Firestore
 * @returns {Promise<Array>} Array of categories
 */
async function getCategoriesFromDB() {
    try {
        const snapshot = await db.collection(DB_COLLECTIONS.CATEGORIES)
            .orderBy('createdAt', 'desc')
            .get();
        
        const categories = [];
        snapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Categories loaded from Firebase:', categories.length);
        return categories;
    } catch (error) {
        console.error('❌ Error loading categories:', error);
        // Fallback to localStorage if Firebase fails
        return getCategoriesFromLocalStorage();
    }
}

/**
 * Add a new category to Firestore
 * @param {Object} categoryData - Category data object
 * @returns {Promise<string>} Category ID
 */
async function addCategoryToDB(categoryData) {
    try {
        const categoryWithTimestamp = {
            ...categoryData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection(DB_COLLECTIONS.CATEGORIES).add(categoryWithTimestamp);
        console.log('✅ Category added to Firebase:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding category:', error);
        throw error;
    }
}

/**
 * Update a category in Firestore
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 */
async function updateCategoryInDB(categoryId, categoryData) {
    try {
        const updateData = {
            ...categoryData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection(DB_COLLECTIONS.CATEGORIES).doc(categoryId).update(updateData);
        console.log('✅ Category updated in Firebase:', categoryId);
    } catch (error) {
        console.error('❌ Error updating category:', error);
        throw error;
    }
}

/**
 * Delete a category from Firestore
 * @param {string} categoryId - Category ID to delete
 */
async function deleteCategoryFromDB(categoryId) {
    try {
        await db.collection(DB_COLLECTIONS.CATEGORIES).doc(categoryId).delete();
        console.log('✅ Category deleted from Firebase:', categoryId);
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        throw error;
    }
}

// ===== Products Functions =====

/**
 * Get all products from Firestore
 * @returns {Promise<Array>} Array of products
 */
async function getProductsFromDB() {
    try {
        const snapshot = await db.collection(DB_COLLECTIONS.PRODUCTS)
            .orderBy('createdAt', 'desc')
            .get();
        
        const products = [];
        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Products loaded from Firebase:', products.length);
        return products;
    } catch (error) {
        console.error('❌ Error loading products:', error);
        // Fallback to localStorage
        return getProductsFromLocalStorage();
    }
}

/**
 * Add a new product to Firestore
 * @param {Object} productData - Product data object
 * @returns {Promise<string>} Product ID
 */
async function addProductToDB(productData) {
    try {
        const productWithTimestamp = {
            ...productData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection(DB_COLLECTIONS.PRODUCTS).add(productWithTimestamp);
        console.log('✅ Product added to Firebase:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding product:', error);
        throw error;
    }
}

/**
 * Update a product in Firestore
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 */
async function updateProductInDB(productId, productData) {
    try {
        const updateData = {
            ...productData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection(DB_COLLECTIONS.PRODUCTS).doc(productId).update(updateData);
        console.log('✅ Product updated in Firebase:', productId);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        throw error;
    }
}

/**
 * Delete a product from Firestore
 * @param {string} productId - Product ID to delete
 */
async function deleteProductFromDB(productId) {
    try {
        await db.collection(DB_COLLECTIONS.PRODUCTS).doc(productId).delete();
        console.log('✅ Product deleted from Firebase:', productId);
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        throw error;
    }
}

// ===== Orders Functions =====

/**
 * Get all orders from Firestore
 * @returns {Promise<Array>} Array of orders
 */
async function getOrdersFromDB() {
    try {
        const snapshot = await db.collection(DB_COLLECTIONS.ORDERS)
            .orderBy('createdAt', 'desc')
            .get();
        
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Orders loaded from Firebase:', orders.length);
        return orders;
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('AFRO_orders') || '[]');
    }
}

/**
 * Add a new order to Firestore
 * @param {Object} orderData - Order data object
 * @returns {Promise<string>} Order ID
 */
async function addOrderToDB(orderData) {
    try {
        const orderWithTimestamp = {
            ...orderData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: orderData.status || 'pending'
        };
        
        const docRef = await db.collection(DB_COLLECTIONS.ORDERS).add(orderWithTimestamp);
        console.log('✅ Order added to Firebase:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding order:', error);
        throw error;
    }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 */
async function updateOrderStatus(orderId, status) {
    try {
        await db.collection(DB_COLLECTIONS.ORDERS).doc(orderId).update({
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Order status updated:', orderId, status);
    } catch (error) {
        console.error('❌ Error updating order status:', error);
        throw error;
    }
}

/**
 * Delete an order from Firestore
 * @param {string} orderId - Order ID to delete
 */
async function deleteOrderFromDB(orderId) {
    try {
        await db.collection(DB_COLLECTIONS.ORDERS).doc(orderId).delete();
        console.log('✅ Order deleted from Firebase:', orderId);
    } catch (error) {
        console.error('❌ Error deleting order:', error);
        throw error;
    }
}

// ===== Storage Functions =====

/**
 * Upload an image to Cloudinary
 * @param {File} file - Image file
 * @param {string} path - Storage path (e.g., 'categories', 'products')
 * @returns {Promise<string>} Download URL
 */
async function uploadImageToStorage(file, path) {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        
        // Create form data for Cloudinary upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', path);
        formData.append('public_id', `${path}/${timestamp}_${file.name.split('.')[0]}`);
        
        // Upload to Cloudinary
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Cloudinary upload failed: ${response.status}`);
        }
        
        const data = await response.json();
        const downloadURL = data.secure_url;
        
        console.log('✅ Image uploaded to Cloudinary:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('❌ Error uploading image to Cloudinary:', error);
        throw error;
    }
}

/**
 * Delete an image (Cloudinary deletion requires API signature)
 * @param {string} imageUrl - Full image URL
 */
async function deleteImageFromStorage(imageUrl) {
    try {
        // For Cloudinary, deletion requires server-side API with signature
        // We'll just log it - manual deletion can be done via Cloudinary dashboard
        console.log('📝 Note: To delete Cloudinary image, use dashboard:', imageUrl);
    } catch (error) {
        console.error('❌ Error deleting image:', error);
        // Don't throw - image might not exist
    }
}

// ===== Real-time Listeners =====

/**
 * Listen for real-time category updates
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
function listenToCategories(callback) {
    return db.collection(DB_COLLECTIONS.CATEGORIES)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const categories = [];
            snapshot.forEach(doc => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(categories);
        }, error => {
            console.error('❌ Error listening to categories:', error);
        });
}

/**
 * Listen for real-time product updates
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
function listenToProducts(callback) {
    return db.collection(DB_COLLECTIONS.PRODUCTS)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const products = [];
            snapshot.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(products);
        }, error => {
            console.error('❌ Error listening to products:', error);
        });
}

/**
 * Listen for real-time order updates
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
function listenToOrders(callback) {
    return db.collection(DB_COLLECTIONS.ORDERS)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const orders = [];
            snapshot.forEach(doc => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(orders);
        }, error => {
            console.error('❌ Error listening to orders:', error);
        });
}

// ===== Fallback Functions (localStorage) =====

function getCategoriesFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('AFRO_categories') || '[]');
    } catch {
        return [];
    }
}

function getProductsFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('AFRO_products') || '[]');
    } catch {
        return [];
    }
}

// ===== Migration Functions =====

/**
 * Migrate data from localStorage to Firebase
 * Useful for initial setup
 */
async function migrateDataToFirebase() {
    try {
        console.log('🔄 Starting data migration to Firebase...');
        
        // Migrate categories
        const categories = getCategoriesFromLocalStorage();
        for (const category of categories) {
            // Check if category already exists in Firebase
            const existing = await db.collection(DB_COLLECTIONS.CATEGORIES)
                .where('name', '==', category.name)
                .get();
            
            if (existing.empty) {
                const { id, ...categoryData } = category;
                await addCategoryToDB(categoryData);
            }
        }
        
        // Migrate products
        const products = getProductsFromLocalStorage();
        for (const product of products) {
            const existing = await db.collection(DB_COLLECTIONS.PRODUCTS)
                .where('name', '==', product.name)
                .get();
            
            if (existing.empty) {
                const { id, ...productData } = product;
                await addProductToDB(productData);
            }
        }
        
        console.log('✅ Data migration completed!');
        showNotification('تم نقل البيانات إلى Firebase بنجاح!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        showNotification('فشل نقل البيانات', 'error');
    }
}

// Make migration function available globally
window.migrateDataToFirebase = migrateDataToFirebase;

console.log('✅ Firebase Service loaded');
