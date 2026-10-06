const lineColors = {
  BUS: "#0876ba",
  TRAM: "#00985f",
  SUBWAY: "#d64000",
  RAIL: "#8246af",
  WALK: "#707783",
};

function showTime(timestamp) {
  if (!timestamp) {
    return "--:--";
  }

  let timeValue = Number(timestamp);

  if (!Number.isNaN(timeValue) && timeValue < 100000000000) {
    timeValue = timeValue * 1000;
  }

  if (Number.isNaN(timeValue)) {
    timeValue = timestamp;
  }

  const time = new Date(timeValue);
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
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

export default function TransitOption({ route, selected, onSelect }) {
  const legs = route.legs || [];
  let distance = 0;

  for (const leg of legs) {
    distance += leg.distance || 0;
  }

  let departure = "";
  let arrival = "";

  if (legs.length > 0) {
    departure = legs[0].start?.scheduledTime;
    arrival = legs[legs.length - 1].end?.scheduledTime;
  }

  return (
    <button
      className={`transit-option ${selected ? "selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="transit-option-heading">
        <strong>{showTime(departure)} - {showTime(arrival)}</strong>
        <strong>{showDuration(route.duration)}</strong>
      </span>

      <span className="transit-leg-list">
        {legs.map((leg, index) => {
          const line = leg.trip?.routeShortName || leg.mode;
          let label = leg.mode;

          if (leg.mode === "WALK") {
            label = "Walk";
          } else {
            label = `${leg.mode.toLowerCase()} ${line}`;
          }

          return (
            <span className="transit-leg" key={`${line}-${index}`}>
              <span
                className="transit-leg-mode"
                style={{ backgroundColor: lineColors[leg.mode] || "#43536a" }}
              >
                {label}
              </span>
              {index < legs.length - 1 && (
                <span className="transit-transfer">&gt;</span>
              )}
            </span>
          );
        })}
      </span>

      <span className="transit-option-footer">
        <span>
          {legs[0]?.from?.name || "Your location"} - {legs[legs.length - 1]?.to?.name || "Bistro Dev"}
        </span>
        {distance > 0 && <span>{(distance / 1000).toFixed(1)} km</span>}
      </span>
    </button>
  );
}
