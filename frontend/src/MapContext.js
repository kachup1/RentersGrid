import React, { createContext, useState, useRef } from 'react';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null); // Ref for storing the map instance

  return (
    <MapContext.Provider value={{ mapRef, markers, setMarkers }}>
      {children}
    </MapContext.Provider>
  );
};
