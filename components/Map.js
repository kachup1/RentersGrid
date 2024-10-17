import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: '100%',  // Use the full width of the parent container
    height: '650px' // Adjust height as needed
  };

  

const center = {
  lat: 33.7701,
  lng: -118.1937,
};

export default function MapComponent() {
  const [landlordData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

 

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID} 

>
       

        {selectedPosition && (
          <InfoWindow
            position={{ lat: selectedPosition.lat, lng: selectedPosition.lng }}
            onCloseClick={() => setSelectedPosition(null)}
          >
            <div>
              <h3>{selectedPosition.name}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}