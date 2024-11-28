import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg';

const mapContainerStyle = {
  width: "750px", 
  height: "720px",
  borderRadius: "10px",
  overflow: "hidden"
  };
const defaultCenter = [33.7701, -118.1937];
const darkTileUrl =  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export default function SearchResultsMap({ filteredResults, onMarkerClick }) {

  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null); // Add this for the map instance
  const markerRefs = useRef([]); // Add this for tracking markers

//initializes the map using the Leaflet library and using hooks
useEffect(() => {
  if (!mapRef.current) {
    const leafletMap = L.map('map').setView(defaultCenter, 14);
    L.tileLayer(darkTileUrl, {
      attribution: '&copy; OpenStreetMap contributors & CartoDB',
      maxZoom: 19,
    }).addTo(leafletMap);

    mapRef.current = leafletMap; // Store the map instance in ref
  }
}, []); // Replace the existing map initialization logic with this

const navigate = useNavigate();

useEffect(() => {
  if (!mapRef.current) return;

  // Clear previous markers
  markerRefs.current.forEach(marker => marker.remove());
  markerRefs.current = [];

  // Add new markers
  const newMarkers = filteredResults.map((result, index) => {
    const property = result.properties?.[0];
    if (property && property.latitude && property.longitude) {
      const icon = L.icon({
        iconUrl: pinIcon,
        iconSize: [55, 55],
      });

      const marker = L.marker([property.latitude, property.longitude], { icon })
      .addTo(mapRef.current)
      .bindPopup(
        `<div>
          <strong>${property.propertyname || "Unknown Property"}</strong><br>
          Landlord: ${result.name || "Unknown Landlord"}<br>
          <a href="#" class="popup-link-${index}">View Details</a>
        </div>`
      );

    // Navigate to landlord profile on "Details" click
    marker.on('popupopen', () => {
      const popupLink = document.querySelector(`.popup-link-${index}`);
      if (popupLink) {
        popupLink.addEventListener('click', (e) => {
          e.preventDefault();
          navigate(`/LandlordProfile/${result.landlordId}`); // Redirect to landlord profile
        });
      }
    });


      return marker; // Return the marker to be added to refs
    }
    return null;
  }).filter(marker => marker !== null);

  markerRefs.current = newMarkers; // Store new markers in refs for future updates
}, [filteredResults, onMarkerClick]);

  return <div id="map" style={mapContainerStyle}></div>;
}
