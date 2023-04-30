import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WaiterNotifications() {
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    console.log('WaiterNotifications mounted');
    const intervalId = setInterval(async () => {
      try {
        console.log('Polling for notifications');
        const response = await axios.get('http://localhost:3500/waiter_notifications');
        if (response.data.tableNumber) {
          console.log(`Table ${response.data.tableNumber} needs assistance!`);
          toast.success(`Table ${response.data.tableNumber} needs assistance!`);
          setTableNumber(response.data.tableNumber);
        }
      } catch (error) {
        console.error(error);
      }
    }, 10000);
    return () => {
      console.log('Cleaning up interval');
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      {tableNumber && <p>Table {tableNumber} needs assistance</p>}
    </>
  );
}

export default WaiterNotifications;
