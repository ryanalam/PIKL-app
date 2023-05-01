import React, { useState } from 'react';
import axios from 'axios';
import { getUserToken } from '../../LocalStorage';


const SERVER_URL = 'http://127.0.0.1:3500';

const Bill = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [waiterId, setWaiterId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [items, setItems] = useState([]);
  let [userToken, setUserToken] = useState([getUserToken()]);
  

  const handleRequestBillClick = () => {
    fetch(`${SERVER_URL}/get_customer_info`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${userToken}`
      },
    })
      .then(response => response.json())
      .then(data => {
        setOrderId(data.order_id);
        setCustomerId(data.id);
        console.log('Order ID:', orderId);
        fetch(`${SERVER_URL}/bill/${data.order_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(data => {
            setTableNumber(data.table_number);
            setWaiterId(data.waiter_id);
            setTotalAmount(data.total_amount);
            setItems(data.items);
          })
          .catch((error) => console.error(error));
      })
      .catch(error => console.error('Error:', error));      
  };
  

  return (
    <div>
      <button onClick={handleRequestBillClick}>Request bill</button>
      <div>
        <p>Order ID: {orderId}</p>
        <p>Customer ID: {customerId}</p>
        <p>Table Number: {tableNumber}</p>
        <p>Waiter ID: {waiterId}</p>
        <p>Total Amount: {totalAmount}</p>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <p>Item Name: {item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price per Unit: {item.price}</p>
              <p>Total Amount: {item.total_amount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bill;
