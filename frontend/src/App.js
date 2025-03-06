import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstIntroPage from "./pages/intro/first/FirstIntroPage";
import SecondIntroPage from "./pages/intro/second/SecondIntroPage";
import ThirdIntroPage from "./pages/intro/third/ThirdIntroPage";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import UploadPage from "./pages/uploadImage/UploadPage";
import ImageDetails from "./pages/imageDetails/imageDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstIntroPage />} />
        <Route path="/secondIntro" element={<SecondIntroPage />} />
        <Route path="/thirdIntro" element={<ThirdIntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/details/:id" element={<ImageDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
