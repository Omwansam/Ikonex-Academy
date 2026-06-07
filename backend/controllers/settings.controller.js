const { prisma } = require('../config/db');

const getSettings = async (req, res, next) => {
    try {
        let settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });

        if (!settings) {
            settings = await prisma.schoolSettings.create({
                data: {
                    id: 1,
                    schoolName: 'Ikonex Academy',
                    motto: 'Excellence in Education',
                    address: 'P.O. Box 12345, Nairobi, Kenya',
                    phone: '+254 700 123 456',
                    email: 'info@ikonex.ac.ke',
                    academicYear: new Date().getFullYear().toString(),
                    currentTerm: 'Term 1',
                    gradingSystem: 'A-E',
                },
            });
        }

        res.status(200).json(settings);
    } catch (error) {
        next(error);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const data = { ...req.body };
        delete data.id;

        const settings = await prisma.schoolSettings.upsert({
            where: { id: 1 },
            update: data,
            create: {
                id: 1,
                schoolName: data.schoolName || 'Ikonex Academy',
                motto: data.motto || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                academicYear: data.academicYear || new Date().getFullYear().toString(),
                currentTerm: data.currentTerm || 'Term 1',
                gradingSystem: data.gradingSystem || 'A-E',
            },
        });

        res.status(200).json(settings);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSettings, updateSettings };
