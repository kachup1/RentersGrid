import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg';

const mapContainerStyle = { width: "100%", 
  height: "800px",
  borderRadius: "30px", // Curved edges
  overflow: "hidden"    // Ensure content stays within curved edges 
  };
const defaultCenter = [33.7701, -118.1937];
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export default function SearchResultsMap({ filteredResults, onMarkerClick }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
//initializes the map using the Leaflet library and using hooks
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

    // Add new markers and set click event
    const newMarkers = filteredResults.map((result, index) => {
      const property = result.properties?.[0];
      if (property && property.latitude && property.longitude) {
        const icon = L.icon({
          iconUrl: pinIcon,
          iconSize: [55, 55],
        });

        const marker = L.marker([property.latitude, property.longitude], { icon })
          .addTo(map)
          .bindPopup(`<strong>${property.propertyname || "Unknown Property"}</strong><br>Landlord: ${result.name || "Unknown Landlord"}`);

        // Handle click event on the marker
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(index); // Pass the index of the clicked marker
          }
        });

        return marker;
      }
      return null;
    }).filter(marker => marker !== null);

    setMarkers(newMarkers);
  }, [filteredResults, map, onMarkerClick]);

  return <div id="map" style={mapContainerStyle}></div>;
}
