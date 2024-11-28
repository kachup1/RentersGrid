import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MapProvider } from './MapContext'; // Import the MapProvider

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>
);
