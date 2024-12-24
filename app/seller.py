from app import app, db, allowed_file
from flask import request, jsonify
from flask_login import current_user
from .models import Seller, Product, ProductImage
from .helper import role_required, is_verified, save_picture, delete_picture, save_temp_picture
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)


@app.route('/seller/register', methods=['POST'])
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
        return jsonify({'message': 'Seller already registed'}), 500


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
        return jsonify({'message': 'Seller verified successsfully'}), 200


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
def product():
    data = request.get_json()

    if not data.get('name') or not data.get('price'):
        return jsonify({'message': 'Missing required data'}), 400
    product = Product(
        seller_id=current_user.seller.seller_id,
        product_name=data.get('name'),
        product_price=data.get('price'),
        original_price=data.get('original_price'),
        product_style=data.get('style'),
        product_weight=data.get('weight'),
        product_gemstone=data.get('gemstone'),
        product_refference=data.get('refference'),
        product_description=data.get('description'),
        product_quantity=data.get('quantity'),
        product_category=data.get('category'),
        product_status=data.get('status'),
        product_material=data.get('material'),
        )
    db.session.add(product)
    db.session.commit()
    
    # if 'image' in request.files:
    #     file = request.files['image']
    #     if file and allowed_file(file.filename):
    #         picture = save_picture(file)
    #         product.product_image = picture
    #         product.product_image_url = f"{request.host_url}static/images/product_pics/{picture}"
    #         db.session.commit()
    #     else:
    #         return jsonify({'message': 'Invalid file type'}), 400

    return jsonify({'message': 'Product added successfully', 'product_id': product.product_id}), 201

@app.route('/product/<product_id>/upload_image', methods=['POST'])
@role_required('Seller')
def upload_product_image(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if 'image' not in request.files:
        return jsonify({'message': 'No file part'}), 401
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 402
    if file and allowed_file(file.filename):
        if product.product_image and product.product_image.split('/')[-1] != 'default.jpg':
            delete_picture(product.product_image)
        product.product_image = save_picture(file)
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully'}), 200
    return jsonify({'message': 'Invalid file type'}), 403

@app.route('/product/<product_id>/upload_images', methods=['POST'])
@role_required('Seller')
def upload_product_images(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    if 'images' not in request.files:
        return jsonify({'message': 'No file part'}), 401
    files = request.files.getlist('images')
    for file in files:
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 402
        if file and allowed_file(file.filename):
            image = save_picture(file)
            product_image = ProductImage(product_id=product.product_id, image=image)
            db.session.add(product_image)
        else:
            return jsonify({'message': 'Invalid file type'}), 403
    db.session.commit()
    return jsonify({'message': 'Images uploaded successfully'}), 200

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
    os.remove(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], product.product_image))
    os.remove(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], (image for image in product.images)))
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200

@app.route('/product/seller_all', methods=['GET'])
@role_required('Seller')
def get_seller_products():
    products = Product.query.filter_by(seller_id=current_user.seller.seller_id, deleted_at = None).all()
    return jsonify([product.to_dict() for product in products]), 200

@app.route('/upload_temp_image', methods=['POST'])
@role_required('Seller')
def upload_temp_image():
    if 'image' not in request.files:
        return jsonify({'message': 'No file part'}), 401
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 402
    if file and allowed_file(file.filename):
        image = save_temp_picture(file)
        image_url = f"{request.host_url}static/images/temp/{image}"
        return jsonify({'image_url': image_url}), 200
    return jsonify({'message': 'Invalid file type'}), 403

@app.route('/product/<product_id>/associate_images', methods=['POST'])
@role_required('Seller')
def associate_images(product_id):
    try:
        if 'images' not in request.form:
            logging.error('No images provided in the request.')
            return jsonify({'message': 'No images provided'}), 400

        images = request.form.getlist('images')
        logging.debug(f'Received images to associate: {images}')

        product = Product.query.get(product_id)
        if not product:
            logging.error(f'Product with ID {product_id} not found.')
            return jsonify({'message': 'Product not found'}), 404

        for image_url in images:
            # Extract filename from URL
            filename = os.path.basename(image_url)
            logging.debug(f'Processing image filename: {filename}')

            temp_path = os.path.join(app.root_path, app.config['TEMP_UPLOAD_FOLDER'], filename)
            final_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename)

            logging.debug(f'Temp path: {temp_path}')
            logging.debug(f'Final path: {final_path}')

            # Check if the temp file exists
            if not os.path.exists(temp_path):
                logging.error(f'Temporary file does not exist: {temp_path}')
                return jsonify({'message': f'Temporary file {filename} does not exist'}), 400

            # Move the file using shutil.move to handle cross-filesystem moves
            import shutil
            try:
                shutil.move(temp_path, final_path)
                logging.debug(f'File moved from {temp_path} to {final_path}')
            except Exception as move_error:
                logging.error(f'Error moving file {filename}: {move_error}')
                return jsonify({'message': f'Failed to move file {filename}', 'error': str(move_error)}), 500

            # Save to database
            product_image = ProductImage(product_id=product_id, image=filename)
            db.session.add(product_image)
            logging.debug(f'Image {filename} associated with product ID {product_id}')

        db.session.commit()
        logging.info('All images associated successfully.')
        return jsonify({'message': 'Images associated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        logging.exception('An error occurred while associating images.')
        return jsonify({'message': 'Failed to associate images', 'error': str(e)}), 500

# @app.route('/seller/is_verified', methods=['GET'])
# @role_required('Seller')
# @is_verified
# def is_seller_verified():
#     return jsonify({'message': 'Seller is verified'}), 200

# @app.route('/seller/delete', methods=['DELETE'])
# @role_required('Seller')
# def delete_seller():
#     current_user.deleted_at = datetime.utcnow()
#     db.session.commit()
#     return jsonify({'message': 'Seller deleted successfully'}), 200

# @app.route('/seller/verified_sellers', methods=['GET'])
# @role_required('Seller')
# def get_verified_sellers():
#     sellers = Seller.query.filter_by(is_verified=True).all()
#     return jsonify([seller.to_dict() for seller in sellers]), 200

# @app.route('/seller/unverified_sellers', methods=['GET'])
# @role_required('Seller')
# def get_unverified_sellers():
#     sellers = Seller.query.filter_by(is_verified=False).all()
#     return jsonify([seller.to_dict() for seller in sellers]), 200
