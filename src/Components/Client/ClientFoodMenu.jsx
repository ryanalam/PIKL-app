import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientFoodMenu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheese, faBreadSlice, faTree, faHeart, faAllergies } from '@fortawesome/free-solid-svg-icons';


function ClientFoodMenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // fetch menu items from backend and set state
    fetch('/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container-sm">
<div className="row">
  <div className="col">
    <div className="filter">
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="gluten" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faBreadSlice} className="icon" /> Gluten
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="spicy" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faFire} className="icon" /> Spicy
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="vegetarian" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faTree} className="icon" /> Vegetarian
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="dairy" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faCheese} className="icon" /> Dairy
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="lowcal" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faHeart} className="icon" /> Lowcal
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" name="nuts" />
        <label className="form-check-label">
          <FontAwesomeIcon icon={faAllergies} className="icon" /> Nuts
        </label>
      </div>
      <div className="apply-filter">
        <button className="btn btn-light applyfilterbutton" onClick={() => console.log("Filter button clicked")}>Apply filter</button>
      </div>
    </div>
  </div>
</div>


      <div className="row row-cols-1 row-cols-md-3 g-4">
        {menuItems.map((item) => (
          <div key={item.id} className="col">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary">Add to cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientFoodMenu;
