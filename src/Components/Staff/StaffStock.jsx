import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './StaffStock.css'
import ProgressBar from 'react-bootstrap/ProgressBar';

function StaffStock() {
    const now = 100;

    return (
        <div className='container-sm '>
            <h3>All Ingredients</h3>
            <label>Ingredient Name
                <ProgressBar now={now} label={`${now}%`} />
            </label>

            <br></br>
            <hr></hr>
            <br></br>

            <h3>Edit Quantity</h3>
            <select class="form-select" aria-label="Default select example">
                <option selected>Choose ingredient to add the new quantity</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <br></br>
            <div class="input-group mb-3">
                <input type="number" class="form-control" placeholder="Quantity" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <button type="button" class="btn btn-primary">Edit Quantity</button>

            <br></br>
            <hr></hr>
            <br></br>

            <h3>Add new ingredient with it's quantity</h3>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Ingredient name" aria-label="Username" />
                <span class="input-group-text">@</span>
                <input type="number" class="form-control" placeholder="Quantity" aria-label="Server" />
                <br></br>
            </div>
            <button type="button" class="btn btn-primary">Add ingredient</button>
            
            <br></br>
            <hr></hr>
            <br></br>

        </div>
        

    )
}
export default StaffStock;