// src/components/HslFetch.jsx

export async function fetchRoutes(startCoords) {

  const startLat = Number(startCoords.lat);
  const startLon = Number(startCoords.lon);
  const destLat = 60.1699;
  const destLon = 24.9384;

  const query = `
    query GetFastestRoute {
      planConnection(
        origin: { location: { coordinate: { latitude: ${startLat}, longitude: ${startLon} } } }
        destination: { location: { coordinate: { latitude: ${destLat}, longitude: ${destLon} } } }
        first: 3
      ) {
        edges {
          node {
            duration
            legs {
              mode
              legGeometry {
              points
            }
              from {
                lat
                lon
              }
              to {
                lat
                lon
              }
              intermediateStops {
                lat
                lon
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.digitransit.fi/routing/v2/hsl/gtfs/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'digitransit-subscription-key': import.meta.env.VITE_DIGITRANSIT_API_KEY
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  const edges = data.data.planConnection.edges;
  return edges.map(edge => edge.node);
}