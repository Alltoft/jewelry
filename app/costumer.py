from app import app, db
from flask import request, jsonify
from flask_login import current_user
from .models import Costumer, Product, Wishlist, Cart, Order, Review, PurchaseHistory
from .helper import role_required
from sqlalchemy.exc import IntegrityError

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
        return jsonify({'message': 'Costumer already registed'}), 500

@app.route('/costumer/update', methods=['PUT'])
@role_required('Costumer')
def update_costumer():
    print(current_user.user_role, current_user.username)
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
    if data.get('product_id') in [product.product_id for product in current_user.costumer.wishlist]:
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
    if data.get('product_id') not in [product.product_id for product in current_user.costumer.wishlist]:
        return jsonify({'message': 'Product not in wishlist'}), 400
    wishlist_item = Wishlist.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id).first()
    db.session.delete(wishlist_item)
    db.session.commit()
    return jsonify({'message': 'Product removed from wishlist'}), 200

@app.route('/wishlist', methods=['GET'])
@role_required('Costumer')
def get_wishlist():
    print(current_user.costumer.wishlist)
    return jsonify([product.to_dict() for product in current_user.costumer.wishlist]), 200

@app.route('/cart', methods=['GET'])
@role_required('Costumer')
def get_cart():
    cart = current_user.costumer.cart
    if not cart:
        return jsonify({'message': 'Cart is empty'}), 400
    return jsonify([product.to_dict() for product in current_user.costumer.cart]), 200

@app.route('/cart/add', methods=['POST'])
@role_required('Costumer')
def cart_add():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('product_id') in [product.product_id for product in current_user.costumer.cart]:
        return jsonify({'message': 'Product already in cart'}), 400
    cart_item = Cart(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id, item_quantity=data.get('item_quantity'))
    db.session.add(cart_item)
    db.session.commit()
    return jsonify({'message': 'Product added to cart'}), 200

@app.route('/cart/remove', methods=['DELETE'])
@role_required('Costumer')
def cart_remove():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('product_id') not in [product.product_id for product in current_user.costumer.cart]:
        return jsonify({'message': 'Product not in cart'}), 400
    cart_item = Cart.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id).first()
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
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if data.get('product_id') not in [product.product_id for product in current_user.costumer.cart]:
        return jsonify({'message': 'Product not in cart'}), 400
    cart_item = Cart.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id).first()
    cart_item.item_quantity = data.get('item_quantity')
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'}), 200

@app.route('/cart/checkout', methods=['POST'])
@role_required('Costumer')
def checkout():
    if not current_user.costumer.shipping_address:
        return jsonify({'message': 'Missing required data'}), 400
    if not current_user.costumer.cart:
        return jsonify({'message': 'Cart is empty'}), 400
    current_user.costumer.cart = []
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
    order = current_user.costumer.orders.filter_by(order_id=data.get('order_id')).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    order.status = 'Cancelled'
    db.session.commit()
    return jsonify({'message': 'Order cancelled successfully'}), 200

@app.route('/review/add', methods=['POST'])
@role_required('Costumer')
def review():
    data = request.get_json()
    if not data.get('product_id') or not data.get('rating') or not data.get('review'):
        return jsonify({'message': 'Missing required data'}), 400
    if data.get('product_id') in [product.product_id for product in current_user.costumer.review]:
        return jsonify({'message': 'You have already reviwed the product, please use update if you want to add details to your review'}), 400
    # if data.get('product_id') not in [product.product_id for product in current_user.costumer.orders]:
    #     return jsonify({'message': 'Product not found in orders'}), 400
    review = Review(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id'), review_rating=data.get('rating'), review_text=data.get('review'))
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
    reviews = current_user.costumer.review
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 400
    return jsonify([review.to_dict() for review in reviews]), 200

@app.route('/purchase_history', methods=['GET'])
@role_required('Costumer')
def get_purchase_history():
    purchase_history = current_user.costumer.purchase_history
    if not purchase_history:
        return jsonify({'message': 'No purchase history found'}), 400
    return jsonify([purchase.to_dict() for purchase in purchase_history]), 200

@app.route('/purchase_history/add', methods=['POST'])
@role_required('Costumer')
def add_purchase_history():
    data = request.get_json()
    if not data.get('product_id') or not data.get('quantity'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product.query.get(data.get('product_id'))
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    purchase = PurchaseHistory(costumer_id=current_user.costumer.costumer_id, product_id=product.product_id, quantity=data.get('quantity'))
    db.session.add(purchase)
    db.session.commit()
    return jsonify({'message': 'Purchase history added successfully'}), 201

@app.route('/purchase_history/remove', methods=['DELETE'])
@role_required('Costumer')
def remove_purchase_history():
    data = request.get_json()
    if not data.get('product_id'):
        return jsonify({'message': 'Missing required data'}), 400
    purchase = PurchaseHistory.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    if not purchase:
        return jsonify({'message': 'Purchase history not found'}), 404
    db.session.delete(purchase)
    db.session.commit()
    return jsonify({'message': 'Purchase history removed successfully'}), 200

@app.route('/purchase_history/update', methods=['PUT'])
@role_required('Costumer')
def update_purchase_history():
    data = request.get_json()
    if not data.get('product_id') or not data.get('quantity'):
        return jsonify({'message': 'Missing required data'}), 400
    purchase = PurchaseHistory.query.filter_by(costumer_id=current_user.costumer.costumer_id, product_id=data.get('product_id')).first()
    if not purchase:
        return jsonify({'message': 'Purchase history not found'}), 404
    purchase.quantity = data.get('quantity')
    db.session.commit()
    return jsonify({'message': 'Purchase history updated successfully'}), 200