import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation as useGlobalLocation } from "../../context/LocationContext";
import "./homePage.css";
import HeaderBar from "../../components/header/HeaderBar";
import weatherIcon from "../../assets/images/weather-icon.png";
import Autocomplete from "react-google-autocomplete";
import { FaSearchLocation } from "react-icons/fa";

const HomePage = () => {
  const [weather, setWeather] = useState(null);
  const [localCity, setLocalCity] = useState("Loading...");
  const { locationData, setLocationData } = useGlobalLocation();
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(`http://localhost:8000/api/weather/fetch-weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              setWeather(data);
              setLocationData({
                lat: latitude,
                lon: longitude,
                temperature: parseFloat(data.temperature),
                city: "Auto-detected",
                state: ""
              });
              setLocalCity("Auto-detected");
            });

          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              const cityName = data.address.city || data.address.town || data.address.village || "Auto-detected";
              setLocalCity(cityName);
              setLocationData((prev) => ({ ...prev, city: cityName }));
            });
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handlePlaceSelected = (place) => {
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();
    const formattedName =
      place.formatted_address || place.name || "Selected City";

    fetch(`http://localhost:8000/api/weather/fetch-weather?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLocationData({
          lat,
          lon,
          temperature: parseFloat(data.temperature),
          city: formattedName,
          state: ""
        });
        setLocalCity(formattedName);
      })
      .catch((err) => console.error("Weather fetch error:", err));

    setShowSearch(false);
  };

  return (
    <div className="home-page-container">
      <HeaderBar />
      <div className="home-container">
        <div className="weather-info">
          <div className="location-bar">
            <h1>{localCity}</h1>
            <FaSearchLocation className="search-icon" onClick={() => setShowSearch(!showSearch)} />
          </div>

          {showSearch && (
            <Autocomplete
              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{ types: ["(cities)"] }}
              className="autocomplete-input"
              placeholder="Search for a city..."
            />
          )}

          <div className="temp">{weather ? `${weather.temperature}` : "Loading..."}</div>
          <img src={weatherIcon} alt="Weather Icon" className="weather-icon" />
        </div>

        <div className="buttons">
          <button className="button browse-wardrobe" onClick={() => navigate("/wardrobe")}>
            Browse Wardrobe
          </button>
          <button className="button add-clothes" onClick={() => navigate("/upload")}>
            Add New Clothes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
