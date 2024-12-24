export const filterProducts = (products, filters, searchQuery) => {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
      if (!product) return false;
  
      const matchesSearch = !searchQuery || (
        (product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (product.product_description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
  
      const matchesCategory = !filters.category || 
                            filters.category === 'All' || 
                            product.product_category === filters.category;
  
      const matchesMaterial = !filters.material || 
                            filters.material === 'All Materials' || 
                            product.product_material === filters.material;
                            console.log('product Matiral: ', product.product_material,'\nfilter: ', filters.material);
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        const price = product.product_price || 0;
        
        if (max) {
          return matchesSearch && matchesCategory && matchesMaterial && 
                 price >= min && price <= max;
        } else {
          return matchesSearch && matchesCategory && matchesMaterial && price >= min;
        }
      }
      
      return matchesSearch && matchesCategory && matchesMaterial;
    });
  };
  
  export const sortProducts = (products, sortBy) => {
    if (!Array.isArray(products)) return [];
  
    return [...products].sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
  };