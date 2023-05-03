import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './StaffStock.css'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SERVER_URL = 'http://127.0.0.1:3500';

function StaffStock() {
    const [stockData, setStockData] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientQuantity, setNewIngredientQuantity] = useState('');

    useEffect(() => {
        fetch(`${SERVER_URL}/get_stock_levels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(data => {
                setStockData(data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleEditQuantity = () => {
        fetch(`${SERVER_URL}/add_stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ingredient_name: selectedIngredient,
                stock_input: newQuantity,
            }),
        })
            .then((response) => response.json())
            .then(data => {
                toast.success(data.message);
                window.location.reload();
            }
            )
            .catch((error) => console.error(error));
    };

    const handleAddIngredient = () => {
        fetch(`${SERVER_URL}/add_ingredient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newIngredientName,
                supplier_id: 1, // replace with appropriate supplier ID
                unit_price: 1.0, // replace with appropriate unit price
                stock: newIngredientQuantity,
            }),
        })
            .then((response) => response.json())
            .then(data => {
                toast.success(data.message);
            })
            .catch((error) => console.error(error));
    };


    return (
        <div className='container-sm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1em' }}>All Ingredients</h3>
            {stockData.map((stock, index) => (
                <div key={stock.ingredient_id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
                    <label style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', fontSize: '1em' }}>
                        <span style={{ marginRight: '1em', fontSize: '1.5em', textAlign: 'left' }}>{stock.ingredient_name}</span>
                        <div style={{ flexShrink: 1, minWidth: '500px', height: '20px'}}>
                            <ProgressBar style={{ height: '100%' }} now={stock.stock_level} label={`${stock.stock_level}%`} />
                        </div>
                    </label>
                    {index !== stockData.length - 1 && <hr style={{ width: '100%', margin: '0.5em 0' }} />}
                </div>
            ))}

            <br></br>
            <hr></hr>
            <br></br>

            <h3>Add Quantity</h3>
            <select
                class="form-select"
                value={selectedIngredient}
                onChange={(e) => setSelectedIngredient(e.target.value)}
            >
                <option value="">Choose ingredient to add stock quantity</option>
                {stockData.map(stock => (
                    <option key={stock.ingredient_id} value={stock.ingredient_name}>
                        {stock.ingredient_name}
                    </option>
                ))}
            </select>
            <br></br>
            <div class="input-group mb-3">
                <input
                    type="number"
                    class="form-control"
                    placeholder="Quantity"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                />
            </div>
            <button type="button" class="btn btn-primary" onClick={handleEditQuantity}>
                Add Quantity
            </button>

            <br></br>
            <hr></hr>
            <br></br>

            <h3>Add new ingredient with its quantity</h3>

            <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Ingredient name"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                />
                <input
                    type="number"
                    class="form-control"
                    placeholder="Quantity"
                    min="1"
                    value={newIngredientQuantity}
                    onChange={(e) => setNewIngredientQuantity(Number(e.target.value))}
                />
            </div>
            <button type="button" class="btn btn-primary" onClick={handleAddIngredient}>
                Add ingredient
            </button>

            <br></br>
            <hr></hr>
            <br></br>

            <ToastContainer />

        </div>
    )
}
export default StaffStock;


