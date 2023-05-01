import {React,useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './RestMenu.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RestNotification() {
    const [tableNumber, setTableNumber] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(async () => {
          try {
            const response = await axios.get('http://localhost:3500/waiter_notifications');
            if (response.data.tableNumber) {
              toast.success(`Table ${response.data.tableNumber} needs assistance!`);
              setTableNumber(response.data.tableNumber);
            }
          } catch (error) {
            console.error(error);
          }
        }, 10000);
        return () => {
          clearInterval(intervalId);
        };
      }, []);

    return (
        <>
      <ToastContainer />
      </>
    )
}
export default RestNotification;