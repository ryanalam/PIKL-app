import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';


var SERVER_URL = "http://127.0.0.1:3500";

function RestVisits() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // fetch menu items from backend and set state
    fetch(`${SERVER_URL}/check_table_availability`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then((response) => response.json())
      .then((data) => setTables(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className='container-sm'>
      {tables.length > 0 && (
        <select className='form-select'>
          <option value=''>-- Select Table --</option>
          {tables.map(tableId => (
            <option key={tableId} value={tableId}>{`Table ${tableId}`}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default RestVisits;
