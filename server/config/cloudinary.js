//. Cloudinary module import kar rahe hain taki hum Cloudinary ki API ko use kar sakein.
//  Ye module Cloudinary ke services ko access karne deta hai.
//  Cloudinary ka v2 version use ho raha hai jo latest hai.
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    // Cloudinary ko authenticate karna taaki hum images/videos upload kar sakein.
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, // API key for authentication.
      api_secret: process.env.CLOUDINARY_SECRET_KEY, // Ye private key hai jo secure API calls ke liye use hoti hai
    });
    console.log("Cloudinary connected successfully.");
  } catch (error) {
   console.error("Error connecting to Cloudinary:", error);
  }
};
export default connectCloudinary;