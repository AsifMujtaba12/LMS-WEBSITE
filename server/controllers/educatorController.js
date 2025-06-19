// Import Clerk's client library for Express.js backend
import { clerkClient } from '@clerk/express';
import { v2 as cloudinary } from "cloudinary";
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

// This function allows a regular user to upgrade to educator role
const updateRoleToEducator = async (req, res) => {
  try {
    // Step 1: Get the authenticated user's ID from Clerk
    // Clerk automatically attaches auth info to the request object
    const userId = req.auth.userId;
    console.log('Updating role for user:', userId); // Debug log

    // Step 2: Update user metadata in Clerk's database
    // This marks the user as an educator in the system
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {  
        role: 'educator' 
      }
    });

    // Step 3: Send success response if update was successful
    res.status(200).json({ 
      success: true, 
      message: "You can publish courses now" 
    });

  } catch (error) {
    // Step 4: Handle any errors that occur during the process
    console.error('Role update failed:', error); // Error logging
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//  Function to handle request for adding a new course to the database
const addCourse = async (req, res) => {
    try {
        //Destructure 'courseData' from request body
        const { courseData } = req.body;

        //Get uploaded image file (thumbnail) from the request
        const imageFile = req.file;

        //Get educator's ID from authenticated user
        const educator = req.auth.userId;

        // If no image file is attached, return error response
        if (!imageFile) {
            return res.status(400).json({
                message: "Thumbnail is not Attached", // error message
                success: false                        // flag to indicate failure
            });
        }

        //Parse the courseData string (from form-data) into JSON
        const parsedCourseData = JSON.parse(courseData);
        // console.log("parsedCourseData", parsedCourseData);
        //Add educator into course data object before saving
        parsedCourseData.educator = educator;

        //Create a new Course instance and insert initial data into database
        const newCourse = await Course.create(parsedCourseData);

        //Upload the thumbnail image to Cloudinary
        const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image' // specify file type
        });

        //Get secure URL of the uploaded image
        const imageUrl = uploadImage.secure_url;

        //Add the image URL to the course's `courseThumbnail` field
        newCourse.courseThumbnail = imageUrl;

        //Save the updated course again with the image URL
        await newCourse.save();

        //  Send success response to frontend
        res.status(200).json({
            message: "Course created successfully",
            success: true
        });

    } catch (error) {
        // Catch and log any server errors
        console.log(error);

        // Send error response to frontend
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}



// Get Educator Courses Controller Function
const getEducatorCourses = async (req, res) => {
    try {
        // 1. Get the logged-in educator's user ID from the auth middleware
        const educator= req.auth.userId;
        console.log(educator);

        // 2. Find all courses in the database that belong to this educator
        const courses = await Course.find({educator});
        console.log(courses);

        // 3. Send a success response with the list of courses
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Educator dashboard data 
const educatorDashboardData = async (req, res)=>{
  try {
   
    const educator = req.auth.userId;  //Get the educator's userId from authenticated request
    const courses = await Course.find({ educator });// Fetch all courses created by this educator
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);//Extract course IDs from the educator's courses

    
    // Find all purchases where courseId is in the educator's courses and purchase status is 'completed'
    const purchase = await Purchase.find({      
      courseId : {$in: courseIds},  //Yeh filter karta hai ki sirf completed purchases hi milein.
      status: "completed"
    })
    // Calculate total earnings from purchases
    const totalEarnings = purchase.reduce((sum, purchase)=> sum + purchase.amount, 0);  
    
    // Collect  unique enrolled student IDs with their course titles
    const enrolledStudentsData = []; // Prepare list of students enrolled in each course
    
    // For each course, find enrolled student details (only name and image)
    for(const course of courses){
      const students = await User.find(
       {_id : {$in: course.enrolledStudents}},
       'name , imageUrl'
       );
       students.forEach(student=>{
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
          
        })
       })
    }
    res.status(200).json({
      success: true,
       dashboardData :{
        totalEarnings, totalCourses, enrolledStudentsData
       }
    });

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//Get enrolled students Data with Purchase Data
const getEnrolledStudentsData = async (req, res) => {
  try {
    // 1. Get educator ID from the authenticated user (e.g., from JWT token)
    const educator= req.auth.userId;

    // 2. Fetch all courses that belong to this educator
    const courses = await Course.find({ educator });

    // 3. Extract all course IDs to use for filtering purchases
    const courseIds = courses.map(course => course._id);

    // 4. Find all 'completed' purchases that match these courseIds
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    })
    // 5. Populate student info (name, image) and course title from referenced documents
    .populate("userId", "name imageUrl")
    .populate("courseId", "courseTitle");

    // 6. Map purchases to array of { student, courseTitle }
    const enrolledStudentsData = purchases.map(purchase => ({
      student: purchase.userId,              // populated object { name, imageUrl }
      courseTitle: purchase.courseId.courseTitle  // course name from populated data
    }));

    // 7. Return success response with the enrolled students list
    res.status(200).json({
      success: true,
       enrolledStudentsData 
    });

  } catch (error) {
    // 8. Handle errors and send error message
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


    

export { updateRoleToEducator, addCourse, getEducatorCourses,getEnrolledStudentsData, educatorDashboardData};