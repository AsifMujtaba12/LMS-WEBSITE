import React, { useState } from 'react'

const StarRating = ({ starCount = 5 }) => {
  const [starValue, setStarValue] = useState(0)
  const [starHover, setStarHover] = useState(0)

  return (
    <div className='w-full h-screen flex items-center justify-center text-xl'>
      {new Array(starCount).fill(0).map((_, i) => (
        <span
          key={i}
          className={`cursor-pointer transition-colors duration-200 ${
            (starHover === 0 && i < starValue) || i < starHover
              ? 'text-orange-400'
              : 'text-gray-400'
          }`}
          onMouseEnter={() => setStarHover(i + 1)}
          onMouseLeave={() => setStarHover(0)}
          onClick={() => setStarValue(i + 1)}
        >
          &#9733;
        </span>
      ))}
    </div>
  )
}

export default StarRating
