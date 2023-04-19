import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { getUserToken,saveUserToken} from "../../LocalStorage";

var SERVER_URL = "http://127.0.0.1:3500";

function ClientLogin() {
  let [loginStatus, setLoginStatus] = useState(false);
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [showSuccessMessage, setShowSuccessMessage] = useState(false);
  let [showErrorMessage, setShowErrorMessage] = useState(false);
  let [userToken, setUserToken] = useState(getUserToken() || '');
  const navigate = useNavigate();

  function login(username, password) {
    return fetch(`${SERVER_URL}/customer_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then((response) => {
      return response.json()
    })
    .then((body) => {
      setUserToken(body.access_token);
      saveUserToken(body.access_token); // save token in local storage
      console.log(userToken);
      return body;
    });
  }
  
  const handleLogin = async () => {
    console.log('logging in with', username, password);
    const response = await login(username, password);
    if (response.access_token) {
      
      console.log(username);
      setLoginStatus(true);
      setShowSuccessMessage(true);
      setShowErrorMessage(false);
      setTimeout(() => {
        // window.location.reload(false);
        // navigate("/clientmenu", { state: { username: username } });
        navigate("/clientmenu")
      }, 2000);
      
    } else {
      setShowSuccessMessage(false);
      setShowErrorMessage(true);
      setLoginStatus(false);
    }
  }



  return (
    <div className="container-sm">
      <div className="form-floating mb-3 align-items-center">
        <input type="text" className="form-control" id="client-login-username-input" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="floatingInput">Username</label>
      </div>
      <div className="form-floating mb-3 align-items-center">
        <input type="password" className="form-control" id="client-login-password-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="floatingPassword">Password</label>
        <div id="passwordHelpBlock" className="form-text">
          
        </div>
      </div>

      <div className="d-grid gap-2 col-6 mx-auto">
        <button className="btn btn-outline-primary" onClick={handleLogin} type="button">Sign In</button>
        <small>or</small>
        <button type="button" className="btn btn-outline-primary" onClick={() => navigate("/clientregister")}>Register</button>
      </div>

      {showSuccessMessage && (
        <div className="alert alert-success mt-2" role="alert">
          You have successfully logged in! Redirecting...
        </div>
      )}

      {showErrorMessage && (
        <div className="alert alert-danger mt-2" role="alert">
          Incorrect username or password. Please try again.
        </div>
      )}
    </div>
  )
}

export default ClientLogin;

  
