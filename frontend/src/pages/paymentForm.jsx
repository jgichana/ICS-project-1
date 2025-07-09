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
          amount: parseFloat(amount), 
          phone: phone, 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('STK Push sent to phone. Check your M-Pesa.');

      } else {
        let displayMessage = 'Payment failed. Please try again.'; 

        if (data.message) {
          displayMessage = data.message;
        }
        else if (data.error) {
          if (typeof data.error === 'object') {
            if (data.error.errorMessage) { 
              displayMessage = data.error.errorMessage;
            } else if (data.error.message) { 
              displayMessage = data.error.message;
            } else {
              displayMessage = JSON.stringify(data.error);
            }
          } else if (typeof data.error === 'string') {
            displayMessage = data.error;
          }
        }
        else if (data.errorCode || data.errorMessage || data.requestId) {
            displayMessage = data.errorMessage || `Error Code: ${data.errorCode || 'N/A'}`;
            if (data.requestId) {
                displayMessage += ` (Request ID: ${data.requestId})`;
            }
        }
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
              placeholder='e.g., 254... or 07...'
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
