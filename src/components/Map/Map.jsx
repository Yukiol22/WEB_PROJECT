'use strict';

import { MapContainer, TileLayer, Marker, Popup, Polyline,  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import * as polyline from '@mapbox/polyline';
import "./Map.css"
const MODE_COLORS = {
  WALK: '#888888',
  BUS: '#007AC9',
  TRAM: '#00985F',
  SUBWAY: '#FF6319',
  RAIL: '#8C4799'
};

//freaking this sucks still missing  and the query somehow work after 45h i put into this small thing
export default function Map({ route, userLocation }) {
  const destinationPos = [60.1699, 24.9384];
 
  if (route) {
    route.legs.forEach((leg, index) => {
      const legCoordinates = [
        [leg.from.lat, leg.from.lon],
        ...(leg.intermediateStops || []).map(stop => [stop.lat, stop.lon] ),
        [leg.to.lat, leg.to.lon]
      ];

      console.log(`Leg ${index + 1} (${leg.mode}) coordinates:`, legCoordinates);
    });
  } else {
    console.log("No route data received yet.");
  }

  return (
    <div className="map-container">
      <MapContainer
        center={destinationPos}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={destinationPos}>
          <Popup>
            <strong>Bistro Dev</strong><br /> Mannerheimintie 10, Helsinki
          </Popup>

        </Marker>
       {route && route.legs && route.legs.map((leg, index) => {
          const points = leg.legGeometry?.points
            ? polyline.decode(leg.legGeometry.points)
            : [
                [leg.from.lat, leg.from.lon],
                ...(leg.intermediateStops || []).map(s => [s.lat, s.lon]),
                [leg.to.lat, leg.to.lon]
              ];

          return (
  
            <Polyline
              key={`leg-${index}`}
              positions={points}
              pathOptions={{
                color: MODE_COLORS[leg.mode] || '#007AC9',
                weight: leg.mode === 'WALK' ? 4 : 6,
                dashArray: leg.mode === 'WALK' ? '6, 8' : null
              }}
            />
          );
        })}
     
      </MapContainer>
    </div>
  );
}