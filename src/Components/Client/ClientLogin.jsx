import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';

function ClientLogin() {
    const navigate = useNavigate();

    return (
            <div class="container-sm">
                <div class="form-floating mb-3 align-items-center ">
                    <input type="text" class="form-control" id="client-login-username-input" placeholder='Username' />
                    <label for="floatingInput">Username</label>
                </div>
                <div class="form-floating mb-3 align-items-center">
                    <input type="password" class="form-control" id="client-login-password-input" placeholder="Password" />
                    <label for="floatingPassword">Password</label>
                    <div id="passwordHelpBlock" class="form-text">
                    
                    </div>
                </div>

                <div class="d-grid gap-2 col-6 mx-auto">
                    <button class="btn btn-outline-primary" onClick={() =>{navigate("/clientmenu")}} type="button">Sign In</button>
                    <small>or</small>
                    <button type="button" class="btn btn-outline-primary" onClick={() =>{navigate("/clientregister")}}>Register</button>
                </div>
            </div>
    )
}
export default ClientLogin;
