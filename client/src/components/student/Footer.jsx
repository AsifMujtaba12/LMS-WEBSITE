import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10 text-white/80'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
     <div className='flex flex-col md:items-start items-center w-full'>
        <span className='flex  items-center gap-2'><img src={assets.favicon} alt='logo'/>SkillUp </span>
        <p className='mt-6 text-center md:text-left  text-sm text-white/80 '>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
     </div>
     <div className='flex flex-col md:items-start items-center w-full'>
        <h2 className='font-semibold text-white mb-5'>Company</h2>
        <ul className='flex md:flex-col gap-2 sm:gap-0 w-full justify-between text-sm md:space-y-2'>
            <li><a href='#'>Home</a></li>
            <li><a href='#' >About us</a></li>
            <li><a href='#'>Contact us</a></li>
            <li><a href='#'>Privacy policy</a></li>
        </ul>

     </div>
     <div className='flex flex-col items-start w-full'>
      <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
      <p className='text-sm '>The latest news, articles, and resources, sent to your inbox weekly.</p>
    <div className='flex flex-col md:flex-row items-start md:items-center gap-2 pt-4'>
        <input className='border border-gray-500/30 bg-gray-800 
        text-gray-500 placeholder-red-500/50 outline-none w-64 h-9 px-2 text-sm rounded focus:ring-2 focus:ring-indigo-500'
         type='email' placeholder='Enter your email'/>
        <button className='bg-indigo-600 w-24 h-9 rounded hover:bg-indigo-700'>Subscribe</button>
     </div>
     </div>
     
      </div>
      <p className='text-center py-4 text-xs md:text-sm text-white/80'>Copyright 2024 © SkillUp. All Right Reserved.</p>
    </footer>
  )
}

export default Footer
