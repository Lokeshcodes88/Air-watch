export default function Alerts() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Air Quality Alerts</h1>

      {[1,2,3].map(i => (
        <div key={i} className="bg-white p-6 rounded-xl shadow mb-4 border-l-4 border-orange-500">
          <h3 className="font-semibold">Delhi Central</h3>
          <p className="text-sm text-gray-500">Air quality is unhealthy</p>
          <p className="text-xs mt-1">AQI: 158 | Severity: unhealthy</p>
        </div>
      ))}
    </div>
  );
}
