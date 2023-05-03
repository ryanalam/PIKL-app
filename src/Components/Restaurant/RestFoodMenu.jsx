import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './RestFoodMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheese, faBreadSlice, faTree, faHeart, faAllergies, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from '@mui/material'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWaiterToken } from '../../LocalStorage';


const SERVER_URL = 'http://127.0.0.1:3500';

function RestFoodMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [notes, setNotes] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [quantities, setQuantities] = useState({});
  const waiterToken = getWaiterToken();
  const [totalQuantity, setTotalQuantity] = useState(0); // new state variable
  const [filter, setFilter] = useState({
    gluten: false,
    spicy: false,
    vegetarian: false,
    dairy: false,
    lowcal: false,
    nuts: false
  });

  const [tableId, setTableId] = useState('');
  const [waiterId, setWaiterId] = useState('');
  // const [quantity, setQuantity] = useState('');

  const [cartItems, setCartItems] = useState([]);

  const [tables, setTables] = useState([]);

  useEffect(() => {
    // calculate total quantity in cart whenever cart is updated
    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(total);
  }, [cartItems]);

  useEffect(() => {
    // fetch menu items from backend and set state

        fetch(`${SERVER_URL}/check_table_availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTables(data.available_tables))
      .catch(error => console.error(error));
      
    fetch(`${SERVER_URL}/get_menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error(error));
    console.log(waiterToken)
    fetch(`${SERVER_URL}/decode_waiter`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${waiterToken}`
        },
      })
        .then(response => response.json())
        .then(data => {
            setWaiterId(data.waiter_id);
            console.log('WAITER ID:', data.waiter_id);
          })
        }
        
  , []);

  const addToCart = (item) => {
    const itemInCart = cartItems.find((cartItem) => cartItem.name === item.name);

    if (itemInCart) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.name === item.name) {
          const updatedCartItem = { ...cartItem };
          updatedCartItem.quantity += 1;
          return updatedCartItem;
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
      setQuantities({ ...quantities, [item.name]: itemInCart.quantity + 1 });
      setTotalQuantity(totalQuantity + 1);
    } else {
      const newCartItem = { id: item.id, name: item.name, price: item.price, quantity: 1 };
      const newCartItems = [...cartItems, newCartItem];
      setCartItems(newCartItems);
      setQuantities({ ...quantities, [item.name]: 1 });
      setTotalQuantity(totalQuantity + 1);
    }
    setNotes({ ...notes, [item.name]: "" });
  };

  const handleQuantityChange = (itemName, quantity) => {
    if (quantity === 0) {
      handleRemoveItem(itemName);
    } else {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.name === itemName) {
          const updatedCartItem = { ...cartItem };
          updatedCartItem.quantity = quantity;
          return updatedCartItem;
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
      setQuantities({ ...quantities, [itemName]: quantity });
      const itemInCart = cartItems.find((cartItem) => cartItem.name === itemName);
      const currentQuantity = itemInCart ? itemInCart.quantity : 0;
      setTotalQuantity(totalQuantity - currentQuantity + quantity);
    }
  };
  const handleNoteChange = (itemName, note) => {
    setNotes({ ...notes, [itemName]: note });
  };
  const handleRemoveItem = (itemName) => {
    const updatedCartItems = cartItems.filter((item) => item.name !== itemName);
    setCartItems(updatedCartItems);
    const { [itemName]: note, ...restOfNotes } = notes;
    setNotes(restOfNotes);
    const { [itemName]: quantity, ...restOfQuantities } = quantities;
    setQuantities(restOfQuantities);
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [name]: checked }));
  };

  const placeOrder = () => {
    const items = cartItems.map(item => ({ item_id: item.id, quantity: item.quantity }));

    

    const order = {
      items: items,
      customer_id: null,
      table_id: parseInt(tableId),
      waiter_id: waiterId,
    };
    // toast.success(`Order Placed!`);
    console.log(order)

    fetch(`${SERVER_URL}/new_order`, {
      method: 'POST',
      body: JSON.stringify({
        "items": items,
        "customer_id": null,
        "table_id": parseInt(tableId),
        "waiter_id": waiterId
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(data => {
        if (data.message === "Order created successfully") {
          toast.success("Order placed")
          setCartItems([]);
          setNotes({});
          setQuantities({});
          setTotalQuantity(0);
        } else {
          toast.error("An error occurred")
        }
      })
      
      .catch((error) => console.error(error));
  };



  const handleApplyFilter = () => {
    console.log(filter);
    // apply filter to menu items
    fetch(`${SERVER_URL}/get_menu_filter`, {
      method: 'POST',
      body: JSON.stringify({
        "gluten": filter.gluten,
        "spicy": filter.spicy,
        "vegetarian": filter.vegetarian,
        "dairy": filter.dairy,
        "lowcal": filter.lowcal,
        "nuts": filter.nuts
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error(error));
  };

  return (

    <div className="container-sm">
        <select
            className='form-select'
            value={tableId}
            onChange={event => setTableId(event.target.value)}
          >
            <option value=''>-- Select Table --</option>
            {tables.map(tableId => (
              <option key={tableId} value={tableId}>{`Table ${tableId}`}</option>
            ))}
        </select>
        <br></br><br></br>
      <div className="row">
        <div className="col">
          <div className="filter">
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="gluten" checked={filter.gluten} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faBreadSlice} className="icon iconsize" /> Gluten
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="spicy" checked={filter.spicy} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faFire} className="icon" /> Spicy
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="vegetarian" checked={filter.vegetarian} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faTree} className="icon" /> Vegetarian
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="dairy" checked={filter.dairy} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faCheese} className="icon" /> Dairy
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="lowcal" checked={filter.lowcal} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faHeart} className="icon" /> Lowcal
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="nuts" checked={filter.nuts} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faAllergies} className="icon" /> Nuts
              </label>
            </div>
            <div className="apply-filter">
              <button className="btn btn-primary applyfilterbutton" onClick={() => handleApplyFilter()}>Apply filter</button>
              <br></br>
            </div>
            <button icon={faCartShopping} className="btn btn-primary rounded-circle BlinkButton" onClick={() => setIsDrawerOpen(true)}>
              <FontAwesomeIcon icon={faCartShopping} />
              {totalQuantity > 0 && <span className="badge bg-danger position-absolute top-0 end-0">{totalQuantity}</span>}
            </button>
          </div>
        </div>
        <Drawer
          anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <div className='container-sm'>
          {cartItems.length > 0 ? (
            <ul>
              <br></br>
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <div className="item-info">
                    <h5>{item.name}</h5>
                  </div>
                  <h5>{item.price}$</h5>
                  {<input className='input-group-text' type="text" placeholder="Note" value={notes[item.name] || ""} onChange={(e) => handleNoteChange(item.name, e.target.value)} />}
                  <br></br>
                  <div className="item-quantity">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.name, quantities[item.name] - 1)}>-</button>
                    <span className="quantity">{quantities[item.name] || 1}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.name, quantities[item.name] + 1)}>+</button>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.name)}>Remove</button>
                  </div>
                </li>
              ))}
              <center><p>Total: {Math.round(cartItems.reduce((total, item) => total + item.price * (quantities[item.name] || 1), 0) * 100) / 100}$</p></center>
              <div>
              <center><button className='btn btn-primary' onClick={() => placeOrder() }>Place Order</button></center>
              </div>
            </ul>
            
            ) : (
              <h4>Cart is empty</h4>
            )}
          </div>
        </Drawer>
        <>
    <ToastContainer/>

    </>

        <br></br>

      </div>
      <br></br>
      <br></br>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {menuItems.map((item) => (
          <div key={item.id} className="col">
            <div className="card h-100">
              <img src={item.image_path} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.calories}cal</p>
                <p className="card-text">{item.description}</p>
                <p className="card-text fw-bold">${item.price}</p>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary" onClick={() => addToCart(item)}>Add to cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
// asd

export default RestFoodMenu;