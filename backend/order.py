from flask import Blueprint, abort
from sqlalchemy import and_
from app import *

order = Blueprint('order', __name__)

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "sk_test_51N2We6DJArv5SXb4hbWCyVH2tEGG1MrdJhmYcMlwu6CoCfZiE4W081N9JDN4gX7216ehYPBz5ddRmEW7zKgIJgau00eh2kkzJ4"



stripe.PaymentIntent.create(amount=500, currency="gbp", payment_method="pm_card_visa")






from datetime import datetime, date, timedelta

from itertools import groupby

@app.route('/orders', methods=['GET'])
def get_orders():
    now = datetime.now()
    start_date = now.date()
    end_date = start_date + timedelta(days=1)

    orders = db.session.query(
        Orders.id,
        Orders.customer_id,
        Orders.waiter_id,
        Orders.table_id,
        Orders.item_id,
        Orders.quantity,
        Date.date,
        Customer.name.label('customer_name'),
        Waiter.name.label('waiter_name'),
        Item.name.label('item_name'),
    ).join(
        Date, Orders.date_id == Date.id
    ).join(
        Customer, Orders.customer_id == Customer.id, isouter=True
    ).join(
        Waiter, Orders.waiter_id == Waiter.id
    ).join(
        Item, Orders.item_id == Item.id
    ).filter(
        Date.date >= start_date, Date.date < end_date
    ).order_by(
        Orders.id
    ).all()

    order_list = []
    for order_id, group in groupby(orders, lambda x: x.id):
        order_data = {
            'id': order_id,
            'orders': []
        }
        for order in group:
            order_data['customer_id'] = order.customer_id
            order_data['customer_name'] = order.customer_name
            order_data['waiter_id'] = order.waiter_id
            order_data['waiter_name'] = order.waiter_name
            order_data['table_id'] = order.table_id
            order_data['date'] = order.date.strftime('%Y-%m-%d %H:%M:%S')
            order_data['orders'].append({
                'item_id': order.item_id,
                'item_name': order.item_name,
                'quantity': order.quantity,
            })
        order_list.append(order_data)

    return jsonify(order_list)






@app.route('/new_order', methods=['POST'])
def create_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    waiter_id = data.get('waiter_id')
    table_id = data.get('table_id')
    items = data.get('items')
    
    
    if not waiter_id or not  table_id or not items:
        return jsonify({'message': 'Missing parameters'}), 400
    
    # Create a new date record and get its ID
    now = datetime.now()
    date = Date(date=now)
    db.session.add(date)
    db.session.commit()
    date_id = date.id
    
    # Get the next available order ID
    max_order_id = db.session.query(func.max(Orders.id)).scalar() 
    #or0

    #order_increment = Orders.query.filter_by(status=0, customer_id = customer_id).first()
    order_increment = Orders.query.filter_by(customer_id=customer_id, status=0).order_by(Orders.id.desc()).first()


    if(order_increment == None):
        next_id = max_order_id + 1
    else:
        next_id = order_increment.id
    # next_id = max_order_id + 1

    # Iterate through the items and create a new record for each one
    for item in items:
        item_id = item.get('item_id')
        quantity = item.get('quantity')
        if not item_id or not quantity:
            return jsonify({'message': 'Missing item information'}), 400
        
        order_exists = Orders.query.filter_by(id=next_id, item_id=item_id).first()

        if(order_exists != None):
            order_exists.quantity += quantity
        else:
            # Create a new order record with the next available order ID
            order_item = Orders(id=next_id, customer_id=customer_id, waiter_id=waiter_id,  date_id=date_id, table_id=table_id, item_id=item_id, quantity=quantity, status =0)
            db.session.add(order_item)
            print(order_item)
            # Update the stock level for each ingredient in the item
            item_ingredients = item_ingredient.query.filter_by(item_id=item_id).all()
            for combo in item_ingredients:
                ingredient_id = combo.ingredient_id
                required_quantity = combo.required_quantity
                stock_fact = StockFact.query.filter_by(item_id=item_id, ingredient_id=ingredient_id).first()
                if not stock_fact:
                    # If no StockFact record exists for the item and ingredient, create a new one with the current stock level and subtract the usage quantity
                    ingredient = Ingredient.query.get(ingredient_id)
                    stock_fact = StockFact(date_id=date_id, item_id=item_id, ingredient_id=ingredient_id, stock_level=ingredient.stock, usage_quantity=quantity*required_quantity)
                    db.session.add(stock_fact)
                else:
                    # If a StockFact record exists for the item and ingredient, update the stock level by subtracting the usage quantity
                    stock_fact.stock_level -= quantity*required_quantity
        
    db.session.commit()
    
    return jsonify({'message': 'Order created successfully'}), 201

@app.route('/edit_order/<int:order_id>', methods=['PUT'])
def edit_order(order_id):
    data = request.get_json()
    items = data.get('items')
    if not items:
        return jsonify({'message': 'Missing item information'}), 400
    
    # Check if the order exists
    order = Orders.query.filter_by(id=id).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    
    # Update the order items
    for item in items:
        item_id = item.get('item_id')
        quantity = item.get('quantity')
        
        # Check if the item already exists in the order
        order_item = Orders.query.filter_by(id=order_id, item_id=item_id).first()
        
        if quantity == 0: # Remove the item if the quantity is zero
            if order_item:
                # Update the stock levels
                item_ingredients = item_ingredient.query.filter_by(item_id=item_id).all()
                for combo in item_ingredients:
                    ingredient_id = combo.ingredient_id
                    required_quantity = combo.required_quantity
                    stock_fact = StockFact.query.filter_by(item_id=item_id, ingredient_id=ingredient_id).first()
                    if stock_fact:
                        stock_fact.stock_level += order_item.quantity*required_quantity
                db.session.delete(order_item)
        else:
            if order_item: # Update the quantity if the item already exists
                old_quantity = order_item.quantity
                order_item.quantity = quantity
                
                # Update the stock levels
                item_ingredients = item_ingredient.query.filter_by(item_id=item_id).all()
                for combo in item_ingredients:
                    ingredient_id = combo.ingredient_id
                    required_quantity = combo.required_quantity
                    stock_fact = StockFact.query.filter_by(item_id=item_id, ingredient_id=ingredient_id).first()
                    if old_quantity > quantity:
                        if stock_fact:
                            stock_fact.stock_level += (old_quantity - quantity)*required_quantity
                    if stock_fact:
                        stock_fact.stock_level -= (quantity - old_quantity)*required_quantity
            else: # Add a new item if it doesn't exist
                new_order_item = Orders(id=order_id, customer_id=order.customer_id, waiter_id=order.waiter_id, date_id=order.date_id, table_id=order.table_id, item_id=item_id, quantity=quantity)
                db.session.add(new_order_item)
                
                # Update the stock levels
                item_ingredients = item_ingredient.query.filter_by(item_id=item_id).all()
                for combo in item_ingredients:
                    ingredient_id = combo.ingredient_id
                    required_quantity = combo.required_quantity
                    stock_fact = StockFact.query.filter_by(item_id=item_id, ingredient_id=ingredient_id).first()
                    if stock_fact:
                        stock_fact.stock_level -= quantity*required_quantity
    
    db.session.commit()
    
    return jsonify({'message': 'Order updated successfully'}), 200




@app.route('/bill/<int:order_id>', methods=['GET'])
def print_bill(order_id):
    # Join the Date table to the Orders table to get the date information
    order = db.session.query(Orders, Date.date).join(Date).filter(Orders.id == order_id).first()

    # Check if the order exists
    if order is None:
        return jsonify({'error': 'Order not found'}), 404

    # Get the customer information
    customer = Customer.query.filter_by(id=order.Orders.customer_id).first()

    # Get the waiter information
    waiter = Waiter.query.filter_by(id=order.Orders.waiter_id).first()

    # Get the table information
    table = Tables.query.filter_by(id=order.Orders.table_id).first()

    # Get all the items for the order
    items = db.session.query(Orders, Item).join(Item).filter(Orders.id == order_id).all()

    # Calculate the total amount
    total_amount = sum(item.Orders.quantity * item.Item.price for item in items)

    # Create a dictionary to store the bill information
    bill = {
        'order_id': order.Orders.id,
        'date': order.date.strftime('%Y-%m-%d %H:%M:%S'),
        'customer': customer.name,
        'table_number': table.number,
        'waiter': waiter.name,
        'items': [],
        'total_amount': total_amount
    }

    # Add each item to the 'items' list in the bill dictionary
    for item in items:
        item_data = {
            'name': item.Item.name,
            'quantity': item.Orders.quantity,
            'price_per_unit': item.Item.price,
            'total_amount': item.Orders.quantity * item.Item.price
        }
        bill['items'].append(item_data)

    return jsonify(bill)





@app.route('/get_menu_filter', methods=['POST'])
def get_menu_filter():
    # get filter values from request body
    vegetarian = request.json['vegetarian']
    gluten = request.json['gluten']
    dairy = request.json['dairy']
    spicy = request.json['spicy']
    lowcal = request.json['lowcal']


    # construct filter expression
    filter_expr = []
    if vegetarian:
        filter_expr.append(Item.filters.like('%V%'))
    if gluten:
        filter_expr.append(Item.filters.like('%G%'))
    if dairy:
        filter_expr.append(Item.filters.like('%D%'))
    if spicy:
        filter_expr.append(Item.filters.like('%S%'))
    if lowcal:
        filter_expr.append(Item.filters.like('%L%'))

    # combine filter expressions using OR operator
    if filter_expr:
        filter_condition = and_(*filter_expr)
        menu = Item.query.filter(filter_condition).all()
    else:
        menu = Item.query.all()

    # format output data
    menu_list = []
    for item in menu:
        item_data = {
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'description': item.description,
            'calories': item.calories,
            'category': item.category,
            'image_path': item.image_path
        }
        menu_list.append(item_data)

    return jsonify(menu_list)


#vegan V
#gluten G
#spicy S
#vegetarian T
#dairy D
#lowcal L


@app.route('/get_menu', methods=['GET'])
def get_menu():
    menu = Item.query.all()
    menu_list = []
    for item in menu:
        item_data = {
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'description': item.description,
            'calories': item.calories,
            'category': item.category,
            'image_path': item.image_path
        }
        menu_list.append(item_data)
    return jsonify(menu_list)




@app.route('/check_table_availability', methods=['GET'])
def check_table_availability():
    # Get the current time
    now = datetime.now()

    # Calculate the approximate end time for reservations made now
    approx_end_time = now + timedelta(hours=2)

    # Get all reservations that are ongoing, start after the current time or end within the next 2 hours
    reservations = Reservation.query.filter(((Reservation.end_time == None) | (Reservation.end_time > now)) & (Reservation.start_time < approx_end_time)).all()

    # Create a set of occupied table IDs
    occupied_tables = set([r.table_id for r in reservations])

    # Get all tables
    tables = Tables.query.all()

    # Create a list of available table IDs
    available_tables = [t.id for t in tables if t.id not in occupied_tables and t.status == 0]

    return jsonify({'available_tables': available_tables})
 
 
@app.route('/create_visit', methods=['POST'])
def create_visit():
    
    customer_id = request.json.get('customer_id', None)
    table_id = request.json['table_id']
    time = datetime.now()

    table = Tables.query.filter_by(id=table_id).first()
    if table.status == True:
        return jsonify({'message': 'Table is already occupied'}), 400

    try:
        token = request.headers.get('Authorization').split(' ')[1]
    
        if token:
            t = decode_token(token)
            waiter_id = t['sub']
    except:
        return jsonify({'message': 'Please login'}), 400

    visit = Visit(waiter_id=waiter_id, customer_id=customer_id, table_id=table_id, time=time)
    db.session.add(visit)
    db.session.commit()

    # Update table status to True
    table.status = True
    db.session.commit()

    return jsonify({
        'id': visit.id,
        'waiter_id': visit.waiter_id,
        'customer_id': visit.customer_id,
        'table_id': visit.table_id,
        'time': visit.time
    })
    
@app.route('/edit_visit', methods=['PUT'])
def edit_visit():
    table_id = request.json['table_id']
    token = request.headers.get('Authorization').split(' ')[1]
    try:
        if token:
            t = decode_token(token)
            customer_id = t['sub']
            
            # get the visit record with the given table_id
            visit = Visit.query.filter_by(table_id=table_id).first()
            if visit:
                # update the customer_id for the visit
                visit.customer_id = customer_id
                db.session.commit()
                return jsonify({'message': 'Visit updated successfully'})
            else:
                return jsonify({'message': 'Visit not found'}), 404
        else:
            return jsonify({'message': 'Please login'}), 400
    except:
        return jsonify({'message': 'An error occurred'}), 500





@app.route('/pay', methods=['POST'])
def pay():

    try:
        token = request.headers.get('Authorization').split(' ')[1]
    
        if token:
            t = decode_token(token)
            customer_id = t['sub']
    except:
        return jsonify({'message': 'Please login'}), 400

    order_id = request.json['order_id']
    card = request.json['card']
    exp_month = card['exp_month']
    exp_year = card['exp_year']
    cvc = card['cvc']
    card_number = card['number']
    email = db.session.query(Customer.email).filter(Customer.id == customer_id).first()[0]

    order = db.session.query(Orders, Date.date).join(Date).filter(Orders.id == order_id).first()
    items = db.session.query(Orders, Item).join(Item).filter(Orders.id == order_id).all()

    # Calculate the total amount
    total_amount = sum(item.Orders.quantity * item.Item.price for item in items)

    try:
        payment_method = stripe.PaymentMethod.create(
            type='card',
            card={
                'number': card_number,
                'exp_month': exp_month,
                'exp_year': exp_year,
                'cvc': cvc
            }
        )

        intent = stripe.PaymentIntent.create(
            amount=int(total_amount*100),
            currency='usd',
            payment_method=payment_method.id,
            confirm=True,
            receipt_email=email
        )

        payment = Payment(order_id=order_id, amount=total_amount, date=datetime.datetime.now(), customer_id=customer_id, method='card')
        db.session.add(payment)
        db.session.commit()

        return jsonify({"message": "Payment success"}), 200

    except stripe.error.CardError as e:
        error = e.error
        return jsonify({'message': f"Payment failed: {error['message']}"})



@app.route('/get_customer_info', methods=['GET'])
def get_customer_info():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
    
        if token:
            t = decode_token(token)
            customer_id = t['sub']
    except:
        return jsonify({'message': 'Please login'}), 400

    customer = Customer.query.filter_by(id=customer_id).first()

    #query the Visit table by customer id
    visit = Visit.query.filter_by(customer_id=customer_id).first()

    order = Orders.query.filter_by(customer_id=customer_id, status=0).first()

    order_id = order.id if order is not None else None
    visit_id = visit.id if visit is not None else None
    waiter_id = visit.waiter_id if visit is not None else None
    table_id = visit.table_id if visit is not None else None


    response = {
    'id': customer.id,
    'name': customer.name,
    'email': customer.email,
    'phone': customer.phone,
    'visit_id': visit_id,
    'order_id': order_id,
    'waiter_id': waiter_id,
    'table_id': table_id
    }
    return jsonify(response)

@app.route('/delete_order', methods=['DELETE'])
def delete_orders():
    order_id = request.json['order_id']

    orders_to_delete = Orders.query.filter_by(id=order_id).all()

    if not orders_to_delete:
        return jsonify({'message': 'No orders found with the given order_id.'}), 404

    for order in orders_to_delete:
        if order.status == 1:
            return jsonify({'message': 'Orders with status = 1 cannot be deleted.'}), 400
        db.session.delete(order)

    db.session.commit()

    return jsonify({'message': f'All orders with order_id {order_id} have been deleted.'}), 200
