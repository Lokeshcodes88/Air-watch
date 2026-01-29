// utils/aqi.js

export function calculatePM25AQI(pm25) {
  const breakpoints = [
    { cLow: 0,   cHigh: 30,  iLow: 0,   iHigh: 50 },
    { cLow: 31,  cHigh: 60,  iLow: 51,  iHigh: 100 },
    { cLow: 61,  cHigh: 90,  iLow: 101, iHigh: 200 },
    { cLow: 91,  cHigh: 120, iLow: 201, iHigh: 300 },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
    { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
  ];

  const bp = breakpoints.find(
    b => pm25 >= b.cLow && pm25 <= b.cHigh
  );

  if (!bp) return 500;

  const { cLow, cHigh, iLow, iHigh } = bp;

  return Math.round(
    ((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow
  );
}

export function getAQIStatus(aqi) {
  if (aqi <= 50)
    return { label: "GOOD", color: "bg-green-100 text-green-700" };
  if (aqi <= 100)
    return { label: "MODERATE", color: "bg-yellow-100 text-yellow-700" };
  if (aqi <= 150)
    return { label: "UNHEALTHY FOR SENSITIVE", color: "bg-orange-100 text-orange-700" };

  return { label: "UNHEALTHY", color: "bg-red-100 text-red-700" };
}
