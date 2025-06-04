import express from 'express';
import { getAllCourses,getCourseById } from '../controllers/courseController.js';

//Initialize a new router object for course-related routes
const courseRouter = express.Router();

// Purpose: Fetch all published courses (used for course listing pages)
courseRouter.get('/all', getAllCourses);

// Purpose: Fetch details of a specific course by its ID
// ':id' is a dynamic parameter (e.g., /courses/123)
courseRouter.get('/:id', getCourseById);

export default courseRouter;
