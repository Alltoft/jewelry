import React from 'react';
import { Star } from 'lucide-react';

const ReviewStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} fill="#FFD700" stroke="#FFD700" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <div key={i} className="half-star-container">
          <Star className="half-filled" fill="#FFD700" stroke="#FFD700" />
        </div>
      );
    } else {
      stars.push(<Star key={i} stroke="#FFD700" />);
    }
  }

  return <div className="review-stars">{stars}</div>;
};

export default ReviewStars;