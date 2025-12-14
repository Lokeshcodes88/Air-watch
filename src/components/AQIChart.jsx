import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const METRICS = {
  aqi: { label: "AQI", color: "#1FA3D6" },
  pm25: { label: "PM2.5", color: "#60a5fa" },
  co2: { label: "CO₂", color: "#f97316" },
  temperature: { label: "Temperature", color: "#ef4444" },
  humidity: { label: "Humidity", color: "#22c55e" },
};

const RANGE = {
  "1H": 3600,
  "24H": 86400,
  "7D": 604800,
};

export default function AQIChart() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("aqi");
  const [range, setRange] = useState("24H");

  useEffect(() => {
    const historyRef = ref(db, "airwatch/history/esp32_001");

    onValue(historyRef, (snap) => {
      const raw = snap.val();
      if (!raw) return;

      const now = Date.now() / 1000;
      const limit = RANGE[range];

      const formatted = Object.entries(raw)
        .map(([ts, v]) => {
          const pm25 = v.pm25 ?? 0;
          return {
            time: format(new Date(ts * 1000), "HH:mm"),
            aqi: Math.round(pm25 * 2.5),
            pm25,
            co2: v.co2 ?? 0,
            temperature: v.temperature ?? 0,
            humidity: v.humidity ?? 0,
          };
        })
        .filter((d, i, arr) => now - Number(Object.keys(raw)[i]) <= limit)
        .sort((a, b) => a.time.localeCompare(b.time));

      setData(formatted);
    });
  }, [range]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold">
          Historical Air Quality
        </h2>

        {/* RANGE SELECTOR */}
        <div className="flex gap-2">
          {Object.keys(RANGE).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1 rounded-full text-sm ${
                range === r
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC SELECTOR */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {Object.entries(METRICS).map(([key, m]) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className={`px-4 py-2 rounded-xl text-sm border ${
              metric === key
                ? "bg-primary text-white border-primary"
                : "bg-white border-gray-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey={metric}
              stroke={METRICS[metric].color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
