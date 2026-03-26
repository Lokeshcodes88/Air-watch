import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import SensorCard from "../components/SensorCard";

// Coordinates for Open-Meteo Air Quality API (free, no API key)
const LOCATIONS = [
  { title: "Chennai",   id: "TN_001", lat: 13.0827, lon: 80.2707 },
  { title: "Bengaluru", id: "KA_014", lat: 12.9716, lon: 77.5946 },
  { title: "Hyderabad", id: "TS_009", lat: 17.3850, lon: 78.4867 },
  { title: "Delhi",     id: "DL_007", lat: 28.6139, lon: 77.2090 },
];

async function fetchAQIData(lat, lon) {
  const url =
    "https://air-quality-api.open-meteo.com/v1/air-quality" +
    "?latitude=" + lat +
    "&longitude=" + lon +
    "&current=pm2_5,pm10,us_aqi,european_aqi" +
    "&hourly=relative_humidity_2m,temperature_2m";

  const res = await fetch(url);
  const json = await res.json();

  const pm25 = json.current?.pm2_5 ?? 0;
  const temp = json.hourly?.temperature_2m?.[0] ?? 0;
  const humidity = json.hourly?.relative_humidity_2m?.[0] ?? 0;

  return {
    pm25: Math.round(pm25),
    temperature: Math.round(temp * 10) / 10,
    humidity: Math.round(humidity),
    co2: null, // not available from this API
  };
}

export default function Dashboard() {
  const [coimbatore, setCoimbatore] = useState(null);
  const [otherLocations, setOtherLocations] = useState(
    LOCATIONS.map((l) => ({ ...l, data: null, loading: true }))
  );

  // Live Firebase sensor — Coimbatore
  useEffect(() => {
    if (!db) return;
    const liveRef = ref(db, "airwatch/live/esp32_001");
    const unsub = onValue(liveRef, (snap) => setCoimbatore(snap.val()));
    return () => unsub();
  }, []);

  // Fetch real AQI for other locations
  useEffect(() => {
    LOCATIONS.forEach((loc, i) => {
      fetchAQIData(loc.lat, loc.lon)
        .then((data) => {
          setOtherLocations((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, data, loading: false } : item
            )
          );
        })
        .catch(() => {
          // fallback — mark as failed
          setOtherLocations((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, loading: false } : item
            )
          );
        });
    });
  }, []);

  return (
    <div className="p-10 space-y-12">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Air Quality Dashboard</h1>
        <p className="text-gray-500">Real-time monitoring</p>
      </div>

      {/* LIVE SENSOR PANEL */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Live Sensor – KCT</h2>
        <div className="flex flex-wrap gap-8">
          <SensorCard
            title="Kumaraguru college of Technology"
            id="ESP32_001"
            data={coimbatore}
            adjustAqi={-380}
          />
        </div>
      </section>

      {/* OTHER LOCATIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Other Locations
          <span className="ml-3 text-xs font-normal text-gray-400">
            via Open-Meteo Air Quality API
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherLocations.map((location, index) =>
            location.loading ? (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow w-[420px] max-w-full flex items-center justify-center h-48 text-gray-400 text-sm"
              >
                Fetching live data…
              </div>
            ) : location.data ? (
              <SensorCard
                key={index}
                title={location.title}
                id={location.id}
                data={location.data}
              />
            ) : (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow w-[420px] max-w-full flex items-center justify-center h-48 text-red-400 text-sm"
              >
                Failed to load data
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}