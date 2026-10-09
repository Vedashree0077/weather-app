import WeatherIcon from "./WeatherIcon";

export default function WeatherCard({ weather, location }) {
  if (!weather) return null;

  const getCondition = (code) => {
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Current weather";
  };

  const getWeatherEmoji = (code, isDay) => {
    if ([95, 96, 99].includes(code)) return "⛈️";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2].includes(code)) return isDay ? "🌤️" : "☁️";
    return "☁️";
  };

  const condition = getCondition(weather.weatherCode);
  const emoji = getWeatherEmoji(weather.weatherCode, weather.isDay);

  const details = [
    {
      icon: "🌡️",
      label: "Feels like",
      value: `${Math.round(weather.feelsLike ?? weather.temperature)}°C`,
    },
    {
      icon: "💧",
      label: "Humidity",
      value: `${weather.humidity ?? "--"}%`,
    },
    {
      icon: "💨",
      label: "Wind speed",
      value: `${weather.windspeed ?? "--"} km/h`,
    },
    {
      icon: "🧭",
      label: "Wind direction",
      value: weather.winddirection != null
        ? `${weather.winddirection}°`
        : "--",
    },
  ];

  return (
    <div style={styles.card}>
    <p style={styles.eyebrow}>CURRENT WEATHER</p>

<h3 style={styles.location}>
  📍 {location || "Your Location"}
</h3>

      <div style={styles.main}>
        <span style={styles.weatherIcon}>{emoji}</span>
        <div>
          <h2 style={styles.temperature}>
            {Math.round(weather.temperature)}°
            <span style={styles.unit}>C</span>
          </h2>
          <p style={styles.condition}>{condition}</p>
        </div>
      </div>

      <p style={styles.description}>
        Weather conditions at your selected location
      </p>

      <div style={styles.divider} />

      <div style={styles.grid}>
        {details.map((item) => (
          <div key={item.label} style={styles.detail}>
            <span style={styles.detailIcon}>{item.icon}</span>
            <div>
              <p style={styles.label}>{item.label}</p>
              <p style={styles.value}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "520px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.68)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.75)",
    padding: "28px",
    borderRadius: "24px",
    margin: "20px auto",
    textAlign: "left",
    boxShadow: "0 12px 35px rgba(31, 38, 135, 0.12)",
    color: "#172554",
  },
  eyebrow: {
    margin: "0 0 20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "#64748b",
  },
  main: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  weatherIcon: {
    fontSize: "64px",
    lineHeight: 1,
  },
  temperature: {
    fontSize: "clamp(48px, 10vw, 68px)",
    lineHeight: 1,
    margin: 0,
    fontWeight: "700",
    letterSpacing: "-3px",
  },
  unit: {
    fontSize: "30px",
    letterSpacing: "0",
  },
  condition: {
    margin: "10px 0 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#334155",
  },
  description: {
    fontSize: "13px",
    color: "#64748b",
    margin: "20px 0",
  },
  divider: {
    height: "1px",
    background: "rgba(100, 116, 139, 0.2)",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px 12px",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  detailIcon: {
    fontSize: "24px",
  },
  label: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },
  value: {
    margin: "5px 0 0",
    fontSize: "16px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },
  
location: {
  margin: "0 0 20px",
  fontSize: "20px",
  fontWeight: "700",
  color: "#172554",
  overflowWrap: "anywhere",
},
};
