import React from "react";
import { assets } from "../../assets/assets";
import { Typewriter } from "react-simple-typewriter";
import SearchBar from "./SearchBar";
// import { useTypewriter, Cursor } from "react-simple-typewriter";

const Hero = () => {
  // const [text] = useTypewriter({
  //   words: [
  //     "<FOCUSED>",
  //     "<POWERFULL>",
  //     "<PRACTICAL>",
  //   ],
  //   loop: true,
  //   typeSpeed: 90,
  //   deleteSpeed: 50,
  //   delaySpeed: 2000,
  // });
  return (
    <div
      className="flex flex-col items-center justify-center w-full md:pt-31 pt-20
    px-7 md:px-0 space-y-7 text-center bg-gradient-to-b  from-cyan-100/70 "
    >
      <h1
        className="md:text-home-heading-large text-home-heading-small relative font-bold to-gray-500 max-w-3xl
      mx-auto"
      >
        Start upskilling with our
        <div className="text-orange-500 font-semibold tracking-wide">
        {/* {text}
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
          /> */}
          {/* Style will be inherited from the parent element */}
          <Typewriter
            words={["<FOCUSED>", "<PRACTICAL>", "<POWERFULL>"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={90}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </div>
        courses designed to
        <span className="text-blue-700"> fit your choice.</span>
        <img
          className="md:block hidden absolute -bottom-7 right-0"
          src={assets.sketch}
          alt="sketch"
        />
      </h1>
      <p className="md:block hidden to-gray-500 max-w-2xl mx-auto">
        We bring together world-class instructors, interactive content, and a
        supportive community to help <br /> you achieve your personal and
        professional goals.
      </p>
      <p className="md:hidden to-gray-500 max-w-sm mx-auto">
        We bring together world-class instructors, interactive content, and a
        supportive community to help <br /> you achieve your personal and
        professional goals.
      </p>
      <SearchBar/>
    </div>
  );
};

export default Hero;
