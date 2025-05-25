# app/payment.py
from flask import Blueprint, request, jsonify
import stripe
import os
import time
from dotenv import load_dotenv
import logging
import time

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Blueprint
payment_bp = Blueprint('payment', __name__)

# Stripe Configuration
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY


# Log the loaded environment variables for debugging
# logger.info(f"Loaded STRIPE_SECRET_KEY: {STRIPE_SECRET_KEY}")

@payment_bp.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        amount = data.get('amount')
        customer_details = data.get('customer_details')
        payment_method = data.get('payment_method', 'card')  # Default to card if not specified

        logger.info(f"Received payment request: Amount={amount}, Method={payment_method}")

        # Validate required fields
        if not amount or not customer_details:
            logger.error("Missing required data in payment request.")
            return jsonify({'message': 'Missing required data'}), 400

        # Handle different payment methods
        if payment_method == 'cod':
            # For Cash on Delivery, we don't need to create a payment intent
            # Just return success response with COD identifier
            return jsonify({
                'status': 'success',
                'payment_method': 'cod',
                'message': 'Cash on delivery order created successfully'
            }), 200
        else:
            # Create a PaymentIntent with Stripe for card payments
            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),  # Stripe expects the amount in cents
                currency='usd',  # Update to your currency
                metadata={
                    'integration_check': 'accept_a_payment',
                    'payment_method': payment_method
                },
                receipt_email=customer_details.get('email'),
            )

            logger.info("PaymentIntent created successfully.")
            return jsonify({'client_secret': intent.client_secret}), 200

    except Exception as e:
        logger.exception(f"Exception in create_payment: {str(e)}")
        return jsonify({'message': 'An error occurred while creating payment'}), 500

@payment_bp.route('/retrieve-payment-method/<payment_method_id>', methods=['GET'])
def retrieve_payment_method(payment_method_id):
    try:
        payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
        return jsonify(payment_method), 200
    except Exception as e:
        logger.exception(f"Exception in retrieve_payment_method: {str(e)}")
        return jsonify({'message': 'An error occurred while retrieving payment method'}), 500

@payment_bp.route('/create-cash-order', methods=['POST'])
def create_cash_order():
    try:
        data = request.get_json()
        amount = data.get('amount')
        customer_details = data.get('customer_details')
        shipping_details = data.get('shipping_details')

        logger.info(f"Received cash order request: Amount={amount}")

        # Validate required fields
        if not amount or not customer_details or not shipping_details:
            logger.error("Missing required data in cash order request.")
            return jsonify({'message': 'Missing required data'}), 400

        # In a real application, here you would:
        # 1. Log the order in your database with status "pending"
        # 2. Create shipment entry with "COD" flag
        # 3. Send confirmation email to customer
        # 4. Notify fulfillment team

        return jsonify({
            'status': 'success',
            'order_id': f"COD-{int(time.time())}",  # Generate a timestamp-based order ID
            'message': 'Cash on delivery order created successfully'
        }), 200

    except Exception as e:
        logger.exception(f"Exception in create_cash_order: {str(e)}")
        return jsonify({'message': 'An error occurred while creating cash order'}), 500