import React, { useState } from 'react';

function Login({ toggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with:', { email, password });
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomain=['strathmore.edu']

    if(domain && allowedDomain.includes(domain)){
      console.log('Register with:', {email, password });
    }else{
        alert('Use your Strathmore Email');
     
    }  };

  function clearInputs(){
    document.getElementById().reset();}

  return (
    <div className="auth-form">
      <h2>Login</h2>
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

        <button type="submit" onclick={clearInputs}>Login</button>
       
      </form>
        <p>
        Don't have an account?{' '}
        <span onClick={toggleForm} className="toggle-link">
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
