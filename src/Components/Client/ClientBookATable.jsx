import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './ClientBookATable.css';

function ClientBookATable() {

    // var radio = document.querySelector('.btn-group');
    // var timeofarrival = document.getElementById('timeofarrival');
    
    // radio.addEventListener('change', function(e) {
    //   if(!e.target.matches('input[type=radio]')) return;
      
    //   timeofarrival.innerText = e.target.value;
    // });


    return (
        <div class="container-sm">
            <h2>Reserve a Table</h2>
            <br></br>

            <div class="form-floating">
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                    <option selected></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>

                </select>
                <label for="floatingSelect">Number of people</label>
            </div>

            <br></br>
            <br></br>

            <h3>AfterNoon</h3>
            
            <h6>Time of arrival:</h6>
            <h6 id="timeofarrival"> </h6>
            <div class="btn-group-sm" role="group" aria-label="Choose time slot">
                <label class="btn btn-outline-primary" for="btnradio1">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="12:00"/>
                        12:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio2">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="12:30"/>
                        12:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio3">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" value="1:00"/>
                        1:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio4">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" value="1:30"/>
                        1:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio5">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off" value="2:00"/>
                        2:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio6">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio6" autocomplete="off" value="2:30"/>
                        2:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio7">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio7" autocomplete="off" value="3:00"/>
                        3:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio8">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio8" autocomplete="off" value="3:30"/>
                        3:30
                </label>

                <label class="btn btn-outline-primary" for="btnradio9">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio9" autocomplete="off" value="4:00"/>
                        4:00
                </label>

                <label class="btn btn-outline-primary" for="btnradio10">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio10" autocomplete="off" value="4:30"/>
                        4:30
                </label>

            </div>


        </div>


    )


}
export default ClientBookATable;
