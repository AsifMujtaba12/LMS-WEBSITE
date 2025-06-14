import { motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const  { path }= useParams();
  console.log("path", path)
  const navigate = useNavigate();
  useEffect(()=>{
    if(path){
      const timer = setTimeout(()=>{
        navigate(`/${path}`)
      },5000)
      return ()=>clearTimeout(timer)
    }
  },[])
  return (
    <div className="flex justify-center items-center h-screen space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="w-5 h-5 bg-indigo-600 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [1, 1, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Loading;
