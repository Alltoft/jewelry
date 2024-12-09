# app/payment.py
from flask import Blueprint, request, jsonify
import stripe
import os
from dotenv import load_dotenv
import logging

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
logger.info(f"Loaded STRIPE_SECRET_KEY: {STRIPE_SECRET_KEY}")

@payment_bp.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        amount = data.get('amount')
        customer_details = data.get('customer_details')

        logger.info(f"Received payment request: Amount={amount}")

        # Validate required fields
        if not amount or not customer_details:
            logger.error("Missing required data in payment request.")
            return jsonify({'message': 'Missing required data'}), 400

        # Create a PaymentIntent with Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(float(amount) * 100),  # Stripe expects the amount in cents
            currency='usd',  # Update to your currency
            metadata={'integration_check': 'accept_a_payment'},
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