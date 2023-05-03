import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function StaffEditMenu() {

    return (
        <div className='container-sm'>
            <h3>Add new item to the menu</h3>
            <br></br>

            <div class="mb-3">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Item name" />
            </div>

            <div class="input-group mb-3">
                <input type="number" class="form-control" placeholder="Item price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <span class="input-group-text" id="basic-addon2">$</span>
            </div>

            <div class="input-group">
                <span class="input-group-text">Description</span>
                <textarea class="form-control" aria-label="With textarea"></textarea>
            </div>
            <br></br>

            <div class="input-group mb-3">
                <input type="number" class="form-control" placeholder="Calories" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <span class="input-group-text" id="basic-addon2">cal</span>
            </div>

            <div class="mb-3">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Category" />
            </div>

            <div class="mb-3">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Image path" />
            </div>

            <div class="mb-3">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Filter" />
            </div>

            <button type="button" class="btn btn-primary">Add item</button>
            <br></br>

        </div>


    )
}
export default StaffEditMenu;