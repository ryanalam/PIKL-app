import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function StaffInsights() {
    const SERVER_URL = "http://127.0.0.1:3500";
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${SERVER_URL}/analytics`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.log(error));
    }, []);

    if (!data) {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <div className='container-sm text-center'>
                <h3>Top customers by</h3>
                <div class="row">
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Amount Spent:</h5>
                                <p class="card-text">
                                    {data.top_customers_by_amount_spent.map((customer, index) => (
                                        <li key={index}>{customer.name}: {Math.round(customer.amount_spent*100)/100}</li>
                                    ))}

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Order Count:</h5>
                                <p class="card-text">
                                    {data.top_customers_by_order_count.map((customer, index) => (
                                        <li key={index}>{customer.name}: {customer.order_count}</li>
                                    ))}

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Reservation Count:</h5>
                                <p class="card-text">
                                    {data.top_customers_by_reservation_count.map((customer, index) => (
                                        <li key={index}>{customer.name}: {customer.reservation_count}</li>
                                    ))}

                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr></hr>
                <h3>Average </h3>
                <div class="row">
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Spend per Customer:</h5>
                                <p class="card-text">
                                    {Math.round(data.average_amount_spent_per_customer*100)/100}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Orders per Customer:</h5>
                                <p class="card-text">
                                    {data.average_orders_per_customer}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Reservations per Customer:</h5>
                                <p class="card-text">
                                    {data.average_reservations_per_customer}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr></hr>

                </div>
                <h3>Item related insights</h3>
                <div className='row'>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Most Popular Items by Sales:</h5>
                                <p class="card-text">
                                    {data.most_popular_items_by_sales.map((item, index) => (
                                        <li key={index}>{item.name}: {Math.round(item.sales * 100) / 100}</li>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Most Popular Items by Quantity:</h5>
                                <p class="card-text">
                                    {data.most_popular_items_by_quantity.map((item, index) => (
                                        <li key={index}>{item.name}: {Math.round(item.quantity * 100) / 100}</li>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div class="card mb-3" style={{ width: "18rem" }}>
                            <div class="card-body">
                                <h5 class="card-title">Sales by Day:</h5>
                                <p class="card-text">
                                    {data.sales_by_day.map((sale, index) => (
                                        <li key={index}>{sale.date}: {Math.round(sale.sales * 100) / 100}</li>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default StaffInsights;
