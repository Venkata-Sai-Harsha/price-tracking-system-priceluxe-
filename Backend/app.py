import subprocess
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime as dt
from functools import wraps
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_jwt_secret'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class ProductResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000))
    img = db.Column(db.String(1000))
    url = db.Column(db.String(1000))
    price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    search_text = db.Column(db.String(255))
    source = db.Column(db.String(255))

    def __init__(self, name, img, url, price, search_text, source):
        self.name = name
        self.url = url
        self.img = img
        self.price = price
        self.search_text = search_text
        self.source = source

class TrackedProducts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tracked = db.Column(db.Boolean, default=True)

    def __init__(self, name, tracked=True):
        self.name = name
        self.tracked = tracked

class Deal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000))
    img = db.Column(db.String(1000))
    url = db.Column(db.String(1000))
    price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    source = db.Column(db.String(255))
    change_in_price = db.Column(db.Float, default=0.0)

    def __init__(self, name, img, url, price, source, change_in_price=0.0):
        self.name = name
        self.url = url
        self.img = img
        self.price = price
        self.source = source
        self.change_in_price = change_in_price

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    subscription = db.Column(db.Boolean, default=False)
    full_name = db.Column(db.String(200))

    def __init__(self, username, email, password, full_name='', subscription=False):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.full_name = full_name
        self.subscription = subscription

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product_result.id'), nullable=False)

    def __init__(self, user_id, product_id):
        self.user_id = user_id
        self.product_id = product_id

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists!'}), 400

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode({'id': new_user.id, 'exp': dt.datetime.utcnow() + dt.timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'username': new_user.username, 'token': token})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data['identifier']
    password = data['password']

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and check_password_hash(user.password, password):
        token = jwt.encode({'id': user.id, 'exp': dt.datetime.utcnow() + dt.timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'username': user.username, 'token': token, 'full_name': user.full_name, 'subscription': user.subscription})

    return jsonify({'message': 'Invalid username/email or password!'}), 400

@app.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    full_name = data.get('fullName', current_user.full_name)
    username = data.get('username', current_user.username)
    password = data.get('password', None)

    if User.query.filter(User.username == username, User.id != current_user.id).first():
        return jsonify({'message': 'Username already taken!'}), 400

    current_user.full_name = full_name
    current_user.username = username

    if password:
        current_user.password = generate_password_hash(password)

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'fullName': current_user.full_name,
        'username': current_user.username
    })

@app.route('/toggle-subscription', methods=['PUT'])
@token_required
def toggle_subscription(current_user):
    current_user.subscription = not current_user.subscription
    db.session.commit()
    status = 'activated' if current_user.subscription else 'deactivated'
    return jsonify({'message': f'Subscription {status} successfully', 'subscription': current_user.subscription})

@app.route('/results', methods=['POST'])
def submit_results():
    results = request.json.get('data')
    search_text = request.json.get("search_text")
    source = request.json.get("source")

    for result in results:
        product_result = ProductResult(
            name=result['name'],
            url=result['url'],
            img=result["img"],
            price=result['price'],
            search_text=search_text,
            source=source
        )
        db.session.add(product_result)

        # Check if the product already exists in the Deal table
        existing_deal = Deal.query.filter_by(url=result['url']).first()
        if existing_deal:
            # Update the existing deal with new price and timestamp
            existing_deal.price = result['price']
            existing_deal.created_at = datetime.utcnow()
            existing_deal.change_in_price = result['price'] - existing_deal.price
        else:
            # Add new deal
            new_deal = Deal(
                name=result['name'],
                url=result['url'],
                img=result["img"],
                price=result['price'],
                source=source,
                change_in_price=0.0  # Initial change in price is 0
            )
            db.session.add(new_deal)

    db.session.commit()
    response = {'message': 'Received data successfully'}
    return jsonify(response), 200

@app.route('/unique_search_texts', methods=['GET'])
def get_unique_search_texts():
    unique_search_texts = db.session.query(ProductResult.search_text).distinct().all()
    unique_search_texts = [text[0] for text in unique_search_texts]
    return jsonify(unique_search_texts)

@app.route('/results')
def get_product_results():
    search_text = request.args.get('search_text')
    results = ProductResult.query.filter_by(search_text=search_text).order_by(ProductResult.created_at.desc()).all()

    product_dict = {}
    for result in results:
        url = result.url
        if url not in product_dict:
            product_dict[url] = {
                'name': result.name,
                'url': result.url,
                "img": result.img,
                "source": result.source,
                "created_at": result.created_at,
                'priceHistory': []
            }
        product_dict[url]['priceHistory'].append({
            'price': result.price,
            'date': result.created_at
        })

    formatted_results = list(product_dict.values())

    return jsonify(formatted_results)

@app.route('/all-results', methods=['GET'])
def get_results():
    results = ProductResult.query.all()
    product_results = []
    for result in results:
        product_results.append({
            'name': result.name,
            'url': result.url,
            'price': result.price,
            "img": result.img,
            'date': result.created_at,
            "created_at": result.created_at,
            "search_text": result.search_text,
            "source": result.source
        })

    return jsonify(product_results)

@app.route('/start-scraper', methods=['POST'])
def start_scraper():
    url = request.json.get('url')
    search_text = request.json.get('search_text')

    # Run scraper asynchronously in a separate Python process
    command = f"python ./scraper/__init__.py {url} \"{search_text}\" /results"
    subprocess.Popen(command, shell=True)

    response = {'message': 'Scraper started successfully'}
    return jsonify(response), 200

@app.route('/add-tracked-product', methods=['POST'])
def add_tracked_product():
    name = request.json.get('name')
    tracked_product = TrackedProducts(name=name)
    db.session.add(tracked_product)
    db.session.commit()

    response = {'message': 'Tracked product added successfully', 'id': tracked_product.id}
    return jsonify(response), 200

@app.route('/tracked-product/<int:product_id>', methods=['PUT'])
def toggle_tracked_product(product_id):
    tracked_product = TrackedProducts.query.get(product_id)
    if tracked_product is None:
        response = {'message': 'Tracked product not found'}
        return jsonify(response), 404

    tracked_product.tracked = not tracked_product.tracked
    db.session.commit()

    response = {'message': 'Tracked product toggled successfully'}
    return jsonify(response), 200

@app.route('/tracked-products', methods=['GET'])
def get_tracked_products():
    tracked_products = TrackedProducts.query.all()

    results = []
    for product in tracked_products:
        results.append({
            'id': product.id,
            'name': product.name,
            'created_at': product.created_at,
            'tracked': product.tracked
        })

    return jsonify(results), 200

@app.route("/update-tracked-products", methods=["POST"])
def update_tracked_products():
    products = request.json.get("products")
    product_names = []

    for name in products:
        command = f'python ./scraper/__init__.py "{name}"'
        subprocess.Popen(command, shell=True)
        product_names.append(name)

    response = {'message': 'Scrapers started successfully', "products": product_names}
    return jsonify(response), 200

@app.route('/deals', methods=['POST'])
def submit_deals():
    deals = request.json.get('data')
    source = request.json.get("source")

    for deal in deals:
        new_deal = Deal(
            name=deal['name'],
            url=deal['url'],
            img=deal["img"],
            price=deal['price'],
            source=source
        )
        db.session.add(new_deal)

    db.session.commit()
    response = {'message': 'Received deals successfully'}
    return jsonify(response), 200

@app.route('/deals')
def get_deals():
    source = request.args.get('source')
    deals = Deal.query.filter_by(source=source).order_by(Deal.created_at.desc()).all()

    formatted_deals = []
    for deal in deals:
        formatted_deals.append({
            'name': deal.name,
            'url': deal.url,
            'img': deal.img,
            'price': deal.price,
            'created_at': deal.created_at,
            'source': deal.source
        })

    return jsonify(formatted_deals)

@app.route('/set_alert', methods=['POST'])
@token_required
def set_alert(current_user):
    product_id = request.json.get('product_id')

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    existing_alert = Alert.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing_alert:
        return jsonify({'message': 'Alert already set for this product'}), 400

    alert = Alert(user_id=current_user.id, product_id=product_id)
    db.session.add(alert)
    db.session.commit()

    return jsonify({'message': 'Alert added successfully', 'success': True})

@app.route('/check_alert', methods=['GET'])
@token_required
def check_alert(current_user):
    product_id = request.args.get('product_id')

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    existing_alert = Alert.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    alert_set = bool(existing_alert)

    return jsonify({'alert_set': alert_set})

@app.route('/alerts', methods=['GET'])
@token_required
def get_alerts(current_user):
    alerts = Alert.query.filter_by(user_id=current_user.id).all()

    results = []
    for alert in alerts:
        results.append({
            'id': alert.id,
            'product_id': alert.product_id,
            'user_id': alert.user_id
        })

    return jsonify(results), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
