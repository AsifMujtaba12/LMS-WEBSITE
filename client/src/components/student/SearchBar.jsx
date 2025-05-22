import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
const SearchBar = ({ data }) => {
  const [input, setInput] = useState(data ? data : "");
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center
     border bg-white  border-gray-500/80 rounded"
    >
      <img
        className="md:w-auto w-10 px-3"
        src={assets.search_icon}
        alt="search_icon"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="w-full h-full outline-none text-gray-500/80 "
        type="text"
        placeholder="Search for courses..."
      />
      <motion.button
        whileHover={{
          scale: 1.02,
          x: 1,
          boxShadow: "0px 10px 20px rgba(255, 115, 0, 0.3)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        type="submit"
        className="bg-orange-500 rounded text-white md:px-10 px-7 py-3 mx-1"
      >
        {" "}
        Search
      </motion.button>
    </form>
  );
};

export default SearchBar;
