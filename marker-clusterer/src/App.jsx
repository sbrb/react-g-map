
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerClusterer,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 22,
  lng: 80,
};

const dummyData = [
  { id: 1, lat: 20.892904198766534, lng: 77.49605756284959 },
  { id: 2, lat: 20.894989051606743, lng: 77.50129323484666 },
  { id: 3, lat: 20.899559589179837, lng: 77.50399690153367 },
  { id: 4, lat: 20.905372791078175, lng: 77.5091896581865 },
  { id: 5, lat: 20.897715353929446, lng: 77.5161419439531 },
  { id: 6, lat: 20.928903959133308, lng: 77.57192162909435 },
  { id: 7, lat: 20.931148645102144, lng: 77.62084512152599 },
  { id: 8, lat: 20.850916657892302, lng: 79.14136803765531 },
  { id: 9, lat: 20.864391269410394, lng: 79.46483423893446 },
  { id: 10, lat: 20.87337367283698, lng: 79.81863437169406 },
  { id: 11, lat: 20.233392936462156, lng: 83.30506560863654 },
  { id: 12, lat: 25.240155888081485, lng: 88.06948110023818 },
  { id: 13, lat: 25.22152174874885, lng: 88.09969350258193 },
  { id: 14, lat: 25.126443261408205, lng: 88.09694692055068 },
  { id: 15, lat: 25.275598883147367, lng: 88.34661886993617 },
];
const clusterStyles = [
  {
    textColor: "white",
    url:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
    height: 53,
    width: 53,
  },
  {
    textColor: "white",
    url:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png",
    height: 56,
    width: 56,
  }
];

const App = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      dummyData.forEach((location) => {
        const { lat, lng } = location;
        bounds.extend(new window.google.maps.LatLng(lat, lng));
      });
      map.fitBounds(bounds);
    }
  }, [map]);

  return (
    <LoadScript
      googleMapsApiKey=""
      libraries={["places"]}
      region="us"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={(map) => setMap(map)}
      >
        <MarkerClusterer
          options={{
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            styles: clusterStyles,
          }}
        >
          {(clusterer) =>
            dummyData.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                clusterer={clusterer}
              />
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
};

export default App;














