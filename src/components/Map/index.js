import React from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useFetch from "../../hooks/useFetch";

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

const Map = () => {
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);
  const marker = React.useRef(null);

  const [mapConfig, setMapConfig] = React.useState({
    lng: -70,
    lat: 42,
    zoom: 9,
  });
  const [location, setLocation] = React.useState({
    loading: false,
    error: null,
    location: null,
  });

  const [apiResponse, refetch] = useFetch();

  const clickHandler = (e) => {
    let { lng, lat } = e.lngLat;
    lng = lng.toFixed(4);
    lat = lat.toFixed(4);

    refetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng}, ${lat}.json?access_token=${accessToken}`,
      "GET",
      {}
    );

    setMapConfig({
      lng: lng,
      lat: lat,
      zoom: 13,
    });

    map.current.flyTo({
      center: [lng, lat],
      zoom: 13,
      speed: 0.5,
    });

    marker.current.setLngLat([lng, lat]).addTo(map.current);
  };

  React.useEffect(() => {
    if (!map.current && !marker.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [mapConfig.lng, mapConfig.lat],
        zoom: mapConfig.zoom,
      });

      marker.current = new mapboxgl.Marker();

      map.current.on("click", clickHandler);

      map.current.on("move", () => {
        setMapConfig({
          lng: map.current.getCenter().lng.toFixed(4),
          lat: map.current.getCenter().lat.toFixed(4),
          zoom: map.current.getZoom().toFixed(2),
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (apiResponse.status === "loading") {
      setLocation({
        loading: true,
        error: null,
        data: null,
      });

      return;
    }

    if (apiResponse.status === "error") {
      setLocation({
        loading: false,
        error: apiResponse.error,
        data: null,
      });

      return;
    }

    if (apiResponse.status === "success") {
      setLocation({
        loading: false,
        error: null,
        location: apiResponse.data.features[0].place_name,
      });

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiResponse.status]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: "500px" }}></div>
      <div>
        {location.loading
          ? "Loading..."
          : location.error
          ? `Error: ${location.error}`
          : `Location: ${JSON.stringify(location.location)}`}
      </div>
    </div>
  );
};

export default Map;
