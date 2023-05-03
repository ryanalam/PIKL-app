// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import './StaffStock.css'
// import ProgressBar from 'react-bootstrap/ProgressBar';
// import  { useState, useEffect } from 'react';

// import 'react-toastify/dist/ReactToastify.css';



// const SERVER_URL = 'http://127.0.0.1:3500';

// function StaffStock() {
//     const now = 100;
    
//     const [stocklevel,setstocklevel ] = useState('');
//     const [stockname,setstockname] = useState('');



//     useEffect(() => {
       
        
//             fetch(`${SERVER_URL}/get_stock_levels`, {
//                 method: 'GET',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               })
//                 .then((response) => response.json())
//                 .then(data => {
    
//                     setstocklevel(data.stock_level);
//                     setstockname(data.name);
//                 })
//                 .catch((error) => console.error(error));
    
//                 console.log(stocklevel);
//                 console.log(stockname);
             
        
//         }, []);


//     return (
//         <div className='container-sm '>
//             <h3>All Ingredients</h3>
//             <label>{stockname}
//                 <ProgressBar now={stocklevel} label={`${stocklevel}%`} />
//             </label>

//             <br></br>
//             <hr></hr>
//             <br></br>

//             <h3>Edit Quantity</h3>
//             <select class="form-select" aria-label="Default select example">
//                 <option selected>Choose ingredient to add the new quantity</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//             </select>
//             <br></br>
//             <div class="input-group mb-3">
//                 <input type="number" class="form-control" placeholder="Quantity" aria-label="Username" aria-describedby="basic-addon1" />
//             </div>
//             <button type="button" class="btn btn-primary">Edit Quantity</button>

//             <br></br>
//             <hr></hr>
//             <br></br>

//             <h3>Add new ingredient with it's quantity</h3>
//             <div class="input-group mb-3">
//                 <input type="text" class="form-control" placeholder="Ingredient name" aria-label="Username" />
//                 <span class="input-group-text">@</span>
//                 <input type="number" class="form-control" placeholder="Quantity" aria-label="Server" />
//                 <br></br>
//             </div>
//             <button type="button" class="btn btn-primary">Add ingredient</button>
            
//             <br></br>
//             <hr></hr>
//             <br></br>

//         </div>
        

//     )
// }
// export default StaffStock;




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
        })
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
        <div className='container-sm '>
            <h3>All Ingredients</h3>
            {stockData.map(stock => (
                <div key={stock.ingredient_id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}>
                        {stock.ingredient_name}
                        <ProgressBar style={{ flexShrink: 1 }} now={stock.percentage} label={`${stock.stock_level}%`} />
                    </label>
                </div>
            ))}

            <br></br>
            <hr></hr>
            <br></br>

            <h3>Edit Quantity</h3>
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
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                />
            </div>
            <button type="button" class="btn btn-primary" onClick={handleEditQuantity}>
                Edit Quantity
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
                <span class="input-group-text">@</span>
                <input
                    type="number"
                    class="form-control"
                    placeholder="Quantity"
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

           
