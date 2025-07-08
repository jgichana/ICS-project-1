// import React, { useState } from 'react';
// import {Link, useNavigate} from 'react-router-dom'

// function Register({ onRegisterSuccess }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [userType, setUserType] = useState('buyer'); 
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert('Passwords do not match');
//     } else {
//       console.log('Register with:', { name, email, password });
//     }
//     const domain = email.split('@')[1]?.toLowerCase();
//     const allowedDomain=['strathmore.edu']

//     if(domain && allowedDomain.includes(domain)){
//       console.log('Register with:', { name, email, password });
//     }else{
//         alert('Use your Strathmore Email');
     
//     }
  

//   try {
//       const response = await fetch('http://localhost:8000/register', { 
//         method: 'POST',
//         headers: {'Content-Type': 'application/json',},
//         body: JSON.stringify({ name, email, password, userType }), 
//       });

//       const data = await response.json(); 

//       if (response.ok) {
//         setMessage('Registration successful! You can now log in.');
//         onRegisterSuccess();
//         navigate('/login');
//       } else {
//         setMessage(`Error: ${data.message || 'Registration failed. Please try again.'}`);
//         console.error('Registration error:', data);
//       }
//     } catch (error) {
//       console.error('Network error during registration:', error);
//       setMessage('Network error. Please try again later.');
   
//   };

//   return (
//     <div className="auth-form">
//       <h2>Sign up</h2>
//       <form >
        

//         <label htmlFor="name">Full Name:</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <label htmlFor="confirm-password">Confirm Password:</label>
//         <input
//           type="password"
//           id="confirm-password"
//           name="confirm-password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <label id="role">Select your role</label>
//       <select id ='userType' value={userType} onChange={(e) => setUserType(e.target.value)}>
//         <option value="Seller">Seller</option>
//         <option value="Buyer">Buyer</option>
//       </select>
//         <button type="submit" onClick={handleSubmit}>Register</button>
//       </form>
//       <p>
//         Already have an account?{' '}
//         <Link to="/Login" className="toggle-link">
//           Sign in here
//           </Link>
//       </p>
//     </div>
//   );
// }
// }

// export default Register;





//
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 
    setLoading(true); 

    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      setLoading(false);
      return;
    }
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomain = 'strathmore.edu';

    if (!domain || domain !== allowedDomain) {
      setMessage('Error: Please use your Strathmore email (i.e. @strathmore.edu).');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, userType }), 
      });

const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        if (onRegisterSuccess) { 
          onRegisterSuccess();
        }
        navigate('/login');
      } else {
        setMessage(`Error: ${ data.message }`);
        console.error('Registration error:', data);
      }
    }
   } catch (error) {
      console.error('Network error during registration:', error);
      setMessage('Network error. Please try again later.', error);
    } finally {
      setLoading(false); 
    
  }};

  return (
    <div className='app-container'>
    <div className='auth-container'> 

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

        {/* <label id="role">Select your role</label>
        <select id='userType' value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="Buyer">Buyer</option> 
          <option value="Seller">Seller</option>

        </select> */}

        <button   type="submit" disabled={loading}>
        Sign up
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <p>
        Already have an account?{' '}
        <Link to="/login" className="toggle-link">
          Sign in here
        </Link>
      </p>
    </div>
    </div>
  </div>
  );
}

export default Register; 
