/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    env: {
        FIREBASE_API_KEY: "AIzaSyD9E-p_S6YuWa3UXenbPoCKWjIj7iZoAUA",
        FIREBASE_AUTH_DOMAIN: "codingwithrand.firebaseapp.com",
        FIREBASE_PROJECT_ID: "codingwithrand",
        FIREBASE_STORAGE_BUCKET: "codingwithrand.appspot.com",
        FIREBASE_MESSAGING_SENDER_ID: "12217560937",
        FIREBASE_APP_ID: "1:12217560937:web:fec4b9cb6cd3a60254d7f8",
        FIREBASE_MEASUREMENT_ID: "G-CFMLXXM8L4"
    }
}

module.exports = nextConfig
