import { Wind, Droplet, Thermometer, Factory } from "lucide-react";
import { calculatePM25AQI, getAQIStatus } from "../utils/aqi";


export default function SensorCard({ title, id, data }) {
  if (!data) return null;

  const pm25 = Number(data.pm25 ?? 0);
  const humidity = Number(data.humidity ?? 0);
  const temperature = Number(data.temperature ?? 0);
  const co2 = Number(data.co2 ?? 0);

  const aqi = calculatePM25AQI(pm25);
  const status = getAQIStatus(aqi);

  return (
    <div className="bg-white rounded-2xl p-8 shadow w-[420px] max-w-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{id}</p>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* AQI */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold text-primary">{aqi}</h1>
        <p className="text-xs tracking-widest text-gray-500 mt-1">
          AIR QUALITY INDEX
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <Metric icon={<Wind size={20} />} value={pm25} label="PM2.5" />
        <Metric icon={<Droplet size={20} />} value={`${humidity}%`} label="Humidity" />
        <Metric icon={<Thermometer size={20} />} value={`${temperature}°`} label="Temp" />
        <Metric icon={<Factory size={20} />} value={`${co2} ppm`} label="CO₂" />
      </div>
    </div>
  );
}

function Metric({ icon, value, label }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-center mb-2 text-primary">
        {icon}
      </div>
      <p className="font-semibold text-sm">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
