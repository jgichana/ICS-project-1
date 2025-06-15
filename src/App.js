import React, { useState } from 'react';
import './App.css';

import Login from './Login';
import Register from './Register';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="app-container">
      <div className="auth-container">
        {isRegistering ? (
          <Register toggleForm={toggleForm} />
        ) : (
          <Login toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}

export default App;
