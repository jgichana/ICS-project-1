
import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

function SellerProductPage({ userId }) {
    const formRef = useRef(null);
    const [message,setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null,
    unavailable:0
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

useEffect(() => {
  fetchProducts();
  fetchCategories();
},[]);


// useEffect(() => {
//   fetch('http://localhost:8000/products')
//     .then(res => res.json())
//     .then(data => {
//       setProducts(data); 
//     })
//     .catch(err => console.error('Fetch error:', err));
// }, []);

  const fetchProducts = async () => {
    const res = await fetch(`http://localhost:8000/seller/products/${userId}`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:8000/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch('http://localhost:8000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory })
      });
      if (!res.ok) throw new Error('Failed to add category');
      const newCat = await res.json();

      setCategories([...categories, newCat]);
      setFormState((prev) => ({ ...prev, category_id: newCat.id }));
      setNewCategory('');
    } catch (err) {

      console.error('Error adding category:', err);
      setMessage('Error adding category:', err);
    }
  };

  const handleChange = (e) => {
  const { name, value, files, type } = e.target;
  if (name === 'image') {
    setFormState((prev) => ({ ...prev, image: files[0] }));
  } else if (name === 'unavailable' && type === 'radio') {
    setFormState((prev) => ({ ...prev, unavailable: parseInt(value) }));
  } else {
    setFormState((prev) => ({ ...prev, [name]: value }));
  }
};

const handleCancel = () => {
  setEditingProduct(null);
  setFormState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null,
    unavailable: 0
  });
  setNewCategory('');
};
  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormState({ 
    name: product.name || '', 
    description: product.description || '', 
    category_id: product.category_id || '', 

    price: product.price || '', 
    image: null, 
    unavailable: product.unavailable || 0 
  });

   if (formRef.current) {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryId = formState.category_id;
if (categoryId === 'add-new') {
  if (!newCategory.trim()) {
    alert("Please enter a category name.");
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() })
    });
    const newCat = await res.json();
    categoryId = newCat.id;
    setCategories([...categories, newCat]);
  } catch (err) {
    setMessage('Error creating category:', err);
    return;
  }
}

    const formData = new FormData();
    formData.append('name', formState.name);
    formData.append('description', formState.description);
    formData.append('price', formState.price);
    // formData.append('category_id', formState.category_id);
    formData.append('userId', userId);
    if (formState.image) {
      formData.append('image', formState.image);
    }
    formData.append('unavailable', formState.unavailable);

    const url = editingProduct
      ? `http://localhost:8000/products/${editingProduct}`
      : 'http://localhost:8000/products';

    const method = editingProduct ? 'PUT' : 'POST';

    await fetch(url, { method, body: formData });
    setEditingProduct(null);
    setFormState({ name: '', description: '', price: '', image: " ", unavailable:0 });
    setNewCategory('');
    fetchProducts();
  };

  return (
    <div className="seller-container">

        <h3>Your Products</h3>
      <div className="product-list">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <img src={`http://localhost:8000${prod.image_url}`} alt={prod.name} />
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p>Ksh.{prod.price}</p>
            <p> {prod.unavailable ===0 ? 'Available' : 'Unavailable'}</p>
            <button className='edit' onClick={() => handleEdit(prod)}>Edit</button>
            <button className="cancel-button"onClick={() => {if (window.confirm('Are you sure you want to delete this product?')) {
        handleDelete(prod.id)
    }}}>Delete</button>
          </div>
        ))}
      </div>

      <h2>{editingProduct ? 'Edit Product' : 'Upload New Product'}</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="product-upload-form">
        {/* <input name="name" placeholder="Name" value={formState.name} onChange={handleChange} required /> */}
 <select name='name' value={formState.name} onChange={handleChange}>
          <option value="Bed">Bed</option> 
          <option value="Drawer">Drawer</option>
          <option value="Dining table">Dining table</option>
          <option value="Study table">Study Table</option>
          <option value="Drawer">Drawer</option>
          <option value="Sofa">Sofa</option>

        </select>

        <textarea name="description" placeholder="Description" value={formState.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formState.price} onChange={handleChange} required />

        
<div className="availability-section">
  <label>Availability:</label>
  <label>
    <input
      type="radio"
      name="unavailable"
      value={0}
      checked={formState.unavailable === 0}
      onChange={handleChange}
    /> Available
  </label>
  <label>
    <input
      type="radio"
      name="unavailable"
      value={1}
      checked={formState.unavailable === 1}
      onChange={handleChange}
    /> Unavailable
  </label>
</div>

<label htmlFor="productImageInput">Product Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />


        
          {/* <input
            type="file"
            id="productImageInput"
            accept="image/*" 
            onChange={(e) => setProductImage(e.target.files[0])}
          /> */}
          {formState.image && (
            <p className="selected-file">Selected: {formState.name}</p>
          )}
        
        {message && <p className="form-message">{message}</p>}

        <button  type="submit">{editingProduct ? 'Update Product' : 'Upload Product'}</button>
      <button  type="button" onClick={handleCancel} className="cancel">
                      Cancel
        </button>

      </form>

      
    </div>
  );
}


export default SellerProductPage;
