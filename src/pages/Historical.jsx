import AQIChart from "../components/AQIChart";

export default function Historical() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-2">
        Historical Data & Predictions
      </h1>
      <p className="text-gray-500 mb-6">
        Analyze trends
      </p>

      <AQIChart />
    </div>
  );
}
