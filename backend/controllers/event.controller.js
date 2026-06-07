const { prisma } = require('../config/db');
const { formatEvent } = require('../utils/formatters');

const getAllEvents = async (req, res, next) => {
    try {
        const events = await prisma.schoolEvent.findMany({
            orderBy: { date: 'asc' },
        });
        res.status(200).json(events.map(formatEvent));
    } catch (error) {
        next(error);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const { title, date, time, location, type } = req.body;
        if (!title || !date) {
            return res.status(400).json({ error: 'Title and date are required' });
        }

        const event = await prisma.schoolEvent.create({
            data: {
                title: title.trim(),
                date: new Date(date),
                time: time || '09:00',
                location: location || '',
                type: type || 'event',
            },
        });

        res.status(201).json(formatEvent(event));
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const data = { ...req.body };
        delete data.id;
        delete data.isPast;
        if (data.date) data.date = new Date(data.date);

        const event = await prisma.schoolEvent.update({
            where: { id: parseInt(req.params.id, 10) },
            data,
        });

        res.status(200).json(formatEvent(event));
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        await prisma.schoolEvent.delete({ where: { id: parseInt(req.params.id, 10) } });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent };
