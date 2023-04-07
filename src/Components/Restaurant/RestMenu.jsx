import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './RestMenu.css';
import { useNavigate } from 'react-router-dom';

function ClientLogin() {
    const navigate = useNavigate();

    return (
        <>
            <div class="container-sm">
            <div onClick={() =>{navigate("/restreservations")}} class="container reservations">
                <center><h1>Reservations</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/restfoodmenu")}} class="container menu">
            <center><h1>Menu</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/restorders")}} class="container orders">
            <center><h1>Orders</h1></center>
            </div>

            </div>

            







        </>
    )
}
export default ClientLogin;