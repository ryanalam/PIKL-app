import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';




function ClientRegister() {
        const navigate = useNavigate();
    return (
        <>
        <head>
            <title>Font Awesome Icons</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        </head>
        
        <div class="container-sm">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="client-register-username-input" placeholder='Username' />
                </div>

                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="First Name" aria-label="First Name" id='client-register-firstname-input' />
                    <span></span>
                    <input type="text" class="form-control" placeholder="Last Name" aria-label="Last Name" id='client-register-lastname-input' />
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">Date of Birth</span>
                    <input class="form-control" type="date" id="client-register-birthday-input" name="birthday" placeholder="Date Of Birth" />
                </div>


                <div class="input-group mb-3">
                    <span class="input-group-text">@</span>
                    <input type="email" class="form-control" id="client-register-email-input" placeholder='Email' />
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text fa fa-phone"></span>
                    <input type="tel" class="form-control" id="client-register-phone-input" placeholder='Phone' />
                </div>

                <div class="input-group mb-3 align-items-center">
                    <input type="password" class="form-control" id="client-register-password-input" placeholder="Password" />
                    <div id="passwordHelpBlock" class="form-text">
                    </div>
                </div>
                
                <div class="input-group mb-3 align-items-center">
                    <input type="password" class="form-control" id="client-register-confirmpassword-input" placeholder="Confirm Password" />
                    <div id="passwordHelpBlock" class="form-text">
                    </div>
                </div>

                
                <div class="d-grid gap-2 col-6 mx-auto">
                    <button class="btn btn-outline-primary" onClick={() =>{navigate("/clientmenu")}} type="button">Register</button>
                    <button type="button" class="btn btn-link" onClick={() =>{navigate("/clientlogin")}}>Back</button>
                </div>

            </div></>

    )
}
export default ClientRegister;