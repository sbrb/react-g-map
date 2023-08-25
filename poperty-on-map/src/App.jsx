import React, { useState, Fragment, useEffect } from "react"; import Places from "./Places";
import "./style.css";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

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
  ],
  disableDefaultUI: false,
  zoomControl: false,
};

function App() {
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({});
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.G_MAP_API_KEY,
  });

  const fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    Places.map((place) => {
      bounds.extend(place.pos);
      return place.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = (map) => {
    setMapRef(map);
    fitBounds(map);
  };

  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    setSelectedPlace(place);
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
  };

  const renderMap = () => {
    return (
      <>
        <Fragment>
          <GoogleMap
            onLoad={loadHandler}
            // onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
            // onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
            center={center}
            mapContainerStyle={{
              height: "600px",
              width: "1200px",
              margin: "auto",
            }}
              options={options}
          >
            {Places.map((place) => (
              <Marker
                key={place.id}
                position={place.pos}
                onLoad={(marker) => markerLoadHandler(marker, place)}
                onClick={(event) => markerClickHandler(event, place)}
                icon={{
                  icon: "https://gasdeverao.cocacola.com.br/assets/favicons/favicon-32x32.png",
                  fillColor: "#ff0000",
                  fillOpacity: 1,
                }}
              />
            ))}

            {infoOpen && selectedPlace && (
              <InfoWindow
                anchor={markerMap[selectedPlace.id]}
                onCloseClick={() => setInfoOpen(false)}
              >
                <div className="card_container">
                  <div className="card_img">
                    <img src={selectedPlace.image} alt="house img" />
                  </div>
                  <div className="card_dites">
                    <a
                      style={{ textDecoration: "none", fontWeight: "900" }}
                      href={selectedPlace.link}
                    >
                      <b>{selectedPlace.title}</b>
                    </a>
                    <div>{selectedPlace.price}</div>
                    <div>{selectedPlace.area}</div>
                    <div
                      style={{ textTransform: "uppercase", fontWeight: "400" }}
                    >
                      {selectedPlace.description}
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </Fragment>
        <div className="house_container">
          {Places.map((home) => (
            <div
              className="house"
              onMouseEnter={(e) => markerClickHandler(e, home)}
              onMouseLeave={() => setInfoOpen(false)}
            >
              <img className="house_img" src={home.image} alt="house img" />
              <div className="house_details">
                <a
                  style={{ textDecoration: "none", fontWeight: "900" }}
                  href={home.link}
                >
                  <b>{home.title}</b>
                </a>
                <div>{home.price}</div>
                <div>{home.area}</div>
                <div style={{ textTransform: "uppercase", fontWeight: "400" }}>
                  {home.description}
                </div>
              </div>
            </div>
          ))}
        </div>  
      </>
    );
  };
  return isLoaded ? renderMap() : null;
}
export default App;


