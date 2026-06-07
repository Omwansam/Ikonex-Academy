const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const config = require('./env');

const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });

const prisma = new PrismaClient({
    adapter,
    log:
        config.NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
});

async function connectDB() {
    try {
        await prisma.$connect();
        console.log('Connected to the database via Prisma');
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
}

async function disconnectDB() {
    try {
        await prisma.$disconnect();
        console.log('Disconnected from the database');
    } catch (error) {
        console.error(`Error disconnecting from the database: ${error.message}`);
    }
}

module.exports = {
    prisma,
    connectDB,
    disconnectDB,
};
