import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg';

const mapContainerStyle = { width: "100%", height: "700px" };
const defaultCenter = [33.7701, -118.1937];
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export default function SearchResultsMap({ filteredResults }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!map) {
      const leafletMap = L.map('map').setView(defaultCenter, 14);
      L.tileLayer(darkTileUrl, {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 19,
      }).addTo(leafletMap);
      setMap(leafletMap);
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    // Clear previous markers
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    const newMarkers = filteredResults
      .map(result => {
        const property = result.properties?.[0];  // Access the first property in the array
        if (property && property.latitude && property.longitude) {
          const icon = L.icon({
            iconUrl: pinIcon,
            iconSize: [55, 55],
          });
          
          return L.marker([property.latitude, property.longitude], { icon })
            .addTo(map)
            .bindPopup(`<strong>${property.propertyname || "Unknown Property"}</strong><br>Landlord: ${result.name || "Unknown Landlord"}`);
        }
        return null;
      })
      .filter(marker => marker !== null);

    setMarkers(newMarkers);
  }, [filteredResults, map]);

  return (
    <div id="map" style={mapContainerStyle}></div>
  );
}
