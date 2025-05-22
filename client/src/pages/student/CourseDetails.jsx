import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from '../../components/student/Footer'
import Youtube from 'react-youtube';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [isAlreadyEnrolled, setisAlreadyEnrolled] = useState(null);
  const [playerData, setPlayerData] = useState(null);


  const [openSection, setOpenSection] = useState({});

  const { allCourses, calculateRating, calculateChapterTime,currency,calculateCourseDuration,calculateNoOfLectures } = useContext(AppContext);
  const fetchCourseData = async () => {
    if (allCourses && allCourses.length > 0) {
      const findCourseData = allCourses.find(
        (course) => course._id.toString() === id
      );
      console.log("findCourseData", findCourseData);
      setCourseData(findCourseData);
    }
  };
  const toggleSection = (index)=>{
    setOpenSection((prev)=>(
      {...prev, [index]:!prev[index]}
    ))
  }
  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);
  return courseData ? (
    <>
      <div
        className="flex md:flex-row flex-col-reverse relative gap-10 items-start
      justify-between md:px-36 px-8 md:pt-30 pt-20 text-left "
      >
        {/* leftside */}
        <div
          className="absolute top-0 left-0 w-full h-section-height -z-1
    bg-gradient-to-b from-cyan-100/70"
        ></div>
        <div className="max-w-xl z-10 to-gray-500">
          <h1 className="md:text-course-details-heading-large font-semibold to-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          />

          {/* reviews and ratings  */}
          <div className="flex items-center text-left space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-blue-600">
              ( {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"} )
            </p>
            <p className="text-gray-500">
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "Students" : "Student"}
            </p>
          </div>
          <p>
            Course by{" "}
            <span className="text-blue-600 underline underline-offset-2">
              Asif Mujtaba
            </span>
          </p>

          {/* Course Structure */}
          <div className="pt-8 to-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded-md"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow_down"
                        className={`${
                          openSection[index] ? "rotate-180" : ""
                        } transform transition-transform`}
                      />
                      <p className="font-medium md:text:base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden  transition-all duration-300 ${
                      openSection[index] ? "max-h-96" : "h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 to-gray-600 border-t border-gray-300 ">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex  items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play-icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex  items-center justify-between w-full to-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p onClick={()=>setPlayerData({
                                  videoId : lecture.lectureUrl.split('/').pop()
                                })}
                                  className="text-blue-500 cursor-pointer
                            "
                                >
                                  Preview
                                </p>
                              )}
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
          </div>
          {/* course description  */}
          <div className="py-20 text-sm  md:text-default">
            <h3 className="text-xl font-semibold to-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            />
          </div>
        </div>

        {/* rightside */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-md sm:hover:translate-y-[-10px] transition-all duration-300  overflow-hidden bg-white min-w-[300px] sm:mix-w-[420px]">
         {
          playerData ? 
          <Youtube videoId={playerData.videoId} opts={{playerVars : {autoplay:1}}} iframeClassName='w-full aspect-video'/>:
          <img src={courseData.courseThumbnail} />

         }
         
         
         
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time_left_clock"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days </span>
                <span>left at this price!</span>
              </p>
            </div>
            <div className="flex items-center pt-2 gap-3">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg to-gray-500 line-through">
                {currency} {courseData.coursePrice}
              </p>
              <p className="md:text-lg to-gray-500">
                {courseData.discount}% off
              </p>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 to-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star_icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="time_clock_icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson_icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button className="md:mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300
             rounded-md w-full py-3 mt-3 text-white font-medium">{isAlreadyEnrolled ? "AlreadyEnrolled" : "Enroll"}</button>
            <div className="pt-6">
              <p className="md:text-xl  text-lg  font-medium text-gray-800 ">What is in the Course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc
              text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
// 1. URL se id nikal rahe hain
// 2. Course ka data rakhne ke liye state bana rahe hain
// 3. Global context se saare courses le rahe hain
// 4. Ek function bana rahe hain jo courses me se id match kar ke course dhundega
// 5. useEffect se component load hote hi ye function call kar rahe hain
// 6. Return me simple page render kar rahe hain
