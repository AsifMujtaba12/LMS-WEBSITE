import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard';
import { AppContext } from '../../context/AppContext';

const CourseSection = () => {
  const {allCourses}= useContext(AppContext)
  return (
    <div className='py-12 md:px-40 px-8'
   
>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base to-gray-500  mt-3 mb-5'>Discover our top-rated courses across various categories. From coding and design to <br/>business and wellness, our courses are crafted to deliver results.</p>
     <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4 '>
      {allCourses.slice(0,4).map((course, index)=><CourseCard key={index} course={course}/>)}
     </div>
      <Link  
      to={'/course-list'} onClick={()=>scrollTo(0,0)} 
      className='bg-gradient-to-r from-orange-400 to-orange-600 border
       border-orange-500/30 px-8 py-3 text-white rounded-xl inline-block  hover:from-orange-600 hover:to-orange-400  hover:scale-105 transform transition-all duration-300 ease-in-out  '>
      Show all courses
      </Link>
            
                   
                    
       
    </div>
  )
}

export default CourseSection
