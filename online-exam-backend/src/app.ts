import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Frontend to Backend communication smooth karne ke liye [cite: 74]
app.use(express.json()); // Incoming JSON request body ko parse karne ke liye

// Base Route (Check karne ke liye ki API chal rahi hai)
app.get('/', (req, res) => {
    res.send('🚀 Online Examination Management System API is running...');
});

// App Routes attach kar rahe hain
app.use('/api/auth', authRoutes);

// Agar koi galat route hit kare toh handle karne ke liye fallback catch
app.use((req, res) => {
    res.status(404).json({ 
        message: `Route ${req.originalUrl} not found` 
    });
});

export default app;