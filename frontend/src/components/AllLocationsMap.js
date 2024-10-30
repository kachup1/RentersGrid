import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = { width: "100%", height: "700px" };
const defaultCenter = [33.7701, -118.1937];
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function AllLocationsMap() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch markers from your API
  useEffect(() => {
    fetch("http://localhost:5000/api/map_markers")
      .then((response) => response.json())
      .then((properties) => {
        console.log("Fetched markers:", properties); // Debugging line to check markers data
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
      console.log("Initializing map..."); // Debug line
      const leafletMap = L.map('map').setView(defaultCenter, 14);

      L.tileLayer(darkTileUrl, {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 19,
      }).addTo(leafletMap);

      setMap(leafletMap);
    }
  }, [map]);

  // Function to handle marker click and navigate to SearchResults
  const handleMarkerClick = useCallback((landlordName) => {
    console.log("Handling marker click for landlord:", landlordName); // Debug line
    fetch(`http://localhost:5000/api/search?searchBy=landlord&query=${encodeURIComponent(landlordName)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received search results:", data);
        navigate('/SearchResults', { state: { results: data } });
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [navigate]);

  // Add markers to the map
  useEffect(() => {
    if (map && markers.length > 0) {
      console.log("Adding markers to map:", markers); // Debug line to confirm markers are ready

      markers.forEach((markerData, index) => {
        const icon = L.icon({
          iconUrl: pinIcon,
          iconSize: [55, 55],
        });

        const marker = L.marker([markerData.latitude, markerData.longitude], { icon })
          .addTo(map)
          .bindPopup(
            `<div>
              <strong>${markerData.property_name}</strong><br>
              Landlord: ${markerData.landlord_name}<br>
              <a href="#" class="popup-link-${index}">View Details</a>
            </div>`
          );

        // Using Leaflet's event listener to handle marker clicks
        marker.on('popupopen', () => {
          console.log("Popup opened for marker:", markerData); // Debug line
          
          const popupLink = document.querySelector(`.popup-link-${index}`);
          if (popupLink) {
            console.log("Popup link found for marker:", markerData.landlord_name); // Debug line
            popupLink.addEventListener('click', (e) => {
              e.preventDefault();
              console.log("Popup link clicked for marker:", markerData.landlord_name); // Debug line
              handleMarkerClick(markerData.landlord_name); // Trigger the search and navigation
            });
          } else {
            console.warn("Popup link not found for marker:", markerData.landlord_name); // Debug line
          }
        });
      });
    }
  }, [map, markers, handleMarkerClick]);

  return (
    <div>
      {error && <div>{error}</div>}
      <div id="map" style={mapContainerStyle}></div>
    </div>
  );
}

export default AllLocationsMap;
