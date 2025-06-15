import React, { useState } from 'react';

function Register({ toggleForm }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      console.log('Register with:', { name, email, password });
    }
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomain=['strathmore.edu']

    if(domain && allowedDomain.includes(domain)){
      console.log('Register with:', { name, email, password });
    }else{
        alert('Use your Strathmore Email');
     
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span onClick={toggleForm} className="toggle-link">
          Sign in here
        </span>
      </p>
    </div>
  );
}

export default Register;
