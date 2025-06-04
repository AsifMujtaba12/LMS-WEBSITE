import Course from "../models/Course.js"

//get all courses
const getAllCourses = async (req, res) => {
  try {
    //Find all courses where isPublished is true
     

    //Exclude courseContent and enrolledStudents fields using .select()   and 
    //Populate educator's info from the educatorId reference
    const courses = await Course.find({ isPublished: true }).select([
      '-courseContent', '-enrolledStudents'
    ]).populate({ path: 'educatorId' });                      


    
    console.log(courses);

    // Send the courses in response
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get course by id 

const getCourseById = async (req, res)=>{

    // Extract course ID from request parameters
    const {id} = req.params
    try {

        // Fetch the course by ID and populate educator details
        const courseData = await Course.findById(id).populate({path:'educatorId'});
        console.log(courseData);

        //Remove Url if preview is not free
        courseData.courseContent.forEach((chapter)=>{ //Iterate over courseContent and hide lectureUrl if not free
            chapter.chapterContent.forEach((lecture)=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = '';
                }
            })
        })
        //  Send success response with filtered course data
        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            courseData
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

export { getAllCourses, getCourseById };