import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, ArrowLeft, Trash2, Gift, Lock, Check, CreditCard, Truck, Home, AlertCircle } from 'lucide-react';
import Loading from './Loading';
import './CartPage.css';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [detailedCartItems, setDetailedCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showPromoError, setShowPromoError] = useState(false);
  const navigate = useNavigate();

  // Update loadCart to include merging logic
  const loadCart = async () => {
    setLoading(true);
    if (user && user.role === 'Customer') {
      try {
        const res = await axios.get('/cart');
        setCartItems(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
      // Merge duplicate items
      const mergedCart = guestCart.reduce((acc, item) => {
        const existingItem = acc.find(i => 
          i.product_id === item.product_id && 
          i.selected_size === item.selected_size
        );
        
        if (existingItem) {
          existingItem.quantity += item.quantity;
          return acc;
        }
        return [...acc, item];
      }, []);
      
      setCartItems(mergedCart);
      localStorage.setItem('cart', JSON.stringify(mergedCart));
    }
    setLoading(false);
  };

  // Fetch Product Details for Guest Users
  const fetchProductDetails = async (items) => {
    try {
      const productRequests = items.map(item =>
        axios.get(`/product/${item.product_id}`)
      );
      const productResponses = await Promise.all(productRequests);
      const detailedItems = items.map((item, index) => ({
        ...item,
        ...productResponses[index].data,
      }));
      setDetailedCartItems(detailedItems);
    } catch (err) {
      console.error('Error fetching product details:', err);
    }
  };

  // Update updateQuantity to handle merging
  const updateQuantity = async (productId, newQuantity, size) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      (item.product_id === productId && item.selected_size === size)
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    if (user && user.role === 'Customer') {
      try {
        await axios.post('/cart/update', { 
          product_id: productId, 
          quantity: newQuantity,
          size 
        });
        setCartItems(updatedCart);
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      const updatedDetailed = detailedCartItems.map(item =>
        (item.product_id === productId && item.selected_size === size)
          ? { ...item, quantity: newQuantity }
          : item
      );
      setDetailedCartItems(updatedDetailed);
      setCartItems(updatedCart);
    }
  };

  // Remove Item
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    
    if (user && user.role === 'Customer') {
      axios.post('/cart/remove', { product_id: productId })
        .catch(err => console.error(err));
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      const updatedDetailed = detailedCartItems.filter(item => item.product_id !== productId);
      setDetailedCartItems(updatedDetailed);
    }
  };

  // Calculate Subtotal
  const calculateSubtotal = () => {
    const itemsToCalculate = user?.role === 'Customer' ? cartItems : detailedCartItems;
    return itemsToCalculate.reduce((total, item) => {
      const itemPrice = parseFloat(item.product_price) || parseFloat(item.price) || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // Calculate Shipping
  const calculateShipping = () => {
    return shippingMethod === 'express' ? 15 : 0;
  };

  // Calculate Total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const discount = promoApplied ? subtotal * 0.1 : 0;
    return (subtotal + shipping - discount).toFixed(2);
  };

  const handlePromoInputChange = (e) => {
    setPromoCode(e.target.value);
    setShowPromoError(false);
  };

  const applyPromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setPromoApplied(true);
      setShowPromoError(false);
    } else {
      setShowPromoError(true);
    }
  };

  // Checkout
  const checkout = () => {
    const totalAmount = calculateTotal();
    navigate('/checkout', { state: { amount: totalAmount } });
  };

  // Initial Load
  useEffect(() => {
    const fetchCart = async () => {
      await loadCart();
    };
    fetchCart();
  }, []);  // Empty dependency array since loadCart is defined within component

  // Fetch Product Details for Guest Users
  useEffect(() => {
    if ((!user || user.role !== 'Customer') && cartItems.length > 0) {
      fetchProductDetails(cartItems);
    } else {
      setDetailedCartItems([]);
    }
  }, [cartItems, user]);

  // Fix operator precedence
  if (loading || ((!user || user.role !== 'Customer') && detailedCartItems.length !== cartItems.length)) {
    return <Loading />;
  }

  const renderCartItems = () => {
    const items = user?.role === 'Customer' ? cartItems : detailedCartItems;
    
    return items.map(item => (
      <div key={item.product_id} className="cart-item">
        <div className="item-image">
          <img
            src={`/static/images/product_pics/${item.product_image || 'default.jpg'}`}
            alt={item.product_name}
            onError={(e) => { e.target.src = '/static/images/product_pics/default.jpg'; }}
          />
        </div>
        <div className="item-content">
          <div className="item-details">
            <Link to={`/product/${item.product_id}`} className="item-name">
              {item.product_name}
            </Link>
            <div className="item-meta">
              {item.product_material && (
                <span className="meta-item">Material: {item.product_material}</span>
              )}
              {item.selected_size && (
                <span className="meta-item">Size: {item.selected_size}</span>
              )}
            </div>
            <div className="item-price">${item.product_price}</div>
          </div>
          <div className="item-actions">
            <div className="quantity-controls">
              <button 
                onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.selected_size)}
                className="quantity-btn"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.selected_size)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.product_id)} 
              className="remove-btn"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Link to="/store" className="back-to-store">
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </Link>
        <h1>Shopping Cart</h1>
        <div className="cart-count">
          <ShoppingBag size={20} />
          <span>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-main">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link to="/store" className="continue-shopping-btn">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-items">{renderCartItems()}</div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="promo-code">
                <div className="input-group">
                  <Gift size={18} />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={handlePromoInputChange}
                  />
                  <button 
                    onClick={applyPromoCode}
                    className="apply-btn"
                    disabled={promoApplied}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="promo-applied">
                    <Check size={16} />
                    <span>10% discount applied!</span>
                  </div>
                )}
                {showPromoError && (
                  <div className="promo-error">
                    <AlertCircle size={16} />
                    <span>Invalid promo code</span>
                  </div>
                )}
              </div>

              <div className="shipping-options">
                <h3>Shipping Method</h3>
                <div className="shipping-option">
                  <input
                    type="radio"
                    id="standard"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label htmlFor="standard">
                    <div>
                      <span className="option-name">Standard Shipping</span>
                      <span className="option-price">Free</span>
                    </div>
                    <span className="delivery-estimate">5-7 business days</span>
                  </label>
                </div>
                <div className="shipping-option">
                  <input
                    type="radio"
                    id="express"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label htmlFor="express">
                    <div>
                      <span className="option-name">Express Shipping</span>
                      <span className="option-price">$15.00</span>
                    </div>
                    <span className="delivery-estimate">2-3 business days</span>
                  </label>
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}</span>
                </div>
                {promoApplied && (
                  <div className="summary-row discount">
                    <span>Discount (10%)</span>
                    <span>-${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button onClick={checkout} className="checkout-btn">
                <Lock size={18} />
                Secure Checkout
              </button>

              <div className="checkout-features">
                <div className="feature">
                  <CreditCard size={18} />
                  <span>Secure Payment</span>
                </div>
                <div className="feature">
                  <Truck size={18} />
                  <span>Free Returns</span>
                </div>
                <div className="feature">
                  <AlertCircle size={18} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;