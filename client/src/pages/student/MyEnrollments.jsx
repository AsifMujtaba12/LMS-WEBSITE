import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line} from 'rc-progress';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const MyEnrollments = () => {
  const [progressArray, setProgressArray]= useState([
  {lectureCompleted: 3, totalLectures: 5},
  { lectureCompleted: 1, totalLectures: 10 },
  { lectureCompleted: 8, totalLectures: 8 },
  { lectureCompleted: 4, totalLectures: 12 },
  { lectureCompleted: 0, totalLectures: 15 },
  { lectureCompleted: 0, totalLectures: 10 },
  { lectureCompleted: 10, totalLectures: 20 },
  { lectureCompleted: 4, totalLectures: 6 },
  { lectureCompleted: 12, totalLectures: 20 },
  { lectureCompleted: 1, totalLectures: 5 },
  { lectureCompleted: 8, totalLectures: 10 },
  { lectureCompleted: 0, totalLectures: 7 },
  ])
  const {enrolledCourses, calculateCourseDuration, navigate} = useContext(AppContext)
  console.log("enrolledCourses", enrolledCourses);
  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed  w-full overflow-hidden border mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden bg-gray-200'>
          <tr>
            <th className='py-3 px-4 font-semibold truncate'>Course</th>
            <th className='py-3 px-4 font-semibold truncate'>Duration</th>
            <th className='py-3 px-4 font-semibold truncate'>Completed</th>
            <th className='py-3 px-4 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {enrolledCourses.map((course, i)=>(
            <tr key={i} className='border-b border-gray-500/20'>
              <td onClick={()=>navigate('/course/' + course._id)}
               className='md:px-4 pl-2 md:pl-4 py-3 flex cursor-pointer hover:scale-90  transition-all duration-300 
               items-center space-x-3 sm:flex-row flex-col-reverse'>
                <img src={course.courseThumbnail} alt='' className='md:w-28 w-24 sm:w-24 sm:space-y-1'/>
                <div className='flex-1 '>
                  <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                  <Line strokeWidth={2}  percent={progressArray[i] ? (progressArray[i].lectureCompleted * 100) / 
                  progressArray[i].totalLectures : 0 }
                    className='bg-gray-300 rounded-full'
                  />
                </div>
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
                {calculateCourseDuration(course)}
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
               {
                progressArray[i] && `${progressArray[i].lectureCompleted} / ${progressArray[i].totalLectures}`
               } <span>Lectures</span>
              </td>
              <td className='px-4 py-3 max-sm:text-right'>
                <button onClick={()=>navigate('/player/' + course._id)}
                 className='px-3 sm:px-5 py-1.5 sm:py-2 sm:mt-1 max-sm:text-xs rounded-md
                 bg-slate-900 text-white hover:bg-slate-300 shadow-2xl hover:text-gray-900 hover:scale-105 transition-all duration-300'>
                {
                  progressArray[i] && progressArray[i].lectureCompleted / progressArray[i].totalLectures === 1 ? "Completed" : "On Going"
                } </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    <Footer/>
    </>
  )
}

export default MyEnrollments
