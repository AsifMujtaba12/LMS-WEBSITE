import React, { useContext, useMemo } from 'react'
import SearchBar from '../../components/student/SearchBar'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';

const CoursesList = () => {
  // Accessing navigate function and allCourses data from AppContext
  const { navigate, allCourses } = useContext(AppContext);

  // Getting the search input from URL parameters
  const { input } = useParams();

  /**
   * Memoized filteredCourse will recalculate only when
   * allCourses or input changes.
   * If input exists, filter courses matching the input (case insensitive).
   * Otherwise, show all courses.
   */
  const filteredCourse = useMemo(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourse = allCourses.slice(); // Shallow copy to avoid direct mutation

      if (input) {
        return tempCourse.filter((item) =>
          item.courseTitle.toLowerCase().includes(input.toLowerCase())
        );
      } else {
        return tempCourse;
      }
    }
    return [];
  }, [allCourses, input]);

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        {/* Header Section */}
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-4xl font-semibold to-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span> / <span>Course List</span>
            </p>
          </div>
          {/* Search bar passing the input value */}
          <SearchBar data={input} />
        </div>

        {/* Display search chip with clear (cross) icon if input exists */}
        {input &&
          <div className='inline-flex items-center gap-4 py-1 px-3 border mt-8 -mb-8 to-gray-600 rounded'>
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt='cross'
              className='cursor-pointer hover:bg-gray-200 p-1.5 rounded-full flex items-center'
              onClick={() => navigate('/course-list')}
            />
          </div>
        }

        {/* Course Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
          {
            filteredCourse.map((course, i) => (
              <CourseCard key={i} course={course} />
            ))
          }
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </>
  )
}

export default CoursesList;
