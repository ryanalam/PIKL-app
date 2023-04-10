import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state && location.state.username;

  return (
    <body>
      <div class="container-sm mb-5">
        <nav class="navbar bg-body-tertiary">
          <div class="container-fluid">
            <button class="btn btn-outline-secondary" onClick={() =>{navigate(-1)}}>Back</button>
            <span class="navbar-text">
              {username && ` ${username}`}
            </span>
          </div>
        </nav>
        <br></br>
      </div>
    </body>
  );
};

export default Navbar;
