import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstIntroPage from "./pages/intro/first/FirstIntroPage";
import SecondIntroPage from "./pages/intro/second/SecondIntroPage";
import ThirdIntroPage from "./pages/intro/third/ThirdIntroPage";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstIntroPage />} />
        <Route path="/secondIntro" element={<SecondIntroPage />} />
        <Route path="/thirdIntro" element={<ThirdIntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
