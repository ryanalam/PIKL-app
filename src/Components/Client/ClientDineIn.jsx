// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import './ClientDineIn.css';
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';


// function ClientDineIn() {
//     const navigate = useNavigate();
//     const [clicked, setClicked] = useState(false);
//     const [disabled, setDisabled] = useState(false);
//     const location = useLocation();
//     const username = location.state && location.state.username;
//     const [isLoading, setIsLoading] = useState(false);
    

//     const handleClick = async () => {
//       setClicked(true);
//       setDisabled(true);
//       setTimeout(() => {
//         setClicked(false);
//       }, 60000); // 1 minute
//       setTimeout(() => {
//         setDisabled(false);
//       }, 60000); // 1 minute
//       console.log('Button clicked');
//       setIsLoading(true);
//       try {
//         console.log('Sending request');
//         await axios.post('http://localhost:3500/waiter_notifications', { tableNumber });
//         console.log('Request sent successfully');
//         toast.success(`Table ${tableNumber} needs assistance!`);
//       } catch (error) {
//         console.error(error);
//       }
//       setIsLoading(false);
//     };
  
//     useEffect(() => {
//       if (disabled) {
//         const blinkAnimation = document.createElement("style");
//         blinkAnimation.type = "text/css";
//         blinkAnimation.innerHTML = ".BlinkButton.clicked { animation: blink 2s ease-in-out infinite; }";
//         document.head.appendChild(blinkAnimation);
//       } else {
//         const blinkAnimation = document.querySelector("style[type='text/css']");
//         if (blinkAnimation) {
//           document.head.removeChild(blinkAnimation);
//         }
//       }
//     }, [disabled]);

//     return (
//         <>
//             <button
//                 className={`btn btn-primary rounded-circle BlinkButton ${clicked ? "clicked" : ""}`}
//                 onClick={handleClick}
//                 disabled={disabled}
//             >
//                 Call Waiter
//             </button>            

//             <div onClick={() => { navigate("/clientfoodmenu",{ state: { username: username } }) }} class="container menupicture">
//                 <center><h1>Menu</h1></center>
//             </div>

//             <br></br>

//             <div onClick={() => { navigate("/clientrequestbill",{ state: { username: username } }) }} class="container billpicture">
//                 <center><h1>Request Bill</h1></center>
//             </div>

//             <br></br>

//             <div onClick={() => { navigate("/clientrequestcar",{ state: { username: username } }) }} class="container valetpicture">
//                 <center><h1>Request Car</h1></center>
//             </div>

//             <br></br>

//             <div onClick={() => { navigate("/clientfeedback",{ state: { username: username } }) }} class="container feedbackpicture">
//                 <center><h1>Feedback</h1></center>
//             </div>
//             <br></br>



//         </>
//     )
// }
// export default ClientDineIn;



import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientDineIn.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserToken, getTableNumber, saveTableNumber } from '../../LocalStorage';

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
      toast.success(`Table ${tableNumber} needs assistance!`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const promptTableNumber = async () => {
      let savedTableNumber = getTableNumber();
      if (!savedTableNumber) {
        savedTableNumber = prompt('Enter the table number:');
        saveTableNumber(savedTableNumber);
      }
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3500/edit_visit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ table_id: savedTableNumber }),
        });
        const data = await response.json();
        console.log('Response received:', data);
        setTableNumber(savedTableNumber);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    promptTableNumber();
  }, [userToken]);



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






  // useEffect(() => {
  //   if (disabled) {
  //     const blinkAnimation = document.createElement('style');
  //     blinkAnimation.type = 'text/css';
  //     blinkAnimation.innerHTML = '.BlinkButton.clicked { animation: blink 2s ease-in-out infinite; }';
  //     document.head.appendChild(blinkAnimation);
  //   } else {
  //     const blinkAnimation = document.querySelector("style[type='text/css']");
  //     if (blinkAnimation) {
  //       document.head.removeChild(blinkAnimation);
  //     }
  //   }
  // }, [disabled]);