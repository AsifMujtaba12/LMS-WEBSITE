import { Webhook }  from 'svix'; 
import User from '../models/User.js'
import Stripe from 'stripe';
import Purchase from '../models/Purchase.js';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
import { raw } from 'express';
dotenv.config();


//Api controller function to manage clerk user with data base
 const clerkWebhooks = async (request, response) => {
    try {
   
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(request.body), {
            "svix-id": request.headers['svix-id'],
            "svix-timestamp": request.headers['svix-timestamp'],
            "svix-signature": request.headers['svix-signature'],
        })
        console.log("Webhook verified");
        // request.body se type aur data extract karke Clerk ke events handle karna.
        const {data, type} = request.body;
        console.log('data and type :', data, type);
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }
                await User.create(userData);// Yeh line User model ka use karke naya user document MongoDB mein save karti hai.
                response.status(200).json({message: "User created successfully"});
                break;
                }
                case "user.updated":{
                    const userData = {
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    }
                    await User.findByIdAndUpdate(data.id, userData);
                    response.status(200).json({message: "User updated successfully"});
                    break;
                }
                case "user.deleted" : {
                await User.findByIdAndDelete(data.id);
                response.status(200).json({message: "User deleted successfully"});
                break;
                }
                default:
                    break;
            
        }
    } catch (error) {
        response.status(500).json({message: error.message});
    }
}

// Jab Clerk mein koi user create/update/delete hota hai, Clerk ek webhook bhejta hai.

// Yeh webhook clerkWebhooks function ke through aata hai.

// Webhook ko verify kiya jaata hai (security check) using svix (Clerk ke webhooks ka tool).

// Phir webhook ke data ko padke, database mein user create/update/delete kiya jaata hai.

//using securely  stripe apis

// Create a Stripe instance using your secret key

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook handler to listen for payment events from Stripe
const stripeWebhooks = async (request, response) => {

    // Stripe sends a signature in headers to verify the request
    const sig = request.headers['stripe-signature'];  
    let event;

    try {
        // Verify the event was sent by Stripe (not a fake request)
        event = Stripe.webhooks.constructEvent(
        request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        // If verification fails, return error to Stripe
        return response.status(400).json(`Webhook Error: ${error.message}`);
    }

    // Handle different types of Stripe events
    switch(event.type) {

        //  Case 1: Payment was successful
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object; // Get payment info
            const paymentIntentId = paymentIntent.id;

            // Get the related Checkout Session from paymentIntent
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });


            // Extract purchaseId from session metadata
            const { purchaseId } = session.data[0].metadata;
             if (!purchaseId) return response.status(400).json({ success: false, message: 'purchaseId missing in metadata' });

            // Fetch purchase, user, and course data from DB
            const purchaseData = await Purchase.findById(purchaseId);
            if (!purchaseData) return response.status(404).json({ success: false, message: 'Purchase not found' });

            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            // Add user to course's enrolled students
               // Safely push references
            if (!courseData.enrolledStudents.includes(userData._id)) {
                courseData.enrolledStudents.push(userData._id);
                await courseData.save();
            }

            if (!userData.enrolledCourses.includes(courseData._id)) {
                userData.enrolledCourses.push(courseData._id);
                await userData.save();
            }

            // Update the purchase status to "completed"
            purchaseData.status = "completed";
            await purchaseData.save();
            break;
        }

        //  Case 2: Payment failed
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Get the related Checkout Session
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            // Extract purchaseId from session metadata
            const { purchaseId } = session.data[0].metadata;

            // Update the purchase status to "failed"
            const purchaseData = await Purchase.findById(purchaseId);
           if (purchaseData) {
                purchaseData.status = 'failed';
                await purchaseData.save();
            }
            await purchaseData.save();
            break;
        }

        // Other unhandled event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Respond back to Stripe to confirm we received the event
    response.json({ received: true });
}



export {clerkWebhooks, stripeWebhooks}