import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function ValetGetCar() {

    return (
        <div className='container-sm' style={{justifyContent:"center", display:"flex"}}>
            <div class="card border-primary" style={{width: "18rem"}}>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Get car #</li>
                    <button className='btn btn-primary'>Done</button>
                    <br></br>
                </ul>
            </div>
        </div>

    )
}
export default ValetGetCar;