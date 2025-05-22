import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton,useUser } from '@clerk/clerk-react'




const Navbar = () => {
  const { user } = useUser(); // current logged-in user ko access karne ke liye
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to={'/'}>
        <span  className="flex items-center gap-1 text-lg text-gray-700 font-bold w-28 lg:w-32 cursor-pointer">
                <img src={assets.favicon} alt="logo" />
                SkillUp
              </span>
      </Link>
      <div className='flex items-center gap-5 to-gray-500 relative'>
        <p>Hi! {user ? user.fullName : "Developers"}</p>
        {user ? <UserButton/> : <img src={assets.profile_img} className='max-w-8'/>}
      </div>
    </div>
  )
}

export default Navbar
