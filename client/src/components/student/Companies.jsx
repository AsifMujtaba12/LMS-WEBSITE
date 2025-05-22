import React from 'react';
import { assets } from '../../assets/assets';
import { motion } from "motion/react";


const logos = [
  assets.microsoft_logo,
  assets.walmart_logo,
  assets.accenture_logo,
  assets.adobe_logo,
  assets.paypal_logo,
  assets.axis_logo,
  assets.capgemini_logo,
  assets.genpact_logo,
  assets.jio_logo,
  assets.infosys_logo,
  assets.mastercard_logo,
  assets.mindtree_logo,
  assets.wipro_logo,
];

const Companies = () => {
  return (
    <div className='pt-16 pb-3 overflow-hidden'>
      <p className='text-base text-gray-500 text-center'>Trusted by learners from</p>
      
      <motion.div
        className='flex gap-10 mt-10 w-max'
        animate={{ x: ['0%', '-30%'],
       }}
        
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: 'linear',
          repeatType:"reverse",
        
        }}
       
      >
        {/* Repeat logos twice for infinite loop illusion */}
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`logo-${index}`}
            className='w-28 md:w-36 bg-white p-4 rounded-md shadow-xl'
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Companies;
