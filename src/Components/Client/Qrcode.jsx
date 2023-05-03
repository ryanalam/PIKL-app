import React, { useState } from 'react';
import { getUserToken, getTableNumber, saveTableNumber } from '../../LocalStorage';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Qrcode() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableNumber, setTableNumber] = useState();
    const [userToken, setUserToken] = useState(getUserToken());
    const [data, setData] = useState('No result');
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state && location.state.username;

    function handleSubmit() {
        setIsLoading(true);
        console.log("table number is: ", data);
        const tableId = data; // declare a new variable to hold the table ID
        fetch("http://localhost:3500/edit_visit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ table_id: tableId }), // use the new variable instead of data
        })
            .then((response) => {
                return response.json();
            })
            .then((body) => {
                setTableNumber(tableId);
                saveTableNumber(tableId); // save token in local storage
                console.log(tableNumber);
                setIsLoading(false);
                navigate("/clientdinein", { state: { username: username } });
                toast.success('Table successfully assigned.');
                closeCam();
                
                return body;
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                toast.error(`Error: ${error.message}`);
            });

            const closeCam = async () => {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: true,
                });
                // the rest of the cleanup code
                window.location.reload()
            };

    }

    return (
        <>
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '50%' }}
            />

            <p>Table Number is : {data}</p>

            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
            <br></br>

            <ToastContainer />
        </>
    )
}

export default Qrcode;