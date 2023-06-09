import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientMenu.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

var SERVER_URL = "http://127.0.0.1:3500";

function ClientMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state && location.state.username;

    return (
        <>

            <div onClick={() => { navigate("/qrcode",{ state: { username: username } }) }} class="container dineinpicture">
                <center><h1>Dine-In</h1></center>
            </div>

            <br></br>
            <br></br>

            <div onClick={() => { navigate("/clientbookatable",{ state: { username: username } }) }} class="container bookatablepicture">
                <center><h1>Book A Table</h1></center>
            </div>









        </>
    )
}
export default ClientMenu;