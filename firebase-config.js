// ===== Firebase Configuration =====
// Replace these values with your Firebase project configuration
// Get these from: Firebase Console > Project Settings > General > Your Apps > SDK setup and configuration

const firebaseConfig = {
    apiKey: "AIzaSyBeBP4QRc_Ys9qv-ILq75z7ZzV-NoHHOx0",
    authDomain: "afro-6cea5.firebaseapp.com",
    projectId: "afro-6cea5",
    storageBucket: "afro-6cea5.firebasestorage.app",
    messagingSenderId: "772028934794",
    appId: "1:772028934794:web:13f092e5622d4ae8c35b73"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence for Firestore
db.enablePersistence({
    synchronizeTabs: true
}).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.log('Persistence not available in this browser');
    }
});

console.log('✅ Firebase initialized successfully');
