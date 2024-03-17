import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
import Apple from "./components/Apple";
import Nav from "./components/Nav";
import Footer from "./components/footer";
import Adminpage from "./components/Adminpage";
import PictureSlider from "./components/PictureSlider";
import Login from "./components/Login";

const CombinedContent = () => {
  return (
    <div>
      <PictureSlider />
      <Apple />
    </div>
  );
};

function App() {
  return (
    <div className="container mx-auto">
      <Nav />
      <Routes>
        <Route path="/" element={<CombinedContent />} />
        <Route path="Login" element={<Login />}></Route>
        <Route path="Adminpage" element={<Adminpage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
