import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/whController.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import dotenv from 'dotenv';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
// Webhooks
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);


app.use(express.json()); // required for JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware()); // Clerk auth for all route
// API Routes
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);



// Test route
app.get('/', (req, res) => {
  res.send('Hello LMS Server is Working!');

});
// Start Server

  await connectDB();
  await connectCloudinary();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });