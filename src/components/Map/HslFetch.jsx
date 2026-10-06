const restaurant = {
  latitude: 60.1699,
  longitude: 24.9384,
};

const transitUrl = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";

export async function fetchRoutes(startLocation) {
  const apiKey = import.meta.env.VITE_DIGITRANSIT_API_KEY;

  if (!apiKey) {
    throw new Error("Public transport needs a Digitransit API key.");
  }

  const query = `
    query GetRoutes {
      planConnection(
        origin: {
          location: {
            coordinate: {
              latitude: ${Number(startLocation.lat)}
              longitude: ${Number(startLocation.lon)}
            }
          }
        }
        destination: {
          location: {
            coordinate: {
              latitude: ${restaurant.latitude}
              longitude: ${restaurant.longitude}
            }
          }
        }
        first: 3
      ) {
        edges {
          node {
            duration
            legs {
              mode
              start { scheduledTime }
              end { scheduledTime }
              distance
              trip { routeShortName tripHeadsign }
              legGeometry { points }
              from { name lat lon }
              to { name lat lon }
              intermediateStops { name lat lon }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(transitUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": apiKey,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok || (data.errors && data.errors.length > 0)) {
    const message = data.errors?.[0]?.message;
    throw new Error(message || "Could not load public transport routes.");
  }

  const edges = data.data?.planConnection?.edges || [];
  const routes = [];

  for (const edge of edges) {
    routes.push(edge.node);
  }

  return routes;
}

export async function fetchRoadRoute(startLocation, mode) {
  let profile = "";

  if (mode === "car") {
    profile = "routed-car";
  } else if (mode === "walk") {
    profile = "routed-foot";
  } else if (mode === "cycle") {
    profile = "routed-bike";
  }

  if (!profile) {
    throw new Error("Choose a travel mode.");
  }

  const url = `https://routing.openstreetmap.de/${profile}/route/v1/driving/${startLocation.lon},${startLocation.lat};${restaurant.longitude},${restaurant.latitude}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.code !== "Ok" || !data.routes || data.routes.length === 0) {
    throw new Error("Could not find a route. Please try again.");
  }

  const roadRoute = data.routes[0];
  const coordinates = [];

  for (const point of roadRoute.geometry.coordinates) {
    const longitude = point[0];
    const latitude = point[1];
    coordinates.push([latitude, longitude]);
  }

  return {
    coordinates: coordinates,
    distance: roadRoute.distance,
    duration: roadRoute.duration,
  };
}
