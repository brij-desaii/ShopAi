import React, { useState } from 'react';
import axios from 'axios';

export default function GeneratePage() {
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setImageBase64(null);
    setProducts([]);
    setError('');

    try {
      const res = await axios.post('https://shopai-4.onrender.com/generate-image', {
        description,
      });

      if (res.data.image) {
        setImageBase64(res.data.image); // this should be a base64 string like: "data:image/png;base64,..."
      } else {
        setError('No image returned from server.');
      }
    } catch (err) {
      console.error(err);
      setError('Error generating image.');
    }

    setLoading(false);
  };

  const handleSearchProducts = async () => {
    setSearching(true);
    setProducts([]);
    setError('');

    try {
      // Convert base64 to blob and then to a File
      const byteString = atob(imageBase64.split(',')[1]);
      const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'generated-image.png', { type: mimeString });

      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('https://shopai-4.onrender.com/search-products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setError('Error searching products.');
    }

    setSearching(false);
  };

  return (
    <div className="container">
      <label
        htmlFor="description-input"
        style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '20px' }}
      >
        Describe what you're looking for:
      </label>

      <input
        id="description-input"
        className="input"
        placeholder="e.g. red leather handbag"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="button" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {imageBase64 && (
        <>
          <img src={imageBase64} alt="Generated" className="image" />

          <button className="button" onClick={handleSearchProducts} disabled={searching}>
            {searching ? 'Searching Products...' : 'View Products'}
          </button>
        </>
      )}

      {products.length > 0 && (
        <div className="product-grid">
          <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Product Results</h2>
          {products.map((item, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
