import React, { useEffect, useState } from "react";

const Rating = ({ initialRating, onRate }) => {
  const [starRating, setStarRating] = useState(initialRating || 0);
  const [starHover, setStarHover] = useState(0);
  const handleRating = (value) => {
    setStarRating(value);
    if (onRate) onRate(value);
  };
  useEffect(() => {
    if (initialRating) {
      setStarRating(initialRating);
    }
  }, [initialRating]);
  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            onClick={() => handleRating(starValue)}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors
          ${
            starValue <= (starHover || starRating)
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
            key={index}
            onMouseEnter={() => setStarHover(starValue)}
            onMouseLeave={() => setStarHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
