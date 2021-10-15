import React, { useState, createContext } from "react";

export const CityContext = createContext();

const CityContextProvider = (props) => {
  const [city, setCity] = useState({
    name: "",
    latitude: "",
    longitude: "",
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
