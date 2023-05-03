import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ToastContainer from './RestNotification';
import { Drawer } from '@mui/material'

const SERVER_URL = "http://127.0.0.1:3500";

function RestOrders() {
  const [orders, setOrders] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetch(`${SERVER_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.log(error));
  }, []);

  const handleModifyClick = (order) => {
    setIsDrawerOpen(true)
  };

  const handleDeleteClick = (order) => {
    // TODO: handle delete click
  };

  const renderOrders = () => {
    return orders.map(order => {
      return (
        <div className='container-sm' style={{ justifyContent: "center", display: "flex" }}>
          <div class="card-group">
            <div className="mb-5" key={order.id}>
              <div className="card text-center border-primary" style={{ width: "300px", display: "flex" }}>
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="card-text">Customer: {order.customer_name}</p>
                  <Drawer
                    anchor='bottom' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    <div className='container-sm'>
                      <br></br>
                      <div class="input-group mb-5">
                        <input type="text" class="form-control" placeholder={order.id} aria-label="Recipient's username" aria-describedby="button-addon2"/>
                          <button class="btn btn-outline-secondary" type="button" id="button-addon2">Confirm order number</button>
                      </div>
                    </div>
                  </Drawer>
                  <p className="card-text">Waiter: {order.waiter_name}</p>
                  <p className="card-text">Table: {order.table_id}</p>
                  <p className="card-text">Date: {order.date}</p>
                  <h6 className="card-subtitle mb-2 text-muted">Items</h6>
                  <ul className="list-group">
                    {order.orders.map(item => {
                      return (
                        <li className="list-group-item" key={item.item_id}>
                          {item.item_name} ({item.quantity})
                        </li>
                      );
                    })}
                  </ul>
                  <div class="card-footer">
                    <div className="mt-3">
                      <button type="button" className="btn btn-primary me-2" onClick={() => handleModifyClick(order)}>Modify</button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(order)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      );
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="row">
        {renderOrders()}
      </div>
    </>
  );
}

export default RestOrders;