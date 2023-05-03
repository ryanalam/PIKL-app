import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function StaffEmployees() {

    return (
        <div className='container-sm'>
            <h3>Add new employee</h3>
            <br></br>

            <div class="mb-3">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Username" />
            </div>

            <div class="input-group mb-3">
                <input type="password" class="form-control" placeholder="Password" aria-label="Recipient's username" aria-describedby="basic-addon2" />
            </div>


            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Name" aria-label="Recipient's username" aria-describedby="basic-addon2" />
            </div>

            <div class="mb-3">
                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Email" />
            </div>

            <div class="mb-3">
                <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Number" />
            </div>

            <button type="button" class="btn btn-primary">Add New Employee</button>
            <br></br>

            <hr></hr>


        </div>

    )
}
export default StaffEmployees;