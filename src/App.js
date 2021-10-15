import { useEffect, useState, useContext } from "react";
import CityContextProvider, { CityContext } from "./context/CityProvider";
import logo from "./mlh-prep.png";
import "./App.css";

function App() {
  // const { setCityData } = useContext(CityContext);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [results, setResults] = useState(null);

  useEffect(() => {
    // setCityData({
    //   name: city,
    // });
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric" +
        "&appid=" +
        process.env.REACT_APP_APIKEY
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <CityContextProvider>
          <img className="logo" src={logo} alt="MLH Prep Logo"></img>
          <div>
            <h2>Enter a city below 👇</h2>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            <div className="Results">
              {!isLoaded && <h2>Loading...</h2>}
              {console.log(results)}
              {isLoaded && results && (
                <>
                  <h3>{results.weather[0].main}</h3>
                  <p>Feels like {results.main.feels_like}°C</p>
                  <i>
                    <p>
                      {results.name}, {results.sys.country}
                    </p>
                  </i>
                </>
              )}
            </div>
          </div>
        </CityContextProvider>
      </>
    );
  }
}

export default App;
