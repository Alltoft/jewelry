import os
import secrets
from datetime import datetime
from functools import wraps
from uuid import uuid4

import bcrypt
import sqlalchemy as sa
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_user,
    logout_user,
    login_required,
)
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'

UPLOAD_FOLDER = os.path.join(app.root_path, 'static/images/product_pics')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({'message': 'You must be logged in to access this page.'}), 401
            if current_user.user_role != role:
                return jsonify({'message': 'You do not have permission to access this page.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def is_verified(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'message': 'You must be logged in to access this page.'}), 401
        if not current_user.seller.is_verified:
            return jsonify({'message': 'You must be verified to access this page.'}), 403
        return f(*args, **kwargs)
    return decorated_function


def save_picture(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    final_pic = random_hex + f_ext
    picture_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], final_pic)
    file.save(picture_path)
    return final_pic


def delete_picture(picture):
    picture_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], picture)
    os.remove(picture_path)
    return True


class User(UserMixin, db.Model):
    user_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    name = db.Column(db.String(64), index=True)
    lastname = db.Column(db.String(64), index=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    user_role = db.Column(sa.Enum('Seller', 'Costumer'), index=True)
    phone_number = db.Column(db.String(64), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)
    last_login = db.Column(db.DateTime, index=True)
    seller = db.relationship('Seller', back_populates='user', uselist=False)
    costumer = db.relationship('Costumer', back_populates='user', uselist=False)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def get_id(self):
        return self.user_id

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'lastname': self.lastname,
            'username': self.username,
            'email': self.email,
            'user_role': self.user_role,
            'phone_number': self.phone_number,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at,
            'last_login': self.last_login
        }

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Seller(db.Model):
    seller_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('user.user_id'), unique=True)
    user = db.relationship('User', back_populates='seller')
    store_name = db.Column(db.String(64), index=True)
    address = db.Column(db.String(64), index=True)
    store_description = db.Column(db.String(120), index=True)
    license_number = db.Column(db.String(64), index=True)
    bank_account = db.Column(db.String(64), index=True)
    phone_number = db.Column(db.String(64), index=True)
    seller_status = db.Column(sa.Enum('Active', 'Inactive'), index=True)
    is_verified = db.Column(db.Boolean, default=False, index=True)
    products = db.relationship('Product', back_populates='seller')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'seller_id': self.seller_id,
            'user_id': self.user_id,
            'store_name': self.store_name,
            'address': self.address,
            'store_description': self.store_description,
            'license_number': self.license_number,
            'bank_account': self.bank_account,
            'phone_number': self.phone_number,
            'seller_status': self.seller_status,
            'is_verified': self.is_verified,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Seller {}>'.format(self.store_name)


class Costumer(db.Model):
    costumer_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('user.user_id'), unique=True)
    user = db.relationship('User', back_populates='costumer')
    bank_details = db.Column(db.String(64), index=True)
    shipping_address = db.Column(db.String(64), index=True)
    brith_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    phone_number = db.Column(db.String(64), index=True)
    gender = db.Column(sa.Enum('Male', 'Female'), index=True)
    jewelery_preference = db.Column(db.String(64), index=True)
    total_purchases = db.Column(db.Integer, index=True)
    total_spent = db.Column(db.Float, index=True)
    payment_method = db.Column(sa.Enum('Credit Card', 'Debit Card', 'Paypal'), index=True)
    orders = db.relationship('Order', back_populates='costumer')
    wishlist = db.relationship('Wishlist', back_populates='costumer')
    cart = db.relationship('Cart', back_populates='costumer')
    reviews = db.relationship('Review', back_populates='costumer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'costumer_id': self.costumer_id,
            'user_id': self.user_id,
            'bank_details': self.bank_details,
            'shipping_address': self.shipping_address,
            'brith_date': self.brith_date,
            'phone_number': self.phone_number,
            'gender': self.gender,
            'jewelery_preference': self.jewelery_preference,
            'total_purchases': self.total_purchases,
            'total_spent': self.total_spent,
            'payment_method': self.payment_method,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Costumer {}>'.format(self.user_id)


class Product(db.Model):
    product_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    seller_id = db.Column(db.String(64), db.ForeignKey('seller.seller_id'))
    seller = db.relationship('Seller', back_populates='products')
    product_name = db.Column(db.String(64), index=True)
    product_description = db.Column(db.String(120), index=True)
    product_price = db.Column(db.Float, index=True)
    product_quantity = db.Column(db.Integer, index=True)
    product_status = db.Column(sa.Enum('Available', 'Unavailable'), index=True)
    product_category = db.Column(db.String(64), index=True)
    product_image = db.Column(db.String(40), nullable=False, default='default.jpg')
    product_image_url = db.Column(db.String(128), nullable=False, default='default.jpg')
    product_rating = db.Column(db.Float, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'product_id': self.product_id,
            'seller_id': self.seller_id,
            'product_name': self.product_name,
            'product_description': self.product_description,
            'product_price': self.product_price,
            'product_quantity': self.product_quantity,
            'product_status': self.product_status,
            'product_category': self.product_category,
            'product_image': self.product_image,
            'product_image_url': self.product_image_url,
            'product_rating': self.product_rating,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Product {}>'.format(self.product_id)


class Cart(db.Model):
    cart_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    costumer_id = db.Column(db.String(64), db.ForeignKey('costumer.costumer_id'))
    costumer = db.relationship('Costumer', back_populates='cart')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='cart', lazy='joined')
    item_quantity = db.Column(db.Integer, default=1, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'cart_id': self.cart_id,
            'costumer_id': self.costumer_id,
            'product_id': self.product_id,
            'item_quantity': self.item_quantity,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

    def __repr__(self):
        return '<Cart {}>'.format(self.product_id)


class Order(db.Model):
    order_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    costumer_id = db.Column(db.String(64), db.ForeignKey('costumer.costumer_id'))
    costumer = db.relationship('Costumer', back_populates='orders')
    order_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    order_status = db.Column(sa.Enum('Pending', 'Delivered', 'Cancelled'), default='Pending', index=True)
    total_price = db.Column(db.Float, index=True)
    total_quantity = db.Column(db.Integer, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'costumer_id': self.costumer_id,
            'order_date': self.order_date,
            'order_status': self.order_status,
            'total_price': self.total_price,
            'total_quantity': self.total_quantity,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Order {}>'.format(self.order_id)


class Wishlist(db.Model):
    wishlist_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    costumer_id = db.Column(db.String(64), db.ForeignKey('costumer.costumer_id'))
    costumer = db.relationship('Costumer', back_populates='wishlist')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='wishlist', lazy='joined')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'wishlist_id': self.wishlist_id,
            'costumer_id': self.costumer_id,
            'product_id': self.product_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

    def __repr__(self):
        return '<Wishlist {}>'.format(self.product_id)


class Review(db.Model):
    review_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    costumer_id = db.Column(db.String(64), db.ForeignKey('costumer.costumer_id'))
    costumer = db.relationship('Costumer', back_populates='reviews', lazy='joined')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='reviews', lazy='joined')
    review_text = db.Column(db.String(280), index=True)
    review_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    review_rating = db.Column(db.Integer, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'review_id': self.review_id,
            'costumer_id': self.costumer_id,
            'product_id': self.product_id,
            'review_text': self.review_text,
            'review_date': self.review_date,
            'review_rating': self.review_rating,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Review {}>'.format(self.review_id)


class PurchaseHistory(db.Model):
    purchase_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    costumer_id = db.Column(db.String(64), db.ForeignKey('costumer.costumer_id'))
    costumer = db.relationship('Costumer', backref='purchases', lazy='joined')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='purchases', lazy='joined')
    order_id = db.Column(db.String(64), db.ForeignKey('order.order_id'))
    order = db.relationship('Order', backref='purchases', lazy='joined')
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    purchase_quantity = db.Column(db.Integer, index=True)
    purchase_price = db.Column(db.Float, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'purchase_id': self.purchase_id,
            'costumer_id': self.costumer_id,
            'product_id': self.product_id,
            'order_id': self.order_id,
            'purchase_date': self.purchase_date,
            'purchase_quantity': self.purchase_quantity,
            'purchase_price': self.purchase_price,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Purchase {}>'.format(self.purchase_id)


@app.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify({'message': 'User already logged in'}), 400
    data = request.get_json()
    if not data.get('email') or not data.get('password') or not data.get('user_role') or not data.get('username'):
        return jsonify({'message': 'Missing required data'}), 400
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'message': 'Username already exists'}), 400
    if User.query.filter_by(phone_number=data.get('phone_number')).first():
        return jsonify({'message': 'Phone number already exists'}), 400
    user = User(
        name=data.get('name'),
        lastname=data.get('lastname'),
        email=data.get('email'),
        username=data.get('username'),
        user_role=data.get('user_role').capitalize(),
        phone_number=data.get('phone_number'),
        created_at=datetime.now()
    )
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({'message': 'User already logged in'}), 400
    data = request.get_json()
    if not data.get('username') and not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required data'}), 400
    user = User.query.filter_by(username=data.get('username')).first() or \
        User.query.filter_by(email=data.get('email')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Invalid credentials'}), 400
    user.last_login = datetime.now()
    db.session.commit()
    login_user(user)
    return jsonify({'message': 'User logged in', 'role': user.user_role}), 200


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'User logged out'}), 200


@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(deleted_at=None).all()
    return jsonify([product.to_dict() for product in products]), 200


@app.route('/seller/register', methods=['POST'])
@role_required('Seller')
def register_seller():
    try:
        data = request.get_json()
        if not data.get('bank_account') or not data.get('address') or not data.get('phone_number') and not current_user.phone_number:
            return jsonify({'message': 'Missing required data'}), 400
        seller = Seller(
            user_id=current_user.user_id,
            store_name=data.get('store_name'),
            store_description=data.get('store_description'),
            license_number=data.get('license_number'),
            bank_account=data.get('bank_account'),
            address=data.get('address'),
            phone_number=data.get('phone_number') if data.get('phone_number') else current_user.phone_number,
        )
        db.session.add(seller)
        db.session.commit()
        return jsonify({'message': 'Seller created successfully'}), 201
    except IntegrityError:
        return jsonify({'message': 'Seller already registered'}), 500


@app.route('/seller/verify', methods=['POST'])
@role_required('Seller')
def verify_seller():
    if current_user.seller.is_verified:
        current_user.seller.is_verified = False
        db.session.commit()
        return jsonify({'message': 'Seller unverified successfully'}), 200
    else:
        current_user.seller.is_verified = True
        db.session.commit()
        return jsonify({'message': 'Seller verified successfully'}), 200


@app.route('/seller/update', methods=['PUT'])
@role_required('Seller')
def update_seller():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('phone_number') and data.get('phone_number') == current_user.phone_number:
        return jsonify({'message': 'Phone number already in use'}), 400
    if data.get('phone_number'):
        current_user.phone_number = data.get('phone_number')
    if data.get('address'):
        current_user.seller.address = data.get('address')
    if data.get('store_name'):
        current_user.seller.store_name = data.get('store_name')
    if data.get('store_description'):
        current_user.seller.store_description = data.get('store_description')
    if data.get('license_number'):
        current_user.seller.license_number = data.get('license_number')
    if data.get('bank_account'):
        current_user.seller.bank_account = data.get('bank_account')
    db.session.commit()
    return jsonify({'message': 'Seller updated successfully'}), 200


@app.route('/product/add', methods=['POST'])
@role_required('Seller')
def add_product():
    data = request.get_json()
    if not data.get('name') or not data.get('price'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product(
        seller_id=current_user.seller.seller_id,
        product_name=data.get('name'),
        product_price=data.get('price'),
        product_description=data.get('description'),
        product_quantity=data.get('quantity'),
        product_category=data.get('category'),
        product_status=data.get('status')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Product added successfully', 'product_id': product.product_id}), 201


@app.route('/product/<product_id>/upload_image', methods=['POST'])
@role_required('Seller')
def upload_product_image(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        if product.product_image and product.product_image.split('/')[-1] != 'default.jpg':
            delete_picture(product.product_image)
        product.product_image = save_picture(file)
        product.product_image_url = f"{request.host_url}static/images/product_pics/{product.product_image}"
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully'}), 200
    return jsonify({'message': 'Invalid file type'}), 400


@app.route('/product/update', methods=['PUT'])
@role_required('Seller')
def update_product():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.filter_by(product_id=data.get('product_id')).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('name'):
        product.product_name = data.get('name')
    if data.get('price'):
        product.product_price = data.get('price')
    if data.get('description'):
        product.product_description = data.get('description')
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'}), 200


@app.route('/product/delete', methods=['DELETE'])
@role_required('Seller')
def delete_product():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.filter_by(product_id=data.get('product_id'), deleted_at=None).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    product.deleted_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200


@app.route('/product/seller_all', methods=['GET'])
@role_required('Seller')
def get_seller_products():
    products = Product.query.filter_by(seller_id=current_user.seller.seller_id, deleted_at=None).all()
    return jsonify([product.to_dict() for product in products]), 200


@app.route('/costumer/register', methods=['POST'])
@role_required('Costumer')
def register_costumer():
    try:
        data = request.get_json()
        if not data.get('shipping_address') or not data.get('gender'):
            return jsonify({'message': 'Missing required data'}), 400
        costumer = Costumer(
            user_id=current_user.user_id,
            brith_date=data.get('brith_date'),
            gender=data.get('gender').capitalize(),
            jewelery_preference=data.get('jewelery_preference'),
            shipping_address=data.get('shipping_address'),
            phone_number=data.get('phone_number') if data.get('phone_number') else current_user.phone_number,
        )
        db.session.add(costumer)
        db.session.commit()
        return jsonify({'message': 'Costumer created successfully'}), 201
    except IntegrityError:
        return jsonify({'message': 'Costumer already registered'}), 500


@app.route('/costumer/update', methods=['PUT'])
@role_required('Costumer')
def update_costumer():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('phone_number') and data.get('phone_number') == current_user.phone_number:
        return jsonify({'message': 'Phone number already in use'}), 400
    if data.get('phone_number'):
        current_user.phone_number = data.get('phone_number')
    if data.get('shipping_address'):
        current_user.costumer.shipping_address = data.get('shipping_address')
    if data.get('jewelery_preference'):
        current_user.costumer.jewelery_preference = data.get('jewelery_preference')
    if data.get('gender'):
        current_user.costumer.gender = data.get('gender')
    if data.get('brith_date'):
        current_user.costumer.brith_date = data.get('brith_date')
    db.session.commit()
    return jsonify({'message': 'Costumer updated successfully'}), 200


@app.route('/wishlist/add', methods=['POST'])
@role_required('Costumer')
def add_wishlist():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('product_id') in [item.product_id for item in current_user.costumer.wishlist]:
        return jsonify({'message': 'Product already in wishlist'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    wishlist_item = Wishlist(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id)
    db.session.add(wishlist_item)
    db.session.commit()
    return jsonify({'message': 'Product added to wishlist'}), 200


@app.route('/wishlist/remove', methods=['DELETE'])
@role_required('Costumer')
def remove_wishlist():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('product_id') not in [item.product_id for item in current_user.costumer.wishlist]:
        return jsonify({'message': 'Product not in wishlist'}), 400
    wishlist_item = Wishlist.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id).first()
    db.session.delete(wishlist_item)
    db.session.commit()
    return jsonify({'message': 'Product removed from wishlist'}), 200


@app.route('/wishlist', methods=['GET'])
@role_required('Costumer')
def get_wishlist():
    return jsonify([item.product.to_dict() for item in current_user.costumer.wishlist]), 200


@app.route('/cart', methods=['GET'])
@role_required('Costumer')
def get_cart():
    cart_items = current_user.costumer.cart
    if not cart_items:
        return jsonify({'message': 'Cart is empty'}), 400
    return jsonify([{'product': item.product.to_dict(), 'quantity': item.item_quantity} for item in cart_items]), 200


@app.route('/cart/add', methods=['POST'])
@role_required('Costumer')
def cart_add():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('product_id') in [item.product_id for item in current_user.costumer.cart]:
        return jsonify({'message': 'Product already in cart'}), 400
    cart_item = Cart(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id, item_quantity=data.get('item_quantity', 1))
    db.session.add(cart_item)
    db.session.commit()
    return jsonify({'message': 'Product added to cart'}), 200


@app.route('/cart/remove', methods=['DELETE'])
@role_required('Costumer')
def cart_remove():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('product_id') not in [item.product_id for item in current_user.costumer.cart]:
        return jsonify({'message': 'Product not in cart'}), 400
    cart_item = Cart.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Product removed from cart'}), 200


@app.route('/cart/update', methods=['PUT'])
@role_required('Costumer')
def update_cart():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing required data'}), 400
    if not data.get('product_id') or not data.get('item_quantity'):
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('product_id') not in [item.product_id for item in current_user.costumer.cart]:
        return jsonify({'message': 'Product not in cart'}), 400
    cart_item = Cart.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    cart_item.item_quantity = data.get('item_quantity')
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'}), 200


@app.route('/cart/checkout', methods=['POST'])
@role_required('Costumer')
def checkout():
    if not current_user.costumer.shipping_address:
        return jsonify({'message': 'Missing shipping address'}), 400
    cart_items = current_user.costumer.cart
    if not cart_items:
        return jsonify({'message': 'Cart is empty'}), 400
    total_price = sum(item.product.product_price * item.item_quantity for item in cart_items)
    total_quantity = sum(item.item_quantity for item in cart_items)
    order = Order(
        costumer_id=current_user.costumer.costumer_id,
        total_price=total_price,
        total_quantity=total_quantity
    )
    db.session.add(order)
    for item in cart_items:
        purchase = PurchaseHistory(
            costumer_id=current_user.costumer.costumer_id,
            product_id=item.product.product_id,
            order_id=order.order_id,
            purchase_quantity=item.item_quantity,
            purchase_price=item.product.product_price * item.item_quantity
        )
        db.session.add(purchase)
        item.product.product_quantity -= item.item_quantity
    Cart.query.filter_by(costumer_id=current_user.costumer.costumer_id).delete()
    db.session.commit()
    return jsonify({'message': 'Cart checked out successfully'}), 200


@app.route('/orders', methods=['GET'])
@role_required('Costumer')
def get_orders():
    orders = current_user.costumer.orders
    if not orders:
        return jsonify({'message': 'No orders found'}), 400
    return jsonify([order.to_dict() for order in orders]), 200


@app.route('/order/cancel', methods=['DELETE'])
@role_required('Costumer')
def cancel_order():
    data = request.get_json()
    if not data.get('order_id'):
        return jsonify({'message': 'Missing required data'}), 400
    order = Order.query.filter_by(order_id=data.get('order_id'), costumer_id=current_user.costumer.costumer_id).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    order.order_status = 'Cancelled'
    db.session.commit()
    return jsonify({'message': 'Order cancelled successfully'}), 200


@app.route('/review/add', methods=['POST'])
@role_required('Costumer')
def add_review():
    data = request.get_json()
    if not data.get('product_id') or not data.get('rating') or not data.get('review'):
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('product_id') in [review.product_id for review in current_user.costumer.reviews]:
        return jsonify({'message': 'You have already reviewed the product, please use update to modify your review'}), 400
    review = Review(
        costumer_id=current_user.costumer.costumer_id,
        product_id=data.get('product_id'),
        review_rating=data.get('rating'),
        review_text=data.get('review')
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added successfully'}), 201


@app.route('/review/update', methods=['PUT'])
@role_required('Costumer')
def update_review():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    review = Review.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    review.review_rating = data.get('rating')
    review.review_text = data.get('review')
    db.session.commit()
    return jsonify({'message': 'Review updated successfully'}), 200


@app.route('/review/remove', methods=['DELETE'])
@role_required('Costumer')
def remove_review():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    review = Review.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review removed successfully'}), 200


@app.route('/review', methods=['GET'])
@role_required('Costumer')
def get_reviews():
    reviews = current_user.costumer.reviews
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 400
    return jsonify([review.to_dict() for review in reviews]), 200


@app.route('/purchase_history', methods=['GET'])
@role_required('Costumer')
def get_purchase_history():
    purchase_history = current_user.costumer.purchases
    if not purchase_history:
        return jsonify({'message': 'No purchase history found'}), 400
    return jsonify([purchase.to_dict() for purchase in purchase_history]), 200


if __name__ == '__main__':
    app.run(debug=True)
