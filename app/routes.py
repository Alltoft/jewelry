from app import app, db
from flask import request, jsonify
import logging
from flask_login import current_user, login_user, logout_user, login_required
from .models import User, Product, Order
from datetime import datetime


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify({'message': 'User already logged in'}), 400
    data = request.get_json()
    if not data.get('email') or not data.get('password') or not data.get('user_role') or not data.get('username'):
        return jsonify({'message': 'Missing required date'}), 400
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'message': 'Username already exists'}), 400
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
    login_user(user)
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

@app.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify(current_user.to_dict()), 200

@app.route('/product/<product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product.to_dict()), 200

@app.route('/create-cash-order', methods=['POST'])
def create_cash_order():
    try:
        data = request.get_json()
        amount = data.get('amount')
        customer_details = data.get('customer_details')

        logger.info(f"Received cash order request: Amount={amount}")

        # Validate required fields
        if not amount or not customer_details:
            logger.error("Missing required data in cash order request.")
            return jsonify({'message': 'Missing required data'}), 400
        
        # Store the order in database
        try:
            
            new_order = Order(
                customer_id=current_user.customer.customer_id if current_user.is_authenticated else None,
                order_status='Pending',
                payment_method='cod',
                payment_status='pending',
                total_price=amount,
                created_at=datetime.now()
            )
            db.session.add(new_order)
            db.session.commit()
            logger.info(f"Order {new_order.order_id} created successfully in database")

            if not current_user.is_authenticated and customer_details:
                # If user is not logged in, create a guest order
                new_order.customer_name = customer_details.get('name')
                new_order.customer_email = customer_details.get('email')
                new_order.customer_phone = customer_details.get('phone')
                new_order.customer_address = customer_details.get('address')
                new_order.customer_city = customer_details.get('city')
                new_order.customer_state = customer_details.get('state')
                new_order.customer_zip = customer_details.get('zipCode')
                new_order.customer_country = customer_details.get('country')
                db.session.commit()
                logger.info(f"Guest order {new_order.order_id} created successfully")
            
            # # Send confirmation email to customer
            # if customer_details.get('email'):
            # send_order_confirmation(
            #     customer_details.get('email'),
            #     order_id,
            #     amount,
            #     customer_details
            # )
            # logger.info(f"Confirmation email sent to {customer_details.get('email')}")
            
            # # Notify fulfillment team
            # notify_fulfillment(order_id, customer_details, amount)
            # logger.info(f"Fulfillment team notified about order {order_id}")
        except Exception as e:
            logger.error(f"Error processing order {new_order.order_id}: {str(e)}")
            db.session.rollback()
            raise

        return jsonify({
            'status': 'success',
            'order_id': new_order.order_id,
            'message': 'Cash on delivery order created successfully'
        }), 200

    except Exception as e:
        logger.exception(f"Exception in create_cash_order: {str(e)}")
        return jsonify({'message': 'An error occurred while creating cash order'}), 500


# @app.route('/users/<int:user_id>', methods=['DELETE'])
# def delete_user(user_id):
#     pass

# # Seller routes
# @app.route('/sellers', methods=['GET'])
# def get_sellers():
#     pass

# @app.route('/sellers/<int:seller_id>', methods=['GET'])
# def get_seller(seller_id):
#     pass

# @app.route('/sellers', methods=['POST'])
# def create_seller():
#     pass

# # @app.route('/sellers/<int:seller_id>', methods=['PUT'])
# # def update_seller(seller_id):
# #     pass

# @app.route('/sellers/<int:seller_id>', methods=['DELETE'])
# def delete_seller(seller_id):
#     pass

# # Costumer routes
# @app.route('/costumers', methods=['GET'])
# def get_costumers():
#     pass

# @app.route('/costumers/<int:costumer_id>', methods=['GET'])
# def get_costumer(costumer_id):
#     pass

# @app.route('/costumers', methods=['POST'])
# def create_costumer():
#     pass

# @app.route('/costumers/<int:costumer_id>', methods=['PUT'])
# def update_costumer(costumer_id):
#     pass

# @app.route('/costumers/<int:costumer_id>', methods=['DELETE'])
# def delete_costumer(costumer_id):
#     pass

# # Product routes
# @app.route('/products', methods=['GET'])
# def get_products():
#     pass

# @app.route('/products/<int:product_id>', methods=['GET'])
# def get_product(product_id):
#     pass

# @app.route('/products', methods=['POST'])
# def create_product():
#     pass

# @app.route('/products/<int:product_id>', methods=['PUT'])
# def update_product(product_id):
#     pass

# @app.route('/products/<int:product_id>', methods=['DELETE'])
# def delete_product(product_id):
#     pass

# # Order routes
# @app.route('/orders', methods=['GET'])
# def get_orders():
#     pass

# @app.route('/orders/<int:order_id>', methods=['GET'])
# def get_order(order_id):
#     pass

# @app.route('/orders', methods=['POST'])
# def create_order():
#     pass

# @app.route('/orders/<int:order_id>', methods=['PUT'])
# def update_order(order_id):
#     pass

# @app.route('/orders/<int:order_id>', methods=['DELETE'])
# def delete_order(order_id):
#     pass

# # Wishlist routes
# @app.route('/wishlists', methods=['GET'])
# def get_wishlists():
#     pass

# @app.route('/wishlists/<int:wishlist_id>', methods=['GET'])
# def get_wishlist(wishlist_id):
#     pass

# @app.route('/wishlists', methods=['POST'])
# def create_wishlist():
#     pass

# @app.route('/wishlists/<int:wishlist_id>', methods=['PUT'])
# def update_wishlist(wishlist_id):
#     pass

# @app.route('/wishlists/<int:wishlist_id>', methods=['DELETE'])
# def delete_wishlist(wishlist_id):
#     pass

# # Review routes
# @app.route('/reviews', methods=['GET'])
# def get_reviews():
#     pass

# @app.route('/reviews/<int:review_id>', methods=['GET'])
# def get_review(review_id):
#     pass

# @app.route('/reviews', methods=['POST'])
# def create_review():
#     pass

# @app.route('/reviews/<int:review_id>', methods=['PUT'])
# def update_review(review_id):
#     pass

# @app.route('/reviews/<int:review_id>', methods=['DELETE'])
# def delete_review(review_id):
#     pass

# # PurchaseHistory routes
# @app.route('/purchases', methods=['GET'])
# def get_purchases():
#     pass

# @app.route('/purchases/<int:purchase_id>', methods=['GET'])
# def get_purchase(purchase_id):
#     pass

# @app.route('/purchases', methods=['POST'])
# def create_purchase():
#     pass

# @app.route('/purchases/<int:purchase_id>', methods=['PUT'])
# def update_purchase(purchase_id):
#     pass

# @app.route('/purchases/<int:purchase_id>', methods=['DELETE'])
# def delete_purchase(purchase_id):
#     pass
