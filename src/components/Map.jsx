'use strict'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

export default function Map() {
  const position = [60.1699, 24.9384];

  return (
    <div className="map-container">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>Bistro Dev</strong> <br /> Mannerheimintie 10, Helsinki
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}