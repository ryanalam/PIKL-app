import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientFoodMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheese, faBreadSlice, faTree, faHeart, faAllergies, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const SERVER_URL = 'http://127.0.0.1:3500';

function ClientFoodMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState({
    gluten: false,
    spicy: false,
    vegetarian: false,
    dairy: false,
    lowcal: false,
    nuts: false
  });
  const [cartItems, setCartItems] = useState([]);
  const [newCartItems, setNewCartItems] = useState([]);

  useEffect(() => {
    // fetch menu items from backend and set state
    fetch(`${SERVER_URL}/get_menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error(error));
  }, []);

  const addToCart = (item) => {
    // add item to cart
    const newCartItems = [...cartItems, { name: item.name, price: item.price }];
    setCartItems(newCartItems);
    setNewCartItems(newCartItems);
    console.log(newCartItems)
  };

  const CartButton = () => {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    
    console.log(newCartItems)
    console.log("Total price : " + totalPrice)
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [name]: checked }));
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
      <div className="row">
        <div className="col">
          <div className="filter">
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" name="gluten" checked={filter.gluten} onChange={handleFilterChange} />
              <label className="form-check-label">
                <FontAwesomeIcon icon={faBreadSlice} className="icon" /> Gluten
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
          </div>
          <br></br>
        </div>
        <button icon={faCartShopping} className="btn btn-primary" onClick={() => CartButton()} > Cart
        {/* <FontAwesomeIcon icon={faCartShopping} onClick={() => CartButton()} className="icon" /> Cart */}
      </button>
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

export default ClientFoodMenu;