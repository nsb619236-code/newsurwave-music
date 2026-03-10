// ============================================
// FIREBASE CONFIGURATION
// ============================================

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebase };
}
