import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const products = JSON.parse(localStorage.getItem('shopai-products')) || [];

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Product Results</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((item, index) => (
          <div className="product-card" key={index}>
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="product-image" />
            )}
            <div className="product-title">{item.title}</div>
            <div className="product-price">{item.price}</div>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="product-link"
            >
              View Product
            </a>
          </div>
        ))
      )}

      <button className="button" onClick={() => navigate('/')}>
        Go Back
      </button>
    </div>
  );
}
