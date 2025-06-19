// Step 1: Importing necessary modules
import { createContext, useEffect, useState } from "react"; // createContext is used to create a context for sharing data across components.
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import {useUser, useAuth} from "@clerk/clerk-react";
import axios from 'axios'
import { toast } from 'react-toastify';
import { dummyTestimonial } from "../assets/assets";

// Step 2: Creating the context
// Here, AppContext is being created using createContext.
// This context will hold the data  which can be shared across multiple components.
export const AppContext = createContext();

// Step 3: Creating the Context Provider component
const AppContextProvider = (props) => {
  // Step 3.1: Defining the data to be shared across components.
  // Here, we define an object `data` that will hold the  data.
  // This is the data that will be made available to the child components.
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const currency = import.meta.env.VITE_CURRENCY
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [testminials, setTestmonials] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [userData, setUserData] = useState(null);
  const {getToken} = useAuth();
  const {user} = useUser();

  const navigate = useNavigate()
  //fetch all courses 
  const fetchAllCourses = async ()=>{
  //  get data from db
  try {
   const {data} =  await axios.get(backendUrl + '/api/course/all');
   console.log("data of courses" , data)
   if(data.success){
    setAllCourses(data.courses)
   }else{
    toast.error(data.message)
   }
  } catch (error) {
    toast.error(error.message)
    
  }
  }
 

  //fetch UserData
  const fetchUserData = async ()=>{
    if(user.publicMetadata.role === "educator"){
      setIsEducator(true)
    }
    try {
      const token = await getToken(); 
      console.log(token)
      
      const { data } = await axios.get( backendUrl + '/api/user/data', {
        headers: {Authorization: `Bearer ${token}`}
      })
      if(data.success){
        setUserData(data.user);

      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  //Fetch User Enrolled Courses

const fetchUserEnrolledCourses = async ()=>{
  try {
    const token = await getToken();
    const { data } = await axios.get( backendUrl + '/api/user/enrolled-courses', {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if(data.success){
      setEnrolledCourses(data.enrolledCourses.reverse()) // new courses on 
      console.log('FETCHED ENROLLED COURSES', data.enrolledCourses);
    }else{
      toast.error(data.message)
    }
    
  } catch (error) {
    toast.error(error.message)
  }
}
 
  
  const fetchAllTestmonials = async ()=>{
    setTestmonials(dummyTestimonial)
  }
  //cal rating
  const calculateRating=(course)=>{
    if(course.courseRating.length === 0)  return 0;
   const totalRating=course.courseRating.reduce((sum, rating)=>sum + rating.rating, 0)
   return Math.floor(totalRating / course.courseRating.length)
    };
    //cal time duration of a chapter
  const calculateChapterTime = (chapter)=>{
   console.log("chapter" , chapter)

    let time=0;
    chapter.chapterContent.map((lecture)=>(
      time  += lecture.lectureDuration
    ));
    return humanizeDuration(time * 60 *1000, {units:["h", "m"]})

  }
  // calculateNoOfLectures
 const calculateNoOfLectures = (course) => {
  let totalLectures = 0;  // totalLectures variable ko 0 se initialize kar diya

  course?.courseContent?.forEach(chapter => {  // course ke andar jitne bhi chapters hain, un sab par loop lagao
    if (Array.isArray(chapter?.chapterContent)) {  // check karo ki chapterContent ek array hai ya nahi
      totalLectures += chapter?.chapterContent?.length;  // agar array hai toh usme jitne lectures hain, unka count totalLectures me add karo
    }
  });

  return totalLectures;  // sab chapters ke lectures count karne ke baad totalLectures return kar do
};
  //calculate course duratoion
  const calculateCourseDuration = (course)=>{
     if (!course || !Array.isArray(course.courseContent)) {
    return "0 minutes";
  }
    let time = 0;
    course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>(
      time += lecture.lectureDuration || 0
    )));
    return humanizeDuration(time * 60 *1000, {units:["h", "m"]})
  }
 
  useEffect(()=>{
    fetchAllCourses();

  }, []);

    useEffect(()=>{
    if(user){
    fetchUserData()
    fetchUserEnrolledCourses()
    }
  }, [user])
 
  const data = {
    currency,
    allCourses,
    navigate,enrolledCourses, setEnrolledCourses,
    calculateRating,isEducator,setIsEducator,fetchAllTestmonials,
    calculateChapterTime,calculateCourseDuration,calculateNoOfLectures,
    backendUrl, userData, setUserData,testminials, getToken, fetchAllCourses,fetchUserEnrolledCourses,fetchUserData
  };

  return (
    // Step 4: Providing the context value to child components.
    // `AppContext.Provider` is used to make the `data` object available to the child components.
    <AppContext.Provider value={data}>
      {/* Step 4.1: Rendering child components */}
      {/* `props.children` refers to the components wrapped inside this provider. */}
      {props.children}
    </AppContext.Provider>
  );
};

// Step 5: Exporting the AppContextProvider component.
export default AppContextProvider;
