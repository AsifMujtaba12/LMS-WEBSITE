import React, { useContext } from "react";
import { assets } from "../../assets/assets"; // importing image assets
import { Link, useLocation } from "react-router-dom"; // for routing and current page info
import { FaArrowRight } from "react-icons/fa6"; // arrow icon
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"; // Clerk authentication hooks and components
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const {navigate, isEducator, backendUrl, setIsEducator, getToken}= useContext(AppContext)
  const { openSignIn } = useClerk(); // Clerk ka sign-in modal open karne ke liye
  const { user } = useUser(); // current logged-in user ko access karne ke liye
  const location = useLocation(); // current page path ko check karne ke liye
  const isCourseListPage = location.pathname.includes("/course-list"); // agar user course list page pe hai

// become Educator 
  const becomeEducator = async ()=>{
    try {
      if(isEducator){
        navigate('/educator');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/update-role", {
        headers:{Authorization : `Bearer ${token}`}
      });
    if (data.success){
      setIsEducator(true)
      toast.success(data.message)
    }else{
      toast.error(data.message)
    }
      
    } catch (error) {
      toast.error(error.message)
      
    }
}
  return (
    <div
      className={`${isCourseListPage ? "bg-white" : "bg-cyan-100/70"} 
          flex sticky top-0 z-10 items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 
          border-b border-slate-600 py-4
        `}
    >
      {/* Logo and Brand Name */}
      <span onClick={()=>navigate('/')} className="flex items-center gap-1 text-lg text-gray-700 font-bold w-28 lg:w-32 cursor-pointer">
        <img src={assets.favicon} alt="logo" />
        SkillUp
      </span>

      {/* Desktop View Navigation (hidden on small screens) */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {/* If user is logged in, show "Become Educator" and "My Enrollments" */}
          {user && (
            <>
              <button onClick={becomeEducator}>{isEducator ? "Educator Dashboard" :  "Become Educator"}</button>|
              <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>

        {/* Auth buttons: If user is logged in, show Clerk UserButton. Otherwise, show "Create Account" button */}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="hover:bg-indigo-600 bg-slate-800 text-white px-5 py-1 group flex items-center justify-center gap-1 rounded-full transition-all duration-300"
          >
            <span>Create Account</span>
            <span className="transform translate-x-[-5px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <FaArrowRight />
            </span>
          </button>
        )}
      </div>

      {/* Mobile View (only visible on small screens) */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 to-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {/* Show these only if user is logged in */}
          {user && (
            <>
             <button onClick={becomeEducator}>{isEducator ? "Educator Dashboard" :  "Become Educator"}</button>|

              <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>

        {/* Show user icon if logged in, else show sign-in button */}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
