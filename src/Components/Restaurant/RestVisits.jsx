import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { getWaiterToken } from '../../LocalStorage';

const SERVER_URL = "http://127.0.0.1:3500";

function RestVisits() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [waiterToken, setWaiterToken] = useState(getWaiterToken());
  

  
  useEffect(() => {
    console.log(waiterToken);
    fetch(`${SERVER_URL}/check_table_availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTables(data.available_tables))
      .catch(error => console.error(error));
  }, []);

  const handleCreateVisit = () => {
    if (!selectedTable) {
      alert('Please select a table');
      return;
    }

    fetch(`${SERVER_URL}/create_visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${waiterToken}`,
      },
      body: JSON.stringify({
        table_id: selectedTable,
      }),
      
    })
      .then(response => {
        if (response.ok) {
          alert('Visit created successfully');
        } else {
          alert('Failed to create visit');
        }
      })
      .catch(error => console.error(error));
  };




  return (
    <div className='container-sm'>
      {tables.length > 0 && (
        <div>
          <select
            className='form-select'
            value={selectedTable}
            onChange={event => setSelectedTable(event.target.value)}
          >
            <option value=''>-- Select Table --</option>
            {tables.map(tableId => (
              <option key={tableId} value={tableId}>{`Table ${tableId}`}</option>
            ))}
          </select>
          <button className='btn btn-primary mt-3' onClick={handleCreateVisit}>
            Create Visit
          </button>
        </div>
      )}
    </div>
  );
}

export default RestVisits;
