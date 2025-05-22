import mongoose from 'mongoose';

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
      // Listen for the 'connected' event, which is emitted when the connection is successful
      mongoose.connection.on('connected', () => {
        console.log('Database Connected'); // Log a success message when connected
      });
  
      // Attempt to connect to the MongoDB database using the connection URI from environment variables
      await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
  
    } catch (error) {
      // If an error occurs during the connection attempt, log the error message
      console.error('Error connecting to MongoDB:', error.message);
    }
  };
  
  // Export the connectDB function so it can be used in other parts of the application
export default connectDB;