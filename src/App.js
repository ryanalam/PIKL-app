import './App.css';
import LogoHeader from './Components/Header/LogoHeader'
import Navbar from './Components/Header/Navbar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';
import { useState } from 'react';

// Client Imports
import ClientLogin from './Components/Client/ClientLogin'
import ClientRegister from './Components/Client/ClientRegister';
import ClientMenu from './Components/Client/ClientMenu';
import ClientDineIn from './Components/Client/ClientDineIn';
import ClientBookATable from './Components/Client/ClientBookATable';
import ClientRequestCar from './Components/Client/ClientRequestCar';
import ClientFoodMenu from './Components/Client/ClientFoodMenu';
import ClientRequestBill from './Components/Client/ClientRequestBill'



//Restaurant Imports
import RestLogin from './Components/Restaurant/RestLogin';
import RestMenu from './Components/Restaurant/RestMenu';
import RestReservations from './Components/Restaurant/RestReservations';
import RestFoodMenu from './Components/Restaurant/RestFoodMenu';
import RestOrders from './Components/Restaurant/RestOrders';

//Kitchen Imports
import KitchenQueue from './Components/Kitchen/KitchenQueue';

//Staff Imports
import StaffInsights from './Components/Staff/StaffInsights';
import StaffMenu from './Components/Staff/StaffMenu';
import StaffStock from './Components/Staff/StaffStock';
import {  getUserToken } from './LocalStorage';
import Protected from './Protected';
import WaiterNotifications from './Components/Client/WaiterNotifications';
import CallWaiterButton from './Components/Client/CallWaiterButton';

function App() {
  const [userToken, setUserToken] = useState(getUserToken());


  function handleUserTokenChange() {
    setUserToken(getUserToken());
  }



  return (

    <>
    <BrowserRouter>
    <div className="App">
      <header>
        <LogoHeader />
        <Navbar onUserTokenChange={handleUserTokenChange}
                
        />
      </header>
    
        <Routes> 
          {/* All client Pages */}

          <Route path='/cwb' element={<CallWaiterButton/>}/>
          <Route path='/wan' element={<WaiterNotifications/>}/>

          <Route path='/clientlogin' element={<ClientLogin/>}/>
          <Route path='/clientregister' element={<ClientRegister />} />
          <Route path='/clientmenu' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientMenu /></Protected>} />
          <Route path='/clientdinein' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientDineIn /></Protected>} />
          <Route path='/clientbookatable' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientBookATable /></Protected>} />
          <Route path='/clientrequestcar' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientRequestCar /></Protected>} />
          <Route path='/clientfoodmenu' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientFoodMenu /></Protected>} />
          <Route path='clientrequestbill' element={<Protected onUserTokenChange={handleUserTokenChange}><ClientRequestBill /></Protected>} />
          
          {/* All Restaurant Pages */}
          <Route path='/restlogin' element={<RestLogin/>}/>
          <Route path='/restmenu' element={<RestMenu/>}/>
          <Route path='/restreservations' element={<RestReservations/>}/>
          <Route path='/restfoodmenu' element={<RestFoodMenu/>}/>
          <Route path='/restorders' element={<RestOrders/>}/>

          
          {/* All Kitchen Pages */}
          <Route path = '/kitchenqueue' element={<KitchenQueue/>}></Route>
          
          {/* All staff Pages */}
          <Route path = '/staffinsights' element={<StaffInsights/>}></Route>
          <Route path = '/staffmenu' element={<StaffMenu/>}></Route>
          <Route path = '/staffstock' element={<StaffStock/>}></Route>





        </Routes>
      </div>
      </BrowserRouter>
      </>

        );
        }
      
        export default App;
