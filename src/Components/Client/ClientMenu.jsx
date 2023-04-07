import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientMenu.css';
import { useNavigate } from 'react-router-dom';

function ClientLogin() {
    const navigate = useNavigate();

    return (
        <>
            <div onClick={() =>{navigate("/clientdinein")}} class="container dineinpicture">
                <center><h1>Dine-In</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/clientdelivery")}} class="container deliverypicture">
            <center><h1>Delivery</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/clientbookatable")}} class="container bookatablepicture">
            <center><h1>Book A Table</h1></center>
            </div>

            







        </>
    )
}
export default ClientLogin;