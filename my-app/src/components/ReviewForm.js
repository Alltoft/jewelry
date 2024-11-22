// jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId, loadReviews }) => {
  const [formData, setFormData] = useState({
    rating: '',
    review: '',
  });

  const { rating, review } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/review/add', { product_id: productId, ...formData });
      loadReviews();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Leave a Review</h3>
      <input
        type="number"
        name="rating"
        value={rating}
        onChange={onChange}
        placeholder="Rating (1-5)"
        required
      />
      <textarea
        name="review"
        value={review}
        onChange={onChange}
        placeholder="Your review"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReviewForm;