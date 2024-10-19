from flask_login import current_user
from functools import wraps
from flask import jsonify
from .models import User, Seller


def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                print(current_user)
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