// jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

const ProductDetails = ({ match }) => {
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    try {
      const res = await axios.get(`/product/${match.params.id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post('/cart/add', { product_id: product.product_id });
      // Update cart state or notify user
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (!product) return <Loading />;

  return (
    <div>
      <img src={product.product_image_url} alt={product.product_name} />
      <h2>{product.product_name}</h2>
      <p>{product.product_description}</p>
      <p>${product.product_price}</p>
      {user && user.role === 'Customer' && (
        <button onClick={addToCart}>Add to Cart</button>
      )}
      {/* Display reviews and option to add review */}
    </div>
  );
};

export default ProductDetails;