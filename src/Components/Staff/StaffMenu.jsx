import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './StaffMenu.css';
import { useNavigate } from 'react-router-dom';

function StaffMenu() {
    const navigate = useNavigate();

    return (
        <>
            <div onClick={() =>{navigate("/staffinsights")}} class="container insights">
                <center><h1>Insights</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/staffstock")}} class="container stocks">
            <center><h1>Stock</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/staffeditmenu")}} class="container editmenu">
            <center><h1>Edit Menu</h1></center>
            </div>

            <br></br>

            <div onClick={() =>{navigate("/staffemployees")}} class="container employees">
            <center><h1>Employees</h1></center>
            </div>

            <br></br>

            







        </>
    )
}
export default StaffMenu;