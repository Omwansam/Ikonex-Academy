require('dotenv').config();

const requiredInProduction = ['DATABASE_URL', 'JWT_SECRET'];

function validateEnv() {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length && process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
        console.warn('Warning: JWT_SECRET is not set. Authentication will fail.');
    }

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set. Add it to your .env file.');
    }
}

validateEnv();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    /** If set, CORS allows only this origin. If unset, reflects requesting origin (fine for local Vite). */
    FRONTEND_URL: process.env.FRONTEND_URL,
};
