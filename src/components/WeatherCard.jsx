import WeatherIcon from "./WeatherIcon";
export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div style={styles.card}>
      <h2>🌡 {weather.temperature}°C</h2>
      <p>💨 Wind: {weather.windspeed} km/h</p>
      <p>🧭 Direction: {weather.winddirection}°</p>
    </div>
  );

}

const styles = {
  card: {
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "20px",
    marginTop: "20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
};