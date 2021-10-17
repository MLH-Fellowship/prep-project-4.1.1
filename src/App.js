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
                        <p>At {new Date(object.dt * 1000).toString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tip Div */}
          {isLoaded && results && (
            <div className="tip-div">
              <>
                <h2>Tip!</h2>
                {(results.weather[0].main === "Rain" ||
                  results.weather[0].main === "Clouds") && (
                  <h3>
                    Bring an Umbrella, it might get wet!
                    <img
                      src="umbrella.png"
                      alt="Umbrella"
                      className="tip-img"
                    />
                  </h3>
                )}
                {results.weather[0].main === "Snow" && (
                  <h3>
                    Bring your coat, it might get chilly!
                    <img src="coat.png" alt="Coat" className="tip-img" />
                  </h3>
                )}
                {results.weather[0].main === "Clear" && (
                  <h3>
                    Bring your suncream, so that tan is good!{" "}
                    <img
                      src="suncream.png"
                      alt="Sun Cream"
                      className="tip-img"
                    />
                  </h3>
                )}
                {results.wind.speed >= 2.0 && (
                  <h3>
                    Bring your wind-cheater, lest you want wind bites!
                    <img src="jacket.png" alt="Jacket" className="tip-img" />
                  </h3>
                )}
              </>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default App;
