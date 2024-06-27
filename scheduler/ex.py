import subprocess
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime as dt
from functools import wraps

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_jwt_secret'

db = SQLAlchemy(app)


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

    def __init__(self, name, img, url, price, source):
        self.name = name
        self.url = url
        self.img = img
        self.price = price
        self.source = source


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)


class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(
        'product_result.id'), nullable=False)

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
        return jsonify({'username': user.username, 'token': token})

    return jsonify({'message': 'Invalid username/email or password!'}), 400


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


@app.route('/alerts', methods=['POST'])
@token_required
def add_alert(current_user):
    product_id = request.json.get('product_id')
    alert = Alert(user_id=current_user.id, product_id=product_id)
    db.session.add(alert)
    db.session.commit()

    response = {'message': 'Alert added successfully'}
    return jsonify(response), 200


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