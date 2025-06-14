import mongoose from "mongoose"; 


// Define the Lecture schema: represents individual lecture details
const lecturSchema = new mongoose.Schema({
    lectureId : { type : String, required : true },           // Unique identifier for the lecture
    lectureTitle : { type : String, required : true },        // Title of the lecture
    lectureDuration : { type : Number, required : true },     // Duration of the lecture in minutes/seconds
    lectureUrl : { type : String, required : true },          // URL link to the video/resource
    isPreviewFree : { type : Boolean, default : false, required : true }, // Is lecture available for free preview
    lectureOrder : { type : Number, required : true },        // Order/index of lecture in a chapter
}, 
{ _id : false }); // Disable automatic generation of _id for each lecture

// Define the Chapter schema: groups a list of lectures
const chapterSchema = new mongoose.Schema({
    chapterId : { type : String, required : true },           // Unique identifier for the chapter
    chapterOrder : { type : Number, required : true },        // Order of the chapter in the course
    chapterTitle : { type : String, required : true },        // Title of the chapter
    chapterContent : [lecturSchema],                          // Array of lectures in this chapter
}, 
{ _id : false }); // Disable automatic _id generation for each chapter

// Define the Course schema: main schema combining chapters and other course details
const courseSchema = new mongoose.Schema({
    courseTitle : { type : String, required : true },         // Title of the course
    courseDescription : { type : String, required : true },   // Full description of the course
    coursePrice : { type : Number, required : true },         // Base price of the course
    courseThumbnail: { type : String },                       // Thumbnail image URL
    isPublished : { type : Boolean, default : true },        // Whether the course is published or not
    discount : { type : Number, required: true, min: 0, max: 100 }, // Discount percentage
    courseContent : [chapterSchema],                          // Array of chapters in the course
    courseRating: [
        {
            userId : { type : String },                       // ID of the user who rated
            rating : { type : Number, min: 1, max: 5 }        // Rating between 1 to 5
        }
    ],
   educator: { type: String, ref: 'User', required: true },
   enrolledStudents: [{ type: String, ref: 'User' }]
       
}, 
{
    collection : 'courses',          // Name of the MongoDB collection
    timestamps: true,                // Automatically add createdAt and updatedAt fields
    minimize: false                  
});

// Create a Mongoose model from the course schema
const Course = mongoose.model("Course", courseSchema);

// Export the model to be used in other parts of the backend
export default Course;
