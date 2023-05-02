import React, { useState } from 'react';
import { getUserToken, getTableNumber, saveTableNumber } from '../../LocalStorage';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Qrcode() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableNumber, setTableNumber] = useState(getTableNumber() || '');
    const [userToken, setUserToken] = useState(getUserToken());
    const [data, setData] = useState('No result');
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state && location.state.username;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3500/edit_visit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ table_id: data }),
            });
            const data = await response.json();
            console.log('Response received:', data);
            setTableNumber(data.table_id);
            saveTableNumber(data.table_id);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

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
            

            {/* Dont forget to not let the user enter the clientdinein page unless the table number is assigned, 
            here I only put thzt when you click, it directly naviagte you to client dine in, arrange it. */}
            <button className='btn btn-primary' onClick={() => {navigate("/clientdinein",{ state: { username: username } }) }}>Submit</button>
        </>
    )
}

export default Qrcode;
