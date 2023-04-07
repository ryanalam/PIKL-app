import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientDineIn.css';
import { useNavigate } from 'react-router-dom';

function ClientDineIn() {
    const navigate = useNavigate();

    return (
        <>
            <div onClick={() =>{navigate("/clientfoodmenu")}} class="container menupicture">
                <center><h1>Menu</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/clientrequestbill")}} class="container billpicture">
            <center><h1>Request Bill</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/clientrequestcar")}} class="container valetpicture">
            <center><h1>Request Car</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/clientfeedback")}} class="container feedbackpicture">
            <center><h1>Feedback</h1></center>
            </div>



        </>
    )
}
export default ClientDineIn;