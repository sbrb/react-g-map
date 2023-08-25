import React, {  useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

const libraries = ['places'];
const mapContainerStyle = {
  width: '1800px',
  height: '700px',
};
const center = {
  lat: 24,
  lng: 88,
};


function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: '',
    libraries,
  });

  const handleMapClick = (e) => {
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  const handleLocationChange = (position) => {
    console.log(position)
    const { latitude, longitude } = position.coords;
    setUserLocation({ latitude, longitude });
    setSelectedLocation({
      lat: latitude,
      lng: longitude,
    });
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationChange);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };


  return isLoaded ? (
    <div className="App">
      <div>
        {selectedLocation ? (
          <div>
            <p>Latitude: {selectedLocation.lat}</p>
            <p>Longitude: {selectedLocation.lng}</p>
          </div>
        ) : (
          <p>No location selected</p>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={4.3}
        center={center}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>


      {userLocation ? (
        <div>
          <p>Live Location: {userLocation.latitude}, {userLocation.longitude}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}


      <button onClick={fetchUserLocation} >Live Location </button>
    </div>
  ) : (
    <div>Loading maps...</div>
  );
}

export default App;
