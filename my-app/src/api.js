import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Adjust the base URL as needed

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Ensures cookies are sent with each request
});

export { baseURL }; // Export the base URL

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

// Customer endpoints
export const registerCustomer = (data) => api.post('/customer/register', data);
export const updateCustomer = (data) => api.put('/customer/update', data);
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
