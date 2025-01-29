import requests
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any
import os

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FedExAPIError(Exception):
    pass

class FedExShipping:
    def __init__(self):
        self.client_id = os.environ.get("FEDEX_CLIENT_ID")
        self.client_secret = os.environ.get("FEDEX_CLIENT_SECRET")
        self.account_number = os.environ.get("FEDEX_ACCOUNT_NUMBER")
        self.base_url = "https://apis-sandbox.fedex.com"
        self.access_token = None
        self.token_expiry = None
        self.max_retries = 3

    def _check_token_expired(self) -> bool:
        return not self.token_expiry or datetime.now() >= self.token_expiry

    def get_access_token(self) -> str:
        try:
            auth_url = f"{self.base_url}/oauth/token"
            payload = {
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret
            }
            response = requests.post(auth_url, data=payload)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data['access_token']
            self.token_expiry = datetime.now() + timedelta(seconds=token_data['expires_in'])
            logger.info("Successfully obtained new access token")
            return self.access_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise FedExAPIError(f"Failed to authenticate: {str(e)}")

    def get_rates(self, origin: Dict, destination: Dict, package_details: Dict) -> Dict[str, Any]:
        if self._check_token_expired():
            self.get_access_token()

        print(origin)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.access_token}",
            "X-locale": "en_MA"
        }

        rate_payload = {
            "accountNumber": {
                "value": self.account_number
            },
            "requestedShipment": {
                "shipper": origin,
                "recipient": destination,
                "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
                "rateRequestType": ["LIST", "ACCOUNT"],
                "requestedPackageLineItems": [package_details]
            }
        }

        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    f"{self.base_url}/rate/v1/rates/quotes",
                    headers=headers,
                    json=rate_payload
                )

                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Rate calculation attempt {attempt + 1} failed: {str(e)}")
                if attempt == self.max_retries - 1:
                    raise FedExAPIError(f"Rate calculation failed after {self.max_retries} attempts")
                if "FORBIDDEN.ERROR" in str(e):
                    self.get_access_token()

if __name__ == "__main__":
    # Test the implementation
    fedex = FedExShipping()
    try:
        # First test authentication
        token = fedex.get_access_token()
        print(f"Authentication successful")

        # Test shipping rate calculation
        test_origin = {
            "address": {
                "streetLines": ["123 Test St"],
                "city": "Los Angeles",
                "stateOrProvinceCode": "CA",
                "postalCode": "90001",
                "countryCode": "US"
            }
        }
        test_destination = {
            "address": {
                "streetLines": ["456 Test Ave"],
                "city": "New York",
                "stateOrProvinceCode": "NY",
                "postalCode": "10001",
                "countryCode": "US"
            }
        }
        test_package = {
            "weight": {"value": 1.0, "units": "LB"},
            "dimensions": {
                "length": 10,
                "width": 5,
                "height": 5,
                "units": "IN"
            }
        }

        rates = fedex.get_rates(test_origin, test_destination, test_package)
        print("Rate calculation successful:", rates)

    except FedExAPIError as e:
        logger.error(f"FedEx API Error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")