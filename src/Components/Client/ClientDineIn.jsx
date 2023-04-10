import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientDineIn.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";


function ClientDineIn() {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const [disabled, setDisabled] = useState(false);
  
    function handleClick() {
      setClicked(true);
      setDisabled(true);
      setTimeout(() => {
        setClicked(false);
      }, 60000); // 1 minute
      setTimeout(() => {
        setDisabled(false);
      }, 60000); // 1 minute
    }
  
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

            <div onClick={() => { navigate("/clientfoodmenu") }} class="container menupicture">
                <center><h1>Menu</h1></center>
            </div>

            <br></br>

            <div onClick={() => { navigate("/clientrequestbill") }} class="container billpicture">
                <center><h1>Request Bill</h1></center>
            </div>

            <br></br>

            <div onClick={() => { navigate("/clientrequestcar") }} class="container valetpicture">
                <center><h1>Request Car</h1></center>
            </div>

            <br></br>

            <div onClick={() => { navigate("/clientfeedback") }} class="container feedbackpicture">
                <center><h1>Feedback</h1></center>
            </div>
            <br></br>



        </>
    )
}
export default ClientDineIn;