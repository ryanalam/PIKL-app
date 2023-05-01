import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ToastContainer from './RestNotification';


var SERVER_URL = "http://127.0.0.1:3500";

function RestReservations() {

    const [tableId, setTableId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetch(`${SERVER_URL}/get_reservations`)
          .then(response => response.json())
          .then(data => {setReservations(data); })
          .catch(error => console.log(error));
          console.log(reservations)
      }, []);

    useEffect(() => {
        console.log(reservations);
      }, [reservations]);



    const bookTable = async () => {
        console.log('booking table', tableId, startTime, numberOfPeople, customerName);
        try {
            const response = await fetch(`${SERVER_URL}/new_reservation_phone`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    table_id: tableId,
                    start_time: startTime,
                    number_of_people: numberOfPeople,
                    customer_name: customerName
                })
            });
            const data = await response.json();
            console.log('Table booked:', data);
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
        } catch (error) {
            console.error('Error booking table:', error);
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        bookTable();
    };

    return (
        <div className="container-sm">
            <h2>Restaurant Reservations</h2>
            <br/>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="form-floating">
                    <input type="text" className="form-control" id="table-id" placeholder="Table ID" value={tableId} onChange={(e) => setTableId(e.target.value)} />
                    <label htmlFor="table-id">Table ID</label>
                </div>
                <br/>

                <div className="form-floating">
                    <input type="datetime-local" className="form-control" id="start-time" placeholder="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <label htmlFor="start-time">Start Time</label>
                </div>
                <br/>

                <div class="form-floating">
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}>
                    <option selected></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>

                </select>
                <label for="floatingSelect">Number of people</label>
            </div>
                <br/>

                <div className="form-floating">
                    <input type="text" className="form-control" id="customer-name" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <label htmlFor="customer-name">Customer Name</label>
                </div>
                <br/>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            {showSuccessMessage && (
                <div className="alert alert-success mt-4" role="alert">
                    Table booked successfully.
                </div>
            )}

            {showErrorMessage && (
                <div className="alert alert-danger mt-4" role="alert">
                    Error booking table. Please try again later.
                </div>
            )}
        </div>


    )
}

export default RestReservations;
