import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css";
import HeaderBar from "../../components/header/HeaderBar";
import weatherIcon from "../../assets/images/weather-icon.png";
import Autocomplete from "react-google-autocomplete";
import { FaSearchLocation } from "react-icons/fa";

const HomePage = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: "", state: "" });
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(`http://localhost:8000/api/weather/fetch-weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch((err) => console.error("Error fetching weather:", err));

          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.address) {
                setLocation({
                  city: data.address.city || data.address.town || data.address.village || "Unknown City",
                  state: data.address.state || "Unknown State",
                });
              }
            })
            .catch((err) => console.error("Error fetching location:", err));
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  const handlePlaceSelected = (place) => {
    console.log("Selected Place:", place);

    if (!place.geometry || !place.geometry.location) {
      alert("Please select a valid place from the list.");
      return;
    }

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();
    console.log("Coordinates:", lat, lon);

    fetch(`http://localhost:8000/api/weather/fetch-weather?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Weather API response:", data);
        setWeather(data);
      })
      .catch((err) => console.error("Weather fetch error:", err));

    const formattedName =
      place.formatted_address ||
      place.name ||
      (place.address_components && place.address_components[0].long_name) ||
      "Selected City";

    setLocation({ city: formattedName, state: "" });
    setShowSearch(false);
  };

  return (
    <div className="home-page-container">
      <HeaderBar />
      <div className="home-container">
        <div className="weather-info">
          <div className="location-bar">
            <h1>{location.city ? location.city : "Loading..."}</h1>
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
