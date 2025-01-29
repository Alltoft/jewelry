import json
from shipment import FedExShipping
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_fedex_rates():
    # Initialize FedEx shipping
    fedex = FedExShipping()
    
    # Test data
    test_origin = {
        "address": {
            "streetLines": ["10 Downing Street"],
            "city": "London",
            "postalCode": "SW1A 2AA",
            "countryCode": "GB"
        },
        "contact": {
            "personName": "John Smith",
            "phoneNumber": "+44 20 7925 0918",
            "companyName": "Origin Company"
        }
    }
    
    test_destination = {
        "address": {
            "streetLines": ["45 Rue Moulay Ismail"],
            "city": "Marrakech",
            "postalCode": "40000",
            "countryCode": "MA"
        },
        "contact": {
            "personName": "Ahmed Benani", 
            "phoneNumber": "0524123456",
            "companyName": "Customer Name"
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

    try:
        # Get rates
        rates = fedex.get_rates(test_origin, test_destination, test_package)
        
        # Extract and display available services
        if 'output' in rates and 'rateReplyDetails' in rates['output']:
            print("\nAvailable Shipping Options:")
            print("-" * 50)
            
            for rate in rates['output']['rateReplyDetails']:
                service_type = rate['serviceType']
                service_name = rate['serviceName']
                
                # Get the account rate (usually cheaper than list rate)
                account_rate = None
                for shipment_detail in rate['ratedShipmentDetails']:
                    if shipment_detail['rateType'] == 'ACCOUNT':
                        account_rate = shipment_detail['totalNetCharge']
                        currency = shipment_detail['currency']
                        break
                
                print(f"\nService: {service_name}")
                print(f"Service Type: {service_type}")
                print(f"Rate: {account_rate} {currency}")
                
                # Display delivery time if available
                if 'operationalDetail' in rate:
                    if 'transitTime' in rate['operationalDetail']:
                        print(f"Transit Time: {rate['operationalDetail']['transitTime']}")
                print("-" * 50)
        else:
            print("No rates found in response")
            
    except Exception as e:
        logger.error(f"Error getting rates: {str(e)}")
        raise

if __name__ == "__main__":
    test_fedex_rates()