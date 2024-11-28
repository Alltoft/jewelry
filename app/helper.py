from flask_login import current_user
from functools import wraps
from flask import jsonify
import os
import secrets
from app import app



def save_picture(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    final_pic = random_hex + f_ext
    picture_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], final_pic)
    file.save(picture_path)
    return final_pic

def save_temp_picture(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    final_pic = random_hex + f_ext
    picture_path = os.path.join(app.root_path, app.config["TEMP_UPLOAD_FOLDER"], final_pic)
    file.save(picture_path)
    return final_pic

def delete_picture(picture):
    picture_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], picture)
    os.remove(picture_path)
    return True

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
