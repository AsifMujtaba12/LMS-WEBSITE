import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import CourseProgress from "../models/CourseProgress.js";

// get user Data: To fetch the logged-in user's data using their userId stored in req.auth.userId.
const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    console.log("userdetails", user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not Found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Enrolled Courses with lecture Links || To get all the courses a user is enrolled in, with course details populated.
const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    console.log("userData", userData);

    // Send back only the enrolledCourses array
    res
      .status(200)
      .json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//purchase course  
const purchaseCourse = async (req, res) => {
    try {
        // Extract courseId from request body and origin from headers
        const { courseId } = req.body;
        const { origin } = req.headers;

        // Get the authenticated user's ID
        const userId = req.auth.userId;

        // Fetch user and course data from database
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        // If user or course is not found, respond with error
        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' });
        }

        
        // Create purchase data to store in DB
        const purchaseData = {
            courseId: courseData._id, // Course being purchased
            userId: userId,           // User who is purchasing
            amount:  courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100).toFixed(2)          // Final price
        };

        // Save the purchase record in the database
        const newPurchase = await Purchase.create(purchaseData);
        console.log("newPurchase", newPurchase)

        // Initialize Stripe instance using secret key
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase(); // e.g., 'usd'

        // Define line items for the Stripe Checkout session
        const line_items = [{
            price_data: {
                currency, // Currency type (e.g., USD)
                product_data: {
                    name: courseData.courseTitle // Name shown on Stripe Checkout
                },
                unit_amount: Math.floor(newPurchase.amount * 100), // Amount in cents
            },
            quantity: 1
        }];

        // Create Stripe Checkout session
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`, // On success
            cancel_url: `${origin}`,                         // On cancel
            line_items: line_items,
            mode: 'payment', // Payment mode
            metadata: {
                purchasedId: newPurchase._id.toString() // Store purchase ID in metadata
            }
        });

        // Return session URL to the frontend so user can be redirected
        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ success: false, message: error.message });
    }
};


//update user course progress
const updateUserCourseProgress = async (req, res) => {
    try {
        // Get the user ID from the authenticated request
        const userId = req.auth.userId;

        // Destructure courseId and lectureId from the request body
        const { courseId, lectureId } = req.body;

        // Find existing progress for this user and course
        const progressData = await CourseProgress.findOne({ userId, courseId });
        console.log("progressData", progressData)

        if (progressData) {
            // Check if this lecture is already marked as completed
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.status(200).json({
                    success: true,
                    message: "Lecture Already Completed"
                });
            }

            // If not completed, add lectureId to the lectureCompleted array
            progressData.lectureCompleted.push(lectureId);

            // Save the updated progress document
            await progressData.save();
        } else {
            // If no progress exists for this course, create a new document
            await CourseProgress.create({
                userId,           // ID of the user
                courseId,         // ID of the course
                lectureCompleted: [lectureId]  // Start with this lecture as completed
            });
        }

        // Send success response after updating or creating progress
        res.status(200).json({
            success: true,
            message: "Progress Updated"
        });

    } catch (error) {
        // Catch and return server error if something goes wrong
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//get User Course Progress
const  getUserCourseData = async (req, res) =>{
    try {
        // Get the user ID from the authenticated request
        const userId = req.auth.userId;
        const {courseId} = req.body;
        // Find existing progress for this user and course
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.status(200).json({success:true , progressData})
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// Rating Course by User
const addUserRating = async (req, res) => {
    try {
        // Step 1: Extract data
        const userId = req?.auth?.userId;
        const { courseId, rating } = req.body;

        // Step 2: Validate input
        if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Invalid input data." });
        }

        // Step 3: Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // Step 4: Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId.toString())) {
            return res.status(403).json({ success: false, message: "Access denied. Course not purchased." });
        }

        // Step 5: Check for existing rating by user
        const existingRatingIndex = course.courseRating.findIndex(
            (r) => r.userId.toString() === userId
        );

        if (existingRatingIndex > -1) {
            // Update existing rating
            course.courseRating[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            course.courseRating.push({ userId, rating });
        }

        // Step 6: Save course with new/updated rating
        await course.save();

        return res.status(200).json({ success: true, message: "Rating submitted successfully." });

    } catch (error) {
        console.error("Error adding user rating:", error);
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export {      getUserData, userEnrolledCourses, 
              purchaseCourse,  updateUserCourseProgress,
              getUserCourseData, addUserRating
    };










// What this function handles overall:
// The purchaseCourse function:

// Accepts a course purchase request from the frontend.

// Retrieves relevant user and course data.

// Calculates the final price after discount.

// Saves a purchase record in the database.

// Initializes Stripe and creates a Checkout session.

// Responds with the Stripe session URL so the frontend can redirect the user to Stripe for payment.



