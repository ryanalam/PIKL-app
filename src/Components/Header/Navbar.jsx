import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    var navigate = useNavigate();
    return (
        <body>
            <div class="container-sm mb-5">
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                <button class="btn btn-outline-secondary" onClick={() =>{navigate(-1)}}>Back</button>
                    <h3 class="navbar-brand">User Info</h3>
                </div>
            </nav>
            <br></br>
            </div>
        </body>
    )}


export default Navbar;