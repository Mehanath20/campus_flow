import 'dotenv/config';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes';
import productivityRoutes from './routes/productivity.routes';
import automationRoutes from './routes/automation.routes';
import innovationRoutes from './routes/innovation.routes';
import assignmentsRoutes from './routes/assignments.routes';
import attendanceRoutes from './routes/attendance.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Campus Flow API is running');
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});