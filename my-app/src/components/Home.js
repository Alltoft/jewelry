import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProducts } from '../api';
import {  useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEndReached, setIsEndReached] = useState(false);

  const categories = [
    {
      name: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Timeless elegance for every occasion'
    },
    {
      name: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Statement pieces that capture hearts'
    },
    {
      name: 'Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'The perfect finishing touch'
    },
    {
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Elegance at your wrist'
    },
    {
      name: 'Watches',
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Timeless elegance for every occasion'
    },
    {
      name: 'Brooches',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Classic accessories for sophisticated style'
    },
    {
      name: 'Anklets',
      image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Delicate chains for your feet'
    },
    {
      name: 'Cufflinks',
      image: 'https://images.unsplash.com/photo-1685392024138-36e7aade79f7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Sophisticated accessories for the modern gentleman'
    },
    {
      name: 'Pendants',
      image: 'https://images.unsplash.com/photo-1664178266066-e37e0d25e6a1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Meaningful pieces that tell your story'
    },
    {
      name: 'Charms',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      description: 'Collect and customize your story'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (direction) => {
    const container = document.querySelector('.categories-scroll');
    const scrollAmount = 400;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft + container.clientWidth;
    const isEnd = scrollPosition >= container.scrollWidth - 50; // 50px threshold
    setIsEndReached(isEnd);
  };

  return (
    <div className="home">
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Timeless Elegance, Modern Grace</h1>
          <p>Discover our curated collection of fine jewelry, where tradition meets contemporary design</p>
          <Link to="/collections" className="button">
            Explore Collection
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Categories</h2>
            <p>Explore our handpicked selection of exquisite jewelry pieces</p>
          </div>
          <div className="categories-container">
            <button className="scroll-arrow left" onClick={() => scroll('left')}>
              <ChevronRight size={24} />
            </button>
            <div 
              className="categories-scroll"
              onScroll={handleScroll}
            >
              {categories.map((category) => (
                <Link 
                  to={`/collections/${category.name.toLowerCase()}`} 
                  className="category-card" 
                  key={category.name}
                >
                  <img src={category.image} alt={category.name} />
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="view-more">
                      View Collection <ChevronRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <button 
              className={`scroll-arrow right ${isEndReached ? 'transform-to-view-all' : ''}`} 
              onClick={() => isEndReached ? navigate('/collections') : scroll('right')}
            >
              {isEndReached ? (
                <>
                  <span>View All</span>
                  <ChevronRight size={20} />
                </>
              ) : (
                <ChevronRight size={24} />
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="new-arrivals">
        <div className="container">
          <div className="section-title">
            <h2>New Arrivals</h2>
            <p>Be the first to discover our latest masterpieces</p>
          </div>
          <div className="grid">
            {!loading && products.slice(0, 4).map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/collections" className="button">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Us</h2>
            <p>Experience luxury jewelry shopping at its finest</p>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3>Handcrafted with Love</h3>
              <p>Each piece is carefully crafted by skilled artisans</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3>Ethically Sourced</h3>
              <p>We ensure all our materials are responsibly sourced</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3>Lifetime Warranty</h3>
              <p>Quality guaranteed with our lifetime warranty</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;