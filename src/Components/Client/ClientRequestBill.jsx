import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserToken } from '../../LocalStorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ClientDineIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faCreditCard } from '@fortawesome/free-solid-svg-icons';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51N2We6DJArv5SXb4GD7CQO3RMqRZNHePjs1mARFr7EHT85aAwLk4XS7mzvZoztzRuja9aNiOGzjugd3OpieyoqDG00Z1d4eavc');


const SERVER_URL = 'http://127.0.0.1:3500';

const Bill = () => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [items, setItems] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [userToken] = useState([getUserToken()]);

  const handleClick = async () => {
    setClicked(true);
    setDisabled(true);
    setTimeout(() => {
      setClicked(false);
    }, 10000); // 1 minute
    setTimeout(() => {
      setDisabled(false);
    }, 10000); // 1 minute
    console.log('Button clicked');
    setIsLoading(true);
    try {
      console.log('Sending request');
      await axios.post('http://localhost:3500/waiter_notifications', { tableNumber });
      console.log('Request sent successfully');
      toast.success(`Waiter Called`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };


  const handleCashCheckout = async () => {
    try {
      await axios.post(`${SERVER_URL}/cash_checkout`, { order_id: orderId, table_id: tableNumber }, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      toast.success('Checkout successful. Payment method: Cash');
    } catch (error) {
      console.error(error);
      toast.error('Failed to process cash payment.');
    }
  };
  
  const handleVisaCheckout = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/pay`, { order_id: orderId }, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const sessionId = response.data.id;
  
      // Handle Stripe payment process
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: sessionId });
  
      if (result.error) {
        toast.error('Payment failed.');
      } else {
        toast.success('Checkout successful. Payment method: Visa');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to process visa payment.');
    }
  };
  
  
  const handleCheckout = () => {
    const cashOption = document.getElementById('cash');
    const visaOption = document.getElementById('visa');
    if (cashOption.checked) {
      handleCashCheckout();
    } else if (visaOption.checked) {
      handleVisaCheckout();
    } else {
      toast.error('Please select a payment method.');
    }
  };
  


  useEffect(() => {
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
        setCustomerName(data.name);
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
            setWaiterName(data.waiter);
            setTotalAmount(data.total_amount);
            setItems(data.items);
            console.log("TABLE:", tableNumber);
          })
          .catch((error) => console.error(error));
      })
      .catch(error => console.error('Error:', error));
  }, []);


  return (
    <div className='container'>
      <div className='row'>
        <div className=' text-center'>
          <div className='d-block'><b><h2 className='font-weight-bold'>Order ID: #{orderId}</h2></b></div>
          <div className='row'>
            <div className='col-12'>
              <hr />
            </div>
          </div>
          <div className='d-block'><p className='font-weight-bold'>Table Number: {tableNumber}</p></div>
          <div className='d-block'><p className='font-weight-bold small'>Customer Name: {customerName}</p></div>
          <div className='d-block'><p className='font-weight-bold small'>Waiter Name: {waiterName}</p></div>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <hr />
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='scrollable-container'>
            {items.map((item) => (
              <div className='item-box' key={item.id}>
                <div className='row'>
                  <div className='col-4'>
                    <p className='font-weight-bold text-primary'>{item.name}</p>
                  </div>
                  <div className='col-4'>
                    <p className='small'>x {item.quantity}</p>
                  </div>
                  <div className='col-4 text-right'>
                    <p className='small'>{item.total_amount} $</p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <p style={{ wordBreak: 'break-word' }}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <hr />
        </div>
      </div>

      <div className='row'>
        <div className='col-6 text-left'>
        <h4 className='font-weight-bold'>Total: {Math.round(totalAmount * 100) / 100} $</h4>

        </div>
        <div className='col-6 text-right'>
          <button className='btn border-primary' onClick={handleClick} disabled={disabled}>
            {isLoading ? 'Calling Waiter...' : 'Call Waiter'}</button>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <hr />
        </div>
      </div>

      <div className='row'>
        <div className='col-7'>
          <h6 className='font-weight-bold'>Payment Method</h6>
          <div className='form-check'>
            <input className='form-check-input' type='radio' name='paymentMethod' id='cash' value='cash' />
            <label className="form-check-label">
                <FontAwesomeIcon icon={faMoneyBill} className="icon" /> Cash
              </label>
          </div>
          <div className='form-check'>
            <input className='form-check-input' type='radio' name='paymentMethod' id='visa' value='visa' />
            <label className="form-check-label">
                <FontAwesomeIcon icon={faCreditCard} className="icon" /> Visa
              </label>
          </div>
          <br></br>
        </div>
        <div className='col-12'>
        <button className='btn btn-success' onClick={handleCheckout} disabled={disabled}>Checkout</button>
        </div>
      </div>
      <br></br>
    </div>

  );
};


export default Bill;
