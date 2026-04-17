export default function ForecastChart({ data }) {
  const chartData = (data || []).map((t, i) => ({
    time: `${i}h`,
    temp: t,

    // 🌤 ONLY ADD EMOJI (no UI change)
    icon:
      t >= 30
        ? "☀️"
        : t >= 20
        ? "⛅"
        : t >= 10
        ? "🌥️"
        : "🌧️",
  }));

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}> 12H Forecast</h3>

      <div style={styles.scroll}>
        {chartData.map((item, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.time}>
              {item.time} {item.icon} {/* 🌤 ONLY ADDED HERE */}
            </div>

            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.bar,
                  height: `${item.temp * 2}px`,
                }}
              />
            </div>

            <div style={styles.temp}>{item.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  scroll: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: 10,
  },

  card: {
    minWidth: 60,
    textAlign: "center",
    padding: "10px 5px",
    borderRadius: 15,
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    transition: "0.3s",
  },

  time: {
    fontSize: 12,
    opacity: 0.7,
  },

  barContainer: {
    height: 60,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    margin: "8px 0",
  },

  bar: {
    width: 8,
    background: "linear-gradient(180deg,#f97316,#fb923c)",
    borderRadius: 10,
    transition: "0.3s",
  },

  temp: {
    fontSize: 13,
    fontWeight: "500",
  },
};