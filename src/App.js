import './App.css';
import LogoHeader from './Components/Header/LogoHeader'
import Navbar from './Components/Header/Navbar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';

// Client Imports
import ClientLogin from './Components/Client/ClientLogin'
import ClientRegister from './Components/Client/ClientRegister';
import ClientMenu from './Components/Client/ClientMenu';
import ClientDineIn from './Components/Client/ClientDineIn';
import ClientDelivery from './Components/Client/ClientDelivery';
import ClientBookATable from './Components/Client/ClientBookATable';
import ClientRequestCar from './Components/Client/ClientRequestCar';

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


function App() {
  return (

    <>
    <BrowserRouter>
    <div className="App">
      <header>
        <LogoHeader />
        < Navbar />
      </header>
    
        <Routes> 
          {/* All client Pages */}
          <Route path='/clientlogin' element={<ClientLogin />} />
          <Route path='/clientregister' element={<ClientRegister />} />
          <Route path='/clientmenu' element={<ClientMenu />} />
          <Route path='/clientdinein' element={<ClientDineIn />} />
          <Route path='/clientdelivery' element={<ClientDelivery />} />
          <Route path='/clientbookatable' element={<ClientBookATable />} />
          <Route path='/clientrequestcar' element={<ClientRequestCar />} />

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
