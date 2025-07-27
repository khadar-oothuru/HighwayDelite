import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import noteRoutes from './routes/notes'

dotenv.config();

const app = express();

// CORS configuration: allow frontend origin, credentials, and all needed methods/headers
app.use(cors({
  origin: 'http://localhost:5173', // Set to your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());


app.get("/", (req, res) => res.send("Hello World!"))

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '', { })
  .then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
  })
  .catch(err => console.error('MongoDB connection error:', err));
