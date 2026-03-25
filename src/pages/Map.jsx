import { useEffect, useRef } from "react";

const locations = [
  {
    title: "Kumaraguru college of Technology",
    id: "ESP32_001",
    lat: 11.0813,
    lng: 76.9901,
    data: { pm25: null, humidity: null, temperature: null, co2: null },
  },
  {
    title: "Chennai",
    id: "TN_001",
    lat: 13.0827,
    lng: 80.2707,
    data: { pm25: 142, humidity: 62, temperature: 30.1, co2: 420 },
  },
  {
    title: "Bengaluru",
    id: "KA_014",
    lat: 12.9716,
    lng: 77.5946,
    data: { pm25: 88, humidity: 55, temperature: 26.4, co2: 380 },
  },
  {
    title: "Hyderabad",
    id: "TS_009",
    lat: 17.385,
    lng: 78.4867,
    data: { pm25: 176, humidity: 48, temperature: 32.2, co2: 510 },
  },
  {
    title: "Delhi",
    id: "DL_007",
    lat: 28.6139,
    lng: 77.209,
    data: { pm25: 310, humidity: 41, temperature: 29.8, co2: 650 },
  },
];

function getAqiColor(pm25) {
  if (pm25 === null) return "#6366f1";
  if (pm25 <= 50) return "#22c55e";
  if (pm25 <= 100) return "#eab308";
  if (pm25 <= 150) return "#f97316";
  if (pm25 <= 200) return "#ef4444";
  return "#7c3aed";
}

function getAqiLabel(pm25) {
  if (pm25 === null) return "Live";
  if (pm25 <= 50) return "Good";
  if (pm25 <= 100) return "Moderate";
  if (pm25 <= 150) return "Unhealthy (Sensitive)";
  if (pm25 <= 200) return "Unhealthy";
  return "Hazardous";
}

function buildIconHtml(title, color) {
  return (
    '<div style="display:flex;flex-direction:column;align-items:center;">' +
    '<div style="background:' + color + ';color:white;font-size:11px;font-weight:600;' +
    'font-family:sans-serif;padding:4px 8px;border-radius:8px;white-space:nowrap;' +
    'box-shadow:0 2px 6px rgba(0,0,0,0.25);margin-bottom:4px;">' +
    title +
    "</div>" +
    '<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="' + color + '"/>' +
    '<circle cx="14" cy="14" r="6" fill="white"/>' +
    "</svg>" +
    "</div>"
  );
}

function buildPopupHtml(loc, color, label) {
  const pm25 = loc.data.pm25 !== null ? loc.data.pm25 + " µg/m³" : "Live…";
  const temp = loc.data.temperature !== null ? loc.data.temperature + "°C" : "—";
  const hum = loc.data.humidity !== null ? loc.data.humidity + "%" : "—";
  const co2 = loc.data.co2 !== null ? loc.data.co2 + " ppm" : "—";

  return (
    '<div style="font-family:sans-serif;min-width:160px;">' +
    '<div style="font-size:15px;font-weight:700;margin-bottom:4px;color:#1e293b;">' + loc.title + "</div>" +
    '<div style="font-size:11px;color:#64748b;margin-bottom:8px;">Sensor ID: ' + loc.id + "</div>" +
    '<div style="display:inline-block;background:' + color + ';color:white;font-size:11px;' +
    'font-weight:600;padding:2px 8px;border-radius:12px;margin-bottom:10px;">' + label + "</div>" +
    '<table style="width:100%;font-size:12px;border-collapse:collapse;">' +
    "<tr><td style=\"color:#64748b;padding:2px 0;\">PM2.5</td><td style=\"font-weight:600;text-align:right;\">" + pm25 + "</td></tr>" +
    "<tr><td style=\"color:#64748b;padding:2px 0;\">Temperature</td><td style=\"font-weight:600;text-align:right;\">" + temp + "</td></tr>" +
    "<tr><td style=\"color:#64748b;padding:2px 0;\">Humidity</td><td style=\"font-weight:600;text-align:right;\">" + hum + "</td></tr>" +
    "<tr><td style=\"color:#64748b;padding:2px 0;\">CO2</td><td style=\"font-weight:600;text-align:right;\">" + co2 + "</td></tr>" +
    "</table></div>"
  );
}

export default function Map() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const loadLeaflet = () =>
      new Promise((resolve) => {
        if (window.L) return resolve(window.L);
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      });

    loadLeaflet().then((L) => {
      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      locations.forEach((loc) => {
        const color = getAqiColor(loc.data.pm25);
        const label = getAqiLabel(loc.data.pm25);

        const svgIcon = L.divIcon({
          className: "",
          html: buildIconHtml(loc.title, color),
          iconSize: [80, 60],
          iconAnchor: [40, 60],
          popupAnchor: [0, -62],
        });

        L.marker([loc.lat, loc.lng], { icon: svgIcon })
          .addTo(map)
          .bindPopup(buildPopupHtml(loc, color, label), { maxWidth: 220 });
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const legend = [
    { color: "#22c55e", label: "Good (0-50)" },
    { color: "#eab308", label: "Moderate (51-100)" },
    { color: "#f97316", label: "Unhealthy S (101-150)" },
    { color: "#ef4444", label: "Unhealthy (151-200)" },
    { color: "#7c3aed", label: "Hazardous (200+)" },
    { color: "#6366f1", label: "Live sensor" },
  ];

  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Air Quality Map</h1>
        <p className="text-gray-500">
          Monitoring stations across India — click a pin to see details
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {legend.map(({ color, label }) => (
          <span
            key={label}
            className="flex items-center gap-2 text-xs bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
          >
            <span
              style={{ background: color }}
              className="w-3 h-3 rounded-full inline-block"
            />
            {label}
          </span>
        ))}
      </div>

      <div
        ref={mapRef}
        style={{ height: "540px", borderRadius: "16px", overflow: "hidden" }}
        className="shadow-lg border border-gray-200"
      />
    </div>
  );
}