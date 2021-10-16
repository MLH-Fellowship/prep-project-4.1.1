import { useEffect, useState } from "react";
import "./App.css";
import searchIcon from "./assets/images/location-pinpoint.svg";
import logo from "./mlh-prep.png";
require("dotenv").config();

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [searchCity, setSearchCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState(["New York, US"]);

  // fetch localSearchHistory if it exists
  if (localStorage.getItem('localSearchHistory')) {
    var local_search_history = localStorage.getItem('localSearchHistory');
    if (local_search_history !== JSON.stringify(searchHistory)) {
      local_search_history = JSON.parse(local_search_history);
      setSearchHistory(local_search_history);
    }
  }

  useEffect(() => {
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

            const location = `${result.name}, ${result.sys.country}`;

            // Checking if the city is the most recent search
            if (location !== searchHistory[0]) {
              // making a deep copy of searchHistory
              var search_history = JSON.parse(JSON.stringify(searchHistory));

              if (search_history.length < 5) {
                search_history.unshift(location);
              } else {
                search_history.pop();
                search_history.unshift(location);
              }
              setSearchHistory(search_history);
              search_history = JSON.stringify(search_history);
              localStorage.setItem('localSearchHistory',search_history);
            }
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city, searchHistory]);

  const getWeather = () => setCity(searchCity);

  const searchOnEnter = (event) => {
    if (event.key === "Enter") getWeather();
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div>
          <h2>Enter a city below 👇</h2>
          <input
            type="text"
            value={searchCity}
            onChange={(event) => setSearchCity(event.target.value)}
            onKeyPress={searchOnEnter}
          />
          <button className="search-btn" onClick={getWeather}>
            <img className="search-logo" alt="Search" src={searchIcon} />
          </button>
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
      </>
    );
  }
}

export default App;
