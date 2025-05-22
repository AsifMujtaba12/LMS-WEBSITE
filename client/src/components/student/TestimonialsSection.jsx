import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className=" pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-medium to-gray-800">Testmonials</h2>
      <p className="md:text-base to-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br />
        platform has made a difference in their lives.
      </p>
      <div className="grid grid-cols-auto gap-8 mt-14">
        {dummyTestimonial.map((testmonial, i) => (
          <div 
       
          key={i} className="text-sm text-left border border-gray-500/30
          pb-6 rounded-lg bg-white overflow-hidden hover:shadow-[0px_4px_15px_0px] shadow-black/5 translate-y-[10px]  transition-all duration-300">
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img className="h-12 w-12 rounded-full" src={testmonial.image} alt={testmonial.name} />
              <div>
                <h1 className="text-lg font-medium to-gray-800">{testmonial.name}</h1>
                <p className="text-gray-800/80">{testmonial.role}</p>
              </div>
              
            </div>
            <div className="p-5 pb-7">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i)=>(
                    <img className="h-5" key={i} src={i<Math.floor(testmonial.rating) ? assets.star : assets.star_blank}/>
                  ))}
                </div>
                <p className="text-gray-500 mt-5">{testmonial.feedback}</p>
              </div>
              <a href="#" className="text-indigo-500 underline px-5">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
