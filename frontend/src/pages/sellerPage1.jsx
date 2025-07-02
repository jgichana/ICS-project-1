import React, { useState, useEffect } from 'react';
import '../App.css';

function SellerProductPage({ userId }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({ name: '', description: '', price: '', category_id: '', image: null });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`http://localhost:8000/api/seller/products/${userId}`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:8000/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleAddCategory = async () => {
  if (!newCategory.trim()) return;

  try {
    const res = await fetch('http://localhost:8000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() }),
    });

    if (!res.ok) throw new Error('Failed to add category');

    const newCat = await res.json();

    // Add new category to dropdown
    setCategories([...categories, newCat]);
    setFormState((prev) => ({
      ...prev,
      category_id: newCat.id,
    }));
    setNewCategory('');
  } catch (err) {
    console.error('Error adding category:', err);
    alert('Error adding category');
  }
};

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === 'image') {
  //     setFormState(prev => ({ ...prev, image: files[0] }));
  //   } else {
  //     setFormState(prev => ({ ...prev, [name]: value }));
  //   }
  // };
  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormState((prev) => ({ ...prev, [name]: value }));
};


  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormState(product);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   Object.entries(formState).forEach(([key, val]) => {
  //     if (val) formData.append(key, val);
  //   });
  //   formData.append('userId', userId);

  //   const url = editingProduct
  //     ? `http://localhost:8000/api/products/${editingProduct}`
  //     : 'http://localhost:8000/api/products';

  //   const method = editingProduct ? 'PUT' : 'POST';

  //   await fetch(url, {
  //     method,
  //     body: formData
  //   });

  //   setEditingProduct(null);
  //   setFormState({ name: '', description: '', price: '', category_id: '', image: null });
  //   fetchProducts();
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let categoryId = formState.category_id;

  // Step 1: Check if user is creating a new category
  if (formState.showNewCategoryInput && formState.newCategory) {
    try {
      const res = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: formState.newCategory })
      });

      if (!res.ok) {
        throw new Error('Failed to create new category');
      }

      const newCat = await res.json();
      categoryId = newCat.id;
    } catch (err) {
      console.error('Error creating category:', err);
      return;
    }
  }

  // Step 2: Submit the product with FormData
  const formData = new FormData();
  Object.entries(formState).forEach(([key, val]) => {
    if (val && key !== 'newCategory' && key !== 'showNewCategoryInput') {
      formData.append(key, val);
    }
  });

  formData.set('category_id', categoryId); // override with new ID if needed
  formData.append('userId', userId);

  const url = editingProduct
    ? `http://localhost:8000/api/products/${editingProduct}`
    : 'http://localhost:8000/api/products';

  const method = editingProduct ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    body: formData
  });

  setEditingProduct(null);
  setFormState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null,
    newCategory: '',
    showNewCategoryInput: false
  });

  fetchProducts();
};


  return (
    <div className="seller-container">
      <h2>{editingProduct ? 'Edit Product' : 'Upload New Product'}</h2>
      <form onSubmit={handleSubmit} className="product-upload-form">
        <input name="name" placeholder="Name" value={formState.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formState.description} onChange={handleChange}></textarea>
        <input type="number" name="price" placeholder="Price" value={formState.price} onChange={handleChange} required />
        <select name="category_id" value={formState.category_id}   onChange={handleChange}
  required
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
  <option value="add-new">+ Add New Category</option>
</select>
          {formState.category_id === 'add-new' && (
  <div>
    <input
      type="text"
      placeholder="Enter new category"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
    />
    <input
  type="file"
  name="image"
  accept="image/*"
  onChange={(e) =>
    setFormState((prev) => ({
      ...prev,
      image: e.target.files[0],
    }))
  }
/>
    <button type="button" onClick={handleAddCategory}>
      Add Category
    </button>
  </div>
)}

   </form>

      <h3>Your Products</h3>
      <div className="product-list">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <img src={prod.image_url} alt={prod.name} />
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p>${prod.price}</p>
            <button onClick={() => handleEdit(prod)}>Edit</button>
            <button onClick={() => handleDelete(prod.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerProductPage;