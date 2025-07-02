import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate(); 

  const handleSubmit = async(e) => {
  e.preventDefault();
  setMessage('');
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomain=['strathmore.edu']

    if(!domain || !allowedDomain.includes(domain)){
     setMessage('Error: Please use your Strathmore email (e.g., @strathmore.edu).');
      return;
    } 
     try {
      const response = await fetch('http://localhost:8000/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });
  
  const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

      if (response.ok) {
        setMessage('Log in successful!');
        if (onLoginSuccess) { 
          onLoginSuccess(data.userId, data.userType);
        }
        navigate('/');
      } else {
        setMessage(`Error: ${data.message }`);
        console.error('Registration error:', data);
      }
    }
   } catch (error) {
      console.error('Network error during registration:', error);
      setMessage('Network error. Please try again later.', error);
    } 
  };


  return (
    <div className='app-container'>
      <div className="auth-container">

    <div className="auth-form">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" >Login</button>
       
      </form>
      {message && <p className="form-message">{message}</p>}

        <p>
        Don't have an account?{' '}
        <Link to ='/Register' className="toggle-link">
          Register here
        </Link>
      </p>
    </div>
  </div>
  </div>
  );
}

export default Login;
