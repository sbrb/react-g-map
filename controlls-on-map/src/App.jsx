// all controls
import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./style.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 24,
  lng: 88,
};

const options = {
  styles: [
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#87ceeb",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#A8DAB5", // Set park color to green
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#ededed", // Set road color to gray
        },
      ],
    },
  ],
  disableDefaultUI: true,
  zoomControl: false,
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
  });

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [mapType, setMapType] = useState("terrain");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    if (map && zoom < 20) {
      setZoom((prevZoom) => prevZoom + 1);
      map.setZoom(zoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map && zoom > 1) {
      setZoom((prevZoom) => prevZoom - 1);
      map.setZoom(zoom - 1);
    }
  };

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const handleChangeMapType = (type) => {
    setMapType(type);
  };

  if (loadError) {
    return <div>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          ...options,
          mapTypeId: mapType,
        }}
        onLoad={(map) => setMap(map)}
      >
        {/* Add your custom buttons */}
        <div className="map-buttons">
          <button className="map-button" onClick={handleZoomIn}>
            +
          </button>
          <button className="map-button" onClick={handleZoomOut}>
            -
          </button>
          <button className="map-button" onClick={handleToggleFullscreen}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            className={`map-button ${mapType === "terrain" ? "active" : ""}`}
            onClick={() => handleChangeMapType("terrain")}
          >
            Terrain
          </button>
          <button
            className={`map-button ${mapType === "satellite" ? "active" : ""}`}
            onClick={() => handleChangeMapType("satellite")}
          >
            Satellite
          </button>
          <button
            className={`map-button ${mapType === "hybrid" ? "active" : ""}`}
            onClick={() => handleChangeMapType("hybrid")}
          >
            Hybrid
          </button>
        </div>

        {/* Addother map components, such as markers or overlays, here */}
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default App;

