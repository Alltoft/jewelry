from app import db
from flask_login import UserMixin
import bcrypt
from datetime import datetime
from uuid import uuid4
import sqlalchemy as sa

class User(UserMixin, db.Model):
    user_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    name = db.Column(db.String(64), index=True)
    lastname = db.Column(db.String(64), index=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    user_role = db.Column(sa.Enum('Seller', 'Customer'), index=True)
    phone_number = db.Column(db.String(64), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)
    last_login = db.Column(db.DateTime, index=True)
    seller = db.relationship('Seller', back_populates='user', uselist=False)
    customer = db.relationship('Customer', back_populates='user', uselist=False)
    # admin = db.relationship('Admin', back_populates='user', uselist=False)

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
    
class Customer(db.Model):
    customer_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('user.user_id'), unique=True)
    user = db.relationship('User', back_populates='customer')
    bank_details = db.Column(db.String(64), index=True)
    shipping_address = db.Column(db.String(64), index=True)
    brith_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    phone_number = db.Column(db.String(64), index=True)
    gender = db.Column(sa.Enum('Male', 'Female'), index=True)
    jewelery_preference = db.Column(db.String(64), index=True)
    total_purchases = db.Column(db.Integer, index=True)
    total_spent = db.Column(db.Float, index=True)
    payment_method = db.Column(sa.Enum('Credit Card', 'Debit Card', 'Paypal'), index=True)
    order = db.relationship('Order', back_populates='customer')
    wishlist = db.relationship('Wishlist', back_populates='customer')
    cart = db.relationship('Cart', back_populates='customer')
    review = db.relationship('Review', back_populates='customer')
    # purchase_history = db.relationship('PurchaseHistory', back_populates='customer')
    # total_points = db.Column(db.Integer, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'customer_id': self.customer_id,
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
        return '<Customer {}>'.format(self.user_id)

class ProductImage(db.Model):
    image_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    image = db.Column(db.String(128), nullable=True)
    product = db.relationship('Product', back_populates='images')

class Product(db.Model):
    product_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    seller_id = db.Column(db.String(64), db.ForeignKey('seller.seller_id'))
    seller = db.relationship('Seller', back_populates='products')
    product_name = db.Column(db.String(64), index=True)
    product_description = db.Column(db.String(120), index=True)
    product_price = db.Column(db.Float, index=True)
    product_quantity = db.Column(db.Integer, index=True)
    product_status = db.Column(sa.Enum('Available', 'Unavailable'), index=True)
    product_category = db.Column(sa.Enum('Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Watches', 'Brooches', 'Anklets', 'Cufflinks', 'Pendants', 'Charms'), index=True)
    product_image = db.Column(db.String(40), nullable=False, default='default.jpg')
    images = db.relationship('ProductImage', back_populates='product', cascade='all, delete-orphan')
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
            'images': [image.image for image in self.images],
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Product {}>'.format(self.product_id)

class Cart(db.Model):
    cart_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    customer_id = db.Column(db.String(64), db.ForeignKey('customer.customer_id'))
    customer = db.relationship('Customer', back_populates='cart')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='cart', lazy='joined')
    item_quantity = db.Column(db.Integer, default=1, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'cart_id': self.cart_id,
            'customer_id': self.customer_id,
            'product_id': self.product_id,
            'item_quantity': self.item_quantity,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

    def __repr__(self):
        return '<Cart {}>'.format(self.product_id)

class Order(db.Model):
    order_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    customer_id = db.Column(db.String(64), db.ForeignKey('customer.customer_id'))
    customer = db.relationship('Customer', back_populates='order')
    order_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    order_status = db.Column(sa.Enum('Pending', 'Delivered', 'Cancelled'), default='Pending', index=True)
    total_price = db.Column(db.Float, index=True)
    total_quantity = db.Column(db.Integer, index=True)
    # products = db.relationship('Product', secondary='order_product', backref='orders')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'order_date': self.order_date,
            'order_status': self.order_status,
            'total_price': self.total_price,
            'total_quantity': self.total_quantity,
            'shipping_address': self.shipping_address,
            'payment_method': self.payment_method,
            'bank_details': self.bank_details,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }

    def __repr__(self):
        return '<Order {}>'.format(self.order_id)

class Wishlist(db.Model):
    wishlist_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    customer_id = db.Column(db.String(64), db.ForeignKey('customer.customer_id'))
    customer = db.relationship('Customer', back_populates='wishlist')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='wishlist', lazy='joined')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'wishlist_id': self.wishlist_id,
            'customer_id': self.customer_id,
            'product_id': self.product_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

    def __repr__(self):
        return '<Wishlist {}>'.format(self.product_id)
    
class Review(db.Model):
    review_id = db.Column(db.String(64), default=lambda: str(uuid4()), primary_key=True)
    customer_id = db.Column(db.String(64), db.ForeignKey('customer.customer_id'))
    customer = db.relationship('Customer', back_populates='review', lazy='joined')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='review', lazy='joined')
    review_text = db.Column(db.String(280), index=True)
    review_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    review_rating = db.Column(db.Integer, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'review_id': self.review_id,
            'customer_id': self.customer_id,
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
    customer_id = db.Column(db.String(64), db.ForeignKey('customer.customer_id'))
    customer = db.relationship('Customer', backref='purchase', lazy='joined')
    product_id = db.Column(db.String(64), db.ForeignKey('product.product_id'))
    product = db.relationship('Product', backref='purchase', lazy='joined')
    order_id = db.Column(db.String(64), db.ForeignKey('order.order_id'))
    order = db.relationship('Order', backref='purchase', lazy='joined')
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    purchase_quantity = db.Column(db.Integer, index=True)
    purchase_price = db.Column(db.Float, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    deleted_at = db.Column(db.DateTime, index=True)

    def to_dict(self):
        return {
            'purchase_id': self.purchase_id,
            'customer_id': self.customer_id,
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
