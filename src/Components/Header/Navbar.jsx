import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearUserToken, getUserToken, saveUserToken, clearTableNumber} from '../../LocalStorage';

const Navbar = ({ onUserTokenChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(getUserToken());
  const username = location.state && location.state.username;

  function logout() {
    setUserToken(null);
    saveUserToken(null);
    clearUserToken();
    clearTableNumber();
    window.location.reload(false);
    navigate('/ClientLogin')
  }

  useEffect(() => {
    onUserTokenChange();
  }, [userToken]);

  useEffect(() => {
    function handleStorageEvent() {
      setUserToken(getUserToken());
    }

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const hideBackButton = () => {
    const excludedPaths = ['/clientlogin', '/clientregister', '/clientmenu'];
    return !excludedPaths.includes(location.pathname);
  }
  

  return (
    <body>
      <div className="container-sm mb-5">
        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid">
            {hideBackButton() && (
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button>
            )}
            <p> </p>
            <span className="navbar-text">
              {userToken != null && (
                <p>{username && ` ${username}`}</p>
              )}
              {userToken != null && (
                <button className="btn btn-danger" onClick={logout}>Logout </button>
              )}
            </span>
          </div>
        </nav>
        <br />
      </div>
    </body>
  );
};

export default Navbar;