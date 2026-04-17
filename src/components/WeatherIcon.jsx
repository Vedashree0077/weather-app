import Lottie from "lottie-react";
import sun from "../animations/sun.json";
import cloud from "../animations/cloud.json";
import rain from "../animations/rain.json";

export default function WeatherIcon({ temperature, windspeed }) {
  const getAnim = () => {
    if (windspeed > 25) return rain;
    if (temperature > 30) return sun;
    return cloud;
  };

  return (
    <div>
      <Lottie animationData={getAnim()} loop />
    </div>
  );
}