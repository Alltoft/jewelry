# filepath: /home/alo/jewelry/app/payment.py
from flask import Blueprint, request, jsonify
import os
import time
from dotenv import load_dotenv
import logging
# from .models import Order
# from app import db
# from app.utils.email_service import send_order_confirmation
# from app.utils.notification_service import notify_fulfillment

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Blueprint
payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        amount = data.get('amount')
        customer_details = data.get('customer_details')

        logger.info(f"Received COD payment request: Amount={amount}")

        # Validate required fields
        if not amount or not customer_details:
            logger.error("Missing required data in payment request.")
            return jsonify({'message': 'Missing required data'}), 400

        # For COD, we just record the intent to pay
        order_id = f"COD-{int(time.time())}"
        
        return jsonify({
            'status': 'success',
            'order_id': order_id,
            'payment_method': 'cod', 
            'message': 'Cash on delivery order created successfully'
        }), 200

    except Exception as e:
        logger.exception(f"Exception in create_payment: {str(e)}")
        return jsonify({'message': 'An error occurred while creating payment'}), 500

