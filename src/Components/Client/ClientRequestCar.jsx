import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const SERVER_URL = 'http://127.0.0.1:3500';

const RequestCar = () => {
  const [ticketNumberInput, setTicketNumberInput] = useState('');
  const [display, setDisplay] = useState('');
  const [isShown, setIsShown] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const handleTicketNumberChange = (event) => {
    setTicketNumberInput(event.target.value);
  };

  const handleOrderCarClick = async () => {
    const confirm = window.confirm(ticketNumberInput + "\n" + 'Are you sure this is your ticket number?');
    if (confirm) {
      setIsHidden(false);
      setIsShown(true);

      // Make API call to create the car request
      try {
        const response = await fetch(`${SERVER_URL}/valet_create_request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ car_number: ticketNumberInput }),
        });
        const data = await response.json();
        setDisplay(data.car_number);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container-sm">
      {isHidden && (
        <>
          <div className="form-floating mb-3 align-items-center">
            <input
              value={ticketNumberInput}
              onChange={handleTicketNumberChange}
              type="number"
              className="form-control"
              id="TicketNumberInput"
              name="TicketNumberInput"
              placeholder="Ticket Numbers"
            />
            <label htmlFor="floatingInput">Ticket Number</label>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button className="btn btn-outline-primary" type="button" onClick={handleOrderCarClick}>
              Order Car
            </button>
          </div>
        </>
      )}

      <br />

      {isShown && (
        <div id="DisplayDiv">
          <h3>Your car is on the way!</h3>
          <br />
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <br />
          <br />
          <h2>Please show the valet attendant the number displayed below:</h2>
          <font size="+10">{display}</font>
        </div>
      )}
    </div>
  );
};

export default RequestCar;
