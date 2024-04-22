/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    env: {
        FIREBASE_API_KEY: "AIzaSyD9E-p_S6YuWa3UXenbPoCKWjIj7iZoAUA",
        FIREBASE_AUTH_DOMAIN: "codingwithrand.firebaseapp.com",
        FIREBASE_PROJECT_ID: "codingwithrand",
        FIREBASE_STORAGE_BUCKET: "codingwithrand.appspot.com",
        FIREBASE_MESSAGING_SENDER_ID: "12217560937",
        FIREBASE_APP_ID: "1:12217560937:web:fec4b9cb6cd3a60254d7f8",
        FIREBASE_MEASUREMENT_ID: "G-CFMLXXM8L4",
        FIREBASE_PERSONAL_ADMIN_KEY: "23049rijfvjmkff3-4095t89re-23098549034050034958utr90-3240-432"
    },
    async headers() {
        return [
            {
                source: "/global/server/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                ],
            },
        ];
    }
}

module.exports = nextConfig
