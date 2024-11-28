import React, { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.svg';
import currentLocationIcon from '../Assets/current-location.svg';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: "100%",
  height: "720px",
  borderRadius: "10px", // Curved edges
  overflow: "hidden"    // Ensure content stays within curved edges
};

const defaultCenter = [33.7701, -118.1937]; // Default center coordinates
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

function AllLocationsMap() {
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); // Ref to hold the Leaflet map instance
  const markerRefs = useRef([]); // Ref to store markers for cleanup if needed
  const navigate = useNavigate();

  // Fetch markers from your API
  useEffect(() => {
    fetch("/api/map_markers")
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
    if (!mapRef.current) {
      const leafletMap = L.map('map').setView(defaultCenter, 13);

      L.tileLayer(darkTileUrl, {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 19,
      }).addTo(leafletMap);

      mapRef.current = leafletMap; // Store map instance in ref
    }
  }, []);

  // Function to handle marker click and navigate to SearchResults
  const handleMarkerClick = useCallback((landlordName) => {
    fetch(`http://localhost:5000/api/search?searchBy=landlord&query=${encodeURIComponent(landlordName)}`)
      .then((response) => response.json())
      .then((data) => {
        navigate('/SearchResults', { state: { results: data } });
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [navigate]);

  // Add markers to the map
  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      // Add new markers without reinitializing the map
      const newMarkers = markers.map((markerData, index) => {
        const icon = L.icon({
          iconUrl: pinIcon,
          iconSize: [30, 30],
        });

        const marker = L.marker([markerData.latitude, markerData.longitude], { icon })
          .addTo(mapRef.current)
          .bindPopup(
            `<div>
              <strong>${markerData.property_name}</strong><br>
              Landlord: ${markerData.landlord_name}<br>
              <a href="#" class="popup-link-${index}">View Details</a>
            </div>`
          );

        marker.on('popupopen', () => {
          const popupLink = document.querySelector(`.popup-link-${index}`);
          if (popupLink) {
            popupLink.addEventListener('click', (e) => {
              e.preventDefault();
              handleMarkerClick(markerData.landlord_name);
            });
          }
        });

        return marker;
      });

      // Store markers for cleanup if needed
      markerRefs.current = newMarkers;
    }
  }, [markers, handleMarkerClick]);

  // Function to fetch and show the user's current location
  const showCurrentLocation = useCallback(() => {
    if (!mapRef.current) return; // Ensure map is initialized

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const currentIcon = L.icon({
            iconUrl: currentLocationIcon,
            iconSize: [30, 30],
          });

          // Add a marker for the user's current location
          L.marker([latitude, longitude], { icon: currentIcon })
            .addTo(mapRef.current)
            .bindPopup("You are here.")
            .openPopup();

          // Center the map on the user's location
          mapRef.current.setView([latitude, longitude], 14);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Request location once when the map is mounted
  useEffect(() => {
    if (mapRef.current) {
      showCurrentLocation();
    }
  }, [showCurrentLocation]);

  return (
    <div>
      {error && <div>{error}</div>}
      <div id="map" style={mapContainerStyle}></div>
    </div>
  );
}

export default AllLocationsMap;
