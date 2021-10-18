import React from "react";
import Home from "./components/Home";
import CityContextProvider from "./context/CityProvider";
import "./App.css";

function App() {
  return (
    <CityContextProvider>
      <Home />
    </CityContextProvider>
  );
}

export default App;
