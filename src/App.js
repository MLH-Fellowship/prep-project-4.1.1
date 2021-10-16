import { useEffect, useState } from "react";

import "./App.css";
import logo from "./mlh-prep.png";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New Delhi");
  const [results, setResults] = useState(null);

  const [coordinates, setCoordinates] = useState(null);
  const [onecallResults, setOnecallResults] = useState(null);
  const [isOnecallLoaded, setIsOnecallLoaded] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=30b7dfcb3194c180dc62dd9b21e0c132"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);

            setCoordinates(result.coord);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city]);

  useEffect(() => {
    if (coordinates) {
      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          coordinates.lat +
          "&lon=" +
          coordinates.lon +
          "&exclude=minutely,daily&units=metric&appid=30b7dfcb3194c180dc62dd9b21e0c132"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setOnecallResults(result.hourly);            
            setIsOnecallLoaded(true);
          },
          (error) => {
            setError(error);
            setIsOnecallLoaded(true);
          }
        );
    }
  }, [coordinates]);

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
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <div className="Results">
            {!isLoaded && <h2>Loading...</h2>}
            {isLoaded && results && (
              <>
                <img
                  src={
                    "https://openweathermap.org/img/wn/" +
                    results.weather[0].icon +
                    "@2x.png"
                  }
                  alt={results.weather[0].description}
                ></img>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i>
                  <p>
                    {results.name}, {results.sys.country}
                  </p>
                </i>
              </>
            )}

            <h3>Hourly forcast</h3>

            {!isOnecallLoaded && <h2>Loading...</h2>}
            {isOnecallLoaded && onecallResults && (
              <>
                <div className="container">
                  <div className="row">
                    {onecallResults.map((object, i) => (
                      <div className="card" key={i}>
                        <img
                          src={
                            "https://openweathermap.org/img/wn/" +
                            object.weather[0].icon +
                            "@2x.png"
                          }
                          alt={object.weather[0].description}
                        ></img>

                        <h3>{object.weather[0].main}</h3>
                        <p>Feels like {object.feels_like}°C</p>
                        <p>At {object.dt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
