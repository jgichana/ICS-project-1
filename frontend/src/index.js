import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App' ;
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './pages/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <CartProvider>

        <App/>
        </CartProvider>
    </React.StrictMode>
);

reportWebVitals();