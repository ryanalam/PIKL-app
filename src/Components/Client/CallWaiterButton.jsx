import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CallWaiterButton() {
  const [isLoading, setIsLoading] = useState(false);
  const tableNumber = 1; // replace with the desired table number for testing

  const handleClick = async () => {
    console.log('Button clicked');
    setIsLoading(true);
    try {
      console.log('Sending request');
      await axios.post('http://localhost:3500/waiter_notifications', { tableNumber });
      console.log('Request sent successfully');
      toast.success(`Table ${tableNumber} needs assistance!`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Calling waiter...' : 'Call waiter'}
    </button>
  );
}

export default CallWaiterButton;
