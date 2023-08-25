//5% zoom in level increase
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const App = () => {
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== "") {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, handleGeocodeResults);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleGeocodeResults = (results, status) => {
    if (status === "OK" && results && results.length > 0) {
      const location = results[0].geometry.location;
      setSearchLocation({
        lat: location.lat(),
        lng: location.lng(),
      });

      const bounds = results[0].geometry.viewport;
      const newZoom = calculateZoomLevel(bounds);
      setZoom(newZoom);
    }
  };

  const calculateZoomLevel = (bounds) => {
    const GLOBE_WIDTH = 256;
    const latFraction =
      (bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) / 180;
    const lngFraction =
      (bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) / 360;
    const latZoom = Math.floor(
      Math.log(window.innerHeight / latFraction / GLOBE_WIDTH) / Math.LN2
    );
    const lngZoom = Math.floor(
      Math.log(window.innerWidth / lngFraction / GLOBE_WIDTH) / Math.LN2
    );
    return Math.min(latZoom, lngZoom, 20) * 1.05;
  };

  return (
    <div>
      <div style={{ width: "100%", padding: "16px" }}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ width: "100%" }}>
        <LoadScript googleMapsApiKey="">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "87vh" }}
            center={searchLocation || { lat: 0, lng: 0 }}
            zoom={zoom}
            onLoad={(mapInstance) => setMap(mapInstance)}
          />
        </LoadScript>
      </div>
    </div>
  );
};

export default App;
