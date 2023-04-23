import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientBookATable.css';
import { useNavigate } from 'react-router-dom';
import { getUserToken } from '../../LocalStorage';
import { Navigate } from 'react-router-dom';

var SERVER_URL = "http://127.0.0.1:3500";

function ClientBookATable() {

    let [number_of_people, set_number_of_people] = useState('');
    let [start_time, set_start_time] = useState('');
    let [table_id, set_table_id] = useState('');
    let [showSuccessMessage, setShowSuccessMessage] = useState(false);
    let [showErrorMessage, setShowErrorMessage] = useState(false);
    let [message, setMessage] = useState('');
    let [userToken, setUserToken] = useState([getUserToken()]);
    const navigate = useNavigate();

    console.log(userToken);

    function bookATable(table_id, number_of_people, start_time) {

        return fetch(`${SERVER_URL}/new_reservation_app`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                table_id: table_id,
                number_of_people: number_of_people,
                start_time: start_time,
            }),
        })
            .then((response) => {
                console.log('response', response);
                return response.json()
            })
            .then((body) => {
                console.log('body', body);
                return body;
            });
    }

    const handleBookATable = async () => {
        console.log('reserving', table_id, number_of_people, start_time);
        const response = await bookATable(table_id, number_of_people, start_time);
        console.log('response', response);
        setMessage(response.message);
        if (response.message === "Reservation created successfully.") {
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
        } else {
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }
    }

    // var radio = document.querySelector('.btn-group');
    // var timeofarrival = document.getElementById('timeofarrival');

    // radio.addEventListener('change', function(e) {
    //   if(!e.target.matches('input[type=radio]')) return;

    //   timeofarrival.innerText = e.target.value;
    // });
    return (
        <div class="container-sm">
            <h2>Reserve a Table</h2>
            <br></br>

            <div class="form-floating">
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => set_number_of_people(parseInt(e.target.value))}>
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

            <br></br>

            <div class="form-floating">
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => set_table_id(e.target.value)}>
                    <option selected></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>

                </select>
                <label for="floatingSelect">Table ID</label>
            </div>

            <br></br>
            <br></br>


            <h4>Date and Time of arrival:</h4>
            <h6 id="timeofarrival"> </h6>
            <br></br>
            <input type="datetime-local" id="ReservationDateandTime" name="ReservationDateandTime" onChange={(e) => set_start_time(e.target.value)} />


                <br></br>
                <br></br>
                <button type="button" class="btn btn-primary" onClick={handleBookATable}> Submit </button>

        
        {showErrorMessage && (
            <div className="alert alert-danger mt-2" role="alert">
            {message}
            </div>
        )}    
   
        {showSuccessMessage && (
            <div className="alert alert-success mt-2" role="alert">
            You have successfully reserved a table.
            </div>
        )}

        </div>
    )


}
export default ClientBookATable;
