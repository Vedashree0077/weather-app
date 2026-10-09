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
  const [error, setError] = useState("");

  // 🌍 FETCH WEATHER
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m` +
        `&hourly=temperature_2m` +
        `&forecast_days=2` +
        `&timezone=auto`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Weather service is unavailable.");
      }

      const data = await res.json();

      if (!data.current || !data.hourly) {
        throw new Error("Weather data is unavailable.");
      }

      // Match the fields expected by WeatherCard.jsx
      setWeather({
        temperature: data.current.temperature_2m,
        windspeed: data.current.wind_speed_10m,
        winddirection: data.current.wind_direction_10m,
      });

      // ForecastChart expects an array of temperatures.
      const currentTimeIndex = data.hourly.time.findIndex(
        (time) => time === data.current.time
      );

      const startIndex =
        currentTimeIndex >= 0
          ? currentTimeIndex
          : data.hourly.time.findIndex(
              (time) => time > data.current.time
            );

      const safeStartIndex = Math.max(0, startIndex);

      setForecast(
        data.hourly.temperature_2m.slice(
          safeStartIndex,
          safeStartIndex + 12
        )
      );
    } catch (err) {
      console.error("Weather API error:", err);
      setError(err.message || "Unable to load weather.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // 📍 AUTO LOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      setError("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(
          pos.coords.latitude,
          pos.coords.longitude
        );
      },
      () => {
        setLoading(false);
        setError(
          "Location permission denied. Search for a city to see its weather."
        );
      },
      {
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // 🔎 SEARCH CITY
  const searchCity = async (event) => {
    event?.preventDefault();

    const searchName = city.trim();

    if (!searchName) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geoUrl =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(searchName)}` +
        `&count=10&language=en&format=json`;

      const geoRes = await fetch(geoUrl);

      if (!geoRes.ok) {
        throw new Error("Unable to search for this city.");
      }

      const geoData = await geoRes.json();
      const results = geoData.results || [];

      if (results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
      }

      // Prefer Delhi, India when searching for Delhi.
   
      // Select the correct city
      const normalizedCity = searchName.trim().toLowerCase();

      // Use the same coordinates for both Mangalore spellings
      if (
        normalizedCity === "mangalore" ||
        normalizedCity === "mangaluru"
      ) {
        await fetchWeather(12.899824, 74.87738);
        return;
      }

      
      const selectedPlace =
        normalizedCity === "delhi"
          ? results.find(
              (place) =>
                place.country_code === "IN" &&
                place.name.toLowerCase() === "delhi"
            )
          : results[0];

      if (!selectedPlace) {
        throw new Error("City not found. Please check the spelling.");
      }

      await fetchWeather(
        selectedPlace.latitude,
        selectedPlace.longitude
      );
    } catch (err) {
      console.error("City search error:", err);
      setWeather(null);
      setForecast([]);
      setError(err.message || "Unable to search for this city.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.bg,
        background: dark ? styles.darkBg : styles.lightBg,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ ...styles.container, ...styles.glass }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <h1
            style={{
              color: dark ? "#ffffff" : "#0a51bbc5",
            }}
          >
            🌤 Weather
          </h1>

          <div
            role="button"
            tabIndex={0}
            aria-label="Toggle dark and light theme"
            onClick={() => setDark(!dark)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setDark(!dark);
              }
            }}
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
        <form style={styles.searchBox} onSubmit={searchCity}>
          <input
            style={styles.input}
            placeholder="Enter city (e.g. Delhi)"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="City name"
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            Search
          </button>
        </form>

        {/* LOADING */}
        {loading && (
          <div
            className="wave-loader"
            style={{
              color: dark ? "#ffffff" : "#0a51bbc5",
            }}
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

        {/* ERROR */}
        {!loading && error && (
          <p
            role="alert"
            style={{
              textAlign: "center",
              color: dark ? "#fecaca" : "#b91c1c",
            }}
          >
            {error}
          </p>
        )}

        {/* WEATHER CONTENT */}
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
    padding: "20px",
    boxSizing: "border-box",
  },

  lightBg:
    "linear-gradient(135deg, rgb(255, 247, 237), rgb(177, 215, 221), rgb(177, 215, 221))",

  darkBg:
    "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",

  container: {
    width: "420px",
    maxWidth: "100%",
    padding: "20px",
    borderRadius: "20px",
    boxSizing: "border-box",
  },

  glass: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    color: "#000000",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  searchBox: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    minWidth: 0,
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

  switch: {
    width: "60px",
    height: "25px",
    borderRadius: "999px",
    padding: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    transition: "all 0.3s ease",
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
