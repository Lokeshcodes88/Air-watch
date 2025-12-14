export function getAQIStatus(aqi) {
  if (aqi <= 50) return { label: "GOOD", color: "bg-green-100 text-green-700" };
  if (aqi <= 100) return { label: "MODERATE", color: "bg-yellow-100 text-yellow-700" };
  if (aqi <= 150) return { label: "UNHEALTHY FOR SENSITIVE", color: "bg-orange-100 text-orange-700" };
  return { label: "UNHEALTHY", color: "bg-red-100 text-red-700" };
}
