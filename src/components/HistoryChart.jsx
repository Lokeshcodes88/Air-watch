import { ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import "chart.js/auto";

export default function HistoryChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const historyRef = ref(db, "airwatch/history/esp32_001");

    onValue(historyRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const raw = snapshot.val();
      const labels = Object.keys(raw);

      setChartData({
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: labels.map((t) => raw[t].temperature),
            borderWidth: 2
          },
          {
            label: "CO (ppm)",
            data: labels.map((t) => raw[t].co2),
            borderWidth: 2
          }
        ]
      });
    });
  }, []);

  if (!chartData) return <p>Loading history...</p>;

  return <Line data={chartData} />;
}
