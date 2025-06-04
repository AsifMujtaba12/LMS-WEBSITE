// Importing mongoose for schema creation
import mongoose from 'mongoose';

// Define the Purchase schema
const PurchaseSchema = new mongoose.Schema({

  // Reference to the purchased course
  courseId: {
    type: mongoose.Schema.Types.ObjectId, // Stores the ObjectId of the course
    ref: 'Course',                        // Reference to the 'Course' model
    required: true                        // This field is mandatory
  },

  // Reference to the user who made the purchase
  userId: {
    type: String,                         // Stores user ID as a string
    ref: 'User',                          // Reference to the 'User' model (optional if not using populate here)
    required: true                        // This field is mandatory
  },

  // Amount paid for the course
  amount: {
    type: Number,                         // Numeric value for payment amount
    required: true                        // This field is mandatory
  },

  // Purchase status with predefined values
  status: {
    type: String,                         // Status stored as a string
    enum: ['pending', 'completed', 'failed'], // Only these values are allowed
    default: 'pending'                    // Default status is 'pending'
  }

}, {
  timestamps: true                        // Automatically adds createdAt and updatedAt fields
});

// Create a model from the schema
const Purchase = mongoose.model('Purchase', PurchaseSchema);

// Exporting the model for use in other parts of the application
export default Purchase;
