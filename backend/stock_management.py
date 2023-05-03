from flask import Blueprint
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


