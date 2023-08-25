//temple with circle & zoom within 3km radius
  import React, { useState } from 'react';
  import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
  import axios from 'axios';

  const containerStyle = {
    width: '100%',
    height: '99vh',
  };

  const center = {
    lat: 24,
    lng: 88,
  };

  function App() {
    const [map, setMap] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [temples, setTemples] = useState([]);

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: '',
    });

    const handleClick = async (e) => {
      setSelectedLocation(e.latLng.toJSON());
      try {
        const response = await axios.get('http://localhost:5000/api/temples', {
          params: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            radius: 30000,
          },
        });
        setTemples(response.data);
      } catch (error) {
        console.error('Error fetching temples:', error);
      }
    };

    const handleClick2 = (e) => {
      setSelectedLocation(e.latLng.toJSON());
      if (map) {
        map.setZoom(11); 
        map.panTo(e.latLng); 
      }
    };

    const handleCombinedClick = (e) => {
      handleClick(e); 
      handleClick2(e); 
    };

    const onLoad = (map) => {
      setMap(map);
    };
    console.log(temples)

    return (
      <div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={4.5}
            onClick={handleCombinedClick}
            onLoad={onLoad}
          >
            {selectedLocation && (
              <>
                <Marker position={selectedLocation} />
                <Circle
                  center={selectedLocation}
                  radius={30000}
                  options={{
                    fillColor: '#b8b4b4',
                    strokeColor: '#FF0000',
                    strokeWeight: 2,
                  }}
                />
              </>
            )}
            {temples.map((temple) => (
              <Marker
                key={temple._id}
                position={{ lat: temple.location.coordinates[1], lng: temple.location.coordinates[0] }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div>Loading Map...</div>
        )}
      </div>
    );
  }

  export default App;

