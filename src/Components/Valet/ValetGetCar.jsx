import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://127.0.0.1:3500';

function ValetGetCar() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // make API call to get all getcar requests
        axios.get(`${SERVER_URL}/valet_get_car_requests`)
            .then(response => {
                setRequests(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleDoneClick = (requestId) => {
        // make API call to delete the request
        axios.delete(`${SERVER_URL}/valet_delete_request/${requestId}`)
            .then(response => {
                // remove the request from the list of requests
                setRequests(requests.filter(request => request.id !== requestId));
            })
            .catch(error => {
                console.log(error);
            });
    }

    // poll for new requests every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            axios.get(`${SERVER_URL}/valet_get_car_requests`)
                .then(response => {
                    setRequests(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='container-sm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {requests.map(request => (
                <div className="card border-primary" key={request.id} style={{ width: "18rem", marginBottom: '1rem' }}>
                    <ul className="list-group list-group-flush">
                    <li className="list-group-item">Get car #{request.car_number}</li>

                        <button className='btn btn-primary' onClick={() => handleDoneClick(request.id)}>Done</button>
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ValetGetCar;

