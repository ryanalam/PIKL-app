from flask import Blueprint
from app import *

order = Blueprint('order', __name__)



@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Orders.query.all()
    order_list = []
    for order in orders:
        order_data = {
            'id': order.id,
            'customer_id': order.customer_id,
            'waiter_id': order.waiter_id,
            'table_id': order.table_id,
            'date': order.date_id,
            'item_id': order.item_id,
            'quantity': order.quantity
        }
        order_list.append(order_data)
    return jsonify(order_list)


@app.route('/new_order', methods=['POST'])
def create_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    waiter_id = data.get('waiter_id')
    table_id = data.get('table_id')
    items = data.get('items')
    
    if not customer_id or not waiter_id or not  table_id or not items:
        return jsonify({'message': 'Missing parameters'}), 400
    
    # Create a new date record and get its ID
    now = datetime.datetime.now()
    date = Date(date=now)
    db.session.add(date)
    db.session.commit()
    date_id = date.id
    
    # Get the next available order ID
    max_order_id = db.session.query(func.max(Orders.id)).scalar() or 0
    next_id = max_order_id + 1
    
    # Iterate through the items and create a new record for each one
    for item in items:
        item_id = item.get('item_id')
        quantity = item.get('quantity')
        if not item_id or not quantity:
            return jsonify({'message': 'Missing item information'}), 400
        
        # Create a new order record with the next available order ID
        order_item = Orders(id=next_id, customer_id=customer_id, waiter_id=waiter_id,  date_id=date_id, table_id=table_id, item_id=item_id, quantity=quantity)
        db.session.add(order_item)
        
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


# @app.route('/get_menu_filter', methods=['GET'])
# def get_menu_filter():
#     vegan=request.json['vegan']
#     vegetarian=request.json['vegetarian']
#     gluten=request.json['gluten']
#     dairy=request.json['dairy']
#     spicy=request.json['spicy']
#     lowcal=request.json['lowcal']

#     filters = {'gluten': False, 'spicy': False, 'vegetarian': False, 'dairy': False, 'lowcal': False}


#     if gluten:
#         filters['gluten'] = True

#     if spicy:
#         filters['spicy'] = True

#     if vegetarian:
#         filters['vegetarian'] = True

#     if dairy:
#         filters['dairy'] = True

#     if lowcal:
#         filters['lowcal'] = True

#     print(filters)

#     output = ""
#     for key, value in filters.items():
#         if value:
#             output += key[0].upper()
#         else:
#             output += ""

#     print(output)

#     menu = Item.query.filter(output in Item.filters).all()
#     menu_list = []
#     for item in menu:
#         item_data = {
#             'id': item.id,
#             'name': item.name,
#             'price': item.price,
#             'description': item.description,
#             'calories': item.calories,
#             'category': item.category,
#             'image_path': item.image_path
#         }
#         menu_list.append(item_data)
#     return jsonify(menu_list)


from sqlalchemy import or_, and_

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



