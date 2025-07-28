import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import noteRoutes from './routes/notes'

dotenv.config();

const app = express();



app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to HighwayDelite Note-Taking API!",
    endpoints: {
      auth: "/api/auth",
      notes: "/api/notes"
    },
    status: "API is running. See documentation for usage."
  });
})

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '', { })
  .then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
  })
  .catch(err => console.error('MongoDB connection error:', err));
