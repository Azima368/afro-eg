// ===== Cloudinary Configuration =====
// Get these from: https://console.cloudinary.com/console

const CLOUDINARY_CONFIG = {
    cloudName: "dtjs65ykr",
    apiKey: "257732548124145",
    uploadPreset: "afro_store"
};

// Cloudinary API endpoint
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

console.log('✅ Cloudinary configured:', CLOUDINARY_CONFIG.cloudName);