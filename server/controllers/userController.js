import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

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
            success_url: `${origin}/loading.my-enrollments`, // On success
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
export { getUserData, userEnrolledCourses, purchaseCourse };










// What this function handles overall:
// The purchaseCourse function:

// Accepts a course purchase request from the frontend.

// Retrieves relevant user and course data.

// Calculates the final price after discount.

// Saves a purchase record in the database.

// Initializes Stripe and creates a Checkout session.

// Responds with the Stripe session URL so the frontend can redirect the user to Stripe for payment.



