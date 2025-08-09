import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import usersRouter from './routes/users';
import villasRouter from './routes/villas';
import bookingsRouter from './routes/bookings';
import notificationsRouter from './routes/notifications';
import promotionsRouter from './routes/promotions';
import reportsRouter from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  return res.json({ status: 'OK', message: 'Server is running' });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/villas', villasRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/promotions', promotionsRouter);
app.use('/api/reports', reportsRouter);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});