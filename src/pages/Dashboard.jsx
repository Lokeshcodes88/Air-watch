import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import SensorCard from "../components/SensorCard";

export default function Dashboard() {
  const [coimbatore, setCoimbatore] = useState(null);

  // 🔹 You can later replace this with Firebase / API data
  const otherLocations = [
    {
      title: "Chennai",
      id: "TN_001",
      data: { pm25: 142, humidity: 62, temperature: 30.1, co2: 420 },
    },
    {
      title: "Bengaluru",
      id: "KA_014",
      data: { pm25: 88, humidity: 55, temperature: 26.4, co2: 380 },
    },
    {
      title: "Hyderabad",
      id: "TS_009",
      data: { pm25: 176, humidity: 48, temperature: 32.2, co2: 510 },
    },
    {
      title: "Delhi",
      id: "DL_007",
      data: { pm25: 310, humidity: 41, temperature: 29.8, co2: 650 },
    },
  ];

  useEffect(() => {
    const liveRef = ref(db, "airwatch/live/esp32_001");

    const unsub = onValue(liveRef, (snapshot) => {
      setCoimbatore(snapshot.val());
    });

    return () => unsub();
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
        <h2 className="text-xl font-semibold mb-4">
          Live Sensor – Coimbatore
        </h2>

        <div className="flex flex-wrap gap-8">
          <SensorCard
            title="Coimbatore"
            id="ESP32_001"
            data={coimbatore}
          />
        </div>
      </section>

      {/* OTHER LOCATIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Other Locations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherLocations.map((location, index) => (
            <SensorCard
              key={index}
              title={location.title}
              id={location.id}
              data={location.data}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
