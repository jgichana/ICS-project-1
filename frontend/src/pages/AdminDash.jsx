import React, { useState, useEffect } from 'react';
import '../App.css';

function AdminDash() {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }else{
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:8000/admin/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Report generated successfully!');
        fetchReports(); // Refresh reports
      } else {
        const errorData=await response.json();
        setMessage(`Error generating report:${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage('Network error while generating report');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8000/admin/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Product deleted successfully!');
          fetchReports();
          fetchProducts(); // Refresh products
        } else {
          const errorData=await response.json();
          setMessage(`Error deleting product:${errorData.message || 'Unknon error'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage('Network error while deleting product');
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8000/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('User deleted successfully!');
          fetchUsers(); // Refresh users
        } else {
          setMessage('Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('Network error while deleting user');
      }
    }
  };

  const renderReports = () => (
    <div className="admin-section">
      <div className="admin-header">
        <h3>Sales Reports</h3>
        <button 
          className="btn generate-btn" 
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate New Report'}
        </button>
      </div>
      
      <div className="reports-container">
        {reports.length === 0 ? (
          <p>No reports available. Click "Generate New Report" to create one.</p>
        ) : (
          <div className="reports-grid">
            {reports.map(report => (
              <div key={report.id} className="report-card">
                <h4>{report.product_name}</h4>
                <p><strong>Buyer:</strong> {report.buyer_name}</p>
                <p><strong>Quantity:</strong> {report.quantity}</p>
                <p><strong>Total Price:</strong> Ksh. {report.total_price}</p>
                <p><strong>Purchase Date:</strong> {new Date(report.purchase_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-section">
      <h3>Manage Products</h3>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="admin-card">
            <img src={`http://localhost:8000${product.image_url}`} alt={product.name} />
            <div className="card-content">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p><strong>Price:</strong> Ksh. {product.price}</p>
              <p><strong>Status:</strong> {product.unavailable === 0 ? 'Available' : 'Unavailable'}</p>
              <button 
                className="btn delete-btn" 
                onClick={() => deleteProduct(product.id)}
              >
                Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <h3>Manage Users</h3>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userid}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <button 
                    className="btn delete-btn" 
                    onClick={() => deleteUser(user.userid)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        {message && <div className="admin-message">{message}</div>}
        
        <div className="admin-tabs">
          {/* <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Sales Reports
          </button> */}
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Manage Products
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
        </div>

        <div className="admin-content">
          {/* {activeTab === 'reports' && renderReports()} */}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </div>
    </div>
  );
}

export default AdminDash;