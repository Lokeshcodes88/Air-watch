import { useEffect, useState } from "react";

export default function ExternalData() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=11&longitude=77&current_weather=true")
      .then((res) => res.json())
      .then((data) => setWeather(data.current_weather));
  }, []);

  if (!weather) return <p>Loading external data...</p>;

  return (
    <div className="external">
      <h3>🌍 Outdoor Weather</h3>
      <p>Temperature: {weather.temperature} °C</p>
      <p>Wind Speed: {weather.windspeed} km/h</p>
    </div>
  );
}
