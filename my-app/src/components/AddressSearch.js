import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const AddressSearch = ({ onAddressSelect }) => {
  const geocoderContainerRef = useRef(null);

  // ...existing formatUnnamedStreet function...

  useEffect(() => {
    try {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: 'MA',
        language: 'ar', // Changed from array to string
        types: 'address',
        bbox: [-13.168297, 27.662115, -0.991750, 35.928511],
        placeholder: 'أدخل عنوانك / Entrez votre adresse',
        proximity: {
          longitude: -7.603869,
          latitude: 33.589886
        }
      });

      if (geocoderContainerRef.current) {
        geocoder.addTo(geocoderContainerRef.current);
      }

      geocoder.on('result', async (event) => {
        // ...existing result handling code...
      });

      return () => {
        if (geocoder) {
          geocoder.onRemove();
        }
      };
    } catch (error) {
      console.error('Mapbox initialization error:', error);
    }
  }, []);

  return (
    <div>
      <div ref={geocoderContainerRef} className="geocoder-container" />
    </div>
  );
};

export default AddressSearch;