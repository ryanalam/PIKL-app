import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';


const RequestCar = () => {
    const [TicketNumberInput, setDisplayTicketNumberInput] = useState('');
    const [display, setDisplay] = useState('');
    const [isShown, SetIsShown] = useState(false)
    const [isHidden, SetIsHidden] = useState(true)

    const OrderCarChange = (event) => {
        setDisplayTicketNumberInput(event.target.value)
    }

    const OrderCarClicked = () => {
        var confirm = window.confirm("Are you sure this is your ticket number?")
        if (confirm) {
            setDisplay(TicketNumberInput);
            SetIsShown(true);
            SetIsHidden(false);
        } else {
        }
        setDisplay(TicketNumberInput);


    };

    return (

        <div class="container-sm">

            {isHidden && (
                <><div class="form-floating mb-3 align-items-center">
                    <input value={TicketNumberInput} onChange={OrderCarChange} type="text" class="form-control" id="TicketNumberInput" name="TicketNumberInput" placeholder='Ticket Nubers' />
                    <label for="floatingInput">Ticket Number</label>
                </div><div class="d-grid gap-2 col-6 mx-auto">
                        <button class="btn btn-outline-primary" type="button" onClick={OrderCarClicked}>Order Car</button>
                    </div></>
            )}

            <br></br>

            {isShown && (
                <div id="DisplayDiv">
                    <h3>Your car is on the way!</h3>
                    <br></br>
                    <div class="spinner-grow text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <br></br>
                    <br></br>
                    <h2>Please show the valet attendant the number displayed below: </h2>
                    <font size="+10">{display}</font>
                </div>
            )}



        </div>




    )

}
export default RequestCar;