import React, { useState, createContext } from "react";

export const CityContext = createContext();

const CityContextProvider = (props) => {
  const [city, setCity] = useState({
    name: "New York City",
    latitude: 40.7128,
    longitude: -74.006,
  });

  const setCityData = (data) => {
    setCity({ ...city, ...data });
  };

  return (
    <CityContext.Provider
      value={{
        city,
        setCityData,
      }}
    >
      {props.children}
    </CityContext.Provider>
  );
};

export default CityContextProvider;
