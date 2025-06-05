import mongoose from 'mongoose';

// Define the schema to track a user's progress in a course
const courseProgressSchema = new mongoose.Schema({
  // The ID of the user associated with this progress
  userId: { type: String, required: true },

  // The ID of the course the user is taking
  courseId: { type: String, required: true },

  // Indicates whether the course is fully completed or not
  completed: { type: Boolean, default: false },

  // An array to store the lectures that have been completed
  lectureCompleted: []
}, {
  // Prevents mongoose from removing empty objects
  minimize: false,

  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true,

  // Sets the name of the MongoDB collection to "courseprogress"
  collection: 'courseprogress'
});


 const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema)
 export default CourseProgress;