import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

import FirstIntroPage from "./pages/intro/first/FirstIntroPage";
import SecondIntroPage from "./pages/intro/second/SecondIntroPage";
import ThirdIntroPage from "./pages/intro/third/ThirdIntroPage";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import UploadPage from "./pages/uploadImage/UploadPage";
import ImageDetails from "./pages/imageDetails/imageDetails";
import Wardrobe from "./pages/wardrobe/Wardrobe";
import HomePage from "./pages/landingpage/homePage";
import RecommendationPage from "./pages/recommendationPage/recommendation";
import Profile from "./pages/Profile";
import AboutUs from './pages/landingpage/AboutUs';

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FirstIntroPage />} />
            <Route path="/secondIntro" element={<SecondIntroPage />} />
            <Route path="/thirdIntro" element={<ThirdIntroPage />} />
              <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/details/:id" element={<ImageDetails />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/recommendation/:id" element={<RecommendationPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
