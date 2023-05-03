import React, { useState } from 'react';
import { getUserToken } from '../../LocalStorage';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51N2We6DJArv5SXb4GD7CQO3RMqRZNHePjs1mARFr7EHT85aAwLk4XS7mzvZoztzRuja9aNiOGzjugd3OpieyoqDG00Z1d4eavc');

function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleClick = async () => {
    setLoading(true);

    try {
      const token = getUserToken();

      const response = await fetch("http://localhost:3500/pay", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_id: orderId })
      });

      const data = await response.json();

      if (response.status === 200) {
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({ sessionId: data.id });

        if (result.error) {
          alert('Payment failed.');
        } else {
          alert('Payment successful!');
        }
      } else {
        alert('Payment failed.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing the payment.');
    }

    setLoading(false);
  };

  const handleInputChange = (event) => {
    setOrderId(event.target.value);
  };

  return (
    <div>
      <input type="text" value={orderId} onChange={handleInputChange} />
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </div>
  );
}

export default PaymentButton;
