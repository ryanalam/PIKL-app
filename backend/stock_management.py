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


