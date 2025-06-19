import React, { use, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
// useParams is used to get dynamic route parameters like courseId
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
// humanizeDuration converts time in ms into readable format (e.g., "1h 20m")
import humanizeDuration from "humanize-duration";
import Youtube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
const Player = () => {
  // Get courseId from URL (via /player/:courseId route)
  const { courseId } = useParams();

  // Destructure context values: all enrolled courses and time calculator
  const { enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses} = useContext(AppContext);

  // Logging all enrolled courses
  console.log("data in enrolledCourses", enrolledCourses);

  // State to hold current course data by ID
  const [courseData, setCourseData] = useState(null);

  // State to toggle collapse/expand sections (chapters)
  const [openSection, setOpenSection] = useState({});

  // State for storing selected lecture's data for video player
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0);



  // Log the course data after finding it
  console.log("Data in courseData", courseData);

  // Function to find course from enrolledCourses by ID
  const getCourseData = () => {
    enrolledCourses.map((course) => {  //here map--->find
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRating.map((item)=>{
          if(item.userId === userData._id){
            setInitialRating(item.rating)
          }
        })
      }
    });
  };
  //mark lecture as a complete
const markLectureAsCompleted = async (courseId, lectureId)=>{
  try {
    const token = getToken();
    const { data } = await axios.post(backendUrl + '/api/user/update-course-progress',
      {courseId, lectureId}, {headers: {Authorization: `Bearer ${token}`}}
    )
    if(data.success){
      toast.success(data.message)
    }else{
      toast.error(data.message)
    }

  } catch (error) {
      toast.error(error.message)
    
  }
}
//getCourse progress
const getCourseProgress = async ()=>{
  try {
    const token = await getToken();
    const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', 
      {courseId}, {headers : {Authorization: `Bearer ${token}`}}
    );
    if(data.success){
      setProgressData(data.progressData)
    }else{
      toast.error(data.message);
    }
  } catch (error) {
      toast.error(error.message);
    
  }
}

//handle Rating
const handleRate = async (rating) =>{
  try {
    const token = await getToken();
    const { data } = await axios.post(backendUrl + '/api/user/add-rating',
      {courseId, rating}, {headers:{Authorization:`Bearer ${token}`}}
    )
    if(data.success){
      toast.success(data.message);
      fetchUserEnrolledCourses() // update course as i have given rating
    }else{
      toast.error(data.message)
    }
  } catch (error) {
      toast.error(error.message)

    
  }
}
  // Toggle open/close status of chapter
  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Fetch course data when component mounts or when enrolledCourses change
  useEffect(() => {
    if(enrolledCourses.length > 0){
    getCourseData();
    }
  }, [enrolledCourses]);
useEffect(()=>{
  getCourseProgress()
},[])
  return courseData ? (
    <>
      {/* Main layout: flex on mobile, grid on medium screens */}
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">

        {/* Left Side - Course structure */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {/* If course data exists, map through each chapter */}
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded-md"
                >
                  {/* Chapter title row with toggle icon */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      {/* Down arrow icon which rotates when open */}
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow_down"
                        className={`${
                          openSection[index] ? "rotate-180" : ""
                        } transform transition-transform`}
                      />
                      {/* Chapter Title */}
                      <p className="font-medium md:text:base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    {/* Number of lectures and total duration */}
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Toggleable section for listing lectures */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection[index] ? "max-h-96" : "h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 to-gray-600 border-t border-gray-300">
                      {/* Mapping each lecture of the chapter */}
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          {/* Icon before lecture name (tick/play) */}
                          <img
                            src={
                              progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon
                            }
                            alt="play-icon"
                            className="w-4 h-4 mt-1"
                          />
                          {/* Lecture title, watch button, and duration */}
                          <div className="flex items-center justify-between w-full to-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {/* If lecture has video URL, show Watch */}
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              {/* Lecture duration converted to human readable format */}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>

          {/* Rating section below course */}
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate This Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate}/>
          </div>
        </div>

        {/* Right Side - Video player */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              {/* YouTube Player Component */}
              <Youtube
                videoId={playerData.lectureUrl.split("/").pop()} // Extract video ID
                iframeClassName="w-full aspect-video"
              />
              {/* Lecture info and mark complete button */}
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture}.
                  {playerData.lectureTitle}
                </p>
                <button onClick={()=>markLectureAsCompleted(courseId, playerData.lectureId)}
                className="text-blue-600">
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            // If no video selected yet, show course thumbnail
            <img src={courseData ? courseData.courseThumbnail : ""} />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  ): <Loading/>
};

export default Player;
