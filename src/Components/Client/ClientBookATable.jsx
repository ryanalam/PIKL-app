import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientBookATable.css';
import { useNavigate } from 'react-router-dom';

var SERVER_URL = "http://127.0.0.1:5000";

function ClientBookATable() {

    let [number_of_people, set_number_of_people] = useState('');
    let [start_time, set_start_time] = useState('');
    let [table_id, set_table_id] = useState('');
    let [showSuccessMessage, setShowSuccessMessage] = useState(false);
    let [showErrorMessage, setShowErrorMessage] = useState(false);
    let [userToken, setUserToken] = useState('');
    const navigate = useNavigate();

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
        console.log('reserving',table_id, number_of_people, start_time);
        const response = await bookATable(table_id, number_of_people, start_time);
        console.log('response', response);
        if (response.message = "Table is not available.") {
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }   else {
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
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
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => set_number_of_people(e.target.value)}>
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

            <h3>AfterNoon</h3>
            
            <h6>Time of arrival:</h6>
            <h6 id="timeofarrival"> </h6>
            <div class="btn-group-sm" role="group" aria-label="Choose time slot">
                <label class="btn btn-outline-primary" for="btnradio1">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="12:00" onChange={(e) => set_start_time(e.target.value)}/>
                        12:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio2">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="12:30" onChange={(e) => set_start_time(e.target.value)}/>
                        12:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio3">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" value="1:00" onChange={(e) => set_start_time(e.target.value)}/>
                        1:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio4">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" value="1:30" onChange={(e) => set_start_time(e.target.value)}/>
                        1:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio5">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off" value="2:00" onChange={(e) => set_start_time(e.target.value)}/>
                        2:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio6">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio6" autocomplete="off" value="2:30" onChange={(e) => set_start_time(e.target.value)}/>
                        2:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio7">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio7" autocomplete="off" value="3:00" onChange={(e) => set_start_time(e.target.value)}/>
                        3:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio8">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio8" autocomplete="off" value="3:30" onChange={(e) => set_start_time(e.target.value)}/>
                        3:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio9">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio9" autocomplete="off" value="4:00" onChange={(e) => set_start_time(e.target.value)}/>
                        4:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio10">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio10" autocomplete="off" value="4:30" onChange={(e) => set_start_time(e.target.value)}/>
                        4:30
                </label>

            </div>
            <br></br>
            <button type="button" class="btn btn-primary" onClick={handleBookATable}> Submit </button>



        </div>


    )


}
export default ClientBookATable;
