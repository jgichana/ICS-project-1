// src/components/ProductListPage.js
import React, { useEffect, useState } from 'react';

function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="buyer-container">
      <h2>Available Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={`http://localhost:8000${product.image_url}`}
              alt={product.name}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
