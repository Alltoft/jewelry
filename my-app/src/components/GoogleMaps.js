import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const GoogleMaps = ({ onPlaceSelected }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const formatAddressForFedEx = (place) => {
    const addressComponents = {};
    const streetNumberAndRoute = [];

    place.address_components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        streetNumberAndRoute[0] = component.long_name;
      }
      if (types.includes('route')) {
        streetNumberAndRoute[1] = component.long_name;
      }
      if (types.includes('locality')) {
        addressComponents.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        addressComponents.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        addressComponents.zipCode = component.long_name;
      }
      if (types.includes('country')) {
        addressComponents.country = component.short_name;
      }
    });

    // Ensure proper street address format for FedEx
    addressComponents.streetLines = [streetNumberAndRoute.filter(Boolean).join(' ')];
    addressComponents.formatted_address = place.formatted_address;

    return addressComponents;
  };

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const formattedAddress = formatAddressForFedEx(place);
      onPlaceSelected(formattedAddress);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <Autocomplete 
        onLoad={onLoad} 
        onPlaceChanged={onPlaceChanged} 
        className='autocomplete'
        options={{
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
          types: ['address']
        }}
      >
        <input type="text" placeholder="Enter a street address" />
      </Autocomplete>
    </LoadScript>
  );
};

export default GoogleMaps;