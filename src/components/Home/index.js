import React, { useContext, useEffect, useState } from "react";
import PlacesTypeahead from "../PlacesTypeahead";
import Map from "../Map";
import { CityContext } from "../../context/CityProvider";
import Graph from "../../Components/Graph/Graph";
import logo from "../../mlh-prep.png";
import "../../App.css";

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Home = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { city, setCityData } = useContext(CityContext);
  const [results, setResults] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [searchHistory, setSearchHistory] = useState(["New York, US"]);
  const [popUp, setPopUp] = useState(false);

  // fetch localSearchHistory if it exists
  if (localStorage.getItem("localSearchHistory")) {
    var local_search_history = localStorage.getItem("localSearchHistory");
    if (local_search_history !== JSON.stringify(searchHistory)) {
      local_search_history = JSON.parse(local_search_history);
      setSearchHistory(local_search_history);
    }
  }

  // useEffect(() => {
  //   const url = "https://extreme-ip-lookup.com/json/";

  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       setIsLoaded(true);
  //       setCityData({ ...city, name: json.city });
  //     } catch (error) {
  //       setIsLoaded(true);
  //       setError(error);
  //       setPopUp(true);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
              localStorage.setItem("localSearchHistory", search_history);
            }
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city, searchHistory]);

  const fetchLatLong = (name) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=${accessToken}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setCityData({
            name: name,
            longitude: result.features[0].center[0],
            latitude: result.features[0].center[1],
          });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div>
          <h2>Enter a city below 👇</h2>
          <div id="city-typeahead-container">
            <PlacesTypeahead
              apiKey={process.env.REACT_APP_API_NINJAS_API_KEY}
              onChange={(selected) =>
                selected &&
                selected.length > 0 &&
                setCityData({ name: selected })
              }
              onKeyDown={(event) =>
                event.key === "Enter" && fetchLatLong(event.target.value)
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
            <div className="Results">
              {!isLoaded && <h2>Loading...</h2>}
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
                  <img src="umbrella.png" alt="Umbrella" className="tip-img" />
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
                  <img src="suncream.png" alt="Sun Cream" className="tip-img" />
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
        <Map />
      </>
    );
  }
};

export default Home;
