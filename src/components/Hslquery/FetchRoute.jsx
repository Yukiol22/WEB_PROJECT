
export default async function FetchRoute(userLat, userLon) {
  const endpoint = 'https://api.digitransit.fi/routing/v2/hsl/gtfs/v1';
  
  const query = `
    {
      plan(
        from: { lat: ${userLat}, lon: ${userLon} }
        to: { lat: 60.1685, lon: 24.9412 }
        numItineraries: 1
      ) {
        itineraries {
          duration
          legs {
            mode
            startTime
            endTime
            from { name }
            to { name }
            legGeometry {
              points
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'digitransit-subscription-key': import.meta.env.VITE_DIGITRANSIT_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Route data:', data);
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};
