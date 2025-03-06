import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css";
import HeaderBar from "../../components/header/HeaderBar";
import weatherIcon from "../../assets/images/weather-icon.png";

const HomePage = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: "", state: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch weather using lat/lon
          fetch(`http://localhost:8000/api/weather/fetch-weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch((err) => console.error("Error fetching weather:", err));

          // Fetch city name using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.address) {
                setLocation({ city: data.address.city || "Unknown City", state: data.address.state || "Unknown State" });
              }
            })
            .catch((err) => console.error("Error fetching location:", err));
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  return (
    <div className="home-page-container">
      <HeaderBar />
      <div className="home-container">
        <div className="weather-info">
          <h1>{location.city ? location.city : "Loading..."}</h1>
          <div className="temp">{weather ? `${weather.temperature}` : "Loading..."}</div>
          <img src={weatherIcon} alt="Weather Icon" className="weather-icon" />

        </div>
        <div className="buttons">
          <button className="button browse-wardrobe"  onClick={() => navigate("/wardrobe")}>Browse Wardrobe</button>
          <button className="button add-clothes"  onClick={() => navigate("/upload")}>Add New Clothes</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
