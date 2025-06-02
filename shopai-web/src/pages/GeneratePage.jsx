import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GeneratePage() {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    try {
      const res = await axios.post('https://shopai-4.onrender.com/generate-and-search/', {
        description,
      });
      setImageUrl(res.data.image_url);
      setProducts(res.data.products || []);
      localStorage.setItem('shopai-products', JSON.stringify(res.data.products));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleViewProducts = () => {
    navigate('/results', { state: { imageUrl } });
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
      <button className="button" onClick={handleGenerate}>
        Generate
      </button>

      {loading && <p className="loading">Generating...</p>}

      {imageUrl && (
        <>
          <img src={imageUrl} alt="Generated" className="image" />
          <button className="button" onClick={handleViewProducts}>
            View Products
          </button>
        </>
      )}
    </div>
  );
}
