import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg'; // Your custom icon for markers

const mapContainerStyle = { width: "100%", height: "700px" };
const defaultCenter = [33.7701, -118.1937]; // Default center as [lat, lng]

// Dark mode tiles URL (using CartoDB dark theme as an example)
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export default function AllLocationsMap() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch markers from your API
  useEffect(() => {
    fetch("http://localhost:5000/api/map_markers")
      .then((response) => response.json())
      .then((properties) => {
        setMarkers(properties);
      })
      .catch((error) => {
        console.error("Error fetching markers:", error);
        setError("Failed to load markers. Please try again later.");
      });
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!map) {
      const leafletMap = L.map('map').setView(defaultCenter, 14);

      // Add dark-themed tile layer
      L.tileLayer(darkTileUrl, {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 19,
      }).addTo(leafletMap);

      setMap(leafletMap);
    }
  }, [map]);

  // Add markers to the map
  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach((markerData) => {
        // Create a custom icon
        const icon = L.icon({
          iconUrl: pinIcon,
          iconSize: [55, 55], // Adjust the icon size
        });

        // Add marker to map with custom icon
        L.marker([markerData.latitude, markerData.longitude], { icon })
          .addTo(map)
          .bindPopup(`<strong>${markerData.property_name}</strong><br>Landlord: ${markerData.landlord_name}`);
      });
    }
  }, [map, markers]);

  return (
    <div>
      {error && <div>{error}</div>}
      <div id="map" style={mapContainerStyle}></div>
    </div>
  );
}
