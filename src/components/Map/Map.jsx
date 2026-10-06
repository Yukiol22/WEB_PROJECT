import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import * as polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const restaurantLocation = [60.1699, 24.9384];

const transitColors = {
  WALK: "#888888",
  BUS: "#007AC9",
  TRAM: "#00985F",
  SUBWAY: "#FF6319",
  RAIL: "#8C4799",
};

function getLegCoordinates(leg) {
  if (leg.legGeometry && leg.legGeometry.points) {
    try {
      return polyline.decode(leg.legGeometry.points);
    } catch {
      // Use the stop locations below if the line cannot be decoded.
    }
  }

  const coordinates = [];

  if (leg.from) {
    coordinates.push([leg.from.lat, leg.from.lon]);
  }

  for (const stop of leg.intermediateStops || []) {
    coordinates.push([stop.lat, stop.lon]);
  }

  if (leg.to) {
    coordinates.push([leg.to.lat, leg.to.lon]);
  }

  return coordinates;
}

function FitRouteOnMap({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 1) {
      map.fitBounds(coordinates, { padding: [30, 30] });
    }
  }, [coordinates, map]);

  return null;
}

export default function Map({ route, routeCoordinates, userLocation }) {
  const transitCoordinates = [];

  if (route && route.legs) {
    for (const leg of route.legs) {
      const legCoordinates = getLegCoordinates(leg);
      transitCoordinates.push(...legCoordinates);
    }
  }

  let routeToShow = transitCoordinates;

  if (routeCoordinates) {
    routeToShow = routeCoordinates;
  }

  let userPosition = null;

  if (userLocation) {
    userPosition = [userLocation.lat, userLocation.lon];
  }

  return (
    <div className="map-container">
      <MapContainer
        center={restaurantLocation}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routeToShow.length > 1 && (
          <FitRouteOnMap coordinates={routeToShow} />
        )}

        <Marker position={restaurantLocation}>
          <Popup>
            <strong>Bistro Dev</strong>
            <br />
            Mannerheimintie 10, Helsinki
          </Popup>
        </Marker>

        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: "#2563eb", weight: 6 }}
          />
        )}

        {route && route.legs && route.legs.map((leg, index) => {
          const points = getLegCoordinates(leg);

          if (points.length < 2) {
            return null;
          }

          let color = transitColors[leg.mode];
          let lineStyle = {};

          if (!color) {
            color = "#007AC9";
          }

          if (leg.mode === "WALK") {
            lineStyle = { dashArray: "6, 8" };
          }

          return (
            <Polyline
              key={index}
              positions={points}
              pathOptions={{ color: color, weight: 5, ...lineStyle }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
