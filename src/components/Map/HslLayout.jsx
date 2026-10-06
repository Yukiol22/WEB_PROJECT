import { useState } from "react";
import { fetchRoadRoute, fetchRoutes } from "./HslFetch";
import Map from "./Map";
import TransitOption from "./TransitOption";
import "./HslLayout.css";

const travelModes = [
  { id: "car", label: "Car" },
  { id: "transit", label: "Public transportation" },
  { id: "walk", label: "Walk" },
  { id: "cycle", label: "Cycle" },
];

function getDistance(route) {
  let distance = 0;

  for (const leg of route.legs || []) {
    distance += leg.distance || 0;
  }

  return distance;
}

function showDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const extraMinutes = minutes % 60;
  return `${hours} h ${extraMinutes} min`;
}

export default function HslLayout() {
  const [mode, setMode] = useState("car");
  const [userLocation, setUserLocation] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [transitRoutes, setTransitRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [roadCoordinates, setRoadCoordinates] = useState(null);
  const [roadSummary, setRoadSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function chooseMode(newMode) {
    setMode(newMode);
    setActiveRoute(null);
    setTransitRoutes([]);
    setRoadCoordinates(null);
    setRoadSummary(null);
    setError("");
  }

  async function loadRoute(startLocation) {
    try {
      if (mode === "transit") {
        const routes = await fetchRoutes(startLocation);

        if (routes.length === 0) {
          throw new Error("No public transport route was found.");
        }

        setTransitRoutes(routes);
        setSelectedRoute(0);
        setActiveRoute(routes[0]);
      } else {
        const route = await fetchRoadRoute(startLocation, mode);
        setRoadCoordinates(route.coordinates);
        setRoadSummary(route);
        setActiveRoute(null);
      }
    } catch (routeError) {
      setError(routeError.message || "Could not load the route.");
    } finally {
      setLoading(false);
    }
  }

  function showRoute() {
    setError("");
    setTransitRoutes([]);
    setRoadSummary(null);
    setActiveRoute(null);
    setRoadCoordinates(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setUserLocation(startLocation);
        loadRoute(startLocation);
      },
      (locationError) => {
        if (locationError.code === 1) {
          setError("Allow location access to find a route.");
        } else {
          setError("Could not get your location. Please try again.");
        }

        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  function chooseTransitRoute(route, index) {
    setSelectedRoute(index);
    setActiveRoute(route);
  }

  return (
    <div className="route-planner">
      <h3>Find your route to Bistro Dev</h3>
      <p className="route-planner-hint">
        Choose how you are travelling, then show the route from your current location.
      </p>

      <div className="route-modes" role="group" aria-label="Travel method">
        {travelModes.map((travelMode) => (
          <button
            key={travelMode.id}
            type="button"
            className={`route-mode route-mode-${travelMode.id} ${mode === travelMode.id ? "selected" : ""}`}
            aria-pressed={mode === travelMode.id}
            onClick={() => chooseMode(travelMode.id)}
          >
            {travelMode.label}
          </button>
        ))}
      </div>

      <button
        className="show-route-button"
        type="button"
        onClick={showRoute}
        disabled={loading}
      >
        {loading ? "Finding route..." : "Show route"}
      </button>

      {error && <p className="route-error">{error}</p>}

      {roadSummary && mode !== "transit" && (
        <p className="route-summary">
          About {(roadSummary.distance / 1000).toFixed(1)} km - {showDuration(roadSummary.duration)}
        </p>
      )}

      {mode === "transit" && transitRoutes.length > 0 && (
        <div className="transit-results">
          {transitRoutes.map((route, index) => (
            <TransitOption
              key={index}
              route={route}
              selected={selectedRoute === index}
              onSelect={() => chooseTransitRoute(route, index)}
            />
          ))}
        </div>
      )}

      <Map
        route={activeRoute}
        routeCoordinates={roadCoordinates}
        userLocation={userLocation}
      />
    </div>
  );
}
