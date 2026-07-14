import Map, { Marker, NavigationControl } from "react-map-gl";
import { useState } from "react";

const MP_CENTER = {
  latitude: 23.4733,
  longitude: 77.947,
};

export default function AddressMap() {
  const [marker, setMarker] = useState(MP_CENTER);

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        latitude: MP_CENTER.latitude,
        longitude: MP_CENTER.longitude,
        zoom: 6,
      }}
      style={{ width: "100%", height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <NavigationControl position="top-right" />

      <Marker
        latitude={marker.latitude}
        longitude={marker.longitude}
        draggable
        onDragEnd={(e) => {
          setMarker({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
        }}
      />
    </Map>
  );
}
