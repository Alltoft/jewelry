// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the base URL as needed
  withCredentials: true, // Ensures cookies are sent with each request
});

export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const logoutUser = () => api.post('/logout');
export const getProducts = () => api.get('/products');
export const getProduct = (productId) => api.get(`/product/${productId}`);
export const SoldProduct = () => api.post('/sold');

// Seller endpoints
export const registerSeller = (data) => api.post('/seller/register', data);
export const verifySeller = () => api.post('/seller/verify');
export const updateSeller = (data) => api.put('/seller/update', data);
export const addProduct = (data) => api.post('/product/add', data);
export const updateProduct = (data) => api.put('/product/update', data);
export const deleteProduct = (data) => api.delete('/product/delete', { data });
export const getSellerProducts = () => api.get('/product/seller_all');
export const uploadProductImage = (productId, formData) => {
  return api.post(`/product/${productId}/upload_image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Costumer endpoints
export const registerCostumer = (data) => api.post('/costumer/register', data);
export const updateCostumer = (data) => api.put('/costumer/update', data);
export const addWishlist = (data) => api.post('/wishlist/add', data);
export const removeWishlist = (data) => api.delete('/wishlist/remove', { data });
export const getWishlist = () => api.get('/wishlist');
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const removeFromCart = (data) => api.delete('/cart/remove', { data });
export const updateCart = (data) => api.put('/cart/update', data);
export const checkoutCart = () => api.post('/cart/checkout');
export const getOrders = () => api.get('/orders');
export const cancelOrder = (data) => api.delete('/order/cancel', { data });
export const addReview = (data) => api.post('/review/add', data);
export const updateReview = (data) => api.put('/review/update', data);
export const removeReview = (data) => api.delete('/review/remove', { data });
export const getReviews = () => api.get('/review');
export const getPurchaseHistory = () => api.get('/purchase_history');
export const addPurchaseHistory = (data) => api.post('/purchase_history/add', data);
export const removePurchaseHistory = (data) => api.delete('/purchase_history/remove', { data });
export const updatePurchaseHistory = (data) => api.put('/purchase_history/update', data);

// import axios from 'axios';

// const API_URL = 'http://127.0.0.1:5000'; // Adjust the URL as needed

// export const fetchProducts = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/products`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginUser = async (credentials) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, credentials);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const logoutUser = async () => {
//   try {
//     const response = await axios.post(`${API_URL}/logout`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
