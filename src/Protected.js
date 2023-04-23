// Add the following import to the top of the file
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { getUserToken } from './LocalStorage';
import loginStatus from './Components/Client/ClientLogin'
import Navbar from './Components/Header/Navbar';


// Replace the Protected component with the following
function Protected({ children }) {
  const [UserToken] = useState(getUserToken());
  if (UserToken === null) {
    // If the user is not authenticated, redirect to the login pages
    return <Navigate to="/clientlogin" />;
  }
  // If the user is authenticated, render the child components
  return <>{children}</>;
}
export default Protected;