"use client"
import { useState } from 'react';
import { fetchRoutes } from './HslFetch';
import Map from './Map';

export default function HslLayout() {
  const [userLocation, setUserLocation] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      setUserLocation(coords);

      const routes = await fetchRoutes(coords);
      console.log("Fetched Routes from API:", routes);

      if (routes && routes.length > 0) {
        setActiveRoute(routes[0]);
      }
    });
  };

  return (
    <div>
      <button onClick={handleGetLocation}>Get User Location</button>
      {userLocation && (
        <p>
          Latitude: {userLocation.lat} <br />
          Longitude: {userLocation.lon}
        </p>
      )}
      <Map route={activeRoute} userLocation={userLocation} />
    </div>
  );
}