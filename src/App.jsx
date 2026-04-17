import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WeatherCard from "./components/WeatherCard";
import ForecastChart from "./components/ForecastChart";


export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [dark, setDark] = useState(true);
  
  // 🌍 FETCH WEATHER
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m`
      );

      const data = await res.json();

      setWeather(data.current_weather);
      setForecast(data.hourly?.temperature_2m?.slice(0, 12) || []);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📍 AUTO LOCATION
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      console.log("Location denied");

      // ❗ STOP loading if user denies location
      setLoading(false);
    }
  );
}, []);

  
  // 🔎 SEARCH CITY
  const searchCity = async () => {
    if (!city) return;

    setLoading(true);

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    const geoData = await geoRes.json();

    if (!geoData.results) {
      alert("City not found");
      setLoading(false);
      return;
    }

    
    const { latitude, longitude } = geoData.results[0];

    fetchWeather(latitude, longitude);
  };

  return (
    <div style={{ ...styles.bg,   background: dark ? styles.darkBg : styles.lightBg,}}>
     
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ ...styles.container, ...styles.glass }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={{ color: dark ? "#ffffff" :  "#0a51bbc5" }}>
  🌤 Weather
</h1>
<div
  onClick={() => setDark(!dark)}
  style={{
    ...styles.switch,
    background: dark ? "#0f172a" : "#e2e8f0",
    justifyContent: dark ? "flex-end" : "flex-start",
  }}
>
  <div style={styles.knob}>
    {dark ? "🌙" : "☀️"}
  </div>
</div>
          
        </div>

        {/* SEARCH */}
        <div style={styles.searchBox}>
          <input
            style={styles.input}
            placeholder="Enter city (e.g. London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button style={styles.button} onClick={searchCity}>
            Search
          </button>
        </div>

        {/* CONTENT */}
{loading && (
  <div
    className="wave-loader"
    style={{ color: dark ? "#ffffff" : "#0a51bbc5" }}
  >
    <span>L</span>
    <span>o</span>
    <span>a</span>
    <span>d</span>
    <span>i</span>
    <span>n</span>
    <span>g</span>
    <span>&nbsp;</span>
    <span>🌤</span>
  </div>
)}
        {!loading && weather && (
          <>
            <WeatherCard weather={weather} />
            <ForecastChart data={forecast} />
          </>
        )}

      </motion.div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "system-ui",
  },

  lightBg: "linear-gradient(135deg, rgb(255, 247, 237), rgb(177, 215, 221), rgb(177, 215, 221))",
  darkBg: "linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",

  container: {
    width: "420px",
    padding: "20px",
    borderRadius: "20px",
  },

  glass: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    color:"#000000",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  searchBox: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
    outline: "none",
  },

  button: {
    padding: "10px 15px",
    background: "#1582ff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  toggle: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#1582ff",
    color: "white",
  },

  text: {
    textAlign: "center",
  },
  
  switch: {
  width: "60px",
  height: "25px",
  borderRadius: "999px",
  padding: "4px",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",

  transition: "all 0.3s ease",

  // glass effect
  backdropFilter: "blur(12px)",
  boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
},

knob: {
  width: "24px",
  height: "24px",
  borderRadius: "50%",

  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "14px",

  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
},
};