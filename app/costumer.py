from app import app, db
from flask import request, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from .models import User, Costumer
from .helper import role_required, is_verified
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
