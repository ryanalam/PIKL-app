import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ToastContainer from './RestNotification';
import { Drawer } from '@mui/material';

const SERVER_URL = "http://127.0.0.1:3500";

function RestOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuList, setMenuList] = useState([]);


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

  useEffect(() => {
    fetch(`${SERVER_URL}/get_menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setMenuList(data))
      .catch(error => console.log(error));
  }, []);


  const handleModifyClick = (order) => {
    setSelectedOrder(order);
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
                      <button type="button" className="btn btn-danger">Close Bill</button>
                      <br></br>
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
      <Drawer
        anchor='bottom'
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
      >
        <div className='container-sm'>
          <br />
          {selectedOrder && (
            <>
              <h2>Order #{selectedOrder.id}</h2>
              <h6 className="card-subtitle mb-2 text-muted">Items</h6>
              <ul className="list-group">
                {selectedOrder.orders.map(item => {
                  return (
                    <li className="list-group-item" key={item.item_id}>
                      <div className="row">
                        <div className="col-sm-8">{item.item_name} ({item.quantity})</div>
                        <div className="col-sm-4">
                          <button className='btn btn-danger float-right'>Delete unit</button>
                        </div>
                      </div>
                    </li>

                  );
                })}
              </ul>
              <br></br>
            </>
          )}
        </div>
        <div className='container-sm'>
          <div>
            <select class="form-select" aria-label="Default select example">
              <option selected>Choose item to add</option>
              {menuList.map(item => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>

            <div class="input-group mb-3">
              <input type="number" class="form-control" placeholder="Quantity" min="0" aria-label="Recipient's username" aria-describedby="button-addon2" />
              <button class="btn btn-outline-success" type="button" id="button-addon2">Add item</button>
            </div>
          </div>
          <center><button className='btn btn-primary mb-1'>Submit</button></center>
          <hr></hr>
          <center><button className='btn btn-danger mb'>Delete order</button></center>
        </div>
        <br></br>
      </Drawer>
    </>
  );
}

export default RestOrders;
