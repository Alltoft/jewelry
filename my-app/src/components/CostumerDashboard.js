// src/components/CostumerDashboard.js
import React, { useState, useEffect } from 'react';
import { getWishlist, addWishlist, removeWishlist, getCart, addToCart, removeFromCart, updateCart, checkoutCart, getOrders, cancelOrder, getReviews, addReview, updateReview, removeReview, getPurchaseHistory } from '../api';

const CostumerDashboard = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [newReview, setNewReview] = useState({ product_id: '', rating: '', review: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistResponse = await getWishlist();
        if (wishlistResponse && wishlistResponse.data) {
          setWishlist(wishlistResponse.data);
        }

        const cartResponse = await getCart();
        if (cartResponse && cartResponse.data) {
          setCart(cartResponse.data);
        }

        const ordersResponse = await getOrders();
        if (ordersResponse && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }

        const reviewsResponse = await getReviews();
        if (reviewsResponse && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }

        const purchaseHistoryResponse = await getPurchaseHistory();
        if (purchaseHistoryResponse && purchaseHistoryResponse.data) {
          setPurchaseHistory(purchaseHistoryResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddToWishlist = async (product_id) => {
    try {
      const response = await addWishlist({ product_id });
      if (response && response.data) {
        setMessage(response.data.message);
        setWishlist([...wishlist, response.data.product]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while adding to wishlist');
      }
    }
  };

  const handleRemoveFromWishlist = async (product_id) => {
    try {
      const response = await removeWishlist({ product_id });
      if (response && response.data) {
        setMessage(response.data.message);
        setWishlist(wishlist.filter((p) => p.product_id !== product_id));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while removing from wishlist');
      }
    }
  };

  const handleAddToCart = async (product_id, item_quantity) => {
    try {
      const response = await addToCart({ product_id, item_quantity });
      if (response && response.data) {
        setMessage(response.data.message);
        setCart([...cart, response.data.product]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while adding to cart');
      }
    }
  };

  const handleRemoveFromCart = async (product_id) => {
    try {
      const response = await removeFromCart({ product_id });
      if (response && response.data) {
        setMessage(response.data.message);
        setCart(cart.filter((p) => p.product_id !== product_id));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while removing from cart');
      }
    }
  };

  const handleUpdateCart = async (product_id, item_quantity) => {
    try {
      const response = await updateCart({ product_id, item_quantity });
      if (response && response.data) {
        setMessage(response.data.message);
        setCart(cart.map((p) => (p.product_id === product_id ? { ...p, item_quantity } : p)));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while updating cart');
      }
    }
  };

  const handleCheckoutCart = async () => {
    try {
      const response = await checkoutCart();
      if (response && response.data) {
        setMessage(response.data.message);
        setCart([]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while checking out');
      }
    }
  };

  const handleCancelOrder = async (order_id) => {
    try {
      const response = await cancelOrder({ order_id });
      if (response && response.data) {
        setMessage(response.data.message);
        setOrders(orders.map((o) => (o.order_id === order_id ? { ...o, order_status: 'Cancelled' } : o)));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while cancelling order');
      }
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await addReview(newReview);
      if (response && response.data) {
        setMessage(response.data.message);
        setReviews([...reviews, response.data.review]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while adding review');
      }
    }
  };

  const handleUpdateReview = async (product_id, rating, review) => {
    try {
      const response = await updateReview({ product_id, rating, review });
      if (response && response.data) {
        setMessage(response.data.message);
        setReviews(reviews.map((r) => (r.product_id === product_id ? { ...r, rating, review } : r)));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while updating review');
      }
    }
  };

  const handleRemoveReview = async (product_id) => {
    try {
      const response = await removeReview({ product_id });
      if (response && response.data) {
        setMessage(response.data.message);
        setReviews(reviews.filter((r) => r.product_id !== product_id));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while removing review');
      }
    }
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Costumer Dashboard</h2>
      {message && <p>{message}</p>}
      <h3>Wishlist</h3>
      <ul>
        {wishlist.map((product) => (
          <li key={product.product_id}>
            <h4>{product.product_name}</h4>
            <button onClick={() => handleRemoveFromWishlist(product.product_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Cart</h3>
      <ul>
        {cart.map((product) => (
          <li key={product.product_id}>
            <h4>{product.product_name}</h4>
            <p>Quantity: {product.item_quantity}</p>
            <button onClick={() => handleRemoveFromCart(product.product_id)}>Remove</button>
            <button onClick={() => handleUpdateCart(product.product_id, product.item_quantity + 1)}>Increase Quantity</button>
            <button onClick={() => handleUpdateCart(product.product_id, product.item_quantity - 1)}>Decrease Quantity</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckoutCart}>Checkout</button>
      <h3>Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>
            <h4>Order ID: {order.order_id}</h4>
            <p>Status: {order.order_status}</p>
            <button onClick={() => handleCancelOrder(order.order_id)}>Cancel Order</button>
          </li>
        ))}
      </ul>
      <h3>Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.review_id}>
            <h4>Product ID: {review.product_id}</h4>
            <p>Rating: {review.review_rating}</p>
            <p>Review: {review.review_text}</p>
            <button onClick={() => handleRemoveReview(review.product_id)}>Remove Review</button>
            <button onClick={() => handleUpdateReview(review.product_id, review.review_rating, review.review_text)}>Update Review</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddReview}>
        <h3>Add Review</h3>
        <input type="text" name="product_id" placeholder="Product ID" onChange={handleReviewChange} required />
        <input type="number" name="rating" placeholder="Rating" onChange={handleReviewChange} required />
        <textarea name="review" placeholder="Review" onChange={handleReviewChange} required />
        <button type="submit">Add Review</button>
      </form>
      <h3>Purchase History</h3>
      <ul>
        {purchaseHistory.map((purchase) => (
          <li key={purchase.purchase_id}>
            <h4>Product ID: {purchase.product_id}</h4>
            <p>Quantity: {purchase.purchase_quantity}</p>
            <p>Price: ${purchase.purchase_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CostumerDashboard;