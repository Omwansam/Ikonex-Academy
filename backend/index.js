const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const errorHandler = require('./middleware/error.middleware');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const studentRouter = require('./routes/student.routes');
const teacherRouter = require('./routes/teacher.routes');
const streamRouter = require('./routes/stream.routes');
const subjectRouter = require('./routes/subject.routes');
const { assessmentRouter, scoreRouter } = require('./routes/assessment.routes');
const attendanceRouter = require('./routes/attendance.routes');
const notificationRouter = require('./routes/notification.routes');
const settingsRouter = require('./routes/settings.routes');
const eventRouter = require('./routes/event.routes');
const reportRouter = require('./routes/report.routes');
const studentPortalRouter = require('./routes/studentPortal.routes');

const app = express();

app.use(
    cors({
        origin: config.FRONTEND_URL || true,
        credentials: true,
    }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ name: 'Ikonex Academy API', status: 'ok' });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/streams', streamRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/scores', scoreRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/events', eventRouter);
app.use('/api/reports', reportRouter);
app.use('/api/student', studentPortalRouter);

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

app.use(errorHandler);

async function startServer() {
    await connectDB();

    const server = app.listen(config.PORT, () => {
        console.log(`Server is running on http://localhost:${config.PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(`${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
