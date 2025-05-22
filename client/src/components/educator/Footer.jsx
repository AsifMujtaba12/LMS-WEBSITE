import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className=' flex md:flex-row flex-col-reverse items-center justify-between text-left  w-full px-8 border-t'>
      <div className='flex  items-center gap-4'>
        <span  className="hidden md:flex items-center gap-1 text-lg  font-bold w-28 lg:w-32 cursor-pointer">
         <img src={assets.favicon} alt="logo" />
         SkillUp
        </span>
        <div className='hidden md:block h-7 w-px bg-gray-500/60 '></div>
        <p className='py-4 text-center text-xs md:text-sm
       '>Copyright 2024 © SkillUp. All Right Reserved. </p>
      </div>
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href='#'>
          <img src={assets.facebook_icon} alt='facebook_icon'/>
        </a>
        <a href='#'>
          <img src={assets.twitter_icon} alt='twitter_icon'/>
        </a>
        <a href='#'>
          <img src={assets.instagram_icon} alt='twitter_icon'/>
        </a>
      </div>
    </footer>
  )
}

export default Footer
