import requests
from flask import Blueprint, request, jsonify
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any
import os
import json
from pathlib import Path

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

shipping_bp = Blueprint('shipping', __name__)

FEDEX_CLIENT_ID = os.environ.get("FEDEX_CLIENT_ID")
FEDEX_CLIENT_SECRET = os.environ.get("FEDEX_CLIENT_SECRET")
FEDEX_ACCOUNT_NUMBER = os.environ.get("FEDEX_ACCOUNT_NUMBER")
base_url = "https://apis-sandbox.fedex.com"
access_token = None
token_expiry = None
max_retries = 3

TOKEN_DIR = Path(os.path.expanduser('./.fedex'))
TOKEN_FILE = TOKEN_DIR / 'token.json'

def _check_token_expired() -> bool:
    return not token_expiry or datetime.now() >= token_expiry

def _load_stored_token() -> tuple[str | None, datetime | None]:
    try:
        if not TOKEN_FILE.exists():
            return None, None
            
        with open(TOKEN_FILE, 'r') as f:
            data = json.load(f)
            expiry = datetime.fromisoformat(data['expiry'])
            return data['token'], expiry
    except Exception as e:
        logger.error(f"Error loading token: {e}")
        return None, None

def _save_token(token: str, expiry: datetime) -> None:
    try:
        TOKEN_DIR.mkdir(exist_ok=True, mode=0o700)
        with open(TOKEN_FILE, 'w') as f:
            json.dump({
                'token': token,
                'expiry': expiry.isoformat()
            }, f)
        os.chmod(TOKEN_FILE, 0o600)
    except Exception as e:
        logger.error(f"Error saving token: {e}")

def get_access_token() -> str:
    global access_token, token_expiry
    
    # Try to load existing token first
    access_token, token_expiry = _load_stored_token()
    if not _check_token_expired():
        return access_token

    # Get new token if needed
    client_id = FEDEX_CLIENT_ID
    client_secret = FEDEX_CLIENT_SECRET
    try:
        auth_url = f"{base_url}/oauth/token"
        payload = {
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        }
        response = requests.post(auth_url, data=payload)
        response.raise_for_status()
        
        token_data = response.json()
        access_token = token_data['access_token']
        token_expiry = datetime.now() + timedelta(seconds=token_data['expires_in'])
        
        # Save the new token
        _save_token(access_token, token_expiry)
        
        logger.info("Successfully obtained new access token")
        return access_token
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Authentication failed: {str(e)}")
        return jsonify({'message': 'Authentication failed'}), 500

@shipping_bp.route('/get-rates', methods=['POST'])
def get_rates():
    try:
        # Validate request data
        request_data = request.get_json()
        if not all(k in request_data for k in ['origin', 'destination', 'package_details']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        origin = request_data['origin']
        print("Origin: ", origin)
        destination = request_data['destination']
        print("Destination: ", destination)
        package_details = request_data['package_details']
        print("Pack", package_details)

        global access_token, token_expiry
        if _check_token_expired():
            access_token = get_access_token()
            
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "X-locale": "en_MA"
        }

        rate_payload = {
            "accountNumber": {
                "value": FEDEX_ACCOUNT_NUMBER
            },
            "requestedShipment": {
                "shipper": origin,
                "recipient": destination,
                "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
                "rateRequestType": ["LIST", "ACCOUNT"],
                "requestedPackageLineItems": [package_details]
            }
        }

        for attempt in range(max_retries):
            try:
                response = requests.post(
                    f"{base_url}/rate/v1/rates/quotes",
                    headers=headers,
                    json=rate_payload
                )
                response.raise_for_status()
                return jsonify(response.json()), 200
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Rate calculation attempt {attempt + 1} failed: {str(e)}")
                if "FORBIDDEN.ERROR" in str(e):
                    access_token = get_access_token()
                    headers["Authorization"] = f"Bearer {access_token}"
                    continue
                if attempt == max_retries - 1:
                    return jsonify({'error': 'Failed to calculate shipping rates'}), 500

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    
@shipping_bp.route('/create-shipment', methods=['POST'])
def create_shipment():
    try:
        # Validate request data
        request_data = request.get_json()
        if not all(k in request_data for k in ['origin', 'destination', 'package_details', 'service_type', 'amount', 'shipper', 'recipient']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        origin = request_data['origin']
        destination = request_data['destination']
        package_details = request_data['package_details']
        serviceType = request_data['service_type']
        amount = request_data['amount']
        shipper = request_data['shipper']
        recipient = request_data['recipient']
        payment_method = request_data.get('payment_method', 'card')  # Default to card
        payment_status = request_data.get('payment_status', 'paid')  # Default to paid

        global access_token, token_expiry
        if _check_token_expired():
            access_token = get_access_token()
            
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "X-locale": "en_MA"
        }

        shipment_payload = {
            "accountNumber": {
                "value": FEDEX_ACCOUNT_NUMBER
            },
            "labelResponseOptions": "URL_ONLY",
            "requestedShipment": {
                "shipDatestamp": datetime.now().strftime('%Y-%m-%d'),
                "totalDeclaredValue": {
                    "amount": amount,
                    "currency": "USD"
                },
                # Add special instructions for Cash on Delivery
                "specialServicesRequested": {
                    "specialServiceTypes": ["COD"] if payment_method == 'cod' else [],
                    "codDetail": {
                        "codCollectionAmount": {
                            "amount": amount,
                            "currency": "USD"
                        },
                        "collectionType": "ANY" # Allows payment by cash, check, or money order
                    } if payment_method == 'cod' else None
                } if payment_method == 'cod' else None,
                "shipper": {
                    "address": {
                        "streetLines": origin["address"]["streetLines"],
                        "city": origin["address"]["city"],
                        "stateOrProvinceCode": origin["address"]["stateOrProvinceCode"],
                        "postalCode": origin["address"]["postalCode"],
                        "countryCode": origin["address"]["countryCode"],
                        "residential": False
                    },
                    "contact": {
                        "personName": shipper.get("name", ""),
                        "emailAddress": shipper.get("email", ""),
                        "phoneNumber": shipper.get("phoneNumber", ""),
                        "phoneExtension": shipper.get("phoneExtension", ""),
                        "companyName": shipper.get("companyName", "")
                    }
                },
                "recipients": [  # Corrected back to 'recipients' (plural)
                    {
                        "address": {
                            "streetLines": destination["address"]["streetLines"],
                            "city": destination["address"]["city"],
                            "stateOrProvinceCode": destination["address"]["stateOrProvinceCode"],
                            "postalCode": destination["address"]["postalCode"],
                            "countryCode": destination["address"]["countryCode"],
                            "residential": True
                        },
                        "contact": {
                            "personName": recipient.get("name", ""),
                            "emailAddress": recipient.get("email", ""),
                            "phoneNumber": recipient.get("phoneNumber", ""),
                            "phoneExtension": recipient.get("phoneExtension", ""),
                            "companyName": recipient.get("companyName", "")
                        }
                    }
                ],
                "serviceType": serviceType,
                "pickupType": "USE_SCHEDULED_PICKUP",
                "packagingType": "YOUR_PACKAGING",
                "shippingChargesPayment": {
                    "paymentType": "SENDER",
                    "payor": {
                        "responsibleParty": {
                            "accountNumber": {
                                "value": FEDEX_ACCOUNT_NUMBER
                            }
                        }
                    }
                },
                "labelSpecification": {
                    "labelFormatType": "COMMON2D",
                    "imageType": "PDF",
                    "labelStockType": "PAPER_4X6"
                },
                "requestedPackageLineItems": [{
                    "weight": package_details["weight"],
                    "dimensions": package_details["dimensions"]
                }]
            }
        }


        for attempt in range(max_retries):
            try:
                response = requests.post(
                    f"{base_url}/ship/v1/shipments",
                    headers=headers,
                    json=shipment_payload
                )
                response.raise_for_status()
                return jsonify(response.json()), 200
                
            except requests.exceptions.RequestException as e:
                try:
                    print(f"Error Details: {response.text}")
                    error_response = e.response.json()
                    error_details = {
                        'status_code': e.response.status_code,
                        'error_type': error_response.get('transactionId', 'UNKNOWN'),
                        'message': error_response.get('output', {}).get('message', str(e)),
                        'errors': error_response.get('output', {}).get('alerts', []),
                        'attempt': attempt + 1,
                        'timestamp': datetime.now().isoformat()
                    }
                    
                    logger.error(f"Shipment creation attempt {attempt + 1} failed: {error_details}")
                    
                    if "FORBIDDEN.ERROR" in str(e):
                        access_token = get_access_token()
                        headers["Authorization"] = f"Bearer {access_token}"
                        continue
                        
                    if attempt == max_retries - 1:
                        return jsonify({
                            'error': 'Failed to create shipment',
                            'details': error_details
                        }), error_details['status_code']
                        
                except Exception as parse_error:
                    logger.error(f"Error parsing FedEx response: {str(parse_error)}")
                    return jsonify({
                        'error': 'Failed to create shipment',
                        'message': str(e)
                    }), 500

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500