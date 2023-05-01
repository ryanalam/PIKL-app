import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientDineIn.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


function ClientDineIn() {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const location = useLocation();
    const username = location.state && location.state.username;
    const [isLoading, setIsLoading] = useState(false);
    const tableNumber = 1; // replace with the desired table number for testing

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
        await axios.post('http://localhost:3500/waiter_notifications', { tableNumber });
        console.log('Request sent successfully');
        toast.success(`Table ${tableNumber} needs assistance!`);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
  
    useEffect(() => {
      if (disabled) {
        const blinkAnimation = document.createElement("style");
        blinkAnimation.type = "text/css";
        blinkAnimation.innerHTML = ".BlinkButton.clicked { animation: blink 2s ease-in-out infinite; }";
        document.head.appendChild(blinkAnimation);
      } else {
        const blinkAnimation = document.querySelector("style[type='text/css']");
        if (blinkAnimation) {
          document.head.removeChild(blinkAnimation);
        }
      }
    }, [disabled]);

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