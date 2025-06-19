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



app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware()); // Clerk auth for all route
// API Routes

app.use('/api/educator',express.json(), educatorRouter);
app.use('/api/course',express.json(), courseRouter);
app.use('/api/user',express.json(), userRouter);
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);



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