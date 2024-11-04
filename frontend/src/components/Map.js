import React from "react";
import { LoadScript, GoogleMap } from "@react-google-maps/api";

const MapComponent = () => {
  const containerStyle = {
    width: '100%',
    height: '650px',
  };

  const center = {
    lat: 33.7701,
    lng: -118.1937,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      />
    </LoadScript>
  );
};

export default MapComponent;
