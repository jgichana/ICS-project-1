import React, { useState, useEffect } from 'react';
import "../App.css"
function ProductUploadForm() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productImage, setProductImage] = useState(null); 
  const [categories, setCategories] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories'); 
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setLoading(true);

    const formData = new FormData(); 
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', selectedCategory);
    if (productImage) {
      formData.append('image', productImage); 
    }

    try {
      const response = await fetch('http://localhost:8000/api/products', { 
        method: 'POST',
        body: formData,   });

      const data = await response.json();

      if (response.ok) {
        setMessage('Product uploaded successfully!');

        setProductName('');
        setDescription('');
        setPrice('');
        setProductImage(null);

        if (categories.length > 0) {
            setSelectedCategory(categories[0].id);
        }

        document.getElementById('productImageInput').value = '';

      } else {
        setMessage(`Error: ${data.message || 'Failed to upload product.'}`);
        console.error('Upload error:', data);
      }
    } catch (error) {
      console.error('Network error during product upload:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-upload-container">
      <h2>Furniture Uploading Form</h2>

      <form onSubmit={handleSubmit} className="product-upload-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            {categories.length === 0 && <option value="">Categories</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productImageInput">Product Image:</label>
          <input
            type="file"
            id="productImageInput"
            accept="image/*" 
            onChange={(e) => setProductImage(e.target.files[0])}
          />
          {productImage && (
            <p className="selected-file">Selected: {productImage.name}</p>
          )}
        </div>

        <button   type="submit" disabled={loading}>
            Upload
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default ProductUploadForm;
