import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';

function RestLogin() {
    const navigate = useNavigate();
    return (
        <div class="container-sm">
            <form>
            <div class="form-floating mb-3 align-items-center ">
                <input type="text" class="form-control" id="rest-login-code-input" placeholder='Waiter Code' required />
                <label for="floatingInput">Waiter Code</label>
            </div>

            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn btn-outline-primary" onClick={() => { navigate("/restmenu") }} type="button">Sign In</button>
            </div>
            </form>
        </div>

    )

}

export default RestLogin;