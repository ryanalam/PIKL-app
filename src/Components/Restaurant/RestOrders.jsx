import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ToastContainer from './RestNotification';
import { Drawer } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

const SERVER_URL = "http://127.0.0.1:3500";

function RestOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [menuList, setMenuList] = useState([]);

  const handleRefreshPage = () => {
    window.location.reload();
  };


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
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id })
    };
    fetch(`${SERVER_URL}/delete_order`, requestOptions)
      .then(response => {
        if (response.ok) {
          setDeleteStatus({ message: `Deleting Order #${order.id}`, type: 'success' });
          setSelectedOrder(null);
          setTimeout(() => {
            window.location.reload();
            return false;
          }, 3000);
        } else if (response.status === 400) {
          setDeleteStatus({ message: `Order #${order.id} cannot be deleted because it has a status of 1.`, type: 'error' });
        } else {
          setDeleteStatus({ message: `Order #${order.id} not found.`, type: 'error' });
        }
      })
      .catch(error => console.log(error));
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
      <div className='container-sm'>
        <h2>All orders</h2>
        <br></br>
        <button className='btn btn-primary' onClick={handleRefreshPage}>
          <FontAwesomeIcon icon={faRefresh} className="icon" />
        </button>
      </div>

      <hr></hr>

      {deleteStatus && (
        <div className={`alert alert-${deleteStatus.type}`} role="alert">
          <div>
            {deleteStatus.message}
          </div>
          <br></br>
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

      )}
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
          <center><button className='btn btn-primary'>Submit</button></center>
          <hr></hr>
          <center><button className='btn btn-danger' onClick={() => handleDeleteClick(selectedOrder)}>Delete order</button></center>
        </div>
        <br></br>
      </Drawer>
    </>
  );
}

export default RestOrders;
