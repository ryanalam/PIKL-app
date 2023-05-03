import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientDineIn.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserToken, getTableNumber, saveTableNumber } from '../../LocalStorage';
import Qrcode from './Qrcode';

function ClientDineIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(getTableNumber() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const username = location.state?.username;
  const [userToken, setUserToken] = useState(getUserToken());

  const handleClick = async () => {
    setClicked(true);
    setDisabled(true);
    setTimeout(() => {
      setClicked(false);
    }, 60000); // 1 minute
    setTimeout(() => {
      setDisabled(false);
    }, 60000); // 1 minute
    console.log('Button clicked');
    setIsLoading(true);
    try {
      console.log('Sending request');
      const response = await fetch('http://localhost:3500/waiter_notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableNumber }),
      });
      const data = await response.json();
      console.log('Response received:', data);
      toast.success(`Waiter Called`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };




  return (
    <>
        <button
            className={`btn btn-primary rounded-circle BlinkButton ${clicked ? "clicked" : ""}`}
            onClick={handleClick}
            disabled={disabled}
        >
            Call Waiter
        </button>            

        <div onClick={() => { navigate("/clientfoodmenu",{ state: { username: username } }) }} class="container menupicture">
            <center><h1>Menu</h1></center>
        </div>

        <br></br>

        <div onClick={() => { navigate("/clientrequestbill",{ state: { username: username } }) }} class="container billpicture">
            <center><h1>Request Bill</h1></center>
        </div>

        <br></br>

        <div onClick={() => { navigate("/clientrequestcar",{ state: { username: username } }) }} class="container valetpicture">
            <center><h1>Request Car</h1></center>
        </div>

        <br></br>

        <div onClick={() => { navigate("/clientfeedback",{ state: { username: username } }) }} class="container feedbackpicture">
            <center><h1>Feedback</h1></center>
        </div>
        <br></br>



    </>
)
}
export default ClientDineIn;
