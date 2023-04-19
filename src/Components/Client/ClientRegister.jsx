import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';

var SERVER_URL = "http://127.0.0.1:3500";

function ClientRegister() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = () => {
    setIsRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(false);

    fetch(`${SERVER_URL}/customer_signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        name: `${firstName} ${lastName}`,
        email,
        phone
      })
    })
      .then(response => {
        if (response.ok) {
          setRegisterSuccess(true);
        } else {
          throw new Error('Registration failed.');
        }
      })
      .catch(error => {
        console.error(error);
        setRegisterError(error.message);
      })
      .finally(() => {
        setIsRegistering(false);
      });
  };

  if (registerSuccess) {
    return (
      <div>
        <p>Registration successful. Please check your email to activate your account.</p>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Font Awesome Icons</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </head>
      
      <div className="container-sm">
        <div className="input-group mb-3">
          <input type="text" className="form-control" id="client-register-username-input" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" id='client-register-firstname-input' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <span></span>
          <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" id='client-register-lastname-input' value={lastName} onChange={(e) => setLastName(e.target.value)} />
</div>

<div className="input-group mb-3">
      <input type="date" className="form-control" placeholder="Date of Birth" aria-label="Date of Birth" id='client-register-dob-input' value={dob} onChange={(e) => setDob(e.target.value)} />
    </div>

    <div className="input-group mb-3">
      <input type="email" className="form-control" placeholder="Email" aria-label="Email" id='client-register-email-input' value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>

    <div className="input-group mb-3">
      <input type="tel" className="form-control" placeholder="Phone" aria-label="Phone" id='client-register-phone-input' value={phone} onChange={(e) => setPhone(e.target.value)} />
    </div>

    <div className="input-group mb-3">
      <input type="password" className="form-control" placeholder="Password" aria-label="Password" id='client-register-password-input' value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>

    <div className="input-group mb-3">
      <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" id='client-register-confirm-password-input' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
    </div>

    <div className="d-grid gap-2 col-6 mx-auto">
      <button className="btn btn-primary" type="button" disabled={isRegistering} onClick={handleRegister}>
        {isRegistering ? 'Registering...' : 'Register'}
      </button>
    </div>

    {registerError && <p className="text-danger">{registerError}</p>}

    <p className="text-center">Already have an account? <a href="#" onClick={() => navigate('/clientlogin')}>Log in</a></p>
  </div>
</>

);
}

export default ClientRegister;