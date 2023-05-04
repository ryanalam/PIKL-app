import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const SERVER_URL = 'http://127.0.0.1:3500';

function StaffEditMenu() {
  const [itemName, setName] = useState('');
  const [itemPrice, setPrice] = useState('');
  const [itemDescription, setDescription] = useState('');
  const [itemCalories, setCalories] = useState('');
  const [itemCategory, setCategory] = useState('');
  const [itemImagePath, setImagePath] = useState('');
  const [itemFilters, setFilters] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${SERVER_URL}/add_new_item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: itemName,
        price: itemPrice,
        description: itemDescription,
        calories: itemCalories,
        category: itemCategory,
        image_path: itemImagePath,
        filters: itemFilters
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // display success message to the user
    })
    .catch(error => {
      console.error(error);
      // display error message to the user
    });
  };

  return (
    <div className="container-sm">
      <h3>Add new item to the menu</h3>
      <br />

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Item price"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={itemPrice}
          onChange={(e) => setPrice(e.target.value)}
        />
        <span className="input-group-text" id="basic-addon2">
          $
        </span>
      </div>

      <div className="input-group">
        <span className="input-group-text">Description</span>
        <textarea
          className="form-control"
          aria-label="With textarea"
          value={itemDescription}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <br />

      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Calories"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={itemCalories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <span className="input-group-text" id="basic-addon2">
          cal
        </span>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Category"
          value={itemCategory}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Image path"
          value={itemImagePath}
          onChange={(e) => setImagePath(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filters"
          value={itemFilters}
          onChange={(e) => setFilters(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-5" onClick={handleSubmit}>
Add Item
</button>
</div>
);
}

export default StaffEditMenu;

