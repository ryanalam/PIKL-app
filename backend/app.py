import time
from flask import Flask, jsonify, request,make_response, url_for, redirect
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from itsdangerous import SignatureExpired,URLSafeTimedSerializer


from jwt.exceptions import InvalidTokenError

# from flask_jwt_extended.utils import extract_auth_token
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import datetime
from dateutil import parser as dateparser
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_mail import Mail, Message



app = Flask(__name__)

app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:rootroot@127.0.0.1:3306/RMSDB'


app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app,resources={r"/*":{"origins":"*"}})
ma = Marshmallow(app)

# Set up SQLAlchemy

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.app_context().push()

# Define the customer model
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(600), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)

class CustomerSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "username",
            "name",
            "email",
            "phone",
        )  # hashed password not returned for security purposes
    model = Customer
    
customer_schema = CustomerSchema()


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True, nullable=False)
    waiter_id = db.Column(db.Integer, db.ForeignKey('waiter.id'), nullable=True)
    date_id = db.Column(db.Integer, db.ForeignKey('date.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=True)
    image_path = db.Column(db.String(1000), nullable=True)
    filters = db.Column(db.String(50), nullable=True)
    
    

class Waiter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(50), unique=True, nullable=False)
    password=db.Column(db.String(600), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)


class Date(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)

class Tables(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number=db.Column(db.Integer, nullable=False)
    capacity=db.Column(db.Integer, nullable=False)
    status=db.Column(db.Boolean, nullable=False)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    contact_person = db.Column(db.String(50), nullable=False)
    
    

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    number_of_people = db.Column(db.Integer, nullable=False)
    customer_name = db.Column(db.String(50), nullable=True)
    
    def __init__(self, customer_id, table_id, start_time, end_time, number_of_people, customer_name):
        super(Reservation, self).__init__(
           
            customer_id=customer_id,
            table_id=table_id,
            start_time=start_time,
            end_time=end_time,
            number_of_people=number_of_people,
            customer_name=customer_name
        ) 
    

    
class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False)
    date_id = db.Column(db.Integer, db.ForeignKey('date.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


   
class StockFact(db.Model):
    date_id = db.Column(db.Integer, db.ForeignKey('date.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False,primary_key=True)
    ingredient_id= db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False,primary_key=True)
    stock_level = db.Column(db.Integer, nullable=False)
    usage_quantity = db.Column(db.Integer, nullable=False)
    

class item_ingredient(db.Model):
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False,primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False,primary_key=True)
    required_quantity = db.Column(db.Float, nullable=False)

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(50), unique=True, nullable=False)
    password=db.Column(db.String(600), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.Float, nullable=True)
    date_joined = db.Column(db.Date, nullable=True)
    date_left = db.Column(db.Date, nullable=True)
    
    def __init__(self, username, password, name, email, phone, role, salary, date_joined, date_left):
        super(staff, self).__init__(
            username=username,
            password=password,
            name=name,
            email=email,
            phone=phone,
            role=role,
            salary=salary,
            date_joined=date_joined,
            date_left=date_left
        )

class Notif(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
     customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
     time = db.Column(db.DateTime, nullable=False)
     
class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    waiter_id = db.Column(db.Integer, db.ForeignKey('waiter.id'), nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    
    


app.app_context().push()

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "piklauth@gmail.com"
app.config["MAIL_PASSWORD"] = "rhwmgdajvwsqhqaw"
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
mail = Mail(app)
s = URLSafeTimedSerializer("Thisisasecret!")

dict = {}



#APIS

# Customer signup endpoint
# @app.route('/customer_signup', methods=['POST'])
# def customer_signup():
#     username=request.json['username']
#     password=request.json['password']
#     name=request.json['name']
#     email=request.json['email']
#     phone=request.json['phone']
    
#     if not username or not password or not name or not email or not phone:
#        return jsonify({'message': 'Please fill in all fields'}), 400
#     customer = Customer.query.filter_by(username=username).first()
#     if customer:
#       return jsonify({'message': 'Username already exists'}), 400
#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#     new_customer = Customer(username=username, password=hashed_password, name=name, email=email, phone=phone)
#     db.session.add(new_customer)
#     db.session.commit()
#     access_token = create_access_token(identity=username)
#     return jsonify({'access_token': access_token}), 201

if __name__ == '__main__':
    
    app.run(debug=True)
    
@app.route('/customer_login', methods=['POST'])
def customer_login():
    username=request.json['username']
    password=request.json['password']
    customer = Customer.query.filter_by(username=username).first()
    
    if not customer:
      return jsonify({'message': 'Invalid username or password'}), 400
    
    if bcrypt.check_password_hash(customer.password, password):
      access_token = create_access_token(identity=customer.id)
      return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid username or password'}), 400

@app.route('/waiter_signup', methods=['POST'])
def waiter_signup():
    username=request.json['username']
    password=request.json['password']
    name=request.json['name']
    email=request.json['email']
    phone=request.json['phone']
    
    if not username or not password or not name or not email or not phone:
       return jsonify({'message': 'Please fill in all fields'}), 400
    waiter = Waiter.query.filter_by(username=username).first()
    if waiter:
      return jsonify({'message': 'Username already exists'}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_waiter = Waiter(username=username, password=hashed_password, name=name, email=email, phone=phone)
    db.session.add(new_waiter)
    db.session.commit()
    access_token = create_access_token(identity=new_waiter.id)
    return jsonify({'access_token': access_token}), 201

if __name__ == '__main__':
    app.run(debug=True)
    
@app.route('/waiter_login', methods=['POST'])
def waiter_login():
    username=request.json['username']
    password=request.json['password']
    waiter = Waiter.query.filter_by(username=username).first()
    
    if not waiter:
        return jsonify({'message': 'Invalid username or password'}), 400

    if bcrypt.check_password_hash(waiter.password, password):
      access_token = create_access_token(identity=waiter.id)
      return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid username or password'}), 400

# @app.route('/new_reservation', methods=['POST'])
# def new_reservation():
#     table_id=request.json['table_id']
#     start=request.json['start_time']
#     start_time=dateparser.parse(start)
#     end_time=start_time+datetime.timedelta(hours=2)
#     number_of_people=request.json['number_of_people']
    
#     reservation = Reservation(None, table_id, start_time, end_time, number_of_people)
    
#     token = extract_auth_token(request)
#     if token != None:
#         try:
#             userid = decode_token(token)
#         except jwt.ExpiredSignatureError as error:
#             abort(403)
#         except jwt.InvalidTokenError as error:
#             abort(403)
#         reservation.customer_id = userid

    
#     if not customer_id or not table_id or not start_time or not end_time or not number_of_people:
#        return jsonify({'message': 'Please fill in all fields'}), 400
#     if table_status == 1:
#       return jsonify({'message': 'Table is already reserved'}), 400
#     new_reservation = Reservation(customer_id=customer_id, table_id=table_id, date_id=date_id, number_of_people=number_of_people)
#     db.session.add(new_reservation)
#     db.session.commit()
#     return jsonify({'message': 'Reservation created successfully'}), 201



# @app.route('/new_reservation_app', methods=['POST'])
# def new_reservation_app():
#     table_id=request.json['table_id']
#     start=request.json['start_time']
#     start_time=dateparser.parse(start)
#     end_time=start_time+datetime.timedelta(hours=2)
#     number_of_people=request.json['number_of_people']
    
#     reservation = Reservation(None, table_id, start_time, end_time, number_of_people, None)
    
    
#     token = request.headers.get('Authorization').split(' ')[1]
#     # if token:
#     #     try:
#     #         userid = decode_token(token)
#     #     # except jwt.ExpiredSignatureError as error:
#     #     #     abort(403)
#     #     except jwt.InvalidTokenError as error:
#     #         abort(403)
#     #     reservation.customer_id = userid
    
#     if token:
#         userid = decode_token(token)
#         reservation.customer_id = userid['sub']

#     #customer_id or not
#     if not table_id or not start_time or not end_time or not number_of_people:
#        return jsonify({'message': 'Please fill in all fields'}), 400
   
#         # Check if table is available during the reservation time
#     table = Tables.query.get(table_id)
#     # if not table.is_available:
#     #     return jsonify({'message': 'Table is not available.'}), 400
#     overlapping_reservations = Reservation.query.filter(
#         Reservation.table_id == table_id,
#         Reservation.start_time < end_time,
#         Reservation.end_time > start_time
#     ).all()
#     if overlapping_reservations:
#         return jsonify({'message': 'Table is already reserved during this time.'}), 400
 
#     new_reservation = Reservation(customer_id=reservation.customer_id, table_id=table_id,number_of_people=number_of_people, start_time=start_time, end_time=end_time)
#     db.session.add(new_reservation)
#     db.session.commit()
#     return jsonify({'message': 'Reservation created successfully'}), 201




#add new item
@app.route('/add_new_item', methods=['POST'])
def new_menu_item():
    name=request.json['name']
    description=request.json['description']
    price=request.json['price']
    calories=request.json['calories']
    category=request.json['category']

    if not name or not description or not price or not calories or not category:
       return jsonify({'message': 'Please fill in all fields'}), 400
   
    new_item = Item(name=name, description=description, price=price, calories=calories, category=category)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item created successfully'}), 201


#edit item
@app.route('/edit_item/<item_id>', methods=['PUT'])
def edit_menu_item(item_id):
    name=request.json['name']
    description=request.json['description']
    price=request.json['price']
    calories=request.json['calories']
    category=request.json['category']

    item = Item.query.get(item_id)
    item.name = name
    item.description = description
    item.price = price
    item.calories = calories
    item.category = category
    db.session.commit()
    return jsonify({'message': 'Item updated successfully'}), 201

#delete item
@app.route('/delete_item/<item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    item = Item.query.get(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'}), 201


#add new table
@app.route('/add_new_table', methods=['POST'])
def new_table():
    number=request.json['number']
    capacity=request.json['capacity']
    status=0

    if not number or not capacity:
       return jsonify({'message': 'Please fill in all fields'}), 400
   
    new_table = Tables(number=number, capacity=capacity, status=status)
    db.session.add(new_table)
    db.session.commit()
    return jsonify({'message': 'Table created successfully'}), 201

    
#edit table
@app.route('/edit_table/<table_id>', methods=['PUT'])
def edit_table(table_id):
    
    number=request.json['number']
    capacity=request.json['capacity']

    table = Tables.query.get(table_id)
    table.number = number
    table.capacity = capacity
    
    db.session.commit()
    return jsonify({'message': 'Table updated successfully'}), 201


#delete table
@app.route('/delete_table/<table_id>', methods=['DELETE'])  
def delete_table(table_id):
    
    table = Tables.query.get(table_id)
    db.session.delete(table)
    db.session.commit()
    return jsonify({'message': 'Table deleted successfully'}), 201


@app.route('/new_reservation_app', methods=['POST'])
def new_reservation_app():
    table_id=request.json['table_id']
    start=request.json['start_time']
    start_time=dateparser.parse(start)
    end_time=start_time+datetime.timedelta(hours=2)
    number_of_people=request.json['number_of_people']
    
    reservation = Reservation(None, table_id, start_time, end_time, number_of_people, None)
   
    try:
        token = request.headers.get('Authorization').split(' ')[1]
    
        if token:
            userid = decode_token(token)
            reservation.customer_id = userid['sub']
            reservation.customer_name = Customer.query.get(userid['sub']).name
    except:
        return jsonify({'message': 'Please login'}), 400

    #customer_id or not
    if not table_id or not start_time or not end_time or not number_of_people:
       return jsonify({'message': 'Please fill in all fields'}), 400
   
        # Check if table is available during the reservation time
    table = Tables.query.get(table_id)

    overlapping_reservations = Reservation.query.filter(
        Reservation.table_id == table_id,
        Reservation.start_time < end_time,
        Reservation.end_time > start_time
    ).all()
    if overlapping_reservations:
        return jsonify({'message': 'Table is already reserved during this time.'}), 400
    
    if table.capacity < number_of_people:
        return jsonify({'message': 'Table is not big enough for this number of people.'}), 400
 
    new_reservation = Reservation(customer_id=reservation.customer_id, table_id=table_id,number_of_people=number_of_people, start_time=start_time, end_time=end_time, customer_name=reservation.customer_name)
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation created successfully'}), 201




@app.route('/new_reservation_phone', methods=['POST'])
def new_reservation_phone():
    table_id=request.json['table_id']
    start=request.json['start_time']
    start_time=dateparser.parse(start)
    end_time=start_time+datetime.timedelta(hours=2)
    number_of_people=request.json['number_of_people']
    customer_name = request.json['customer_name']
    
    reservation = Reservation(None, table_id, start_time, end_time, number_of_people, customer_name)
   
    
    #customer_id or not
    if not table_id or not start_time or not end_time or not number_of_people:
       return jsonify({'message': 'Please fill in all fields'}), 400
   
        # Check if table is available during the reservation time
    table = Tables.query.get(table_id)

    overlapping_reservations = Reservation.query.filter(
        Reservation.table_id == table_id,
        Reservation.start_time < end_time,
        Reservation.end_time > start_time
    ).all()
    if overlapping_reservations:
        return jsonify({'message': 'Table is already reserved during this time.'}), 400
    
    if table.capacity < number_of_people:
        return jsonify({'message': 'Table is not big enough for this number of people.'}), 400
 
    new_reservation = Reservation(customer_id=reservation.customer_id, table_id=table_id,number_of_people=number_of_people, start_time=start_time, end_time=end_time, customer_name=reservation.customer_name)
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation created successfully'}), 201








def confirm_token(token):
    try:
        email = s.loads(token, salt="email-confirm", max_age=3600)
    except SignatureExpired:
        return False
    return email






@app.route('/customer_signup', methods=['POST'])
def customer_signup():
    username=request.json['username']
    password=request.json['password']
    name=request.json['name']
    email=request.json['email']
    phone=request.json['phone']
    
    if not username or not password or not name or not email or not phone:
       return jsonify({'message': 'Please fill in all fields'}), 400
    customer = Customer.query.filter_by(username=username).first()
    if customer:
      return jsonify({'message': 'Username already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    token = s.dumps(email, salt="email-confirm")
    msg = Message("Confirm Email", sender="piklauth@gmail.com", recipients=[email])
    link = url_for("confirm_email", token=token, _external=True)
    msg.body = "Your link to confirm your account is {}".format(link)
    mail.send(msg)

    helper(token, username, hashed_password, name, email, phone)

    return jsonify({'message': 'Confirmation email sent. Please check your inbox.'}), 200





def helper(token, username, password, name, email, phone):
    print("1")
    # confirmed = False
    # while not confirmed:
    #     confirmed = confirm_token(token)
    while dict[token] != True:
        None
    print("2")
    customer = Customer(username=username, password=password, name=name, email=email, phone=phone)
    db.session.add(customer)
    db.session.commit()


@app.route("/confirm_email/<token>")
def confirm_email(token):
    # confirmed = confirm_token(token)
    # if confirmed:
    #     helper2()
    #     return jsonify({'access_token': token}), 200
    # else:
    #     return "<h1>The token is expired or invalid!</h1>"
    try:
        email = s.loads(token, salt="email-confirm", max_age=3600)
    except SignatureExpired:
        return "<h1>The token is expired or invalid.</h1>"

    dict[token] = True

    response = make_response(jsonify({'access_token': token}))
    response.headers['Location'] = "http://localhost:3000/clientmenu"
    response.status_code = 302
    return response
    

def helper2():
    return redirect("http://localhost:3000/clientmenu")






# table_calls = []

# @app.route('/call_waiter', methods=['POST'])
# def call_waiter():
#     table_number = request.json['tableNumber']
#     table_calls.append(table_number)
#     return '', 204



# @app.route('/waiter_notifications', methods=['POST'])
# def waiter_notifications():
#     table_number = request.json.get('tableNumber')
#     if table_number is not None and table_number not in table_calls:
#         table_calls.append(table_number)
#     return {}

# @app.route('/waiter_notifications', methods=['GET'])
# def get_waiter_notifications():
#     for call in table_calls:
#         print (call)
#     while not table_calls:
#         time.sleep(1)
#     table_number = table_calls.pop(0)
#     return {'tableNumber': table_number}

 
@app.route('/call_waiter', methods=['POST'])
def call_waiter():
    table_number = request.json['tableNumber']
    new_notif = Notif(table_id=table_number, customer_id=1, time=datetime.now())
    db.session.add(new_notif)
    db.session.commit()
    return '', 204


@app.route('/waiter_notifications', methods=['POST'])
def waiter_notifications():
    table_number = request.json.get('tableNumber')
    if table_number is not None:
        new_notif = Notif(table_id=table_number, customer_id=1, time=datetime.datetime.now())
        db.session.add(new_notif)
        db.session.commit()
    return {}
 
 
@app.route('/waiter_notifications', methods=['GET'])
def get_waiter_notifications():
    oldest_allowed_time = datetime.datetime.now() - datetime.timedelta(minutes=30)
    notifs = Notif.query.filter(Notif.time > oldest_allowed_time).all()
    if notifs:
        table_number = notifs[0].table_id
        db.session.delete(notifs[0])
        db.session.commit()
        return {'tableNumber': table_number}
    else:
        time.sleep(1)
        return {}







from stock_management import stock_management
from order import order


app.register_blueprint(stock_management)
app.register_blueprint(order)
