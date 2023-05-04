from flask import Blueprint
from sqlalchemy import distinct
from app import *
from app import Ingredient, db

stock_management = Blueprint('stock_management', __name__)



@stock_management.route('/add_ingredient', methods=['POST'])
def add_ingredient():
    name = request.json['name']
    supplier_id = request.json['supplier_id']
    unit_price = request.json['unit_price']
    stock = request.json['stock']
    
    ingredient = Ingredient(name=name, supplier_id=supplier_id, unit_price=unit_price, stock=stock)
    db.session.add(ingredient)
    db.session.commit()
    
    return jsonify({'message': 'Ingredient added successfully'})


@stock_management.route('/ingredients/<int:ingredient_id>', methods=['PUT'])
def edit_ingredient(ingredient_id):
    ingredient = Ingredient.query.get_or_404(ingredient_id)

    data = request.get_json()
    ingredient.name = data.get('name', ingredient.name)
    ingredient.supplier_id = data.get('supplier_id', ingredient.supplier_id)
    ingredient.unit_price = data.get('unit_price', ingredient.unit_price)
    ingredient.stock = data.get('stock', ingredient.stock)

    db.session.commit()
    return jsonify({'message': 'Ingredient updated successfully.'})




@stock_management.route('/delete_ingredient/<int:ingredient_id>', methods=['POST'])
def delete_ingredient(ingredient_id):
    ingredient = Ingredient.query.get_or_404(ingredient_id)
    db.session.delete(ingredient)
    db.session.commit()
    
    return jsonify({'message': 'Ingredient deleted successfully.'})

@app.route('/get_stock_levels', methods=['GET'])
def get_stock_levels():
    # Retrieve the stock levels from the database using SQLAlchemy
    stock_levels = StockFact.query.all()

    # Convert the stock levels to a dictionary format
    stock_levels_dict = []
    for level in stock_levels:
        ingredient = Ingredient.query.filter_by(id = level.ingredient_id ).first()
        
        
        stock_level_dict = {
            'date_id': level.date_id,
            'item_id': level.item_id,
            'ingredient_id': level.ingredient_id,
            'stock_level':int(((level.stock_level)/500)*100),
            'usage_quantity': level.usage_quantity,
            'percentage': level.stock_level,
            'ingredient_name': ingredient.name
        }
        stock_levels_dict.append(stock_level_dict)

    # Return the stock levels as JSON
    return jsonify(stock_levels_dict)


@app.route('/add_stock', methods =['PUT'])
def add_stock():
    
    ingredient_name = request.json['ingredient_name']
    add_input = request.json['stock_input']
    
    ingredient = Ingredient.query.filter_by(name = ingredient_name).first()
    
    
    stock = StockFact.query.filter_by(ingredient_id = ingredient.id).first()
    
    stock.stock_level = stock.stock_level + add_input
    
    db.session.commit()
    
    
    return jsonify({'message': 'Stock updated successfully.'}), 200

def create_result_dict(keys, values):
    return {key: value for key, value in zip(keys, values)}

@app.route('/analytics', methods=['GET'])
def customer_analytics():
    try:
        # Get the number of top customers to display
        n = request.args.get('n', 10, type=int)
        
        # Validate input
        if n < 1:
            raise ValueError("Invalid value for 'n'. It should be a positive integer.")

        # Top customers by amount spent
        top_customers_by_amount_spent = db.session.query(
            Customer.name, func.sum(Payment.amount)
        ).join(Payment, Customer.id == Payment.customer_id).group_by(
            Customer.name
        ).order_by(
            func.sum(Payment.amount).desc()
        ).limit(n).all()

        # Top customers by number of orders
        # top_customers_by_order_count = db.session.query(
        #     Customer.name, func.count(Orders.customer_id)
        # ).join(Orders).group_by(
        #     Customer.name
        # ).order_by(
        #     func.count(Orders.customer_id).desc()
        # ).limit(n).all()
        top_customers_by_order_count = db.session.query(
        Customer.name, func.count(distinct(Orders.id))
        ).join(Orders).group_by(
            Customer.name
        ).order_by(
            func.count(distinct(Orders.id)).desc()
        ).limit(n).all()

        # Top customers by number of reservations
        top_customers_by_reservation_count = db.session.query(
            Customer.name, func.count(Reservation.customer_id)
        ).join(Reservation).group_by(
            Customer.name
        ).order_by(
            func.count(Reservation.customer_id).desc()
        ).limit(n).all()

        # Average amount spent per customer
        avg_amount_spent_per_customer = db.session.query(func.avg(Payment.amount)).scalar()

        # Average number of orders per customer
        subquery_orders = db.session.query(func.count(distinct(Orders.id))).\
                        join(Customer).group_by(Customer.id).subquery()
        avg_orders_per_customer = db.session.query(func.avg(subquery_orders)).scalar()


        # Average number of reservations per customer
        subquery_reservations = db.session.query(func.count(Reservation.customer_id)).\
                                join(Customer).group_by(Customer.id).subquery()
        avg_reservations_per_customer = db.session.query(func.avg(subquery_reservations)).scalar()

        # Most popular items by sales
        most_popular_items_by_sales = db.session.query(Item.name, func.sum(Item.price * Orders.quantity)).\
            join(Orders).group_by(Item.name).order_by(func.sum(Item.price * Orders.quantity).desc()).limit(n).all()

        # Most popular items by quantity
        most_popular_items_by_quantity = db.session.query(Item.name, func.sum(Orders.quantity)).\
            join(Orders).group_by(Item.name).order_by(func.sum(Orders.quantity).desc()).limit(n).all()

        # Sales by day
        sales_by_day = db.session.query(Date.date, func.sum(Payment.amount)).\
            select_from(Payment).join(Date, Payment.date == Date.date).\
            group_by(Date.date).order_by(Date.date).all()

        # Top waiters by number of orders taken
        top_waiters_by_orders = db.session.query(Waiter.name, func.count(distinct(Orders.id))).\
                join(Orders).group_by(Waiter.name).order_by(func.count(distinct(Orders.id)).desc()).limit(n).all()

        results = {
            'top_customers_by_amount_spent': [create_result_dict(['name', 'amount_spent'], row) for row in top_customers_by_amount_spent],
            'top_customers_by_order_count': [create_result_dict(['name', 'order_count'], row) for row in top_customers_by_order_count],
            'top_customers_by_reservation_count': [create_result_dict(['name', 'reservation_count'], row) for row in top_customers_by_reservation_count],
            'average_amount_spent_per_customer': avg_amount_spent_per_customer,
            'average_orders_per_customer': avg_orders_per_customer,
            'average_reservations_per_customer': avg_reservations_per_customer,
            'most_popular_items_by_sales': [create_result_dict(['name', 'sales'], row) for row in most_popular_items_by_sales],
            'most_popular_items_by_quantity': [create_result_dict(['name', 'quantity'], row) for row in most_popular_items_by_quantity],
            'sales_by_day': [create_result_dict(['date', 'sales'], (date.isoformat(), sales)) for date, sales in sales_by_day],
            'top_waiters_by_orders': [create_result_dict(['name', 'order_count'], row) for row in top_waiters_by_orders],
            # Additional analytics results
            }
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


