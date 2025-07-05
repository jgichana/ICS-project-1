import React, { useState } from 'react';

const PaymentForm = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount), // Ensure amount is a number
          phone: phone, // Frontend sends 'phone', backend expects 'phone'
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('STK Push sent to phone. Check your M-Pesa.');
      } else {
        // FINAL CRITICAL FIX: More robust error message extraction to ensure 'message' is always a string
        let displayMessage = 'Payment failed. Please try again.'; // Default fallback message

        // Case 1: Backend sends a 'message' field (e.g., "Missing required fields")
        if (data.message) {
          displayMessage = data.message;
        }
        // Case 2: Backend sends an 'error' field
        else if (data.error) {
          if (typeof data.error === 'object') {
            // If data.error is an object, try to extract a specific message or stringify it
            if (data.error.errorMessage) { // Common for M-Pesa API errors
              displayMessage = data.error.errorMessage;
            } else if (data.error.message) { // Common for general backend errors
              displayMessage = data.error.message;
            } else {
              // If it's an object but no specific message field, stringify the whole object
              displayMessage = JSON.stringify(data.error);
            }
          } else if (typeof data.error === 'string') {
            // If data.error is already a string
            displayMessage = data.error;
          }
        }
        // Case 3: Error properties are at the top-level of the 'data' object (e.g., direct M-Pesa API response)
        else if (data.errorCode || data.errorMessage || data.requestId) {
            displayMessage = data.errorMessage || `Error Code: ${data.errorCode || 'N/A'}`;
            if (data.requestId) {
                displayMessage += ` (Request ID: ${data.requestId})`;
            }
        }
        // Fallback for any other unexpected object structure
        else if (typeof data === 'object') {
            displayMessage = `An unexpected error occurred: ${JSON.stringify(data)}`;
        }


        setMessage(displayMessage);
      }
    } catch (err) {
      setMessage('Error occurred while initiating payment. Please check console for network issues.');
      console.error('Frontend fetch error:', err);
    }
  };

  return (
    <div className="buyer-container">
      <div className="product-upload-form">
        <h2>Pay via M-Pesa</h2>
        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label>Phone Number </label>
            <input
              type="text"
              placeholder='e.g., 254708374149 or 0708374149'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button type="submit">Pay Now</button>
        </form>
        {message && (
          <div className={`form-message ${String(message).includes('sent') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
