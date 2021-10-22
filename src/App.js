import { useEffect, useState } from "react";
import PlacesTypeahead from "./Components/PlacesTypeahead";
import "./App.css";
import searchIcon from "./assets/images/location-pinpoint.svg";
import logo from "./mlh-prep.png";
import PopUp from "./Components/Popup";
import Graph from "./Components/Graph/Graph";
import ColorSkycons, { ColorSkyconsType } from "react-color-skycons";
import Rain from "./assets/rain.mp4";
import Default from "./assets/fog.mp4";
import Clear from "./assets/clear.mp4";
import Clouds from "./assets/clouds.mp4";
import Snow from "./assets/snow.mp4";
import Thunderstorm from "./assets/thunderstorm.mp4";
require("dotenv").config();

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [searchCity, setSearchCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [searchHistory, setSearchHistory] = useState(["New York, US"]);
  const [popUp, setPopUp] = useState(false);

  const [coordinates, setCoordinates] = useState(null);
  const [onecallResults, setOnecallResults] = useState(null);
  const [isOnecallLoaded, setIsOnecallLoaded] = useState(false);

  // fetch localSearchHistory if it exists
  if (localStorage.getItem("localSearchHistory")) {
    var local_search_history = localStorage.getItem("localSearchHistory");
    if (local_search_history !== JSON.stringify(searchHistory)) {
      local_search_history = JSON.parse(local_search_history);
      setSearchHistory(local_search_history);
    }
  }

  useEffect(() => {
    const url = "https://extreme-ip-lookup.com/json/";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setIsLoaded(true);
        setCity(json.city);
        setCoordinates({ lat: json.lat, lon: json.lon });
      } catch (error) {
        setIsLoaded(true);
        setError(error);
        setPopUp(true);
      }
    };

    fetchData();
  }, []);
  const [weather, setWeather] = useState([]);

  const mapWeatherConditionToAPI = {
    Clear: [Clear, ColorSkyconsType.CLEAR_DAY],
    Clouds: [Clouds, ColorSkyconsType.CLOUDY],
    Rain: [Rain, ColorSkyconsType.RAIN],
    Haze: [Default, ColorSkyconsType.FOG],
    Drizzle: [Rain, ColorSkyconsType.HAIL],
    Snow: [Snow, ColorSkyconsType.SNOW],
    Thunderstorm: [Thunderstorm, ColorSkyconsType.THUNDER_RAIN],
  };

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
              localStorage.setItem("localSearchHistory", search_history);
            }
            mapWeatherConditionToAPI[result.weather[0].main] === undefined
              ? setWeather(Default)
              : setWeather(mapWeatherConditionToAPI[result.weather[0].main]);
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

  useEffect(() => {
    if (coordinates) {
      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          coordinates.lat +
          "&lon=" +
          coordinates.lon +
          "&exclude=minutely,daily&units=metric&appid=" +
          process.env.REACT_APP_APIKEY
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
        <div>
          <video
            autoPlay
            muted
            loop
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              left: 0,
              top: 0,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity, 2s ease-in-out",
              zIndex: "-1",
              objectFit: "cover",
            }}
            src={weather[0]}
          />
          <h2 className="head-h">Enter a city below 👇</h2>

          <input
            type="text"
            value={searchCity}
            onChange={(event) => setSearchCity(event.target.value)}
            onKeyPress={searchOnEnter}
          />
          <button className="search-btn" onClick={getWeather}>
            <img className="search-logo" alt="Search" src={searchIcon} />
          </button>

          <div id="city-typeahead-container">
            <PlacesTypeahead
              apiKey={process.env.REACT_APP_API_NINJAS_API_KEY}
              onChange={(selected) =>
                selected && selected.length > 0 && setCity(selected)
              }
              onKeyDown={(event) =>
                event.key === "Enter" && setCity(event.target.value)
              }
            />
            <button
              type="submit"
              className={showGraph ? "toggle-graph active" : "toggle-graph"}
              onClick={() => setShowGraph((state) => !state)}
            >
              Visualize
            </button>
          </div>
          <div className="Result_card">
            <div className="Results Glass">
              {!isLoaded && <h2>Loading...</h2>}
              {isLoaded && results && (
                <>
                  <ColorSkycons
                    type={weather[1]}
                    animate={true}
                    size={64}
                    resizeClear={true}
                    style={{ paddingTop: "10px" }}
                  />
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

            {/* Audio Div */}
            {isLoaded && results && (
              <div className="audio-div">
                <>
                  <h2>Tip!</h2>
                  {results.weather[0].main === "Clear" && (
                    <>
                      <audio
                        src="audio/clear.mp3"
                        loop
                        autoPlay
                        controls
                      ></audio>
                    </>
                  )}
                  {results.weather[0].main === "Clouds" && (
                    <>
                      <audio
                        src="audio/clouds.mp3"
                        loop
                        autoPlay
                        controls
                      ></audio>
                    </>
                  )}
                  {results.weather[0].main === "Rain" && (
                    <>
                      <audio
                        src="audio/rain.mp3"
                        loop
                        autoPlay
                        controls
                      ></audio>
                    </>
                  )}
                  {results.weather[0].main === "Haze" && (
                    <>
                      <audio src="audio/fog.mp3" loop autoPlay controls></audio>
                    </>
                  )}
                  {results.weather[0].main === "Snow" && (
                    <>
                      <audio
                        src="audio/snow.mp3"
                        loop
                        autoPlay
                        controls
                      ></audio>
                    </>
                  )}
                  {results.weather[0].main === "Thunderstorm" && (
                    <>
                      <audio
                        src="audio/thunderstorm.mp3"
                        loop
                        autoPlay
                        controls
                      ></audio>
                    </>
                  )}
                </>
              </div>
            )}

            <h3 style={{ paddingTop: "2rem" }}>Hourly forcast</h3>

            {!isOnecallLoaded && <h2>Loading...</h2>}
            {isOnecallLoaded && onecallResults && (
              <>
                <div className="container">
                  <div className="row">
                    {onecallResults.map((object, i) => (
                      <div className="card Glass" key={i}>
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
        </div>
        {showGraph ? <Graph /> : null}
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
                    src="tip_img/umbrella.png"
                    alt="Umbrella"
                    className="tip-img"
                  />
                </h3>
              )}
              {results.weather[0].main === "Snow" && (
                <h3>
                  Bring your coat, it might get chilly!
                  <img src="tip_img/coat.png" alt="Coat" className="tip-img" />
                </h3>
              )}
              {results.weather[0].main === "Clear" && (
                <h3>
                  Bring your suncream, so that tan is good!{" "}
                  <img
                    src="tip_img/suncream.png"
                    alt="Sun Cream"
                    className="tip-img"
                  />
                </h3>
              )}
              {results.wind.speed >= 2.0 && (
                <h3>
                  Bring your wind-cheater, lest you want wind bites!
                  <img
                    src="tip_img/jacket.png"
                    alt="Jacket"
                    className="tip-img"
                  />
                </h3>
              )}
            </>
          </div>
        )}
      </>
    );
  }
}

export default App;
